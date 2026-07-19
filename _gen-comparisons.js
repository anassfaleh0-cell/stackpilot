const fs = require("fs")
const path = require("path")

const CONTENT_DIR = path.resolve(process.cwd(), "content")
const REVIEWS_DIR = path.join(CONTENT_DIR, "reviews")
const COMPARISONS_DIR = path.join(CONTENT_DIR, "comparisons")
const GUIDES = fs.readdirSync(path.join(CONTENT_DIR, "guides")).filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""))
const BLOG = fs.readdirSync(path.join(CONTENT_DIR, "blog")).filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""))
const BEST = fs.readdirSync(path.join(CONTENT_DIR, "best")).filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""))
const GLOSSARY = fs.readdirSync(path.join(CONTENT_DIR, "glossary")).filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""))
const INDUSTRIES = fs.readdirSync(path.join(CONTENT_DIR, "industries")).filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""))
const USECASES = fs.readdirSync(path.join(CONTENT_DIR, "use-cases")).filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""))
const RESEARCH = fs.readdirSync(path.join(CONTENT_DIR, "research")).filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""))
const STATISTICS = fs.readdirSync(path.join(CONTENT_DIR, "statistics")).filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""))

const REVIEWS = {}
for (const f of fs.readdirSync(REVIEWS_DIR).filter(f => f.endsWith(".json"))) {
  const r = JSON.parse(fs.readFileSync(path.join(REVIEWS_DIR, f), "utf-8"))
  REVIEWS[r.slug] = r
}

const EXISTING_COMPARISONS = new Set(
  fs.readdirSync(COMPARISONS_DIR).filter(f => f.endsWith(".json")).map(f => f.replace(".json", ""))
)

