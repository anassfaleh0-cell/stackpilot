"use client"

import dynamic from "next/dynamic"
import type { ComponentProps } from "react"

// Below-fold heavy SVG generators — loaded on interaction/idle with no SSR
export const EditorialPricingLadder = dynamic(() => import("@/components/editorial/editorial-pricing-ladder").then(m => ({ default: m.EditorialPricingLadder })), { ssr: false })
export const EditorialFeatureRadar = dynamic(() => import("@/components/editorial/editorial-feature-radar").then(m => ({ default: m.EditorialFeatureRadar })), { ssr: false })
export const EditorialImplementationFlow = dynamic(() => import("@/components/editorial/editorial-implementation-flow").then(m => ({ default: m.EditorialImplementationFlow })), { ssr: false })
export const EditorialWorkflow = dynamic(() => import("@/components/editorial/editorial-workflow").then(m => ({ default: m.EditorialWorkflow })), { ssr: false })
export const EditorialProcess = dynamic(() => import("@/components/editorial/editorial-process").then(m => ({ default: m.EditorialProcess })), { ssr: false })
export const EditorialComparison = dynamic(() => import("@/components/editorial/editorial-comparison").then(m => ({ default: m.EditorialComparison })), { ssr: false })

// Content components — loads cross-page data, no SSR needed
export const RelatedContent = dynamic(() => import("@/components/content/related-content").then(m => ({ default: m.RelatedContent })), { ssr: false })

// Entity components — no SSR needed
export const SecurityTable = dynamic(() => import("@/components/entity/security-table").then(m => ({ default: m.SecurityTable })), { ssr: false })
