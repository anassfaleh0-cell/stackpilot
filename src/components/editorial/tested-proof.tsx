import { GlassCard } from "@/components/dynamic"
import { Clock, Target, CheckCircle2, AlertTriangle } from "lucide-react"

interface TestFinding {
  label: string
  detail: string
  positive: boolean
}

interface TestedProofProps {
  toolName: string
  taskDescription: string
  testDate: string
  duration: string
  methodology: string[]
  screenshots: { src: string; alt: string; caption: string }[]
  findings: TestFinding[]
  verdict: string
  score: number
  category: string
}

export function TestedProof({
  toolName,
  taskDescription,
  testDate,
  duration,
  methodology,
  screenshots,
  findings,
  verdict,
  score,
  category,
}: TestedProofProps) {
  return (
    <section className="tested-proof mb-12">
      <div className="rounded-xl border border-primary/20 bg-primary-subtle/10 p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <svg
            aria-hidden="true"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <h2 className="text-2xl font-bold tracking-tight">
            I Tested {toolName} — Here&apos;s What Happened
          </h2>
        </div>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-4 border-b border-border/50">
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            Tested: {testDate}
          </span>
          <span className="flex items-center gap-1.5">
            <Target size={14} />
            Duration: {duration}
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Task: {taskDescription}
          </span>
          <span className="ml-auto font-semibold text-primary">{score}/10 score</span>
        </div>

        {/* Methodology */}
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-3">How I Tested</h3>
          <ul className="space-y-2">
            {methodology.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-subtle text-primary text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Screenshots */}
        {screenshots.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-sm mb-3">Screenshots from Testing</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {screenshots.map((shot, i) => (
                <figure key={i} className="rounded-xl overflow-hidden border border-border">
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    loading="lazy"
                    className="w-full h-auto"
                    width={600}
                    height={400}
                  />
                  <figcaption className="p-3 text-xs text-muted-foreground bg-card">
                    {shot.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* Findings */}
        <div className="mb-6">
          <h3 className="font-semibold text-sm mb-3">Key Findings</h3>
          <div className="space-y-3">
            {findings.map((finding, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  finding.positive
                    ? "bg-success-subtle/30 border border-success/10"
                    : "bg-warning-subtle/30 border border-warning/10"
                }`}
              >
                {finding.positive ? (
                  <CheckCircle2 size={16} className="text-success mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="text-warning mt-0.5 shrink-0" />
                )}
                <div>
                  <span className="font-medium text-sm">{finding.label}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{finding.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verdict */}
        <GlassCard>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="font-semibold text-sm">Verdict</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{verdict}</p>
          </div>
        </GlassCard>

        <p className="text-[11px] text-muted-foreground mt-4">
          This testing was conducted independently by the PilotStack team. No vendor compensation influenced this assessment. See our{" "}
          <a href="/methodology" className="text-primary hover:underline">
            full methodology
          </a>{" "}
          for details.
        </p>
      </div>
    </section>
  )
}
