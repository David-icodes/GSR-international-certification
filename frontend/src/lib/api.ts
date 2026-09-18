import type { Certification, Inquiry, Organization, Settings, AdminUser, ActivityLog, LoginResponse } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
export const ASSET_URL = API_URL.replace(/\/api(\/v1)?\/?$/, "");

if (typeof window !== "undefined") {
  console.log("[API] Current API base URL:", API_URL);
  console.log("[API] Login endpoint:", `${API_URL}/auth/login`);
  console.log("[API] Users endpoint:", `${API_URL}/users`);
  console.log("[API] Inquiries endpoint:", `${API_URL}/inquiries`);
}

const REQUEST_TIMEOUT = 60_000;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2_000;
const SLOW_THRESHOLD = 10_000;
const CACHE_TTL = 5 * 60 * 1000;

export let isColdStarting = false;
export let lastResponseTime = 0;
export let isBackendWaking = false;

const cache = new Map<string, { data: unknown; ts: number }>();

export function clearDashboardCache() {
  cache.delete("/dashboard");
  cache.delete("/certifications");
  cache.delete("/organizations");
  cache.delete("/users");
  cache.delete("/inquiries");
  cache.delete("/settings");
}

function cacheGet<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { cache.delete(key); return null; }
  return entry.data as T;
}

function cacheSet(key: string, data: unknown) {
  cache.set(key, { data, ts: Date.now() });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function debugLog(level: string, ...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    if (level === "error") console.error("[API]", ...args);
    else console.log("[API]", ...args);
  }
}

function logResponseTime(method: string, url: string, elapsed: number, attempt: number) {
  const label = elapsed > SLOW_THRESHOLD ? "SLOW" : "OK";
  const msg = `[${label}] ${method} ${url} - ${elapsed}ms (attempt ${attempt})`;
  console.log("[API]", msg);
  lastResponseTime = elapsed;
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshTokenIfNeeded(): Promise<boolean> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  const token = localStorage.getItem("adminToken");
  const refreshTk = localStorage.getItem("adminRefreshToken");
  if (!token || !refreshTk) return false;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refreshTk }),
        cache: "no-store"
      });

      if (!response.ok) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRefreshToken");
        localStorage.removeItem("adminUser");
        return false;
      }

      const data: LoginResponse = await response.json();
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminRefreshToken", data.refreshToken);
      localStorage.setItem("adminUser", JSON.stringify(data.admin));
      return true;
    } catch {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminRefreshToken");
      localStorage.removeItem("adminUser");
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function redirectToLogin(message?: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminRefreshToken");
  localStorage.removeItem("adminUser");
  localStorage.setItem("sessionMessage", message || "Your session has expired. Please login again.");
  window.location.href = "/admin/login";
}

async function executeRequest<T>(path: string, options: RequestInit, attempt: number): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  const url = `${API_URL}${path}`;
  const hasBody = options.body && !(options.body instanceof FormData);
  const reqHeaders: Record<string, string> = {
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
    ...(options.headers as Record<string, string>)
  };

  debugLog("info", `[attempt ${attempt}] ${options.method || "GET"} ${url}`);

  try {
    const response = await fetch(url, {
      ...options,
      headers: reqHeaders,
      cache: "no-store",
      signal: controller.signal
    });

    if (response.status === 401 && !path.startsWith("/auth/")) {
      const body = await response.json().catch(() => ({}));
      if (body.code === "TOKEN_EXPIRED") {
        const refreshed = await refreshTokenIfNeeded();
        if (refreshed) {
          const newToken = localStorage.getItem("adminToken");
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...reqHeaders,
              Authorization: `Bearer ${newToken}`
            },
            cache: "no-store",
            signal: controller.signal
          });
          clearTimeout(timeout);
          if (!retryResponse.ok) {
            if (retryResponse.status === 401) {
              redirectToLogin();
              throw new Error("Session expired. Redirecting to login...");
            }
            return handleError(retryResponse);
          }
          return retryResponse.json();
        }
        redirectToLogin();
        throw new Error("Session expired. Redirecting to login...");
      }
      redirectToLogin(body.message);
      throw new Error("Session expired. Redirecting to login...");
    }

    if (!response.ok) return handleError(response);
    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isGet = !options.method || options.method === "GET";
  const maxAttempts = isGet ? MAX_RETRIES + 1 : 1;

  const cached = isGet ? cacheGet<T>(path) : null;
  if (cached) return cached;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const startTime = Date.now();
    const url = `${API_URL}${path}`;

    try {
      const result = await executeRequest<T>(path, options, attempt);
      const elapsed = Date.now() - startTime;

      logResponseTime(options.method || "GET", path, elapsed, attempt);

      if (isGet) cacheSet(path, result);

      if (elapsed > SLOW_THRESHOLD && isGet) {
        isColdStarting = true;
        isBackendWaking = true;
      } else if (isColdStarting && attempt > 1) {
        isColdStarting = false;
        isBackendWaking = false;
      }

      return result;
    } catch (err) {
      const elapsed = Date.now() - startTime;

      const isTimeoutOrNetwork =
        (err instanceof DOMException && err.name === "AbortError") ||
        (err instanceof TypeError && err.message === "Failed to fetch");

      if (attempt === 1 && isTimeoutOrNetwork && isGet) {
        isColdStarting = true;
        isBackendWaking = true;
        console.warn("[API] Backend waking (cold start detected), retrying...");
      }

      if (attempt < maxAttempts && isTimeoutOrNetwork && isGet) {
        logResponseTime(options.method || "GET", path, elapsed, attempt);
        console.log("[API] Retrying in 2s...");
        await sleep(RETRY_DELAY);
        continue;
      }

      if (err instanceof DOMException && err.name === "AbortError") {
        if (isColdStarting) {
          throw new Error(
            "Backend server is waking up. This may take up to 60 seconds."
          );
        }
        throw new Error(`Request timed out (${REQUEST_TIMEOUT / 1000}s) - Backend not responding at ${url}`);
      }

      if (err instanceof TypeError && err.message === "Failed to fetch") {
        const hint = url.includes("localhost")
          ? "Make sure the backend is running on port 5000."
          : "Check that the backend service is running.";
        throw new Error("Backend Offline - Cannot reach the API server at " + url + ". " + hint);
      }

      throw err;
    }
  }

  throw new Error("Unexpected error - all retries exhausted");
}

