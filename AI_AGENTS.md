# AI Agent Context — pqhorizon.com

## Summary

*one paragraph: what this site is, what it does*

PQHorizon is a post-quantum cryptography readiness scanner that maps an organization's full cryptographic footprint — certificates, TLS configurations, key algorithms, and vulnerable dependencies — against NIST migration standards in a single scan. It surfaces quantum-vulnerable RSA and classical ECDSA/ECDH, flags harvest-now-decrypt-later exposure (data an adversary records today to decrypt once quantum hardware matures), and turns findings into a prioritized, deadline-anchored migration roadmap. Built for teams too small for a six-figure PKI platform but too exposed to wait for the 2029 readiness deadline.

## Audience

*one sentence: who this is for (broad demographic)*

Security and IT leaders at 50–500-employee companies who need a defensible cryptographic inventory before a compliance deadline, without hiring a dedicated crypto or PKI specialist.

## ICP

*the specific ideal customer — demographics, pain points, what they use today. More detail than Audience: Audience is the broad demo ("homeowners with EV chargers"), ICP is the specific targetable subset ("Tesla owners in CA who installed in last 90d, paid $2k+")*

The sharpest fit is a mid-market company selling into regulated enterprises or government supply chains that is starting to see PQC or quantum-readiness questions in RFPs, vendor security questionnaires, or compliance reviews — a company that can't answer "show us your cryptographic inventory" and is about to lose or delay a deal. Adjacent rings: sub-enterprise healthcare orgs handling PHI with long retention windows (where harvest-now-decrypt-later is a real HIPAA-adjacent risk), and defense/aerospace subcontractors pursuing CMMC 2.0 Level 3. The common thread is an external, dated forcing function and no in-house crypto expertise. The economic buyer is a CISO or head of security/IT — often the only security leader on staff — who personally owns audit and questionnaire responses.

## Goals

*1-2 sentences: primary business / product goal*

Convert the free public-TLS scan into paid full-footprint scans and recurring drift monitoring, landing five anchor pilots across finance, healthcare, and manufacturing. Establish MSPs and security consultants as the primary distribution channel into the underserved mid-market tier.

## Tech stack

