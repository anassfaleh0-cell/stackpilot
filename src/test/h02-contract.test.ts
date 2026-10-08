import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"
import { createHash } from "node:crypto"
import {
  H02_ACCEPTANCE_TESTS,
  H02_ALT_T3_MODEL,
  H02_CONTRACT,
  H02_CONTRACT_CHANGELOG,
  H02_CONTRACT_PREVIOUS_VERSION,
  H02_CONTRACT_VERSION,
  H02_CROSS_REFERENCE_NOTES,
  H02_DECISION,
  H02_EXCLUDED_CANDIDATE_SETS,
  H02_F2_CASE_COUNT,
  H02_ID,
  H02_INDEX01_RECOVERY,
  H02_INDEX02A_RECOVERY,
  H02_INDEX02A_WAVE2_RECOVERY,
  H02_OBJECT_SET_SLUGS,
  H02_OBJECT_SET_SIZE,
  H02_PROSE_EXCLUSIONS,
  H02_PROSE_FIELDS,
  H02_PROSE_REFERENCE_PATTERNS,
  H02_PROSE_SCOPE_SIZE,
  H02_PROSE_SCOPE_SLUGS,
  H02_SAFETY_CLAUSES,
  H02_SEO_INVARIANT,
  H02_TITLE,
} from "@/lib/content/h02-contract"
import { H01_CONTRACT, H01_CONTRACT_VERSION } from "@/lib/content/h01-contract"
import { PROVENANCE_CLAIM_COUNT, PROVENANCE_CLAIM_PATHS, getSources } from "@/lib/content/provenance"
import { getAllAlternatives } from "@/lib/content/registry"
import { isNoindexed } from "@/lib/noindex"

const ROOT = process.cwd()
const SEMVER = /^\d+\.\d+\.\d+$/

function read(relative: string): string {
  return fs.readFileSync(path.join(ROOT, ...relative.split("/")), "utf8")
}

function readJson<T>(relative: string): T {
  return JSON.parse(read(relative)) as T
}

function jsonFilesUnder(relativeDir: string): string[] {
  const dir = path.join(ROOT, ...relativeDir.split("/"))
  return fs
    .readdirSync(dir)
    .filter(name => name.endsWith(".json"))
    .sort()
    .map(name => path.join(dir, name))
}

interface NoindexList {
  directories: {
    reviews: { keep: string[]; noindex: string[] }
    alternatives: { keep: string[]; noindex: string[] }
  }
}

describe("H-02 contract identity", () => {
  it("exists, identifies itself and carries a parseable semver contract version", () => {
    expect(H02_CONTRACT).toBeDefined()
    expect(H02_CONTRACT.id).toBe(H02_ID)
    expect(H02_CONTRACT.id).toBe("H-02")
    expect(H02_CONTRACT.title).toBe(H02_TITLE)
    expect(H02_CONTRACT_VERSION).toMatch(SEMVER)
    expect(H02_CONTRACT.contractVersion).toBe(H02_CONTRACT_VERSION)
    expect(H02_CONTRACT.phase5ARequirement).toBe(5)
  })

  it("grants approval explicitly rather than by inference", () => {
    expect(H02_CONTRACT.approvalState.status).toBe("GRANTED")
    expect(H02_CONTRACT.approvalState.explicit).toBe(true)
    expect(H02_CONTRACT.approvalState.establishedBy).toBe("H-02 contract v1.0.0")
    expect(H02_CONTRACT.approvalState.outsideApprovedScope).toBe("blocked")
    expect(H02_CONTRACT.objective).toContain("content/alternatives")
  })

  it("records decision B with no publication action", () => {
    expect(H02_DECISION).toBe("B")
    expect(H02_CONTRACT.decision.id).toBe("B")
    expect(H02_CONTRACT.decision.label).toBe("REMOVE_UNPUBLISHED_ALTERNATIVES_REFERENCES")
    expect(H02_CONTRACT.decision.publicationAction).toBe("NONE")
    expect(H02_CONTRACT.decision.proseAction).toBe("REMOVE_REFERENCE")
    expect(H02_CONTRACT.decision.rejectedOption).toBe("A")
    expect(H02_CONTRACT.dependencies.blocksRemediationIds).toEqual(["P5C-AL-03"])
    expect(H02_CONTRACT.dependencies.implementedInPhase).toBe(
      "Phase 5G - H-02 Option B Implementation",
    )
  })
})

