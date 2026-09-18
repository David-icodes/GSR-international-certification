"use client";

import { useEffect, useState } from "react";
import { Download, Filter, Search, Trash2 } from "lucide-react";

import { AdminCard } from "@/components/admin/AdminCard";
import { adminApi } from "@/lib/api";
import type { ActivityLog } from "@/lib/types";

const MODULES = ["", "Authentication", "User Management", "Certifications", "Organizations", "Inquiries", "Settings", "Audit Logs"];
const ACTIONS = ["", "Login", "Logout", "Failed Login", "User Created", "User Updated", "User Deleted", "Certificate Created", "Certificate Updated", "Certificate Deleted", "Organization Created", "Organization Updated", "Organization Deleted", "Inquiry Updated", "Inquiry Deleted", "Settings Updated", "Audit Log Deleted"];

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [adminRole, setAdminRole] = useState("");
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) {
      try {
        setAdminRole((JSON.parse(stored) as { role?: string }).role || "");
      } catch {
        /* ignore */
      }
    }
  }, []);

  const canDelete = adminRole === "ADMIN";

  async function load(p?: number) {
    setLoading(true);
    setError("");
    try {
      const result = await adminApi.activityLogs({
        search: search || undefined,
        action: actionFilter || undefined,
        module: moduleFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page: p || page,
        limit: 30
      });
      setLogs(result.logs);
      setTotalPages(result.pagination.pages);
      setTotal(result.pagination.total);
      if (p) setPage(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load activity logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(1);
  }, [actionFilter, moduleFilter, startDate, endDate]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    load(1);
  }

  async function removeLog(id: string) {
    if (!confirm("Are you sure you want to delete this audit log?")) return;
    setMessage("");
    setError("");
    setDeletingId(id);
    try {
      await adminApi.deleteActivityLog(id);
      setMessage("Audit log deleted successfully");
      await load(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete audit log");
    } finally {
      setDeletingId(null);
    }
  }

  function formatDateTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  }

  return (<>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-copper">Audit Trail</p>
          <h2 className="mt-1 font-display text-4xl font-semibold">Activity Logs</h2>
          <p className="mt-1 text-sm text-graphite/60">{total} total entries</p>
        </div>
        <button onClick={() => adminApi.exportActivityCsv()} className="inline-flex shrink-0 items-center gap-2 rounded bg-moss px-5 py-3 font-semibold text-white">
          <Download size={17} /> Export CSV
        </button>
      </div>

      <AdminCard className="mb-4">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite/50" size={18} />
            <input
              className="focus-ring w-full rounded border border-ink/10 py-3 pl-10 pr-4"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="focus-ring rounded border border-ink/10 px-3 py-3 text-sm" value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}>
            <option value="">All Actions</option>
            {ACTIONS.filter(Boolean).map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select className="focus-ring rounded border border-ink/10 px-3 py-3 text-sm" value={moduleFilter} onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}>
            <option value="">All Modules</option>
            {MODULES.filter(Boolean).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <input type="date" className="focus-ring rounded border border-ink/10 px-3 py-3 text-sm" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} />
          <input type="date" className="focus-ring rounded border border-ink/10 px-3 py-3 text-sm" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} />
          <button type="submit" className="inline-flex items-center gap-2 rounded bg-copper px-4 py-3 font-semibold text-white">
            <Filter size={16} /> Filter
          </button>
        </form>
      </AdminCard>

      {error ? (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>
      ) : null}

      {message ? (
        <div className="mb-4 rounded border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">{message}</div>
      ) : null}

      <AdminCard>
        {loading ? (
          <div className="grid min-h-[200px] place-items-center text-sm font-semibold text-graphite/60">Loading activity logs...</div>
        ) : !logs.length ? (
          <div className="grid min-h-[200px] place-items-center text-sm font-semibold text-graphite/60">No activity logs found.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-2 text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.14em] text-graphite/50">
                    <th className="px-3 py-2">Admin</th>
                    <th className="px-3 py-2">Action</th>
                    <th className="px-3 py-2">Module</th>
                    <th className="px-3 py-2">Description</th>
                    <th className="px-3 py-2">Date & Time</th>
                    <th className="px-3 py-2">IP</th>
                    <th className="px-3 py-2">Device</th>
                    <th className="px-3 py-2">Status</th>
                    {canDelete ? <th className="px-3 py-2">Actions</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log._id} className="rounded bg-mint align-top">
                      <td className="rounded-l px-3 py-3">
                        <div className="font-semibold text-sm">{log.adminName}</div>
                        <div className="text-xs text-graphite/50">{log.adminEmail}</div>
                      </td>
                      <td className="px-3 py-3"><span className="font-medium text-sm">{log.action}</span></td>
                      <td className="px-3 py-3 text-sm">{log.module}</td>
                      <td className="px-3 py-3 text-sm text-graphite/70 max-w-xs truncate">{log.description}</td>
                      <td className="px-3 py-3 text-sm whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
                      <td className="px-3 py-3 text-xs font-mono text-graphite/50">{log.ipAddress}</td>
                      <td className="px-3 py-3 text-xs text-graphite/50">{log.device} · {log.browser}</td>
                      <td className="px-3 py-3">
                        <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                          log.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {log.success ? "Success" : "Failed"}
                        </span>
                      </td>
                      {canDelete ? (
                        <td className="rounded-r px-3 py-3">
                          <button
                            type="button"
                            onClick={() => removeLog(log._id)}
                            disabled={deletingId === log._id}
                            className="inline-flex items-center gap-1.5 rounded border border-red-200 bg-white px-2.5 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                            aria-label="Delete audit log"
                          >
                            <Trash2 size={14} />
                            {deletingId === log._id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  onClick={() => load(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="rounded bg-white border border-ink/10 px-4 py-2 text-sm font-semibold disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-graphite/60">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => load(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  className="rounded bg-white border border-ink/10 px-4 py-2 text-sm font-semibold disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </AdminCard>
  </>);
}
