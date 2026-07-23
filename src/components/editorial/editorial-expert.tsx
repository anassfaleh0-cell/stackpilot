import { GlassCard } from "./glass-card"

const reviewerProfiles: Record<string, { name: string; role: string; expertise: string; initials: string }> = {
  "Alex Chen": { name: "Alex Chen", role: "Editorial Director", expertise: "Developer Tools, Cloud Platforms, AI/ML", initials: "AC" },
  "Sarah Mitchell": { name: "Sarah Mitchell", role: "Senior Research Analyst", expertise: "CRM, Sales, Marketing Automation", initials: "SM" },
  "Marcus Williams": { name: "Marcus Williams", role: "Research Analyst", expertise: "Project Management, Productivity, Collaboration", initials: "MW" },
  "Priya Patel": { name: "Priya Patel", role: "Research Analyst", expertise: "Analytics, Data Platforms, BI Tools", initials: "PP" },
  "James O'Brien": { name: "James O'Brien", role: "Technical Writer", expertise: "Developer Tools, DevOps, Security", initials: "JO" },
  "Elena Torres": { name: "Elena Torres", role: "Research Analyst", expertise: "HR Tech, Finance, Compliance", initials: "ET" },
  "PilotStack Team": { name: "PilotStack Team", role: "Editorial Team", expertise: "Software Evaluation, Pricing Analysis, Market Research", initials: "PT" },
}

export function EditorialExpert({ author, reviewedAt }: { author: string; reviewedAt: string }) {
  const profile = reviewerProfiles[author] || {
    name: author,
    role: "Research Analyst",
    expertise: "Software Evaluation",
    initials: author.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase(),
  }

  return (
    <GlassCard>
      <div className="p-4">
        <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">Reviewer</h3>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xs font-bold shrink-0">
            {profile.initials}
          </div>
          <div>
            <p className="font-semibold text-sm">{profile.name}</p>
            <p className="text-xs text-muted-foreground">{profile.role}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Expertise:</span> {profile.expertise}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Reviewed: {reviewedAt}</p>
      </div>
    </GlassCard>
  )
}
