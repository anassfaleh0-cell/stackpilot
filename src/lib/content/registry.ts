import type { ReviewContent, ComparisonContent, ComparisonFeature, GuideContent, GlossaryContent, BlogContent, CategoryKnowledge, AlternativeContent, UseCaseContent, IndustryContent, ResearchContent, StatisticContent, BestContent, HubContent, FAQItem, ContentSection } from "@/types/content"
import fs from "node:fs"
import path from "node:path"
import { isNoindexed } from "@/lib/noindex"

const CONTENT_DIR = path.resolve(process.cwd(), "content")

// Content is immutable during a build. Cache normalized records because sitemap,
// internal-link, and comparison generation revisit the same review profiles thousands of times.
const reviewCache = new Map<string, ReviewContent | null>()
const comparisonCache = new Map<string, ComparisonContent | null>()

const DIR_FOR_TYPE: Record<string, string> = {
  review: "reviews",
  comparison: "comparisons",
  guide: "guides",
  blog: "blog",
  glossary: "glossary",
  alternative: "alternatives",
  best: "best",
  "use-case": "use-cases",
  industry: "industries",
  research: "research",
  statistic: "statistics",
  hub: "hubs",
}

// Content types whose templates emit a real noindex meta tag and that sitemap.ts filters.
// Blog, research, use-cases, industries and hubs carry no noindex entries, so their slugs
// stay linkable; guides are enforced like reviews and comparisons.
const NOINDEX_ENFORCED = new Set(["review", "comparison", "guide", "best", "alternative", "glossary", "statistic", "use-case", "industry", "research", "hub"])

/**
 * True when a content slug resolves to a page that is published, reachable and indexable.
 * Use this before emitting an internal link so we never send users or crawlers to
 * unpublished or suppressed content.
 */
// Link generation can ask about the same candidate from many statically generated
// pages. Cache this build-time decision to avoid repeatedly parsing and sanitizing the
// same content file for every internal-link candidate.
const contentAvailabilityCache = new Map<string, boolean>()

export function isContentAvailable(type: string, slug: string): boolean {
  const dir = DIR_FOR_TYPE[type]
  if (!dir || !slug) return false
  const key = `${type}:${slug}`
  const cached = contentAvailabilityCache.get(key)
  if (cached !== undefined) return cached

  const available = getContentTitle(type, slug) !== null &&
    (!NOINDEX_ENFORCED.has(type) || !isNoindexed(dir, slug))
  contentAvailabilityCache.set(key, available)
  return available
}

const DATE_FIELDS = new Set(["lastUpdated", "contentPublished", "contentModified", "publishedAt", "updatedAt", "datePublished", "dateModified"])

const GENERIC_REVIEW_SECTION_TITLES = new Set(["Rating Overview","Key Features","Hidden Costs","Learning Curve","Setup Time","Migration Difficulty","Industry Fit","Common Mistakes","Tips from experienced users","Buying Advice"])

const GENERIC_BOILERPLATE_PATTERNS = [
  /our expert team evaluated/i,
  /our methodology combines hands-on product testing/i,
  /case study 1 - aerospace/i,
  /case study 2 - healthcare/i,
  /case study 3 - finance/i,
  /response times: sub-second p50/i,
  /break-even typically 3-6 months/i,
  /first-year roi of 150-300%/i,
  /1000\+ pre-built connectors/i,
  /week 1: discovery, planning, requirements gathering/i,
  /weighted criteria: features 25%, ease of use 20%/i,
  /cloud-native deployment on aws\/gcp\/azure/i,
  /hands-on testing/i,
  /tested for at least two weeks/i,
  /based on our testing methodology/i,
  /this review is based on hands-on testing/i,
  /we verify our hands-on testing/i,
  /tested in realistic workflows by our team/i,
  /after researching hundreds of/i,
  /our expert buying advice/i,
  /enterprise deployments consistently demonstrate/i,
  /this approach enables teams to maximize their software investment/i,
  /organizations see measurable improvements in efficiency and user satisfaction within the first quarter/i,
  /organizations see measurable improvements in efficiency and team productivity/i,
]

const UNSUPPORTED_CLAIM_PATTERNS = [
  /\bwe (?:evaluated|tested|reviewed|researched|compared)\b/i,
  /\b(?:our|the) evaluation process\b/i,
  /\b(?:tested|evaluated) in real[- ]world\b/i,
  /\buser reviews from (?:G2|Capterra|TrustRadius)\b/i,
  /hands[- ]on testing/i,
  /tested for at least two weeks/i,
  /based on our testing methodology/i,
  /this review is based on hands[- ]on testing/i,
  /we verify our hands[- ]on testing/i,
  /tested in realistic workflows by our team/i,
  /our expert team evaluated/i,
  /our testing methodology/i,
  /after researching hundreds of/i,
  /our expert buying advice/i,
  /based on our detailed comparison/i,
  /our analysis incorporates thousands/i,
  /our experts?\b/i,
  /we tested\b/i,
  /tested by our team/i,
  /user(s)? consistently report/i,
  /organizations see measurable improvements/i,
  /typical roi payback/i,
  /first-year roi/i,
]

function sanitizeMalformedPricingText(value: string): string {
  let text = value
    // Some imported ranges contain a curly quote instead of a range separator.
    .replace(/(\$?\d[\d,.]*)\s*[“”]\s*(?=\$?\d)/g, "$1–")
    .replace(/(\$[\d,.]+)\s*[–-]\s*(\$[\d,.]+)/g, "$1–$2")
    .replace(/\b([A-Z][A-Za-z0-9 .&-]+)\s+from\.\s*$/g, "$1 pricing not verified.")
    .replace(/\bFree\s*[“”]\s*(?=\$)/gi, "Free–")
    // Never publish obviously corrupted generated price ranges as numeric facts.
    .replace(/from\s+\d+\s+to\s+\d{7,}\s+per month/gi, "pricing varies by plan")
    .replace(/\bdoing \+\/month(?: revenue)?\b/gi, "with order volume and customer value that justify advanced automation")
    .replace(/\bthe gold standard\b/gi, "a commonly considered option")
    .replace(/\bsEO\b/g, "SEO")
    .replace(/\b(?:from|starting at|starts at)\s+\$?\/mo\b/gi, "pricing not verified")
    .replace(/\b(?:from|starting at|starts at) pricing not verified\b/gi, "pricing not verified; check the vendor's current pricing")
    .replace(/Klaviyo's ROI justifies the cost/gi, "compare the cost with your own store's incremental contribution margin")
  if (/^\s*\/mo\s*$/i.test(text)) {
    return "Pricing not verified — check the vendor's current pricing"
  }
  return text
}

function sanitizeUnsupportedClaims(value: string | undefined): string {
  const raw = String(value ?? "").trim()
  if (!raw) return ""
  const normalized = raw
    .replace(/\bverified picks?\b/gi, "selected picks")
    .replace(/\bafter thorough evaluation\b/gi, "based on the comparison criteria")
  return normalized
    .split("\n")
    .map((line) =>
      line
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence && !UNSUPPORTED_CLAIM_PATTERNS.some((pattern) => pattern.test(sentence)))
        .join(" ")
    )
    .filter(Boolean)
    .join("\n")
    .trim()
}

function sanitizeContentValue(value: unknown): unknown {
  if (typeof value === "string") return sanitizeMalformedPricingText(sanitizeUnsupportedClaims(value))
  if (Array.isArray(value)) return value.map(sanitizeContentValue)
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      out[key] = key === "author" && typeof child === "string" ? "PilotStack Team" : sanitizeContentValue(child)
    }
    return out
  }
  return value
}

const GENERIC_LIST_ITEM_PATTERNS = [
  /^regular product updates$/i,
  /^strong customer support$/i,
  /^good mobile experience$/i,
  /^active user community$/i,
]

const GENERIC_FAQ_ANSWER_PATTERNS = [
  /based on our detailed comparison/i,
  /our analysis incorporates thousands/i,
  /hands-on assessments/i,
  /after researching hundreds/i,
  /we tested/i,
  /our experts?/i,
]

const GENERIC_FAQ_PATTERNS = [
  /^what is the best .* software\??$/i,
  /^how much does .* software cost\??$/i,
  /^what features should i look for in .* software\??$/i,
  /^how do i choose the right .* (tool|software)\??$/i,
  /^is free .* software good enough\??$/i,
  /^how often should i reevaluate .* (tool|software)\??$/i,
]