describe("H-02 object set", () => {
  it("is exactly the 52 cohort alternative files", () => {
    expect(H02_OBJECT_SET_SIZE).toBe(52)
    expect(H02_CONTRACT.objectSet.size).toBe(H02_OBJECT_SET_SIZE)
    expect(H02_OBJECT_SET_SLUGS).toHaveLength(52)
    expect(new Set(H02_OBJECT_SET_SLUGS).size).toBe(52)
    expect(H02_CONTRACT.objectSet.slugs).toEqual([...H02_OBJECT_SET_SLUGS])
    expect([...H02_OBJECT_SET_SLUGS]).toEqual([...H02_OBJECT_SET_SLUGS].sort())
  })

  it("resolves every member to an existing published:false alternatives file", () => {
    for (const slug of H02_OBJECT_SET_SLUGS) {
      const relative = `content/alternatives/${slug}-alternatives.json`
      expect(fs.existsSync(path.join(ROOT, relative.split("/").join(path.sep)))).toBe(true)
      const data = readJson<{ slug?: string; published?: boolean }>(relative)
      expect(data.slug).toBe(`${slug}-alternatives`)
      expect(data.published).toBe(false)
    }
  })

  it("equals the provenance claim cohort", () => {
    const cohort = jsonFilesUnder("content/provenance/claims")
      .map(file => path.basename(file, ".json"))
      .sort()
    expect(cohort).toEqual([...H02_OBJECT_SET_SLUGS].sort())
    expect(cohort).toHaveLength(H02_OBJECT_SET_SIZE)
  })

  it("excludes the 75-file and 101-file candidate sets with a written reason", () => {
    expect(H02_EXCLUDED_CANDIDATE_SETS).toHaveLength(2)
    expect(H02_CONTRACT.objectSet.excludedCandidates).toHaveLength(2)
    for (const candidate of H02_CONTRACT.objectSet.excludedCandidates) {
      expect(candidate.excluded).toBe(true)
      expect(candidate.exclusionReason.length).toBeGreaterThan(40)
      expect(candidate.size).toBeGreaterThan(H02_OBJECT_SET_SIZE)
    }
    const sizes = H02_CONTRACT.objectSet.excludedCandidates.map(candidate => candidate.size)
    expect(sizes).toContain(75)
    expect(sizes).toContain(101)
  })

  it("contains no non-cohort alternatives file", () => {
    const cohort = new Set(jsonFilesUnder("content/provenance/claims").map(file => path.basename(file, ".json")))
    const alternatives = jsonFilesUnder("content/alternatives").map(file => path.basename(file))
    const nonCohort = alternatives.filter(name => {
      const slug = name.replace(/-alternatives\.json$/, "")
      return name.endsWith("-alternatives.json") && !cohort.has(slug)
    })
    expect(nonCohort.length).toBe(48)
    for (const slug of H02_OBJECT_SET_SLUGS) expect(nonCohort).not.toContain(`${slug}-alternatives.json`)
  })
})