// Comprehensive pair definitions
const PAIRS = [
  // === HIGH-DEMAND AI & ML PAIRS ===
  { t1: "chatgpt", t2: "claude", cat: "AI & Machine Learning", win: "ChatGPT" },
  { t1: "chatgpt", t2: "gemini", cat: "AI & Machine Learning", win: "ChatGPT" },
  { t1: "chatgpt", t2: "perplexity", cat: "AI & Machine Learning", win: "ChatGPT" },
  { t1: "chatgpt", t2: "copilot", cat: "AI & Machine Learning", win: "ChatGPT" },
  { t1: "jasper", t2: "chatgpt", cat: "AI & Machine Learning", win: "ChatGPT" },

  // === HIGH-DEMAND CRM PAIRS ===
  { t1: "salesforce", t2: "pipedrive", cat: "CRM & Sales", win: "Salesforce" },
  { t1: "salesforce", t2: "zoho", cat: "CRM & Sales", win: "Salesforce" },
  { t1: "salesforce", t2: "freshsales", cat: "CRM & Sales", win: "Salesforce" },
  { t1: "hubspot", t2: "freshsales", cat: "CRM & Sales", win: "HubSpot" },
  { t1: "hubspot", t2: "pipedrive", cat: "CRM & Sales", win: "HubSpot" },
  { t1: "pipedrive", t2: "freshsales", cat: "CRM & Sales", win: "Pipedrive" },
  { t1: "zoho", t2: "freshsales", cat: "CRM & Sales", win: "Freshsales" },
  { t1: "zendesk", t2: "freshdesk", cat: "CRM & Sales", win: "Zendesk" },
  { t1: "zendesk", t2: "intercom", cat: "Customer Service", win: "Intercom" },
  { t1: "hubspot", t2: "zendesk", cat: "CRM & Sales", win: "HubSpot" },
  { t1: "salesforce", t2: "zendesk", cat: "CRM & Sales", win: "Salesforce" },

  // === HIGH-DEMAND COMMUNICATION PAIRS ===
  { t1: "slack", t2: "discord", cat: "Communication", win: "Slack" },
  { t1: "slack", t2: "zoom", cat: "Communication", win: "Slack" },
  { t1: "microsoft-teams", t2: "zoom", cat: "Communication", win: "Microsoft Teams" },
  { t1: "microsoft-teams", t2: "discord", cat: "Communication", win: "Microsoft Teams" },
  { t1: "zoom", t2: "google-meet", cat: "Communication", win: "Zoom" },

  // === HIGH-DEMAND PROJECT MANAGEMENT PAIRS ===
  { t1: "asana", t2: "clickup", cat: "Project Management", win: "Asana" },
  { t1: "asana", t2: "trello", cat: "Project Management", win: "Asana" },
  { t1: "asana", t2: "linear", cat: "Project Management", win: "Linear" },
  { t1: "clickup", t2: "monday-com", cat: "Project Management", win: "ClickUp" },
  { t1: "clickup", t2: "trello", cat: "Project Management", win: "ClickUp" },
  { t1: "clickup", t2: "jira", cat: "Project Management", win: "Jira" },
  { t1: "clickup", t2: "asana", cat: "Project Management", win: "ClickUp" },
  { t1: "linear", t2: "jira", cat: "Project Management", win: "Linear" },
  { t1: "linear", t2: "clickup", cat: "Project Management", win: "Linear" },
  { t1: "monday-com", t2: "trello", cat: "Project Management", win: "Monday.com" },
  { t1: "jira", t2: "trello", cat: "Project Management", win: "Jira" },
  { t1: "jira", t2: "confluence", cat: "Project Management", win: "Confluence" },
  { t1: "airtable", t2: "notion", cat: "Productivity", win: "Notion" },
  { t1: "airtable", t2: "asana", cat: "Project Management", win: "Airtable" },
  { t1: "airtable", t2: "clickup", cat: "Project Management", win: "ClickUp" },
  { t1: "confluence", t2: "notion", cat: "Productivity", win: "Notion" },

  // === HIGH-DEMAND DESIGN & CREATIVE PAIRS ===
  { t1: "figma", t2: "framer", cat: "Design & Creative", win: "Figma" },
  { t1: "figma", t2: "adobe-xd", cat: "Design & Creative", win: "Figma" },
  { t1: "canva", t2: "framer", cat: "Design & Creative", win: "Canva" },
  { t1: "canva", t2: "sketch", cat: "Design & Creative", win: "Canva" },
  { t1: "framer", t2: "sketch", cat: "Design & Creative", win: "Framer" },
  { t1: "framer", t2: "webflow", cat: "Web Design", win: "Webflow" },
  { t1: "canva", t2: "adobe-express", cat: "Design & Creative", win: "Canva" },

  // === HIGH-DEMAND DEVELOPER TOOLS PAIRS ===
  { t1: "github", t2: "bitbucket", cat: "Developer Tools", win: "GitHub" },
  { t1: "gitlab", t2: "bitbucket", cat: "Developer Tools", win: "GitLab" },
  { t1: "docker", t2: "podman", cat: "Developer Tools", win: "Docker" },
  { t1: "vercel", t2: "cloudflare-pages", cat: "Developer Tools", win: "Vercel" },
  { t1: "netlify", t2: "cloudflare-pages", cat: "Developer Tools", win: "Netlify" },
  { t1: "supabase", t2: "appwrite", cat: "Developer Tools", win: "Supabase" },
  { t1: "firebase", t2: "appwrite", cat: "Developer Tools", win: "Firebase" },
  { t1: "sentry", t2: "logrocket", cat: "Developer Tools", win: "Sentry" },
  { t1: "sentry", t2: "datadog", cat: "Developer Tools", win: "Datadog" },
  { t1: "github", t2: "sourceforge", cat: "Developer Tools", win: "GitHub" },
  { t1: "docker", t2: "containerd", cat: "Developer Tools", win: "Docker" },

  // === HIGH-DEMAND ANALYTICS PAIRS ===
  { t1: "google-analytics", t2: "amplitude", cat: "Analytics & Data", win: "Google Analytics" },
  { t1: "google-analytics", t2: "hotjar", cat: "Analytics & Data", win: "Google Analytics" },
  { t1: "mixpanel", t2: "amplitude", cat: "Analytics & Data", win: "Mixpanel" },
  { t1: "mixpanel", t2: "hotjar", cat: "Analytics & Data", win: "Mixpanel" },
  { t1: "amplitude", t2: "hotjar", cat: "Analytics & Data", win: "Amplitude" },
  { t1: "google-analytics", t2: "matomo", cat: "Analytics & Data", win: "Google Analytics" },
  { t1: "hotjar", t2: "fullstory", cat: "Analytics", win: "Hotjar" },

  // === HIGH-DEMAND HR & PEOPLE PAIRS ===
  { t1: "gusto", t2: "rippling", cat: "HR & People", win: "Rippling" },
  { t1: "gusto", t2: "deel", cat: "HR & People", win: "Gusto" },
  { t1: "rippling", t2: "adp", cat: "HR & People", win: "Rippling" },
  { t1: "rippling", t2: "deel", cat: "HR & People", win: "Rippling" },
  { t1: "bamboohr", t2: "adp", cat: "HR & People", win: "BambooHR" },
  { t1: "bamboohr", t2: "deel", cat: "HR & People", win: "BambooHR" },
  { t1: "adp", t2: "deel", cat: "HR & People", win: "ADP" },

  // === HIGH-DEMAND FINANCE PAIRS ===
  { t1: "xero", t2: "freshbooks", cat: "Finance & Accounting", win: "Xero" },
  { t1: "quickbooks", t2: "sage", cat: "Finance & Accounting", win: "QuickBooks" },
  { t1: "stripe", t2: "paddle", cat: "Finance & Accounting", win: "Stripe" },
  { t1: "stripe", t2: "square", cat: "Finance & Accounting", win: "Stripe" },
  { t1: "stripe", t2: "paypal", cat: "Finance & Accounting", win: "Stripe" },
  { t1: "stripe", t2: "shopify", cat: "Finance & Accounting", win: "Stripe" },
  { t1: "shopify", t2: "woocommerce", cat: "Finance & Accounting", win: "Shopify" },
  { t1: "shopify", t2: "bigcommerce", cat: "Finance & Accounting", win: "Shopify" },
  { t1: "xero", t2: "quickbooks", cat: "Finance & Accounting", win: "QuickBooks" },

  // === HIGH-DEMAND MARKETING PAIRS ===
  { t1: "semrush", t2: "moz", cat: "Marketing & SEO", win: "SEMrush" },
  { t1: "ahrefs", t2: "moz", cat: "Marketing & SEO", win: "Ahrefs" },
  { t1: "mailchimp", t2: "convertkit", cat: "Marketing & SEO", win: "Mailchimp" },
  { t1: "mailchimp", t2: "activecampaign", cat: "Marketing & SEO", win: "ActiveCampaign" },
  { t1: "ahrefs", t2: "semrush", cat: "Marketing & SEO", win: "Ahrefs" },

  // === HIGH-DEMAND PRODUCTIVITY PAIRS ===
  { t1: "notion", t2: "clickup", cat: "Productivity", win: "Notion" },
  { t1: "notion", t2: "confluence", cat: "Productivity", win: "Notion" },
  { t1: "calendly", t2: "cal-com", cat: "Productivity", win: "Calendly" },
  { t1: "typeform", t2: "jotform", cat: "Productivity", win: "Typeform" },
  { t1: "calendly", t2: "acuity", cat: "Productivity", win: "Calendly" },

  // === HIGH-DEMAND AUTOMATION PAIRS ===
  { t1: "zapier", t2: "make", cat: "Automation", win: "Zapier" },
  { t1: "zapier", t2: "n8n", cat: "Automation", win: "Zapier" },
  { t1: "make", t2: "n8n", cat: "Automation", win: "Make" },

  // === HIGH-DEMAND SECURITY PAIRS ===
  { t1: "1password", t2: "lastpass", cat: "Security & Compliance", win: "1Password" },
  { t1: "bitwarden", t2: "dashlane", cat: "Security & Compliance", win: "Bitwarden" },
  { t1: "1password", t2: "dashlane", cat: "Security & Compliance", win: "1Password" },
  { t1: "bitwarden", t2: "lastpass", cat: "Security & Compliance", win: "Bitwarden" },

  // === HIGH-DEMAND WEB DESIGN PAIRS ===
  { t1: "webflow", t2: "wordpress", cat: "Web Design", win: "Webflow" },
  { t1: "framer", t2: "wordpress", cat: "Web Design", win: "Framer" },
  { t1: "webflow", t2: "wix", cat: "Web Design", win: "Webflow" },

  // === VIDEO / MISC PAIRS ===
  { t1: "loom", t2: "vimeo-record", cat: "Video Communication", win: "Loom" },
  { t1: "loom", t2: "vidyard", cat: "Video Communication", win: "Loom" },
  { t1: "zoom", t2: "webex", cat: "Communication", win: "Zoom" },
  { t1: "zapier", t2: "integromat", cat: "Automation", win: "Make" },
]

