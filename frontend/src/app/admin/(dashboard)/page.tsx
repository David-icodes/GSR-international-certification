"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Award,
  Building2,
  Clock,
  DollarSign,
  Inbox,
  RefreshCw,
  ShieldCheck,
  Users
} from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCard";
import { BackendWakingBanner } from "@/components/admin/BackendWakingBanner";
import { adminApi, isColdStarting, clearDashboardCache } from "@/lib/api";

type Dashboard = Awaited<ReturnType<typeof adminApi.dashboard>>;

function MetricSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-6 w-6 rounded bg-gray-200" />
      <div className="mt-4 h-8 w-16 rounded bg-gray-200" />
      <div className="mt-1 h-3 w-24 rounded bg-gray-200" />
    </div>
  );
}

function RecentActivitySkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-14 rounded bg-gray-100" />
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentRole, setCurrentRole] = useState<string>("");
  const [adminName, setAdminName] = useState("");
  const [waking, setWaking] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const startRef = useRef(Date.now());
  const mountedRef = useRef(true);

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setCurrentRole(u.role);
        setAdminName(u.name || "Admin");
      } catch { /* ignore */ }
    }
    return () => { mountedRef.current = false; };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setWaking(false);
    setRetryCount(0);

    try {
      const result = await adminApi.dashboard();
      if (!mountedRef.current) return;
      setData(result);
    } catch (err) {
      if (!mountedRef.current) return;
      const msg = err instanceof Error ? err.message : "";

      if (msg.includes("Backend") || (isColdStarting && Date.now() - startRef.current < 90000)) {
        setWaking(true);
        setError("");
        setRetryCount((c) => c + 1);
        setTimeout(() => { if (mountedRef.current) load(); }, 10000);
        return;
      }
      setError(msg || "Dashboard data could not be loaded.");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const isAdmin = currentRole === "ADMIN";

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-copper">
            {today}
          </p>
          <h1 className="font-display text-3xl font-bold text-[#071b3f]">
            Welcome back, {adminName}
          </h1>
        </div>
        {retryCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <RefreshCw size={14} className="animate-spin" />
            Retrying connection... (attempt {retryCount})
          </div>
        )}
      </div>

      {waking && <BackendWakingBanner />}

      {error && !waking ? (
        <AdminCard>
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <AlertTriangle className="h-10 w-10 text-red-400" />
            <p className="text-red-600 font-semibold">{error}</p>
            <button onClick={load} className="inline-flex items-center gap-2 rounded-lg bg-copper px-5 py-2.5 text-sm font-bold text-white hover:bg-copper/90">
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        </AdminCard>
      ) : loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <AdminCard key={i}><MetricSkeleton /></AdminCard>
          ))}
        </div>
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <AdminCard>
              <Award className="text-copper" />
              <div className="mt-4 text-3xl font-bold">{data.totalCertifications}</div>
              <div className="mt-0.5 text-sm text-graphite/60">Total Certificates</div>
              <div className="text-xs text-graphite/40">{data.activeCertifications} Active</div>
            </AdminCard>
            <AdminCard>
              <Building2 className="text-blue-600" />
              <div className="mt-4 text-3xl font-bold">{data.totalOrganizations}</div>
              <div className="mt-0.5 text-sm text-graphite/60">Total Organizations</div>
              <div className="text-xs text-graphite/40">{data.activeOrganizations} Certified</div>
            </AdminCard>
            <AdminCard>
              <Inbox className="text-moss" />
              <div className="mt-4 text-3xl font-bold">{data.totalInquiries}</div>
              <div className="mt-0.5 text-sm text-graphite/60">Total Inquiries</div>
              <div className="text-xs text-graphite/40">All submissions</div>
            </AdminCard>
            <AdminCard>
              <Users className="text-purple-600" />
              <div className="mt-4 text-3xl font-bold">{data.totalUsers}</div>
              <div className="mt-0.5 text-sm text-graphite/60">Admin Users</div>
              <div className="text-xs text-graphite/40">Registered</div>
            </AdminCard>
            <AdminCard>
              <DollarSign className="text-green-600" />
              <div className="mt-4 text-3xl font-bold">&mdash;</div>
              <div className="mt-0.5 text-sm text-graphite/60">Total Revenue</div>
              <div className="text-xs text-graphite/40">Coming soon</div>
            </AdminCard>
          </div>

          {/* Certificate States */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <AdminCard>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-600" />
                <span className="text-sm font-semibold text-graphite/70">Active Certificates</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-green-600">{data.activeCertifications}</div>
            </AdminCard>
            <AdminCard>
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-500" />
                <span className="text-sm font-semibold text-graphite/70">Expired</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-red-600">{data.expiredCertifications}</div>
            </AdminCard>
            <AdminCard>
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-orange-500" />
                <span className="text-sm font-semibold text-graphite/70">Suspended</span>
              </div>
              <div className="mt-3 text-3xl font-bold text-orange-600">{data.suspendedCertifications}</div>
            </AdminCard>
          </div>

          {/* Security Widgets (Admin only) */}
          {isAdmin && data.securityWidgets && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <AdminCard>
                <div className="text-3xl font-bold">{data.securityWidgets.loginCount}</div>
                <div className="mt-0.5 text-sm text-graphite/60">Total Logins</div>
              </AdminCard>
              <AdminCard>
                <div className="text-3xl font-bold text-red-600">{data.securityWidgets.failedLogins}</div>
                <div className="mt-0.5 text-sm text-graphite/60">Failed Logins</div>
              </AdminCard>
              <AdminCard>
                <div className="text-3xl font-bold">{data.securityWidgets.totalLogs}</div>
                <div className="mt-0.5 text-sm text-graphite/60">Activity Logs</div>
              </AdminCard>
              <AdminCard>
                <div className="text-3xl font-bold">{data.totalUsers}</div>
                <div className="mt-0.5 text-sm text-graphite/60">Active Users</div>
              </AdminCard>
            </div>
          )}

          {/* Recent Activity */}
          <AdminCard className="mt-6">
            <div className="flex items-center gap-3">
              <Activity className="text-moss" />
              <h2 className="text-xl font-semibold">Recent Activity</h2>
            </div>
            <div className="mt-5 grid gap-2">
              {data.recentActivity?.length ? data.recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded bg-pearl px-4 py-3">
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-xs text-graphite/60">{item.type}</div>
                  </div>
                  <span className="text-sm font-bold text-copper">{item.status}</span>
                </div>
              )) : (
                <p className="py-6 text-center text-sm text-graphite/50">No recent activity</p>
              )}
            </div>
          </AdminCard>
        </>
      ) : null}
    </div>
  );
}