describe("H-02 prose scope", () => {
  it("is a fixed list of exactly 23 pages", () => {
    expect(H02_PROSE_SCOPE_SIZE).toBe(23)
    expect(H02_CONTRACT.proseScope.size).toBe(H02_PROSE_SCOPE_SIZE)
    expect(H02_PROSE_SCOPE_SLUGS).toHaveLength(23)
    expect(new Set(H02_PROSE_SCOPE_SLUGS).size).toBe(23)
    expect(H02_CONTRACT.proseScope.slugs).toEqual([...H02_PROSE_SCOPE_SLUGS])
    expect([...H02_PROSE_SCOPE_SLUGS]).toEqual([...H02_PROSE_SCOPE_SLUGS].sort())
  })

  it("resolves every prose slug to a real declared review inside the object set", () => {
    const objectSet = new Set(H02_OBJECT_SET_SLUGS)
    for (const slug of H02_PROSE_SCOPE_SLUGS) {
      expect(fs.existsSync(path.join(ROOT, "content", "reviews", `${slug}.json`))).toBe(true)
      expect(objectSet.has(slug)).toBe(true)
      expect(isNoindexed("reviews", slug)).toBe(false)
    }
  })

  it("names every rendered prose field, section titles included, and states the reachability rule", () => {
    expect(H02_PROSE_FIELDS).toEqual([
      "content[].title",
      "content[].body",
      "faqs[].question",
      "faqs[].answer",
      "pros[]",
      "cons[]",
    ])
    expect(H02_CONTRACT.proseScope.fields).toEqual([...H02_PROSE_FIELDS])
    expect(H02_CONTRACT.proseScope.fieldRationale).toContain("render as body prose")
    expect(H02_CONTRACT.proseScope.fieldRationale).toContain("content[].title")
    expect(H02_CONTRACT.proseScope.fieldRationale).toContain("<h2>")
    expect(H02_PROSE_REFERENCE_PATTERNS.length).toBeGreaterThan(4)
    expect(H02_CONTRACT.proseScope.referencePredicate).toContain("published === false")
    expect(H02_CONTRACT.proseScope.referenceSource).toContain("Phase 5B")
  })

  it("records v1.4.0 as the INDEX-02A wave 2 recovery, v1.3.0 as the wave 1 recovery, v1.2.0 as the INDEX-01 recovery and v1.1.0 as the explicit reopen that added content[].title", () => {
    expect(H02_CONTRACT_VERSION).toBe("1.4.0")
    expect(H02_CONTRACT_PREVIOUS_VERSION).toBe("1.3.0")
    expect(H02_CONTRACT.contractVersion).toBe("1.4.0")
    expect(H02_CONTRACT_CHANGELOG.map(entry => entry.version)).toEqual([
      "1.4.0",
      "1.3.0",
      "1.2.0",
      "1.1.0",
      "1.0.0",
    ])
    expect(H02_CONTRACT.changelog).toHaveLength(5)
    expect(H02_CONTRACT.changelog[0].version).toBe(H02_CONTRACT_VERSION)
    expect(H02_CONTRACT.changelog[0].summary).toContain("INDEX-02A")
    expect(H02_CONTRACT.changelog[0].summary).toContain("T-H02-13")
    expect(H02_CONTRACT.changelog[0].summary).toContain("85")
    expect(H02_CONTRACT.changelog[1].version).toBe("1.3.0")
    expect(H02_CONTRACT.changelog[1].summary).toContain("INDEX-02A")
    expect(H02_CONTRACT.changelog[1].summary).toContain("T-H02-12")
    expect(H02_CONTRACT.changelog[1].summary).toContain("31")
    expect(H02_CONTRACT.changelog[2].version).toBe("1.2.0")
    expect(H02_CONTRACT.changelog[2].summary).toContain("INDEX-01")
    expect(H02_CONTRACT.changelog[2].summary).toContain("T-H02-11")
    expect(H02_CONTRACT.changelog[2].reason).toContain("52 published")
    expect(H02_CONTRACT.changelog[3].summary).toContain("content[].title")
    expect(H02_CONTRACT.changelog[3].summary).toContain("T-H02-05")
    expect(H02_CONTRACT.changelog[3].reason).toContain("five-field")
    expect(H02_CONTRACT.changelog[3].reason).toContain("unchanged")
    for (const entry of H02_CONTRACT_CHANGELOG) {
      expect(entry.version).toMatch(SEMVER)
      expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(entry.summary.length).toBeGreaterThan(40)
      expect(entry.reason.length).toBeGreaterThan(40)
    }
    expect(H02_CONTRACT.acceptanceCriteria.some(item => item.includes("content[].title"))).toBe(true)
  })

  it("reconciles the 23 in-scope pages with the 6 documented exclusions to the 29 F2 cases", () => {
    expect(H02_F2_CASE_COUNT).toBe(29)
    expect(H02_PROSE_EXCLUSIONS).toHaveLength(6)
    expect(H02_CONTRACT.proseScope.exclusions).toHaveLength(6)
    expect(H02_CONTRACT.proseScope.f2CaseCount).toBe(29)
    expect(H02_PROSE_SCOPE_SIZE + H02_PROSE_EXCLUSIONS.length).toBe(H02_F2_CASE_COUNT)

    const exclusions = new Set<string>()
    for (const exclusion of H02_CONTRACT.proseScope.exclusions) {
      expect(exclusion.slug.length).toBeGreaterThan(0)
      expect(exclusion.classification.length).toBeGreaterThan(0)
      expect(exclusion.reason.length).toBeGreaterThan(40)
      expect(exclusions.has(exclusion.slug)).toBe(false)
      exclusions.add(exclusion.slug)
      expect([...H02_PROSE_SCOPE_SLUGS]).not.toContain(exclusion.slug)
    }
    expect([...exclusions].sort()).toEqual([
      "fathom",
      "midjourney",
      "new-relic",
      "postman",
      "terraform",
      "writesonic",
    ])
  })

  it("keeps every excluded slug inside the object set so no file is silently dropped", () => {
    const objectSet = new Set<string>(H02_OBJECT_SET_SLUGS)
    for (const exclusion of H02_CONTRACT.proseScope.exclusions) {
      expect(objectSet.has(exclusion.slug)).toBe(true)
    }
  })

  it("documents every cross-reference that reaches outside the object set", () => {
    const notes = H02_CROSS_REFERENCE_NOTES
    expect(notes).toHaveLength(3)
    expect(H02_CONTRACT.proseScope.crossReferenceNotes).toHaveLength(3)
    expect(notes.map(note => note.page).sort()).toEqual(["expensify", "invision", "ringcentral"])

    const objectSet = new Set<string>(H02_OBJECT_SET_SLUGS)
    for (const note of notes) {
      expect([...H02_PROSE_SCOPE_SLUGS]).toContain(note.page)
      expect(objectSet.has(note.page)).toBe(true)
      expect(note.handling.length).toBeGreaterThan(40)
      for (const target of [...note.outOfSetTargets, ...note.alreadyReachableTargets, ...note.absentTargets]) {
        expect(objectSet.has(target.replace(/-alternatives\.json$/, ""))).toBe(false)
      }
      expect(note.outOfSetTargets.length + note.alreadyReachableTargets.length + note.absentTargets.length).toBeGreaterThan(0)
    }

    const invision = notes.find(note => note.page === "invision")
    expect(invision?.outOfSetTargets).toEqual(["framer-alternatives", "webflow-alternatives"])
    const ringcentral = notes.find(note => note.page === "ringcentral")
    expect(ringcentral?.absentTargets).toEqual(["messaging-alternatives"])
    for (const target of ["freshbooks-alternatives", "quickbooks-alternatives", "stripe-alternatives", "xero-alternatives"]) {
      expect(notes.find(note => note.page === "expensify")?.alreadyReachableTargets).toContain(target)
      expect(readJson<{ published?: boolean }>(`content/alternatives/${target}.json`).published).toBeUndefined()
    }
  })
})

