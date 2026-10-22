import { Container, Section } from "@/components/ui/container"
import { Breadcrumbs } from "@/components/seo/breadcrumbs"
import { BreadcrumbSchema, WebPageSchema } from "@/components/seo/json-ld"
import { site } from "@/lib/constants"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Cookie Policy — How PilotStack Uses Cookies",
  description: "PilotStack's cookie policy explains how we use cookies and similar tracking technologies to operate and improve our website.",
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
            <p className="text-muted-foreground"><em>Last updated: October 22, 2026</em></p>

            <p>This Cookie Policy explains how PilotStack ("we", "us", "our") uses cookies and similar tracking technologies on our website. It supplements our <a href="/privacy">Privacy Policy</a> and explains what cookies are, why we use them, and how you can control their use.</p>

            <h2>What Are Cookies</h2>
            <p>Cookies are small text files that websites store on your device (computer, tablet, smartphone) when you visit. They are widely used to make websites work efficiently, enhance user experience, and provide information to site owners. Cookies typically contain a unique identifier — a sequence of numbers and letters — that allows websites to recognize your device on return visits.</p>
            <p>Similar technologies include local storage, session storage, and web beacons (small transparent images used to track page views and email opens).</p>

            <h2>Cookies We Use</h2>
            <p>We minimize cookie usage to what is strictly necessary for site operation and basic analytics. We use a cookie consent banner that lets you control which categories of cookies are enabled.</p>

            <h3>Essential Cookies</h3>
            <p>These cookies are necessary for the website to function and cannot be disabled. They are set automatically when you access our site and do not store any personally identifiable information.</p>
            <ul>
              <li><strong>Theme preference:</strong> Stores your light/dark mode preference in local storage. No expiration — persists until you change your preference or clear site data.</li>
                          </ul>

            <h3>Analytics Cookies</h3>
            <p>We use analytics tools, including Google Analytics and Microsoft Clarity, to understand how visitors interact with our site. These services may process usage and device information according to their own privacy policies and are loaded only after analytics consent. Google Tag Manager is loaded only after both analytics and advertising preferences are enabled, so its third-party tags are not requested before those choices are made.</p>
            <ul>
              <li><strong>Google Analytics 4 (GA4):</strong> May collect page views, session and traffic-source information, and device/browser signals. IP anonymization and other data controls depend on the service and configuration; we do not promise that every event or identifier is anonymous in every context. Retention periods depend on the analytics configuration and applicable Google settings. <em>Opt-out available via <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics opt-out browser add-on</a>.</em></li>
              <li><strong>Microsoft Clarity:</strong> May provide session-replay and heatmap insights about site interactions. We do not ask visitors to submit passwords or sensitive personal data through our forms. Clarity's collection, masking, and retention behavior depends on provider features and settings, so review the <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener noreferrer">Microsoft Privacy Statement</a> for provider-level details.</li>
            </ul>

            <h3>Third-Party Cookies</h3>
            <p>Some third-party services we use may set their own cookies:</p>
            <ul>
              <li><strong>Google AdSense (planned):</strong> We are preparing to use AdSense. If ads are enabled and ad inventory is configured, Google may use cookies or similar technologies to serve and measure ads. The AdSense script is loaded only after advertising consent. Before serving personalized ads in the EEA, UK, or Switzerland, we will configure a Google-certified CMP that supports the IAB Transparency and Consent Framework.</li>
              
              <li><strong>Advertising and affiliate integrations:</strong> If we enable an advertising or affiliate service, that provider may process information or set cookies to measure impressions, clicks, or referrals. The relevant provider&apos;s privacy policy and consent requirements will apply.</li>
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
            <p>We do not intentionally use cookie data for the following purposes outside the specific services and consent choices described above. Third-party providers may process data under their own terms and configurations:</p>
            <ul>
              <li>Using analytics cookie data to make eligibility or similarly significant decisions about individual visitors</li>
              <li>Selling or sharing data with data brokers</li>
              <li>Deliberate device fingerprinting by PilotStack</li>
            </ul>

            <h2>Cookie Duration</h2>
            <ul>
              <li><strong>Session cookies:</strong> Expire when you close your browser. Used for temporary session management.</li>
              <li><strong>Persistent cookies:</strong> Remain on your device for a set period or until manually deleted. Retention periods vary by service and configuration.</li>
            </ul>

            <h2>Managing Cookies</h2>
            <p>You can control and manage cookies in several ways. To change your saved choices on PilotStack, use the Cookie Settings control when available on the site; you can also clear the site’s stored consent preference in your browser and reload to be asked again.</p>
            <ul>
              <li><strong>Browser settings:</strong> Most browsers let you view, block, or delete cookies. Check your browser&apos;s help documentation for instructions.</li>
              <li><strong>Privacy plugins:</strong> Browser extensions like uBlock Origin, Privacy Badger, or Ghostery can block tracking scripts.</li>
              <li><strong>Do Not Track:</strong> Some browsers support the DNT header. We respect DNT signals where technically feasible.</li>
              <li><strong>GA4 opt-out:</strong> Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics opt-out browser add-on</a> to prevent data collection by GA4.</li>
            </ul>
            <p>Please note that blocking essential cookies may affect site functionality, including theme persistence and basic session management.</p>

            <h2>Updates to This Policy</h2>
            <p>We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our practices. Material changes will be reflected on this page with an updated date. The "Last updated" date at the top reflects the most recent revision.</p>

            <h2>Contact</h2>
            <p>For questions about this Cookie Policy or our data practices, use the official social channels listed on our <a href="/contact">Contact page</a> or email contact@pilotstack.online. Please do not send sensitive personal information through social media.</p>
          </div>
        </Container>
      </Section>
    </>
  )
}
