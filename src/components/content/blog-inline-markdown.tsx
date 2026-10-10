import Link from "next/link"
import type { ReactNode } from "react"

/**
 * Render the inline Markdown subset used by editorial blog bodies.
 * Internal links stay same-origin; external HTTP(S) links open separately.
 */
export function renderBlogInlineMarkdown(text: string, keyBase: string): ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\((?:https?:\/\/[^)]+|\/(?!\/)[^)]+)\))/g)
  return tokens.map((token, index) => {
    const key = `${keyBase}-${index}`
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={key}>{token.slice(2, -2)}</strong>
    }

    const match = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (!match) return <span key={key}>{token}</span>

    const [, label, href] = match
    if (href.startsWith("/") && !href.startsWith("//")) {
      return <Link key={key} href={href} className="underline underline-offset-2 text-primary">{label}</Link>
    }
    if (/^https?:\/\//i.test(href)) {
      return <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-primary">{label}</a>
    }
    return <span key={key}>{token}</span>
  })
}
