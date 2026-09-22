---
project: pqhorizon.com
prd_version: 1
project_version: v1.A.3
status: planned
owner: Vijo
last_updated: 2026-09-22
---

# pqhorizon.com — PRD

## 1. Problem

<1-2 sentence problem statement — fill in: what user-facing problem
does this site solve? Who has it? Why does it matter?>

## 2. Users

<who uses this — target user, what they care about, rough audience size>

## 3. Goals & non-goals

**Goals:**
- <fill in>

**Non-goals:**
- <fill in>

## 4. Versions

Two-level versioning convention (canonical: `sites/portfolio/AI_AGENTS.md`):

- `vN` = major capability tier; SemVer-MAJOR semantics.
- `vN.X` = phase letter within a tier; internal slicing.

| Version | Theme | Acceptance |
|---|---|---|
| v0 | scaffold | local builds, CF wrangler.jsonc + public/_headers in place, repo initialized |
| v1 | <fill in: first real shipped capability> | <fill in: what users get> |

## 5. Phases

| Phase | Theme | Features | Status |
|---|---|---|---|
| **v0.A** | scaffolded | `portfolio new bootstrap` ran; standard files written; git initialized | ✅ |
| **v1.A** | PQC SEO content cluster (batch 1) | 9 Markdown guides in `content/` rendered as static crawlable pages (`[...slug].astro`), Article + Breadcrumb JSON-LD, footer guide nav | ✅ |
| **v1.A.1** | sitemap lastmod | per-page `<lastmod>` from content frontmatter | ✅ |
| **v1.A.2** | CNSA 2.0 deadline fix | removed false "2029 CNSA 2.0" claim; hero stat → 2027 NSS acquisition gate; meta descriptions updated | ✅ (not yet deployed) |
| **v1.A.3** | content source fill | all `[SOURCE]`/`[VERIFY]` markers replaced with primary-source facts + links | ✅ (not yet deployed) |
| **v1.B** | re-home scan + lead backends | (1) `POST /api/scan` — live TLS handshake, X.509 chain parse, PQ-hybrid group check, `ScanResult` for the free-scan UI (runtime TBD: needs raw TLS introspection, which a static deploy can't do); (2) `POST /api/lead` — lead capture (email / company / timeline) to a form backend + datastore. Both currently 405 on live since the Astro port; see `src/lib/server-todo.md` | planned |

## 6. Open questions

- *(append-only log; mark answered with date but never delete)*