describe("H-02 decision B consequences", () => {
  it("publishes nothing and adds no alternatives URL", () => {
    expect(H02_SEO_INVARIANT.newAlternativesUrls).toBe(0)
    expect(H02_SEO_INVARIANT.sitemapExpansion).toBe(0)
    expect(H02_CONTRACT.seoSafety.indexabilityMayChange).toBe(false)
    expect(H02_CONTRACT.seoSafety.urlSetMayChange).toBe(false)

    const catalogue = new Set(getAllAlternatives().map(alternative => alternative.slug))
    expect(catalogue.size).toBeGreaterThanOrEqual(H02_SEO_INVARIANT.alternativesRenderable)
    for (const slug of H02_OBJECT_SET_SLUGS) {
      expect(catalogue.has(`${slug}-alternatives`)).toBe(true)
    }
  })

  it("records the historical sitemap/noindex invariant while allowing the live quality manifest to evolve", () => {
    expect(H02_SEO_INVARIANT.sitemapReviews).toBe(143)
    expect(H02_SEO_INVARIANT.reviewsNoindex).toBe(8)
    expect(H02_SEO_INVARIANT.sitemapAlternatives).toBe(605)
    expect(H02_SEO_INVARIANT.sitemapTotal).toBe(661)
    const current = readJson<NoindexList>("noindex-list.json")
    expect(current.directories.reviews.noindex).toEqual([])
    expect(current.directories.alternatives.noindex).toEqual([])
    expect(current.directories.reviews.keep).toHaveLength(151)
  })

  it("does not populate the review alternatives array", () => {
    expect(H02_CONTRACT.dataSurface.populatedByH02).toBe(false)
    expect(H02_CONTRACT.dataSurface.cohortEntries).toBe(0)
    expect(H02_CONTRACT.dataSurface.rendererDependencyCreated).toBe(false)
    for (const slug of H02_OBJECT_SET_SLUGS) {
      const review = readJson<{ alternatives?: unknown[] }>(`content/reviews/${slug}.json`)
      expect(Array.isArray(review.alternatives)).toBe(true)
      expect((review.alternatives ?? []).length).toBe(0)
    }
  })
})

