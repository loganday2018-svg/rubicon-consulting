import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

/**
 * Renders imported Substack markdown into the site's typographic style.
 * Pure server component — no client JS, no theme context needed.
 */

function isExternal(href?: string): boolean {
  return !!href && /^https?:\/\//.test(href)
}

const components: Components = {
  h2: ({ children }) => (
    <h2 className="mt-12 mb-4 font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-5 leading-relaxed text-slate-700">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-primary underline underline-offset-2 transition-opacity hover:opacity-80"
      {...(isExternal(href)
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="mt-5 list-disc space-y-2 pl-6 text-slate-700">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 list-decimal space-y-2 pl-6 text-slate-700">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-2 border-primary/30 pl-5 text-lg italic leading-relaxed text-slate-600">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-slate-200" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  code: ({ className, children }) => {
    // Block code carries a language- className; inline code does not.
    const isBlock = /language-/.test(className ?? "")
    if (isBlock) {
      return <code className={className}>{children}</code>
    }
    return (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800">
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm leading-relaxed text-slate-100">
      {children}
    </pre>
  ),
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : undefined}
      alt={alt ?? ""}
      loading="lazy"
      className="my-8 w-full rounded-lg border border-slate-200"
    />
  ),
}

export function MarkdownBody({ markdown }: { markdown: string }) {
  return (
    <div className="text-base md:text-lg">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
