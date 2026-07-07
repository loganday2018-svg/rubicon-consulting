#!/usr/bin/env node
/**
 * Import Substack posts into content/blog/*.md.
 *
 * Reads the Substack RSS feed, converts each post's HTML body to markdown, and
 * writes a frontmatter markdown file the website renders through the [slug] route.
 * Idempotent: existing files are skipped unless --force is passed.
 *
 * Usage:
 *   node scripts/import-substack.mjs            # import new posts
 *   node scripts/import-substack.mjs --dry-run  # show what would happen, write nothing
 *   node scripts/import-substack.mjs --force     # overwrite existing files
 *
 * Env:
 *   SUBSTACK_FEED_URL  override the feed (default: logandayai.substack.com/feed)
 */
import fs from "node:fs"
import path from "node:path"
import Parser from "rss-parser"
import TurndownService from "turndown"
import matter from "gray-matter"

const FEED_URL =
  process.env.SUBSTACK_FEED_URL ?? "https://logandayai.substack.com/feed"
const POSTS_DIR = path.join(process.cwd(), "content", "blog")
// The site is the canonical home for imported posts, so each copy self-references
// its own URL on this domain (not the Substack original). Keep in sync with lib/constants.ts.
const SITE_ORIGIN = process.env.SITE_ORIGIN ?? "https://rubiconaiconsulting.com"

// Slugs owned by the original hand-coded pages — never overwrite these.
const LEGACY_SLUGS = new Set([
  "claude-mobile-remote-control",
  "claude-power-user-tips",
  "claude-team-features",
])

const args = process.argv.slice(2)
const DRY_RUN = args.includes("--dry-run")
const FORCE = args.includes("--force")

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
  emDelimiter: "*",
})

// Drop Substack's button/subscribe widgets rather than turning them into junk text.
turndown.addRule("dropButtons", {
  filter: (node) =>
    node.classList?.contains("button-wrapper") ||
    node.classList?.contains("subscribe-widget") ||
    node.getAttribute?.("data-component-name") === "SubscribeWidget",
  replacement: () => "",
})

function slugFromLink(link) {
  try {
    const parts = new URL(link).pathname.split("/").filter(Boolean)
    // Substack post URLs look like /p/<slug>
    return parts[parts.length - 1] || null
  } catch {
    return null
  }
}

function firstImage(html) {
  const m = html?.match(/<img[^>]+src=["']([^"']+)["']/i)
  return m ? m[1] : undefined
}

function toExcerpt(text, max = 180) {
  const clean = (text ?? "").replace(/\s+/g, " ").trim()
  if (clean.length <= max) return clean
  return clean.slice(0, max).replace(/\s+\S*$/, "") + "…"
}

// Best-effort removal of Substack's CTA boilerplate + the duplicated cover image.
function cleanMarkdown(md) {
  return md
    // Leading (optionally linked) image — duplicates the cover we render separately.
    .replace(/^\s*(\[\s*)?!\[[^\]]*\]\([^)]*\)(\s*\]\([^)]*\))?\s*/, "")
    // Inline "Thanks for reading … support my work." subscription nudge.
    .replace(/Thanks for reading[\s\S]*?support my work\.?/gi, "")
    // Standalone widget lines.
    .replace(/^\s*Subscribe (now|for free)[^\n]*$/gim, "")
    .replace(/^\s*(Share|Leave a comment|Give a gift subscription)\s*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function estimateReadTime(md) {
  const words = md.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}

async function main() {
  const parser = new Parser({
    customFields: { item: [["content:encoded", "contentEncoded"]] },
  })

  console.log(`Fetching ${FEED_URL} ...`)
  const feed = await parser.parseURL(FEED_URL)
  const items = feed.items ?? []
  console.log(`Feed has ${items.length} item(s).`)

  if (!DRY_RUN) fs.mkdirSync(POSTS_DIR, { recursive: true })

  let written = 0
  let skipped = 0

  for (const item of items) {
    const slug = slugFromLink(item.link ?? "")
    if (!slug) {
      console.warn(`! Skipping item with no resolvable slug: ${item.title}`)
      continue
    }
    if (LEGACY_SLUGS.has(slug)) {
      console.log(`- Skipping legacy slug: ${slug}`)
      skipped++
      continue
    }

    const filePath = path.join(POSTS_DIR, `${slug}.md`)
    if (fs.existsSync(filePath) && !FORCE) {
      console.log(`- Already imported: ${slug}`)
      skipped++
      continue
    }

    const html = item.contentEncoded ?? item.content ?? ""
    const body = cleanMarkdown(turndown.turndown(html))
    const isoDate = item.isoDate ?? new Date(item.pubDate ?? Date.now()).toISOString()

    const frontmatter = {
      title: item.title ?? slug,
      description: toExcerpt(item.contentSnippet ?? item.content ?? ""),
      date: isoDate.slice(0, 10),
      readTime: estimateReadTime(body),
      category: "AI Tips",
      substackUrl: item.link,
      // Self-canonical to the site's own copy so Google doesn't treat the
      // Substack original as the duplicate winner.
      canonical: `${SITE_ORIGIN}/blog/${slug}`,
      ...(firstImage(html) ? { cover: firstImage(html) } : {}),
    }

    const fileContents = matter.stringify(`\n${body}\n`, frontmatter)

    if (DRY_RUN) {
      console.log(`+ Would write ${slug}.md (${body.length} chars)`)
    } else {
      fs.writeFileSync(filePath, fileContents, "utf8")
      console.log(`+ Wrote ${slug}.md`)
    }
    written++
  }

  console.log(`\nDone. ${written} new, ${skipped} skipped.`)
}

main().catch((err) => {
  console.error("Import failed:", err)
  process.exit(1)
})
