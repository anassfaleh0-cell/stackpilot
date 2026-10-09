const MAX_TAKEAWAYS = 3
const MAX_TAKEAWAY_LENGTH = 220

/** Extracts concise, article-specific takeaways from authored prose. */
export function getBlogKeyTakeaways(body: string, limit = MAX_TAKEAWAYS): string[] {
  if (!Number.isFinite(limit) || limit <= 0 || !body.trim()) return []

  const seen = new Set<string>()
  const candidates = body
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0 && !/^#{1,6}\s/.test(block) && !/^\|/.test(block))
    .map((block) => block
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/^[-*+]\s+/, "")
      .replace(/\s+/g, " ")
      .trim())
    .filter((text) => text.length >= 55)

  const results: string[] = []
  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase()
    if (seen.has(normalized)) continue
    seen.add(normalized)
    const firstSentence = candidate.match(/^.{35,}?[.!?](?=\s|$)/)?.[0] ?? candidate
    const summary = firstSentence.length > MAX_TAKEAWAY_LENGTH
      ? firstSentence.slice(0, MAX_TAKEAWAY_LENGTH - 1).trimEnd() + "…"
      : firstSentence
    results.push(summary)
    if (results.length >= Math.floor(limit)) break
  }
  return results
}
