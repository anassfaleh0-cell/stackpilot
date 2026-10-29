import { describe, expect, it } from "vitest"
import type { ComparisonContent } from "@/types/content"
import { getRelevantComparisonSlugs } from "./related-comparisons"

function comparison(slug: string, left: string, right: string, category = "Developer Tools"): ComparisonContent {
  return {
    slug, tool1Slug: left, tool2Slug: right, category, relatedComparisons: [],
  } as ComparisonContent
}

describe("getRelevantComparisonSlugs", () => {
  const current = { ...comparison("github-vs-sourceforge", "github", "sourceforge"), relatedComparisons: ["github-vs-gitlab"] }
  const categories: Record<string, string> = {
    github: "Developer Tools", sourceforge: "Developer Tools",
    gitlab: "Developer Tools", bitbucket: "Developer Tools",
    docker: "Developer Tools", kubernetes: "Developer Tools",
    appwrite: "Developer Tools", "1password": "Security & Compliance",
  }
  const categoryFor = (slug: string) => categories[slug]

  it("prioritizes a curated, plausible shared-tool comparison", () => {
    const candidates = [
      comparison("github-vs-bitbucket", "github", "bitbucket"),
      comparison("docker-vs-kubernetes", "docker", "kubernetes"),
      comparison("github-vs-gitlab", "github", "gitlab"),
    ]
    expect(getRelevantComparisonSlugs(current, candidates, categoryFor)).toEqual(["github-vs-gitlab"])
    expect(getRelevantComparisonSlugs(current, candidates, categoryFor, 6, ["github-vs-bitbucket"])).toEqual(["github-vs-gitlab", "github-vs-bitbucket"])
  })

  it("never recommends unrelated, mismatched, reversed or draft pairs", () => {
    const candidates = [
      comparison("github-vs-appwrite", "github", "appwrite"),
      comparison("github-vs-1password", "github", "1password"),
      comparison("sourceforge-vs-github", "sourceforge", "github"),
      { ...comparison("github-vs-bitbucket", "github", "bitbucket"), publicationStatus: "draft" },
    ]
    expect(getRelevantComparisonSlugs(current, candidates as ComparisonContent[], categoryFor)).toEqual([])
  })

  it("respects the visible-related-links limit", () => {
    const candidates = [
      comparison("github-vs-gitlab", "github", "gitlab"),
      comparison("github-vs-bitbucket", "github", "bitbucket"),
    ]
    expect(getRelevantComparisonSlugs(current, candidates, categoryFor, 1)).toEqual(["github-vs-gitlab"])
  })
})
