export interface SoftwareEntity {
  slug: string
  name: string
  company?: CompanyDetail
  capabilities?: Capabilities
  security?: SecurityDetail
  pricing?: PricingDetail[]
  integrations?: string[]
  useCases?: UseCases
}

export interface CompanyDetail {
  legalName?: string
  website: string
  founded?: number
  headquarters?: string
  founders?: string[]
  ceo?: string
  ownership?: "Public" | "Private" | "Subsidiary"
  parentCompany?: string
  stockSymbol?: string
  funding?: string
  employees?: string
  customers?: string
  industries?: string[]
  targetAudience?: "SMB" | "Mid-market" | "Enterprise" | "All"
  languages?: string[]
  platforms?: ("Web" | "Windows" | "macOS" | "Linux" | "iOS" | "Android")[]
  mobileApps?: boolean
  browserExtension?: boolean
  desktopApp?: boolean
}

export interface Capabilities {
  ai?: boolean
  aiDescription?: string
  automation?: boolean
  automationDescription?: string
  api?: boolean
  apiDescription?: string
  webhooks?: boolean
  webhooksDescription?: string
  marketplace?: boolean
  marketplaceDescription?: string
  templates?: boolean
  templatesDescription?: string
  collaboration?: boolean
  collaborationDescription?: string
  analytics?: boolean
  analyticsDescription?: string
  reporting?: boolean
  reportingDescription?: string
  dashboards?: boolean
  dashboardsDescription?: string
  permissions?: boolean
  permissionsDescription?: string
  auditLogs?: boolean
  auditLogsDescription?: string
  backup?: boolean
  backupDescription?: string
  versionHistory?: boolean
  versionHistoryDescription?: string
  offlineSupport?: boolean
  offlineSupportDescription?: string
  import?: boolean
  importDescription?: string
  export?: boolean
  exportDescription?: string
  customFields?: boolean
  customFieldsDescription?: string
  mobileApps?: boolean
  mobileAppsDescription?: string
  desktopApp?: boolean
  desktopAppDescription?: string
  browserExtension?: boolean
  browserExtensionDescription?: string
}

export interface SecurityDetail {
  soc2?: boolean | null
  iso27001?: boolean
  gdpr?: boolean | null
  hipaa?: boolean
  ccpa?: boolean | null
  pciDss?: boolean
  saml?: boolean
  samlDescription?: string
  sso?: boolean
  ssoDescription?: string
  mfa?: boolean
  mfaDescription?: string
  encryption?: string
  encryptionDescription?: string
  dataResidency?: string[]
  sla?: string
  penetrationTesting?: boolean
  bugBounty?: boolean
  securityPage?: string
}

export interface PricingDetail {
  plan: string
  billing: "Monthly" | "Annual" | "One-time" | "Custom"
  price?: number
  currency?: string
  unit?: string
  description?: string
  highlighted?: boolean
}

export interface UseCases {
  primary: string[]
  secondary?: string[]
  idealCompanySize?: string[]
  bestIndustries?: string[]
  typicalTeams?: string[]
  commonWorkflows?: string[]
  migrationScenarios?: string[]
  beginnerSuitability?: "Low" | "Medium" | "High"
  enterpriseSuitability?: "Low" | "Medium" | "High"
}
