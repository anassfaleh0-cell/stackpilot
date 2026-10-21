// @ts-nocheck
// This config is loaded only by the Cloudflare OpenNext adapter.
// The Cloudflare CI workflow installs @opennextjs/cloudflare before building.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// PilotStack's content is committed with the app and refreshed by a new build.
// Use the read-only static-assets cache for prerendered routes, and enable cache
// interception so SSG responses are served from that cache before invoking the
// Next.js runtime (which cannot rely on repository JSON files at request time).
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
