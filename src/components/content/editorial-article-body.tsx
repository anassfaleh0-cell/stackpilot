import Link from "next/link"
import type { ReactNode } from "react"

// Render only known editorial HTML elements from committed content records.
// No raw HTML is injected into the DOM, and unsafe/unknown attributes are discarded.
const BLOCK_RE = /<(h2|h3|h4|p|ul|ol|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi
const INLINE_RE = /<(strong|b|em|i|code|a)\b([^>]*)>([\s\S]*?)<\/\1>/gi
const LIST_ITEM_RE = /<li\b[^>]*>([\s\S]*?)<\/li>/gi

function plainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
}

function renderInline(source: string): ReactNode[] {
  const result: ReactNode[] = []
  const re = new RegExp(INLINE_RE.source, "gi")
  let cursor = 0
  let match: RegExpExecArray | null
  while ((match = re.exec(source)) !== null) {
    if (match.index > cursor) result.push(plainText(source.slice(cursor, match.index)))
    const tag = match[1].toLowerCase()
    const children = renderInline(match[3])
    const key = match.index
    if (tag === "strong" || tag === "b") {
      result.push(<strong key={key} className="font-semibold text-foreground">{children}</strong>)
    } else if (tag === "em" || tag === "i") {
      result.push(<em key={key}>{children}</em>)
    } else if (tag === "code") {
      result.push(<code key={key} className="rounded bg-muted-bg px-1 py-0.5">{children}</code>)
    } else if (tag === "a") {
      const href = match[2].match(/\bhref=(["'])(.*?)\1/i)?.[2] || ""
      if (/^https?:\/\//i.test(href)) {
        result.push(<a key={key} href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">{children}</a>)
      } else if (href.startsWith("/") && !href.startsWith("//")) {
        result.push(<Link key={key} href={href} className="text-primary underline underline-offset-2">{children}</Link>)
      } else {
        result.push(...children)
      }
    }
    cursor = match.index + match[0].length
  }
  if (cursor < source.length) result.push(plainText(source.slice(cursor)))
  return result
}

export function EditorialArticleBody({ html }: { html?: string | null }) {
  if (!html?.trim()) return null

  // Ignore scripts, style blocks, comments, embeds and form markup stored in legacy HTML.
  const clean = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|svg|object|form|template)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
  const blocks: ReactNode[] = []
  for (const match of clean.matchAll(BLOCK_RE)) {
    const tag = match[1].toLowerCase()
    const body = match[2]
    const key = match.index
    if (tag === "h2") {
      blocks.push(<h3 key={key} className="text-xl font-bold tracking-tight">{renderInline(body)}</h3>)
    } else if (tag === "h3" || tag === "h4") {
      blocks.push(<h4 key={key} className="text-base font-semibold">{renderInline(body)}</h4>)
    } else if (tag === "p") {
      blocks.push(<p key={key} className="text-sm leading-7 text-muted-foreground">{renderInline(body)}</p>)
    } else if (tag === "blockquote") {
      blocks.push(<blockquote key={key} className="border-l-2 border-primary pl-4 text-sm italic text-muted-foreground">{renderInline(body)}</blockquote>)
    } else if (tag === "ul" || tag === "ol") {
      const items = [...body.matchAll(LIST_ITEM_RE)].map((item, i) =>
        <li key={i} className="pl-1">{renderInline(item[1])}</li>,
      )
      if (tag === "ul") blocks.push(<ul key={key} className="list-disc space-y-2 pl-6 text-sm leading-6 text-muted-foreground">{items}</ul>)
      else blocks.push(<ol key={key} className="list-decimal space-y-2 pl-6 text-sm leading-6 text-muted-foreground">{items}</ol>)
    }
  }
  if (blocks.length === 0) return null
  return (
    <section className="mb-10 space-y-5" aria-label="Detailed editorial analysis">
      <h2 className="text-2xl font-bold tracking-tight">Detailed buyer guide</h2>
      {blocks}
    </section>
  )
}
