"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import {
  Activity,
  Award,
  Building2,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Users,
  X
} from "lucide-react";
import clsx from "clsx";
import { adminApi } from "@/lib/api";

type AdminInfo = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: "ADMIN" | "USER";
};

const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["ADMIN", "USER"] },
  { href: "/admin/certifications", label: "Certifications", icon: Award, roles: ["ADMIN", "USER"] },
  { href: "/admin/organizations", label: "Certified Organizations", icon: Building2, roles: ["ADMIN", "USER"] },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox, roles: ["ADMIN", "USER"] }
];

const adminOnlyNav = [
  { href: "/admin/users", label: "Users", icon: Users, roles: ["ADMIN"] },
  { href: "/admin/activity", label: "Activity Logs", icon: Activity, roles: ["ADMIN"] },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["ADMIN"] }
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [sessionMsg, setSessionMsg] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) {
      try {
        setAdmin(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    const msg = localStorage.getItem("sessionMessage");
    if (msg) {
      setSessionMsg(msg);
      localStorage.removeItem("sessionMessage");
    }
  }, []);

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);



  // Inactivity timeout
  useEffect(() => {
    if (!admin) return;

    let timer: ReturnType<typeof setTimeout>;

    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminRefreshToken");
        localStorage.removeItem("adminUser");
        localStorage.setItem("sessionMessage", "Session expired due to inactivity. Please login again.");
        window.location.href = "/admin/login";
      }, INACTIVITY_TIMEOUT);
    }

    const events = ["mousedown", "keydown", "mousemove", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [admin]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const logout = useCallback(async () => {
    try {
      await adminApi.logout();
    } catch {
      /* ignore */
    }
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  }, []);

  const isAdmin = admin?.role === "ADMIN";

  const nav = isAdmin ? [...adminNav, ...adminOnlyNav] : adminNav;

  return (
    <div className="flex h-screen overflow-hidden bg-[#eef4fb] text-[#08172f]">
      {sessionMsg && (
        <div className="fixed left-0 right-0 top-0 z-[60] bg-amber-50 border-b border-amber-200 px-4 py-3 text-center text-sm font-semibold text-amber-800">
          {sessionMsg}
          <button onClick={() => setSessionMsg("")} className="ml-3 text-amber-600 hover:text-amber-800">&times;</button>
        </div>
      )}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "brand-surface fixed inset-y-0 left-0 z-50 flex w-60 max-w-[86vw] flex-col p-5 text-white shadow-xl transition-transform duration-200 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-white shadow-md">
              <img src="/gsr-logo.png" alt="GSR logo" className="h-12 w-12 object-contain" />
            </span>
            <span>
              <span className="block font-sans text-xl font-extrabold tracking-tight">GSR Admin</span>
              <span className="text-xs uppercase tracking-[0.2em] text-white/70">Control room</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>
        {admin && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
            <span className="text-sm font-semibold text-white">{admin.name}</span>
            <span className={clsx(
              "rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              isAdmin ? "bg-[#d6a842] text-[#071b3f]" : "bg-white/20 text-white"
            )}>
              {admin.role}
            </span>
          </div>
        )}
        <nav className="mt-4 grid flex-1 gap-1.5">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all",
                  active
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <aside className="brand-surface hidden w-60 shrink-0 flex-col p-4 text-white shadow-xl lg:flex">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-white shadow-md">
            <img src="/gsr-logo.png" alt="GSR logo" className="h-12 w-12 object-contain" />
          </span>
          <span>
            <span className="block font-sans text-lg font-extrabold tracking-tight">GSR Admin</span>
            <span className="text-xs uppercase tracking-[0.2em] text-white/70">Control room</span>
          </span>
        </Link>
        {admin && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
            <span className="text-sm font-semibold text-white">{admin.name}</span>
            <span className={clsx(
              "rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
              isAdmin ? "bg-[#d6a842] text-[#071b3f]" : "bg-white/20 text-white"
            )}>
              {admin.role}
            </span>
          </div>
        )}
        <nav className="mt-4 grid flex-1 gap-1.5">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all",
                  active
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="brand-surface shadow-md">
          <div className="flex min-h-14 items-center justify-between gap-3 px-4 md:px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="p-2 text-white hover:text-white/80 lg:hidden" aria-label="Open menu">
                <Menu size={20} />
              </button>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/75">Admin panel</p>
                <h1 className="font-sans text-lg font-extrabold text-white">Certification Operations</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {admin && (
                <span className={clsx(
                  "hidden rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider md:inline-block",
                  isAdmin ? "bg-[#d6a842] text-[#071b3f]" : "bg-white/20 text-white"
                )}>
                  {admin.role}
                </span>
              )}
              <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/25">
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="shrink-0 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
