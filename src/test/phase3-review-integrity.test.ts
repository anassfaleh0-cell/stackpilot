import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  formatScore,
  scorePercent,
  scoreWidth,
  articleFor,
  withArticle,
  editorialPros,
  isRatingRestatement,
  reviewMetaTitle,
  reviewMetaDescription,
} from "@/lib/format"
import { resolveCompanyFacts, hasCompanyFacts, type CompanyFacts } from "@/lib/company-facts"
import { getEntity } from "@/lib/entities/data"
import { createMetadata, truncateAtWordBoundary } from "@/lib/metadata"
import type { CompanyInfo } from "@/types/content"
import { ReviewSchema } from "@/components/seo/json-ld"
import { SecurityTable } from "@/components/entity/security-table"
import type { SoftwareEntity, CompanyDetail } from "@/types/entities"

const COHORT = [
  "affinity", "auth0", "basecamp", "circleci", "close-crm", "copper-crm",
  "copy-ai", "crowdstrike", "dialpad", "evernote", "expensify", "fathom",
  "grafana", "grammarly", "greenhouse", "heap", "hi-bob", "invision",
  "jfrog", "lever", "marketo", "midjourney", "new-relic", "obsidian",
  "okta", "optimizely", "outreach-io", "plausible", "postman", "power-bi",
  "ringcentral", "roam-research", "runway", "sage-intacct", "salesloft",
  "sentinelone", "smartsheet", "survey-monkey", "synthesia", "tableau",
  "telegram", "terraform", "todoist", "vonage", "wave", "workday", "wrike",
  "writesonic", "zeplin", "zoho-books", "zoho-crm", "zoho-people",
]

const REVIEW_DIR = path.join(process.cwd(), "content", "reviews")

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyJson = { [k: string]: any }

function load(slug: string): AnyJson {
  return JSON.parse(fs.readFileSync(path.join(REVIEW_DIR, `${slug}.json`), "utf8"))
}

const reviews: AnyJson[] = COHORT.map(load)

function readSrc(relative: string): string {
  return fs.readFileSync(path.join(process.cwd(), relative), "utf8")
}

describe("CD-4: rating formatting", () => {
  const noisy = [
    4.8999999999999995, 4.3999999999999995, 4.6000000000000005,
    3.9999999999999996, 3.8999999999999995, 4.1000000000000005,
    4.699999999999999, 4.300000000000001, 4.199999999999999,
  ]

  it("renders every score at one decimal place", () => {
    for (const value of noisy) expect(formatScore(value)).toMatch(/^\d\.\d$/)
    expect(formatScore(4.8999999999999995)).toBe("4.9")
    expect(formatScore(4.699999999999999)).toBe("4.7")
    expect(formatScore(5)).toBe("5.0")
  })

  it("never leaks a binary float into a percent width", () => {
    for (const value of noisy) {
      expect(scoreWidth(value)).toBe(`${Math.round((value / 5) * 100)}%`)
      expect(scoreWidth(value)).toMatch(/^\d{1,3}%$/)
      expect(scorePercent(value)).toMatch(/^\d{1,3}$/)
    }
    expect(scoreWidth(4.8999999999999995)).toBe("98%")
    expect(scoreWidth(4.4)).toBe("88%")
    expect(scoreWidth(5)).toBe("100%")
  })

  it("scores a non-finite value defensively", () => {
    expect(formatScore(Number.NaN)).toBe("—")
    expect(scorePercent(Number.NaN)).toBe("0")
  })

  it("every cohort category score is clean once formatted", () => {
    for (const review of reviews) {
      for (const rating of review.ratings) {
        expect(formatScore(rating.score)).toMatch(/^\d\.\d$/)
        expect(scoreWidth(rating.score)).toMatch(/^\d+%$/)
      }
    }
  })
})

describe("CD-7: indefinite article", () => {
  it("picks A before a consonant sound even when the letter is a vowel", () => {
    expect(articleFor("Okta")).toBe("A")
    expect(withArticle("Okta")).toBe("A Okta")
  })

  it("picks An before a vowel sound", () => {
    for (const name of ["Affinity", "Auth0", "Evernote", "Expensify", "InVision", "Obsidian", "Optimizely", "Outreach"]) {
      expect(articleFor(name)).toBe("An")
      expect(withArticle(name)).toBe(`An ${name}`)
    }
  })

  it("produces a sane article for every cohort tool", () => {
    for (const review of reviews) {
      expect(withArticle(review.name)).toMatch(/^(A|An) /)
    }
  })
})

