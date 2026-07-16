import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, DefinedTermSchema } from "@/components/seo/json-ld"
import { createMetadata } from "@/lib/metadata"
import { getGlossaryTerm } from "@/lib/content/registry"
import { getAllGlossaryTerms } from "@/lib/content/registry"
import { notFound } from "next/navigation"
import Link from "next/link"

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

  return (
    <>
      <DefinedTermSchema term={item.term} definition={item.definition} />
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Glossary", href: "/glossary" }, { name: item.term, href: `/glossary/${slug}` }]} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Glossary", href: "/glossary" }, { name: item.term }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Badge variant="default" className="mb-4">{item.category}</Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">{item.term}</h1>
            <p className="text-lg text-muted mb-8">{item.definition}</p>
            <div className="prose prose-slate max-w-none">
              <p>{item.extendedDefinition}</p>
            </div>
            {item.examples && item.examples.length > 0 && (
              <div className="mt-8">
                <h2 className="font-semibold mb-3">Examples</h2>
                <ul className="space-y-2">
                  {item.examples.map((ex, i) => (
                    <li key={i} className="text-sm text-muted flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {item.relatedTerms.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <h2 className="font-semibold mb-3">Related Terms</h2>
                <div className="flex flex-wrap gap-2">
                  {item.relatedTerms.map((r) => (
                    <Link key={r} href={`/glossary/${r}`} className="text-sm text-primary hover:underline">
                      {termMap[r] || r}
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