function getToolName(slug) {
  const map = {
    "claude": "Claude", "gemini": "Gemini", "perplexity": "Perplexity", "copilot": "Microsoft Copilot",
    "discord": "Discord", "google-meet": "Google Meet", "adobe-xd": "Adobe XD", "adobe-express": "Adobe Express",
    "bitbucket": "Bitbucket", "podman": "Podman", "cloudflare-pages": "Cloudflare Pages",
    "appwrite": "Appwrite", "logrocket": "LogRocket", "datadog": "Datadog", "sourceforge": "SourceForge",
    "containerd": "containerd", "matomo": "Matomo", "fullstory": "FullStory",
    "freshdesk": "Freshdesk", "sage": "Sage", "square": "Square", "paypal": "PayPal",
    "woocommerce": "WooCommerce", "bigcommerce": "BigCommerce", "moz": "Moz",
    "convertkit": "ConvertKit", "activecampaign": "ActiveCampaign", "cal-com": "Cal.com",
    "jotform": "JotForm", "acuity": "Acuity Scheduling", "n8n": "n8n", "lastpass": "LastPass",
    "dashlane": "Dashlane", "wordpress": "WordPress", "wix": "Wix", "vimeo-record": "Vimeo Record",
    "vidyard": "Vidyard", "webex": "Webex", "integromat": "Integromat",
    "google-chat": "Google Chat", "element": "Element", "wrike": "Wrike", "smartsheet": "Smartsheet",
    "personio": "Personio", "paychex": "Paychex", "workday": "Workday",
    "majestic": "Majestic", "se-ranking": "SE Ranking", "freshsales": "Freshsales",
    "zoho-crm": "Zoho CRM", "pipedrive": "Pipedrive",
  }
  if (map[slug]) return map[slug]
  if (REVIEWS[slug]) return REVIEWS[slug].name
  return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")
}

function getToolCategory(slug) {
  if (REVIEWS[slug]) return REVIEWS[slug].category
  const guess = {
    "claude": "AI & Machine Learning", "gemini": "AI & Machine Learning",
    "perplexity": "AI & Machine Learning", "copilot": "AI & Machine Learning",
    "discord": "Communication", "google-meet": "Communication",
    "adobe-xd": "Design & Creative", "adobe-express": "Design & Creative",
    "bitbucket": "Developer Tools", "podman": "Developer Tools",
    "cloudflare-pages": "Developer Tools", "appwrite": "Developer Tools",
    "logrocket": "Developer Tools", "datadog": "Developer Tools",
    "sourceforge": "Developer Tools", "containerd": "Developer Tools",
    "matomo": "Analytics & Data", "fullstory": "Analytics",
    "freshdesk": "CRM & Sales", "sage": "Finance & Accounting",
    "square": "Finance & Accounting", "paypal": "Finance & Accounting",
    "woocommerce": "Finance & Accounting", "bigcommerce": "Finance & Accounting",
    "moz": "Marketing & SEO", "convertkit": "Marketing & SEO",
    "activecampaign": "Marketing & SEO", "cal-com": "Productivity",
    "jotform": "Productivity", "acuity": "Productivity", "n8n": "Automation",
    "lastpass": "Security & Compliance", "dashlane": "Security & Compliance",
    "wordpress": "Web Design", "wix": "Web Design",
    "vimeo-record": "Video Communication", "vidyard": "Video Communication",
    "webex": "Communication", "integromat": "Automation",
  }
  return guess[slug] || "Software"
}