describe("CD-5 / CD-6: review metadata", () => {
  const cases = reviews.map((r) => ({
    name: r.name,
    title: reviewMetaTitle(r.name),
    description: reviewMetaDescription(r.name, r.tagline, r.category),
  }))

  it("builds a distinct title for every cohort review", () => {
    expect(new Set(cases.map((c) => c.title)).size).toBe(COHORT.length)
  })

  it("keeps every default title inside the metadata truncation limit", () => {
    for (const c of cases) {
      expect(c.title.length).toBeLessThanOrEqual(58)
      expect(truncateAtWordBoundary(c.title, 70)).toBe(c.title)
    }
  })

  it("builds a distinct meta description from real facts", () => {
    expect(new Set(cases.map((c) => c.description)).size).toBe(COHORT.length)
    for (const c of cases) expect(c.description.length).toBeLessThanOrEqual(160)
  })

  it("runs descriptions through createMetadata without re-truncating them", () => {
    const rendered = cases.map((c) => ({
      description: c.description,
      meta: createMetadata({ title: c.title, description: c.description, path: "/reviews/x" }),
    }))
    expect(new Set(rendered.map((r) => r.meta.title)).size).toBe(COHORT.length)
    expect(new Set(rendered.map((r) => r.meta.description)).size).toBe(COHORT.length)
    for (const { description, meta } of rendered) {
      expect(String(meta.title)).not.toContain("…")
      expect(String(meta.title).length).toBeLessThanOrEqual(70)
      expect(String(meta.description).length).toBeLessThanOrEqual(160)
      expect(meta.description).toBe(description)
      expect(String(meta.description)).not.toContain("PilotStack")
    }
  })

  it("does not promise alternatives it does not have", () => {
    for (const c of cases) expect(c.description.toLowerCase()).not.toContain("alternatives")
  })

  it("never doubles the category noun or leaves a double space", () => {
    for (const c of cases) {
      expect(c.description).not.toMatch(/tools tools/i)
      expect(c.description).not.toMatch(/ {2,}/)
    }
  })

  it("prefixes the description with a correct article and the tool name", () => {
    for (const c of cases) expect(c.description.startsWith(`${withArticle(c.name)} review:`)).toBe(true)
  })
})

describe("CD-13: rating-restating pros", () => {
  it("recognises the restatement template", () => {
    expect(isRatingRestatement("Rated 4.1 out of 5 from 1,820 reviews in this repository's recorded data")).toBe(true)
    expect(isRatingRestatement("Best for teams that need shared pipelines")).toBe(false)
  })

  it("drops exactly one pro from every page that carries it", () => {
    let touched = 0
    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i]
      const filtered = editorialPros(review.pros)
      const removed = review.pros.length - filtered.length
      if (removed > 0) touched++
      expect(removed).toBeLessThanOrEqual(1)
      expect(filtered.every((p: string) => !isRatingRestatement(p))).toBe(true)
    }
    expect(touched).toBeGreaterThan(0)
  })

  it("never invents a replacement pro", () => {
    for (const review of reviews) {
      expect(editorialPros(review.pros).length).toBeLessThanOrEqual(review.pros.length)
      expect(editorialPros(review.pros)).toEqual(review.pros.filter((p: string) => !isRatingRestatement(p)))
    }
  })
})

