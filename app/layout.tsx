import type { Metadata } from "next"
import { Geist, Geist_Mono, DM_Serif_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { BRAND } from "@/lib/constants"
import { OrganizationJsonLd } from "@/components/seo/json-ld"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
})

export const metadata: Metadata = {
  metadataBase: new URL(`https://${BRAND.domain}`),
  title: {
    default: `${BRAND.name} - ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  // Self-referencing canonical for the homepage. Per-route pages override this
  // with their own path (alternates.canonical) so every URL points at itself.
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: BRAND.name,
  },
  twitter: {
    card: "summary_large_image",
  },
  // TODO(reviewer): add Google Search Console verification once Logan provides
  // the token, e.g. verification: { google: "<token>" }.
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dmSerifDisplay.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `history.scrollRestoration = "manual"; window.scrollTo(0, 0);`,
          }}
        />
      </head>
      <body className="bg-background text-foreground min-h-full flex flex-col">
        <OrganizationJsonLd />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
