import type { Metadata } from "next";
import { PublicShell } from "@/components/public/PublicShell";
import { InquiryForm } from "@/components/public/InquiryForm";
import { SectionHeading } from "@/components/public/SectionHeading";

export const metadata: Metadata = {
  title: "Apply for Certification",
  description: "Apply for ISO certification online. Submit your organization details and our team will guide you through the certification process with GSR International Certifications.",
  openGraph: { title: "Apply for Certification | GSR International Certifications", url: "https://www.gsrinternationalcertifications.com/apply" },
  alternates: { canonical: "https://www.gsrinternationalcertifications.com/apply" }
};

export default function ApplyPage() {
  return (
    <PublicShell>
      <section className="section bg-[#e9f1fa]">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Apply"
            title="Submit your certification application request."
            text="Apply for ISO certification with GSR International Certifications. Submit your organization details and our team will guide you through the certification process."
          />
          <div className="rounded-2xl border border-[#d6a842]/20 bg-white p-6 shadow-soft md:p-8">
            <InquiryForm source="Apply" />
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