function sanitizeFaqs(faqs: FAQItem[] | undefined): FAQItem[] {
  if (!Array.isArray(faqs)) return []
  const seen = new Set<string>()
  const cleaned: FAQItem[] = []
  for (const faq of faqs) {
    const question = sanitizeUnsupportedClaims(String(faq?.question ?? "").trim())
    const answer = sanitizeUnsupportedClaims(String(faq?.answer ?? "").trim())
    const key = question.toLowerCase().replace(/\s+/g, " ")
    if (!question || !answer || !question.endsWith("?") || seen.has(key)) continue
    if (GENERIC_FAQ_PATTERNS.some((pattern) => pattern.test(key))) continue
    if (GENERIC_FAQ_ANSWER_PATTERNS.some((pattern) => pattern.test(answer))) continue
    if (answer.length < 40 || answer.length > 700) continue
    seen.add(key)
    cleaned.push({ question, answer })
    if (cleaned.length >= 5) break
  }
  return cleaned
}

function sanitizeSections<T extends { title: string; body: string }>(sections: T[] | undefined): T[] {
  if (!Array.isArray(sections)) return []
  return sections
    .map((section) => ({
      ...section,
      body: sanitizeUnsupportedClaims(section?.body),
    }))
    .filter((section) => {
      if (!section?.title || !section?.body) return false
      if (GENERIC_REVIEW_SECTION_TITLES.has(section.title)) return false
      if (GENERIC_BOILERPLATE_PATTERNS.some((pattern) => pattern.test(section.body))) return false
      return true
    })
}

function trimText(value: string | undefined, max: number): string {
  const text = String(value ?? "").trim()
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const boundary = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "))
  return (boundary > Math.floor(max * 0.65) ? cut.slice(0, boundary + 1) : cut).trim()
}

function sanitizeList(items: string[] | undefined, max = 5): string[] {
  if (!Array.isArray(items)) return []
  const seen = new Set<string>()
  return items
    .map((item) => trimText(String(item ?? ""), 360))
    .filter((item) => item.length >= 12 && !GENERIC_LIST_ITEM_PATTERNS.some((pattern) => pattern.test(item)))
    .filter((item) => {
      const key = item.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, max)
}

function sanitizeReview(review: ReviewContent): ReviewContent {
  const description = sanitizeMalformedPricingText(sanitizeUnsupportedClaims(trimText(review.description, 700)))
  const safeDescription = description.length >= 50 ? description : `${review.name} is listed in PilotStack’s ${review.category} catalog. Verify current features, pricing, and terms with the vendor.`
  return {
    ...review,
    content: buildReviewSections(review),
    description: safeDescription,
    tagline: sanitizeMalformedPricingText(sanitizeUnsupportedClaims(trimText(review.tagline, 220))),
    pros: sanitizeList(review.pros),
    cons: sanitizeList(review.cons),
    features: review.features.map((feature) => ({ ...feature, name: trimText(feature.name, 120), description: sanitizeMalformedPricingText(sanitizeUnsupportedClaims(trimText(feature.description, 360))) })).slice(0, 20),
    faqs: sanitizeFaqs(review.faqs),
  }
}


function toISODate(date: string): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  return d.toISOString().slice(0, 10)
}

// Content templates call the getAll* helpers once per component, and the link-availability
// guards call the single-slug helpers once per candidate. Without a cache each of those calls
// re-reads every file in the directory, which pushes static generation past the per-page
// timeout. The cache is keyed on mtime so a content edit is still picked up without a restart.
const jsonCache = new Map<string, { mtimeMs: number; data: unknown }>()

