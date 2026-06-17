import { BRAND, SOCIAL } from "@/lib/constants"

/**
 * Structured data (schema.org JSON-LD) for richer Google results.
 * Server components that render a <script type="application/ld+json"> tag.
 */

const ORG_NAME = "Rubicon AI Consulting"
const BASE = `https://${BRAND.domain}`
// No standalone logo asset in /public; the generated OG image is a real, stable image URL.
const OG_IMAGE = `${BASE}/opengraph-image`

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: ORG_NAME,
        url: BASE,
        logo: OG_IMAGE,
        description: BRAND.description,
        email: BRAND.email,
        sameAs: SOCIAL.map((s) => s.href),
      }}
    />
  )
}

interface ArticleLike {
  title: string
  description: string
  date: string
  slug: string
  author: { name: string }
  cover?: string
}

export function ArticleJsonLd({ post }: { post: ArticleLike }) {
  const url = `${BASE}/blog/${post.slug}`
  const d = new Date(post.date)
  const datePublished = Number.isNaN(d.getTime()) ? undefined : d.toISOString()

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        ...(datePublished ? { datePublished, dateModified: datePublished } : {}),
        author: { "@type": "Person", name: post.author.name },
        publisher: {
          "@type": "Organization",
          name: ORG_NAME,
          logo: { "@type": "ImageObject", url: OG_IMAGE },
        },
        image: post.cover ?? OG_IMAGE,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        url,
      }}
    />
  )
}
