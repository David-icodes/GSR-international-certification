import type { Metadata } from "next";
import { LockKeyhole, QrCode, ShieldCheck } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { CertificateVerifyForm } from "@/components/public/CertificateVerifyForm";

export const metadata: Metadata = {
  title: "Verify Certificate",
  description: "Verify the authenticity of ISO certificates issued by GSR International Certifications. Enter your certificate ID to check status and validity.",
  openGraph: { title: "Verify Certificate | GSR International Certifications", url: "https://www.gsrinternationalcertifications.com/verify" },
  alternates: { canonical: "https://www.gsrinternationalcertifications.com/verify" }
};

export default function VerifyPage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden bg-[#071b3f] py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,168,66,0.22),transparent_30%)]" />
        <div className="container relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#d6a842]">Certificate Verification</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">Validate certificate authenticity by ID.</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/75">
              Search the official GSR International Certifications registry to confirm certificate status, company details,
              issue date, expiry date, and certified scope.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                [ShieldCheck, "Registry checked"],
                [LockKeyhole, "Secure lookup"],
                [QrCode, "QR ready"]
              ].map(([Icon, label]) => (
                <div key={String(label)} className="rounded-2xl border border-[#d6a842]/25 bg-white/10 p-4 backdrop-blur">
                  <Icon className="text-[#d6a842]" />
                  <p className="mt-3 text-sm font-bold">{String(label)}</p>
                </div>
              ))}
            </div>
          </div>
          <CertificateVerifyForm />
        </div>
      </section>

      <section className="section bg-[#f8fbff]">
        <div className="container grid gap-6 md:grid-cols-3">
          {[
            ["Authenticity", "Each lookup checks the certificate ID against records published by the admin team."],
            ["Certificate Status", "The result shows whether the certificate is Active, Expired, or Suspended."],
            ["Scope Validation", "Company name, standard, scope, publish date, and expiry date are displayed together."]
          ].map(([title, text]) => (
            <div key={title} className="lift-card rounded-3xl border border-[#d6a842]/20 bg-white p-7 shadow-soft">
              <h2 className="text-xl font-extrabold text-[#071b3f]">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicShell>
  );
}