describe("H-02 Phase INDEX-01 recovery record", () => {
  it("records exactly 52 approved slugs across four families", () => {
    const slugs = H02_INDEX01_RECOVERY.slugs
    expect(H02_INDEX01_RECOVERY.phase).toBe("INDEX-01")
    expect(H02_INDEX01_RECOVERY.action).toBe("MOVE_NOINDEX_TO_KEEP_ONLY")
    expect(H02_INDEX01_RECOVERY.approvedCount).toBe(52)
    expect(H02_INDEX01_RECOVERY.baselineCommit).toBe("3908cca962f1ebbe9ad6a88e4ededbb08cf58c79")
    expect(Object.keys(slugs).sort()).toEqual(["best", "guides", "reviews", "statistics"])
    expect(slugs.reviews).toHaveLength(39)
    expect(slugs.best).toHaveLength(5)
    expect(slugs.guides).toHaveLength(4)
    expect(slugs.statistics).toHaveLength(4)
    const all = [...slugs.reviews, ...slugs.best, ...slugs.guides, ...slugs.statistics]
    expect(all).toHaveLength(52)
    expect(new Set(all).size).toBe(52)
    for (const list of Object.values(slugs)) expect([...list]).toEqual([...list].sort())
    expect(H02_INDEX01_RECOVERY.protectedNoindex).toEqual([
      "/search",
      "/dashboard",
      "/authors/pilotstack-team",
    ])
    expect(H02_INDEX01_RECOVERY.classification).toEqual({ thin: 135, duplicate: 97, noEvidence: 171 })
    expect(H02_CONTRACT.index01Recovery).toEqual(H02_INDEX01_RECOVERY)
  })

  it("validates INDEX-01 recovery arithmetic independently of the live manifest", () => {
    const recovery = H02_INDEX01_RECOVERY
    for (const family of Object.keys(recovery.slugs)) {
      expect(recovery.after.keep[family]).toBe(recovery.baseline.keep[family] + recovery.slugs[family].length)
      expect(recovery.after.noindex[family]).toBe(recovery.baseline.noindex[family] - recovery.slugs[family].length)
    }
  })

  it("pins historical noindex-list hashes recorded by each recovery artifact", () => {
    for (const hash of [
      H02_INDEX01_RECOVERY.baseline.noindexListSha256,
      H02_INDEX01_RECOVERY.after.noindexListSha256,
      H02_INDEX02A_RECOVERY.baseline.noindexListSha256,
      H02_INDEX02A_RECOVERY.after.noindexListSha256,
      H02_INDEX02A_WAVE2_RECOVERY.baseline.noindexListSha256,
      H02_INDEX02A_WAVE2_RECOVERY.after.noindexListSha256,
    ]) expect(hash).toMatch(/^[0-9a-f]{64}$/)
    expect(H02_INDEX02A_WAVE2_RECOVERY.baseline.noindexListSha256).toBe(H02_INDEX02A_RECOVERY.after.noindexListSha256)
  })
})

