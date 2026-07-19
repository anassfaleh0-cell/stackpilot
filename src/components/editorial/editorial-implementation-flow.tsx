import { slugSeed, seededRandom } from "./seed"
import { getPalette } from "./palette"
import type { ReviewContent } from "@/types/content"

interface EditorialImplementationFlowProps {
  tool: ReviewContent
  className?: string
}

export function EditorialImplementationFlow({ tool, className = "" }: EditorialImplementationFlowProps) {
  const seed = slugSeed(tool.slug)
  const p = getPalette(tool.category)

  const steps = getImplementationSteps(tool.slug)
  if (steps.length < 2) return null

  const stepW = 80
  const r = 14
  const gap = 20
  const totalW = steps.length * (stepW + gap) - gap + 40
  const height = 160
  const gradId = `if-grad-${tool.slug}`
  const arrId = `if-arr-${tool.slug}`

  return (
    <div className={`rounded-xl p-5 ${className}`} style={{ border: `1px solid ${p.glassBorder}`, backgroundColor: p.glassBg }}>
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={p.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <h3 className="font-semibold text-sm" style={{ color: p.primary }}>Implementation Flow</h3>
      </div>
      <svg viewBox={`0 0 ${totalW} ${height}`} className="w-full h-auto" role="img" aria-label="Implementation process flow diagram">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={p.primary} stopOpacity="0.2" />
            <stop offset="100%" stopColor={p.primary} stopOpacity="0.05" />
          </linearGradient>
          <marker id={arrId} markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill={p.primary} fillOpacity="0.3" />
          </marker>
        </defs>
        {steps.map((step, i) => {
          const cx = 20 + i * (stepW + gap) + stepW / 2
          const cy = 30
          const boxY = 50
          const boxH = 90
          return (
            <g key={i}>
              {i < steps.length - 1 && (
                <line x1={cx + stepW / 2} y1={cy} x2={cx + stepW / 2 + gap} y2={cy} stroke={p.primary} strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3,2" markerEnd={`url(#${arrId})`} />
              )}
              <circle cx={cx} cy={cy} r={r} fill={`url(#${gradId})`} stroke={p.primary} strokeOpacity="0.4" strokeWidth="1" />
              <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fontSize="10" fontWeight="bold" fill={p.primary}>{i + 1}</text>
              <rect x={cx - stepW / 2} y={boxY} width={stepW} height={boxH} rx="6" fill="currentColor" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.5" />
              <text x={cx} y={boxY + 20} textAnchor="middle" dominantBaseline="middle" fontSize="8" fontWeight="bold" fill="currentColor">{step.phase}</text>
              <text x={cx} y={boxY + 38} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill={p.primary}>{step.duration}</text>
              <text x={cx} y={boxY + 62} textAnchor="middle" fontSize="6.5" fill="currentColor" fillOpacity="0.5" style={{ lineHeight: "1.4" }}>
                {wrapText(step.desc, 12).map((line, li) => (
                  <tspan key={li} x={cx} dy={li === 0 ? 0 : 9}>{line}</tspan>
                ))}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    if ((current + " " + word).trim().length <= maxChars) {
      current = (current + " " + word).trim()
    } else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

function getImplementationSteps(slug: string): { phase: string; duration: string; desc: string }[] {
  const map: Record<string, { phase: string; duration: string; desc: string }[]> = {
    "1password": [
      { phase: "Install", duration: "10 min", desc: "Download app, create account, import passwords" },
      { phase: "Configure", duration: "2-4 hrs", desc: "Set up vaults, 2FA, browser extensions" },
      { phase: "Share", duration: "1 hr", desc: "Invite family/team, set up shared vaults" },
    ],
    "bitwarden": [
      { phase: "Create Account", duration: "5 min", desc: "Sign up, set master password" },
      { phase: "Install Extensions", duration: "10 min", desc: "Browser extensions, mobile app" },
      { phase: "Import Passwords", duration: "15 min", desc: "CSV import from other managers" },
    ],
    "mailchimp": [
      { phase: "Account Setup", duration: "2-4 hrs", desc: "Brand settings, sender identity" },
      { phase: "Import Contacts", duration: "1-2 hrs", desc: "CSV import, segmentation setup" },
      { phase: "First Campaign", duration: "1-2 hrs", desc: "Template design, send test" },
    ],
    "freshbooks": [
      { phase: "Account Setup", duration: "1-2 hrs", desc: "Business profile, invoice template" },
      { phase: "Connect Bank", duration: "30 min", desc: "Bank account, credit card sync" },
      { phase: "Send First Invoice", duration: "15 min", desc: "Create client, send invoice" },
    ],
    "xero": [
      { phase: "Configure", duration: "4-8 hrs", desc: "Chart of accounts, tax rates" },
      { phase: "Connect Banks", duration: "1-2 hrs", desc: "Bank feeds, credit cards" },
      { phase: "Import Data", duration: "2-8 hrs", desc: "Open balances, contacts, migration" },
    ],
    "rippling": [
      { phase: "HR Core Setup", duration: "2-4 weeks", desc: "Employee data, payroll config" },
      { phase: "IT Integration", duration: "2-4 weeks", desc: "SSO, MDM, app provisioning" },
      { phase: "Finance Module", duration: "2-3 weeks", desc: "Expense policies, spend controls" },
    ],
    "adp": [
      { phase: "Discovery", duration: "4-8 weeks", desc: "Requirements, data mapping" },
      { phase: "Configuration", duration: "8-16 weeks", desc: "Payroll setup, time tracking" },
      { phase: "Parallel Run", duration: "4-8 weeks", desc: "Live parallel payroll validation" },
    ],
    "sketch": [
      { phase: "Download", duration: "5 min", desc: "Install macOS app, activate license" },
      { phase: "Install Plugins", duration: "30 min", desc: "Stark, Anima, Iconscout" },
      { phase: "Set Up Libraries", duration: "2-4 hrs", desc: "Shared library, design system" },
    ],
    "netlify": [
      { phase: "Connect Git Repo", duration: "15 min", desc: "GitHub/GitLab/Bitbucket link" },
      { phase: "Configure Build", duration: "15 min", desc: "Build command, publish directory" },
      { phase: "Custom Domain", duration: "30 min", desc: "DNS config, HTTPS provisioning" },
    ],
    "slack": [
      { phase: "Workspace Setup", duration: "2-4 hrs", desc: "Channel structure, integrations" },
      { phase: "Configure SSO", duration: "1-2 days", desc: "SAML, SCIM, deprovisioning" },
      { phase: "Launch & Train", duration: "1-2 weeks", desc: "Team onboarding, channel strategy" },
    ],
    "bamboohr": [
      { phase: "Data Migration", duration: "1-2 weeks", desc: "Employee records, time-off mapping" },
      { phase: "Configure", duration: "1-2 weeks", desc: "Custom fields, permissions, policies" },
      { phase: "Go Live", duration: "1-2 weeks", desc: "Training, parallel processing" },
    ],
    "calndly": [
      { phase: "Create Account", duration: "10 min", desc: "Calendar connection, profile setup" },
      { phase: "Event Types", duration: "20 min", desc: "Duration, buffer, availability rules" },
      { phase: "Team Setup", duration: "1-2 hrs", desc: "Round-robin, routing forms" },
    ],
    "google-analytics": [
      { phase: "Property Setup", duration: "1-2 hrs", desc: "GA4 property, data stream" },
      { phase: "Tag Installation", duration: "2-4 hrs", desc: "GTM config, event setup" },
      { phase: "Conversion Setup", duration: "4-8 hrs", desc: "Goals, e-commerce, BigQuery" },
    ],
    "semrush": [
      { phase: "Account & Project", duration: "4-8 hrs", desc: "Project setup, domain linking" },
      { phase: "Position Tracking", duration: "2-4 hrs", desc: "Keyword list, competitor setup" },
      { phase: "Content Toolkit", duration: "4-8 hrs", desc: "Topic research, writing assistant" },
    ],
    "supabase": [
      { phase: "Create Project", duration: "10 min", desc: "Dashboard setup, region selection" },
      { phase: "Database Schema", duration: "2-4 hrs", desc: "SQL editor, table design" },
      { phase: "Auth & RLS", duration: "4-8 hrs", desc: "OAuth providers, security policies" },
    ],
    "ahrefs": [
      { phase: "Project Setup", duration: "1-2 hrs", desc: "Domain, crawl settings, integrations" },
      { phase: "Keyword Research", duration: "4-8 hrs", desc: "Keyword list, competitor gap analysis" },
      { phase: "Site Audit", duration: "1-2 hrs", desc: "Technical audit, priority fixes" },
    ],
    "quickbooks": [
      { phase: "Account Setup", duration: "1-2 hrs", desc: "Business profile, chart of accounts" },
      { phase: "Bank Connection", duration: "30 min", desc: "Bank feeds, credit card sync" },
      { phase: "Import Data", duration: "2-8 hrs", desc: "Customers, vendors, products" },
    ],
    "salesforce": [
      { phase: "Org Setup", duration: "1-2 weeks", desc: "Org configuration, user setup" },
      { phase: "Data Migration", duration: "2-6 weeks", desc: "Contacts, accounts, opportunities" },
      { phase: "Customization", duration: "4-12 weeks", desc: "Fields, page layouts, automation" },
    ],
    "chatgpt": [
      { phase: "Create Account", duration: "5 min", desc: "Email sign-up, plan selection" },
      { phase: "Custom Instructions", duration: "10 min", desc: "Preferences, context, goals" },
      { phase: "Custom GPTs", duration: "30-60 min", desc: "Knowledge files, actions setup" },
    ],
    "asana": [
      { phase: "Workspace Setup", duration: "1-2 hrs", desc: "Teams, projects, fields" },
      { phase: "Import Tasks", duration: "1-2 hrs", desc: "CSV import, template setup" },
      { phase: "Automation", duration: "2-4 hrs", desc: "Rules, workflows, integrations" },
    ],
    "canva": [
      { phase: "Create Account", duration: "5 min", desc: "Sign up, brand kit setup" },
      { phase: "Brand Kit", duration: "30 min", desc: "Logo, colors, fonts, templates" },
      { phase: "Team Invite", duration: "15 min", desc: "Folders, permissions, templates" },
    ],
    "docker": [
      { phase: "Install Docker", duration: "15 min", desc: "Docker Desktop, CLI setup" },
      { phase: "First Container", duration: "30 min", desc: "Pull image, run container" },
      { phase: "Compose Setup", duration: "2-4 hrs", desc: "docker-compose.yml, multi-service" },
    ],
    "figma": [
      { phase: "Create Account", duration: "5 min", desc: "Sign up, team workspace setup" },
      { phase: "Set Up Libraries", duration: "1-2 hrs", desc: "Design system, components" },
      { phase: "Team Invite", duration: "15 min", desc: "Permissions, shared projects" },
    ],
    "firebase": [
      { phase: "Create Project", duration: "10 min", desc: "Firebase console, project config" },
      { phase: "Add Features", duration: "2-4 hrs", desc: "Auth, Firestore, Storage" },
      { phase: "SDK Setup", duration: "1-2 hrs", desc: "Web/mobile SDK, security rules" },
    ],
    "github": [
      { phase: "Create Account", duration: "5 min", desc: "Sign up, profile setup" },
      { phase: "First Repo", duration: "15 min", desc: "Repository init, README, .gitignore" },
      { phase: "Team Setup", duration: "1-2 hrs", desc: "Organization, teams, permissions" },
    ],
    "gitlab": [
      { phase: "Account Setup", duration: "10 min", desc: "Sign up, group creation" },
      { phase: "First Project", duration: "30 min", desc: "Repository, CI/CD pipeline" },
      { phase: "Advanced Config", duration: "4-8 hrs", desc: "Runner setup, merge trains" },
    ],
    "gusto": [
      { phase: "Company Setup", duration: "1-2 hrs", desc: "Business info, employee details" },
      { phase: "Payroll Config", duration: "1-2 hrs", desc: "Pay schedules, deductions, benefits" },
      { phase: "First Run", duration: "1-2 hrs", desc: "Review, run payroll, file taxes" },
    ],
    "hubspot": [
      { phase: "Account Setup", duration: "30 min", desc: "CRM setup, pipeline configuration" },
      { phase: "Import Data", duration: "2-4 hrs", desc: "Contacts, companies, deals" },
      { phase: "Integration", duration: "4-8 hrs", desc: "Email, calendar, connected apps" },
    ],
    "jasper": [
      { phase: "Account Setup", duration: "10 min", desc: "Sign up, brand voice setup" },
      { phase: "First Content", duration: "30 min", desc: "Template selection, AI generation" },
      { phase: "Workflow Setup", duration: "1-2 hrs", desc: "Campaigns, team collaboration" },
    ],
    "jira": [
      { phase: "Project Setup", duration: "1-2 hrs", desc: "Board type, issue types, categories" },
      { phase: "Configure Workflow", duration: "2-4 hrs", desc: "Statuses, transitions, permissions" },
      { phase: "Team Onboarding", duration: "2-4 hrs", desc: "Training, issue creation, sprints" },
    ],
    "linear": [
      { phase: "Workspace Setup", duration: "30 min", desc: "Team creation, project templates" },
      { phase: "Import Issues", duration: "30 min", desc: "CSV import, GitHub sync" },
      { phase: "Workflow Setup", duration: "1-2 hrs", desc: "Cycles, views, custom fields" },
    ],
    "microsoft-teams": [
      { phase: "Tenant Setup", duration: "1-2 hrs", desc: "Microsoft 365, Teams admin" },
      { phase: "Channel Structure", duration: "2-4 hrs", desc: "Teams, channels, tabs, apps" },
      { phase: "User Migration", duration: "2-8 weeks", desc: "Migration from Slack or other" },
    ],
    "mixpanel": [
      { phase: "Project Setup", duration: "1-2 hrs", desc: "Organization, project, SDK" },
      { phase: "Event Tracking", duration: "4-8 hrs", desc: "Events, properties, taxonomy" },
      { phase: "Reports & Cohorts", duration: "4-8 hrs", desc: "Dashboards, cohorts, insights" },
    ],
    "monday-com": [
      { phase: "Workspace Setup", duration: "1-2 hrs", desc: "Board structure, column types" },
      { phase: "Import Data", duration: "1-2 hrs", desc: "CSV import, template creation" },
      { phase: "Automations", duration: "2-4 hrs", desc: "Recipes, integrations, notifications" },
    ],
    "notion": [
      { phase: "Workspace Setup", duration: "30 min", desc: "Account creation, page structure" },
      { phase: "Template Setup", duration: "2-4 hrs", desc: "Databases, views, relations" },
      { phase: "Team Invite", duration: "30 min", desc: "Permissions, shared pages, comments" },
    ],
    "stripe": [
      { phase: "Account Setup", duration: "30 min", desc: "Account activation, bank details" },
      { phase: "API Integration", duration: "2-8 hrs", desc: "SDK install, checkout setup" },
      { phase: "Testing & Launch", duration: "1-2 days", desc: "Test mode, webhooks, compliance" },
    ],
    "vercel": [
      { phase: "Git Import", duration: "10 min", desc: "Import Git repo, auto-deploy" },
      { phase: "Configure", duration: "30 min", desc: "Environment variables, domains" },
      { phase: "Team Setup", duration: "1-2 hrs", desc: "Team members, monitoring" },
    ],
    "zoom": [
      { phase: "Account Setup", duration: "10 min", desc: "Sign up, profile configuration" },
      { phase: "Schedule First Meeting", duration: "15 min", desc: "Meeting settings, calendar sync" },
      { phase: "Team Deployment", duration: "1-2 hrs", desc: "Admin controls, user management" },
    ],
  }
  return map[slug] || [
    { phase: "Setup", duration: "1-2 hrs", desc: "Account creation, configuration" },
    { phase: "Integration", duration: "4-8 hrs", desc: "Connect other tools and APIs" },
    { phase: "Deployment", duration: "1-2 days", desc: "Team training, launch" },
  ]
}
