import Link from "next/link"
import { getReadableLinkFallbackLabel } from "@/lib/content/link-label"
import type { ReactNode } from "react"

const ANCHOR_RE = /<a href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g

const INTERNAL_HREF_ALIASES: Record<string, string> = {
  // Legacy product-name link: point directly to the existing canonical review.
  "/reviews/acuity-scheduling": "/reviews/acuity",
}

// Review FAQs sometimes cite a source as a bare URL. Make the citation usable
// without interpreting arbitrary HTML or accepting unsafe URL schemes.
function renderPlainSegment(value: string, seed: number): ReactNode[] {
  const nodes: ReactNode[] = []
  const urlRe = /https?:\/\/[^\s<>"']+/gi
  let cursor = 0
  for (const match of value.matchAll(urlRe)) {
    const start = match.index ?? cursor
    if (start > cursor) nodes.push(value.slice(cursor, start))
    const url = match[0].replace(/[.,;:!?)]*$/, "")
    if (url) {
      nodes.push(
        <a key={"plain-" + seed + "-" + start} href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary transition-colors">
          {url}
        </a>,
      )
      cursor = start + url.length
    }
  }
  if (cursor < value.length) nodes.push(value.slice(cursor))
  return nodes
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
      parts.push(...renderPlainSegment(text.slice(lastIndex, match.index), key))
    }
    const originalHref = match[1]
    const href = INTERNAL_HREF_ALIASES[originalHref] || originalHref
    const label = match[2].trim() ? match[2] : getReadableLinkFallbackLabel(originalHref)
    const children = label.includes("<a ") ? renderSegments(label, key) : label
    if (/^https?:\/\//i.test(href)) {
      parts.push(
        <a key={key++} href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary transition-colors">
          {children}
        </a>
      )
    } else if (href.startsWith("/") && !href.startsWith("//")) {
      parts.push(
        <Link key={key++} href={href} className="underline underline-offset-2 hover:text-primary transition-colors">
          {children}
        </Link>
      )
    } else {
      // Do not turn unsafe, ambiguous or unsupported schemes into navigation.
      parts.push(<span key={key++}>{children}</span>)
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push(...renderPlainSegment(text.slice(lastIndex), key))
  }
  return parts
}

export function RichText({ text, className }: RichTextProps) {
  const parts = renderSegments(text, 0)
  return <span className={className}>{parts.length > 0 ? parts : text}</span>
}