describe("H-02 Phase INDEX-02A wave 1 recovery record", () => {
  it("records exactly 31 approved slugs across two families", () => {
    const slugs = H02_INDEX02A_RECOVERY.slugs
    expect(H02_INDEX02A_RECOVERY.phase).toBe("INDEX-02A")
    expect(H02_INDEX02A_RECOVERY.wave).toBe("WAVE_1")
    expect(H02_INDEX02A_RECOVERY.action).toBe("MOVE_NOINDEX_TO_KEEP_ONLY")
    expect(H02_INDEX02A_RECOVERY.approvedCount).toBe(31)
    expect(H02_INDEX02A_RECOVERY.baselineCommit).toBe("3ee40abe275506dc46c3969e4bbdc9be1fc3366c")
    expect(Object.keys(slugs).sort()).toEqual(["alternatives", "comparisons"])
    expect(slugs.comparisons).toHaveLength(29)
    expect(slugs.alternatives).toHaveLength(2)
    const all = [...slugs.comparisons, ...slugs.alternatives]
    expect(all).toHaveLength(31)
    expect(new Set(all).size).toBe(31)
    for (const list of Object.values(slugs)) expect([...list]).toEqual([...list].sort())
    expect(H02_INDEX02A_RECOVERY.protectedNoindex).toEqual([
      "/search",
      "/dashboard",
      "/authors/pilotstack-team",
    ])
    expect(H02_CONTRACT.index02aRecovery).toEqual(H02_INDEX02A_RECOVERY)
  })

  it("validates wave-1 recovery arithmetic independently of the live manifest", () => {
    const recovery = H02_INDEX02A_RECOVERY
    for (const family of Object.keys(recovery.slugs)) {
      expect(recovery.after.keep[family]).toBe(recovery.baseline.keep[family] + recovery.slugs[family].length)
      expect(recovery.after.noindex[family]).toBe(recovery.baseline.noindex[family] - recovery.slugs[family].length)
    }
  })
})

