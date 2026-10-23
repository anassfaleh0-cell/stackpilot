import type { GuideSection } from "@/types/content"
import { truncate } from "@/lib/utils"

export interface GuideKeyTakeaway {
  title: string
  summary: string
}

/** Build article-specific takeaways from actual section prose or list items, never template claims. */
export function getGuideKeyTakeaways(
  sections: Pick<GuideSection, "title" | "body" | "items" | "columns" | "rows">[],
  limit = 5,
): GuideKeyTakeaway[] {
  if (!Array.isArray(sections) || limit < 1) return []
  return sections
    .map((section) => ({
      title: section.title,
      sourceText: [section.body, ...(section.items ?? []), ...(section.columns ?? []), ...((section.rows ?? []).flat())].filter(Boolean).join(" ").trim(),
    }))
    .filter((section) => section.title.trim() && section.sourceText.length > 0)
    .slice(0, limit)
    .map((section) => ({
      title: section.title,
      summary: truncate(section.sourceText, 180),
    }))
}
