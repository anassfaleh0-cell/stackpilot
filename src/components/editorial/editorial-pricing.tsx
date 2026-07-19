import { slugSeed, seededRandom } from "./seed"
import { getPalette } from "./palette"
import type { ReviewContent } from "@/types/content"

interface EditorialPricingProps {
  tool: ReviewContent
  className?: string
}

const planData: Record<string, { plans: { name: string; price: string; users: string; features: string[] }[] }> = {
  Freemium: {
    plans: [
      { name: "Free", price: "$0", users: "Up to 10 users", features: ["Core features", "Community support", "1 GB storage"] },
      { name: "Pro", price: "$12", users: "Per user/month", features: ["All features", "Priority support", "Unlimited storage", "API access"] },
      { name: "Business", price: "$29", users: "Per user/month", features: ["Everything in Pro", "SSO/SAML", "Audit logs", "99.9% SLA"] },
    ],
  },
  Paid: {
    plans: [
      { name: "Starter", price: "$15", users: "Per user/month", features: ["Core features", "Email support", "5 GB storage"] },
      { name: "Growth", price: "$39", users: "Per user/month", features: ["All features", "Priority support", "50 GB storage", "API access"] },
      { name: "Enterprise", price: "Custom", users: "Contact sales", features: ["Dedicated support", "Unlimited storage", "SSO/SAML", "Custom SLA"] },
    ],
  },
  "Free Trial": {
    plans: [
      { name: "Free Trial", price: "$0", users: "14-30 days", features: ["Full feature access", "Community support", "1 GB storage"] },
      { name: "Team", price: "$25", users: "Per user/month", features: ["All trial features", "Priority support", "10 GB storage", "Admin controls"] },
    ],
  },
}

export function EditorialPricing({ tool, className = "" }: EditorialPricingProps) {
  const seed = slugSeed(tool.slug)
  const rand = seededRandom(seed)
  const p = getPalette(tool.category)
  const tier = tool.pricing
  const plans = planData[tier]?.plans || planData.Paid.plans

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        <h3 className="font-semibold text-sm" style={{ color: p.primary }}>Pricing: {tool.pricing}</h3>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="rounded-xl p-4 transition-all hover:shadow-sm"
            style={{
              border: `1px solid ${p.glassBorder}`,
              backgroundColor: p.glassBg,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">{plan.name}</span>
              <span className="text-xs text-muted">{plan.users}</span>
            </div>
            <div className="text-2xl font-bold mb-3" style={{ color: p.primary }}>
              {plan.price}<span className="text-xs text-muted font-normal">/mo</span>
            </div>
            <ul className="space-y-1.5">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-1.5 text-xs text-muted">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={p.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
