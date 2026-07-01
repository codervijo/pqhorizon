# Server code — dropped during Astro port

The source (`genai/`) was a **TanStack Start** app (SSR + server routes). Astro
here is configured for **static output** (`output: 'static'` in
`astro.config.mjs`), so the framework-specific server code below does NOT
translate. It was intentionally left behind. The client UI still calls these
endpoints (`fetch("/api/scan")` / `fetch("/api/lead")` in
`src/components/LandingPage.tsx`) — those calls will 404 until the endpoints are
reimplemented on whatever backend/serverless target you deploy to.

## Dropped files (reference only, under `genai/`)

- `genai/src/server.ts` — TanStack Start SSR error-wrapper entry.
- `genai/src/start.ts` — TanStack Start bootstrap.
- `genai/src/router.tsx` — TanStack Router + React Query client setup.
- `genai/src/routeTree.gen.ts` — generated route tree.
- `genai/src/routes/__root.tsx` — root shell (head/meta ported to
  `src/layouts/Layout.astro` and `src/pages/index.astro`; 404 ported to
  `src/pages/404.astro`).

### API route handlers (server-only — need a backend to re-home)

- `genai/src/routes/api/scan.ts` — **POST `/api/scan`**. Performs a live TLS
  handshake (`node:tls`) against a submitted domain, parses the X.509 chain
  (`node:crypto`), inspects negotiated key-exchange groups for PQ-hybrid
  support, and returns a `ScanResult` (findings mapped to NIST FIPS 203/204).
  `TODO:` reimplement as a serverless function / edge worker. Requires raw TLS
  socket access — not available in a purely static deploy.
  - The `Severity` / `Finding` / `ScanResult` types were inlined into
    `src/components/LandingPage.tsx` so the UI still type-checks.

- `genai/src/routes/api/lead.ts` — **POST `/api/lead`**. Lead-capture handler
  (email / company / timeline). `TODO:` re-home to a form backend or serverless
  function + datastore.

## Lovable error reporting (dropped)

- `genai/src/lib/lovable-error-reporting.ts`
- `genai/src/lib/error-capture.ts`
- `genai/src/lib/error-page.ts`

These were TanStack/Lovable-runtime error boundaries. Astro has its own error
handling; not ported.
