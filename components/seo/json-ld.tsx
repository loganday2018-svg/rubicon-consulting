import { BRAND, SOCIAL } from "@/lib/constants"

/**
 * Structured data (schema.org JSON-LD) for richer Google results.
 * Server components that render a <script type="application/ld+json"> tag.
 */

const ORG_NAME = "Rubicon AI Consulting"
const BASE = `https://${BRAND.domain}`
// No standalone square logo asset exists in /public yet (only the generated OG
// card and third-party tool marks). TODO(reviewer): drop a square logo into
// /public and point LOGO_URL at it for a proper Organization/publisher logo.
const OG_IMAGE = `${BASE}/opengraph-image`
const LOGO_URL = OG_IMAGE

const FOUNDER_NAME = "Logan Day"
// Stable @id anchors so entities can reference each other across the graph.
const ORG_ID = `${BASE}/#organization`
const FOUNDER_ID = `${BASE}/#logan-day`

// sameAs profiles: the YouTube channel, the Substack newsletter, and LinkedIn.
const SAME_AS = SOCIAL.map((s) => s.href)

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": ORG_ID,
        name: ORG_NAME,
        url: BASE,
        logo: { "@type": "ImageObject", url: LOGO_URL },
        image: OG_IMAGE,
        description: BRAND.description,
        email: BRAND.email,
        serviceType: "AI implementation and training",
        areaServed: {
          "@type": "Country",
          name: "United States",
        },
        founder: {
          "@type": "Person",
          "@id": FOUNDER_ID,
          name: FOUNDER_NAME,
        },
        sameAs: SAME_AS,
      }}
    />
  )
}

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
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
          logo: { "@type": "ImageObject", url: LOGO_URL },
        },
        image: post.cover ?? OG_IMAGE,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        url,
      }}
    />
  )
}

/**
 * Person + ProfilePage graph for the About page. Ties the founder to the
 * organization (worksFor) and lists the same social profiles.
 */
export function PersonProfileJsonLd({
  name = FOUNDER_NAME,
  jobTitle = "Founder",
  description,
  image,
}: {
  name?: string
  jobTitle?: string
  description?: string
  image?: string
}) {
  const aboutUrl = `${BASE}/about`
  const person = {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name,
    jobTitle,
    ...(description ? { description } : {}),
    ...(image ? { image: image.startsWith("http") ? image : `${BASE}${image}` } : {}),
    url: aboutUrl,
    worksFor: {
      "@type": "ProfessionalService",
      "@id": ORG_ID,
      name: ORG_NAME,
      url: BASE,
    },
    sameAs: SAME_AS,
  }

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        url: aboutUrl,
        mainEntity: person,
      }}
    />
  )
}
