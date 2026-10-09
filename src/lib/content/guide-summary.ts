import type { GuideSection } from "@/types/content"
import { truncate } from "@/lib/utils"

export interface GuideKeyTakeaway {
  title: string
  summary: string
}

/** Build article-specific takeaways from real guide sections, not generic template claims. */
export function getGuideKeyTakeaways(
  sections: Pick<GuideSection, "title" | "body">[],
  limit = 5,
): GuideKeyTakeaway[] {
  if (!Array.isArray(sections) || limit < 1) return []
  return sections
    .filter((section) => section.title.trim() && section.body.trim())
    .slice(0, limit)
    .map((section) => ({
      title: section.title,
      summary: truncate(section.body, 180),
    }))
}
