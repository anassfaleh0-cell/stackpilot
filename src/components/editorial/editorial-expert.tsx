import { GlassCard } from "./glass-card"
import { AuthorAvatar } from "./author-avatar"

const reviewerProfiles: Record<string, { name: string; role: string; expertise: string }> = {
  "PilotStack Team": { name: "PilotStack Team", role: "Editorial Team", expertise: "Software Evaluation, Pricing Analysis, Market Research" },
}

export function EditorialExpert({ author }: { author: string }) {
  const profile = reviewerProfiles[author] || {
    name: author,
    role: "Editorial Team",
    expertise: "Software Evaluation",
  }

  return (
    <GlassCard>
      <div className="p-4">
        <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">Editorial reviewer</h3>
        <div className="flex items-center gap-3 mb-2">
          <AuthorAvatar name={profile.name} size="sm" />
          <div>
            <p className="font-semibold text-sm">{profile.name}</p>
            <p className="text-xs text-muted-foreground">{profile.role}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Editorial focus:</span> {profile.expertise}
        </p>
      </div>
    </GlassCard>
  )
}
