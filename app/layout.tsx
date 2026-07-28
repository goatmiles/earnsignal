import type { Metadata, Viewport } from "next";

import { fontSans, fontMono } from "./fonts";
import "./globals.css";

const description =
  "EarnSignal is an interactive prototype that helps people discover realistic ways to earn money, weigh the evidence and risk behind each one, compare opportunities side by side, and track a simple 7-day test plan. Illustrative sample data throughout — not live, verified, or guaranteed income.";

export const metadata: Metadata = {
  title: {
    default: "EarnSignal — Evidence-based income opportunities (prototype)",
    template: "%s · EarnSignal",
  },
  description,
  openGraph: {
    title: "EarnSignal — Evidence-based income opportunities (prototype)",
    description,
    siteName: "EarnSignal",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0d10",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
