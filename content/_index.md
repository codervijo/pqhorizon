---
title: "Content Cluster Index — Batch 1"
description: "Cluster map for the PQHorizon PQC content batch 1: target keywords, KD, intent, internal-link map, evergreen flags."
last_updated: 2026-07-04
---

# PQHorizon Content Cluster — Batch 1

Nine pages, one topical cluster, all routing to the free public-TLS scan (`/#scan`).
Strategy: rank on low keyword difficulty now, age into value as PQC search volume
climbs toward the 2029/2030 deadlines. Every page targets the **mid-market security
buyer** (50–500 employees, compliance forcing function, no in-house cryptographer) —
never a crypto/token/web3 audience.

The pillar term **"post-quantum cryptography"** (KD ~67) is used only as an internal-link
anchor, never as a ranking target. "What is the purpose of post-quantum cryptography"
is the closest thing to a definitional pillar page in this batch.

## Page table

| # | Slug / file | Target keyword | KD | Intent | Tier | Evergreen |
|---|---|---|---|---|---|---|
| 1 | `post-quantum-readiness` | post-quantum readiness | 16 | Am I exposed / where do I start | Priority | ✅ |
| 2 | `post-quantum-cryptography-migration-checklist` | post-quantum cryptography migration checklist | [VERIFY] | Actionable NIST-aligned checklist | Priority | ✅ |
| 3 | `tls-1-3-post-quantum` | tls 1.3 post quantum | [VERIFY] | How PQ key exchange works / check mine | Priority | ✅ |
| 4 | `what-is-the-purpose-of-post-quantum-cryptography` | what is the purpose of post-quantum cryptography | 12 | Top-of-funnel definitional | Priority | ✅ |
| 5 | `nist-post-quantum-cryptography-standards` | nist post-quantum cryptography standards | [VERIFY] | What are FIPS 203/204/205 | Evergreen | ✅ |
| 6 | `nist-post-quantum-cryptography-migration-guidance` | nist post-quantum cryptography migration guidance | [VERIFY] | What NIST requires of me | Evergreen | ✅ |
| 7 | `harvest-now-decrypt-later` | harvest now decrypt later | [VERIFY] | Which of my data is at risk today | Evergreen | ✅ |
| 8 | `post-quantum-cryptography-for-security-questionnaires` | post-quantum cryptography for security questionnaires | [VERIFY] | Answer a PQC RFP/questionnaire item | Evergreen | ✅ |
| 9 | `nist-post-quantum-cryptography-standards-2026` | nist post-quantum cryptography standards 2026 | [VERIFY] | Current status/timeline | Dated | ❌ |

> KD values: only #1 (16), #4 (12) were supplied in the brief. Fill the rest from your
> keyword tool before publishing; all were chosen for expected low difficulty.

## Internal-link map

Every page links to the free scan (`/#scan`) plus 2–3 siblings. Arrows = outbound links.

```
1 post-quantum-readiness ──────────► 2 checklist, 3 tls, 7 harvest
2 migration-checklist ─────────────► 1 readiness, 6 nist-guidance, 3 tls
3 tls-1-3-post-quantum ────────────► 1 readiness, 5 nist-standards, 2 checklist
4 what-is-the-purpose ─────────────► 5 nist-standards, 7 harvest, 1 readiness
5 nist-standards ──────────────────► 6 nist-guidance, 9 standards-2026, 4 purpose, 3 tls
6 nist-migration-guidance ─────────► 5 nist-standards, 2 checklist, 1 readiness
7 harvest-now-decrypt-later ───────► 1 readiness, 3 tls, 8 questionnaires
8 questionnaires-rfps ─────────────► 1 readiness, 2 checklist, 5 nist-standards, 7 harvest
9 nist-standards-2026 ─────────────► 5 nist-standards, 6 nist-guidance, 1 readiness
```

**Inbound-link count (topical authority signal):**
- #1 readiness — 6 inbound (cluster hub)
- #3 tls — 4 · #5 nist-standards — 4 · #7 harvest — 4
- #2 checklist — 3 · #6 nist-guidance — 3
- #4 purpose — 2 · #8 questionnaires — 2 · #9 2026 — 1

#1 (post-quantum-readiness) is the de-facto hub — most inbound links and the primary
"where do I start" conversion page. #3, #5, #7 are strong secondary hubs.

## Conversion routing

| Page intent | CTA framing |
|---|---|
| Readiness / purpose / checklist / TLS / standards | "Run a free scan" (see your exposure) |
| Harvest-now-decrypt-later | "Find your open HNDL surface" |
| Security questionnaires / RFPs | "Get a defensible inventory before your deadline" |

All CTAs deep-link to `/#scan` (the landing-page scan section, anchored `id="scan"`).

## Source/verify markers to wire up before publish

Grep the batch for `[SOURCE: ...]` and `[VERIFY: ...]`:

- `[SOURCE: NIST FIPS 203/204/205]` — link to the three published FIPS.
- `[SOURCE: NIST IR 8547 draft]` — transition guidance; confirm final deprecation (~2030) / disallowance (~2035) years.
- `[SOURCE: NIST NCCoE SP 1800-38]` — Migration to PQC practice guide.
- `[SOURCE: Google post-quantum roadmap]` + `[VERIFY: 2029 date]` — confirm exact wording/date.
- `[SOURCE: NSA CNSA 2.0]` — confirm current milestone dates.
- `[SOURCE: NIST HQC selection]`, on-ramp signature status, FIPS 206 / FN-DSA status — confirm as of publish date (esp. the dated #9 page).

## Publishing notes

- These are Markdown *source* files in `./content/`. The Astro site does not yet have a
  content collection wired — routing/rendering these into `/slug/` pages is a follow-up
  build step (define a `src/content/` collection + a `[...slug].astro` route, or port
  into the existing page structure).
- Slugs are the intended final URL paths; internal links use `/slug/` form.
- Re-check the dated page (#9) status markers on a cadence; flip `evergreen: false` pages
  for review each quarter.
