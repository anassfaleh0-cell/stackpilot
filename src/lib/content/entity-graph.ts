import { getAllReviews, getAllComparisons, getAllGuides, getAllBlogPosts, getAllGlossaryTerms, getAllAlternatives, getAllUseCases, getAllIndustries, getAllResearch, getAllStatistics, getAllBest, getAllHubs } from "./registry"
import { categories } from "@/lib/constants"
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

  // Add category nodes and connect them to content in their category
  for (const cat of categories) {
    add(cat.slug, cat.name, "category", cat.slug)
    for (const [, node] of nodes) {
      if (node.type === "category") continue
      if (node.category === cat.slug || node.category === cat.name) {
        const catNode = nodes.get(key(cat.slug, "category"))
        if (catNode && !catNode.relationships.some((r) => r.targetSlug === node.slug && r.targetType === node.type)) {
          catNode.relationships.push({ targetSlug: node.slug, targetType: node.type, relation: "contains" })
        }
        add(node.slug, node.name, node.type, node.category, [{ targetSlug: cat.slug, targetType: "category", relation: "in-category" }])
      }
    }
  }

  // Connect glossary terms to content that references them via body text scanning
  const slugMap = new Map<string, string>() // lowercased key -> slug
  for (const g of glossary) {
    slugMap.set(g.slug.toLowerCase(), g.slug)
    if (g.term) slugMap.set(g.term.toLowerCase(), g.slug)
  }

  // Build a single alternation regex for all glossary terms
  const escapedKeys = [...slugMap.keys()]
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length) // longest first to prefer multi-word matches
  const glossaryRegex = new RegExp(`\\b(${escapedKeys.join("|")})\\b`, "gi")

  function scanText(text: string): string[] {
    const found = new Set<string>()
    const matches = text.matchAll(glossaryRegex)
    for (const m of matches) {
      const slug = slugMap.get(m[1].toLowerCase())
      if (slug) found.add(slug)
    }
    return [...found]
  }

  function connectGlossary(targetSlug: string, targetType: EntityNode["type"], bodyText: string) {
    const termSlugs = scanText(bodyText)
    for (const ts of termSlugs) {
      const glKey = key(ts, "glossary")
      if (nodes.has(glKey)) {
        add(targetSlug, "", targetType, "", [{ targetSlug: ts, targetType: "glossary", relation: "references" }])
        add(ts, "", "glossary", "", [{ targetSlug, targetType, relation: "referenced-by" }])
      }
    }
  }

  function collectTexts(r: { description?: string; content?: { body: string }[]; faqs?: { answer: string }[]; sections?: { body: string }[]; verdict?: string; body?: string }): string[] {
    const texts: string[] = []
    if (r.description) texts.push(r.description)
    if (r.verdict) texts.push(r.verdict)
    if (r.body) texts.push(r.body)
    if (r.content) for (const s of r.content) if (s.body) texts.push(s.body)
    if (r.sections) for (const s of r.sections) if (s.body) texts.push(s.body)
    if (r.faqs) for (const f of r.faqs) if (f.answer) texts.push(f.answer)
    return texts
  }

  for (const r of reviews) for (const t of collectTexts(r)) connectGlossary(r.slug, "software", t)
  for (const g of guides) for (const t of collectTexts(g)) connectGlossary(g.slug, "guide", t)
  for (const p of posts) for (const t of collectTexts(p)) connectGlossary(p.slug, "blog", t)
  for (const c of comparisons) for (const t of collectTexts(c)) connectGlossary(c.slug, "comparison", t)
  for (const r of research) for (const t of collectTexts(r)) connectGlossary(r.slug, "research", t)

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
