import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Dashboard — Growth & Traffic Metrics",
  description: "PilotStack growth monitoring dashboard tracking search performance, authority, revenue, and technical metrics.",
  path: "/dashboard",
})

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
