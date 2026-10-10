import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const SCANNED = [path.join(ROOT, "src"), path.join(ROOT, "content"), path.join(ROOT, "public")]

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (/\.(tsx?|json|txt|html|md|xml)$/.test(entry.name)) out.push(full)
  }
  return out
}

function source(): Array<{ file: string; text: string }> {
  return SCANNED.flatMap((dir) => walk(dir))
    .filter((file) => !file.includes(`${path.sep}test${path.sep}`))
    .map((file) => ({ file, text: fs.readFileSync(file, "utf8") }))
}

describe("cloudflare email obfuscation", () => {
  it("wraps the document in Cloudflare's documented email_off opt-out", () => {
    const layout = fs.readFileSync(path.join(ROOT, "src", "app", "layout.tsx"), "utf8")
    const open = layout.indexOf("<!--email_off-->")
    const close = layout.indexOf("<!--/email_off-->")
    expect(open).toBeGreaterThan(-1)
    expect(close).toBeGreaterThan(open)
    expect(layout.indexOf("<body")).toBeLessThan(open)
    expect(layout.indexOf("</body>")).toBeGreaterThan(close)
  })

  it("never emits a link to the /cdn-cgi/ endpoint", () => {
    const offenders = source()
      .filter((entry) => entry.text.includes("/cdn-cgi/"))
      .map((entry) => path.relative(ROOT, entry.file).replace(/\\/g, "/"))
    expect(offenders).toEqual([])
  })
})