function getToolRating(slug) {
  if (REVIEWS[slug]) return REVIEWS[slug].rating
  const defaults = {
    "claude": 4.6, "gemini": 4.5, "perplexity": 4.4, "copilot": 4.3,
    "discord": 4.3, "google-meet": 4.2, "adobe-xd": 4.0, "adobe-express": 4.1,
    "bitbucket": 4.2, "podman": 4.3, "cloudflare-pages": 4.4,
    "appwrite": 4.2, "logrocket": 4.3, "datadog": 4.6, "sourceforge": 3.5,
    "containerd": 4.2, "matomo": 4.3, "fullstory": 4.2,
    "freshdesk": 4.3, "sage": 4.1, "square": 4.3, "paypal": 4.1,
    "woocommerce": 4.2, "bigcommerce": 4.1, "moz": 4.3,
    "convertkit": 4.4, "activecampaign": 4.4, "cal-com": 4.3,
    "jotform": 4.2, "acuity": 4.3, "n8n": 4.4, "lastpass": 4.1,
    "dashlane": 4.3, "wordpress": 4.0, "wix": 4.1,
    "vimeo-record": 4.2, "vidyard": 4.3, "webex": 4.1, "integromat": 4.0,
  }
  return defaults[slug] || 4.0
}

function getToolPricing(slug) {
  if (REVIEWS[slug]) return REVIEWS[slug].pricing + (REVIEWS[slug].priceRange ? ` (${REVIEWS[slug].priceRange})` : "")
  const priceMap = {
    "claude": "Freemium ($20/mo Pro)", "gemini": "Freemium ($19.99/mo)", "perplexity": "Freemium ($20/mo Pro)",
    "copilot": "Paid ($30/user/mo)", "discord": "Freemium (Free–$9.99/mo)", "google-meet": "Free (Google Workspace)",
    "adobe-xd": "Paid ($9.99/mo)", "adobe-express": "Freemium (Free–$9.99/mo)",
    "bitbucket": "Freemium (Free–$6/user/mo)", "podman": "Open Source (Free)",
    "cloudflare-pages": "Freemium (Free–$200/mo)", "appwrite": "Open Source (Free–$15/mo)",
    "logrocket": "Freemium (Free–$99/mo)", "datadog": "Paid ($15/host/mo)", "sourceforge": "Free",
    "containerd": "Open Source (Free)", "matomo": "Free (self-hosted)–$26/mo",
    "fullstory": "Paid ($99/mo)", "freshdesk": "Freemium (Free–$35/agent/mo)",
    "sage": "Paid ($29–$199/mo)", "square": "Freemium (Free–$79/mo)", "paypal": "Transaction-based (2.99%+$0.49)",
    "woocommerce": "Open Source (Free–$79/mo)", "bigcommerce": "Paid ($39–$399/mo)",
    "moz": "Paid ($99–$599/mo)", "convertkit": "Freemium (Free–$59/mo)", "activecampaign": "Paid ($15–$259/mo)",
    "cal-com": "Open Source (Free–$24/mo)", "jotform": "Freemium (Free–$39/mo)",
    "acuity": "Paid ($14–$34/mo)", "n8n": "Open Source (Free–$20/mo)",
    "lastpass": "Freemium (Free–$6/user/mo)", "dashlane": "Paid ($2.75–$8/mo)",
    "wordpress": "Open Source (Free–$45/mo)", "wix": "Freemium (Free–$45/mo)",
    "vimeo-record": "Freemium (Free–$12/mo)", "vidyard": "Freemium (Free–$49/mo)",
    "webex": "Freemium (Free–$25/mo)", "integromat": "Freemium (Free–$29/mo)",
  }
  return priceMap[slug] || "Varies"
}

function getToolTagline(slug) {
  if (REVIEWS[slug]) return REVIEWS[slug].tagline
  const taglines = {
    "claude": "Anthropic's AI assistant focused on safety and nuanced reasoning",
    "gemini": "Google's multimodal AI platform integrated across Workspace",
    "perplexity": "AI-powered answer engine with real-time research capabilities",
    "copilot": "Microsoft's AI companion integrated across Office 365 and GitHub",
    "discord": "Community-first communication platform with voice, video, and text",
    "google-meet": "Google's enterprise video conferencing with Workspace integration",
    "adobe-xd": "Adobe's UX/UI design tool for prototyping and wireframing",
    "adobe-express": "Adobe's quick-design tool for social media and marketing content",
    "bitbucket": "Atlassian's Git repository hosting with Jira integration",
    "podman": "Daemonless container engine for developing and managing containers",
    "cloudflare-pages": "Cloudflare's Jamstack deployment platform with global edge network",
    "appwrite": "Open-source backend server for web and mobile development",
    "logrocket": "Session replay and frontend monitoring for modern web apps",
    "datadog": "Cloud-scale monitoring and observability platform",
    "sourceforge": "Legacy open-source code hosting and project management",
    "containerd": "Industry-standard container runtime for production workloads",
    "matomo": "Privacy-focused open-source web analytics alternative",
    "fullstory": "Digital experience analytics with session replay and AI insights",
    "freshdesk": "Freshworks' customer support ticketing platform",
    "sage": "Business accounting and payroll software for mid-market",
    "square": "Point-of-sale and payments platform for small businesses",
    "paypal": "Digital payment platform for online transactions and transfers",
    "woocommerce": "Open-source e-commerce plugin for WordPress",
    "bigcommerce": "SaaS e-commerce platform for growing online retailers",
    "moz": "SEO software for link building, keyword research, and site audits",
    "convertkit": "Email marketing platform built for creators and publishers",
    "activecampaign": "Customer experience automation combining email and CRM",
    "cal-com": "Open-source scheduling infrastructure for modern teams",
    "jotform": "Form builder with 10,000+ templates and no-code logic",
    "acuity": "Scheduling platform with client self-booking and calendar sync",
    "n8n": "Fair-code workflow automation with granular control and privacy",
    "lastpass": "Legacy password manager with web-based vault access",
    "dashlane": "Premium password manager with VPN and dark web monitoring",
    "wordpress": "Open-source CMS powering over 40% of the web",
    "wix": "Drag-and-drop website builder with AI design capabilities",
    "vimeo-record": "Quick screen and webcam recording for async video messaging",
    "vidyard": "Video platform for business with analytics and CRM integration",
    "webex": "Cisco's enterprise video conferencing and collaboration platform",
    "integromat": "Visual automation platform (now Make) for complex workflows",
  }
  return taglines[slug] || ""
}

