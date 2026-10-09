import { describe, it, expect } from "vitest"
import fs from "node:fs"

describe("AdSense publisher declaration", () => {
  it("publishes a syntactically valid Google seller record", () => {
    const lines = fs.readFileSync("public/ads.txt", "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
    const googleLines = lines.filter((line) => /^google\.com\s*,/i.test(line))

    expect(googleLines).toHaveLength(1)
    expect(googleLines[0]).toMatch(/^google\.com\s*,\s*pub-\d+\s*,\s*DIRECT\s*,\s*[a-f0-9]{16}\s*$/i)
    expect(googleLines[0]).toContain("pub-6523926892521982")
  })

  it("sets a plain-text content type for the ads.txt route", () => {
    const config = JSON.parse(fs.readFileSync("vercel.json", "utf8"))
    const rule = config.headers.find((entry: { source: string }) => entry.source === "/ads.txt")
    expect(rule).toBeDefined()
    expect(rule.headers).toContainEqual({ key: "Content-Type", value: "text/plain" })
  })
})