Astro project under the sites/* workspace. Build path goes
through the parent `sites/Makefile` (Docker-orchestrated) which delegates
per-stack work to the central builder at `~/work/projects/builder/`.

## Project structure

- `src/` — application source
- `public/` — static assets copied to `dist/` at build (favicons, OG images, `_headers`)
- `docs/` — PRD, Prompts log
- `Makefile` — thin forwarder to `../Makefile`
- `wrangler.jsonc` — Cloudflare deploy config
- `scripts/` *(if present)* — ingester or build-time helpers

## Building info

All dev work runs inside the parent `sites1` docker container. The host doesn't
need Node/pnpm installed; the container does. The parent `Makefile`
(`../Makefile` from this dir) is the canonical entry point.

### Why docker

- Pinned Node + pnpm versions match Cloudflare's build env.
- Avoids polluting the host with per-project node_modules.
- Same image serves every sibling project under sites/.

### Common Makefile targets

This project's local `Makefile` forwards every target to `../Makefile` with
`proj=pqhorizon.com`, so these all work either from this dir or from `sites/`:

| Command | What it does |
|---|---|
| `make buildsh` *(from `sites/`)* | Drop into a bash shell inside the docker container at `/usr/src/app` (= `sites/` mounted in). |
| `make run` *(from here)* / `make run proj=pqhorizon.com` *(from `sites/`)* | `pnpm install` then start dev server (auto-detected). |
| `make check-vite proj=pqhorizon.com` | Start the dev server, skipping install. |
| `make test proj=pqhorizon.com` | `pnpm install` + `pnpm build` + `pnpm test`. **Hard-fails outside docker** — `make buildsh` first, or `docker exec`. |
| `make deps` | Install pnpm globally (image bootstrap). |
| `make clean` *(from `sites/`)* | Remove root `package.json`, lockfile, node_modules. Don't run inside a project dir. |

### Running Make targets from a Claude Code session

The Bash tool runs on the host as `vijo`, not inside docker. To execute a
target inside the container, find the running container and `docker exec` in:

```bash
docker ps                                               # find the sites1 container name
docker exec -w /usr/src/app <name> make test proj=pqhorizon.com
```

## Deployment info

- **Platform:** Cloudflare Workers (Static Assets) — *not* Vercel.
- **Config:** `wrangler.jsonc` at the repo root — points `assets.directory` at `./dist` and uses `not_found_handling: "single-page-application"` for SPA client-side routing.
- **Headers:** `public/_headers` — cache (`/assets/*` immutable, HTML no-cache) + security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`). Vite copies `public/` into `dist/` at build, so the file ships with the assets.
- **Build:** `pnpm build` → `dist/`. Wrangler picks up `dist/` via `wrangler.jsonc`.
- **Deploy:** `wrangler deploy` (locally) or via Cloudflare's Git integration on push.
  Initial GitHub repo + CF Pages project setup is automated by the portfolio CLI:
  `cd ../portfolio && make run ARGS="deploy pqhorizon.com"` runs `gh repo create` and
  POSTs to the CF Pages API with `build_command="pnpm run build"` set explicitly
  (avoids the bun-detection trap kwizicle.com hit). Idempotent; safe to re-run.
- **Vite version:** must be ≥ 6.0.0 — Wrangler's Vite integration rejects Vite 5.
- **Env vars:** set `VITE_*` vars (e.g. `VITE_GA_ID`) in the Cloudflare Workers project's environment-variable settings — they're inlined at build time.
- **Live URL:** https://pqhorizon.com/  *(update once first deploy succeeds)*
- **Canonical host:** the **apex** (`https://pqhorizon.com/`) is the ONLY canonical host fleet-wide — `www` and `http` must 308→apex, and there is no `www`-canonical option. Set Astro's `site: "https://pqhorizon.com"` (apex, never `www`) so every `<link rel="canonical">` and the generated sitemap `<loc>` URLs use the apex. Enforced by CHECK_150 (redirect) + CHECK_158 (canonical tags) + CHECK_159 (sitemap) + CHECK_160 (GSC-registered sitemap).
- **Legacy:** if a `vercel.json` or `.vercelignore` is present from a Lovable export, it's inert on Cloudflare and safe to delete.

## Content strategy

*what content this site needs — page types, initial topics, format mix (long-form vs reference vs tool)*

Lead with the forcing function, not the technology. Publish practical, deadline-framed material a security lead can act on: how to answer the PQC line item on a security questionnaire, what NIST's migration standards actually require, how to read your own TLS handshake for quantum exposure, and what harvest-now-decrypt-later means for data you're retaining today. Anchor everything to the Google 2029 date and concrete compliance triggers (SOC 2, HIPAA, CMMC). Pair the free scan preview as the top-of-funnel hook — a real, honest public-TLS check that demonstrates value before any sales conversation — with a 70/15/15 split across educational content, keyword/PSEO pages targeting compliance-trigger searches, and interactive tools. Arm channel partners (consultants running PQC webinars) with the same content as co-branded lead material.

### Post-deploy checklist (do these once after the first successful deploy)

- [ ] Verify in **Google Search Console** at https://search.google.com/search-console — add as `sc-domain:pqhorizon.com` property; verify via DNS TXT record. Until this is done, no SEO traffic data is observable for this site (and the workspace-wide `30 commercial sites with traffic` goal can't credit it).
- [ ] Submit the sitemap (`https://pqhorizon.com/sitemap-index.xml` — the apex host; `@astrojs/sitemap` emits `-index`, not `/sitemap.xml`) inside GSC. *(The deploy pipeline auto-submits the robots.txt-declared sitemap; this is the manual fallback.)*
- [ ] Update the **Live URL** above with the actual deploy URL.
- [ ] Run `make run ARGS="cleanup"` from `sites/portfolio/` so `data/portfolio.json` reflects the new project's state (and `project status pqhorizon.com` resolves cleanly).

## How to run

```bash
# from this dir, after `make buildsh` from sites/:
make deps      # → pnpm install via the central builder
make run       # → dev server
make build     # → dist/
make test      # → pnpm install + build + test (must be inside container)
```

## How this project is checked

This project is enforced against shared sites/* conventions by
`portfolio project check pqhorizon.com` (run from `sites/portfolio/`).
Conformance is driven by the universal check catalog (CHECK_*) —
e.g. CHECK_020 (own-git-repo), CHECK_002 (has-ai-agents-md),
CHECK_007 (has-docs-prompts), CHECK_008 (has-docs-growth — `docs/growth.md`
exists — the per-project growth-experiment log; see Growth log section
below), CHECK_001 (has-readme), CHECK_009 (has-gitignore), CHECK_035
(vite-version-ok), CHECK_003 / CHECK_004 (AI_AGENTS.md `## Building info` +
`## Deployment info` headings). See the full catalog with
`portfolio check catalog`. The bootstrap output satisfies all of these on
day zero — keep it that way.

If `project check` flags a regression, fix it. v6.C's `portfolio project fix`
will eventually auto-fix; until then, hand-edit.

## Growth log — per-project experiment tracker

`docs/growth.md` is this project's append-only log of growth experiments
(content, SEO, marketing, structural changes). Each entry is a dated H2
with a measurable hypothesis + KPI + observation window (default 28d).
Read **the full workflow inside `docs/growth.md`** — it's self-sustaining
so you don't have to remember the lifecycle from outside the file.

Update it whenever you do something growth-relevant on this site. The
data source is GSC (`portfolio gsc sync` from the portfolio dir); this
file narrates *why*.

## Strategy reminder — ship fast, let the market decide

This sites/* workspace is shipping commercial sites toward a
**30-site SEO-traffic goal**. The convention is **build & ship fast,
then let GSC data drive what to invest more in.** Don't over-polish
before launch. Get a minimum-viable version live, indexed, then
iterate on whichever sites actually attract traffic.

Translation for this project: prefer shipping over perfection. The
SEO baseline files (`public/robots.txt`, `public/sitemap.xml`),
deploy config, and dev tooling (`vitest`) are pre-scaffolded so you
can ship today.

## Versioning

This project follows the sites/* **canonical versioning convention** (defined
in `sites/portfolio/AI_AGENTS.md`):

- **`vN`** — major capability tier. Each is a coherent shipped capability and
  may break compat with the previous tier. SemVer-MAJOR semantics.
- **`vN.X`** — phase letter within a tier (A / B / C / …). Internal slicing of
  build work; signals "order/scope can shift." Each phase still ships
  independently.
- **`vN.X.Y`** — numeric sub-phase for follow-up work that lands AFTER `vN.X`
  shipped (e.g. polish, bug fixes, scope cuts).

Two-layer notation separates **external version** (what consumers see) from
**internal phasing** (how the team slices work). Letters signal *un-promised* —
nobody mistakes `v1.B` for a SemVer minor release.

**Always use this numbering when planning or shipping work on this project.**
Specifically:

- Every entry in `docs/prd.md`'s phases table uses `vN.X` (or `vN.X.Y`).
- Every commit message that ships a phase mentions its version (e.g.
  `v1.B — auth flow`).
- Every entry in `docs/Prompts.md` references the version of the work it
  describes when relevant.

Don't introduce a parallel scheme (no `0.1.0` / `Sprint 3` / etc.). When in
doubt, the canonical statement is `sites/portfolio/AI_AGENTS.md`.

Track this project's progress in `docs/prd.md` against this taxonomy. v0.A is
the bootstrap (this scaffold); v1.A is the first real shipped capability.

## Conventions

- Stack: astro
- **Package manager: pnpm only.** No `bun.lockb`, no `package-lock.json`, no `yarn.lock` — they cause CF Pages to pick the wrong manager and break the build. The `pnpm-lock.yaml` is the only lockfile that should ever be committed.
- Build path: this project's `Makefile` → `../Makefile` → `~/work/projects/builder/`
- Cloudflare deploy constraints: Vite ≥ 6, frozen-lockfile install, no `_redirects` SPA fallback (handled by `wrangler.jsonc`'s `not_found_handling` instead).
- **Versioning**: two-level `vN` / `vN.X` — see Versioning section above and `sites/portfolio/AI_AGENTS.md` for the canonical statement.

## Out of scope / don't touch

- *(leave blank — fill in when something is)*