async function handleError(response: Response): Promise<never> {
  let errorBody: { message?: string; errors?: Array<{ field: string; message: string }> } = {};
  try { errorBody = await response.json(); } catch { /* ignore */ }
  debugLog("error", `${response.status}`, errorBody.message || "");

  const statusLabels: Record<number, string> = {
    401: "401 Unauthorized",
    403: "403 Forbidden",
    404: "404 Not Found",
    429: "429 Too Many Requests",
    500: "500 Internal Server Error"
  };
  const prefix = statusLabels[response.status] || `Error ${response.status}`;
  let detail = errorBody.message || response.statusText;
  if (response.status === 422 && errorBody.errors?.length) {
    detail += `: ${errorBody.errors.map((e) => `${e.field} ${e.message}`).join(", ")}`;
  }
  throw new Error(`${prefix}: ${detail}`);
}

export function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const publicApi = {
  settings: () => request<Settings>("/settings"),
  certifications: () => request<Certification[]>("/certifications?public=true"),
  verifyCertificate: (certificateId: string) => request<Certification>(`/certifications/verify/${encodeURIComponent(certificateId)}`),
  organizations: () => request<Organization[]>("/organizations?public=true"),
  submitInquiry: (payload: Record<string, unknown>) =>
    request<{ message: string }>("/inquiries", { method: "POST", body: JSON.stringify(payload) })
};

