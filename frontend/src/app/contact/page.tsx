import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { InquiryForm } from "@/components/public/InquiryForm";
import { SectionHeading } from "@/components/public/SectionHeading";
import { publicApi } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with GSR International Certifications. Contact our certification team for ISO certification support, audit coordination, and compliance services.",
  openGraph: { title: "Contact Us | GSR International Certifications", url: "https://www.gsrinternationalcertifications.com/contact" },
  alternates: { canonical: "https://www.gsrinternationalcertifications.com/contact" }
};

export default async function ContactPage() {
  const settings = await publicApi.settings().catch(() => undefined);

  return (
    <PublicShell>
      <section className="section bg-[#e9f1fa]">
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Contact" title="Talk to the certification desk." />
            <div className="mt-6 rounded-2xl border border-[#d6a842]/20 bg-white p-5 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b8862b]">Business Name</p>
              <p className="mt-2 text-lg font-extrabold text-[#071b3f]">GSR International Certifications</p>
            </div>
            <div className="mt-4 grid gap-4">
              {[
                [Mail, settings?.contactEmail || "gsrinternationalcertifications@gmail.com"],
                [Phone, settings?.contactNumber || "8008035779; 7075999265"],
                [MapPin, settings?.address || "India"]
              ].map(([Icon, text]) => (
                <div key={String(text)} className="lift-card flex items-center gap-4 rounded-2xl border border-[#d6a842]/20 bg-white p-5 shadow-soft">
                  <Icon className="text-[#b8862b]" />
                  <span className="font-medium">{String(text)}</span>
                </div>
              ))}
            </div>
            <a
              href="https://wa.me/91707599265"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#25d366] px-6 py-3.5 text-sm font-extrabold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-[#1ebd57]"
            >
              <WhatsAppIcon size={18} />
              Chat on WhatsApp
            </a>
            <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-soft">
              {settings?.mapUrl ? (
                <iframe src={settings.mapUrl} className="h-72 w-full border-0" loading="lazy" title="Company map" />
              ) : (
                <div className="grid h-72 place-items-center bg-white text-center font-semibold text-[#b8862b]">
                  Google Maps embed can be added from Settings.
                </div>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-[#d6a842]/20 bg-white p-6 shadow-soft md:p-8">
            <InquiryForm source="Contact" />
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
