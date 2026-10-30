# Growth Log — pqhorizon.com

> **What this file is for:** an honest, append-only log of growth experiments
> on this site — what was tried, what was measured, what happened. The data
> source is GSC; this file narrates *why*. Future-you (or future-Claude)
> reads this when deciding what to try next, both on this site and on
> related sister sites.

## How to use this (workflow — re-read this when you forget)

**Add an entry whenever you do something growth-relevant.** That includes:
shipping new content, structural SEO changes (sitemap, schema, redirects,
internal linking), tech changes that affect crawl/indexing, marketing
pushes, backlink campaigns. *Not* every code commit — just things you'd
want to point at when GSC numbers move (or fail to).

**Each entry is a hypothesis you can be wrong about.** Commit to a
measurable KPI and an observation window before acting — otherwise "did
this work?" is just a feeling.

### Lifecycle of one entry

1. **Day of action** — append a new dated H2 with `Status: active`, the
   hypothesis, the KPI you'll watch, current baseline numbers, what you
   did, and the date to review (default: today + 28 days, matching GSC's
   reporting window).
2. **Review day** — pull current GSC numbers, compute delta vs baseline.
   Fill in **Result** and **Learning**. Set **Status** to `shipped` (worked,
   keep going), `failed` (didn't pay off, abandon), or extend the review
   another window if results are ambiguous.
3. **Never rewrite older entries.** Wrong hypotheses are the most valuable
   data — they tell you what NOT to repeat on the next site. Append, don't
   edit.

### Where to get the numbers

```bash
cd ~/work/projects/sites/portfolio && make run ARGS="gsc sync"
```

Then read the row for `pqhorizon.com`. Or pull from
https://search.google.com/search-console directly.

### Format

```
## YYYY-MM-DD — <one-line hypothesis or action>
- **Status:** active | testing | shipped | failed | abandoned
- **Hypothesis:** <what you're betting will work — only on initial / new-bet entries>
- **KPI:** <what GSC metric / query / page>
- **Baseline:** <numbers at start>
- **Action:** <what was done; 1-2 lines>
- **Result:** <numbers after window; "TBD — review YYYY-MM-DD" until then>
- **Learning:** <why it worked / didn't; what to try next; "TBD" until reviewed>
```

---

## 2026-06-30 — The Google 2029 deadline plus RFP/audit/insurance pressure hands…
- **Status:** active
- **Hypothesis:** The Google 2029 deadline plus RFP/audit/insurance pressure hands mid-market security teams a hard calendar date they can't defer, while incumbents (Keyfactor, IBM, QuSecure) price and sell exclusively to enterprise and federal — leaving the 50–500-employee segment unserved. A low-consent free TLS scan gets in the door where a six-figure platform can't; the compliance-grade roadmap closes the deal; continuous drift monitoring makes the $299/mo subscription recur past the first audit. Distribution through MSPs and consultants who already hold the relationship — not the scanning technology itself, which incumbents and clouds will eventually commoditize — is the durable moat. If mid-market RFPs aren't yet asking PQC questions at scale, healthcare's existing HIPAA-plus-retention pressure becomes the lead wedge instead.
- **KPI:** any GSC traffic — clicks, impressions, indexed-page count
- **Baseline:** 0 clicks / 0 impressions (just deployed)
- **Action:** project scaffolded via `portfolio new bootstrap`; first deploy pending. After deploy: verify in GSC as `sc-domain:pqhorizon.com` and submit the sitemap.
- **Result:** TBD — review 2026-07-28
- **Learning:** TBD

## 2026-10-30 — Review of 2026-06-30 launch entry + SEO hygiene pass (v1.B)
- **Status:** active
- **Hypothesis:** The two crawled-not-indexed guides were last crawled ~3mo ago, before the v1.A.3 content update (2026-09-22); a fresh crawl of the current content, plus complete head tags, gets them indexed. Not thin: both are 840–940 words with 5–7 internal inbound links each.
- **KPI:** indexed URLs (GSC coverage, top 10 inspected); impressions / clicks (28d)
- **Baseline:** 28 impressions · 0 clicks · avg position ~37 (28d) · 7/10 indexed (`/harvest-now-decrypt-later/` unknown to Google; `/nist-post-quantum-cryptography-standards/` and `/post-quantum-cryptography-for-security-questionnaires/` crawled-not-indexed). Review of the 2026-06-30 entry: site live and indexed, earning impressions but no clicks yet.
- **Action:** v1.B — added `<meta robots>`, `og:image`/`twitter:image`, GA4 (gated on `PUBLIC_GA_ID`), tsconfig; IndexNow ping and GSC "Request indexing" for the 3 non-indexed URLs after deploy.
- **Result:** TBD — review 2026-11-27
- **Learning:** TBD