describe("CD-1: company facts with conflicting sources", () => {
  const reviewSide = {
    company: {
      founded: 2023,
      headquarters: "United States",
      customers: "110K+",
      employeeCount: "350+",
      industries: ["Design & Creative"],
      pricingModel: "One-time purchase",
      deployment: ["Web"],
      apiAvailable: true,
      migrationComplexity: "Medium",
    } as unknown as NonNullable<AnyJson["company"]>,
  }
  const entitySide: { company?: CompanyDetail } = {
    company: {
      website: "https://affinity.serif.com",
      legalName: "Affinity Designer Ltd",
      founded: 2014,
      headquarters: "Nottingham, UK",
      employees: "200+",
      customers: "5,000,000+",
      industries: ["Design", "Creative"],
      platforms: ["Web", "macOS"],
    },
  }

  it("omits every field whose two sources disagree", () => {
    const facts = resolveCompanyFacts(reviewSide, entitySide)
    expect(facts.founded).toBeUndefined()
    expect(facts.headquarters).toBeUndefined()
    expect(facts.customers).toBeUndefined()
    expect(facts.employeeCount).toBeUndefined()
    expect(facts.industries).toBeUndefined()
    expect(facts.conflicts).toEqual(
      expect.arrayContaining(["founded", "headquarters", "customers", "employees", "industries"])
    )
  })

  it("keeps fields only one source holds, with provenance", () => {
    const facts = resolveCompanyFacts(reviewSide, entitySide)
    expect(facts.pricingModel).toBe("One-time purchase")
    expect(facts.legalName).toBe("Affinity Designer Ltd")
    expect(facts.platforms).toEqual(["Web", "macOS"])
  })

  it("keeps fields when both sources agree", () => {
    const agreed = { company: { ...reviewSide.company, founded: 2014, headquarters: "Nottingham, UK" } as unknown as CompanyInfo }
    const facts = resolveCompanyFacts(agreed, entitySide)
    expect(facts.founded).toBe(2014)
    expect(facts.headquarters).toBe("Nottingham, UK")
    expect(facts.conflicts).not.toContain("founded")
    expect(facts.conflicts).not.toContain("headquarters")
  })

  it("treats differently-grouped industry lists as disagreement", () => {
    const facts = resolveCompanyFacts(reviewSide, entitySide)
    expect(facts.conflicts).toContain("industries")
  })

  it("never publishes a conflicting value on any cohort page", () => {
    const shared: [keyof CompanyFacts, string, string][] = [
      ["founded", "founded", "founded"],
      ["headquarters", "headquarters", "headquarters"],
      ["customers", "customers", "customers"],
      ["employeeCount", "employeeCount", "employees"],
      ["industries", "industries", "industries"],
    ]
    const normalise = (value: unknown): string =>
      (Array.isArray(value) ? value : [value])
        .flatMap((v) => String(v).split("|"))
        .map((s) => s.trim().toLowerCase())
        .sort()
        .join("|")

    let disagreements = 0
    for (const slug of COHORT) {
      const review = load(slug)
      const entity = getEntity(slug)
      const facts = resolveCompanyFacts(review as AnyJson, entity)
      const reviewCompany = (review.company ?? {}) as AnyJson
      const entityCompany = (entity?.company ?? {}) as AnyJson
      for (const [factKey, reviewKey, entityKey] of shared) {
        const reviewValue = reviewCompany[reviewKey]
        const entityValue = entityCompany[entityKey]
        if (reviewValue === undefined || entityValue === undefined) continue
        if (normalise(reviewValue) === normalise(entityValue)) {
          expect(facts[factKey]).toBeDefined()
          continue
        }
        disagreements++
        expect(facts.conflicts).toContain(entityKey)
        expect(facts[factKey]).toBeUndefined()
      }
    }
    expect(disagreements).toBeGreaterThan(0)
  })

  it("still reports usable company facts for the cohort", () => {
    for (const slug of COHORT) {
      const review = load(slug)
      const facts = resolveCompanyFacts(review as AnyJson, null)
      expect(hasCompanyFacts(facts)).toBe(true)
      expect(facts.conflicts).toEqual([])
    }
  })
})

