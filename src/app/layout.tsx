import type { Metadata, Viewport } from "next/dist/lib/metadata/types/metadata-interface"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { GAScript, ClarityScript } from "@/components/analytics"
import { ClientLayout } from "@/components/layout/client-layout"
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
  preload: false,
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
  metadataBase: new URL(siteConfig.url),
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
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://5gvci.com" />
        <link rel="dns-prefetch" href="https://n6wxm.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.clarity.ms" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          <OrganizationSchema />
          <WebsiteSchema />
          <Header />
          <ClientLayout />
          <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <GAScript />
          <ClarityScript />
          <Script
            src="https://5gvci.com/act/files/tag.min.js?z=11346121"
            data-cfasync="false"
            strategy="afterInteractive"
          />
          <Script
            src="https://5gvci.com/act/files/tag.min.js?z=11345405"
            data-cfasync="false"
            strategy="afterInteractive"
          />
          <Script
            src="https://n6wxm.com/vignette.min.js"
            data-zone="11346128"
            strategy="afterInteractive"
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
