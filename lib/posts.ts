import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { BLOG_POSTS, type BlogPost } from "./blog"

/**
 * Unified blog post model. Two sources feed the blog:
 *  - "legacy"   : the original hand-coded React pages under app/(marketing)/blog/<slug>/.
 *                 Only their metadata lives in lib/blog.ts; they render from their own page.tsx.
 *  - "substack" : markdown files under content/blog/*.md, imported from the Substack RSS feed.
 *                 They render through the dynamic [slug] route.
 */
export interface Post extends BlogPost {
  source: "legacy" | "substack"
  /** Pre-formatted date for display (e.g. "June 16, 2026"). */
  displayDate: string
  /** Markdown body — present for "substack" posts only. */
  body?: string
  /** Canonical URL override. Omitted = the post is canonical to itself on this domain. */
  canonical?: string
  /** Optional cover image URL. */
  cover?: string
  /** Link back to the original Substack post, shown as an attribution line. */
  substackUrl?: string
}

const POSTS_DIR = path.join(process.cwd(), "content", "blog")

function formatDate(value: string): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
}

function toTime(value: string): number {
  const t = new Date(value).getTime()
  return Number.isNaN(t) ? 0 : t
}

function estimateReadTime(markdown: string): string {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}

function readMarkdownPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "")
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8")
      const { data, content } = matter(raw)
      const date: string = data.date ?? ""

      return {
        slug,
        title: data.title ?? slug,
        description: data.description ?? "",
        date,
        displayDate: data.displayDate ?? formatDate(date),
        readTime: data.readTime ?? estimateReadTime(content),
        category: data.category ?? "AI Tips",
        author: {
          name: data.authorName ?? "Logan Day",
          image: data.authorImage ?? "/images/logan.jpg",
        },
        source: "substack",
        body: content,
        canonical: data.canonical,
        cover: data.cover,
        substackUrl: data.substackUrl,
      } satisfies Post
    })
}

/** All posts (legacy + imported), newest first. Used by the blog index. */
export function getAllPosts(): Post[] {
  const legacy: Post[] = BLOG_POSTS.map((p) => ({
    ...p,
    source: "legacy",
    displayDate: p.date,
  }))
  return [...legacy, ...readMarkdownPosts()].sort(
    (a, b) => toTime(b.date) - toTime(a.date),
  )
}

/** Slugs of imported markdown posts — drives generateStaticParams for [slug]. */
export function getMarkdownSlugs(): string[] {
  return readMarkdownPosts().map((p) => p.slug)
}

/** A single imported markdown post (legacy posts are served by their own routes). */
export function getPostBySlug(slug: string): Post | undefined {
  return readMarkdownPosts().find((p) => p.slug === slug)
}

/** A couple of other posts to suggest at the end of an article. */
export function getRelatedPosts(slug: string, limit = 2): Post[] {
  return getAllPosts()
    .filter((p) => p.slug !== slug)
    .slice(0, limit)
}