export const adminApi = {
  login: (payload: { username?: string; email?: string; password: string; rememberMe?: boolean }) =>
    request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),

  logout: () =>
    request<{ message: string }>("/auth/logout", { method: "POST", headers: authHeaders() }),

  refreshToken: () =>
    refreshTokenIfNeeded(),

  dashboard: async () => {
    try {
      return await request<{
        totalCertifications: number;
        totalOrganizations: number;
        totalInquiries: number;
        totalUsers: number;
        activeCertifications: number;
        expiredCertifications: number;
        suspendedCertifications: number;
        activeOrganizations: number;
        recentActivity: Array<{ type: string; title: string; status: string; createdAt: string }>;
        securityWidgets: {
          totalLogs: number;
          loginCount: number;
          failedLogins: number;
          recentLogins: Array<{ adminName: string; createdAt: string; ipAddress: string; browser: string; device: string }>;
        };
        recentActivities: Array<{ adminName: string; action: string; module: string; description: string; createdAt: string; targetName: string }>;
      }>("/dashboard", { headers: authHeaders() });
    } catch {
      const [certs, orgs, inqs, users] = await Promise.all([
        adminApi.certifications(),
        adminApi.organizations(),
        adminApi.inquiries(),
        adminApi.users()
      ]);
      return {
        totalCertifications: certs.length,
        totalOrganizations: orgs.length,
        totalInquiries: inqs.length,
        totalUsers: users.length,
        activeCertifications: certs.filter((c) => c.status === "Active").length,
        expiredCertifications: certs.filter((c) => c.certificateState === "Expired").length,
        suspendedCertifications: certs.filter((c) => c.certificateState === "Suspended").length,
        activeOrganizations: orgs.filter((o) => o.status === "Certified").length,
        recentActivity: [
          ...certs.slice(0, 5).map((item) => ({ type: "Certification", title: item.name, status: item.status, createdAt: item.createdAt })),
          ...orgs.slice(0, 5).map((item) => ({ type: "Organization", title: item.title, status: item.status, createdAt: item.createdAt })),
          ...inqs.slice(0, 5).map((item) => ({ type: "Inquiry", title: `${item.name} - ${item.source}`, status: item.status, createdAt: item.createdAt }))
        ].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 8),
        securityWidgets: { totalLogs: 0, loginCount: 0, failedLogins: 0, recentLogins: [] },
        recentActivities: []
      };
    }
  },

  certifications: (includeDeleted?: boolean) =>
    request<Certification[]>(`/certifications${includeDeleted ? "?includeDeleted=true" : ""}`, { headers: authHeaders() }),
  saveCertification: (payload: Partial<Certification>, id?: string) =>
    request<Certification>(id ? `/certifications/${id}` : "/certifications", {
      method: id ? "PUT" : "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload)
    }),
  deleteCertification: (id: string) =>
    request<{ message: string }>(`/certifications/${id}`, { method: "DELETE", headers: authHeaders() }),
  restoreCertification: (id: string) =>
    request<{ message: string }>(`/certifications/${id}/restore`, { method: "PATCH", headers: authHeaders() }),

  organizations: (includeDeleted?: boolean) =>
    request<Organization[]>(`/organizations${includeDeleted ? "?includeDeleted=true" : ""}`, { headers: authHeaders() }),
  saveOrganization: (payload: FormData, id?: string) =>
    request<Organization>(id ? `/organizations/${id}` : "/organizations", {
      method: id ? "PUT" : "POST",
      headers: authHeaders(),
      body: payload
    }),
  deleteOrganization: (id: string) =>
    request<{ message: string }>(`/organizations/${id}`, { method: "DELETE", headers: authHeaders() }),
  restoreOrganization: (id: string) =>
    request<{ message: string }>(`/organizations/${id}/restore`, { method: "PATCH", headers: authHeaders() }),

  inquiries: (includeDeleted?: boolean) =>
    request<Inquiry[]>(`/inquiries${includeDeleted ? "?includeDeleted=true" : ""}`, { headers: authHeaders() }),
  updateInquiryStatus: (id: string, status: Inquiry["status"]) =>
    request<Inquiry>(`/inquiries/${id}/status`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ status })
    }),
  deleteInquiry: (id: string) =>
    request<{ message: string }>(`/inquiries/${id}`, { method: "DELETE", headers: authHeaders() }),
  restoreInquiry: (id: string) =>
    request<{ message: string }>(`/inquiries/${id}/restore`, { method: "PATCH", headers: authHeaders() }),

  settings: () => request<Settings>("/settings", { headers: authHeaders() }),
  saveSettings: (payload: Settings) =>
    request<Settings>("/settings", {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(payload)
    }),

  users: (includeDeleted?: boolean) =>
    request<AdminUser[]>(`/users${includeDeleted ? "?includeDeleted=true" : ""}`, { headers: authHeaders() }),
  getUser: (id: string) =>
    request<AdminUser>(`/users/${id}`, { headers: authHeaders() }),
  saveUser: (payload: Partial<AdminUser> & { password?: string }, id?: string) =>
    request<AdminUser>(id ? `/users/${id}` : "/users", {
      method: id ? "PUT" : "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload)
    }),
  deleteUser: (id: string) =>
    request<{ message: string }>(`/users/${id}`, { method: "DELETE", headers: authHeaders() }),
  restoreUser: (id: string) =>
    request<{ message: string }>(`/users/${id}/restore`, { method: "PATCH", headers: authHeaders() }),

  activityLogs: (params?: {
    search?: string;
    action?: string;
    module?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    sort?: "asc" | "desc";
  }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.action) query.set("action", params.action);
    if (params?.module) query.set("module", params.module);
    if (params?.startDate) query.set("startDate", params.startDate);
    if (params?.endDate) query.set("endDate", params.endDate);
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.sort) query.set("sort", params.sort);
    const qs = query.toString();
    return request<{ logs: ActivityLog[]; pagination: { total: number; page: number; limit: number; pages: number } }>(
      `/activity${qs ? `?${qs}` : ""}`,
      { headers: authHeaders() }
    );
  },

  exportActivityCsv: async () => {
    const response = await fetch(`${API_URL}/activity/export/csv`, {
      headers: authHeaders()
    });
    if (!response.ok) throw new Error("Export failed");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "activity-logs.csv";
    link.click();
    URL.revokeObjectURL(url);
  },

  deleteActivityLog: (id: string) =>
    request<{ message: string }>(`/activity/${id}`, { method: "DELETE", headers: authHeaders() })
};

export function asset(path?: string) {
  if (!path) return "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80";
  if (path.startsWith("http")) return path;
  return `${ASSET_URL}${path}`;
}
