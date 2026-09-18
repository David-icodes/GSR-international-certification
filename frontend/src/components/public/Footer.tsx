import Link from "next/link";
import type { Settings } from "@/lib/types";

export function Footer({ settings }: { settings?: Settings }) {
  const social = settings?.socialLinks || {};
  const hasSocialLinks = social.linkedin || social.facebook || social.instagram || social.youtube || social.x;

  return (
    <footer className="bg-[linear-gradient(90deg,#0b2d62_0%,#071b3f_52%,#020b1d_100%)] py-14 text-white">
      <div className="container grid gap-10 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
        <div>
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-white">
              <img src="/gsr-logo.png" alt="GSR International Certifications logo" className="h-14 w-14 object-contain" />
            </span>
            <div className="font-sans text-2xl font-extrabold">{settings?.companyName || "GSR INTERNATIONAL CERTIFICATIONS"}</div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
            Global Standards | Integrity | Assurance
          </p>

          {hasSocialLinks && (
            <div className="mt-6 flex flex-wrap gap-3">
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2.5 text-sm transition hover:bg-white/20 hover:text-[#d6a842]" title="LinkedIn">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2.5 text-sm transition hover:bg-white/20 hover:text-[#d6a842]" title="Facebook">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z"/></svg>
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2.5 text-sm transition hover:bg-white/20 hover:text-[#d6a842]" title="Instagram">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2.5 text-sm transition hover:bg-white/20 hover:text-[#d6a842]" title="YouTube">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
              {social.x && (
                <a href={social.x} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 p-2.5 text-sm transition hover:bg-white/20 hover:text-[#d6a842]" title="X (Twitter)">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-[#d6a842]">Quick Links</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services">ISO Services</Link>
            <Link href="/certifications">Certifications</Link>
            <Link href="/organizations">Certified Organizations</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-[#d6a842]">Support</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <Link href="/verify">Verify Certificate</Link>
            <Link href="/apply">Apply for Certification</Link>
            <Link href="/contact">Contact Us</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-[#d6a842]">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <a href={`mailto:${settings?.contactEmail || "gsrinternationalcertifications@gmail.com"}`} className="hover:text-[#d6a842]">
              {settings?.contactEmail || "gsrinternationalcertifications@gmail.com"}
            </a>
            <span>{settings?.contactNumber || "8008035779; 7075999265"}</span>
            {settings?.whatsapp && (
              <a href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#d6a842]">
                WhatsApp: {settings.whatsapp}
              </a>
            )}
            <span>{settings?.address || "India"}</span>
            {settings?.domain && <span className="text-xs opacity-60">{settings.domain}</span>}
            <a href="https://www.google.com/maps/place/GSR+Certification+Services/@17.5212625,78.378407,17z/data=!4m6!3m5!1s0x3bcb8d001aa3e61f:0x3f949da1ebd4c5e5!8m2!3d17.5212687!4d78.378339!16s%2Fg%2F11yhl6lmz7" target="_blank" rel="noopener noreferrer" className="hover:text-[#d6a842]">
              View on Google Maps
            </a>
          </div>
        </div>
      </div>
      <div className="container mt-12 border-t border-[#d6a842]/20 pt-6 text-xs text-white/50">
        &copy; {new Date().getFullYear()} GSR International Certifications. All Rights Reserved.
      </div>
    </footer>
  );
}