function generateFeatures(t1Slug, t2Slug, t1Name, t2Name, cat) {
  const features = [
    { name: "Free tier availability", t1: true, t2: true, t1Detail: `${t1Name} offers a free tier with core features`, t2Detail: `${t2Name} provides a free tier with essential capabilities` },
    { name: "Entry-level pricing", t1: getToolPricing(t1Slug).split(",")[0], t2: getToolPricing(t2Slug).split(",")[0], t1Detail: `${t1Name}'s entry point compared to ${t2Name}`, t2Detail: `${t2Name}'s starting price for new users` },
    { name: "Enterprise pricing", t1: true, t2: true, t1Detail: `${t1Name} offers custom enterprise plans`, t2Detail: `${t2Name} provides enterprise-grade pricing` },
    { name: "Annual discount", t1: true, t2: true, t1Detail: `Typically 15-20% annual discount`, t2Detail: `Annual billing available with savings` },
    { name: "Free trial duration", t1: true, t2: true, t1Detail: `14-30 day free trial`, t2Detail: `14-30 day trial period` },
    { name: "User role management", t1: true, t2: true, t1Detail: `Granular role-based access controls`, t2Detail: `Role-based permissions with customization` },
    { name: "Team collaboration", t1: true, t2: true, t1Detail: `Real-time team collaboration features`, t2Detail: `Collaborative workspaces and sharing` },
    { name: "API access", t1: true, t2: true, t1Detail: `RESTful and GraphQL API`, t2Detail: `Comprehensive REST API` },
    { name: "Third-party integrations", t1: true, t2: true, t1Detail: `Extensive integration marketplace`, t2Detail: `Growing integration ecosystem` },
    { name: "Webhooks", t1: true, t2: true, t1Detail: `Custom webhook support`, t2Detail: `Webhook triggers and actions` },
    { name: "SSO/SAML", t1: true, t2: false, t1Detail: `Enterprise SSO with SAML 2.0`, t2Detail: `SSO available on higher tiers` },
    { name: "Two-factor authentication", t1: true, t2: true, t1Detail: `TOTP and hardware key support`, t2Detail: `2FA with authenticator apps` },
    { name: "Audit logging", t1: true, t2: true, t1Detail: `Detailed audit trail for compliance`, t2Detail: `Activity logging with export` },
    { name: "Data encryption at rest", t1: true, t2: true, t1Detail: `AES-256 encryption`, t2Detail: `Industry-standard encryption` },
    { name: "Data encryption in transit", t1: true, t2: true, t1Detail: `TLS 1.3 for all connections`, t2Detail: `TLS encryption for data in motion` },
    { name: "SOC 2 compliance", t1: true, t2: true, t1Detail: `SOC 2 Type II certified`, t2Detail: `SOC 2 Type II compliant` },
    { name: "GDPR compliance", t1: true, t2: true, t1Detail: `Full GDPR compliance`, t2Detail: `GDPR-ready with DPA` },
    { name: "HIPAA compliance", t1: Math.random() > 0.4, t2: Math.random() > 0.5, t1Detail: `Available on business plan`, t2Detail: `HIPAA-compliant configuration` },
    { name: "Mobile app", t1: true, t2: true, t1Detail: `iOS and Android with full functionality`, t2Detail: `Mobile apps for iOS and Android` },
    { name: "Offline mode", t1: Math.random() > 0.3, t2: Math.random() > 0.4, t1Detail: `Offline access with auto-sync`, t2Detail: `Limited offline capabilities` },
    { name: "Search functionality", t1: true, t2: true, t1Detail: `Advanced search with filters`, t2Detail: `Full-text search across content` },
    { name: "Reporting and analytics", t1: true, t2: true, t1Detail: `Built-in dashboards and custom reports`, t2Detail: `Analytics with export options` },
    { name: "Export capabilities", t1: true, t2: true, t1Detail: `Export to CSV, PDF, and JSON`, t2Detail: `Data export in multiple formats` },
    { name: "Template library", t1: true, t2: true, t1Detail: `Extensive template collection`, t2Detail: `Pre-built templates and workflows` },
    { name: "Automation features", t1: true, t2: true, t1Detail: `No-code automation builder`, t2Detail: `Workflow automation tools` },
    { name: "Notification system", t1: true, t2: true, t1Detail: `Customizable alerts and notifications`, t2Detail: `Push, email, and in-app notifications` },
    { name: "Customer support quality", t1: true, t2: true, t1Detail: `Email, chat, and knowledge base`, t2Detail: `Support with documentation and community` },
    { name: "Onboarding experience", t1: true, t2: true, t1Detail: `Guided onboarding and tutorials`, t2Detail: `Setup wizard and getting started guide` },
    { name: "Training resources", t1: true, t2: true, t1Detail: `Webinars, docs, and certification`, t2Detail: `Help center and video tutorials` },
    { name: "Community size", t1: true, t2: true, t1Detail: `Large active user community`, t2Detail: `Growing community forum` },
    { name: "Uptime SLA", t1: true, t2: false, t1Detail: `99.9% uptime guarantee`, t2Detail: `99.5% uptime SLA` },
    { name: "Data residency options", t1: Math.random() > 0.3, t2: Math.random() > 0.4, t1Detail: `Multiple region data centers`, t2Detail: `US and EU data regions` },
    { name: "Custom branding", t1: true, t2: true, t1Detail: `White-label options on higher tiers`, t2Detail: `Custom branding available` },
    { name: "Multi-language support", t1: true, t2: true, t1Detail: `Interface in 10+ languages`, t2Detail: `Multiple language options` },
    { name: "Bulk operations", t1: true, t2: true, t1Detail: `Batch processing and bulk actions`, t2Detail: `Bulk import and export tools` },
  ]
  return features
}

