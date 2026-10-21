# PilotStack Cloudflare Workers migration

## Safety rules

- This branch is an isolated migration candidate. It must not change the production domain, DNS, registrar, Cloudflare zone settings, or the current Vercel deployment.
- Keep the existing Vercel deployment available as a rollback target until Cloudflare has passed staging and production checks.
- Never enable `noindex`, change canonical hostnames, change the sitemap URL inventory, or rewrite existing public paths just to make the adapter build.
- The Cloudflare validation workflow performs an OpenNext build and a Wrangler dry run only. It does not deploy or require a Cloudflare API token.
- Do not add credentials, API tokens, or `.env` contents to Git.

## Migration checks

1. Build the existing Next.js application through the Cloudflare OpenNext adapter.
2. Inspect any adapter warnings, unsupported APIs, runtime compatibility errors, and image optimization behavior.
3. Run the existing unit tests and route/SEO smoke tests.
4. Compare representative production URLs against the preview: status codes, content, title/description, canonical, robots directives, JSON-LD, internal links, sitemap, robots.txt, and `/ads.txt`.
5. Exercise contact, newsletter, search, IndexNow, RSS, and protected revalidation endpoints. Verify that absent external providers/secrets fail safely and do not falsely report success.
6. Verify environment variables are configured in Cloudflare's dashboard/Workers Builds without exposing secret values in logs or source control.
7. Deploy only to a separate `workers.dev` preview after an authorized Cloudflare session/token is available. Do not attach `pilotstack.online` yet.
8. Only after all checks pass, schedule a controlled custom-domain cutover with a tested rollback path. Keep domain/DNS changes as the final step.

## Important implementation details

- Next.js keeps `output: "standalone"`, which OpenNext Cloudflare uses as its build input. The normal Vercel build configuration is otherwise unchanged.
- `wrangler.jsonc` deliberately names a preview Worker and does not bind the production custom domain.
- Static export is intentionally not used because this application includes App Router route handlers and server-side functionality.
- A successful build is not proof of production readiness. A live preview must be checked in the Cloudflare Workers runtime before any domain change.
