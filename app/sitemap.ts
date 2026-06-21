import type { MetadataRoute } from 'next'
import { BRAND } from '@/lib/constants'
import { getAllPosts } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `https://${BRAND.domain}`
  const now = new Date()

  const pages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${baseUrl}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/demo`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]

  // All blog posts: the original hand-coded ones plus auto-synced Substack imports.
  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => {
    const d = new Date(post.date)
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: Number.isNaN(d.getTime()) ? now : d,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    }
  })

  return [...pages, ...posts]
}
