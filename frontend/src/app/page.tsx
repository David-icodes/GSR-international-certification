import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  CalendarDays,
  ClipboardCheck,
  Factory,
  FileCheck2,
  FileText,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Rocket,
  SearchCheck,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { publicApi } from "@/lib/api";
import { services } from "@/data/services";
import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { InquiryForm } from "@/components/public/InquiryForm";
import { ProjectImageSlider } from "@/components/public/ProjectImageSlider";

export const metadata: Metadata = {
  title: "GSR International Certifications | ISO Certification Services",
  description:
    "GSR International Certifications provides professional ISO certification services, compliance support, audit coordination, documentation assistance, and certificate verification services.",
  openGraph: {
    title: "GSR International Certifications | ISO Certification Services", url: "https://www.gsrinternationalcertifications.com"
  },
  alternates: { canonical: "https://www.gsrinternationalcertifications.com" }
};

const gsrMapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15228.32494098261!2d78.378339!3d17.5212687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb8d001aa3e61f%3A0x3f949da1ebd4c5e5!2sGSR+Certification+Services!5e0!3m2!1sen!2sin!4v1";
const googleMapsShareUrl = "https://www.google.com/maps/place/GSR+Certification+Services/@17.5212625,78.378407,17z/data=!4m6!3m5!1s0x3bcb8d001aa3e61f:0x3f949da1ebd4c5e5!8m2!3d17.5212687!4d78.378339!16s%2Fg%2F11yhl6lmz7";

