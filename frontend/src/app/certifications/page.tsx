import type { Metadata } from "next";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { publicApi } from "@/lib/api";

export const metadata: Metadata = {
  title: "Certifications",
  description: "View available ISO certification programs. Find the right standard for your organization and begin your certification journey with GSR International Certifications.",
  openGraph: { title: "Certifications | GSR International Certifications", url: "https://www.gsrinternationalcertifications.com/certifications" },
  alternates: { canonical: "https://www.gsrinternationalcertifications.com/certifications" }
};

export default async function CertificationsPage() {
  const certifications = await publicApi.certifications().catch(() => []);

  return (
    <PublicShell>
      <section className="bg-[#071b3f] py-20 text-white">
        <div className="container">
          <SectionHeading
            eyebrow="Certificate Types"
            title="Certification Programs."
            text="Browse certification categories and standards offered by GSR International Certifications. Certificate authenticity checks are handled separately on the Verify Certificate page."
            light
          />
        </div>
      </section>

      <section className="section bg-[#f8fbff]">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((item) => (
              <article key={item._id} className="lift-card rounded-3xl border border-[#d6a842]/20 bg-white p-7 shadow-soft">
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#071b3f] text-[#d6a842]">
                    <ShieldCheck size={24} />
                  </span>
                  <span className="rounded-full bg-[#fff7df] px-3 py-1 text-xs font-bold text-[#8a641d]">{item.status}</span>
                </div>
                <h2 className="mt-6 text-2xl font-extrabold text-[#071b3f]">{item.name}</h2>
                <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">{item.description}</p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.16em]">
                  <span className="rounded border border-[#d6a842]/25 px-3 py-2 text-slate-600">{item.category}</span>
                  <span className="rounded border border-[#d6a842]/25 px-3 py-2 text-[#b8862b]">
                    {item.verificationSupport ? "Verification Support" : "No Verification"}
                  </span>
                </div>
              </article>
            ))}
          </div>
          {!certifications.length ? (
            <div className="rounded-3xl border border-dashed border-[#d6a842]/30 bg-white p-12 text-center text-slate-500">
              <BadgeCheck className="mx-auto h-8 w-8 text-[#b8862b]" />
              <p className="mt-3 font-medium">No active certifications have been published yet.</p>
            </div>
          ) : null}
        </div>
      </section>
    </PublicShell>
  );
}
