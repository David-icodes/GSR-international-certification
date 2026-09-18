"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Building2, Calendar, Download, Pencil, Plus, Search, ShieldCheck, Trash2, X } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCard";
import { API_URL, adminApi, authHeaders } from "@/lib/api";
import type { Certification } from "@/lib/types";

type CertificationForm = {
  name: string;
  description: string;
  category: string;
  status: Certification["status"];
  certificateId: string;
  companyName: string;
  scope: string;
  publishDate: string;
  expiryDate: string;
  certificateState: NonNullable<Certification["certificateState"]>;
};

const emptyForm: CertificationForm = {
  name: "",
  description: "",
  category: "",
  status: "Active",
  certificateId: "",
  companyName: "",
  scope: "",
  publishDate: "",
  expiryDate: "",
  certificateState: "Active"
};

const STATUS_COLORS: Record<string, string> = {
  Active: "bg-blue-50 text-blue-700",
  Inactive: "bg-slate-100 text-slate-500",
  Expired: "bg-red-50 text-red-700",
  Suspended: "bg-orange-50 text-orange-700"
};

function formatDate(value?: string) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric"
  });
}

function toDateInput(value?: string) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default function AdminCertificationsPage() {
  const [items, setItems] = useState<Certification[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      [item.name, item.category, item.companyName, item.certificateId, item.scope].some(
        (v) => v?.toLowerCase().includes(term)
      )
    );
  }, [items, search]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setItems(await adminApi.certifications());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load certifications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditing(undefined);
    setMessage("");
    setError("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      await adminApi.saveCertification(
        {
          ...form,
          certificateId: form.certificateId.trim().toUpperCase(),
          publishDate: form.publishDate || undefined,
          expiryDate: form.expiryDate || undefined
        },
        editing
      );
      setMessage(editing ? "Certification updated successfully" : "Certification created successfully");
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save certification");
    }
  }

  function edit(item: Certification) {
    setMessage("");
    setError("");
    setEditing(item._id);
    setForm({
      name: item.name,
      description: item.description,
      category: item.category,
      status: item.status,
      certificateId: item.certificateId || "",
      companyName: item.companyName || "",
      scope: item.scope || "",
      publishDate: toDateInput(item.publishDate),
      expiryDate: toDateInput(item.expiryDate),
      certificateState: item.certificateState || "Active"
    });
  }

  async function remove(id: string) {
    if (!confirm("Delete this certification?")) return;
    setMessage("");
    setError("");
    try {
      await adminApi.deleteCertification(id);
      setMessage("Certification deleted successfully");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete certification");
    }
  }

  async function exportCsv() {
    const response = await fetch(`${API_URL}/certifications/export/csv`, {
      headers: authHeaders()
    });
    if (!response.ok) return alert("Export failed");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "certifications.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (<>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-moss">Certification programs</p>
          <h2 className="mt-1 font-display text-4xl font-semibold">Certificate Management</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite/50" size={18} />
            <input
              className="focus-ring w-full rounded border border-moss/10 bg-white py-3 pl-10 pr-4"
              placeholder="Search certificates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={exportCsv} className="inline-flex shrink-0 items-center gap-2 rounded bg-moss px-5 py-3 font-semibold text-white">
            <Download size={17} /> Export
          </button>
        </div>
      </div>

      {message ? <div className="mb-4 rounded border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">{message}</div> : null}
      {error ? <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <AdminCard>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold">{editing ? "Edit Certification" : "Create Certification"}</h3>
            {editing ? (
              <button onClick={resetForm} className="grid h-9 w-9 place-items-center rounded bg-mint text-moss" aria-label="Cancel edit">
                <X size={16} />
              </button>
            ) : null}
          </div>
          <form onSubmit={submit} className="mt-5 grid gap-4">
            <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder="Certification Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            <textarea className="focus-ring min-h-32 rounded border border-ink/10 px-4 py-3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <div className="grid gap-4 md:grid-cols-2">
              <input className="focus-ring rounded border border-ink/10 px-4 py-3 uppercase" placeholder="Certificate ID" value={form.certificateId} onChange={(e) => setForm({ ...form, certificateId: e.target.value.toUpperCase() })} />
              <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder="Company Name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
            </div>
            <textarea className="focus-ring min-h-24 rounded border border-ink/10 px-4 py-3" placeholder="Scope" value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} />
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold text-graphite/70">
                Publish Date
                <input className="focus-ring rounded border border-ink/10 px-4 py-3 text-ink" type="date" value={form.publishDate} onChange={(e) => setForm({ ...form, publishDate: e.target.value })} />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-graphite/70">
                Expire Date
                <input className="focus-ring rounded border border-ink/10 px-4 py-3 text-ink" type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <select className="focus-ring rounded border border-ink/10 px-4 py-3" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Certification["status"] })}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <select className="focus-ring rounded border border-ink/10 px-4 py-3" value={form.certificateState} onChange={(e) => setForm({ ...form, certificateState: e.target.value as CertificationForm["certificateState"] })}>
                <option>Active</option>
                <option>Expired</option>
                <option>Suspended</option>
              </select>
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded bg-moss px-5 py-4 font-semibold text-white">
              <Plus size={18} /> {editing ? "Update" : "Create"}
            </button>
          </form>
        </AdminCard>

        <div className="grid gap-4">
          {error ? (
            <AdminCard>
              <div className="grid min-h-[200px] place-items-center text-center">
                <p className="text-red-600 font-semibold">{error}</p>
              </div>
            </AdminCard>
          ) : loading ? (
            <AdminCard>
              <div className="grid min-h-[200px] place-items-center text-sm font-semibold text-graphite/60">
                Loading certifications...
              </div>
            </AdminCard>
          ) : !filteredItems.length ? (
            <AdminCard>
              <div className="grid min-h-[200px] place-items-center text-center">
                <ShieldCheck className="mx-auto h-8 w-8 text-graphite/30" />
                <p className="mt-3 font-medium text-graphite/60">No certifications found.</p>
              </div>
            </AdminCard>
          ) : (
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="group rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-[#08172f]">{item.name}</h3>
                        <span
                          className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                            STATUS_COLORS[item.certificateState || item.status] || "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.certificateState || item.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-graphite/60">
                        {item.companyName ? (
                          <span className="flex items-center gap-1.5">
                            <Building2 size={14} />
                            {item.companyName}
                          </span>
                        ) : null}
                        <span>{item.category}</span>
                        {item.certificateId ? (
                          <span className="font-mono text-xs font-semibold text-moss">{item.certificateId}</span>
                        ) : null}
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-graphite/70">{item.description}</p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-graphite/50">
                        {item.publishDate ? (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            Valid from {formatDate(item.publishDate)}
                          </span>
                        ) : null}
                        {item.expiryDate ? (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            Expires {formatDate(item.expiryDate)}
                          </span>
                        ) : null}
                        {item.scope ? (
                          <span className="truncate max-w-[200px]">Scope: {item.scope}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button onClick={() => edit(item)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white transition-colors hover:bg-blue-50 hover:border-blue-200" aria-label="Edit">
                        <Pencil size={15} className="text-graphite/60" />
                      </button>
                      <button onClick={() => remove(item._id)} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white transition-colors hover:bg-red-50 hover:border-red-200" aria-label="Delete">
                        <Trash2 size={15} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  </>);
}