describe("CD-2: security certification evidence states", () => {
  const entity: SoftwareEntity = {
    slug: "affinity",
    name: "Affinity",
    company: { website: "https://affinity.serif.com" },
    security: {
      soc2: null,
      iso27001: undefined,
      gdpr: null,
      hipaa: undefined,
      ccpa: null,
      pciDss: undefined,
      sso: true,
      mfa: true,
      encryption: "AES-256 at rest, TLS 1.3 in transit",
      penetrationTesting: true,
      bugBounty: true,
    },
  }

  const html = renderToStaticMarkup(React.createElement(SecurityTable, { entity }))

  it("never reports an unverified certification as Not certified", () => {
    expect(html).not.toContain("Not certified")
    expect(html).toContain("Certification information not verified")
  })

  it("shows the evidence-model note so readers know what the states mean", () => {
    expect(html).toContain("site&#x27;s own records only")
    expect(html).toContain("not a statement that the vendor")
  })

  it("qualifies recorded penetration-testing and bug-bounty entries", () => {
    expect(html).toContain("Recorded: regular testing")
    expect(html).toContain("Recorded: active program")
  })

  it("still distinguishes a genuinely negative record from an unverified one", () => {
    const withFalse: SoftwareEntity = { ...entity, security: { ...entity.security, soc2: false } }
    const rendered = renderToStaticMarkup(React.createElement(SecurityTable, { entity: withFalse }))
    expect(rendered).toContain("Recorded as not certified")
    expect(rendered).toContain("Certification information not verified")
  })

  it("skips certification fields the repository does not hold at all", () => {
    expect(html).not.toContain("ISO 27001")
    expect(html).not.toContain("HIPAA Compliant")
    expect(html).not.toContain("PCI DSS Compliant")
  })
})

describe("CD-3 / CD-8: review JSON-LD", () => {
  function schemaJson(element: unknown): Record<string, unknown> {
    const props = (element as { props: { dangerouslySetInnerHTML: { __html: string } } }).props
    return JSON.parse(props.dangerouslySetInnerHTML.__html)
  }

  const schema = schemaJson(
    ReviewSchema({
      name: "Affinity",
      description: "A design suite.",
      rating: 4.6,
      url: "https://www.pilotstack.online/reviews/affinity",
      datePublished: "2026-01-01",
      body: "A design suite.",
      image: "https://www.pilotstack.online/logos/affinity.svg",
      companyInfo: resolveCompanyFacts(load("affinity") as AnyJson, getEntity("affinity")),
    })
  )

  it("emits a single Product node", () => {
    expect(schema["@type"]).toBe("Product")
  })

  it("carries the image that used to live on the removed Product block", () => {
    expect(JSON.stringify(schema)).toContain("/logos/affinity.svg")
  })

  it("carries no AggregateRating built from repository dataset figures", () => {
    expect(JSON.stringify(schema)).not.toContain("AggregateRating")
  })

  it("keeps the editorial review rating", () => {
    const review = schema.review as { reviewRating: { ratingValue: number; bestRating: number } }
    expect(review.reviewRating.ratingValue).toBe(4.6)
    expect(review.reviewRating.bestRating).toBe(5)
  })

  it("does not publish a countryOfOrigin when the company sources disagree", () => {
    const disputed = resolveCompanyFacts(
      { company: { founded: 2023, headquarters: "United States" } as unknown as CompanyInfo },
      { company: { website: "https://affinity.serif.com", founded: 2014, headquarters: "Nottingham, UK" } }
    )
    expect(disputed.conflicts).toEqual(expect.arrayContaining(["founded", "headquarters"]))
    const out = schemaJson(
      ReviewSchema({
        name: "Affinity",
        description: "A design suite.",
        rating: 4.6,
        url: "https://www.pilotstack.online/reviews/affinity",
        companyInfo: disputed,
      })
    )
    expect(JSON.stringify(out)).not.toContain("countryOfOrigin")
    expect(JSON.stringify(out)).not.toContain("foundingDate")
  })

  it("publishes countryOfOrigin only when the sources agree", () => {
    const agreed = schemaJson(
      ReviewSchema({
        name: "Affinity",
        description: "A design suite.",
        rating: 4.6,
        url: "https://www.pilotstack.online/reviews/affinity",
        companyInfo: { founded: 2014, headquarters: "United Kingdom" },
      })
    )
    expect(JSON.stringify(agreed)).toContain("countryOfOrigin")
    expect(JSON.stringify(agreed)).toContain("foundingDate")
  })

  it("the review page no longer renders a second Product block", () => {
    const page = readSrc("src/app/reviews/[slug]/page.tsx")
    expect(page).not.toContain("ProductSchema")
    expect(page).not.toContain("aggregateRating=")
  })
})

