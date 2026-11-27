import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceWorker from "@/components/ServiceWorker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://linkstash.vercel.app"),
  title: {
    default: "LinkStash — Bookmark Dashboard & Link Manager",
    template: "%s | LinkStash",
  },
  description:
    "Private bookmark dashboard with search, tags, read-later, and duplicate cleanup. Import from Chrome/Firefox/Edge HTML or CSV. No account, no tracking — your library is a file you own.",
  keywords: [
    "bookmark manager",
    "bookmark dashboard",
    "link organizer",
    "save links",
    "private bookmarks",
    "tag bookmarks",
    "online bookmark manager free",
    "bookmark sync alternative",
  ],
  authors: [{ name: "LinkStash" }],
  creator: "LinkStash",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://linkstash.vercel.app",
    siteName: "LinkStash",
    title: "LinkStash — Bookmark Dashboard & Link Manager",
    description:
      "Save, tag, and search your links in a private bookmark dashboard. No account, no tracking, no uploads.",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkStash — Bookmark Dashboard & Link Manager",
    description:
      "Save, tag, and search your links in a private bookmark dashboard. No account, no tracking, no uploads.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#ea580c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ServiceWorker />
      </body>
    </html>
  );
}