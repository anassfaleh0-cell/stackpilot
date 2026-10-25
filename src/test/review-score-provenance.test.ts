import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"

const REVIEW_PAGE = path.join(process.cwd(), "src", "app", "reviews", "[slug]", "page.tsx")
const HOME_PAGE = path.join(process.cwd(), "src", "app", "page.tsx")
const GUIDES_PAGE = path.join(process.cwd(), "src", "app", "guides", "page.tsx")
const REVIEWS_INDEX = path.join(process.cwd(), "src", "app", "reviews", "page.tsx")
const METHODOLOGY_PAGE = path.join(process.cwd(), "src", "app", "methodology", "page.tsx")
const BLOG_PAGE = path.join(process.cwd(), "src", "app", "blog", "page.tsx")
const BEST_PAGE = path.join(process.cwd(), "src", "app", "best", "page.tsx")
const ALTERNATIVES_PAGE = path.join(process.cwd(), "src", "app", "alternatives", "page.tsx")
const USE_CASES_PAGE = path.join(process.cwd(), "src", "app", "use-cases", "page.tsx")
const INDUSTRIES_PAGE = path.join(process.cwd(), "src", "app", "industries", "page.tsx")
const STATISTICS_PAGE = path.join(process.cwd(), "src", "app", "statistics", "page.tsx")
const STATISTICS_DETAIL_PAGE = path.join(process.cwd(), "src", "app", "statistics", "[slug]", "page.tsx")

