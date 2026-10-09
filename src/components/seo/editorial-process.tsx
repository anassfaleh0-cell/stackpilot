import Link from "next/link"
import { GlassCard } from "@/components/dynamic"
import { CheckCircle2, FileText, Star, Calendar, ListChecks, Shield } from "lucide-react"

const steps = [
  { icon: <FileText size={14} />, label: "Sources", description: "Pages draw on PilotStack’s recorded tool dataset. Vendor documentation is the preferred source for current plan details; fields without a verified source should be treated as unconfirmed." },
  { icon: <Star size={14} />, label: "Scoring", description: "Recorded category ratings are averaged into the displayed overall score. See the methodology for the calculation and the limits of the underlying data." },
  { icon: <ListChecks size={14} />, label: "Consistency", description: "The same figure is used wherever a tool appears, so ratings and review counts agree across the site." },
  { icon: <Calendar size={14} />, label: "Dating", description: "Pages display the recorded update date; that date does not guarantee every product fact was independently rechecked." },
  { icon: <CheckCircle2 size={14} />, label: "Limits", description: "Facts we cannot source are left off the page or marked unverified rather than stated as confirmed." },
  { icon: <Shield size={14} />, label: "Editorial separation", description: "Commercial relationships do not determine editorial ratings, rankings, or inclusion criteria." },
]

export function EEATProcess({ category }: { category?: string }) {
  void category
  return (
    <GlassCard>
      <div className="p-4">
        <h3 className="font-semibold mb-3 text-sm flex items-center gap-1.5">
          <FileText size={14} className="text-primary" />
          How This Page Is Built
        </h3>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          PilotStack publishes its scoring rules, sourcing limitations, and editorial independence policy so readers can understand how to interpret the recorded data.
        </p>
        <div className="space-y-2.5">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-subtle text-primary shrink-0 mt-0.5">
                {step.icon}
              </span>
              <div>
                <p className="text-xs font-medium">{step.label}</p>
                <p className="text-[11px] text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-border">
          <Link href="/methodology" className="text-xs text-primary hover:underline">
            Full editorial methodology &rarr;
          </Link>
        </div>
      </div>
    </GlassCard>
  )
}
