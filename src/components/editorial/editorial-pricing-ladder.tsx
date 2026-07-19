import { slugSeed, seededRandom } from "./seed"
import { getPalette } from "./palette"
import type { ReviewContent } from "@/types/content"

interface EditorialPricingLadderProps {
  tool: ReviewContent
  className?: string
}

export function EditorialPricingLadder({ tool, className = "" }: EditorialPricingLadderProps) {
  const seed = slugSeed(tool.slug)
  const p = getPalette(tool.category)

  const tiers = getPricingTiers(tool)
  if (tiers.length < 2) return null

  const barW = 340
  const barH = 28
  const gap = 12
  const height = tiers.length * (barH + gap) + 40
  const gradId = `pl-grad-${tool.slug}`

  return (
    <div className={`rounded-xl p-5 ${className}`} style={{ border: `1px solid ${p.glassBorder}`, backgroundColor: p.glassBg }}>
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
        <h3 className="font-semibold text-sm" style={{ color: p.primary }}>Pricing Ladder</h3>
      </div>
      <svg viewBox={`0 0 ${barW + 80} ${height}`} className="w-full h-auto" role="img" aria-label="Pricing tier comparison ladder">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={p.primary} stopOpacity="0.15" />
            <stop offset="100%" stopColor={p.primary} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {tiers.map((tier, i) => {
          const y = 20 + i * (barH + gap)
          const w = barW * (1 - i * 0.12)
          const x = (barW - w) / 2 + 40
          return (
            <g key={i}>
              <rect x={x} y={y} width={w} height={barH} rx="6" fill={`url(#${gradId})`} stroke={p.primary} strokeOpacity="0.3" strokeWidth="0.5" />
              {i === tiers.length - 1 && (
                <rect x={x} y={y} width={w} height={barH} rx="6" fill="none" stroke={p.primary} strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="4,2" />
              )}
              <text x={x + 12} y={y + barH / 2 + 1} dominantBaseline="middle" fontSize="11" fontWeight="bold" fill="currentColor">{tier.name}</text>
              <text x={x + w - 12} y={y + barH / 2 + 1} dominantBaseline="middle" textAnchor="end" fontSize="11" fill={p.primary}>{tier.price}</text>
            </g>
          )
        })}
      </svg>
      <div className="space-y-1.5 mt-2">
        {tiers.map((tier, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">{tier.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{tier.features}</span>
              {i === tiers.length - 1 && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: p.primary + "20", color: p.primary }}>Best for most</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function getPricingTiers(tool: ReviewContent): { name: string; price: string; features: string }[] {
  const p = tool.pricing
  const r = tool.priceRange || ""
  const slug = tool.slug

  const tierMap: Record<string, { name: string; price: string; features: string }[]> = {
    "1password": [
      { name: "Individual", price: "$2.99/mo", features: "Unlimited passwords, 1 GB documents" },
      { name: "Families", price: "$4.99/mo", features: "5 users, shared vaults, guest access" },
      { name: "Business", price: "$7.99/user/mo", features: "Admin console, SSO, integrations" },
    ],
    "bitwarden": [
      { name: "Free", price: "$0", features: "Unlimited items, 2FA" },
      { name: "Premium", price: "$10/yr", features: "TOTP, emergency access, 1 GB files" },
      { name: "Enterprise", price: "$6/user/mo", features: "SCIM, SSO, event logging" },
    ],
    "mailchimp": [
      { name: "Free", price: "$0", features: "2,000 contacts, 10K emails/mo" },
      { name: "Essentials", price: "$13/mo", features: "5K contacts, A/B testing" },
      { name: "Standard", price: "$20/mo", features: "50K contacts, journeys, retargeting" },
    ],
    "freshbooks": [
      { name: "Lite", price: "$17/mo", features: "5 clients, unlimited invoices" },
      { name: "Plus", price: "$30/mo", features: "50 clients, recurring invoices" },
      { name: "Premium", price: "$55/mo", features: "Unlimited clients, multi-currency" },
    ],
    "xero": [
      { name: "Starter", price: "$13/mo", features: "20 invoices, 5 bills" },
      { name: "Growing", price: "$30/mo", features: "Unlimited, multi-currency, inventory" },
      { name: "Established", price: "$45/mo", features: "Custom reports, advanced analytics" },
    ],
    "rippling": [
      { name: "HR + Payroll", price: "$8-10/user/mo", features: "Core HR, global payroll" },
      { name: "HR + Payroll + IT", price: "$12-15/user/mo", features: "Device + app management" },
      { name: "Full Platform", price: "$15-20/user/mo", features: "HR + IT + finance" },
    ],
    "adp": [
      { name: "RUN", price: "$40-79/mo + per ee", features: "Small business payroll" },
      { name: "Workforce Now", price: "$5-15/ee/mo", features: "Mid-market HR + payroll" },
      { name: "Enterprise", price: "Custom", features: "Global payroll, dedicated support" },
    ],
    "sketch": [
      { name: "Standard", price: "$99 once", features: "Current version, 1 yr updates" },
      { name: "Business", price: "$10/editor/mo", features: "Cloud workspace, libraries" },
      { name: "Enterprise", price: "Custom", features: "SSO, admin controls, support" },
    ],
    "netlify": [
      { name: "Free", price: "$0", features: "100 GB bandwidth, 300 build min" },
      { name: "Pro", price: "$19/site/mo", features: "1 TB bandwidth, split testing" },
      { name: "Business", price: "$99/site/mo", features: "SAML SSO, 99.99% SLA" },
    ],
    "slack": [
      { name: "Free", price: "$0", features: "10 apps, 90-day history" },
      { name: "Pro", price: "$8.75/user/mo", features: "Unlimited history, group calls" },
      { name: "Business+", price: "$15/user/mo", features: "SSO, 99.99% SLA" },
      { name: "Enterprise Grid", price: "Custom", features: "Multi-workspace, compliance" },
    ],
    "bamboohr": [
      { name: "Core", price: "~$5.25/ee/mo", features: "Records, time-off, self-service" },
      { name: "Pro", price: "~$7-10/ee/mo", features: "ATS, performance, reporting" },
    ],
    "calndly": [
      { name: "Free", price: "$0", features: "1 event type, basic calendar" },
      { name: "Essentials", price: "$10/user/mo", features: "Unlimited events, payments" },
      { name: "Teams", price: "$16/user/mo", features: "Round-robin, workflows, CRM" },
    ],
    "google-analytics": [
      { name: "Standard", price: "$0", features: "10M events/mo, unlimited users" },
      { name: "Analytics 360", price: "$150K+/yr", features: "500M events, SLA, support" },
    ],
    "semrush": [
      { name: "Pro", price: "$129.95/mo", features: "5 projects, 500 keywords" },
      { name: "Guru", price: "$249.95/mo", features: "15 projects, content toolkit" },
      { name: "Business", price: "$499.95/mo", features: "40 projects, API, white-label" },
    ],
    "supabase": [
      { name: "Free", price: "$0", features: "500 MB DB, 50K MAU" },
      { name: "Pro", price: "$25/mo", features: "8 GB DB, 100K MAU" },
      { name: "Team", price: "$599/mo", features: "SOC 2, SSO, audit logs" },
    ],
    "ahrefs": [
      { name: "Lite", price: "$99/mo", features: "5 projects, 100 keywords" },
      { name: "Standard", price: "$199/mo", features: "20 projects, 750 keywords" },
      { name: "Advanced", price: "$399/mo", features: "50 projects, 200 keywords" },
    ],
    "quickbooks": [
      { name: "Simple Start", price: "$15/mo", features: "1 user, income/expense" },
      { name: "Plus", price: "$50/mo", features: "5 users, inventory, projects" },
      { name: "Advanced", price: "$100/mo", features: "25 users, analytics, API" },
    ],
    "salesforce": [
      { name: "Starter", price: "$25/user/mo", features: "Basic CRM, email integration" },
      { name: "Professional", price: "$80/user/mo", features: "Pipeline, forecasting" },
      { name: "Enterprise", price: "$165/user/mo", features: "Advanced analytics, AI" },
    ],
    "chatgpt": [
      { name: "Free", price: "$0", features: "GPT-3.5, limited GPT-5" },
      { name: "Plus", price: "$20/mo", features: "GPT-5, DALL-E, data analysis" },
      { name: "Team", price: "$25/user/mo", features: "Shared workspace, data privacy" },
    ],
    "asana": [
      { name: "Personal", price: "$0", features: "Unlimited tasks, list view" },
      { name: "Starter", price: "$10.99/user/mo", features: "Timeline, Gantt, workflow" },
      { name: "Advanced", price: "$24.99/user/mo", features: "Portfolios, goals, approvals" },
    ],
    "canva": [
      { name: "Free", price: "$0", features: "250K+ templates, 5 GB storage" },
      { name: "Pro", price: "$12.99/mo", features: "Brand kit, 1 TB storage" },
      { name: "Teams", price: "$14.99/mo/user", features: "Team folders, collaboration" },
    ],
    "docker": [
      { name: "Personal", price: "$0", features: "Unlimited public repos" },
      { name: "Pro", price: "$7/mo", features: "200 pulls/hr, vulnerability scans" },
      { name: "Team", price: "$12/user/mo", features: "Rate limit increases, audit" },
    ],
    "figma": [
      { name: "Free", price: "$0", features: "3 files, unlimited viewers" },
      { name: "Professional", price: "$15/editor/mo", features: "Unlimited files, libraries" },
      { name: "Organization", price: "$45/editor/mo", features: "SSO, audit, enterprise" },
    ],
    "firebase": [
      { name: "Spark", price: "$0", features: "1 GB storage, 10 GB transfer" },
      { name: "Blaze", price: "Pay-as-you-go", features: "Usage-based pricing" },
      { name: "Enterprise", price: "Custom", features: "Dedicated support, SLA" },
    ],
    "github": [
      { name: "Free", price: "$0", features: "Unlimited repos, 2 GB storage" },
      { name: "Team", price: "$4/user/mo", features: "Advanced collaboration" },
      { name: "Enterprise", price: "$21/user/mo", features: "SSO, compliance, support" },
    ],
    "gitlab": [
      { name: "Free", price: "$0", features: "Unlimited repos, 5 GB storage" },
      { name: "Premium", price: "$19/user/mo", features: "Advanced CI/CD, merge trains" },
      { name: "Ultimate", price: "$29/user/mo", features: "Security scanning, compliance" },
    ],
    "gusto": [
      { name: "Simple", price: "$40/mo + $6/ee", features: "Payroll, benefits" },
      { name: "Plus", price: "$60/mo + $9/ee", features: "PTO, time tracking" },
      { name: "Premium", price: "$80/mo + $12/ee", features: "HR advisory, compliance" },
    ],
    "hubspot": [
      { name: "Free", price: "$0", features: "Basic CRM, live chat" },
      { name: "Starter", price: "$20/mo", features: "Email marketing, pipelines" },
      { name: "Professional", price: "$100/mo", features: "Automation, sequences" },
    ],
    "jasper": [
      { name: "Creator", price: "$49/mo", features: "1 brand voice, 35K words" },
      { name: "Teams", price: "$99/mo", features: "3 seats, 100K words" },
      { name: "Business", price: "$499/mo", features: "Custom, API access" },
    ],
    "jira": [
      { name: "Free", price: "$0", features: "10 users, 2 GB storage" },
      { name: "Standard", price: "$8.15/user/mo", features: "Advanced roadmaps, automation" },
      { name: "Premium", price: "$16.25/user/mo", features: "AI, sandbox, analytics" },
    ],
    "linear": [
      { name: "Free", price: "$0", features: "Up to 10 users" },
      { name: "Team", price: "$10/user/mo", features: "Projects, custom workflows" },
      { name: "Enterprise", price: "Custom", features: "SSO, audit, support" },
    ],
    "microsoft-teams": [
      { name: "Free", price: "$0", features: "60 min calls, 10 GB storage" },
      { name: "Business Basic", price: "$6/user/mo", features: "300 min, 1 TB storage" },
      { name: "Business Premium", price: "$22/user/mo", features: "Advanced security, compliance" },
    ],
    "mixpanel": [
      { name: "Free", price: "$0", features: "20M events, limited seats" },
      { name: "Growth", price: "$28/mo", features: "Advanced analysis, cohorts" },
      { name: "Enterprise", price: "Custom", features: "SSO, data governance, SLA" },
    ],
    "monday-com": [
      { name: "Free", price: "$0", features: "2 seats, unlimited boards" },
      { name: "Basic", price: "$10/seat/mo", features: "Timeline, Gantt, calendar" },
      { name: "Pro", price: "$20/seat/mo", features: "Automation, integrations" },
    ],
    "notion": [
      { name: "Free", price: "$0", features: "7-day history, file uploads" },
      { name: "Plus", price: "$10/user/mo", features: "Unlimited history, API" },
      { name: "Business", price: "$18/user/mo", features: "SAML SSO, team spaces" },
    ],
    "stripe": [
      { name: "Pay-as-you-go", price: "2.9% + $0.30", features: "All core payments" },
      { name: "Enterprise", price: "Custom", features: "Volume pricing, dedicated support" },
    ],
    "vercel": [
      { name: "Free", price: "$0", features: "100 GB bandwidth, 6000 min" },
      { name: "Pro", price: "$20/team/mo", features: "Unlimited sites, analytics" },
      { name: "Enterprise", price: "Custom", features: "SLA, SSO, support" },
    ],
    "zoom": [
      { name: "Free", price: "$0", features: "40 min meetings, 100 participants" },
      { name: "Pro", price: "$15.99/host/mo", features: "30 hrs, 100 participants" },
      { name: "Business", price: "$22.99/host/mo", features: "300 participants, transcripts" },
    ],
  }

  return tierMap[slug] || [
    { name: "Entry", price: r, features: "Basic features" },
    { name: "Mid-tier", price: r, features: "Advanced features" },
    { name: "Enterprise", price: r, features: "Full platform" },
  ]
}
