import { Container, Section } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Cookie Policy",
  description: "PilotStack's cookie policy explains how we use cookies and similar tracking technologies to operate and improve our website, in compliance with GDPR and ePrivacy regulations.",
  path: "/cookies",
})

export default function CookiesPage() {
  return (
    <>
      <BreadcrumbSchema items={[{ name: "Home", href: "/" }, { name: "Cookie Policy", href: "/cookies" }]} />
      <WebPageSchema name="Cookie Policy" description="How PilotStack uses cookies." url={`${site.url}/cookies`} />
      <Container className="pt-8">
        <Breadcrumbs items={[{ name: "Cookie Policy" }]} />
      </Container>
      <Section className="pt-0">
        <Container>
          <div className="max-w-3xl mx-auto prose prose-slate">
            <h1 className="text-4xl font-bold tracking-tight mb-6">Cookie Policy</h1>
            <p className="text-muted-foreground"><em>Last updated: July 19, 2026</em></p>

            <p>This Cookie Policy explains how PilotStack ("we", "us", "our") uses cookies and similar tracking technologies on our website. It supplements our <a href="/privacy">Privacy Policy</a> and explains what cookies are, why we use them, and how you can control their use.</p>

            <h2>What Are Cookies</h2>
            <p>Cookies are small text files that websites store on your device (computer, tablet, smartphone) when you visit. They are widely used to make websites work efficiently, enhance user experience, and provide information to site owners. Cookies typically contain a unique identifier — a sequence of numbers and letters — that allows websites to recognize your device on return visits.</p>
            <p>Similar technologies include local storage, session storage, and web beacons (small transparent images used to track page views and email opens).</p>

            <h2>Cookies We Use</h2>
            <p>We minimize cookie usage to what is strictly necessary for site operation and basic analytics. We do <strong>not</strong> use advertising cookies, social media pixels, or cross-site tracking cookies.</p>

            <h3>Essential Cookies</h3>
            <p>These cookies are necessary for the website to function and cannot be disabled. They are set automatically when you access our site and do not store any personally identifiable information.</p>
            <ul>
              <li><strong>Theme preference:</strong> Stores your light/dark mode preference in local storage. No expiration — persists until you change your preference or clear site data.</li>
              <li><strong>Session token:</strong> A temporary session identifier used for basic site operations. Expires when you close your browser.</li>
            </ul>

            <h3>Analytics Cookies</h3>
            <p>We use privacy-preserving analytics to understand how visitors interact with our site. These cookies collect aggregated, anonymized data and do not identify individual users.</p>
            <ul>
              <li><strong>Google Analytics 4 (GA4):</strong> Collects anonymized page views, session duration, and traffic source data. IP addresses are anonymized. Data retained for 26 months. <em>Opt-out available via <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics opt-out browser add-on</a>.</em></li>
              <li><strong>Microsoft Clarity:</strong> Provides anonymized session replays and heatmaps to help us understand how users navigate the site. Does not capture keystrokes, passwords, or personally identifiable information. <em>Opt-out available via the <a href="https://privacy.microsoft.com/en-US/privacystatement" target="_blank" rel="noopener">Microsoft Privacy Statement</a>.</em></li>
            </ul>

            <h3>Third-Party Cookies</h3>
            <p>Some third-party services we use may set their own cookies:</p>
            <ul>
              <li><strong>Vercel Analytics:</strong> Edge network analytics — privacy-friendly, cookie-less by default for basic metrics.</li>
              <li><strong>Monetization scripts:</strong> Our ad and affiliate partners may set cookies to track impressions and clicks. These are third-party controlled and their use is governed by their respective privacy policies. We require all partners to comply with GDPR and ePrivacy regulations.</li>
            </ul>

            <h2>How We Use Cookie Data</h2>
            <p>Data collected via cookies is used exclusively for:</p>
            <ul>
              <li>Ensuring the website functions correctly</li>
              <li>Remembering your theme preference (light/dark mode)</li>
              <li>Analyzing aggregate traffic patterns to improve content and user experience</li>
              <li>Measuring the effectiveness of our content and site structure</li>
              <li>Detecting and preventing technical issues</li>
            </ul>
            <p>We never use cookie data for:</p>
            <ul>
              <li>Targeted advertising or retargeting</li>
              <li>Building user profiles for commercial purposes</li>
              <li>Selling or sharing data with data brokers</li>
              <li>Cross-site tracking or fingerprinting</li>
            </ul>

            <h2>Cookie Duration</h2>
            <ul>
              <li><strong>Session cookies:</strong> Expire when you close your browser. Used for temporary session management.</li>
              <li><strong>Persistent cookies:</strong> Remain on your device for a set period or until manually deleted. Our longest-running cookies expire after 26 months (GA4 data retention limit).</li>
            </ul>

            <h2>Managing Cookies</h2>
            <p>You can control and manage cookies in several ways:</p>
            <ul>
              <li><strong>Browser settings:</strong> Most browsers let you view, block, or delete cookies. Check your browser&apos;s help documentation for instructions.</li>
              <li><strong>Privacy plugins:</strong> Browser extensions like uBlock Origin, Privacy Badger, or Ghostery can block tracking scripts.</li>
              <li><strong>Do Not Track:</strong> Some browsers support the DNT header. We respect DNT signals where technically feasible.</li>
              <li><strong>GA4 opt-out:</strong> Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics opt-out browser add-on</a> to prevent data collection by GA4.</li>
            </ul>
            <p>Please note that blocking essential cookies may affect site functionality, including theme persistence and basic session management.</p>

            <h2>Updates to This Policy</h2>
            <p>We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our practices. Material changes will be communicated via email to subscribers and by posting a notice on our website. The "Last updated" date at the top reflects the most recent revision.</p>

            <h2>Contact</h2>
            <p>For questions about this Cookie Policy or our data practices, contact us at <strong>privacy@pilotstack.online</strong>.</p>
          </div>
        </Container>
      </Section>
    </>
  )
}
