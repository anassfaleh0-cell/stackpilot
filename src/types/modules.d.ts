declare module "next/types.js" {
  import type { Metadata, Viewport } from "next/dist/lib/metadata/types/metadata-interface"
  export type ResolvingMetadata = (props: unknown) => Promise<Metadata>
  export type ResolvingViewport = (props: unknown) => Promise<Viewport>
}

declare module "next/server" {
  export type NextRequest = Request
  export type NextResponse = Response
}
