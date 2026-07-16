export interface Topic {
  slug: string
  name: string
  description: string
  parentSlug?: string
}

export interface TopicAssignment {
  topicSlug: string
  contentSlug: string
  contentType: "review" | "comparison" | "guide" | "glossary" | "blog"
  weight: number
}

const topics: Topic[] = [
  { slug: "project-management", name: "Project Management", description: "Tools and guides for managing projects effectively", parentSlug: "productivity" },
  { slug: "productivity", name: "Productivity", description: "Tools to help teams work more efficiently" },
  { slug: "developer-tools", name: "Developer Tools", description: "Software for developers and engineering teams" },
  { slug: "design", name: "Design & Creative", description: "Design tools and creative software" },
  { slug: "crm", name: "CRM & Sales", description: "Customer relationship management and sales tools" },
  { slug: "ai-ml", name: "AI & Machine Learning", description: "Artificial intelligence and machine learning tools" },
  { slug: "analytics", name: "Analytics & Data", description: "Data analysis and business intelligence" },
  { slug: "security", name: "Security & Compliance", description: "Security tools and compliance software" },
  { slug: "communication", name: "Communication", description: "Team communication and collaboration tools" },
  { slug: "marketing", name: "Marketing & SEO", description: "Marketing tools and SEO software" },
  { slug: "hr-people", name: "HR & People", description: "Human resources and people management" },
  { slug: "finance", name: "Finance & Accounting", description: "Financial management and accounting tools" },
]

