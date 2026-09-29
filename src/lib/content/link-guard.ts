import { isContentAvailable } from "@/lib/content/registry"

const ROUTE_TYPE: Record<string, string> = {
  reviews: "review",
  comparisons: "comparison",
  guides: "guide",
  blog: "blog",
  glossary: "glossary",
  alternatives: "alternative",
  best: "best",
  "use-cases": "use-case",
  industries: "industry",
  research: "research",
  statistics: "statistic",
  hubs: "hub",
}

const ANCHOR = /<a href="(\/[^"<>#?]*)"[^>]*>([\s\S]*?)<\/a>/g

export function stripDeadContentLinks(html: string): string {
  if (!html) return html
  return html.replace(ANCHOR, (full, href: string, label: string) => {
    const seg = href.split("/").filter(Boolean)
    if (seg.length !== 2) return full
    const type = ROUTE_TYPE[seg[0]]
    if (!type) return full
    return isContentAvailable(type, seg[1]) ? full : label
  })
}
