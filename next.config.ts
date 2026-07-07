import type { NextConfig } from "next"
import { BRAND } from "./lib/constants"

const nextConfig: NextConfig = {
  // Canonical host is the apex domain (rubiconaiconsulting.com).
  // Permanently redirect the www subdomain to the apex so search engines
  // and users converge on a single host. NOTE: Vercel Domains should also
  // mark the apex as primary (dashboard step, handled by the reviewer).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${BRAND.domain}` }],
        destination: `https://${BRAND.domain}/:path*`,
        permanent: true,
      },
    ]
  },
}

export default nextConfig
