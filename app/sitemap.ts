import type { MetadataRoute } from 'next'
import fs from 'node:fs'
import path from 'node:path'
import { BRAND } from '@/lib/constants'
import { getAllPosts } from '@/lib/posts'

/**
 * lastModified uses each route's source-file mtime at build time, so the
 * sitemap reflects real edit dates instead of "now" on every deploy. Posts
 * carry their own publish date. Falls back to build time if a file is missing.
 */
const APP_DIR = path.join(process.cwd(), 'app', '(marketing)')
const BUILD_TIME = new Date()

function fileModified(relativePath: string): Date {
  try {
    return fs.statSync(path.join(APP_DIR, relativePath)).mtime
  } catch {
    return BUILD_TIME
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `https://${BRAND.domain}`

  const pages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: fileModified('page.tsx'), changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/services`, lastModified: fileModified('services/page.tsx'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/private-equity`, lastModified: fileModified('private-equity/page.tsx'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/demo`, lastModified: fileModified('demo/page.tsx'), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/calculator`, lastModified: fileModified('calculator/page.tsx'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: fileModified('about/page.tsx'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: fileModified('blog/page.tsx'), changeFrequency: 'weekly', priority: 0.8 },
  ]

  // All blog posts: the original hand-coded ones plus auto-synced Substack imports.
  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => {
    const d = new Date(post.date)
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: Number.isNaN(d.getTime()) ? BUILD_TIME : d,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    }
  })

  return [...pages, ...posts]
}
