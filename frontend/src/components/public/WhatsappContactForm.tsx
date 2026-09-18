"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

const whatsappNumber = "917075999265";

export function WhatsappContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    message: ""
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = [
      "Hello GSR International Certifications,",
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Service: ${form.service || "ISO Certification"}`,
      `Message: ${form.message || "I want certification guidance."}`
    ].join("\n");

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          className="focus-ring rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#08172f] shadow-sm"
          placeholder="Name"
        />
        <input
          required
          value={form.phone}
          onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
          className="focus-ring rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#08172f] shadow-sm"
          placeholder="Phone"
        />
      </div>
      <input
        required
        value={form.service}
        onChange={(event) => setForm((current) => ({ ...current, service: event.target.value }))}
        className="focus-ring rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#08172f] shadow-sm"
        placeholder="Certification required"
      />
      <textarea
        required
        value={form.message}
        onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
        className="focus-ring min-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#08172f] shadow-sm"
        placeholder="Tell us your requirement"
      />
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#071b3f] px-6 py-3 text-sm font-extrabold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#0b2d62]"
      >
        <Send size={17} />
        Submit on WhatsApp
      </button>
    </form>
  );
}
