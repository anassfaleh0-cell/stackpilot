// @ts-nocheck
// This config is loaded only by the Cloudflare OpenNext adapter.
// The Cloudflare CI workflow installs @opennextjs/cloudflare before building.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Next.js 15.5.27+ uses a literal "$" path segment in prerender cache keys.
// Cloudflare's production Static Assets endpoint redirects "$" to "%24", but
// ASSETS.fetch does not follow that redirect in production. A cache miss then
// falls through to runtime rendering, where PilotStack's filesystem-backed
// content registry cannot resolve JSON files and returns 404. Encode each path
// segment before requesting the read-only cache; this keeps production behavior
// consistent with the local OpenNext preview.
const cache = staticAssetsIncrementalCache as unknown as {
  getAssetUrl: (key: string, cacheType?: string) => string;
};
const getOriginalAssetUrl = cache.getAssetUrl.bind(cache);
cache.getAssetUrl = (key, cacheType) => {
  const assetUrl = getOriginalAssetUrl(key, cacheType);
  const parsed = new URL(assetUrl);
  parsed.pathname = parsed.pathname
    .split("/")
    .map((segment) => {
      try {
        return encodeURIComponent(decodeURIComponent(segment));
      } catch {
        return encodeURIComponent(segment);
      }
    })
    .join("/");
  return parsed.toString();
};

// PilotStack's content is committed with the app and refreshed by a new build.
// Use the read-only static-assets cache for prerendered routes, and enable cache
// interception so SSG responses are served from that cache before invoking the
// Next.js runtime (which cannot rely on repository JSON files at request time).
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
