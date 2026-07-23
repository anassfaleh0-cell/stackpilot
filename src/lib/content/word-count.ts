function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

function wordCount(text: string | undefined | null): number {
  if (!text) return 0
  return stripHtml(text).split(/\s+/).filter(Boolean).length
}

export interface CountableFields {
  title?: string | null
  description?: string | null
  verdict?: string | null
  features?: Array<{ tool1Detail?: string | null; tool2Detail?: string | null }>
  faqs?: Array<{ question?: string | null; answer?: string | null }>
}

export const THIN_THRESHOLD = 300

export function countRenderedWords(data: CountableFields): number {
  let total = 0
  total += wordCount(data.title)
  total += wordCount(data.description)
  total += wordCount(data.verdict)
  for (const f of data.features || []) {
    total += wordCount(f.tool1Detail)
    total += wordCount(f.tool2Detail)
  }
  for (const faq of data.faqs || []) {
    total += wordCount(faq.question)
    total += wordCount(faq.answer)
  }
  return total
}