describe("CD-9: alternatives language on review pages", () => {
  const page = readSrc("src/app/reviews/[slug]/page.tsx")

  it("no longer claims an alternatives dataset exists on every page", () => {
    expect(page).not.toContain("Alternatives exist")
  })

  it("no longer describes generated comparisons as verified", () => {
    expect(page).not.toContain("verified entity data")
  })

  it("frames the section as a comparison rather than a ranking", () => {
    expect(page).toContain("How {tool.name} Compares")
    expect(page).not.toContain("Top Alternatives")
  })

  it("only lists alternatives in Key Takeaways when the review actually carries them", () => {
    expect(page).toContain("tool.alternatives.length > 0")
  })

  it("prefers same-category tools when generating comparison cards", () => {
    const component = readSrc("src/components/entity/auto-comparison.tsx")
    expect(component).toContain("source.category")
    expect(component).not.toContain("allEntities.slice(0, 3)")
  })
})

describe("CD-10: methodology and EEAT claims", () => {
  const files = [
    "src/components/seo/editorial-process.tsx",
    "src/app/methodology/page.tsx",
    "src/app/how-we-test-software/page.tsx",
    "src/app/about/page.tsx",
    "src/app/team/page.tsx",
    "src/app/authors/page.tsx",
    "src/app/authors/[slug]/page.tsx",
    "src/app/editorial-policy/page.tsx",
    "src/app/fact-checking-policy/page.tsx",
    "src/app/media-kit/page.tsx",
    "src/app/press/page.tsx",
    "src/app/research-methodology/page.tsx",
    "src/app/reviews/[slug]/page.tsx",
  ]

  const banned = [
    /hands-on testing/i,
    /two weeks/i,
    /two-week/i,
    /five-dimension/i,
    /five equally weighted/i,
    /two-person verification/i,
    /second team member/i,
    /second analyst/i,
    /quarterly calibration/i,
  ]

  for (const file of files) {
    it(`${file} makes no unverifiable testing claim`, () => {
      const src = readSrc(file)
      for (const pattern of banned) expect(src).not.toMatch(pattern)
    })
  }

  it("the review sidebar explains how the page is built instead of claiming tests", () => {
    const src = readSrc("src/components/seo/editorial-process.tsx")
    expect(src).toContain("recorded category ratings")
    expect(src).toContain("Commercial relationships do not determine editorial ratings, rankings, or inclusion criteria.")
  })

  it("methodology publishes a checkable scoring rule", () => {
    const src = readSrc("src/app/methodology/page.tsx")
    expect(src).toContain("mean of those nine scores")
    expect(src).toContain("publish neither value")
  })

  it("review pages do not point readers at a testing process they can verify", () => {
    const page = readSrc("src/app/reviews/[slug]/page.tsx")
    expect(page).not.toContain("How we test")
    expect(page).toContain("How we score")
  })
})

describe("CD-14: author claims", () => {
  const authors = readSrc("src/app/authors/[slug]/page.tsx")
  const authorsIndex = readSrc("src/app/authors/page.tsx")

  const banned = [
    /UC Berkeley/i,
    /TechCrunch/i,
    /VentureBeat/i,
    /Gartner/i,
    /Fortune 500/i,
    /AWS & Azure certified/i,
    /decade in product management/i,
    /8 years of experience/i,
    /10\+ years/i,
    /cited by industry publications/i,
    /testing methodology/i,
    /five-dimension/i,
  ]

  for (const [label, src] of [["profile", authors], ["index", authorsIndex]] as const) {
    it(`${label} carries no unverifiable credential`, () => {
      for (const pattern of banned) expect(src).not.toMatch(pattern)
    })
  }

  it("keeps every author identity in place", () => {
    for (const slug of ["sarah-chen", "marcus-rivera", "emily-nakamura", "pilotstack-team"]) {
      expect(authors).toContain(`"${slug}"`)
    }
    expect(authorsIndex).toContain("sarah-chen")
    expect(authorsIndex).toContain("marcus-rivera")
    expect(authorsIndex).toContain("emily-nakamura")
  })

  it("no author bio claims unpublished biographical facts", () => {
    expect(authors).not.toMatch(/holds a degree/i)
    expect(authors).not.toMatch(/worked as a solutions architect/i)
    expect(authors).not.toMatch(/personally reviews tools/i)
  })
})
