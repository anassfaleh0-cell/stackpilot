export const site = {
  name: "StackPilot",
  tagline: "Navigate your software stack with confidence",
  description:
    "In-depth software reviews, expert comparisons, and actionable guides to help businesses choose, implement, and optimize the right tools for every need.",
  url: "https://stackpilot.com",
  logo: "/logo.svg",
  locale: "en_US",
  links: {
    twitter: "https://x.com/stackpilot",
    github: "https://github.com/stackpilot",
  },
}

export const navLinks = [
  { href: "/reviews", label: "Reviews" },
  { href: "/comparisons", label: "Comparisons" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/glossary", label: "Glossary" },
  { href: "/tools", label: "Free Tools" },
]

export const categories = [
  { name: "AI & Machine Learning", slug: "ai-ml", count: 7 },
  { name: "Project Management", slug: "project-management", count: 8 },
  { name: "CRM & Sales", slug: "crm-sales", count: 6 },
  { name: "Marketing & SEO", slug: "marketing-seo", count: 7 },
  { name: "Design & Creative", slug: "design-creative", count: 4 },
  { name: "Developer Tools", slug: "developer-tools", count: 17 },
  { name: "Analytics & Data", slug: "analytics-data", count: 11 },
  { name: "HR & People", slug: "hr-people", count: 4 },
  { name: "Finance & Accounting", slug: "finance-accounting", count: 8 },
  { name: "Productivity", slug: "productivity", count: 7 },
  { name: "Security & Compliance", slug: "security-compliance", count: 7 },
  { name: "Communication", slug: "communication", count: 7 },
]

export const toolPages = [
  { slug: "tco-calculator", name: "TCO Calculator" },
  { slug: "software-comparison", name: "Software Comparison Matrix" },
]

export const siteConfig = {
  name: "StackPilot",
  description: site.description,
  url: site.url,
  ogImage: `${site.url}/og.svg`,
  author: "StackPilot Team",
  keywords: [
    "software reviews",
    "SaaS comparison",
    "best tools",
    "software buying guide",
    "B2B software",
    "productivity tools",
    "AI tools",
    "project management software",
  ],
}