describe("H-02 Phase INDEX-02A wave 2 recovery record", () => {
  it("records exactly 85 approved slugs across six families", () => {
    const slugs = H02_INDEX02A_WAVE2_RECOVERY.slugs
    expect(H02_INDEX02A_WAVE2_RECOVERY.phase).toBe("INDEX-02A")
    expect(H02_INDEX02A_WAVE2_RECOVERY.wave).toBe("WAVE_2")
    expect(H02_INDEX02A_WAVE2_RECOVERY.action).toBe("MOVE_NOINDEX_TO_KEEP_ONLY")
    expect(H02_INDEX02A_WAVE2_RECOVERY.approvedCount).toBe(85)
    expect(H02_INDEX02A_WAVE2_RECOVERY.baselineCommit).toBe("eed9d3951a361bd5f6344e670d59e7748827eced")
    expect(H02_INDEX02A_WAVE2_RECOVERY.baselineWave).toBe("WAVE_1")
    expect(Object.keys(slugs).sort()).toEqual([
      "alternatives",
      "best",
      "comparisons",
      "guides",
      "reviews",
      "statistics",
    ])
    expect(slugs.comparisons).toHaveLength(21)
    expect(slugs.guides).toHaveLength(36)
    expect(slugs.alternatives).toHaveLength(13)
    expect(slugs.best).toHaveLength(9)
    expect(slugs.reviews).toHaveLength(5)
    expect(slugs.statistics).toHaveLength(1)
    const all = [...Object.values(slugs).flat()]
    expect(all).toHaveLength(85)
    expect(new Set(all).size).toBe(85)
    for (const list of Object.values(slugs)) expect([...list]).toEqual([...list].sort())
    expect(H02_INDEX02A_WAVE2_RECOVERY.excludedProtected).toEqual([
      "reviews/affinity",
      "best/best-marketing-software",
      "alternatives/gusto-alternatives",
    ])
    expect(H02_INDEX02A_WAVE2_RECOVERY.protectedNoindex).toEqual([
      "/search",
      "/dashboard",
      "/authors/pilotstack-team",
    ])
    expect(H02_INDEX02A_WAVE2_RECOVERY.unaffectedDirectories).toEqual({
      blog: { keep: 97, noindex: 0 },
      glossary: { keep: 30, noindex: 92 },
    })
    expect(H02_INDEX02A_WAVE2_RECOVERY.selectionBasis).toContain("P1")
    expect(H02_INDEX02A_WAVE2_RECOVERY.baseline.noindexListSha256).toBe(
      H02_INDEX02A_RECOVERY.after.noindexListSha256,
    )
    expect(H02_CONTRACT.index02aWave2Recovery).toEqual(H02_INDEX02A_WAVE2_RECOVERY)
  })

  it("validates the wave-2 recovery record independently of the live manifest", () => {
    const recovery = H02_INDEX02A_WAVE2_RECOVERY
    for (const family of Object.keys(recovery.slugs)) {
      expect(recovery.after.keep[family]).toBe(recovery.baseline.keep[family] + recovery.slugs[family].length)
      expect(recovery.after.noindex[family]).toBe(recovery.baseline.noindex[family] - recovery.slugs[family].length)
    }
    expect(recovery.after.noindexListSha256).toMatch(/^[0-9a-f]{64}$/)
  })

  it("uses MODEL 1 with no provenance, renderer or suppression requirement", () => {
    expect(H02_ALT_T3_MODEL).toBe("MODEL_1")
    expect(H02_CONTRACT.alt03Model.model).toBe("MODEL_1")
    expect(H02_CONTRACT.alt03Model.requiresVerifiedStatus).toBe(false)
    expect(H02_CONTRACT.alt03Model.requiresAlternativesProvenancePath).toBe(false)
    expect(H02_CONTRACT.alt03Model.requiresRendererGate).toBe(false)
    expect(H02_CONTRACT.alt03Model.requiresContentSuppression).toBe(false)
    expect(H02_CONTRACT.alt03Model.gatedOn).toContain("H02_CONTRACT.approval.status")
  })

  it("keeps the provenance register untouched and free of an alternatives path", () => {
    expect(PROVENANCE_CLAIM_PATHS).toHaveLength(13)
    expect(PROVENANCE_CLAIM_PATHS).not.toContain("alternatives")
    expect(PROVENANCE_CLAIM_COUNT).toBe(676)
    expect(getSources()).toHaveLength(283)

    expect(H02_CONTRACT.provenancePosture.touched).toBe(false)
    expect(H02_CONTRACT.provenancePosture.claimPathCount).toBe(13)
    expect(H02_CONTRACT.provenancePosture.alternativesClaimPathExists).toBe(false)
    expect(H02_CONTRACT.provenancePosture.recordCount).toBe(676)
    expect(H02_CONTRACT.provenancePosture.verifiedCount).toBe(0)
    expect(H02_CONTRACT.provenancePosture.rendererGate).toBe(false)
    expect(H02_CONTRACT.provenancePosture.contentSuppression).toBe(false)
  })
})

