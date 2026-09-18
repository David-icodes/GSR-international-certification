"use client";

import { FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";

import { AdminCard } from "@/components/admin/AdminCard";
import { adminApi } from "@/lib/api";
import type { Settings } from "@/lib/types";

const initial: Settings = {
  companyName: "",
  contactEmail: "",
  contactNumber: "",
  address: "",
  whatsapp: "",
  domain: "",
  mapUrl: "",
  copyright: "",
  socialLinks: { linkedin: "", facebook: "", instagram: "", youtube: "", x: "" }
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Settings>(initial);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    adminApi.settings().then(setForm).catch(console.error);
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaved("");
    const response = await adminApi.saveSettings(form);
    setForm(response);
    setSaved("Settings saved successfully");
    setTimeout(() => setSaved(""), 3000);
  }

  return (<>
      <h2 className="mb-6 font-display text-4xl font-semibold">Settings</h2>
      <AdminCard className="max-w-4xl">
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder="Company Name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
            <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder="Contact Email" type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder="Contact Number" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} required />
            <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder="Google Maps Embed URL" value={form.mapUrl || ""} onChange={(e) => setForm({ ...form, mapUrl: e.target.value })} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder="WhatsApp Number" value={form.whatsapp || ""} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
            <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder="Website Domain" value={form.domain || ""} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
          </div>
          <textarea className="focus-ring min-h-24 rounded border border-ink/10 px-4 py-3" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder="Copyright Text (leave empty for default)" value={form.copyright || ""} onChange={(e) => setForm({ ...form, copyright: e.target.value })} />
          <div className="border-t border-ink/5 pt-4">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.15em] text-graphite/60">Social Media Links</p>
            <div className="grid gap-4 md:grid-cols-2">
              {(["linkedin", "facebook", "instagram", "youtube", "x"] as const).map((key) => (
                <input
                  key={key}
                  className="focus-ring rounded border border-ink/10 px-4 py-3"
                  placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} URL`}
                  value={form.socialLinks?.[key] || ""}
                  onChange={(e) =>
                    setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: e.target.value } })
                  }
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="inline-flex items-center justify-center gap-2 rounded bg-copper px-5 py-4 font-semibold text-white md:w-max">
              <Save size={18} /> Save Settings
            </button>
            {saved ? <p className="text-sm font-semibold text-green-600">{saved}</p> : null}
          </div>
        </form>
      </AdminCard>
  </>);
}
