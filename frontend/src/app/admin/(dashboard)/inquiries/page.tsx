"use client";

import { useEffect, useState } from "react";
import { Download, Trash2 } from "lucide-react";

import { AdminCard } from "@/components/admin/AdminCard";
import { API_URL, adminApi, authHeaders } from "@/lib/api";
import type { Inquiry } from "@/lib/types";

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setItems(await adminApi.inquiries());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load inquiries");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: Inquiry["status"]) {
    await adminApi.updateInquiryStatus(id, status);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this inquiry?")) return;
    await adminApi.deleteInquiry(id);
    await load();
  }

  async function exportCsv() {
    const response = await fetch(`${API_URL}/inquiries/export/csv`, {
      headers: authHeaders()
    });
    if (!response.ok) return alert("Export failed");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inquiries.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (<>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="font-display text-4xl font-semibold">Inquiry Management</h2>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded bg-moss px-5 py-3 font-semibold text-white">
          <Download size={17} /> Export
        </button>
      </div>
      {error ? (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>
      ) : null}
      <AdminCard>
        {loading ? (
          <div className="grid min-h-[200px] place-items-center text-sm font-semibold text-graphite/60">Loading inquiries...</div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <article key={item._id} className="rounded bg-pearl p-5">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <span className="rounded bg-white px-3 py-1 text-xs font-bold text-copper">{item.source}</span>
                    </div>
                    <p className="mt-2 text-sm text-graphite/60">
                      {item.email} {item.phone ? `· ${item.phone}` : ""} {item.company ? `· ${item.company}` : ""}
                    </p>
                    <p className="mt-3 leading-7 text-graphite/75">{item.message}</p>
                    {item.service ? <p className="mt-2 text-sm font-semibold text-moss">{item.service}</p> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="focus-ring rounded border border-ink/10 bg-white px-3 py-2"
                      value={item.status}
                      onChange={(event) => updateStatus(item._id, event.target.value as Inquiry["status"])}
                    >
                      <option>New</option>
                      <option>In Progress</option>
                      <option>Closed</option>
                    </select>
                    <button onClick={() => remove(item._id)} className="grid h-10 w-10 place-items-center rounded bg-white text-red-600" aria-label="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </AdminCard>
  </>);
}
