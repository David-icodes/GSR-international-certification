"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const links = [
  { label: "Home", href: "/", id: "home" },
  { label: "About Us", href: "/about", id: "about" },
  { label: "ISO Services", href: "/services", id: "services" },
  { label: "Certifications", href: "/certifications", id: "certs" },
  { label: "Projects", href: "/organizations", id: "projects" },
  { label: "Verify Certificate", href: "/verify", id: "verify" },
  { label: "Contact", href: "/contact", id: "contact" }
];

function handleNavClick(href: string) {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#d6a842]/20 bg-[linear-gradient(90deg,#0b2d62_0%,#071b3f_52%,#020b1d_100%)] shadow-[0_10px_30px_rgba(2,11,29,0.24)]">
      <div className="header-shell flex h-[82px] items-center justify-between gap-5">
        <Link href="/" className="brand-lockup flex min-w-0 items-center gap-3" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <span className="grid h-[58px] w-[58px] shrink-0 place-items-center overflow-hidden rounded-full bg-white shadow-soft">
            <img src="/gsr-logo.png" alt="GSR International Certifications logo" className="h-[52px] w-[52px] object-contain" />
          </span>
          <span className="min-w-0">
            <span className="block max-w-[calc(100vw-112px)] truncate whitespace-nowrap font-sans text-[15px] font-extrabold uppercase leading-tight text-white sm:max-w-none sm:text-[20px] lg:text-[22px]">
              <span>GSR INTERNATIONAL CERTIFICATIONS</span>
            </span>
            <span className="mt-1 block max-w-[calc(100vw-112px)] truncate text-[11px] font-semibold leading-tight text-white/85 sm:max-w-none sm:text-[14px]">
              Global Standards | Integrity | Assurance
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-[14px] font-semibold text-white/90 xl:flex">
          {links.map(({ label, href, id }) => (
            <Link
              key={id}
              href={href}
              onClick={() => handleNavClick(href)}
              className="whitespace-nowrap transition hover:text-[#d6a842]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <button
          aria-label="Toggle navigation"
          className="grid h-11 w-11 shrink-0 place-items-center rounded border border-white/20 text-white xl:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={clsx("border-t border-[#d6a842]/20 bg-[#071b3f] text-white xl:hidden", open ? "block" : "hidden")}>
        <div className="container grid gap-1 py-4">
          {links.map(({ label, href, id }) => (
            <Link
              key={id}
              href={href}
              className="rounded px-3 py-3 text-sm font-semibold hover:bg-white/10"
              onClick={() => {
                setOpen(false);
                handleNavClick(href);
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/apply"
            className="mt-2 rounded bg-[#d6a842] px-4 py-3 text-center text-sm font-bold text-[#071b3f]"
            onClick={() => setOpen(false)}
          >
            Apply Now
          </Link>
        </div>
      </div>
    </header>
  );
}
