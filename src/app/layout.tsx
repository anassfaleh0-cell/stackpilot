import type { Metadata, Viewport } from "next/dist/lib/metadata/types/metadata-interface"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ToastProvider } from "@/components/ui/toast"
import { OrganizationSchema, WebsiteSchema } from "@/components/seo/json-ld"
import { siteConfig } from "@/lib/constants"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Arial", "sans-serif"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["Consolas", "Monaco", "monospace"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#5252E8" },
    { media: "(prefers-color-scheme: dark)", color: "#0F172A" },
  ],
  colorScheme: "light dark",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://stackpilot.com"),
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
    apple: "/logo.svg",
  },
  manifest: "/manifest.webmanifest",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="alternate" type="application/rss+xml" title={`${siteConfig.name}`} href="/rss.xml" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ToastProvider>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <OrganizationSchema />
        <WebsiteSchema />
        <Header />
        <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}
