import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import { CTASection } from "@/components/marketing/cta-section"
import { ArticleShell } from "@/components/marketing/article-shell"
import { MarkdownBody } from "@/components/marketing/markdown-body"
import { getMarkdownSlugs, getPostBySlug, getRelatedPosts } from "@/lib/posts"

export function generateStaticParams() {
  return getMarkdownSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
    alternates: post.canonical ? { canonical: post.canonical } : undefined,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      images: post.cover ? [post.cover] : undefined,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug)

  return (
    <>
      <ArticleShell>
        <article className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
            >
              <ArrowLeft size={14} />
              Back to Blog
            </Link>

            <header className="mt-8">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-medium text-primary">
                  {post.category}
                </span>
                <span className="text-slate-400">|</span>
                <time className="text-slate-500">{post.displayDate}</time>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500">{post.readTime}</span>
              </div>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                {post.title}
              </h1>
              {post.description && (
                <p className="mt-6 text-lg leading-relaxed text-slate-700">
                  {post.description}
                </p>
              )}
            </header>

            {post.cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover}
                alt=""
                className="mt-8 w-full rounded-xl border border-slate-200"
              />
            )}

            <div className="mt-10">
              <MarkdownBody markdown={post.body ?? ""} />
            </div>

            {post.substackUrl && (
              <p className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
                Originally published on{" "}
                <a
                  href={post.substackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-primary underline underline-offset-2 hover:opacity-80"
                >
                  Substack
                  <ExternalLink size={13} />
                </a>
                .
              </p>
            )}

            {related.length > 0 && (
              <section className="mt-16 border-t border-slate-200 pt-10">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Keep reading
                </h2>
                <div className="mt-5 space-y-4">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/blog/${r.slug}`}
                      className="group flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-primary/40"
                    >
                      <span className="font-medium text-foreground transition-colors group-hover:text-primary">
                        {r.title}
                      </span>
                      <ArrowRight
                        size={16}
                        className="shrink-0 text-primary transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </article>
      </ArticleShell>

      <CTASection />
    </>
  )
}
