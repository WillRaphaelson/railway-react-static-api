# React Static Frontend and Form API on Railway

A React/Vite studio website served by Caddy, with a separate Node.js form API reached through Railway private networking. The browser uses a same-origin `/api/contact` request. No database, email provider, or credentials are required.

The API validates requests and returns a receipt. It does not persist or email submissions. Replace the demo behavior with your chosen storage or delivery integration before accepting real enquiries. Add rate limiting and abuse protection for a public production form.

## Repository

- `web/`: React source, Vite build, and Caddy configuration.
- `api/`: Node HTTP API, validation, payload limit, and contract test.
- `.railway/railway.ts`: Railway IaC describing both services and the private hostname reference.
- `scripts/verify.mjs`: HTTP checks against the built site and API proxy.

## Run locally

Use Node.js 22. Install dependencies and build:

```sh
npm ci
npm --prefix web ci
npm --prefix web run build
npm run check
npm test
```

In separate terminals:

```sh
node api/server.mjs
```

```sh
npm --prefix web run dev
```

Vite proxies `/api` to port 3001 during development. The deployed frontend uses Caddy instead of the Vite development server. Caddy's production document root is `/app/dist`, matching the Railpack runtime layout.

## Deploy from the repository

Use a Railway account and current CLI. See [Railway's quick start](https://docs.railway.com/quick-start), [IaC guide](https://docs.railway.com/infrastructure-as-code), and [production readiness checklist](https://docs.railway.com/platform/production-readiness-checklist).

1. Fork this repository and update both GitHub source names in `.railway/railway.ts` to your fork.
2. Create a dedicated project with `railway init`, then run `railway config plan` and review the two services before `railway config apply`.
3. `api` uses root `/api` and port 3001. `web` uses root `/web`, with `API_HOST` referencing the API service's `RAILWAY_PRIVATE_DOMAIN`. Railpack builds each service. The API listens on IPv6 as well as IPv4 for Railway's private network.
4. Generate a public web domain with `railway domain --service web`. The API doesn't need a public domain.
5. Enable CDN caching with `railway cdn enable --service web` after the domain is applied.
6. Run `node scripts/verify.mjs https://YOUR-WEB-DOMAIN` and test the form in a browser.

Only `web` needs a public domain. Hashed static assets have an immutable cache policy. HTML has a short shared cache lifetime. API responses use `no-store`, and POST requests always reach the origin.

For a custom domain, run `railway domain your-domain.example --service web`, configure the returned DNS records, and verify the managed certificate. Don't put your API's private hostname into frontend build variables: the browser cannot resolve it. Caddy forwards the request inside the project.

## Baseline for production

Use health checks, monitor usage, set appropriate budget alerts, and keep private data non-cacheable. Store real form submissions or send them through a provider before displaying a delivery confirmation. Don't log submitted contact data. The supplied example deliberately says no message was stored or emailed.

## Verification notes

This repository is an instructional example, not a hosting latency benchmark. The current build-tool dependency tree has a reported picomatch ReDoS advisory with no patched latest release available during verification. It affects development/build tooling; the frontend runtime contains built files and Caddy, and the API has no dependencies. Don't expose the Vite development server publicly or build untrusted repositories. See the article workspace's verification record for the precise versions and test results.