const topicAssignments: TopicAssignment[] = [
  { topicSlug: "productivity", contentSlug: "notion", contentType: "review", weight: 10 },
  { topicSlug: "project-management", contentSlug: "linear", contentType: "review", weight: 10 },
  { topicSlug: "developer-tools", contentSlug: "vercel", contentType: "review", weight: 10 },
  { topicSlug: "developer-tools", contentSlug: "supabase", contentType: "review", weight: 10 },
  { topicSlug: "design", contentSlug: "figma", contentType: "review", weight: 10 },
  { topicSlug: "ai-ml", contentSlug: "chatgpt", contentType: "review", weight: 10 },
  { topicSlug: "project-management", contentSlug: "asana", contentType: "review", weight: 10 },
  { topicSlug: "crm", contentSlug: "salesforce", contentType: "review", weight: 10 },
  { topicSlug: "marketing", contentSlug: "semrush", contentType: "review", weight: 10 },
  { topicSlug: "design", contentSlug: "canva", contentType: "review", weight: 10 },
  { topicSlug: "developer-tools", contentSlug: "github", contentType: "review", weight: 10 },
  { topicSlug: "analytics", contentSlug: "google-analytics", contentType: "review", weight: 10 },
  { topicSlug: "crm", contentSlug: "hubspot", contentType: "review", weight: 10 },
  { topicSlug: "marketing", contentSlug: "ahrefs", contentType: "review", weight: 10 },
  { topicSlug: "hr-people", contentSlug: "bamboohr", contentType: "review", weight: 10 },
  { topicSlug: "finance", contentSlug: "quickbooks", contentType: "review", weight: 10 },
  { topicSlug: "communication", contentSlug: "slack", contentType: "review", weight: 10 },
  { topicSlug: "productivity", contentSlug: "notion-vs-linear", contentType: "comparison", weight: 8 },
  { topicSlug: "design", contentSlug: "figma-vs-sketch", contentType: "comparison", weight: 8 },
  { topicSlug: "developer-tools", contentSlug: "vercel-vs-netlify", contentType: "comparison", weight: 8 },
  { topicSlug: "developer-tools", contentSlug: "supabase-vs-firebase", contentType: "comparison", weight: 8 },
  { topicSlug: "ai-ml", contentSlug: "chatgpt-vs-jasper", contentType: "comparison", weight: 8 },
  { topicSlug: "project-management", contentSlug: "asana-vs-monday-com", contentType: "comparison", weight: 8 },
  { topicSlug: "crm", contentSlug: "salesforce-vs-hubspot", contentType: "comparison", weight: 8 },
  { topicSlug: "marketing", contentSlug: "semrush-vs-ahrefs", contentType: "comparison", weight: 8 },
  { topicSlug: "project-management", contentSlug: "how-to-choose-project-management-software", contentType: "guide", weight: 10 },
  { topicSlug: "crm", contentSlug: "crm-selection-guide", contentType: "guide", weight: 10 },
  { topicSlug: "security", contentSlug: "saas-implementation-best-practices", contentType: "guide", weight: 7 },
  { topicSlug: "ai-ml", contentSlug: "how-to-choose-an-ai-writing-tool", contentType: "guide", weight: 10 },
  { topicSlug: "marketing", contentSlug: "building-your-seo-toolkit", contentType: "guide", weight: 10 },
  { topicSlug: "communication", contentSlug: "remote-team-collaboration-guide", contentType: "guide", weight: 10 },
  { topicSlug: "analytics", contentSlug: "saas-metrics-and-kpis", contentType: "guide", weight: 10 },
  { topicSlug: "ai-ml", contentSlug: "ai-tools-2026-guide", contentType: "blog", weight: 10 },
  { topicSlug: "productivity", contentSlug: "remote-work-stack", contentType: "blog", weight: 8 },
  { topicSlug: "analytics", contentSlug: "saas-metrics-guide", contentType: "blog", weight: 8 },
  { topicSlug: "crm", contentSlug: "crm", contentType: "glossary", weight: 5 },
  { topicSlug: "analytics", contentSlug: "kpi", contentType: "glossary", weight: 5 },
  { topicSlug: "analytics", contentSlug: "clv", contentType: "glossary", weight: 5 },
  { topicSlug: "analytics", contentSlug: "churn-rate", contentType: "glossary", weight: 5 },
  { topicSlug: "developer-tools", contentSlug: "api", contentType: "glossary", weight: 5 },
  { topicSlug: "developer-tools", contentSlug: "open-source", contentType: "glossary", weight: 5 },
  { topicSlug: "productivity", contentSlug: "freemium", contentType: "glossary", weight: 5 },
  { topicSlug: "crm", contentSlug: "saas", contentType: "glossary", weight: 5 },
  { topicSlug: "productivity", contentSlug: "mvp", contentType: "glossary", weight: 5 },
  { topicSlug: "developer-tools", contentSlug: "devops", contentType: "glossary", weight: 5 },
  { topicSlug: "marketing", contentSlug: "ab-testing", contentType: "glossary", weight: 5 },
  { topicSlug: "project-management", contentSlug: "agile", contentType: "glossary", weight: 5 },
  { topicSlug: "marketing", contentSlug: "cms", contentType: "glossary", weight: 5 },
  { topicSlug: "analytics", contentSlug: "roi", contentType: "glossary", weight: 5 },
  { topicSlug: "developer-tools", contentSlug: "sla", contentType: "glossary", weight: 5 },
  { topicSlug: "design", contentSlug: "ux", contentType: "glossary", weight: 5 },
  { topicSlug: "ai-ml", contentSlug: "jasper", contentType: "review", weight: 10 },
  { topicSlug: "project-management", contentSlug: "monday-com", contentType: "review", weight: 10 },
  { topicSlug: "hr-people", contentSlug: "gusto", contentType: "review", weight: 10 },
  { topicSlug: "communication", contentSlug: "slack-vs-microsoft-teams", contentType: "comparison", weight: 8 },
  { topicSlug: "finance", contentSlug: "quickbooks-vs-xero", contentType: "comparison", weight: 8 },
  { topicSlug: "analytics", contentSlug: "google-analytics-vs-mixpanel", contentType: "comparison", weight: 8 },
  { topicSlug: "hr-people", contentSlug: "bamboohr-vs-gusto", contentType: "comparison", weight: 8 },
  { topicSlug: "developer-tools", contentSlug: "github-vs-gitlab", contentType: "comparison", weight: 8 },
  { topicSlug: "developer-tools", contentSlug: "developer-tools-stack-guide", contentType: "guide", weight: 10 },
  { topicSlug: "finance", contentSlug: "finance-software-buyers-guide", contentType: "guide", weight: 10 },
  { topicSlug: "project-management", contentSlug: "best-project-management-software-2026", contentType: "blog", weight: 8 },
  { topicSlug: "crm", contentSlug: "best-crm-small-business", contentType: "blog", weight: 8 },
  { topicSlug: "ai-ml", contentSlug: "best-ai-writing-tools-2026", contentType: "blog", weight: 8 },
  { topicSlug: "communication", contentSlug: "best-remote-communication-tools", contentType: "blog", weight: 8 },
  { topicSlug: "ai-ml", contentSlug: "llm", contentType: "glossary", weight: 5 },
  { topicSlug: "developer-tools", contentSlug: "containerization", contentType: "glossary", weight: 5 },
  { topicSlug: "security", contentSlug: "encryption", contentType: "glossary", weight: 5 },
  { topicSlug: "analytics", contentSlug: "dashboard", contentType: "glossary", weight: 5 },
]

export function getTopics(): Topic[] {
  return topics
}

export function getTopic(slug: string): Topic | undefined {
  return topics.find((t) => t.slug === slug)
}

export function getTopicAssignments(topicSlug: string): TopicAssignment[] {
  return topicAssignments.filter((a) => a.topicSlug === topicSlug).sort((a, b) => b.weight - a.weight)
}

export function getRelatedTopics(contentSlug: string, contentType: string): Topic[] {
  const assigned = topicAssignments.filter(
    (a) => a.contentSlug === contentSlug && a.contentType === contentType
  )
  const topicSlugs = assigned.map((a) => a.topicSlug)
  return topics.filter((t) => topicSlugs.includes(t.slug))
}

export function getContentForTopic(slug: string): TopicAssignment[] {
  return topicAssignments.filter((a) => a.topicSlug === slug).slice(0, 10)
}

export function getChildTopics(parentSlug: string): Topic[] {
  return topics.filter((t) => t.parentSlug === parentSlug)
}
