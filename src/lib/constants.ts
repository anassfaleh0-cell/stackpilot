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
  { href: "/blog", label: "Research" },
  { href: "/glossary", label: "Glossary" },
  { href: "/tools", label: "Free Tools" },
]

export const secondaryNavLinks = [
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
]

export const categories = [
  { name: "AI & Machine Learning", slug: "ai-ml", count: 7 },
  { name: "Project Management", slug: "project-management", count: 8 },
  { name: "CRM & Sales", slug: "crm-sales", count: 6 },
  { name: "Marketing & SEO", slug: "marketing-seo", count: 8 },
  { name: "Design & Creative", slug: "design-creative", count: 5 },
  { name: "Developer Tools", slug: "developer-tools", count: 18 },
  { name: "Analytics & Data", slug: "analytics-data", count: 11 },
  { name: "HR & People", slug: "hr-people", count: 6 },
  { name: "Finance & Accounting", slug: "finance-accounting", count: 10 },
  { name: "Productivity", slug: "productivity", count: 7 },
  { name: "Security & Compliance", slug: "security-compliance", count: 8 },
  { name: "Communication", slug: "communication", count: 7 },
]

export const toolPages = [
  { slug: "tco-calculator", name: "TCO Calculator" },
  { slug: "software-comparison", name: "Software Comparison Matrix" },
]

export const editorialLinks = [
  { href: "/editorial-policy", label: "Editorial Policy" },
  { href: "/editorial-independence", label: "Editorial Independence" },
  { href: "/research-methodology", label: "Research Methodology" },
  { href: "/fact-checking-policy", label: "Fact-Checking Policy" },
  { href: "/corrections-policy", label: "Corrections Policy" },
  { href: "/how-we-test-software", label: "How We Test Software" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
  { href: "/advertising-disclosure", label: "Advertising Disclosure" },
  { href: "/authors", label: "Our Authors" },
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
    "best software tools",
    "B2B software buying guide",
    "software research",
    "SaaS reviews",
    "enterprise software",
    "project management tools",
    "CRM software reviews",
    "AI tools comparison",
    "dev tools reviews",
    "analytics platforms",
  ],
}
