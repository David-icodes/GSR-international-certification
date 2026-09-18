"use client";

import { FormEvent, useState } from "react";
import { BadgeCheck, Building2, Calendar, QrCode, Search, ShieldCheck, XCircle } from "lucide-react";
import { publicApi } from "@/lib/api";
import type { Certification } from "@/lib/types";

function formatDate(value?: string) {
  if (!value) return "Not published";
  return new Date(value).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function StateBadge({ state }: { state?: string }) {
  switch (state) {
    case "Active":
      return <span className="rounded-full bg-green-50 px-4 py-1.5 text-sm font-bold text-green-700">Active</span>;
    case "Expired":
      return <span className="rounded-full bg-red-50 px-4 py-1.5 text-sm font-bold text-red-700">Expired</span>;
    case "Suspended":
      return <span className="rounded-full bg-orange-50 px-4 py-1.5 text-sm font-bold text-orange-700">Suspended</span>;
    default:
      return <span className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-bold text-slate-500">{state || "Unknown"}</span>;
  }
}

export function CertificateVerifyForm() {
  const [certificateId, setCertificateId] = useState("");
  const [result, setResult] = useState<Certification | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setResult(null);
    setMessage("");

    try {
      const certification = await publicApi.verifyCertificate(certificateId.trim().toUpperCase());
      setResult(certification);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Certificate not found");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[#d6a842]/25 bg-white p-6 text-[#08172f] shadow-[0_28px_90px_rgba(2,11,29,0.26)] sm:p-8">
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#071b3f] text-[#d6a842] shadow-lg shadow-slate-950/20">
          <ShieldCheck size={28} />
        </div>
        <h2 className="mt-5 font-sans text-2xl font-extrabold text-[#071b3f]">Verify Certificate</h2>
        <p className="mt-1 text-sm text-slate-500">Enter the certificate ID to verify authenticity and view details.</p>
      </div>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            required
            value={certificateId}
            onChange={(event) => setCertificateId(event.target.value.toUpperCase())}
            className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-bold uppercase tracking-wide text-[#08172f] placeholder:font-normal placeholder:normal-case placeholder:text-slate-300 focus:border-[#d6a842] focus:outline-none focus:ring-4 focus:ring-[#d6a842]/20"
            placeholder="Enter Certificate ID"
          />
        </div>
        <button
          disabled={busy}
          className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#071b3f] px-8 text-sm font-bold text-white shadow-lg shadow-slate-950/20 transition-all hover:bg-[#0b2d62] disabled:opacity-60"
        >
          {busy ? "Verifying..." : "Verify Certificate"}
        </button>
      </form>

      {message ? (
        <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div>
              <p className="font-semibold text-red-700">Invalid Certificate</p>
              <p className="mt-0.5 text-sm text-red-500">{message}</p>
            </div>
          </div>
        </div>
      ) : null}

      {result ? (
        <div className="mt-6 overflow-hidden rounded-3xl border border-green-200 bg-green-50 shadow-sm">
          <div className="border-b border-green-200 bg-white px-6 py-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-green-100">
                  <BadgeCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-green-700">Verified Certificate</p>
                  <p className="text-sm text-slate-500">Certificate Number: {result.certificateId}</p>
                </div>
              </div>
              <StateBadge state={result.certificateState || result.status} />
            </div>
          </div>
          <div className="grid gap-5 p-6 lg:grid-cols-[1fr_140px]">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Company Name", result.companyName || "Not provided", Building2],
                ["Certificate Number", result.certificateId || "Not provided", ShieldCheck],
                ["Certification Standard", result.name, BadgeCheck],
                ["Issue Date", formatDate(result.publishDate), Calendar],
                ["Expiry Date", formatDate(result.expiryDate), Calendar],
                ["Status", result.certificateState || result.status, ShieldCheck]
              ].map(([label, value, Icon]) => (
                <div key={String(label)} className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{String(label)}</p>
                  <p className="mt-2 flex items-center gap-1.5 font-semibold text-[#08172f]">
                    <Icon size={14} className="text-[#b8862b]" />
                    {String(value)}
                  </p>
                </div>
              ))}
              <div className="rounded-2xl bg-white p-4 shadow-sm md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Scope</p>
                <p className="mt-2 leading-6 text-slate-600">{result.scope || "Not provided"}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
              <QrCode className="mx-auto mb-3 text-[#b8862b]" />
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(result.certificateId || "")}`}
                alt="QR verification"
                className="mx-auto h-28 w-28"
              />
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">QR Verification</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