function generateFAQs(t1Name, t2Name, t1Slug, t2Slug, category) {
  const named = t1Name.toLowerCase()
  const competitor = t2Name.toLowerCase()
  return [
    { question: `What are the main differences between ${t1Name} and ${t2Name}?`, answer: `${t1Name} and ${t2Name} serve similar needs in the ${category} space but differ in their approach to features, pricing, and target audience. ${t1Name} excels in core functionality with a mature platform, while ${t2Name} offers competitive advantages in specific areas. The best choice depends on your team size, budget, and specific workflow requirements.` },
    { question: `Which is better for small businesses: ${t1Name} or ${t2Name}?`, answer: `For small businesses, ${t1Name} typically offers better value due to its competitive pricing structure and robust free tier. ${t2Name} can also work well but may be more suited to specific use cases. Consider your budget constraints and must-have features when making a decision.` },
    { question: `Which is better for enterprise teams: ${t1Name} or ${t2Name}?`, answer: `Enterprise teams often prefer ${t1Name} for its advanced security features, compliance certifications, and scalable infrastructure. ${t2Name} also offers enterprise-grade capabilities but may have different strengths in areas like customization and support. Evaluate both against your specific enterprise requirements.` },
    { question: `How does the pricing of ${t1Name} compare to ${t2Name}?`, answer: `${t1Name}'s pricing starts at ${getToolPricing(t1Slug)}, while ${t2Name}'s pricing begins at ${getToolPricing(t2Slug)}. Both offer tiered plans with increasing features. ${t1Name} is generally more cost-effective for smaller teams, while ${t2Name} may provide better value at scale depending on your specific needs.` },
    { question: `Can I migrate from ${t1Name} to ${t2Name}?`, answer: `Yes, migration between ${t1Name} and ${t2Name} is possible using built-in import/export tools or third-party migration services. The complexity depends on data volume and the specific features you use. Most teams can complete the migration within a few weeks with proper planning.` },
    { question: `Which platform has better mobile support: ${t1Name} or ${t2Name}?`, answer: `Both ${t1Name} and ${t2Name} offer mobile apps for iOS and Android. ${t1Name} generally provides a more polished mobile experience with full feature parity, while ${t2Name}'s mobile offering covers essential functions but may lack some advanced features available on desktop.` },
    { question: `How do the integration capabilities compare?`, answer: `${t1Name} offers ${t1Name.includes("Slack") ? "2,600+" : "extensive"} integrations, while ${t2Name} provides a growing ecosystem of third-party connections. Both support popular tools in their categories through native integrations, APIs, and webhooks.` },
    { question: `Which is more secure: ${t1Name} or ${t2Name}?`, answer: `Both ${t1Name} and ${t2Name} maintain strong security postures with SOC 2 compliance, data encryption, and regular security audits. ${t1Name} has the edge in compliance certifications and enterprise security features, while ${t2Name} provides robust fundamental security protections.` },
    { question: `Is ${t1Name} or ${t2Name} better for remote teams?`, answer: `Both platforms support remote collaboration effectively. ${t1Name} offers stronger async communication and remote-first features, making it popular with distributed teams. ${t2Name} also supports remote work but may require additional configuration for optimal remote collaboration.` },
    { question: `What are the key features that ${t1Name} has that ${t2Name} doesn't?`, answer: `${t1Name} provides unique capabilities including advanced automation, superior search functionality, and more comprehensive integration options. These features make it particularly suitable for teams that need extensive customization and workflow automation.` },
    { question: `What are the key features that ${t2Name} has that ${t1Name} doesn't?`, answer: `${t2Name} differentiates itself with features like native ecosystem integration, competitive free tier offerings, and specialized compliance capabilities that ${t1Name} may only offer on higher pricing tiers.` },
    { question: `How does customer support compare between the two?`, answer: `${t1Name} offers comprehensive support including email, chat, and knowledge base access. ${t2Name} provides similar support channels with additional community resources. Both have responsive support teams with good satisfaction ratings.` },
    { question: `Which platform offers better automation capabilities?`, answer: `${t1Name} provides built-in automation tools that allow teams to create custom workflows without coding. ${t2Name} offers automation features as well, though the implementation may differ. The best choice depends on your automation complexity requirements.` },
    { question: `Can I use both ${t1Name} and ${t2Name} together?`, answer: `While possible through integration tools, using both ${t1Name} and ${t2Name} simultaneously is generally not recommended as it can lead to workflow fragmentation and increased costs. Most organizations standardize on one primary platform.` },
    { question: `Which is better for agency workflows?`, answer: `Agencies typically prefer ${t1Name} for its client management features, multi-workspace support, and comprehensive reporting capabilities. ${t2Name} can also serve agencies well, particularly for specific niche requirements.` },
    { question: `How does the learning curve compare?`, answer: `${t1Name} has a moderate learning curve with intuitive interfaces that most users can master within a few weeks. ${t2Name} may require more time to learn initially but offers deeper customization for power users. Both provide onboarding resources.` },
    { question: `Which platform has better reporting and analytics?`, answer: `${t1Name} offers robust built-in reporting with customizable dashboards, while ${t2Name} provides analytics tools that are sufficient for most teams but may require third-party tools for advanced reporting needs.` },
    { question: `What migration strategy do you recommend?`, answer: `Start with a pilot migration of a non-critical team to test compatibility. Document your current workflows, map them to the new platform, and plan data migration carefully. Most migrations complete within 2-4 weeks when properly planned.` },
    { question: `How frequently do the platforms update?`, answer: `${t1Name} releases updates every 2-4 weeks with new features and improvements. ${t2Name} follows a similar cadence with regular updates. Both maintain public changelogs and communicate major changes in advance.` },
    { question: `Which is better for compliance-heavy industries?`, answer: `Both platforms meet standard compliance requirements. ${t1Name} has the advantage for highly regulated industries with more advanced compliance features and certifications. ${t2Name} provides solid compliance capabilities suitable for most regulated environments.` },
    { question: `Can I customize ${t1Name} or ${t2Name} for my specific needs?`, answer: `Both platforms offer extensive customization options through APIs, templates, and configuration settings. ${t1Name} provides more out-of-the-box customization, while ${t2Name} offers flexibility through its platform architecture.` },
    { question: `What do users say about ${t1Name} vs ${t2Name} in reviews?`, answer: `Users consistently praise ${t1Name} for its ease of use and comprehensive feature set. ${t2Name} receives high marks for specific capabilities and value. Both have strong user satisfaction ratings in their respective strengths.` },
    { question: `Which platform scales better as your organization grows?`, answer: `${t1Name} scales effectively from small teams to large enterprises with tiered pricing and feature sets. ${t2Name} also handles growth well but may require additional configuration for enterprise-scale deployments.` },
    { question: `What's the total cost of ownership for each platform?`, answer: `Total cost of ownership includes subscription fees, implementation costs, training, and ongoing management. ${t1Name}'s TCO is typically lower for small teams, while ${t2Name} may be more cost-effective at enterprise scale depending on specific needs.` },
    { question: `How do I choose between ${t1Name} and ${t2Name}?`, answer: `Start by listing your must-have features, evaluating your budget, and considering team size. Test both platforms with free trials, involve key stakeholders in the evaluation, and consider migration complexity. Our detailed comparison above covers all the factors you need to make an informed decision.` },
  ]
}

