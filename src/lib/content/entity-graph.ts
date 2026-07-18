import { getAllReviews, getAllComparisons, getAllGuides, getAllBlogPosts, getAllGlossaryTerms, getAllAlternatives, getAllUseCases, getAllIndustries, getAllResearch, getAllStatistics, getAllBest, getAllHubs } from "./registry"
import type { EntityRelationship } from "@/types/content"

export interface EntityNode {
  slug: string
  name: string
  type: "software" | "comparison" | "guide" | "blog" | "glossary" | "category" | "alternative" | "use-case" | "industry" | "research" | "statistic" | "best" | "hub"
  category: string
  relationships: EntityRelationship[]
}

export interface EntityGraph {
  nodes: Map<string, EntityNode>
  getNode(slug: string, type: string): EntityNode | undefined
  getRelated(slug: string, type: string, relation?: string): EntityNode[]
  getEntityRelations(slug: string, type: string): EntityRelationship[]
  getCategoryGraph(category: string): EntityNode[]
  getBuyerJourneyPath(category: string): { stage: string; content: EntityNode[] }[]
}

function buildGraph(): EntityGraph {
  const nodes = new Map<string, EntityNode>()

  function key(slug: string, type: string) {
    return `${type}::${slug}`
  }

  function add(slug: string, name: string, type: EntityNode["type"], category: string, rels: EntityRelationship[] = []) {
    const k = key(slug, type)
    if (!nodes.has(k)) {
      nodes.set(k, { slug, name, type, category, relationships: [] })
    }
    const node = nodes.get(k)!
    for (const r of rels) {
      if (!node.relationships.some((x) => x.targetSlug === r.targetSlug && x.targetType === r.targetType)) {
        node.relationships.push(r)
      }
    }
  }

  const reviews = getAllReviews()
  const comparisons = getAllComparisons()
  const guides = getAllGuides()
  const posts = getAllBlogPosts()
  const glossary = getAllGlossaryTerms()
  const alternatives = getAllAlternatives()
  const useCases = getAllUseCases()
  const industries = getAllIndustries()
  const research = getAllResearch()
  const statistics = getAllStatistics()
  const best = getAllBest()
  const hubs = getAllHubs()

  for (const r of reviews) {
    const rels: EntityRelationship[] = []
    if (r.relatedComparisons) {
      for (const c of r.relatedComparisons) rels.push({ targetSlug: c, targetType: "comparison", relation: "has-comparison" })
    }
    if (r.relatedGuides) {
      for (const g of r.relatedGuides) rels.push({ targetSlug: g, targetType: "guide", relation: "has-guide" })
    }
    if (r.relatedPosts) {
      for (const p of r.relatedPosts) rels.push({ targetSlug: p, targetType: "blog", relation: "has-blog" })
    }
    if (r.alternatives) {
      for (const a of r.alternatives) rels.push({ targetSlug: a, targetType: "software", relation: "alternative-to" })
    }
    add(r.slug, r.name, "software", r.category, rels)
  }

  for (const c of comparisons) {
    const rels: EntityRelationship[] = [
      { targetSlug: c.tool1Slug, targetType: "software", relation: "compares" },
      { targetSlug: c.tool2Slug, targetType: "software", relation: "compares" },
    ]
    if (c.relatedComparisons) {
      for (const rc of c.relatedComparisons) rels.push({ targetSlug: rc, targetType: "comparison", relation: "related-comparison" })
    }
    if (c.relatedGuides) {
      for (const g of c.relatedGuides) rels.push({ targetSlug: g, targetType: "guide", relation: "has-guide" })
    }
    if (c.relatedPosts) {
      for (const p of c.relatedPosts) rels.push({ targetSlug: p, targetType: "blog", relation: "has-blog" })
    }
    add(c.slug, c.title, "comparison", c.category, rels)
  }

  for (const g of guides) {
    const rels: EntityRelationship[] = []
    if (g.relatedTools) {
      for (const t of g.relatedTools) rels.push({ targetSlug: t, targetType: "software", relation: "references" })
    }
    if (g.relatedComparisons) {
      for (const c of g.relatedComparisons) rels.push({ targetSlug: c, targetType: "comparison", relation: "has-comparison" })
    }
    if (g.relatedPosts) {
      for (const p of g.relatedPosts) rels.push({ targetSlug: p, targetType: "blog", relation: "has-blog" })
    }
    add(g.slug, g.title, "guide", g.category, rels)
  }

  for (const p of posts) {
    const rels: EntityRelationship[] = []
    if (p.relatedComparisons) {
      for (const c of p.relatedComparisons) rels.push({ targetSlug: c, targetType: "comparison", relation: "has-comparison" })
    }
    if (p.relatedGuides) {
      for (const g of p.relatedGuides) rels.push({ targetSlug: g, targetType: "guide", relation: "has-guide" })
    }
    if (p.relatedGlossary) {
      for (const gl of p.relatedGlossary) rels.push({ targetSlug: gl, targetType: "glossary", relation: "defines" })
    }
    add(p.slug, p.title, "blog", p.category, rels)
  }

  for (const g of glossary) {
    add(g.slug, g.term, "glossary", g.category)
  }

  for (const a of alternatives) {
    const rels: EntityRelationship[] = [
      { targetSlug: a.toolSlug, targetType: "software", relation: "provides-alternatives" },
      ...a.alternatives.map((alt) => ({ targetSlug: alt.slug, targetType: "software" as const, relation: "alternative" as const })),
    ]
    if (a.relatedComparisons) {
      for (const c of a.relatedComparisons) rels.push({ targetSlug: c, targetType: "comparison", relation: "has-comparison" })
    }
    if (a.relatedGuides) {
      for (const g of a.relatedGuides) rels.push({ targetSlug: g, targetType: "guide", relation: "has-guide" })
    }
    if (a.relatedPosts) {
      for (const p of a.relatedPosts) rels.push({ targetSlug: p, targetType: "blog", relation: "has-blog" })
    }
    add(a.slug, a.title, "alternative", a.category, rels)
  }

  for (const u of useCases) {
    const rels: EntityRelationship[] = u.recommendations.map((rec) => ({ targetSlug: rec.toolSlug, targetType: "software", relation: "recommends" }))
    if (u.relatedComparisons) {
      for (const c of u.relatedComparisons) rels.push({ targetSlug: c, targetType: "comparison", relation: "has-comparison" })
    }
    if (u.relatedGuides) {
      for (const g of u.relatedGuides) rels.push({ targetSlug: g, targetType: "guide", relation: "has-guide" })
    }
    add(u.slug, u.title, "use-case", u.category, rels)
  }

  for (const ind of industries) {
    const rels: EntityRelationship[] = ind.recommendations.map((rec) => ({ targetSlug: rec.toolSlug, targetType: "software", relation: "recommends" }))
    if (ind.relatedComparisons) {
      for (const c of ind.relatedComparisons) rels.push({ targetSlug: c, targetType: "comparison", relation: "has-comparison" })
    }
    if (ind.relatedGuides) {
      for (const g of ind.relatedGuides) rels.push({ targetSlug: g, targetType: "guide", relation: "has-guide" })
    }
    add(ind.slug, ind.title, "industry", ind.industry, rels)
  }

  for (const r of research) {
    const rels: EntityRelationship[] = []
    if (r.relatedComparisons) {
      for (const c of r.relatedComparisons) rels.push({ targetSlug: c, targetType: "comparison", relation: "has-comparison" })
    }
    if (r.relatedGuides) {
      for (const g of r.relatedGuides) rels.push({ targetSlug: g, targetType: "guide", relation: "has-guide" })
    }
    if (r.relatedPosts) {
      for (const p of r.relatedPosts) rels.push({ targetSlug: p, targetType: "blog", relation: "has-blog" })
    }
    add(r.slug, r.title, "research", r.category, rels)
  }

  for (const s of statistics) {
    const rels: EntityRelationship[] = []
    if (s.relatedComparisons) {
      for (const c of s.relatedComparisons) rels.push({ targetSlug: c, targetType: "comparison", relation: "has-comparison" })
    }
    if (s.relatedGuides) {
      for (const g of s.relatedGuides) rels.push({ targetSlug: g, targetType: "guide", relation: "has-guide" })
    }
    add(s.slug, s.title, "statistic", s.category, rels)
  }

  for (const b of best) {
    const rels: EntityRelationship[] = [
      ...b.picks.map((p) => ({ targetSlug: p.toolSlug, targetType: "software" as const, relation: "recommends" as const })),
    ]
    if (b.relatedComparisons) {
      for (const c of b.relatedComparisons) rels.push({ targetSlug: c, targetType: "comparison", relation: "has-comparison" })
    }
    if (b.relatedGuides) {
      for (const g of b.relatedGuides) rels.push({ targetSlug: g, targetType: "guide", relation: "has-guide" })
    }
    if (b.relatedPosts) {
      for (const p of b.relatedPosts) rels.push({ targetSlug: p, targetType: "blog", relation: "has-blog" })
    }
    add(b.slug, b.title, "best", b.category, rels)
  }

  for (const h of hubs) {
    const rels: EntityRelationship[] = [
      ...h.recommendations.map((r) => ({ targetSlug: r.toolSlug, targetType: "software" as const, relation: "recommends" as const })),
    ]
    if (h.relatedComparisons) {
      for (const c of h.relatedComparisons) rels.push({ targetSlug: c, targetType: "comparison", relation: "has-comparison" })
    }
    if (h.relatedGuides) {
      for (const g of h.relatedGuides) rels.push({ targetSlug: g, targetType: "guide", relation: "has-guide" })
    }
    if (h.relatedPosts) {
      for (const p of h.relatedPosts) rels.push({ targetSlug: p, targetType: "blog", relation: "has-blog" })
    }
    add(h.slug, h.title, "hub", h.audience, rels)
  }

  return {
    nodes,
    getNode(slug: string, type: string) {
      return nodes.get(key(slug, type))
    },
    getRelated(slug: string, type: string, relation?: string) {
      const node = nodes.get(key(slug, type))
      if (!node) return []
      const results: EntityNode[] = []
      for (const r of node.relationships) {
        if (relation && r.relation !== relation) continue
        const target = nodes.get(key(r.targetSlug, r.targetType))
        if (target) results.push(target)
      }
      return results
    },
    getEntityRelations(slug: string, type: string) {
      return nodes.get(key(slug, type))?.relationships ?? []
    },
    getCategoryGraph(category: string) {
      const result: EntityNode[] = []
      for (const [, node] of nodes) {
        if (node.category === category) result.push(node)
      }
      return result.sort((a, b) => a.type.localeCompare(b.type))
    },
    getBuyerJourneyPath(category: string) {
      const catNodes = this.getCategoryGraph(category)
      const stages: { stage: string; content: EntityNode[] }[] = [
        { stage: "awareness", content: catNodes.filter((n) => n.type === "blog" || n.type === "glossary" || n.type === "research" || n.type === "statistic" || n.type === "hub") },
        { stage: "consideration", content: catNodes.filter((n) => n.type === "guide" || n.type === "use-case" || n.type === "industry" || n.type === "best") },
        { stage: "evaluation", content: catNodes.filter((n) => n.type === "comparison" || n.type === "alternative") },
        { stage: "decision", content: catNodes.filter((n) => n.type === "software") },
      ]
      return stages.filter((s) => s.content.length > 0)
    },
  }
}

export const entityGraph = buildGraph()
