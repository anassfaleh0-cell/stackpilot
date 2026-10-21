# PilotStack Cloudflare Workers migration

## Safety rules

- This branch is an isolated migration candidate. It must not change the production domain, DNS, registrar, Cloudflare zone settings, or the current Vercel deployment.
- Keep the existing Vercel deployment available as a rollback target until Cloudflare has passed staging and production checks.
- Never enable `noindex`, change canonical hostnames, change the sitemap URL inventory, or rewrite existing public paths just to make the adapter build.
- The Cloudflare validation workflow performs an OpenNext build and a Wrangler dry run only. It does not deploy or require a Cloudflare API token.
- The separate preview deployment workflow is manual-only. It deploys only the `pilotstack-preview` Worker to `workers.dev` and then smoke-tests public routes; it does not configure the production domain or DNS.
- Do not add credentials, API tokens, or `.env` contents to Git. Never use a Global API Key in CI; use a scoped API Token.

## Preview deployment setup

1. In Cloudflare, create an API Token scoped to the correct account with only the permissions needed to manage Workers and deploy Workers scripts. Do not use or share the Global API Key.
2. In GitHub repository Settings → Secrets and variables → Actions, add the secret `CLOUDFLARE_API_TOKEN` and the repository variable `CLOUDFLARE_ACCOUNT_ID`.
3. Open Actions → “Deploy PilotStack Cloudflare preview” → Run workflow. Type `PREVIEW` when prompted. This workflow is manual-only and deploys the separate `pilotstack-preview` Worker.
4. Review the deployment URL and route smoke tests. If the workflow fails, fix the issue before any production cutover.
5. Do not attach `pilotstack.online` or change DNS until staging checks pass and the production cutover is separately approved.

## Migration checks

1. Build the existing Next.js application through the Cloudflare OpenNext adapter.
2. Inspect any adapter warnings, unsupported APIs, runtime compatibility errors, and image optimization behavior.
3. Run the existing unit tests and route/SEO smoke tests.
4. Compare representative production URLs against the preview: status codes, content, title/description, canonical, robots directives, JSON-LD, internal links, sitemap, robots.txt, and `/ads.txt`.
5. Exercise contact, newsletter, search, IndexNow, RSS, and protected revalidation endpoints. Verify that absent external providers/secrets fail safely and do not falsely report success.
6. Verify environment variables are configured in Cloudflare's dashboard/Workers Builds without exposing secret values in logs or source control.
7. Deploy only to a separate `workers.dev` preview after an authorized Cloudflare token is available. Do not attach `pilotstack.online` yet.
8. Only after all checks pass, schedule a controlled custom-domain cutover with a tested rollback path. Keep domain/DNS changes as the final step.

## Important implementation details

- Next.js keeps `output: "standalone"`, which OpenNext Cloudflare uses as its build input. The normal Vercel build configuration is otherwise unchanged.
- `wrangler.jsonc` deliberately names a preview Worker and does not bind the production custom domain.
- Static export is intentionally not used because this application includes App Router route handlers and server-side functionality.
- The preview uses OpenNext's read-only `staticAssetsIncrementalCache` for prerendered SSG pages, so content changes are refreshed by a new build. Do not configure `REVALIDATION_SECRET` for this static-cache profile; if runtime revalidation becomes a requirement, design and test an R2-backed incremental cache and tag-cache setup separately before production.
- A successful build is not proof of production readiness. A live preview must be checked in the Cloudflare Workers runtime before any domain change.
