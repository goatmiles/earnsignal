import localFont from "next/font/local";

// Self-hosted, variable-weight fonts served from this repo (no runtime
// request to Google Fonts). Files were extracted once from the
// @fontsource-variable/inter and @fontsource-variable/geist-mono packages.

export const fontSans = localFont({
  src: "./fonts/inter-variable.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
});

export const fontMono = localFont({
  src: "./fonts/geist-mono-variable.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-geist-mono",
});
