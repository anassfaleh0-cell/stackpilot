import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

describe("AdSense ads.txt declaration", () => {
  it("publishes the configured Google AdSense seller record", () => {
    const adsTxt = fs.readFileSync(path.join(process.cwd(), "public/ads.txt"), "utf8")
    const records = adsTxt.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)

    expect(records).toContain("google.com, pub-6523926892521982, DIRECT, f08c47fec0942fa0")
  })
})
