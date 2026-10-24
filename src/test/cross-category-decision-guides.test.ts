import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const crossCategorySlugs = [
  "airtable-vs-confluence",
  "asana-vs-confluence",
  "basecamp-vs-confluence",
  "bigcommerce-vs-expensify",
  "bigcommerce-vs-freshbooks",
  "bigcommerce-vs-paddle",
  "bigcommerce-vs-paypal",
  "bigcommerce-vs-quickbooks",
  "bigcommerce-vs-sage-intacct",
  "bigcommerce-vs-sage",
  "bigcommerce-vs-square",
  "bigcommerce-vs-stripe",
  "bigcommerce-vs-wave",
  "bigcommerce-vs-woocommerce",
  "bigcommerce-vs-xero",
  "bigcommerce-vs-zoho-books",
  "chatgpt-vs-synthesia",
  "claude-vs-synthesia",
  "clickup-vs-confluence",
  "confluence-vs-linear",
  "confluence-vs-monday-com",
  "confluence-vs-smartsheet",
  "confluence-vs-trello",
  "confluence-vs-wrike",
  "copilot-vs-synthesia",
  "copy-ai-vs-synthesia",
  "dialpad-vs-slack",
  "dialpad-vs-zoom",
  "discord-vs-zoom",
  "gemini-vs-synthesia",
  "grammarly-vs-synthesia",
  "jasper-vs-synthesia",
  "jira-vs-confluence",
  "microsoft-teams-vs-slack",
  "microsoft-teams-vs-zoom",
  "midjourney-vs-synthesia",
  "perplexity-vs-synthesia",
  "ringcentral-vs-slack",
  "ringcentral-vs-zoom",
  "runway-vs-synthesia",
  "slack-vs-discord",
  "slack-vs-microsoft-teams-remote",
  "slack-vs-microsoft-teams",
  "slack-vs-telegram",
  "slack-vs-vonage",
  "slack-vs-webex",
  "synthesia-vs-writesonic",
  "telegram-vs-zoom",
  "vonage-vs-zoom",
  "zoom-vs-google-meet",
  "zoom-vs-webex"
]

describe("cross-category comparisons are honest workflow decision guides", () => {
  it("does not publish unsupported winners or feature scores for unlike products", () => {
    for (const slug of crossCategorySlugs) {
      const file = path.join(root, "content", "comparisons", `${slug}.json`)
      const comparison = JSON.parse(fs.readFileSync(file, "utf8")) as {
        decisionGuide?: boolean
        winnerVerified?: boolean
        featuresVerified?: boolean
        description?: string
        verdict?: string
        faqs?: Array<{ question: string; answer: string }>
        tool1?: string
        tool2?: string
      }
      expect(comparison.decisionGuide, slug).toBe(true)
      expect(comparison.winnerVerified, slug).toBe(false)
      expect(comparison.featuresVerified, slug).toBe(false)
      expect(comparison.description, slug).toContain(comparison.tool1)
      expect(comparison.description, slug).toContain(comparison.tool2)
      expect(comparison.description, slug).toMatch(/workflow|use case|job|category/i)
      expect(comparison.verdict, slug).toMatch(/no universal winner|neither .* is a universal winner|no evidence-based universal winner|does not establish a verified overall winner/i)
      expect(comparison.faqs?.length ?? 0, slug).toBeGreaterThanOrEqual(5)
      expect((comparison.faqs ?? []).every((faq) => faq.question.includes(comparison.tool1!) || faq.question.includes(comparison.tool2!) || /total cost|verified winner/i.test(faq.question)), slug).toBe(true)
    }
  })

  it("classifies Shopify and BigCommerce consistently as e-commerce platforms", () => {
    const shopify = JSON.parse(fs.readFileSync(path.join(root, "content", "reviews", "shopify.json"), "utf8")) as { category: string }
    const comparison = JSON.parse(fs.readFileSync(path.join(root, "content", "comparisons", "shopify-vs-bigcommerce.json"), "utf8")) as { category: string; decisionGuide?: boolean; winnerVerified?: boolean; featuresVerified?: boolean }
    expect(shopify.category).toBe("E-commerce")
    expect(comparison.category).toBe("E-commerce")
    expect(comparison.decisionGuide).toBe(true)
    expect(comparison.winnerVerified).toBe(false)
    expect(comparison.featuresVerified).toBe(false)
  })
})
