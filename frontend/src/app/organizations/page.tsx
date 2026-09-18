import type { Metadata } from "next";
import { publicApi } from "@/lib/api";
import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { ProjectImageSlider } from "@/components/public/ProjectImageSlider";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Certified Organizations",
  description: "Browse our directory of certified organizations. GSR International Certifications helps companies achieve and maintain ISO certification standards.",
  openGraph: { title: "Certified Organizations | GSR International Certifications", url: "https://www.gsrinternationalcertifications.com/organizations" },
  alternates: { canonical: "https://www.gsrinternationalcertifications.com/organizations" }
};

export default async function OrganizationsPage() {
  const organizations = await publicApi.organizations().catch(() => []);

  return (
    <PublicShell>
      <section className="section bg-[#e9f1fa]">
        <div className="container">
          <SectionHeading
            eyebrow="Certified organizations"
            title="Dynamic public registry of recently certified organizations."
            text="Browse organizations certified through GSR International Certifications. Each listing reflects current status, certification date, and available scope information."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <article key={org._id} className="lift-card overflow-hidden rounded-2xl border border-[#d6a842]/20 bg-white shadow-soft">
                <ProjectImageSlider title={org.title} imageUrl={org.imageUrl} imageUrl2={org.imageUrl2} />
                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold">{org.title}</h2>
                    <span className="rounded bg-[#fff7df] px-3 py-1 text-xs font-bold text-[#8a641d]">{org.status}</span>
                  </div>
                  <p className="mt-3 leading-7 text-slate-600">{org.description}</p>
                  <p className="mt-5 text-sm font-semibold text-[#b8862b]">
                    Certified on {new Date(org.certificationDate).toLocaleDateString()}
                  </p>
                  <Link href={`/contact?service=${encodeURIComponent(org.title)}`} className="mt-5 block rounded bg-[#071b3f] px-4 py-3 text-center text-sm font-bold text-white">
                    Send inquiry
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {!organizations.length ? (
            <p className="mt-10 rounded bg-white p-6 text-slate-600">No certified organizations have been published yet.</p>
          ) : null}
        </div>
      </section>
    </PublicShell>
  );
}
