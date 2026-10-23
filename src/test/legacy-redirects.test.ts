import { describe, expect, it } from "vitest"
import nextConfig from "../../next.config"

describe("legacy SEO redirects", () => {
  it("permanently redirects legacy plural collection roots to canonical routes", async () => {
    const redirects = await nextConfig.redirects?.()
    expect(redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({ source: "/blogs", destination: "/blog", permanent: true }),
      expect.objectContaining({ source: "/blogs/:slug", destination: "/blog/:slug", permanent: true }),
      expect.objectContaining({ source: "/glossarys", destination: "/glossary", permanent: true }),
      expect.objectContaining({ source: "/glossarys/:slug", destination: "/glossary/:slug", permanent: true }),
      expect.objectContaining({ source: "/bests", destination: "/best", permanent: true }),
      expect.objectContaining({ source: "/best/project-management-software", destination: "/best/best-project-management-software", permanent: true }),
      expect.objectContaining({ source: "/guides/software-evaluation-playbook-2026", destination: "/blog/software-evaluation-playbook-2026", permanent: true }),
      expect.objectContaining({ source: "/guides/software-evaluation-playbook", destination: "/blog/software-evaluation-playbook-2026", permanent: true }),
      expect.objectContaining({ source: "/bests/:slug", destination: "/best/:slug", permanent: true }),
      expect.objectContaining({ source: "/best/best-productivity-startups", destination: "/best/best-productivity-tools", permanent: true }),
      expect.objectContaining({ source: "/bests/best-productivity-startups", destination: "/best/best-productivity-tools", permanent: true }),
      expect.objectContaining({ source: "/authors/sarah-chen", destination: "/authors/pilotstack-team", permanent: true }),
    ]))
  })
})
