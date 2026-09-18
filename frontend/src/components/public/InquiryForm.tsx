"use client";

import { FormEvent, useEffect, useState } from "react";
import { Send } from "lucide-react";
import { publicApi } from "@/lib/api";

export function InquiryForm({ source = "Contact" }: { source?: "Contact" | "Apply" }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [initialService, setInitialService] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setInitialService(params.get("service") || "");
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      await publicApi.submitInquiry({ ...payload, source });
      form.reset();
      setStatus("Submitted successfully. Our certification desk will contact you shortly.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input className="focus-ring rounded border border-ink/10 bg-white px-4 py-3" name="name" placeholder="Name" required />
        <input
          className="focus-ring rounded border border-ink/10 bg-white px-4 py-3"
          name="email"
          placeholder="Email"
          type="email"
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input className="focus-ring rounded border border-ink/10 bg-white px-4 py-3" name="phone" placeholder="Phone" />
        <input className="focus-ring rounded border border-ink/10 bg-white px-4 py-3" name="company" placeholder="Company" />
      </div>
      <input
        key={initialService || "service"}
        className="focus-ring rounded border border-ink/10 bg-white px-4 py-3"
        name="service"
        placeholder="Certification or service required"
        defaultValue={initialService}
      />
      <textarea
        className="focus-ring min-h-36 rounded border border-ink/10 bg-white px-4 py-3"
        name="message"
        placeholder="Tell us about your requirement"
        required
      />
      <button
        disabled={busy}
        className="inline-flex items-center justify-center gap-2 rounded bg-[#071b3f] px-6 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#0b2d62] disabled:opacity-60"
      >
        <Send size={18} />
        {busy ? "Submitting..." : source === "Apply" ? "Submit Application" : "Send Inquiry"}
      </button>
      {status ? <p className="text-sm font-medium text-[#b8862b]">{status}</p> : null}
    </form>
  );
}