export default async function HomePage() {
  const [certifications, organizations] = await Promise.all([
    publicApi.certifications().catch(() => []),
    publicApi.organizations().catch(() => [])
  ]);

  const featuredCertifications = certifications.slice(0, 4);
  const latestOrganizations = organizations.slice(0, 3);

  return (
    <PublicShell>
      <section className="brand-surface relative overflow-hidden text-white">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,45,98,0.95),rgba(7,27,63,0.92),rgba(2,11,29,0.96))]" />
        <div className="blue-wave" />
          <div className="container relative grid min-h-[calc(100vh-82px)] items-center gap-8 pb-40 pt-14 lg:grid-cols-[1fr_540px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white">
              <Sparkles size={16} /> ISO certification services in Hyderabad
            </div>
            <h1 className="hero-title mt-5 max-w-3xl font-sans text-3xl font-extrabold leading-[1.12] text-white md:text-4xl lg:text-[46px]">
              GSR INTERNATIONAL CERTIFICATIONS
            </h1>
            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-white/85 md:text-base">
              Global Standards | Integrity | Assurance. Professional ISO documentation, certification guidance, audit
              coordination, and verification support.
            </p>
            <div className="mt-6 grid max-w-2xl gap-3 text-sm font-semibold text-white/85 md:grid-cols-2">
              <a href="tel:8008035779" className="inline-flex items-center gap-3">
                <Phone size={17} className="text-white" /> 8008035779
              </a>
              <a href="tel:7075999265" className="inline-flex items-center gap-3">
                <Phone size={17} className="text-white" /> 7075999265
              </a>
              <a href="mailto:gsrinternationalcertifications@gmail.com" className="inline-flex items-center gap-3 md:col-span-2">
                <Mail size={17} className="text-white" /> gsrinternationalcertifications@gmail.com
              </a>
              <div className="inline-flex items-start gap-3 md:col-span-2">
                <MapPin size={17} className="mt-1 shrink-0 text-white" />
                <span>Hyderabad, Telangana, India</span>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/apply" className="rounded-full bg-[#d6a842] px-6 py-3 text-sm font-extrabold text-[#071b3f] shadow-soft transition hover:-translate-y-0.5 hover:bg-[#f0c766]">
                Apply for Certification
              </Link>
              <Link href="/verify" className="rounded-full border border-[#d6a842]/60 px-6 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-white/10">
                Verify Certificate
              </Link>
            </div>
            <div className="mt-9 grid max-w-3xl gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["1,240+", "Certified Companies"],
                ["98.7%", "Audit Completion"],
                ["22", "Countries Served"],
                ["1,500+", "Certificates Issued"]
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <div className="text-2xl font-extrabold text-white">{value}</div>
                  <div className="mt-1 text-xs font-bold text-white/75">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[24px] bg-white text-[#08172f] shadow-[0_28px_90px_rgba(2,11,29,0.28)]">
            <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-[50px] bg-[#f5e7bd]" />
            <div className="grid gap-3 p-3 sm:grid-cols-[200px_1fr]">
              <div className="rounded-2xl bg-[#f8fbff] p-4 text-center">
                <div className="grid place-items-center">
                  <div className="grid h-32 w-32 place-items-center rounded-full bg-[radial-gradient(circle,#fffaf0_0%,#f2d994_58%,#b8862b_100%)]">
                    <img src="/iso-9001-badge.png" alt="Certification badge" className="h-24 w-auto object-contain drop-shadow-xl saturate-[0.95]" />
                  </div>
                </div>
                <div className="mt-3 rounded-xl border border-[#d6a842]/20 bg-[#fff7df] p-2.5 text-center">
                  <p className="text-[11px] font-bold text-[#8a641d]">Accredited Certification Services</p>
                  <p className="mt-1 text-[10px] text-slate-500">Trusted certification support for internationally recognized standards and compliance excellence.</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[#f8fbff] p-4">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#b8862b]">Global Certification & Compliance Services</p>
                <h2 className="mt-1 text-base font-extrabold">GSR International Certifications</h2>
                <p className="mt-1 text-[11px] leading-5 text-slate-600">
                  Professional certification support, audit coordination, compliance management, documentation guidance, verification services, and certification solutions for organizations seeking internationally recognized standards.
                </p>
                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10px] font-semibold text-[#8a641d]">
                  <span>ISO Certification Support</span>
                  <span>Audit Coordination</span>
                  <span>Compliance Management</span>
                  <span>Documentation Assistance</span>
                  <span>Certificate Verification</span>
                  <span>Industry-Specific Solutions</span>
                </div>
                <div className="mt-3 overflow-hidden rounded-xl border border-[#d6a842]/30">
                  <iframe
                    src={gsrMapEmbedUrl}
                    className="h-32 w-full border-0"
                    loading="lazy"
                    title="GSR Certification Services location"
                  />
                </div>
                <div className="mt-2 flex items-center justify-end">
                  <Link href={googleMapsShareUrl} target="_blank" className="inline-flex shrink-0 rounded-full bg-[#071b3f] px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-[#0b2d62]">
                    View on Google Maps
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            eyebrow="Company overview"
            title="Global Standards | Integrity | Assurance"
            text="We combine compliance expertise with practical operating insight, helping teams build systems that are audit-ready and useful after the certificate is issued."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["12+", "Standards supported"],
              ["500+", "Client engagements"],
              ["4", "Core workflow modules"]
            ].map(([value, label]) => (
              <div key={label} className="stagger-card lift-card rounded-2xl border border-[#b8862b]/10 bg-white p-6 shadow-soft">
                <div className="font-sans text-4xl font-extrabold text-[#b8862b]">{value}</div>
                <div className="mt-2 text-sm text-slate-600">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-[#f8fbff]">
        <div className="container">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading eyebrow="Projects showcase" title="Latest certified organizations" />
            <Link href="/organizations" className="text-sm font-extrabold text-[#b8862b] transition hover:text-[#071b3f]">
              View all projects
            </Link>
          </div>
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {latestOrganizations.map((org) => (
              <article key={org._id} className="stagger-card lift-card overflow-hidden rounded-2xl border border-[#d6a842]/20 bg-white shadow-soft">
                <ProjectImageSlider title={org.title} imageUrl={org.imageUrl} imageUrl2={org.imageUrl2} />
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-graphite/70">
                      <CalendarDays size={17} className="text-[#b8862b]" />
                      {new Date(org.certificationDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                    <span className="rounded-full bg-[#fff7df] px-3 py-1 text-xs font-extrabold text-[#8a641d]">
                      {org.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold uppercase text-[#071b3f]">{org.title}</h3>
                  <p className="mt-3 min-h-16 text-sm font-medium uppercase leading-7 text-graphite/70">
                    {org.description}
                  </p>
                  <Link href={`/contact?service=${encodeURIComponent(org.title)}`} className="mt-6 block rounded bg-[#071b3f] px-4 py-3 text-center text-sm font-extrabold text-white transition hover:bg-[#0b2d62]">
                    Send inquiry
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <SectionHeading eyebrow="Certifications" title="Standards managed through the admin workspace." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {(featuredCertifications.length ? featuredCertifications : fallbackCertifications).map((item) => (
              <div key={item._id || item.name} className="stagger-card lift-card rounded-2xl border border-[#b8862b]/10 bg-white p-6 shadow-sm">
                <BadgeCheck className="text-[#b8862b]" />
                <h3 className="mt-5 text-xl font-semibold">{item.name}</h3>
                <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600">{item.description}</p>
                <div className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#b8862b]">{item.category}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-[#e9f1fa]">
        <div className="container grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Why choose us"
            title="A certification process with strong controls and human guidance."
            text="Every engagement is structured around eligibility, documentation, audit preparation, certification status tracking, and post-certification support."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { Icon: ShieldCheck, title: "Secure workflows" },
              { Icon: ClipboardCheck, title: "Evidence-led reviews" },
              { Icon: FileCheck2, title: "Clean documentation" },
              { Icon: Factory, title: "Industry-fit advice" }
            ].map(({ Icon, title }) => (
              <div key={title} className="stagger-card lift-card rounded-2xl border border-[#b8862b]/10 bg-white p-6">
                <Icon className="text-[#b8862b]" />
                <h3 className="mt-5 font-semibold">{title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="text-center">
            <SectionHeading eyebrow="Our Services" title="ISO certification standards we support." />
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              services.slice(0, 5),
              services.slice(5, 9),
              services.slice(9, 13)
            ].map((group, index) => (
              <div key={index} className="stagger-card lift-card rounded-2xl border border-slate-100 bg-white p-7 shadow-soft">
                <div className={`mb-5 h-1 rounded-full ${index === 0 ? "bg-green-500" : index === 1 ? "bg-[#b8862b]" : "bg-cyan-500"}`} />
                <div className="divide-y divide-slate-200">
                  {group.map((service) => (
                    <div key={service.title} className="py-4">
                      <h3 className="text-sm font-extrabold text-[#08172f]">{service.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{service.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="section-reveal mt-8 overflow-hidden rounded-3xl border border-[#d6a842]/25 bg-[#071b3f] p-7 text-white shadow-[0_24px_70px_rgba(7,27,63,0.18)]">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#d6a842] text-[#071b3f]">
                  <Rocket size={26} />
                </span>
                <div>
                  <h3 className="text-2xl font-extrabold">AS 9100(D) Aerospace & Space Certification</h3>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75">
                    AS9100(D) is the internationally recognized Quality Management System standard for aerospace,
                    aviation, defense, and space organizations. It builds upon ISO 9001 while adding industry-specific
                    requirements for safety, reliability, risk management, and product quality.
                  </p>
                </div>
              </div>
              <Link href="/contact?service=AS%209100(D)%20Aerospace%20%26%20Space%20Certification" className="shrink-0 rounded-full bg-[#d6a842] px-5 py-3 text-sm font-extrabold text-[#071b3f] transition hover:bg-[#f0c766]">
                Talk to Experts
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-[#071b3f] text-white">
        <div className="container">
          <SectionHeading eyebrow="Process flow" title="Professional certification workflow." light />
          <div className="relative mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-6">
            <div className="process-line absolute left-10 right-10 top-10 hidden h-px xl:block" />
            {[
              {
                Icon: FileText,
                step: "Application Submission",
                text: "Submit organization details and the required certification request."
              },
              {
                Icon: ClipboardCheck,
                step: "Document Verification",
                text: "Submitted records are checked for completeness and readiness."
              },
              {
                Icon: SearchCheck,
                step: "Initial Assessment",
                text: "The applicable standard, scope, and audit path are confirmed."
              },
              {
                Icon: ShieldCheck,
                step: "Audit & Compliance Review",
                text: "Compliance evidence is reviewed against certification requirements."
              },
              {
                Icon: BadgeCheck,
                step: "Certification Approval",
                text: "Approved records are prepared for official certificate publication."
              },
              {
                Icon: QrCode,
                step: "Certificate Issuance & Verification",
                text: "The certificate is issued and becomes searchable by certificate ID."
              }
            ].map(({ Icon, step, text }, index) => (
              <div key={step} className="section-reveal lift-card relative rounded-3xl border border-[#d6a842]/25 bg-white/[0.07] p-5 text-center backdrop-blur">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#d6a842]/60 bg-[#d6a842] text-[#071b3f] shadow-[0_16px_40px_rgba(214,168,66,0.22)]">
                  <Icon size={24} />
                </div>
                <span className="mt-5 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-[#d6a842]">
                  Step-{index + 1}
                </span>
                <h3 className="mt-4 text-base font-extrabold text-white">{step}</h3>
                <p className="mt-3 text-sm leading-6 text-white/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Testimonials" title="Trusted by teams who need calm, capable guidance." />
            <blockquote className="mt-8 rounded-2xl border border-[#b8862b]/10 bg-white p-8 text-lg leading-8 shadow-soft">
              “GSR made our certification preparation structured, fast, and easy for department heads to follow.”
              <span className="mt-5 block text-sm font-semibold text-[#b8862b]">Operations Director, Manufacturing</span>
            </blockquote>
          </div>
          <div>
            <SectionHeading eyebrow="FAQ" title="Clear answers before you apply." />
            <div className="mt-8 grid gap-3">
              {[
                ["Do you support verification?", "Yes. Active certifications show verification support on the public listing."],
                ["Can organizations apply online?", "Yes. The Apply page submits directly into admin inquiry management."],
                ["Can admin update certified organizations?", "Yes. Updates immediately reflect on the public website."]
              ].map(([question, answer]) => (
                <details key={question} className="rounded-2xl border border-[#b8862b]/10 bg-white p-5 transition hover:border-[#b8862b]/30">
                  <summary className="cursor-pointer font-semibold">{question}</summary>
                  <p className="mt-3 text-sm leading-7 text-graphite/70">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#e9f1fa] py-16">
        <div className="container grid gap-7 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] bg-white p-7 shadow-soft">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#b8862b]">Get in touch</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#08172f]">Talk to our certification team.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Submit your requirement and our team will guide you with the right ISO certification path.
            </p>
            <InquiryForm source="Contact" />
          </div>
          <div className="overflow-hidden rounded-[32px] bg-white p-3 shadow-soft">
            <iframe
              title="GSR International Certifications Google Maps location"
              src={gsrMapEmbedUrl}
              className="h-full min-h-[450px] w-full rounded-[24px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="px-4 pb-4 pt-3">
              <Link href={googleMapsShareUrl} target="_blank" className="inline-flex rounded-full bg-[#071b3f] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0b2d62]">
                Open in Google Maps
              </Link>
            </div>
          </div>
        </div>
      </section>


    </PublicShell>
  );
}

const fallbackCertifications = [
  {
    _id: "iso-9001",
    name: "ISO 9001",
    description: "Quality management system certification for consistent products, services, and processes.",
    category: "Quality",
    status: "Active",
    verificationSupport: true
  },
  {
    _id: "iso-14001",
    name: "ISO 14001",
    description: "Environmental management system certification for responsible operational control.",
    category: "Environment",
    status: "Active",
    verificationSupport: true
  },
  {
    _id: "iso-45001",
    name: "ISO 45001",
    description: "Occupational health and safety management system certification.",
    category: "Safety",
    status: "Active",
    verificationSupport: true
  },
  {
    _id: "iso-22000",
    name: "ISO 22000",
    description: "Food safety management system certification for food-chain organizations.",
    category: "Food Safety",
    status: "Active",
    verificationSupport: true
  }
];
