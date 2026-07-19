import type { Metadata, Viewport } from "next/dist/lib/metadata/types/metadata-interface"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToastProvider } from "@/components/ui/toast"
import { ThemeProvider } from "@/components/theme-provider"
import { CookieConsent } from "@/components/analytics/cookie-consent"
import { Analytics } from "@/components/analytics"
import { ReadingProgress } from "@/components/layout/reading-progress"
import { OrganizationSchema, WebsiteSchema } from "@/components/seo/json-ld"
import { siteConfig } from "@/lib/constants"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["Inter", "system-ui", "Arial", "sans-serif"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["JetBrains Mono", "Consolas", "Monaco", "monospace"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#5472E8" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0E14" },
  ],
  colorScheme: "light dark",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://pilotstack.online"),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: `${siteConfig.name} - ${siteConfig.description}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('pilotstack-theme');
                  var r;
                  if (t === 'light' || t === 'dark') {
                    r = t;
                  } else {
                    r = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(r);
                } catch(e) {}
              })();
            `,
          }}
        />
        <link rel="alternate" type="application/rss+xml" title={`${siteConfig.name}`} href="/rss.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        {process.env.NEXT_PUBLIC_VERCEL_ANALYTICS && (
          <script defer src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <ToastProvider>
            <a href="#main-content" className="skip-to-content">
              Skip to main content
            </a>
            <OrganizationSchema />
            <WebsiteSchema />
            <Header />
            <ReadingProgress />
          <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
              {children}
            </main>
            <Footer />
            <CookieConsent />
            <Analytics />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
