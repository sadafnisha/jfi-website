import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SiteChrome from "@/components/SiteChrome";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: {
    default: `${site.name} (${site.shortName})`,
    template: `%s | ${site.name} (${site.shortName})`,
  },
  description:
    "Justice Front of India (JFI) is committed to promoting justice, equality, human rights, and constitutional values in India.",
  icons: { icon: "/jfi-logo.png", apple: "/jfi-logo.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171D55",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-navy"
        >
          Skip to main content
        </a>
        <SiteChrome nav={<Navbar />} footer={<Footer />}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
