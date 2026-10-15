import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("public ads.txt", () => {
  const adsTxtPath = path.join(process.cwd(), "public", "ads.txt")

  it("contains the configured Google AdSense publisher record exactly once", () => {
    const records = readFileSync(adsTxtPath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))

    expect(records).toEqual([
      "google.com, pub-6523926892521982, DIRECT, f08c47fec0942fa0",
    ])
  })

  it("uses the four-field ads.txt format", () => {
    const records = readFileSync(adsTxtPath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))

    for (const record of records) {
      expect(record.split(",").map((field) => field.trim())).toHaveLength(4)
    }
  })
})
