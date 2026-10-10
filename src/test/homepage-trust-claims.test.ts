import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const homepage = fs.readFileSync(path.join(process.cwd(), "src/app/page.tsx"), "utf8")

describe("homepage trust claims", () => {
  it("does not claim there are no paid placements while commercial placements may be offered", () => {
    expect(homepage).not.toContain("No paid placements. No vendor influence.")
    expect(homepage).toContain("Paid placements are disclosed separately; payment does not determine editorial ratings or rankings.")
  })

  it("does not promise a quarterly review cadence without page-level verification", () => {
    expect(homepage).not.toContain("Content reviewed and refreshed quarterly")
    expect(homepage).toContain("We update content when material product or pricing changes are verified.")
  })
})