describe("review score provenance", () => {
  it("labels PilotStack scores as editorial assessments instead of third-party review aggregates", () => {
    const source = fs.readFileSync(REVIEW_PAGE, "utf8")

    expect(source).toContain("(PilotStack editorial score)")
    expect(source).toContain("this is PilotStack's assessment, not a third-party review aggregate")
    expect(source).toContain("tool.scoreBasis")
    expect(source).not.toContain("across ${tool.reviewCount.toLocaleString()} recorded reviews")
    expect(source).not.toContain("({tool.reviewCount.toLocaleString()} reviews)")
    expect(source).not.toContain("const isBestValue = tool.pricing")
    expect(source).not.toContain("<Badge variant=\"warning\">Best Value</Badge>")
    expect(source).toContain("Highest Editorial Score in Category")
    expect(source).not.toContain("Best in Category")
  })
  it("keeps commercial and expertise claims consistent with published disclosures", () => {
    const home = fs.readFileSync(HOME_PAGE, "utf8")
    const guides = fs.readFileSync(GUIDES_PAGE, "utf8")
    const reviewsIndex = fs.readFileSync(REVIEWS_INDEX, "utf8")
    const methodology = fs.readFileSync(METHODOLOGY_PAGE, "utf8")
    const blog = fs.readFileSync(BLOG_PAGE, "utf8")
    const best = fs.readFileSync(BEST_PAGE, "utf8")
    const alternatives = fs.readFileSync(ALTERNATIVES_PAGE, "utf8")
    const useCases = fs.readFileSync(USE_CASES_PAGE, "utf8")
    const industries = fs.readFileSync(INDUSTRIES_PAGE, "utf8")
    const statistics = fs.readFileSync(STATISTICS_PAGE, "utf8")
    const statisticsDetail = fs.readFileSync(STATISTICS_DETAIL_PAGE, "utf8")

    expect(home).toContain("Commercial relationships are disclosed")
    expect(home).not.toContain("No paid placements. No vendor influence.")
    expect(home).not.toContain("Independent & Unbiased")
    expect(home).not.toContain("Expert advice, straight to your inbox")
    expect(guides).not.toContain("Expert guides")
    expect(guides).not.toContain('name="Expert Guides"')
    expect(reviewsIndex).not.toContain("unbiased reviews of the best software tools")
    expect(methodology).not.toContain("no paid placements")
    expect(methodology).not.toContain("no vendor can pay for placement")
    expect(blog).not.toContain("Expert Reviews")
    expect(blog).not.toContain("hands-on tutorials")
    expect(blog).not.toContain("Expert perspectives")
    expect(best).not.toContain("Expert-curated")
    expect(best).not.toContain("research-backed")
    expect(best).not.toContain("Updated quarterly")
    expect(alternatives).not.toContain("expert-curated")
    expect(alternatives).not.toContain("expert analysis")
    expect(useCases).not.toContain("Expert-curated")
    expect(industries).not.toContain("Expert-curated")
    expect(statistics).not.toContain("Verified statistics")
    expect(statistics).not.toContain("updated yearly")
    expect(statisticsDetail).toContain("Figures without a direct source link are withheld until they can be checked")
    expect(statisticsDetail).toContain("confirm the exact number, definition, geography, and publication date")
    expect(statisticsDetail).not.toContain("legacyStats")
    expect(statisticsDetail).toContain("Figure not verified")
    expect(statisticsDetail).toContain("numeric figure is withheld")
    expect(statisticsDetail).toContain("const sourceVerified = registry?.sourceAuditComplete === true && Boolean(stat.sourceUrl)")
    expect(statisticsDetail).toContain("sourceVerified && stat.sourceUrl ?")
    expect(statisticsDetail).toContain("The numeric value remains unverified until the original report or dataset is checked.")
    expect(statisticsDetail).not.toContain('sourceUrl: st.sourceUrl || "#"')
    expect(statisticsDetail).toContain("/^https?:\\/\\//i.test(st.sourceUrl)")
    expect(statisticsDetail).toContain("if (!page) notFound()")
    expect(home).toContain('getAllComparisons().filter((cmp) => isContentAvailable("comparison", cmp.slug))')
    expect(home).toContain('getAllBlogPosts().filter((post) => isContentAvailable("blog", post.slug))')
    expect(home).toContain('getAllGlossaryTerms().filter((term) => isContentAvailable("glossary", term.slug))')
    expect(home).toContain('getAllResearch().filter((item) => isContentAvailable("research", item.slug))')
  })
  it("keeps stored best-of scores visible but clearly labels unverified values as not validated ratings", () => {
    const bestDetail = fs.readFileSync(path.join(process.cwd(), "src", "app", "best", "[slug]", "page.tsx"), "utf8")

    expect(bestDetail).toContain("Unverified stored value — not a validated rating")
    expect(bestDetail).toContain("Unverified stored value, not a validated rating")
    expect(bestDetail).toContain("{storedPickRating(pick)}/5")
    expect(bestDetail).toContain('verifiedPickRating(pick) !== null && <Star')
    expect(bestDetail).not.toContain('className="fill-accent text-accent" />\n                            {storedPickRating')
  })

  it("does not leak unverified rating or pricing claims into related best-guide cards", () => {
    const bestDetail = fs.readFileSync(path.join(process.cwd(), "src", "app", "best", "[slug]", "page.tsx"), "utf8")

    expect(bestDetail).toContain("const hasUnverifiedRatings = related.picks.some((pick) => pick.ratingVerified !== true)")
    expect(bestDetail).toContain("const hasUnverifiedPricing = related.picks.some((pick) => pick.priceRangeVerified !== true)")
    expect(bestDetail).toContain("Ratings and pricing are not independently verified")
    expect(bestDetail).toContain("stripUnverifiedPriceClaims(stripUnverifiedRatingClaims(related.description))")
  })

  it("does not render empty Pros or Cons lists in best-of option cards", () => {
    const bestDetail = fs.readFileSync(path.join(process.cwd(), "src", "app", "best", "[slug]", "page.tsx"), "utf8")

    expect(bestDetail).toContain("pick.pros.length > 0 ?")
    expect(bestDetail).toContain("pick.cons.length > 0 ?")
    expect(bestDetail).toContain("No evidence-backed strengths are recorded for {pick.toolName}")
    expect(bestDetail).toContain("No specific limitations are recorded for {pick.toolName}")
  })

  it("keeps best-of FAQ sections non-empty after unsafe or blank questions are filtered", () => {
    const bestDetail = fs.readFileSync(path.join(process.cwd(), "src", "app", "best", "[slug]", "page.tsx"), "utf8")

    expect(bestDetail).toContain("const sanitizedBestFaqs = page.faqs")
    expect(bestDetail).toContain(".filter((faq) => faq.question.length > 0 && faq.answer.length > 0)")
    expect(bestDetail).toContain("const safeFaqs = sanitizedBestFaqs.length > 0 ? sanitizedBestFaqs")
    expect(bestDetail).toContain("Treat each rating according to its visible verification label")
  })

  it("does not render missing score dimensions as partially filled score bars", () => {
    const source = fs.readFileSync(REVIEW_PAGE, "utf8")

    // The rubric weight is metadata, not a score. An unassessed dimension must stay visually empty.
    expect(source).toContain('recorded ? scoreWidth(recorded.score) : "0%"')
    expect(source).toContain('${dimension.weight} · Not assessed')
    expect(source).not.toContain('recorded ? scoreWidth(recorded.score) : dimension.weight')
  })


  it("always surfaces review score status and uses only valid five-point ratings", () => {
    const source = fs.readFileSync(REVIEW_PAGE, "utf8")

    expect(source).toContain("Review Claim, Rating &amp; Verdict")
    expect(source).toContain("Pending evidence audit")
    expect(source).toContain("No numeric score is available in the record")
    expect(source).toContain("tool.rating > 0 && tool.rating <= 5")
    expect(source).toContain("const reviewVerdict = [")
  })

  it("explains missing provenance for preserved provisional legacy scores", () => {
    const source = fs.readFileSync(REVIEW_PAGE, "utf8")

    expect(source).toContain("Score provenance: this legacy stored editorial value has no source-linked rationale or reproducible score breakdown recorded in this profile.")
    expect(source).toContain("retained for transparency, but remains provisional")
    expect(source).toContain("should not be treated as independently verified or directly comparable to verified ratings")
  })

  it("always surfaces comparison ratings, feature-score status, winner status and a non-empty verdict", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src", "app", "comparisons", "[slug]", "page.tsx"), "utf8")

    expect(source).toContain("Ratings, Scores, Winner &amp; Verdict")
    expect(source).toContain("review1.rating > 0 && review1.rating <= 5")
    expect(source).toContain("review2.rating > 0 && review2.rating <= 5")
    expect(source).toContain("Feature-coverage score: not verified / not available")
    expect(source).toContain("Use-case dependent: compare must-have workflows, integrations, permissions, and total cost before choosing.")
    expect(source).toContain("How to interpret comparison scores")
    expect(source).toContain("Feature-coverage percentages count only rows with recorded boolean values for both products.")
    expect(source).toContain("A winner is verified only when this comparison's record explicitly marks it verified.")
  })

  it("accepts the actual published legacy score provenance disclosure in the production smoke check", () => {
    const smoke = fs.readFileSync(path.join(process.cwd(), "scripts", "production-smoke-check.cjs"), "utf8")

    expect(smoke).toContain('normalizedLinearBody.includes("retained for transparency, but remains provisional")')
    expect(smoke).toContain('normalizedLinearBody.includes("no source-linked rationale or reproducible score breakdown recorded in this profile")')
    expect(smoke).toContain('"accepted provenance disclosure=" + hasHonestScoreDisclosure')
  })

})
