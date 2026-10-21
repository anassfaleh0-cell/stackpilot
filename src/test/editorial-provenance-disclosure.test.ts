import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"

function readPage(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8")
}

describe("editorial provenance disclosures", () => {
  it("explains the ongoing audit of legacy ratings and numeric claims", () => {
    const methodology = readPage("src/app/methodology/page.tsx")
    const evaluationProcess = readPage("src/app/how-we-test-software/page.tsx")
    const about = readPage("src/app/about/page.tsx")
    const team = readPage("src/app/team/page.tsx")
    const policy = readPage("src/app/editorial-policy/page.tsx")

    expect(methodology).toMatch(/source audit|undergoing a source audit|under audit/i)
    expect(evaluationProcess).toMatch(/source-provenance review|provenance review/i)
    expect(about).toMatch(/source audit/i)
    expect(team).toMatch(/source verification|source-provenance/i)
    expect(policy).toMatch(/source-provenance review|source audit/i)
  })

  it("avoids blanket claims that every legacy score is already verified", () => {
    const evaluationProcess = readPage("src/app/how-we-test-software/page.tsx")
    const team = readPage("src/app/team/page.tsx")
    const about = readPage("src/app/about/page.tsx")

    expect(evaluationProcess).not.toContain("Ratings are arithmetic you can check on any review page")
    expect(evaluationProcess).not.toContain("Every page carries a last-reviewed date")
    expect(team).not.toContain("the process behind every score is public")
    expect(about).not.toContain("See exactly how we reach every conclusion")
  })
})
