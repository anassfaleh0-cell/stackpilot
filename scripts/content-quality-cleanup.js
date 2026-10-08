const fs = require("node:fs")
const path = require("node:path")

const ROOT = path.join(__dirname, "..")
// One-shot cleanup is intentionally idempotent so it can safely run after content, test, or build fixes.
const CONTENT_DIRS = [
  "content/guides","content/comparisons","content/reviews","content/best","content/blog",
  "content/glossary","content/alternatives","content/use-cases","content/industries",
  "content/research","content/statistics","content/hubs",
]

const replacements = [
  [/After reviewing available information on ([^,]+) platforms and analyzing user reviews, here is our buying guidance for choosing between ([^:]+):/gi,
    (_m, a, b) => `When comparing ${a} platforms and reviewing available user feedback, here is our buying guidance for choosing between ${b}:`],
  [/our buying guidance/gi, "our buying guidance"],
  [/our editorial team has evaluated/gi, "our editorial comparison covers"],
  [/our editorial team evaluated/gi, "our editorial comparison covers"],
  [/independently evaluated and would recommend/gi, "compared against the published criteria"],
  [/evaluated under the same conditions as/gi, "compared using consistent published criteria with"],
  [/tested in realistic workflows by our team/gi, "reviewed against representative workflow criteria"],
  [/this review is based on hands[- ]on testing/gi, "this review is based on documented product information and comparison criteria"],
  [/we verify our hands[- ]on testing/gi, "we verify the underlying product information"],
  [/hands[- ]on testing/gi, "structured product review"],
  [/our testing methodology/gi, "our comparison methodology"],
  [/based on our testing methodology/gi, "based on our comparison methodology"],
  [/hands[- ]on review/gi, "detailed review"],
  [/after researching hundreds of/gi, "after reviewing available information on"],
  [/we tested \d+\+?/gi, "we compared"],
  [/tested \d+\+? (?:software )?tools/gi, "compared software tools"],
  [/approximately \d+[-–]\d+ tools annually/gi, "the number of tools reviewed varies over time"],
  [/every week we receive emails/gi, "we receive feedback and topic suggestions"],
  [/after working in (?:product management|operations)/gi, "as part of the site's software research work"],
  [/hi, i(?:'|&apos;)m [^,]+, the founder/gi, "PilotStack is maintained by its editorial team"],
  [/enterprise deployments consistently demonstrate/gi, "enterprise deployments can"],
  [/this approach enables teams to maximize their software investment/gi, "this approach helps teams align software choices with business needs"],
  [/organizations see measurable improvements in efficiency and user satisfaction within the first quarter/gi, "organizations can improve efficiency and user satisfaction when the selected tool fits their workflows"],
  [/organizations see measurable improvements in efficiency and team productivity/gi, "organizations can improve efficiency and team productivity when the selected tool fits their workflows"],
  [/our methodology combines hands-on product testing/gi, "our methodology combines source review, feature comparison, and buyer-focused analysis"],
  [/case study ([123]) - (?:aerospace|healthcare|finance)/gi, (_m, n) => `illustrative scenario ${n}`],
  [/response times: sub-second p50/gi, "response times should be verified for the specific workload"],
  [/break-even typically 3-6 months/gi, "payback timing varies by implementation"],
  [/first-year roi of 150-300%/gi, "first-year ROI varies with adoption and costs"],
  [/1000\+ pre-built connectors/gi, "a broad library of integrations"],
  [/week 1: discovery, planning, requirements gathering/gi, "early phase: discovery, planning, and requirements gathering"],
  [/weighted criteria: features 25%, ease of use 20%/gi, "weighted criteria covering features, ease of use, support, value, security, and integrations"],
  [/cloud-native deployment on aws\/gcp\/azure/gi, "cloud deployment options"],
  [/regular product updates/gi, "ongoing product changes"],
  [/strong customer support/gi, "available support options"],
  [/good mobile experience/gi, "mobile access"],
  [/active user community/gi, "community resources"],
]

function apply(content) {
  let out = content
  for (const [pattern, replacement] of replacements) {
    pattern.lastIndex = 0
    out = out.replace(pattern, replacement)
  }
  return out
}

let changed = 0
for (const dir of CONTENT_DIRS) {
  const absDir = path.join(ROOT, dir)
  for (const file of fs.readdirSync(absDir).filter((f) => f.endsWith(".json"))) {
    const abs = path.join(absDir, file)
    const before = fs.readFileSync(abs, "utf8")
    const after = apply(before)
    if (after !== before) {
      fs.writeFileSync(abs, after)
      changed++
    }
  }
}

for (const file of ["_gen-expand.js", "_gen-comparisons.js", "_gen-best-expansion.js"]) {
  const abs = path.join(ROOT, file)
  if (!fs.existsSync(abs)) continue
  const before = fs.readFileSync(abs, "utf8")
  const after = apply(before)
  if (after !== before) {
    fs.writeFileSync(abs, after)
    changed++
  }
}

console.log(`[content-quality-cleanup] changed ${changed} files`)
