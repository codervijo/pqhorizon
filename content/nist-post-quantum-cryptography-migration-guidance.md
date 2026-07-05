---
title: "NIST Post-Quantum Migration Guidance: What It Actually Requires of You"
slug: nist-post-quantum-cryptography-migration-guidance
description: "What NIST's post-quantum migration guidance requires of you: cryptographic inventory, prioritization, crypto-agility, and the transition timeline."
target_keyword: nist post-quantum cryptography migration guidance
secondary_keywords:
  - nist pqc migration
  - what does nist require post-quantum
  - crypto migration standards
  - NIST IR 8547
search_intent: "Security lead needs to know what NIST's migration guidance obligates them to do and how to sequence it, not just what the algorithms are."
word_count: 800
last_updated: 2026-07-04
evergreen: true
---

# NIST Post-Quantum Migration Guidance: What It Actually Requires of You

You've probably gathered that NIST standardized new algorithms. The more useful question for someone running the migration is: **what does NIST expect me to actually do, and in what order?** This page translates NIST's migration guidance into obligations and a sequence you can plan against — without assuming you're a cryptographer.

Two things to hold separate. The **standards** (FIPS 203/204/205) define the algorithms; the **migration guidance** defines the process and the timeline. This page is about the second.

## The core requirement: know your cryptography first

Every strand of NIST's migration guidance starts in the same place — **you cannot migrate what you haven't inventoried.** NIST's National Cybersecurity Center of Excellence (NCCoE) ran a dedicated project, *Migration to Post-Quantum Cryptography* (NIST SP 1800-38) [SOURCE: NIST NCCoE SP 1800-38], and the first workstream is cryptographic discovery: automated tooling to find where public-key crypto lives across your systems, protocols, and data.

The practical obligation on you: produce a **cryptographic inventory** — every place you use RSA, ECDSA, ECDH, and Diffie-Hellman, across certificates, TLS/VPN/SSH, code signing, and data at rest. This is the artifact an auditor or customer actually asks to see, and it's the input to every later decision.

## The sequence NIST expects

NIST's guidance consistently frames migration as a phased program, not a switch:

1. **Discover / inventory** — find all uses of quantum-vulnerable public-key cryptography.
2. **Assess and prioritize** — rank by data sensitivity, confidentiality lifetime, and exposure. Long-retention confidential data comes first because of [harvest now, decrypt later](/harvest-now-decrypt-later/).
3. **Plan** — choose target algorithms (ML-KEM for key establishment, ML-DSA/SLH-DSA for signatures) and design for **crypto-agility** so you can change algorithms again later without re-architecting.
4. **Migrate** — deploy, favoring hybrids for key establishment so you retain classical security while adding quantum resistance.
5. **Validate and maintain** — confirm the change, keep the inventory current, monitor for drift.

The [migration checklist](/post-quantum-cryptography-migration-checklist/) turns this sequence into concrete tasks.

## Crypto-agility is an explicit expectation

NIST doesn't just want you on new algorithms once — it wants your systems built so algorithms can be *swapped again*. That's **crypto-agility**: cryptographic choices routed through central, configurable components rather than hard-coded throughout your code. The reasoning is practical — hybrids are an interim step, one PQC algorithm could later be deprecated, and you don't want another multi-year rewrite each time. Building agility now is part of doing the migration correctly, not a nice-to-have.

## The transition timeline

NIST has signaled a deprecation and disallowance schedule for classical public-key algorithms in draft guidance (NIST IR 8547, *Transition to Post-Quantum Cryptography Standards*) [SOURCE: NIST IR 8547 draft]. The direction is clear even where exact years are still being finalized: RSA and elliptic-curve algorithms are slated for **deprecation around 2030 and disallowance around 2035** [VERIFY: exact deprecation/disallowance years in the final IR 8547]. For U.S. national-security systems, the NSA's **CNSA 2.0** suite sets its own, generally earlier, adoption milestones [SOURCE: NSA CNSA 2.0] [VERIFY: exact CNSA 2.0 dates].

Why this matters even if you're not a federal contractor: these federal timelines become the *de facto* schedule for the private sector. They flow into vendor requirements, cyber-insurance expectations, and the PQC line items now appearing in commercial RFPs and [security questionnaires](/post-quantum-cryptography-for-security-questionnaires/). Your effective deadline is usually your customer's audit, and their audit is anchored to these dates.

## What "compliance" looks like in practice

There is no single "NIST PQC certified" stamp for an organization. Demonstrating alignment means being able to show:

- a current **cryptographic inventory** identifying quantum-vulnerable usage,
- a **prioritized migration plan** tied to data sensitivity and a timeline,
- **evidence of progress** — hybrids deployed on public endpoints, a crypto-agility posture, and monitoring in place.

That package is what turns "are you post-quantum ready?" from an unanswerable question into a documented yes-in-progress.

## Start with the step NIST puts first

Since the entire guidance rests on inventory, and inventory is where teams stall, start with the highest-signal slice: your public-facing TLS and certificates. It's internet-visible, it maps directly to the NIST standards, and it's the first thing a customer's security team will check themselves.

**[Run a free scan](/#scan)** to generate that slice automatically — your TLS and certificate posture, each finding tied to the NIST standard it maps to. It's step one of the NIST-prescribed sequence, done in under a minute, and a defensible foundation for the rest of your plan.

---

*Related: [NIST post-quantum standards](/nist-post-quantum-cryptography-standards/) · [Migration checklist](/post-quantum-cryptography-migration-checklist/) · [Post-quantum readiness self-check](/post-quantum-readiness/)*
