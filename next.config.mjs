/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets the dev server accept requests from this LAN IP when testing on a
  // phone via `npm run dev -- --hostname 0.0.0.0` and visiting
  // http://192.168.0.85:3000. Without this, Next.js's dev server blocks
  // cross-origin requests to its internal assets (HMR, RSC payloads) as a
  // DNS-rebinding protection — the page loads but never finishes
  // hydrating, which is why taps appeared to do nothing.
  allowedDevOrigins: ["192.168.0.85"],
};

export default nextConfig;
