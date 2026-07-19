declare module "next/script" {
  import type { ScriptProps } from "next/dist/client/script"
  const Script: React.FC<ScriptProps>
  export default Script
}

declare module "next/types.js" {
  import type { Metadata, Viewport } from "next/dist/lib/metadata/types/metadata-interface"
  export type ResolvingMetadata = (props: unknown) => Promise<Metadata>
  export type ResolvingViewport = (props: unknown) => Promise<Viewport>
}

declare module "next/server" {
  export type NextRequest = Request
  export type NextResponse = Response
}
