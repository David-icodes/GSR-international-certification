import type { Metadata } from "next";
import { Cinzel, Inter, Playfair_Display } from "next/font/google";
import { ScrollToTop } from "@/components/public/ScrollToTop";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-official", weight: ["600", "700", "800"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gsrinternationalcertifications.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GSR International Certifications | ISO Certification Services",
    template: "%s | GSR International Certifications"
  },
  description: "GSR International Certifications provides professional ISO certification services, compliance support, audit coordination, documentation assistance, and certificate verification services.",
  keywords: ["ISO certification", "ISO 9001", "certification services", "GSR International", "audit coordination", "compliance management", "certificate verification"],
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon-192.png", type: "image/png", sizes: "192x192" }],
    shortcut: "/favicon.ico",
    apple: [{ url: "/icon-192.png", sizes: "192x192" }]
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "GSR International Certifications",
    url: SITE_URL,
    title: "GSR International Certifications | ISO Certification Services",
    description: "GSR International Certifications provides professional ISO certification services, compliance support, audit coordination, documentation assistance, and certificate verification services.",
    images: [{ url: `${SITE_URL}/gsr-logo.png`, width: 200, height: 200, alt: "GSR International Certifications" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "GSR International Certifications",
    description: "GSR International Certifications provides professional ISO certification services, compliance support, audit coordination, documentation assistance, and certificate verification services.",
    images: [`${SITE_URL}/gsr-logo.png`]
  },
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: SITE_URL
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${cinzel.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "GSR International Certifications",
              url: SITE_URL,
              logo: `${SITE_URL}/gsr-logo.png`,
              description: "Professional ISO certification support, compliance management, audit coordination, documentation guidance, and verification services.",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+91-8008035779",
                contactType: "customer service",
                email: "gsrinternationalcertifications@gmail.com"
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Hyderabad",
                addressRegion: "Telangana",
                addressCountry: "IN"
              }
            })
          }}
        />
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}

