import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, DefinedTermSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { getGlossaryTerm } from "@/lib/content/registry"
import { getAllGlossaryTerms } from "@/lib/content/registry"
import { notFound } from "next/navigation"
import Link from "next/link"
import { EditorialHero, EditorialConcept, EditorialCallout, GlassCard, InfoCard, getPalette } from "@/components/editorial"

export function generateStaticParams() {
  return getAllGlossaryTerms().map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getGlossaryTerm(slug)
  if (!item) return {}
  return createMetadata({ title: item.term, description: item.definition, path: `/glossary/${slug}`, ogType: "article" })
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getGlossaryTerm(slug)
  if (!item) notFound()

  const allTerms = getAllGlossaryTerms()
  const termMap = Object.fromEntries(allTerms.map((t) => [t.slug, t.term]))
  const p = getPalette(item.category)

  return (
    <>
      <DefinedTermSchema term={item.term} definition={item.definition} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Glossary", href: "/glossary" }, { name: item.term, href: `/glossary/${slug}` }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Glossary", href: "/glossary" }, { name: item.term }]} />
      </Container>

      <div className="mb-6 px-4 sm:px-8">
        <EditorialHero
          slug={item.slug}
          title={item.term}
          subtitle={item.definition}
          category={item.category}
          variant="glossary"
          className="w-full min-h-[160px] sm:min-h-[200px]"
        />
      </div>

      <article className="pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">{item.category}</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">{item.term}</h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{item.definition}</p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <InfoCard icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3" />
                </svg>
              } value={item.term} title="Glossary Term" description={item.category} />
              <InfoCard icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--info)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              } value={allTerms.length.toString()} title="Total Glossary Terms" description="In our reference library" />
            </div>

            <div className="leading-relaxed text-foreground/85 mb-8">
              <p>{item.extendedDefinition}</p>
            </div>

            <div className="mb-8">
              <EditorialConcept term={item.term} slug={item.slug} category={item.category} />
            </div>

            {item.examples && item.examples.length > 0 && (
              <div className="mt-8">
                <div className="rounded-xl border border-success-subtle bg-success-subtle/30 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="font-semibold text-sm text-success">Real-World Examples</span>
                  </div>
                  <ul className="space-y-2.5">
                    {item.examples.map((ex, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success-subtle text-success text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                        <span className="text-foreground">{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {item.relatedTerms.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-2 mb-4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M16 12H8" />
                  </svg>
                  <h2 className="font-semibold">Related Terms</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.relatedTerms.map((r) => (
                    <Link key={r} href={`/glossary/${r}`} className="inline-flex items-center gap-1 rounded-lg border border-primary/20 px-3 py-1.5 text-sm transition-colors text-primary hover:bg-primary-subtle">
                      {termMap[r] || r}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17l9.2-9.2M17 17V7H7" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </article>
    </>
  )
}
