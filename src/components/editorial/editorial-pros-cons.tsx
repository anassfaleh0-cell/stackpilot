interface EditorialProsConsProps {
  pros: string[]
  cons: string[]
  slug: string
  className?: string
}

export function EditorialProsCons({ pros, cons, className = "" }: EditorialProsConsProps) {
  return (
    <div className={`grid sm:grid-cols-2 gap-5 ${className}`}>
      <div className="rounded-xl overflow-hidden relative border border-success-subtle bg-success-subtle/50">
        <div className="relative p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            <h3 className="font-semibold text-success text-sm">Pros</h3>
          </div>
          <ul className="space-y-2.5">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true">
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
        <div className="relative p-5">
          <div className="flex items-center gap-2 mb-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            <h3 className="font-semibold text-error text-sm">Cons</h3>
          </div>
          <ul className="space-y-2.5">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true">
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
