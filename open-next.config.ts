// @ts-nocheck
// This config is loaded only by the Cloudflare OpenNext adapter.
// The Cloudflare CI workflow installs @opennextjs/cloudflare before building.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// PilotStack's content is committed with the app and refreshed by a new build.
// Use the read-only static-assets cache so prerendered dynamic routes (SSG)
// remain available on Workers without requiring an external cache service.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