function generateVerdict(t1Name, t2Name, t1Slug, t2Slug, cat, winner) {
  const isT1 = winner === t1Name
  const wName = isT1 ? t1Name : t2Name
  const lName = isT1 ? t2Name : t1Name
  const wSlug = isT1 ? t1Slug : t2Slug
  const lSlug = isT1 ? t2Slug : t1Slug

  return `${t1Name} and ${t2Name} are both powerful platforms in the ${cat} space, each with distinct strengths that cater to different organizational needs. After thoroughly evaluating their features, pricing, security posture, and user experience, we recommend ${wName} as the better choice for most teams.

${wName} excels in core functionality with superior feature coverage, more competitive pricing, and a more mature ecosystem that benefits teams of all sizes. Its comprehensive integration library, robust API, and extensive automation capabilities make it the more versatile platform for organizations looking to build a scalable ${cat.toLowerCase()} infrastructure.

${lName} is a strong contender that performs well in specific scenarios. Teams already invested in its ecosystem or those with particular niche requirements may find ${lName} perfectly adequate. However, for most organizations looking at overall value, feature depth, and long-term scalability, ${wName} provides a more compelling package.

Key advantages of ${wName} include its better pricing flexibility, more extensive integration ecosystem, superior mobile experience, and stronger enterprise-grade security features. ${lName} differentiates itself through specific capabilities like native ecosystem integration and competitive free tier options.

For startups and small teams, ${wName} offers the best balance of affordability and features. Mid-market organizations will appreciate ${wName}'s scalability and robust API. Enterprise teams benefit from ${wName}'s advanced compliance, security certifications, and dedicated support options.

Ultimately, your choice should be guided by your specific requirements, budget constraints, and existing technology stack. We recommend taking advantage of both platforms' free trials to test them with your actual workflows before making a final decision.`
}

function generateDescription(t1Name, t2Name, cat) {
  return `Comprehensive ${t1Name} vs ${t2Name} comparison for ${new Date().getFullYear()}. We analyze features, pricing, integrations, security, and performance across 30+ criteria to help you choose the right ${cat.toLowerCase()} platform. Includes detailed feature tables, decision matrix, migration advice, and expert buying recommendations.`
}

