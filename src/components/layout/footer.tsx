import Link from "next/link"
import { Container } from "@/components/ui/container"
import { site, navLinks, categories, editorialLinks } from "@/lib/constants"
import { Compass, ArrowUpRight } from "lucide-react"
import { SocialFooterIcons } from "@/components/brand/social-icons"

const footerLinks = [
  {
    title: "Explore",
    links: navLinks,
  },
  {
    title: "Categories",
    links: categories.map((c) => ({
      href: `/category/${c.slug}`,
      label: c.name,
    })),
  },
  {
    title: "Editorial",
    links: editorialLinks,
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/authors", label: "Our Authors" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/methodology", label: "Review Methodology" },
      { href: "/editorial-policy", label: "Editorial Policy" },
      { href: "/editorial-independence", label: "Editorial Independence" },
      { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
      { href: "/advertising-disclosure", label: "Advertising Disclosure" },
      { href: "/corrections-policy", label: "Corrections Policy" },
    ],
  },
]

function Logo() {
  return (
    <img src="/favicon.svg" alt="" className="h-7 w-7" width={28} height={28} aria-hidden="true" />
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-secondary">
      <Container className="py-16 lg:py-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg mb-4">
              <Logo />
              <span>{site.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed text-pretty">
              {site.description}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Learn more about PilotStack"
              >
                Learn more <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="mt-6">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Follow PilotStack</h2>
              <SocialFooterIcons />
            </div>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">{group.title}</h2>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; 2024-2026 {site.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            Independent reviews and comparisons. We may earn commissions from affiliate links. All reviews follow our <Link href="/methodology" className="underline underline-offset-2 hover:text-foreground">editorial methodology</Link>.
          </p>
        </div>
      </Container>
    </footer>
  )
}
