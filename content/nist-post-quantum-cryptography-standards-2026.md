---
title: "NIST Post-Quantum Cryptography Standards: 2026 Status and Timeline"
slug: nist-post-quantum-cryptography-standards-2026
description: "The 2026 status of NIST's post-quantum standards (FIPS 203/204/205) and the migration timeline dates that set your deadline."
target_keyword: nist post-quantum cryptography standards 2026
secondary_keywords:
  - pqc standards status 2026
  - nist post-quantum timeline
  - FIPS 203 204 205 status
search_intent: "Reader wants the current (2026) status of NIST's post-quantum standards and the migration timeline dates."
word_count: 630
last_updated: 2026-09-22
evergreen: false
---

# NIST Post-Quantum Cryptography Standards: 2026 Status and Timeline

**Time-sensitive — current as of July 2026.** This page tracks where NIST's post-quantum standards stand right now and the migration dates that matter. For the plain-terms explanation of what each standard *does* (which doesn't change year to year), see the evergreen [NIST post-quantum cryptography standards](/nist-post-quantum-cryptography-standards/).

## Where the standards stand in 2026

The three core standards have been final since August 2024 and remain the stable targets to plan around:

- **FIPS 203 — ML-KEM** (key establishment). Final. This is the one already deployed in the wild via hybrid TLS key exchange.
- **FIPS 204 — ML-DSA** (primary signatures). Final.
- **FIPS 205 — SLH-DSA** (hash-based signatures). Final.

Still forthcoming:

- **FIPS 206 — FN-DSA** (FALCON, compact lattice signatures). Selected but not yet published as a final standard; as of September 2026, NIST's [standardization page](https://csrc.nist.gov/projects/post-quantum-cryptography/post-quantum-cryptography-standardization) still lists it as in development.
- **Additional signature schemes.** NIST's "on-ramp" process to diversify signature options beyond lattices is ongoing: [nine candidates advanced to a third round](https://www.nist.gov/news-events/news/2026/05/nine-candidates-advance-third-round-additional-digital-signatures-pqc) in May 2026, a phase NIST expects to last about two years. One of them, HAWK, has since been [withdrawn by its submission team](https://csrc.nist.gov/projects/pqc-dig-sig/round-3-additional-signatures).
- **HQC** was selected in 2025 as a backup key-establishment mechanism based on different (code-based) math than ML-KEM, to hedge against a lattice weakness; its standard is in development. At [selection](https://www.nist.gov/news-events/news/2025/03/nist-selects-hqc-fifth-algorithm-post-quantum-encryption), NIST said it planned a draft standard for public comment in about a year and a finalized standard in 2027.

The headline for planning: **the algorithms you migrate to today (ML-KEM, ML-DSA) are settled.** The forthcoming items are additions and hedges, not replacements — they're no reason to wait.

## The timeline that drives your deadline

The migration schedule, not the algorithm list, is what sets your urgency:

- **2030 — deprecation** of RSA and elliptic-curve algorithms at the 112-bit security level (such as RSA-2048), per NIST's draft transition guidance ([IR 8547](https://csrc.nist.gov/pubs/ir/8547/ipd), initial public draft, November 2024; not yet final).
- **2035 — disallowance** of all quantum-vulnerable RSA, elliptic-curve, and Diffie-Hellman algorithms under the same draft.
- **2029 — Google's migration timeline.** In March 2026, Google [announced](https://blog.google/innovation-and-ai/technology/safety-security/cryptography-migration-timeline/) it is "setting a timeline for post-quantum cryptography migration to 2029." Because so much traffic flows through Google's ecosystem, this date functions as a de-facto readiness anchor for the wider web.
- **CNSA 2.0 milestones** for U.S. national-security systems run on their own, earlier schedule ([NSA CNSA 2.0 advisory](https://media.defense.gov/2025/May/30/2003728741/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS.PDF)): new acquisitions must be compliant from January 1, 2027; software/firmware signing and networking equipment must use CNSA 2.0 exclusively by 2030; web browsers/servers, cloud services, and operating systems by 2033.

For a mid-market organization, the operative deadline usually isn't any of these directly — it's your customer's next audit or RFP, which inherits them. Those PQC line items are landing in [security questionnaires](/post-quantum-cryptography-for-security-questionnaires/) now, well ahead of 2030.

## What's actually deployed in 2026

Beyond the paperwork, post-quantum key exchange is live in production today: major browsers negotiate the `X25519MLKEM768` hybrid by default, and major CDNs offer it at the edge (see [TLS 1.3 post-quantum](/tls-1-3-post-quantum/)). If your public endpoints still negotiate classical-only key exchange in 2026, you're already behind the deployed baseline — and exposed to [harvest now, decrypt later](/harvest-now-decrypt-later/).

## What to do with this in 2026

The 2026 status doesn't change the playbook, it sharpens the urgency: the standards are final, the tooling is shipping, and the clock to 2030 is running. Inventory first, migrate key establishment first via hybrids, then signatures — the sequence in the [NIST migration guidance](/nist-post-quantum-cryptography-migration-guidance/).

**[Run a free scan](/#scan)** to see where your public TLS and certificates stand against the 2026 baseline — each finding mapped to the NIST standard that addresses it. It's the fastest way to know whether you're keeping pace or falling behind the deployed state of the art.

---

*Last updated: 2026-09-22. Dates and standardization statuses checked against primary NIST, NSA, and Google sources on that date.*

*Related: [NIST post-quantum standards](/nist-post-quantum-cryptography-standards/) · [NIST migration guidance](/nist-post-quantum-cryptography-migration-guidance/) · [Post-quantum readiness self-check](/post-quantum-readiness/)*