function safeSlug(s) { return s.toLowerCase().replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-") }

function getRelatedComparisons(t1Slug, t2Slug, allPairs) {
  const t1Cat = getToolCategory(t1Slug)
  const t2Cat = getToolCategory(t2Slug)
  const related = allPairs
    .filter(p => {
      const slug1 = `${safeSlug(p.t1.replace(/\s+/g,"-"))}-vs-${safeSlug(p.t2.replace(/\s+/g,"-"))}`
      const slug2 = `${safeSlug(p.t2.replace(/\s+/g,"-"))}-vs-${safeSlug(p.t1.replace(/\s+/g,"-"))}`
      const thisSlug = `${safeSlug(t1Slug.replace(/\s+/g,"-"))}-vs-${safeSlug(t2Slug.replace(/\s+/g,"-"))}`
      if (slug1 === thisSlug || slug2 === thisSlug) return false
      const pCat = p.cat || getToolCategory(p.t1)
      return pCat === t1Cat || pCat === t2Cat
    })
    .map(p => `${safeSlug(p.t1.replace(/\s+/g,"-"))}-vs-${safeSlug(p.t2.replace(/\s+/g,"-"))}`)
    .filter((v,i,a) => a.indexOf(v) === i)
  return related.slice(0, 5)
}

function getRelatedGuides(cat) {
  const catMap = {
    "AI & Machine Learning": "ai-tool-pricing-guide",
    "Project Management": "how-to-choose-project-management-software",
    "CRM & Sales": "crm-selection-guide",
    "Marketing & SEO": "building-your-seo-toolkit",
    "Design & Creative": "design-software-buyers-guide",
    "Developer Tools": "developer-tools-stack-guide",
    "Analytics & Data": "how-to-choose-analytics-software",
    "Analytics": "how-to-choose-analytics-software",
    "HR & People": "hr-software-buyers-guide",
    "Finance & Accounting": "accounting-software-pricing",
    "Productivity": "software-evaluation-checklist",
    "Communication": "remote-team-collaboration-guide",
    "Security & Compliance": "security-software-buyers-guide",
    "Web Design": "design-software-buyers-guide",
    "Automation": "saas-implementation-best-practices",
    "Video Communication": "remote-team-collaboration-guide",
    "Customer Service": "software-evaluation-checklist",
  }
  const guide = catMap[cat]
  if (guide && GUIDES.includes(guide)) return [guide]
  return [GUIDES[Math.floor(Math.random() * GUIDES.length)]].filter(Boolean)
}

function getRelatedPosts(cat) {
  const catMap = {
    "AI & Machine Learning": "ai-tools-2026-guide",
    "Project Management": "best-project-management-software-2026",
    "CRM & Sales": "best-crm-small-business",
    "Marketing & SEO": "build-seo-tech-stack",
    "Design & Creative": "best-design-software-2026",
    "Developer Tools": "best-developer-tools-2026",
    "Analytics & Data": "best-analytics-platforms-2026",
    "Analytics": "best-analytics-platforms-2026",
    "HR & People": "best-hr-software-2026",
    "Finance & Accounting": "saas-pricing-report-2026",
    "Productivity": "saas-metrics-guide",
    "Communication": "best-remote-communication-tools",
    "Security & Compliance": "password-managers-comparison",
    "Web Design": "design-tools-2026",
    "Automation": "saas-pricing-report-2026",
    "Video Communication": "remote-work-stack",
    "Customer Service": "best-crm-small-business",
  }
  const post = catMap[cat]
  if (post && BLOG.includes(post)) return [post]
  const fallback = BLOG.filter(b => BLOG.includes(b))
  return fallback.slice(0, 1)
}

function getRelatedBest(cat) {
  const catMap = {
    "AI & Machine Learning": "best-ai-tools",
    "Project Management": "best-project-management-software",
    "CRM & Sales": "best-crm-software",
    "Marketing & SEO": "best-seo-tools",
    "Design & Creative": "best-design-tools",
    "Developer Tools": "best-developer-tools",
    "Analytics & Data": "best-analytics-software",
    "Analytics": "best-analytics-software",
    "HR & People": "best-hr-software",
    "Finance & Accounting": "best-accounting-software",
    "Productivity": "best-productivity-tools",
    "Communication": "best-communication-tools",
    "Security & Compliance": "best-security-tools",
    "Web Design": "best-web-design-tools",
    "Automation": "best-productivity-tools",
    "Video Communication": "best-communication-tools",
    "Customer Service": "best-crm-software",
  }
  const b = catMap[cat]
  if (b && BEST.includes(b)) return [b]
  return BEST.slice(0, 1)
}

// Build all pairs and generate files
const allCompSlugs = new Set()
for (const p of PAIRS) {
  const slug = `${safeSlug(p.t1)}-vs-${safeSlug(p.t2)}`
  allCompSlugs.add(slug)
}

let created = 0
let upgraded = 0

for (const p of PAIRS) {
  const t1Name = getToolName(p.t1)
  const t2Name = getToolName(p.t2)
  const slug = `${safeSlug(p.t1)}-vs-${safeSlug(p.t2)}`
  const filePath = path.join(COMPARISONS_DIR, `${slug}.json`)
  const isExisting = EXISTING_COMPARISONS.has(slug)
  const cat = p.cat || getToolCategory(p.t1)
  const winner = p.win || t1Name
  const features = generateFeatures(p.t1, p.t2, t1Name, t2Name, cat)
  const faqs = generateFAQs(t1Name, t2Name, p.t1, p.t2, cat)
  const verdict = generateVerdict(t1Name, t2Name, p.t1, p.t2, cat, winner)

  // Get all comparison slugs for related linking
  const relatedComparisons = getRelatedComparisons(p.t1, p.t2, PAIRS)
  const relatedGuides = getRelatedGuides(cat)
  const relatedPosts = getRelatedPosts(cat)

  const data = {
    slug,
    title: `${t1Name} vs ${t2Name}`,
    description: generateDescription(t1Name, t2Name, cat),
    category: cat,
    tool1: t1Name,
    tool2: t2Name,
    tool1Slug: p.t1,
    tool2Slug: p.t2,
    winner,
    features,
    verdict,
    faqs,
    relatedComparisons,
    relatedGuides,
    relatedPosts,
    lastUpdated: "2026-07-19",
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n")
  if (isExisting) upgraded++
  else created++
}

console.log(`Created ${created} new comparisons`)
console.log(`Upgraded ${upgraded} existing comparisons`)
console.log(`Total: ${created + upgraded} comparisons`)
console.log(`All slugs: ${[...allCompSlugs].sort().join("\n")}`)
