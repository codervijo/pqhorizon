---
title: "How to Answer Post-Quantum Cryptography Questions in Security Questionnaires and RFPs"
slug: post-quantum-cryptography-for-security-questionnaires
description: "How to answer post-quantum cryptography questions in security questionnaires and RFPs: what they ask, a response template, and the evidence to back it."
target_keyword: post-quantum cryptography for security questionnaires
secondary_keywords:
  - post-quantum RFP requirement
  - PQC vendor questionnaire
  - answer quantum readiness questionnaire
  - PQC compliance response
search_intent: "A security lead just received a PQC line item on a questionnaire or RFP they can't answer and needs to respond credibly, fast."
word_count: 800
last_updated: 2026-07-04
evergreen: true
---

# How to Answer the Post-Quantum Question on a Security Questionnaire or RFP

You got a vendor security questionnaire or an RFP, and there's a line about post-quantum cryptography, quantum readiness, or crypto-agility that you can't answer. A deal or a renewal may be riding on it. This page is the fast, credible way to respond — what the question is really asking, what a strong answer looks like, and how to produce the evidence behind it before your deadline.

Take the pressure down first: **nobody expects you to be finished migrating.** These questions test whether you *understand your exposure and have a plan* — not whether you've replaced all your cryptography. A concrete "here's our inventory and roadmap" beats a vague "yes, we're secure" every time.

## What the question is actually asking

PQC questionnaire items come in a few recognizable shapes:

- *"Do you have an inventory of your cryptographic assets / algorithms in use?"* — Testing for a **cryptographic inventory.** This is the real gate; most other answers depend on it.
- *"What is your plan to migrate to NIST post-quantum standards?"* — Testing for a **roadmap** aligned to FIPS 203/204/205.
- *"Do you support crypto-agility?"* — Testing whether you can change algorithms without re-architecting.
- *"How do you protect against harvest-now-decrypt-later?"* — Testing whether you grasp that long-retention data is exposed today and are protecting data in transit.
- *"Do you use quantum-vulnerable algorithms (RSA, ECC)?"* — Testing honesty and awareness; the right answer is a truthful current state plus the plan.

The through-line: they want evidence of **awareness, inventory, and a dated plan.** Bluffing "we're fully quantum-safe" is both false and a red flag to a knowledgeable reviewer.

## What a strong answer looks like

A credible response has three parts. Adapt this structure:

> **Current state.** "We have completed a cryptographic inventory of our public-facing and internal systems. Our TLS, certificates, and key exchange currently use industry-standard algorithms (TLS 1.3 with ECDHE; RSA/ECDSA certificates), which we recognize as quantum-vulnerable."
>
> **Direction.** "We are migrating to NIST-standardized post-quantum algorithms — ML-KEM (FIPS 203) for key establishment and ML-DSA (FIPS 204) for signatures — following NIST's phased migration guidance, beginning with hybrid post-quantum key exchange on public endpoints."
>
> **Timeline and posture.** "Our roadmap prioritizes long-retention confidential data against harvest-now-decrypt-later risk, we maintain a crypto-agile architecture to enable algorithm changes, and we monitor our public cryptographic posture continuously. Inventory and roadmap available on request under NDA."

That answer is honest, demonstrably informed, and reads as *in control*. It converts a weakness into evidence of maturity.

## The evidence you need behind it

Every strong answer above is backed by two artifacts:

1. **A cryptographic inventory** — where you use public-key crypto and which of it is quantum-vulnerable. This is what a reviewer may ask to see, and it's the foundation NIST's guidance puts first (see [NIST migration guidance](/nist-post-quantum-cryptography-migration-guidance/)).
2. **A prioritized migration roadmap** — ordered by data sensitivity and exposure, tied to a timeline. Build it from the [migration checklist](/post-quantum-cryptography-migration-checklist/).

If you have these two documents, you can answer *any* PQC questionnaire item, because every question is really "show me your inventory and your plan."

## If the deadline is this week

You can produce a defensible first artifact today. Start with your public-facing TLS and certificates — it's the slice a reviewer can independently verify (they may run the same check on you), so it's the highest-credibility place to begin.

**[Get a defensible inventory before your deadline — run a free scan](/#scan).** PQHorizon inspects your public TLS and certificate posture, flags quantum-vulnerable algorithms and any harvest-now-decrypt-later exposure, and maps each finding to the relevant NIST standard. You get an export you can attach to the questionnaire response as evidence of the current-state assessment — turning an unanswerable line item into a documented, in-progress answer in minutes.

## Turn the questionnaire into an advantage

Handled well, a PQC questionnaire item is a chance to look *more* mature than competitors who wrote "N/A" or bluffed. A vendor that can produce a cryptographic inventory and a NIST-aligned roadmap on request signals exactly the operational discipline enterprise procurement is screening for.

**[Run a free scan](/#scan)** to build the evidence, then use the answer template above. When you're ready to cover your full footprint — not just public TLS — the same engine produces the complete inventory and roadmap.

---

*Related: [Post-quantum readiness self-check](/post-quantum-readiness/) · [Migration checklist](/post-quantum-cryptography-migration-checklist/) · [NIST post-quantum standards](/nist-post-quantum-cryptography-standards/) · [Harvest now, decrypt later](/harvest-now-decrypt-later/)*
