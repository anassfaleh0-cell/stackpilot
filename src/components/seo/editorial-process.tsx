import Link from "next/link"
import { GlassCard } from "@/components/dynamic"
import { CheckCircle2, FileText, Star, Calendar, Users, Shield } from "lucide-react"

const steps = [
  { icon: <FileText size={14} />, label: "Research", description: "We analyze market data, vendor documentation, and user reviews before testing." },
  { icon: <Users size={14} />, label: "Hands-on Testing", description: "Every tool is tested for at least two weeks in realistic workflows by our team." },
  { icon: <Star size={14} />, label: "Scoring", description: "Nine-dimension rubric covering features, usability, pricing, support, security, integrations, performance, documentation, and scalability." },
  { icon: <CheckCircle2 size={14} />, label: "Verification", description: "Findings cross-referenced against G2, Capterra, and TrustRadius user reviews." },
  { icon: <Calendar size={14} />, label: "Review", description: "Each review is reviewed by a second analyst before publication." },
  { icon: <Shield size={14} />, label: "Independence", description: "No vendor can pay for placement or influence ratings." },
]

export function EEATProcess({ category }: { category?: string }) {
  return (
    <GlassCard>
      <div className="p-4">
        <h3 className="font-semibold mb-3 text-sm flex items-center gap-1.5">
          <FileText size={14} className="text-primary" />
          Our Editorial Process
        </h3>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          Every review on PilotStack follows a standardized six-step editorial process designed to ensure accuracy, fairness, and usefulness.
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
