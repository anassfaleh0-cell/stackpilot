import type { SoftwareEntity } from "@/types/entities"
import { Badge } from "@/components/ui/badge"

interface IntegrationDisplayProps {
  entity: SoftwareEntity
}

export function IntegrationDisplay({ entity }: IntegrationDisplayProps) {
  const { integrations } = entity
  if (!integrations || integrations.length === 0) return null

  const displayNames: Record<string, string> = {
    slack: "Slack", notion: "Notion", figma: "Figma", linear: "Linear",
    asana: "Asana", jira: "Jira", salesforce: "Salesforce", hubspot: "HubSpot",
    github: "GitHub", gitlab: "GitLab", vercel: "Vercel", stripe: "Stripe",
    docker: "Docker", supabase: "Supabase", zoom: "Zoom",
    "google-drive": "Google Drive", "google-calendar": "Google Calendar",
    "google-workspace": "Google Workspace", "microsoft-teams": "Microsoft Teams",
    "microsoft-entra-id": "Microsoft Entra ID",
    okta: "Okta", "azure-ad": "Azure AD", onelogin: "OneLogin", jumpcloud: "JumpCloud",
    zapier: "Zapier", make: "Make", sentry: "Sentry", datadog: "Datadog",
    confluence: "Confluence", bitbucket: "Bitbucket",
    kubernetes: "Kubernetes", aws: "AWS", azure: "Azure", "google-cloud": "Google Cloud",
    prometheus: "Prometheus", jenkins: "Jenkins", circleci: "CircleCI",
    netlify: "Netlify", sanity: "Sanity", contentful: "Contentful",
    shopify: "Shopify", woocommerce: "WooCommerce",
    quickbooks: "QuickBooks", xero: "Xero",
    tableau: "Tableau", mulesoft: "MuleSoft",
    gmail: "Gmail", outlook: "Outlook", wordpress: "WordPress",
    trello: "Trello", zeplin: "Zeplin", storybook: "Storybook",
  }

  return (
    <div className="flex flex-wrap gap-2">
      {integrations.map((slug) => (
        <Badge key={slug} variant="outline">
          {displayNames[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </Badge>
      ))}
    </div>
  )
}
