import dynamic from "next/dynamic"
import type { ComponentProps } from "react"

// Above-fold components — SSR'd for SEO, chunked for smaller main bundle
export const EditorialHero = dynamic(() => import("@/components/editorial/editorial-hero").then(m => ({ default: m.EditorialHero })), { ssr: true })
export const EditorialProsCons = dynamic(() => import("@/components/editorial/editorial-pros-cons").then(m => ({ default: m.EditorialProsCons })), { ssr: true })
export const EditorialFeatureMatrix = dynamic(() => import("@/components/editorial/editorial-features").then(m => ({ default: m.EditorialFeatureMatrix })), { ssr: true })
export const EditorialRatingVisual = dynamic(() => import("@/components/editorial/editorial-rating").then(m => ({ default: m.EditorialRatingVisual })), { ssr: true })
export const EditorialPricing = dynamic(() => import("@/components/editorial/editorial-pricing").then(m => ({ default: m.EditorialPricing })), { ssr: true })
export const EditorialSectionIllustration = dynamic(() => import("@/components/editorial/editorial-section").then(m => ({ default: m.EditorialSectionIllustration })), { ssr: true })
export const EditorialCallout = dynamic(() => import("@/components/editorial/editorial-callout").then(m => ({ default: m.EditorialCallout })), { ssr: true })
export const EditorialExpert = dynamic(() => import("@/components/editorial/editorial-expert").then(m => ({ default: m.EditorialExpert })), { ssr: true })
export const EditorialConcept = dynamic(() => import("@/components/editorial/editorial-concept").then(m => ({ default: m.EditorialConcept })), { ssr: true })

// GlassCard/InfoCard — lightweight, SSR for perceived performance
export const GlassCard = dynamic(() => import("@/components/editorial/glass-card").then(m => ({ default: m.GlassCard })), { ssr: true })
export const InfoCard = dynamic(() => import("@/components/editorial/glass-card").then(m => ({ default: m.InfoCard })), { ssr: true })

// Entity components — SSR'd for SEO
export const EntityOverview = dynamic(() => import("@/components/entity/entity-overview").then(m => ({ default: m.EntityOverview })), { ssr: true })
export const CapabilitiesGrid = dynamic(() => import("@/components/entity/capabilities-grid").then(m => ({ default: m.CapabilitiesGrid })), { ssr: true })
export const UseCasePanel = dynamic(() => import("@/components/entity/use-case-panel").then(m => ({ default: m.UseCasePanel })), { ssr: true })
export const IntegrationDisplay = dynamic(() => import("@/components/entity/integration-display").then(m => ({ default: m.IntegrationDisplay })), { ssr: true })
export const PricingTable = dynamic(() => import("@/components/entity/pricing-table").then(m => ({ default: m.PricingTable })), { ssr: true })
export const AutoComparison = dynamic(() => import("@/components/entity/auto-comparison").then(m => ({ default: m.AutoComparison })), { ssr: true })
export const SemanticLinks = dynamic(() => import("@/components/entity/semantic-links").then(m => ({ default: m.SemanticLinks })), { ssr: true })
