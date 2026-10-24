import Link from "next/link"
import type { ReactNode } from "react"

const ANCHOR_RE = /<a href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g

const INTERNAL_HREF_ALIASES: Record<string, string> = {
  // Legacy product-name link: point directly to the existing canonical review.
  "/reviews/acuity-scheduling": "/reviews/acuity",
}

interface RichTextProps {
  text: string
  className?: string
}

function renderSegments(text: string, baseKey: number): ReactNode[] {
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = baseKey
  const re = new RegExp(ANCHOR_RE.source, "g")
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const originalHref = match[1]
    const href = INTERNAL_HREF_ALIASES[originalHref] || originalHref
    const label = match[2]
    const children = label.includes("<a ") ? renderSegments(label, key) : label
    if (href.startsWith("http")) {
      parts.push(
        <a key={key++} href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary transition-colors">
          {children}
        </a>
      )
    } else {
      parts.push(
        <Link key={key++} href={href} className="underline underline-offset-2 hover:text-primary transition-colors">
          {children}
        </Link>
      )
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts
}

export function RichText({ text, className }: RichTextProps) {
  const parts = renderSegments(text, 0)
  return <span className={className}>{parts.length > 0 ? parts : text}</span>
}
