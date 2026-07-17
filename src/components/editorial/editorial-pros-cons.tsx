import { slugSeed, seededRandom } from "./seed"

interface EditorialProsConsProps {
  pros: string[]
  cons: string[]
  slug: string
  className?: string
}

export function EditorialProsCons({ pros, cons, slug, className = "" }: EditorialProsConsProps) {
  const seed = slugSeed(slug)
  const rand = seededRandom(seed)
  const proPct = Math.round((pros.length / (pros.length + cons.length)) * 100)

  return (
    <div className={`grid sm:grid-cols-2 gap-5 ${className}`}>
      <div className="rounded-xl overflow-hidden relative border border-success-subtle bg-success-subtle/50">
        <svg className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]" viewBox="0 0 100 100" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <circle key={i} cx={20 + i * 15} cy={20 + i * 12} r={8 + i * 3} fill="var(--success)" />
          ))}
        </svg>
        <div className="relative p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <h3 className="font-semibold text-success text-sm">Pros</h3>
            <span className="text-xs ml-auto font-medium text-success">{proPct}%</span>
          </div>
          <div className="h-1.5 rounded-full mb-4 overflow-hidden bg-success-subtle" role="progressbar" aria-valuenow={proPct} aria-valuemin={0} aria-valuemax={100} aria-label="Pros percentage">
            <div className="h-full rounded-full bg-success transition-all" style={{ width: `${proPct}%` }} />
          </div>
          <ul className="space-y-2.5">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 8l-6 6-4-4" />
                </svg>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden relative border border-error-subtle bg-error-subtle/50">
        <svg className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]" viewBox="0 0 100 100" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1={10 + i * 18} y1={20 + i * 10} x2={30 + i * 15} y2={40 + i * 8} stroke="var(--error)" strokeWidth="2" />
          ))}
        </svg>
        <div className="relative p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            <h3 className="font-semibold text-error text-sm">Cons</h3>
            <span className="text-xs ml-auto font-medium text-error">{100 - proPct}%</span>
          </div>
          <div className="h-1.5 rounded-full mb-4 overflow-hidden bg-error-subtle" role="progressbar" aria-valuenow={100 - proPct} aria-valuemin={0} aria-valuemax={100} aria-label="Cons percentage">
            <div className="h-full rounded-full bg-error transition-all" style={{ width: `${100 - proPct}%` }} />
          </div>
          <ul className="space-y-2.5">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
