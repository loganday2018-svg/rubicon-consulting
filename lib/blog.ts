export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  category: string
  author: {
    name: string
    image: string
  }
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "claude-mobile-remote-control",
    title: "Claude Mobile & Remote Control: Start on Desktop, Finish From Your Phone",
    description:
      "Your AI doesn't clock out when you leave your desk. Here's how to run Claude from your phone and keep work moving from anywhere.",
    date: "April 6, 2026",
    readTime: "5 min read",
    category: "AI Tips",
    author: {
      name: "Logan Day",
      image: "/images/logan.jpg",
    },
  },
  {
    slug: "claude-power-user-tips",
    title: "Claude Power-User Tips: Plugins, Auto Mode & Scheduled Tasks",
    description:
      "Most teams stop at 'ask Claude a question, get an answer.' Three features that turn Claude from a chatbot into a workflow engine.",
    date: "March 30, 2026",
    readTime: "6 min read",
    category: "AI Tips",
    author: {
      name: "Logan Day",
      image: "/images/logan.jpg",
    },
  },
  {
    slug: "claude-team-features",
    title: "3 Claude Features That 10x Your Team's Output",
    description:
      "Skills, mobile Dispatch, and multi-agent workflows. The features that fundamentally change how teams operate.",
    date: "March 20, 2026",
    readTime: "7 min read",
    category: "AI Tips",
    author: {
      name: "Logan Day",
      image: "/images/logan.jpg",
    },
  },
]

export function getRelatedPosts(currentSlug: string): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== currentSlug)
}

/** A single legacy (hand-coded) post by slug. */
export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

/**
 * Article-typed OpenGraph + canonical metadata for a legacy post page.
 * Keeps every legacy page's <head> consistent: self-canonical, og:type=article,
 * publish date, author, and an explicit article card image (no generic fallback).
 */
export function legacyPostMetadata(slug: string) {
  const post = getBlogPost(slug)
  if (!post) return {}

  const d = new Date(post.date)
  const publishedTime = Number.isNaN(d.getTime()) ? undefined : d.toISOString()

  return {
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article" as const,
      publishedTime,
      modifiedTime: publishedTime,
      authors: [post.author.name],
      // No per-post cover asset exists for the legacy posts, so use the site's
      // real OG card explicitly and mark it as an article image.
      images: ["/opengraph-image"],
    },
  }
}