function repairGenericGuideData(data: Record<string, unknown>, filePath: string): Record<string, unknown> {
  if (!filePath.split(path.sep).includes("guides") || !Array.isArray(data.sections)) return data
  const sections = data.sections as Array<Record<string, unknown>>
  const bodies = sections.map((section) => String(section.body ?? ""))
  const genericMarkers = [
    /Before evaluating .*take stock of your team size/i,
    /When evaluating .*platforms, focus on these criteria/i,
    /Most successful deployments follow a phased approach/i,
    /Most teams see positive ROI within 3-6 months/i,
    /The most common mistakes teams make with .*include underinvesting in the initial setup/i,
    /Expert tip.*foundational/i,
  ]
  const markerCount = bodies.filter((body) => genericMarkers.some((pattern) => pattern.test(body))).length
  if (markerCount < 2) return data

  const rawTitle = String(data.title ?? data.slug ?? "Software buying guide")
  const topic = rawTitle
    .replace(/:\s*How to Choose the Right.*$/i, "")
    .replace(/\s+(?:buyer's\s+)?guide$/i, "")
    .trim() || "software"
  const slug = String(data.slug ?? "")
  const category = String(data.category ?? "software")
  const categoryChecks: Record<string, string> = {
    "AI & Machine Learning": "output quality on representative tasks, data handling, human review, model/version control, usage limits, latency, and inference cost at expected volume",
    "Project Management": "dependencies, workload capacity, recurring work, reporting, guest permissions, automation limits, cross-project views, and how teams update task status",
    "CRM & Sales": "contact and account data quality, pipeline definitions, activity capture, forecasting, permissions, reporting, and synchronization with marketing and support systems",
    "Marketing & SEO": "measurement goals, consent-aware tracking, channel definitions, conversion quality, attribution windows, CRM handoffs, and whether reports reconcile with source data",
    "Design & Creative": "handoff to engineering, component reuse, collaboration and review, asset ownership, accessibility, version history, and export formats",
    "Developer Tools": "repository and CI integration, access control, API limits, test reliability, observability, rollback paths, and operational ownership",
    "Analytics & Data": "metric definitions, data freshness, lineage, access controls, exportability, governance, and storage or query costs",
    "HR & People": "employee-data permissions, payroll or HRIS integration, regional requirements, manager workflows, reporting access, and employee self-service",
    "Finance & Accounting": "approval controls, audit trails, reconciliation, accounting-system integration, regional requirements, data export, and total cost of ownership",
    "Productivity": "capture and retrieval of information, collaboration, permissions, search quality, portability, recurring workflows, and process overhead",
    "Security & Compliance": "threat coverage, identity and access controls, audit logs, incident response, deployment requirements, evidence for compliance claims, and alert-handling workload",
    "Communication": "call or message quality, admin controls, guest access, retention, integrations, accessibility, and behavior across devices and network conditions",
  }
  const checks = categoryChecks[category] || "workflow fit, integrations, permissions, reporting, data portability, support boundaries, and total cost at expected usage"
  const topicPlaybooks: Record<string, { workflow: string; evidence: string; risk: string }> = {
    "marketing-attribution-guide": {
      workflow: "Start with one decision, such as which channels deserve budget, and define the conversion event and attribution window before comparing models. Check how the system handles direct traffic, cross-device journeys, long sales cycles, consent restrictions, and offline revenue. Reconcile a sample of conversions against the analytics platform and CRM rather than treating a dashboard total as ground truth.",
      evidence: "Ask vendors to show the raw event path for a sample conversion, explain identity stitching, and document how modeled or missing data is handled. Compare first-touch, last-touch, and position-based views against a clearly stated business question; no model proves causation by itself.",
      risk: "Watch for double-counted conversions, inconsistent channel naming, opaque modeled data, and reports that cannot be reconciled to finance. Record the source, timestamp, consent basis, and transformation behind each important metric."
    },
    "marketing-automation-buyers-guide": {
      workflow: "Pilot one lifecycle journey, such as welcome, abandoned-form follow-up, or lead nurture. Test entry and exit conditions, duplicate contacts, unsubscribe handling, suppression lists, time zones, retries, and what happens when a CRM field changes during a journey. Use test contacts and confirm that no real customer receives unintended messages.",
      evidence: "Verify the available triggers, branching limits, contact billing rules, sending limits, deliverability controls, consent records, and CRM sync direction. Ask for exportable logs and test how quickly a changed consent status prevents future sends.",
      risk: "Common risks include sending after opt-out, loops caused by sync updates, duplicate contacts inflating costs, and automations nobody owns. Require a named owner, change history, and a rollback procedure before turning a workflow on."
    },
    "project-management-software-buyers-guide": {
      workflow: "Model a real project with dependencies, milestones, recurring work, cross-team ownership, and one delayed task. Test whether a manager can spot blocked work without manually rebuilding a report, and whether an individual can update status quickly. Include guests and mobile users if they are part of the real workflow.",
      evidence: "Compare task hierarchy, timeline behavior, capacity planning, custom fields, permissions, automation quotas, export formats, and reporting limits at the plan you would actually buy. Validate the same scenario in each candidate and note any workaround.",
      risk: "A feature-rich workspace can still fail if teams do not maintain it. Watch for excessive custom fields, duplicate task sources, unclear status definitions, and reports that depend on manual cleanup. Define the minimum process the team will keep current."
    },
    "ai-implementation-guide": {
      workflow: "Choose one bounded task with a measurable baseline, such as classifying support requests or drafting internal summaries. Build a representative test set that includes difficult and ambiguous cases, then measure quality, latency, human correction time, and cost per successful result. Keep a human approval step for consequential outputs.",
      evidence: "Document the model and version, prompts, retrieval sources, evaluation set, access controls, retention terms, and fallback behavior. Test prompt injection, unsupported answers, sensitive-data exposure, and performance when source documents are stale or missing.",
      risk: "Do not equate fluent output with correctness or estimate savings from model speed alone. Include review time, integration work, monitoring, and failure handling in the business case; define conditions that automatically route work to a person."
    },
    "software-evaluation-framework": {
      workflow: "Create a weighted scorecard before scheduling demos. Label each requirement as mandatory, important, or optional; give every vendor the same scenario; and score the evidence rather than the presentation. Keep separate ratings for product capability, operational fit, commercial risk, and user adoption.",
      evidence: "For each score, store a link to current documentation, a trial result, or an explicit unknown. Have end users and the system owner score independently, then discuss differences. Include data export, integration failure behavior, permissions, support response, and contract exit terms.",
      risk: "Avoid changing weights after seeing vendor results, counting the same capability twice, or treating an unknown as a pass. A higher weighted score should not override a failed mandatory requirement or an unacceptable security/legal issue."
    },
    "api-security-best-practices": {
      workflow: "Inventory public and internal API endpoints, data sensitivity, authentication methods, and service owners. Test authorization at object and function level, rate limits, input validation, secret handling, and logging of sensitive fields. Include negative tests for expired tokens, cross-tenant access, oversized requests, and repeated failed authentication.",
      evidence: "Review the threat model, API inventory, dependency and secret scanning, access logs, key rotation, and incident response path. Confirm which controls are enforced in production and which are only recommendations or available on higher tiers.",
      risk: "A passing scanner is not proof that an API is secure. Watch for broken object-level authorization, overly broad service accounts, exposed secrets in logs, and rate limits that can be bypassed across keys or IPs. Assign remediation owners and retest fixes."
    },
    "how-to-choose-ai-tools": {
      workflow: "Define the job the tool should do, what a good result looks like, and what data it may access. Compare candidates on the same prompt set, including ordinary tasks, edge cases, and requests where the correct response is to abstain. Record output quality, edit time, speed, privacy terms, and cost at realistic usage.",
      evidence: "Check model/version transparency, file and context limits, data retention and training terms, admin controls, export options, integration permissions, and how the product handles citations or source links. Confirm claims in the current vendor documentation rather than relying on marketing labels.",
      risk: "Do not choose only by a public benchmark or the most impressive demo. Watch for fabricated citations, sensitive data entering personal accounts, usage limits that change the economics, and vendor lock-in around prompts or stored work. Re-test after material model changes."
    },
    "total-cost-ownership-saas": {
      workflow: "Estimate cost over a realistic 12- or 36-month period using expected seats, usage growth, add-ons, and renewal terms. Include implementation, migration, training, administration, integrations, support, security review, and the time spent correcting or exporting data. Model a low, expected, and high-usage scenario.",
      evidence: "Confirm seat minimums, annual billing, feature gates, API quotas, storage limits, overage rates, renewal increases, cancellation notice, and data-export charges in the contract or official pricing documentation. Keep assumptions separate from verified prices.",
      risk: "Avoid comparing only the advertised starting price or treating a free tier as equivalent to a paid plan. The cheapest subscription may cost more if it requires manual work, extra connectors, or a difficult exit. Recalculate when headcount, usage, or plan terms change."
    }
  }
  const playbook = topicPlaybooks[slug]
  const repairedSections = [
    {
      title: "Define the Decision",
      body: "Before comparing " + topic.toLowerCase() + " options, write down the decision the software must improve and who will use it. Map the current workflow from trigger to outcome, including manual work, handoffs, failure points, and systems that must remain. Identify the cost of the current problem and a measurable result that would justify changing tools. Use the same scenario to assess every candidate rather than letting a vendor demo define success.",
      type: "text",
    },
    {
      title: "Selection Criteria",
      body: "Evaluate " + topic.toLowerCase() + " using checks relevant to " + category + ": " + checks + ". Separate mandatory requirements from preferences and assign weights before looking at scores. For each requirement, record the evidence source and whether it is confirmed in current documentation, reproduced in a trial, unclear, or unavailable. A candidate should not pass a mandatory requirement because it scores highly on unrelated features.",
      type: "text",
    },
    {
      title: "Test a Real Workflow",
      body: playbook?.workflow || ("Run a time-boxed pilot using a realistic " + topic.toLowerCase() + " task rather than relying on a guided demo. Use representative data, include administrators and everyday users, and test both the normal path and a likely exception. Record setup time, failed steps, workarounds, output quality, and what would be needed before rollout. Repeat the same test with each shortlisted product so the results are comparable."),
      type: "text",
    },
    {
      title: "Verify the Evidence",
      body: playbook?.evidence || ("Ask each vendor to demonstrate the capabilities that matter to your workflow and provide documentation for plan limits, integrations, permissions, reporting, and data handling. Validate the result yourself with a trial or sample export. Keep notes and links for important claims, and mark anything that could not be verified as an open question instead of assuming it is supported."),
      type: "text",
    },
    {
      title: "Risks and Failure Modes",
      body: playbook?.risk || ("Do not choose " + topic.toLowerCase() + " software based only on feature count, a polished demo, or a temporary discount. Check for unclear ownership, untested integrations, poor data quality, overly broad permissions, and success measures defined only after purchase. Keep a decision log of trade-offs, open questions, and the reason the selected option fits better than the alternatives. Name an owner for each unresolved risk."),
      type: "text",
    },
    {
      title: "Calculate Total Cost",
      body: "Compare the full cost over the period you expect to use the tool: subscription or usage fees, minimum seats, add-ons, implementation, migration, training, administration, integration maintenance, and the effort required to review or correct outputs. Estimate benefits using your own baseline and a conservative improvement assumption. Show low, expected, and high scenarios, and label assumptions clearly; payback is an estimate, not a guaranteed outcome.",
      type: "text",
    },
    {
      title: "Decision and Rollout Plan",
      body: "Before signing, confirm current feature and pricing limits in vendor documentation, support commitments, data export and deletion procedures, renewal terms, and cancellation notice. Start with one team or workflow, assign an accountable owner, and define acceptance criteria and a rollback plan. After launch, review adoption, quality, cost, and unresolved risks against the baseline. Reassess when workflows, team size, compliance needs, or pricing change.",
      type: "text",
    },
    {
      title: "Questions to Ask the Vendor",
      body: "Ask for a demonstration of the exact workflow you will use, not a generic tour. Confirm which features are included in the quoted plan, what usage limits apply, how permissions and audit logs work, what support response is promised, and how quickly data can be exported. Ask the vendor to identify known limitations and recent material changes. Keep answers in writing, link them to the requirement they address, and distinguish contractual commitments from informal sales statements.",
      type: "text",
    },
    {
      title: "Acceptance Checklist",
      body: "Before the pilot, agree on a short pass/fail checklist with the people who will use and maintain the tool. Include successful completion of the main workflow, acceptable error or correction rate, required integrations, access restrictions, export quality, and a realistic cost ceiling. Test at least one failure case and one handoff between roles. If a mandatory check fails, record the gap and its owner rather than averaging it away with a high score elsewhere.",
      type: "text",
    },
    {
      title: "Review After Launch",
      body: "Schedule a review after the first few weeks and again after the first full operating cycle. Compare actual usage, time saved, correction work, support requests, and total cost with the baseline recorded before purchase. Ask users which steps remain awkward and whether work has shifted elsewhere instead of disappearing. Keep, change, or retire the tool based on this evidence, and update the evaluation notes so the next renewal or procurement decision starts with real operating experience.",
      type: "text",
    },
  ]
  const wordCount = repairedSections.reduce((total, section) => total + String(section.body).split(/\s+/).filter(Boolean).length, 0)
  const currentRelatedTools = Array.isArray(data.relatedTools) ? data.relatedTools.filter((item): item is string => typeof item === "string") : []
  const relatedTools = currentRelatedTools.length > 0 ? currentRelatedTools : readDir(path.join(CONTENT_DIR, "reviews"))
    .map((file) => readJson<ReviewContent>(path.join(CONTENT_DIR, "reviews", file)))
    .filter((review) => review.category === category && review.slug !== slug)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
    .map((review) => review.slug)
  return {
    ...data,
    title: topic + ": Practical " + category + " Guide",
    description: "A practical guide to " + topic.toLowerCase() + " in " + category + ", with evaluation criteria, a workflow test, evidence checks, implementation risks, and total-cost guidance.",
    sections: repairedSections,
    relatedTools,
    readingTime: Math.max(4, Math.ceil(wordCount / 220)),
    lastUpdated: new Date().toISOString().slice(0, 10),
  }
}
function readJson<T>(filePath: string): T {
  let mtimeMs = -1
  try {
    mtimeMs = fs.statSync(filePath).mtimeMs
  } catch {
    // Missing file — fall through to readFileSync so it throws exactly as before.
  }
  const cached = jsonCache.get(filePath)
  if (cached && cached.mtimeMs === mtimeMs) return cached.data as T

  const raw = fs.readFileSync(filePath, "utf-8")
  const parsed = JSON.parse(raw) as Record<string, unknown>
  for (const key of Object.keys(parsed)) {
    if (DATE_FIELDS.has(key) && typeof parsed[key] === "string") {
      parsed[key] = toISODate(parsed[key] as string)
    }
  }
  const data = repairGenericGuideData(sanitizeContentValue(parsed) as Record<string, unknown>, filePath)
  if (mtimeMs !== -1) jsonCache.set(filePath, { mtimeMs, data })
  return data as T
}

function readDir(dir: string): string[] {
  try {
    return fs.readdirSync(dir).filter((f) => f.endsWith(".json"))
  } catch {
    return []
  }
}

export function getReview(slug: string): ReviewContent | null {
  const cached = reviewCache.get(slug)
  if (cached !== undefined) return cached
  const file = path.join(CONTENT_DIR, "reviews", `${slug}.json`)
  if (!fs.existsSync(file)) {
    reviewCache.set(slug, null)
    return null
  }
  const review = sanitizeReview(readJson<ReviewContent>(file))
  reviewCache.set(slug, review)
  return review
}

export function getAllReviews(): ReviewContent[] {
  return readDir(path.join(CONTENT_DIR, "reviews"))
    .map((file) => getReview(file.replace(/\.json$/, "")))
    .filter((review): review is ReviewContent => Boolean(review))
    .sort((a, b) => b.rating - a.rating)
}

function sectionWordCount(sections: Array<{ body?: string; items?: string[] }>): number {
  return sections.reduce((total, section) =>
    total + String(section.body ?? "").split(/\s+/).filter(Boolean).length +
    (section.items || []).reduce((n, item) => n + String(item).split(/\s+/).filter(Boolean).length, 0),
  0)
}

function buildReviewSections(review: ReviewContent): ContentSection[] {
  const base = sanitizeSections(review.content).filter((section) =>
    !(section.type === "diagram" && !["pricing-ladder", "feature-radar", "implementation-flow"].includes(section.body))
  )
  if (sectionWordCount(base) >= 900) return base

  const company = review.company
  const availableFeatures = (Array.isArray(review.features) ? review.features : []).filter((feature) => feature.available).slice(0, 8)
  const featureNames = availableFeatures.map((feature) => feature.name)
  const featureDetails = availableFeatures.map((feature) => feature.name + ": " + feature.description).join(" ")
  const integrations = Array.isArray(company?.integrations) ? company.integrations.slice(0, 8) : []
  const certifications = Array.isArray(company?.securityCertifications) ? company.securityCertifications.slice(0, 5) : []
  const compliance = Array.isArray(company?.compliance) ? company.compliance.slice(0, 5) : []
  const rawTargetUsers: unknown = company?.targetUsers
  const targetUsers = Array.isArray(rawTargetUsers)
    ? rawTargetUsers.filter((value): value is string => typeof value === "string").slice(0, 5)
    : typeof rawTargetUsers === "string" && rawTargetUsers.trim()
      ? [rawTargetUsers.trim()]
      : []
  const rawIndustries: unknown = company?.industries
  const industries = Array.isArray(rawIndustries)
    ? rawIndustries.filter((value): value is string => typeof value === "string").slice(0, 5)
    : typeof rawIndustries === "string" && rawIndustries.trim()
      ? [rawIndustries.trim()]
      : []
  const pros = sanitizeList(review.pros, 5)
  const cons = sanitizeList(review.cons, 5)
  const pricing = review.priceRange || "Pricing is not verified in this profile; check the vendor's current pricing page."
  const categoryChecks: Record<string, string> = {
    "Project Management": "task hierarchy, dependencies, workload views, reporting, automation quotas, guest access, and whether people can update work without duplicate entry",
    "CRM & Sales": "contact deduplication, pipeline stages, lead routing, email and calendar sync, forecasting, permissions, and data export",
    "Marketing & SEO": "campaign and conversion definitions, attribution windows, consent handling, CRM synchronization, reporting, and exportable performance data",
    "Productivity": "capture and retrieval, search quality, sharing permissions, offline behavior, portability, sync reliability, and recurring workflows",
    "Developer Tools": "repository and CI integration, API limits, access control, observability, test reliability, rollback behavior, and operational ownership",
    "AI & Machine Learning": "quality on representative tasks, source grounding, human review, model/version changes, data retention, latency, and cost at expected volume",
    "Security & Compliance": "identity controls, audit logs, incident response, data retention, evidence for compliance claims, and the process for investigating alerts",
    "Analytics & Data": "metric definitions, freshness, lineage, access controls, exportability, governance, and storage or query costs",
  }
  const checks = categoryChecks[review.category] || "workflow fit, integrations, access control, reporting, portability, support, and total cost at expected usage"
  const extra: ContentSection[] = [
    { title: "Fit and workflow checks", type: "text", body: review.name + " is listed in the " + review.category + " category. Start by defining the workflow you expect it to support, the people who will use it, and the result that would justify adopting it. The recorded positioning is: " + (review.tagline || review.description) + ". Compare that positioning with the current process and identify the steps the product must handle without a fragile workaround. The profile may help build a shortlist, but the best fit depends on your requirements, existing systems, and team capacity." },
    { title: "Feature coverage to verify", type: "text", body: "The recorded profile lists these available capabilities: " + (featureNames.join(", ") || "no feature availability details are recorded") + ". Treat this list as a starting point, not proof that every capability is included in every plan. Verify the exact limits and test the highest-risk workflow with realistic sample data. The feature notes available in the dataset are: " + (featureDetails || "no detailed feature notes are recorded") + ". Record any missing capability, manual step, or plan restriction before comparing the product with alternatives." },
    { title: "Integration and data movement", type: "text", body: "For a " + review.category.toLowerCase() + " tool, check " + checks + ". The recorded integration list includes " + (integrations.join(", ") || "no specific integrations in this profile") + ". Confirm that the connection you need is supported on the plan you would buy, whether synchronization is one-way or two-way, how failures are surfaced, and whether you can export your records in a usable format. Test the full data path instead of assuming an integration badge guarantees the workflow will work." },
    { title: "Pricing and plan limits", type: "text", body: "The recorded price range is " + pricing + ". Pricing and plan features can change, so confirm the current price directly with the vendor and note the date checked. Compare the same number of seats and billing period, then include minimum seats, usage caps, add-ons, implementation, migration, training, administration, and integration maintenance. Check which features are gated behind higher tiers and what happens at renewal or cancellation. If a price or limit cannot be verified, keep it marked as unknown rather than estimating it as a fact." },
    { title: "Implementation and adoption", type: "text", body: "The recorded learning-curve estimate is " + (company?.learningCurve || "not specified") + ", and migration complexity is " + (company?.migrationComplexity || "not specified") + ". Validate both with a small pilot; these labels are directional data, not a guarantee for your setup. Include an everyday user and an administrator, test a common task and an exception, and measure setup time, correction work, and support needs. If the product replaces an existing system, plan the export, field mapping, permissions, user training, and rollback path before moving business-critical data." },
    { title: "Security and data handling", type: "text", body: "The profile records these security certifications: " + (certifications.join(", ") || "none listed") + "; and these compliance items: " + (compliance.join(", ") || "none listed") + ". An empty list does not prove a product lacks a control, and a listed certification does not establish that every use case is covered. Confirm current documentation, contract terms, data retention and deletion, access controls, audit logs, incident notification, and whether your intended data is permitted under the vendor's terms. Involve the security or privacy owner when sensitive information is involved." },
    { title: "Recorded strengths and trade-offs", type: "text", body: "The current profile records these strengths: " + (pros.join("; ") || "no specific strengths recorded") + ". It also records these limitations: " + (cons.join("; ") || "no specific limitations recorded") + ". Use these as questions to validate rather than universal outcomes: check whether each strength matters to your workflow, and whether each limitation affects your team size, integrations, data, or budget. A useful buying decision explains which trade-offs are acceptable and what evidence supports that conclusion." },
    { title: "Who should evaluate this tool", type: "text", body: "The recorded target users are " + (targetUsers.join(", ") || "not specified") + ", and the listed industries are " + (industries.join(", ") || "not specified") + ". These fields describe the available dataset, not a promise that the product fits every organization in those groups. Compare your security, accessibility, localization, administration, reporting, and support requirements with the current product documentation. If your team has unusual constraints, include them in the pilot instead of relying on broad market positioning." },
    { title: "A practical pilot checklist", type: "text", body: "Before committing, write down three to five must-have requirements and a pass/fail test for each. Use representative data, include the roles that will administer and use the product, test one failure case, and record integration behavior, data export quality, and total cost. Confirm current pricing and contract terms with the vendor. At the end of the pilot, document what worked, what required a workaround, what remains unverified, and whether the product is better than keeping the current process or choosing an alternative." },
  ]
  return [...base, ...extra]
}

function buildDerivedComparisonFeatures(cmp: ComparisonContent, base: ComparisonFeature[]): ComparisonFeature[] {
  const r1 = getReview(cmp.tool1Slug)
  const r2 = getReview(cmp.tool2Slug)
  if (!r1 && !r2) return base

  const genericNames = new Set([
    "user rating", "category", "starting price", "best for", "core strength",
    "ease of use", "integration ecosystem", "core features", "user experience",
    "pricing value", "api & integrations", "customer support", "security & compliance",
    "scalability", "mobile app", "analytics & reporting", "api", "security",
  ])
  const looksGenerated = base.length > 0 && base.every((f) => genericNames.has(f.name.toLowerCase().trim()))
  if (!looksGenerated && base.length > 5) return base

  const integrations1 = Array.isArray(r1?.company?.integrations) ? r1.company.integrations : []
  const integrations2 = Array.isArray(r2?.company?.integrations) ? r2.company.integrations : []
  const certifications1 = Array.isArray(r1?.company?.securityCertifications) ? r1.company.securityCertifications : []
  const certifications2 = Array.isArray(r2?.company?.securityCertifications) ? r2.company.securityCertifications : []
  const compliance1 = Array.isArray(r1?.company?.compliance) ? r1.company.compliance : []
  const compliance2 = Array.isArray(r2?.company?.compliance) ? r2.company.compliance : []
  const features1 = Array.isArray(r1?.features) ? r1.features : []
  const features2 = Array.isArray(r2?.features) ? r2.features : []
  const derived: ComparisonFeature[] = [
    { name: "Recorded rating", tool1: r1 ? `${r1.rating}/5` : "Not recorded", tool2: r2 ? `${r2.rating}/5` : "Not recorded", tool1Detail: r1 ? `${r1.reviewCount.toLocaleString()} reviews recorded in this site's dataset; confirm the source and date before relying on the score.` : undefined, tool2Detail: r2 ? `${r2.reviewCount.toLocaleString()} reviews recorded in this site's dataset; confirm the source and date before relying on the score.` : undefined },
    { name: "Pricing information", tool1: r1 ? `${r1.pricing}${r1.priceRange ? `: ${r1.priceRange}` : ""}` : "Not recorded", tool2: r2 ? `${r2.pricing}${r2.priceRange ? `: ${r2.priceRange}` : ""}` : "Not recorded", tool1Detail: r1 ? "Pricing and plan limits can change; confirm current details on the vendor site." : undefined, tool2Detail: r2 ? "Pricing and plan limits can change; confirm current details on the vendor site." : undefined },
    { name: "Product positioning", tool1: r1 ? r1.category : "Not recorded", tool2: r2 ? r2.category : "Not recorded", tool1Detail: r1?.tagline || undefined, tool2Detail: r2?.tagline || undefined },
    { name: "Capabilities listed in review", tool1: features1.filter((f) => f.available).slice(0, 5).map((f) => f.name).join(", ") || "Not recorded", tool2: features2.filter((f) => f.available).slice(0, 5).map((f) => f.name).join(", ") || "Not recorded" },
    { name: "Integrations recorded", tool1: integrations1.slice(0, 6).join(", ") || "Not recorded", tool2: integrations2.slice(0, 6).join(", ") || "Not recorded", tool1Detail: integrations1.length ? "Check the vendor's current integration documentation for scope and plan limits." : undefined, tool2Detail: integrations2.length ? "Check the vendor's current integration documentation for scope and plan limits." : undefined },
    { name: "API information", tool1: r1?.company ? (r1.company.apiAvailable ? "Listed as available" : "Not listed as available") : "Not recorded", tool2: r2?.company ? (r2.company.apiAvailable ? "Listed as available" : "Not listed as available") : "Not recorded", tool1Detail: r1?.company ? "Confirm access tiers, quotas, and endpoint coverage with the vendor." : undefined, tool2Detail: r2?.company ? "Confirm access tiers, quotas, and endpoint coverage with the vendor." : undefined },
    { name: "Security and compliance information", tool1: [...certifications1, ...compliance1].slice(0, 8).join(", ") || "Not recorded", tool2: [...certifications2, ...compliance2].slice(0, 8).join(", ") || "Not recorded", tool1Detail: r1?.company ? "Request current security and compliance documentation before procurement." : undefined, tool2Detail: r2?.company ? "Request current security and compliance documentation before procurement." : undefined },
    { name: "Migration notes", tool1: r1?.company?.migrationComplexity || "Not recorded", tool2: r2?.company?.migrationComplexity || "Not recorded" },
  ]
  return [...(looksGenerated ? [] : base), ...derived].slice(0, 20)
}
function normalizeComparisonWinner(value: string | null, tool1: string, tool2: string): string | null {
  if (!value) return null
  if (value.toLowerCase() === tool1.toLowerCase()) return tool1
  if (value.toLowerCase() === tool2.toLowerCase()) return tool2
  return null
}

function buildComparisonNarrative(tool1: string, tool2: string, tool1Slug: string, tool2Slug: string, features: ComparisonFeature[], winner: string | null): string {
  const review1 = getReview(tool1Slug)
  const review2 = getReview(tool2Slug)
  const recordedPick = winner
    ? `The source dataset marks ${winner} as its recorded pick. That label is not independent proof that it is the better choice for every team.`
    : "The source dataset does not name one overall pick. Choose based on your requirements and the evidence you verify."
  const profile = (name: string, review: ReviewContent | null) => {
    if (!review) return `${name}: PilotStack does not currently have a matching review profile for this comparison.`
    const capabilities = review.features.filter((f) => f.available).slice(0, 5).map((f) => f.name).join(", ")
    return `${name}: the current profile describes it as ${review.tagline || review.description}. Recorded category: ${review.category}. Listed capabilities include ${capabilities || "no specific capabilities in the current dataset"}. Treat these as starting points and verify important requirements with the vendor.`
  }
  const rows = features.slice(0, 8).map((f) => {
    const value = (v: unknown) => typeof v === "boolean" ? (v ? "marked available in the dataset" : "marked unavailable in the dataset") : String(v || "not recorded")
    return `${f.name}: ${tool1} — ${value(f.tool1)}; ${tool2} — ${value(f.tool2)}.`
  }).join(" ")
  const pricing = [review1, review2].filter((review): review is ReviewContent => Boolean(review)).map((review) =>
    `${review.name} has a recorded rating of ${review.rating}/5 and pricing listed as ${review.pricing}${review.priceRange ? ` (${review.priceRange})` : ""}. Ratings, prices, included limits, and plan availability may change; check the source and current vendor page before purchasing.`
  ).join(" ")
  return [
    `This page compares ${tool1} and ${tool2} using information currently recorded in PilotStack's product profiles. The dataset is a starting point for research, not a substitute for a hands-on trial or vendor confirmation.`,
    recordedPick,
    profile(tool1, review1),
    profile(tool2, review2),
    `The comparison table records the following details: ${rows}`,
    pricing,
    `To make the decision, write down the workflows the software must support and separate mandatory requirements from preferences. Test the same realistic tasks in both products. Check what is included in the exact plan you would buy, whether the integrations cover the actions you need, and how permissions, export, migration, support, and cancellation work. Record any unknown as a question rather than assuming that an undocumented capability exists.`,
    `Before switching between ${tool1} and ${tool2}, estimate the full cost including seats, add-ons, onboarding, training, administration, and integration maintenance. Confirm data export and recovery options, then choose the product that passes your must-have checks with the least operational friction. Revisit the choice when your workflow, team size, or vendor terms change.`
  ].filter(Boolean).join("\n\n")
}
function sanitizeComparisonDescription(description: string, tool1: string, tool2: string, features: ComparisonFeature[], winner: string | null): string {
  const cleaned = sanitizeUnsupportedClaims(description).replace(/\s+/g, " ").trim()
  if (cleaned.length >= 80 && !/are paramount|including advanced\s*,|verify and compliance|our expert|we (?:evaluated|tested|researched) hundreds/i.test(cleaned)) return trimText(cleaned, 700)
  return trimText("Compare " + tool1 + " and " + tool2 + " across " + features.length + " recorded criteria, including feature availability, pricing considerations, integrations, security, and workflow fit. " + (winner ? winner + " is the recorded overall winner." : "The dataset records no single overall winner.") + " Read the detailed rows and linked reviews before making a decision.", 700)
}
export function getComparison(slug: string): ComparisonContent | null {
  const cached = comparisonCache.get(slug)
  if (cached !== undefined) return cached
  const file = path.join(CONTENT_DIR, "comparisons", `${slug}.json`)
  if (!fs.existsSync(file)) {
    comparisonCache.set(slug, null)
    return null
  }
  const cmp = readJson<ComparisonContent>(file)
  // Only the explicit editorial status controls publication; legacy `published` flags are inconsistent across old records.
  if (cmp.publicationStatus === "draft") {
    comparisonCache.set(slug, null)
    return null
  }
  const baseFeatures = cmp.features.slice(0, 20).map((f) => ({
    ...f,
    name: trimText(f.name, 140),
    tool1Detail: sanitizeUnsupportedClaims(trimText(f.tool1Detail, 320)),
    tool2Detail: sanitizeUnsupportedClaims(trimText(f.tool2Detail, 320)),
  }))
  const features = buildDerivedComparisonFeatures(cmp, baseFeatures)
  const winner = normalizeComparisonWinner(cmp.winner, cmp.tool1, cmp.tool2)
  const result: ComparisonContent = {
    ...cmp,
    winner,
    description: sanitizeComparisonDescription(cmp.description, cmp.tool1, cmp.tool2, features, winner),
    verdict: buildComparisonNarrative(cmp.tool1, cmp.tool2, cmp.tool1Slug, cmp.tool2Slug, features, winner),
    features,
    faqs: sanitizeFaqs(cmp.faqs),
  }
  comparisonCache.set(slug, result)
  return result
}
export function getAllComparisons(): ComparisonContent[] {
  return readDir(path.join(CONTENT_DIR, "comparisons"))
    .map((f) => getComparison(f.replace(/\.json$/, "")))
    .filter((x): x is ComparisonContent => Boolean(x))
}

/** Load only comparisons assigned to a category before building expensive derived narratives. */
export function getComparisonsByCategory(category: string): ComparisonContent[] {
  return readDir(path.join(CONTENT_DIR, "comparisons"))
    .filter((file) => {
      const raw = readJson<ComparisonContent>(path.join(CONTENT_DIR, "comparisons", file))
      return raw.category === category || raw.secondaryCategories?.includes(category)
    })
    .map((file) => getComparison(file.replace(/\.json$/, "")))
    .filter((item): item is ComparisonContent => Boolean(item))
}

function normalizeGuideForDisplay(guide: GuideContent): GuideContent {
  const sections = buildGuideSections(guide)
  const faqs = sanitizeFaqs(guide.faqs)
  // Reading time must describe the content users actually see after sanitation and
  // the guide's minimum-content expansion, not stale JSON metadata or raw source text.
  const renderedText = [
    guide.title,
    guide.description,
    ...sections.flatMap((section) => [section.title, section.body, ...(section.items || [])]),
    ...faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].filter((value): value is string => typeof value === "string").join(" ")
  const wordCount = renderedText.replace(/<[^>]*>/g, " ").split(/\\s+/).filter(Boolean).length
  return {
    ...guide,
    readingTime: Math.max(3, Math.ceil(wordCount / 200)),
    sections,
    faqs,
  }
}

export function getGuide(slug: string): GuideContent | null {
  const file = path.join(CONTENT_DIR, "guides", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return normalizeGuideForDisplay(readJson<GuideContent>(file))
}

export function getAllGuides(): GuideContent[] {
  return readDir(path.join(CONTENT_DIR, "guides"))
    .map((f) => normalizeGuideForDisplay(readJson<GuideContent>(path.join(CONTENT_DIR, "guides", f))))
}

export function getGlossaryTerm(slug: string): GlossaryContent | null {
  const file = path.join(CONTENT_DIR, "glossary", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return readJson<GlossaryContent>(file)
}

export function getAllGlossaryTerms(): GlossaryContent[] {
  return readDir(path.join(CONTENT_DIR, "glossary"))
    .map((f) => readJson<GlossaryContent>(path.join(CONTENT_DIR, "glossary", f)))
    .sort((a, b) => a.term.localeCompare(b.term))
}

function enrichBlogBody(post: BlogContent): string {
  const body = String(post.body || "").trim()
  const words = body.split(/\s+/).filter(Boolean).length
  if (words >= 850) return body

  const title = post.title.toLowerCase()
  const tags = (post.tags || []).filter(Boolean).slice(0, 5).join(", ")
  const category = String(post.category || "software").toLowerCase()
  const intentText = title + " " + tags.toLowerCase()
  const supplements: Record<string, Array<{ title: string; body: string }>> = {
    pricing: [
      { title: "Build a comparable cost estimate", body: "Compare the same number of users and the same billing period for every option. Include minimum seats, annual commitments, add-ons, usage or API limits, storage, onboarding, migration, training, administration, and integration maintenance. Keep quoted prices separate from estimates, record the date and source for each price, and mark unknown fees rather than filling gaps with assumptions." },
      { title: "Model cost at realistic usage", body: "Create low, expected, and high-usage scenarios using your own expected team size and activity. Check which plan limits trigger an upgrade and whether discounts depend on annual prepayment or a longer contract. Confirm renewal terms, price increases, cancellation notice, export charges, and what happens to data when a subscription ends. Recalculate when headcount or usage changes." }
    ],
    roi: [
      { title: "Set a baseline before estimating returns", body: "Record the current cost and outcome before introducing a tool: staff time, error or rework rate, turnaround time, conversion quality, and volume handled. Choose one or two measures the tool could realistically influence and decide how to collect them. Avoid crediting the software for changes caused by seasonality, staffing, new campaigns, or other process changes." },
      { title: "Calculate net value conservatively", body: "Include subscription fees, implementation, data cleanup, training, integration work, review time, and ongoing administration. Estimate benefits using the portion of time or errors that can reasonably be reduced, not the maximum advertised by a vendor. Compare low, expected, and high scenarios, document assumptions, and revisit the estimate after a representative operating cycle. Treat payback as a hypothesis to test, not a guaranteed result." }
    ],
    security: [
      { title: "Check the data and access path", body: "List the information users will enter, upload, connect, or generate, then identify where it is stored, who can access it, and how long it is retained. Verify role-based permissions, multi-factor authentication, audit logs, encryption statements, data export and deletion, and whether customer data may be used to train models. Check current vendor documentation and contract terms rather than relying on a security badge alone." },
      { title: "Test the response to failure", body: "Ask who is notified after a suspected incident, how access can be revoked, how evidence is retained, and what support the vendor provides during investigation. Test least-privilege access and offboarding with a non-production account. For sensitive workflows, document the threat model, approved data types, retention rules, escalation owner, and fallback process if the service is unavailable or a control fails." }
    ],
    implementation: [
      { title: "Prepare the rollout before migrating", body: "Inventory the data, integrations, user roles, reports, and recurring workflows that must survive the change. Clean duplicates and define field mappings before importing records. Choose a pilot group that represents normal use, set acceptance criteria, and assign owners for training, permissions, support, and data validation. Keep the old process available until the new one has passed the agreed checks." },
      { title: "Validate and keep a rollback path", body: "After migration, reconcile record counts, ownership, permissions, attachments, history, and key reports against the source system. Test a failed integration and a user offboarding case, not just the happy path. Record known gaps and manual workarounds, then expand in stages. Keep a dated export and a clear rollback decision owner until the new workflow is stable and critical data is confirmed intact." }
    ],
    comparison: [
      { title: "Compare the same workflow in every product", body: "Use one realistic scenario and the same test data for each candidate. Score must-have requirements separately from optional features, and record the evidence behind each score. Compare usability for everyday users as well as administration, permissions, reporting, integrations, data portability, support, and plan limits. Do not treat a text label such as Paid or Custom as proof that a feature is better." },
      { title: "Verify claims that change over time", body: "Feature availability, prices, free-plan limits, and trial terms can change. Confirm time-sensitive details in current vendor documentation and note the date checked. If a capability could not be tested or documented, mark it as unknown rather than assuming it is available. A useful verdict explains which type of team fits each option and the trade-off that could change the recommendation." }
    ],
    methodology: [
      { title: "Make the evaluation reproducible", body: "Publish the criteria, weights, evidence sources, and date of review so readers can understand how the conclusion was reached. Distinguish vendor-documented facts, direct observations, third-party feedback, and assumptions. If a product was not independently tested, do not imply hands-on experience. If a commercial relationship or affiliate link exists, disclose it clearly and keep compensation separate from the scoring rules." },
      { title: "Keep the review current and accountable", body: "Record material changes to pricing, plan limits, integrations, ownership, and security documentation. Recheck important claims before updating a recommendation, and preserve a short change log so readers can see what changed. Where evidence is missing or conflicting, state the limitation rather than inventing certainty. Invite corrections with a source link and review them against the same published criteria." }
    ],
    tools: [
      { title: "Build a stack around jobs, not feature lists", body: "Start with the workflow and the output the team needs, then map which existing tool already handles each step. Prefer fewer overlapping subscriptions when one product meets the requirement without creating unacceptable compromises. Check whether data moves between tools reliably, who owns each integration, and how failures are detected. A new product should remove a clear bottleneck or provide a capability the current stack cannot reasonably deliver." },
      { title: "Validate fit with a small pilot", body: "Select one team and one measurable workflow, define the baseline, and test the highest-risk requirements with realistic data. Record setup effort, usability issues, integration failures, and the time needed to maintain the workflow. Check current pricing and plan limits before expanding. Review the pilot with both users and the person responsible for administration, then document why you will adopt, defer, or reject the tool." }
    ],
    general: [
      { title: "Turn the topic into a decision checklist", body: "Use this article to define the problem, identify who owns the workflow, and list the constraints a solution must meet. For " + category + " software, include the systems that must connect, data and permission requirements, adoption effort, support needs, and total cost at expected usage. Separate must-haves from preferences so a polished demo or long feature list does not decide the outcome by itself." },
      { title: "Verify the details before acting", body: "For " + (tags || "the tools covered here") + ", confirm current capabilities, pricing, limits, and contract terms with official vendor documentation. Test important requirements in a trial when possible and record what remains unknown. A decision is stronger when the evidence and trade-offs are written down, the people who will use the tool take part, and success is checked after rollout instead of assumed at purchase." }
    ]
  }

  const intent = /roi|return on investment|payback|cost savings/.test(intentText) ? "roi"
    : /security|privacy|compliance|risk|threat/.test(intentText) ? "security"
      : /pricing|price|cost|budget|spend|expense/.test(intentText) ? "pricing"
        : /migration|implementation|onboarding|rollout|deployment/.test(intentText) ? "implementation"
          : /vs\b|versus|comparison|compare|alternatives/.test(intentText) ? "comparison"
            : /methodology|how we review|evaluation playbook|review process/.test(intentText) ? "methodology"
              : /tools|tool stack|tech stack|platforms|software/.test(intentText) ? "tools"
                : "general"
  const sections = supplements[intent]
  return [body, ...sections.map((section) => "## " + section.title + "\n\n" + section.body)].filter(Boolean).join("\n\n")
}
export function getBlogPost(slug: string): BlogContent | null {
  const file = path.join(CONTENT_DIR, "blog", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const post = readJson<BlogContent>(file)
  return { ...post, body: enrichBlogBody(post) }
}

export function getAllBlogPosts(): BlogContent[] {
  return readDir(path.join(CONTENT_DIR, "blog"))
    .map((f) => {
      const post = readJson<BlogContent>(path.join(CONTENT_DIR, "blog", f))
      return { ...post, body: enrichBlogBody(post) }
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getCategory(slug: string): CategoryKnowledge | null {
  const file = path.join(CONTENT_DIR, "categories", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const category = readJson<CategoryKnowledge>(file)
  category.faqs = sanitizeFaqs(category.faqs)
  return category
}

export function getAllCategories(): CategoryKnowledge[] {
  return readDir(path.join(CONTENT_DIR, "categories"))
    .map((f) => { const c = readJson<CategoryKnowledge>(path.join(CONTENT_DIR, "categories", f)); c.faqs = sanitizeFaqs(c.faqs); return c })
}

function sanitizeAlternativeTitle(title: string, toolName: string, count: number): string {
  const cleaned = title.replace(/\s+/g, " ").trim()
  if (!cleaned || /save\s*\+|\+\/year|\+\s*\/\s*year|\btested\b/i.test(cleaned)) {
    return `${toolName} Alternatives (2026): ${count} Options to Consider`
  }
  return trimText(cleaned, 70)
}

function sanitizeAlternativeDescription(description: string, toolName: string, count: number): string {
  const cleaned = sanitizeUnsupportedClaims(description).replace(/\s+/g, " ").trim()
  if (cleaned.length >= 90 && !/save\s*\+|\+\/year|\btested\b/i.test(cleaned)) return trimText(cleaned, 700)
  return `Compare ${count} ${toolName} alternatives using recorded ratings, practical fit, pricing context, integrations, and migration considerations. Use the linked product reviews to verify current details before choosing.`
}
function buildGuideSections(guide: GuideContent): GuideContent["sections"] {
  const sections = sanitizeSections(guide.sections)
  if (sectionWordCount(sections) >= 900) return sections

  const title = guide.title.replace(/\\s*[:—-].*$/, "").trim() || guide.category
  const category = String(guide.category || "").toLowerCase()
  const focus = category.includes("ai")
    ? "model behavior on representative examples, data retention and training terms, human review, version changes, latency, and cost at expected usage"
    : category.includes("project") || category.includes("productivity")
      ? "work intake, dependencies, work-in-progress limits, ownership, recurring workflows, reporting, and adoption by the people doing the work"
      : category.includes("developer")
        ? "repository and CI integration, reproducible tests, permissions, API limits, observability, rollback, and ownership during incidents"
        : category.includes("security")
          ? "identity and access controls, threat coverage, audit evidence, data retention, incident response, and the workload created by alerts"
          : category.includes("analytics") || category.includes("data")
            ? "metric definitions, source reconciliation, data freshness, lineage, permissions, exportability, and storage or query cost"
            : category.includes("marketing")
              ? "measurement goals, consent-aware tracking, channel definitions, conversion quality, attribution windows, and CRM handoffs"
              : category.includes("finance") || category.includes("accounting")
                ? "approval controls, reconciliation, audit trails, accounting integrations, role permissions, and the full cost of maintaining the workflow"
                : category.includes("communication")
                  ? "call or message quality in real conditions, guest access, admin controls, retention, accessibility, and calendar or work-system integration"
                  : "workflow fit, integrations, permissions, reporting, portability, support boundaries, and total cost at expected usage"
  const criteria = [
    "Write down the current workflow and its baseline before comparing products.",
    "Mark each requirement as mandatory, important, or optional and define evidence for a pass.",
    "Verify " + focus + ".",
    "Test the riskiest requirement with realistic sample data instead of relying on a marketing claim.",
    "Check current vendor documentation for plan limits, security terms, data export, and support boundaries."
  ]
  const rollout = [
    "Select one representative workflow and assign an accountable owner.",
    "Agree on measurable acceptance criteria before the pilot begins.",
    "Test a normal case, an edge case, and a failure or recovery scenario.",
    "Document access, migration, training, support, and rollback responsibilities.",
    "Review results after launch and expand only when the evidence supports it."
  ]
  return [
    ...sections,
    { title: "A practical evaluation plan", body: "Use this " + guide.category.toLowerCase() + " guide for a specific decision, not as a generic feature checklist. For " + title + ", define the outcome the team needs, the people involved, the systems that must connect, and the current source of friction. Record the baseline and turn it into requirements that can be tested consistently across options. The decision should be traceable to a workflow and evidence, rather than a vendor's presentation or a single headline score.", type: "text" },
    { title: "Buyer checklist before shortlisting", body: "Apply the same checks to each option and keep the evidence beside the score.", type: "list", items: criteria },
    { title: "Pilot and implementation checkpoints", body: "A controlled pilot reveals configuration effort, adoption issues, and failure modes before the organization commits to a full rollout.", type: "list", items: rollout },
    { title: "Total cost and operational ownership", body: "Compare subscription or usage charges, minimum seats, add-ons, migration, implementation, training, administration, integration maintenance, and support. Estimate benefits from your own baseline and use conservative assumptions. Assign an owner for permissions, configuration, issue handling, and periodic review. A tool that appears inexpensive at purchase can become costly when manual workarounds, data cleanup, or specialist administration are included.", type: "text" },
    { title: "How to validate the final choice", body: "Before committing, record what works without customization, what requires configuration or an integration, and what still needs a manual workaround. Confirm that important data can be exported, access can be revoked, current vendor terms have been checked, and the team has a fallback if a critical workflow fails. After launch, review task success, quality, adoption, cost, and unresolved risks at 30, 60, and 90 days. Revisit the decision when the workflow or vendor terms change.", type: "text" },
  ]
}
function buildAlternativeSections(alt: AlternativeContent): ContentSection[] {
  const sections = sanitizeSections(alt.sections)
  if (sectionWordCount(sections) >= 900) return sections
  const alternatives = Array.isArray(alt.alternatives) ? alt.alternatives : []
  const criteria = Array.isArray(alt.selectionCriteria) ? alt.selectionCriteria : []
  const enriched = alternatives.slice(0, 8).map((item) => {
    const review = getReview(item.slug)
    if (!review) return item
    const capabilities = review.features.filter((f) => f.available).slice(0, 4).map((f) => f.name).join(", ")
    const fit = review.tagline || review.description
    return {
      ...item,
      description: sanitizeUnsupportedClaims(`${review.name} is a ${review.category.toLowerCase()} option. ${fit} Recorded strengths include ${capabilities || "the capabilities listed in its review"}.`),
    }
  })
  const shortlist = enriched.map((item) => `${item.name} (${item.rating}/5): ${sanitizeUnsupportedClaims(item.description)}`)
  return [
    ...sections,
    { title: `What to look for beyond ${alt.toolName}`, body: `A useful alternative solves the reason you are considering a change. For ${alt.toolName}, compare the shortlist against the workflow you need to replace, the integrations your team already depends on, administration effort, and total cost at your expected usage. The recorded ratings are comparison signals rather than universal rankings.`, type: "text" },
    { title: "Shortlist and fit", body: `The alternatives recorded on this page provide a practical starting point. Read each description next to its rating and then open the linked product review before making a final choice.`, type: "list", items: shortlist },
    { title: "Migration checks", body: `Before switching, document the data that must move, integrations that must remain operational, authentication and user-provisioning requirements, reporting continuity, and training effort. Run a representative proof-of-concept before a full migration when the data is business-critical.`, type: "text" },
    { title: "Decision checklist", body: "Use the recorded criteria as the common scorecard for the final options.", type: "list", items: criteria.slice(0, 8).length ? criteria.slice(0, 8) : ["Core workflow fit", "Pricing and total cost of ownership", "Integrations and data portability", "Administration and adoption", "Migration effort and support"] },
  ]
}
export function getAlternative(slug: string): AlternativeContent | null {
  const file = path.join(CONTENT_DIR, "alternatives", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const alt = readJson<AlternativeContent>(file)
  const alternatives = Array.isArray(alt.alternatives) ? alt.alternatives : []
  const cleaned = {
    ...alt,
    alternatives,
    selectionCriteria: Array.isArray(alt.selectionCriteria) ? alt.selectionCriteria : [],
    title: sanitizeAlternativeTitle(alt.title, alt.toolName, alternatives.length),
    description: sanitizeAlternativeDescription(alt.description, alt.toolName, alternatives.length),
    sections: buildAlternativeSections(alt),
    faqs: sanitizeFaqs(alt.faqs),
  }
  return cleaned
}

export function getAllAlternatives(): AlternativeContent[] {
  return readDir(path.join(CONTENT_DIR, "alternatives"))
    .map((f) => getAlternative(f.replace(/\.json$/, "")))
    .filter((x): x is AlternativeContent => Boolean(x))
}

export function getUseCase(slug: string): UseCaseContent | null {
  const file = path.join(CONTENT_DIR, "use-cases", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const useCase = readJson<UseCaseContent>(file)
  return {
    ...useCase,
    description: trimText(useCase.description, 700),
    useCaseDescription: trimText(useCase.useCaseDescription, 1200),
    recommendations: useCase.recommendations.slice(0, 12).map((x) => ({ ...x, bestFor: trimText(x.bestFor, 360), keyFeatures: sanitizeList(x.keyFeatures, 6) })),
    selectionCriteria: useCase.selectionCriteria.slice(0, 10).map((x) => ({ ...x, description: trimText(x.description, 360) })),
    commonPitfalls: sanitizeList(useCase.commonPitfalls, 8),
    faqs: sanitizeFaqs(useCase.faqs),
  }
}

export function getAllUseCases(): UseCaseContent[] {
  return readDir(path.join(CONTENT_DIR, "use-cases"))
    .map((f) => { const u = readJson<UseCaseContent>(path.join(CONTENT_DIR, "use-cases", f)); return { ...u, faqs: sanitizeFaqs(u.faqs) } })
}

export function getIndustry(slug: string): IndustryContent | null {
  const file = path.join(CONTENT_DIR, "industries", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const industry = readJson<IndustryContent>(file)
  return {
    ...industry,
    description: trimText(industry.description, 700),
    industryOverview: trimText(industry.industryOverview, 1600),
    softwareNeeds: sanitizeList(industry.softwareNeeds, 10),
    recommendations: industry.recommendations.slice(0, 12).map((x) => ({ ...x, bestFor: trimText(x.bestFor, 360) })),
    implementationTips: sanitizeList(industry.implementationTips, 10),
    faqs: sanitizeFaqs(industry.faqs),
  }
}

export function getAllIndustries(): IndustryContent[] {
  return readDir(path.join(CONTENT_DIR, "industries"))
    .map((f) => { const i = readJson<IndustryContent>(path.join(CONTENT_DIR, "industries", f)); return { ...i, faqs: sanitizeFaqs(i.faqs) } })
}

export function getResearch(slug: string): ResearchContent | null {
  const file = path.join(CONTENT_DIR, "research", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const research = readJson<ResearchContent>(file)
  return { ...research, sections: sanitizeSections(research.sections), faqs: sanitizeFaqs(research.faqs) }
}

export function getAllResearch(): ResearchContent[] {
  return readDir(path.join(CONTENT_DIR, "research"))
    .map((f) => { const r = readJson<ResearchContent>(path.join(CONTENT_DIR, "research", f)); return { ...r, sections: sanitizeSections(r.sections), faqs: sanitizeFaqs(r.faqs) } })
}

export function getStatistic(slug: string): StatisticContent | null {
  const file = path.join(CONTENT_DIR, "statistics", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return readJson<StatisticContent>(file)
}

export function getAllStatistics(): StatisticContent[] {
  return readDir(path.join(CONTENT_DIR, "statistics"))
    .map((f) => readJson<StatisticContent>(path.join(CONTENT_DIR, "statistics", f)))
}

export function getBest(slug: string): BestContent | null {
  const file = path.join(CONTENT_DIR, "best", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const best = readJson<BestContent>(file)
  const rawDescription = sanitizeMalformedPricingText(sanitizeUnsupportedClaims(trimText(best.description, 700)))
  const description = rawDescription.length >= 80
    ? rawDescription
    : "Compare " + best.category + " tools using the recorded product details and criteria on this page. Verify current capabilities, pricing, and plan limits with each vendor before purchasing."
  return {
    ...best,
    description,
    criteria: sanitizeList(best.criteria, 8),
    picks: best.picks.slice(0, 10).map((p) => {
      const review = getReview(p.toolSlug)
      return {
        ...p,
        bestFor: sanitizeUnsupportedClaims(trimText(p.bestFor, 360)),
        priceRange: sanitizeMalformedPricingText(String(p.priceRange || "Pricing not verified — check the vendor's current pricing")),
        pros: sanitizeList(review?.pros?.length ? review.pros : p.pros, 5),
        cons: sanitizeList(review?.cons?.length ? review.cons : p.cons, 5),
      }
    }),
    pricingSummary: sanitizeMalformedPricingText(sanitizeUnsupportedClaims(trimText(best.pricingSummary, 900))),
    comparisonTable: { ...best.comparisonTable, columns: best.comparisonTable.columns.map((x) => trimText(x, 160)), rows: best.comparisonTable.rows.slice(0, 12).map((row) => row.map((x) => sanitizeMalformedPricingText(sanitizeUnsupportedClaims(trimText(x, 360))))) },
    faqs: sanitizeFaqs(best.faqs),
  }
}

export function getAllBest(): BestContent[] {
  return readDir(path.join(CONTENT_DIR, "best"))
    .map((f) => getBest(f.replace(/\.json$/, "")))
    .filter((x): x is BestContent => Boolean(x))
}

export function getHub(slug: string): HubContent | null {
  const file = path.join(CONTENT_DIR, "hubs", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const hub = readJson<HubContent>(file)
  hub.faqs = sanitizeFaqs(hub.faqs)
  return hub
}

export function getAllHubs(): HubContent[] {
  return readDir(path.join(CONTENT_DIR, "hubs"))
    .map((f) => { const h = readJson<HubContent>(path.join(CONTENT_DIR, "hubs", f)); h.faqs = sanitizeFaqs(h.faqs); return h })
}

export function getContentTitle(type: string, slug: string): string | null {
  switch (type) {
    case "review": return getReview(slug)?.name ?? null
    case "comparison": return getComparison(slug)?.title ?? null
    case "guide": return getGuide(slug)?.title ?? null
    case "blog": return getBlogPost(slug)?.title ?? null
    case "glossary": return getGlossaryTerm(slug)?.term ?? null
    case "alternative": return getAlternative(slug)?.title ?? null
    case "use-case": return getUseCase(slug)?.title ?? null
    case "industry": return getIndustry(slug)?.title ?? null
    case "research": return getResearch(slug)?.title ?? null
    case "statistic": return getStatistic(slug)?.title ?? null
    case "best": return getBest(slug)?.title ?? null
    case "hub": return getHub(slug)?.title ?? null
    default: return null
  }
}

export function searchContent(query: string): {
  reviews: ReviewContent[]
  comparisons: ComparisonContent[]
  guides: GuideContent[]
  glossary: GlossaryContent[]
  blog: BlogContent[]
} {
  const q = query.toLowerCase()
  const match = (text: string) => text.toLowerCase().includes(q)
  return {
    reviews: getAllReviews().filter((r) => match(r.name) || match(r.description)),
    comparisons: getAllComparisons().filter((c) => match(c.title) || match(c.description)),
    guides: getAllGuides().filter((g) => match(g.title) || match(g.description)),
    glossary: getAllGlossaryTerms().filter((t) => match(t.term) || match(t.definition)),
    blog: getAllBlogPosts().filter((b) => match(b.title) || match(b.description)),
  }
}

export {
  getClaims,
  getClaim,
  getSources,
  getSource,
  getCoverage,
} from "@/lib/content/provenance"
