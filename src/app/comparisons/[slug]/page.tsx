import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, FAQSchema } from "@/components/seo/json-ld"
import { Card } from "@/components/ui/card"
import { createMetadata } from "@/lib/metadata"
import { getComparison } from "@/lib/content/registry"
import { getAllComparisons } from "@/lib/content/registry"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Check, X, Star } from "lucide-react"

export function generateStaticParams() {
  return getAllComparisons().map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cmp = getComparison(slug)
  if (!cmp) return {}
  return createMetadata({ title: cmp.title, description: cmp.description, path: `/comparisons/${slug}` })
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const cmp = getComparison(slug)
  if (!cmp) notFound()

  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Comparisons", href: "/comparisons" }, { name: cmp.title, href: `/comparisons/${slug}` }]} />
      <FAQSchema questions={cmp.faqs} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Comparisons", href: "/comparisons" }, { name: cmp.title }]} />
      </Container>
      <article className="pb-16">
        <Container>
          <Badge variant="default" className="mb-4">{cmp.category}</Badge>
          <h1 className="text-4xl font-bold tracking-tight mb-4">{cmp.title}</h1>
          <p className="text-lg text-muted mb-8">{cmp.description}</p>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {[
              { name: cmp.tool1, slug: cmp.tool1Slug, isWinner: cmp.winner === cmp.tool1 },
              { name: cmp.tool2, slug: cmp.tool2Slug, isWinner: cmp.winner === cmp.tool2 },
            ].map((tool) => (
              <Card key={tool.name} className={`text-center ${tool.isWinner ? "ring-2 ring-primary/30 bg-primary/5" : ""}`}>
                {tool.isWinner && <Badge variant="default" className="mb-2">Winner</Badge>}
                <Star size={24} className="mx-auto mb-2 text-primary" />
                <div className="text-xl font-bold">{tool.name}</div>
                <Link
                  href={`/reviews/${tool.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent hover:bg-muted-bg h-9 px-4 text-xs font-medium transition-all duration-200 mt-3"
                >
                  Read review
                </Link>
              </Card>
            ))}
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Feature Comparison</h2>
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted-bg border-b border-border">
                    <th className="text-left p-4 font-semibold">Feature</th>
                    <th className="text-center p-4 font-semibold">{cmp.tool1}</th>
                    <th className="text-center p-4 font-semibold">{cmp.tool2}</th>
                  </tr>
                </thead>
                <tbody>
                  {cmp.features.map((f, i) => (
                    <tr key={f.name} className={i < cmp.features.length - 1 ? "border-b border-border" : ""}>
                      <td className="p-4 font-medium">{f.name}</td>
                      <td className="text-center p-4">{f.tool1 ? <Check size={16} className="inline text-emerald-500" /> : <X size={16} className="inline text-red-500" />}</td>
                      <td className="text-center p-4">{f.tool2 ? <Check size={16} className="inline text-emerald-500" /> : <X size={16} className="inline text-red-500" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Verdict</h2>
            <Card className="bg-primary/5 border-primary/20">
              <p className="text-lg font-semibold mb-2">
                Winner: {cmp.winner}
              </p>
              <p className="text-muted text-sm">{cmp.verdict}</p>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl">
              {cmp.faqs.map((faq) => (
                <Card key={faq.question}>
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </section>
        </Container>
      </article>
    </>
  )
}
