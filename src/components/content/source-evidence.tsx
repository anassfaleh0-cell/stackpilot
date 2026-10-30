import type { SourceEvidence } from "@/types/content"

/** Dated documentation findings are separate from unverified legacy ratings. */
export function SourceEvidencePanel({ evidence }: { evidence?: SourceEvidence }) {
  if (!evidence || !evidence.facts.length) return null
  return (
    <section aria-label="Source-checked buying notes" className="mb-8 rounded-xl border border-border bg-card p-5">
      <h2 className="text-xl font-bold mb-2">Source-checked buying notes</h2>
      <p className="text-xs text-muted-foreground mb-3">Official documentation checked <time dateTime={evidence.checkedAt}>{evidence.checkedAt}</time></p>
      <p className="text-sm leading-relaxed mb-4">{evidence.summary}</p>
      <ul className="space-y-3 list-disc pl-5 text-sm">
        {evidence.facts.map((fact) => (
          <li key={fact.statement}>
            {fact.statement}{" "}
            <a href={fact.sourceUrl} className="underline underline-offset-2 text-primary">{fact.sourceLabel}</a>
          </li>
        ))}
      </ul>
      <h3 className="font-semibold mt-4 mb-1">What this means for your decision</h3>
      <p className="text-sm leading-relaxed">{evidence.buyerImplication}</p>
      <p className="text-xs text-muted-foreground mt-3">{evidence.limitation}</p>
    </section>
  )
}
