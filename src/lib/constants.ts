export const site = {
  name: "PilotStack",
  tagline: "Navigate your software stack with confidence",
  description:
    "In-depth software reviews, expert comparisons, and actionable guides to help businesses choose, implement, and optimize the right tools for every need.",
  url: "https://www.pilotstack.online",
  logo: "/favicon.svg",
  locale: "en_US",
  links: {
    twitter: "https://x.com/pilotstackon",
    github: "https://github.com/pilotstack",
    reddit: "https://reddit.com/u/Pilotstackonline",
  },
}

export const navLinks = [
  { href: "/reviews", label: "Reviews" },
  { href: "/comparisons", label: "Comparisons" },
  { href: "/guides", label: "Guides" },
  { href: "/best", label: "Best Software" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/industries", label: "Industries" },
  { href: "/hubs", label: "By Business Type" },
  { href: "/blog", label: "Research" },
  { href: "/alternatives", label: "Alternatives" },
]

export const navConfig = [
  {
    label: "Compare Tools",
    href: "/comparisons",
    children: [
      { label: "Comparisons", href: "/comparisons" },
      { label: "Best Software", href: "/best" },
      { label: "Alternatives", href: "/alternatives" },
    ],
  },
  {
    label: "Find by Need",
    href: "/use-cases",
    children: [
      { label: "Use Cases", href: "/use-cases" },
      { label: "Industries", href: "/industries" },
      { label: "By Business Type", href: "/hubs" },
    ],
  },
  {
    label: "Guides & Research",
    href: "/guides",
    children: [
      { label: "Guides", href: "/guides" },
      { label: "Research", href: "/blog" },
    ],
  },
  {
    label: "Reviews",
    href: "/reviews",
    children: [],
  },
]

export const secondaryNavLinks = [
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
]

export const categories = [
  { name: "AI & Machine Learning", slug: "ai-ml", count: 67 },
  { name: "Project Management", slug: "project-management", count: 56 },
  { name: "CRM & Sales", slug: "crm-sales", count: 67 },
  { name: "Marketing & SEO", slug: "marketing-seo", count: 39 },
  { name: "Design & Creative", slug: "design-creative", count: 32 },
  { name: "Developer Tools", slug: "developer-tools", count: 254 },
  { name: "Analytics & Data", slug: "analytics-data", count: 49 },
  { name: "HR & People", slug: "hr-people", count: 40 },
  { name: "Finance & Accounting", slug: "finance-accounting", count: 106 },
  { name: "Productivity", slug: "productivity", count: 51 },
  { name: "Security & Compliance", slug: "security-compliance", count: 28 },
  { name: "Communication", slug: "communication", count: 46 },
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
  name: "PilotStack",
  description: site.description,
  url: site.url,
  ogImage: `${site.url}/og.svg`,
  author: "PilotStack Team",
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