describe("H-02 and H-01", () => {
  it("does not modify, bypass or amend H-01", () => {
    expect(H02_CONTRACT.h01Posture.modified).toBe(false)
    expect(H02_CONTRACT.h01Posture.bypassed).toBe(false)
    expect(H02_CONTRACT.h01Posture.amended).toBe(false)
    expect(H02_CONTRACT.h01Posture.contractVersion).toBe(H01_CONTRACT_VERSION)

    expect(H01_CONTRACT.contractVersion).toBe("1.0.0")
    expect(H01_CONTRACT.approvalState.status).toBe("GRANTED")
    expect(H01_CONTRACT.approvalScope.count).toBe(17)
    expect(H01_CONTRACT.approvalScope.excludedRemediationIds).toHaveLength(13)
    expect(H01_CONTRACT.approvalScope.excludedRemediationIds).toContain("P5C-AL-03")
    expect(H01_CONTRACT.approvalEffect.doesNotGrant).toContain(
      "publication of content/alternatives/*.json",
    )
    expect(read("src/lib/content/h01-contract.ts")).toContain(H01_CONTRACT_VERSION)
  })

  it("grants only P5C-AL-03 and lists everything it does not grant", () => {
    expect(H02_CONTRACT.approvalEffect.approvedCount).toBe(1)
    expect(H02_CONTRACT.approvalEffect.releases).toContain("P5C-AL-03")
    for (const item of [
      "publication of content/alternatives/*.json",
      "renderer gate",
      "content suppression",
      "provenance-backed VERIFIED alternatives claims",
      "an alternatives provenance claim path",
      "new /alternatives/* URLs",
      "sitemap expansion",
      "indexability or noindex changes",
      "canonical, robots or next.config changes",
      "population of content/reviews/*.json.alternatives",
      "amendment of H-01",
    ]) {
      expect(H02_CONTRACT.approvalEffect.doesNotGrant).toContain(item)
    }
    expect(H02_CONTRACT.approvalEffect.doesNotGrant).toHaveLength(12)
  })
})

describe("H-02 safety clauses and acceptance tests", () => {
  it("carries ten uniquely identified safety clauses", () => {
    expect(H02_SAFETY_CLAUSES).toHaveLength(10)
    const ids = H02_SAFETY_CLAUSES.map(clause => clause.id)
    expect(new Set(ids).size).toBe(10)
    expect(ids).toEqual([...ids].sort())
    for (const clause of H02_SAFETY_CLAUSES) expect(clause.clause.length).toBeGreaterThan(40)
    expect(H02_CONTRACT.safetyClauses).toHaveLength(10)
  })

  it("defines T-H02-01 through T-H02-13", () => {
    expect(H02_ACCEPTANCE_TESTS).toHaveLength(13)
    expect(H02_ACCEPTANCE_TESTS.map(test => test.id)).toEqual([
      "T-H02-01",
      "T-H02-02",
      "T-H02-03",
      "T-H02-04",
      "T-H02-05",
      "T-H02-06",
      "T-H02-07",
      "T-H02-08",
      "T-H02-09",
      "T-H02-10",
      "T-H02-11",
      "T-H02-12",
      "T-H02-13",
    ])
    for (const test of H02_ACCEPTANCE_TESTS) {
      expect(test.name.length).toBeGreaterThan(3)
      expect(test.asserts.length).toBeGreaterThan(30)
      expect(test.catches.length).toBeGreaterThan(3)
    }
    expect(H02_CONTRACT.acceptanceTests).toHaveLength(13)
  })

  it("lists acceptance criteria covering every resolved blocker", () => {
    const criteria = H02_CONTRACT.acceptanceCriteria
    expect(criteria.length).toBeGreaterThanOrEqual(10)
    expect(criteria.some(item => item.includes("52 cohort slugs"))).toBe(true)
    expect(criteria.some(item => item.includes("23 fixed slugs"))).toBe(true)
    expect(criteria.some(item => item.includes("29 Phase 5B F2 cases"))).toBe(true)
    expect(criteria.some(item => item.includes("MODEL 1"))).toBe(true)
    expect(criteria.some(item => item.includes("H-01 is neither modified"))).toBe(true)
    expect(criteria.some(item => item.includes("publishes nothing"))).toBe(true)
  })

  it("refuses to become the source of content, SEO or provenance data", () => {
    const source = read("src/lib/content/h02-contract.ts")
    expect(source).not.toContain("published: true")
    expect(source).not.toContain("published:true")
    expect(source).toContain('publicationAction: "NONE"')
    expect(source).toContain("indexabilityMayChange: false")
    expect(source).toContain("sitemapMayChange: false")
    expect(source).toContain("rendererGate: false")
    expect(source).toContain("amended: false")
    expect(source).toContain("published:false")
  })
})
