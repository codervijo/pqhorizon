---
title: "How to Answer PQC Questions on Security Questionnaires"
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
last_updated: 2026-10-30
evergreen: true
faq:
  - q: "What is crypto agility?"
    a: "NIST defines cryptographic agility as the capabilities needed to replace and adapt cryptographic algorithms in protocols, applications, software, hardware, firmware and infrastructure while preserving security and ongoing operations (NIST CSWP 39). On a questionnaire it means you can change algorithms through configuration or a library upgrade, not a re-architecture."
  - q: "What is a cryptographic inventory?"
    a: "A record of where your systems use cryptography, which algorithms and key sizes they use, and which of those are quantum-vulnerable. NIST IR 8547 tells organizations to begin the post-quantum migration with cryptographic inventories, which is why reviewers ask for one first."
  - q: "Is RSA quantum safe?"
    a: "No. Shor's algorithm breaks RSA at any key size on a large enough quantum computer. NIST IR 8547 deprecates RSA after 2030 and disallows it under NIST standards after 2035, so the honest questionnaire answer is that you use it today and have a dated plan to replace it."
  - q: "What is the NIST deadline for post-quantum cryptography?"
    a: "NIST IR 8547 (final, October 2026) deprecates quantum-vulnerable public-key algorithms after 2030 and disallows them after 2035. Federal high-value and high-impact systems face earlier dates under OMB M-26-15: post-quantum key establishment by December 31, 2030 and post-quantum signatures by December 31, 2031."
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

## Three worked answers

The phrasings below are representative of how these items are worded. They are not quoted from any specific questionnaire framework.

**"Do you maintain an inventory of the cryptographic algorithms used in your products and services?"**
Situation (hypothetical): you've checked the TLS handshake on all 14 of your public domains, but nothing internal yet.
Answer: "Yes, partially. We have documented the key-exchange group, TLS version and certificate algorithm for all 14 internet-facing domains. Eleven negotiate hybrid post-quantum key exchange (X25519MLKEM768); three are classical-only and scheduled for remediation. Internal systems are being inventoried next, starting with VPN and service-to-service TLS."
Why it works: a partial inventory with real numbers and a stated next step beats an unqualified "yes." It's also verifiable, because a reviewer can run the same handshake check against your domains.

**The failure case — "Are you prepared for the threat that quantum computing poses to encryption?"**
Weak answer: "Yes. All traffic uses TLS 1.3 and data is encrypted with AES-256."
Why it fails: neither fact answers the question. TLS 1.3 is only post-quantum when the handshake negotiates a hybrid group such as `X25519MLKEM768` ([RFC 10024](https://datatracker.ietf.org/doc/rfc10024/)). Plain X25519 over TLS 1.3 is still classical, and a reviewer who checks your handshake will see it. AES-256 isn't the weak point. [NIST's FAQ](https://csrc.nist.gov/projects/post-quantum-cryptography/faqs) considers AES-128, -192 and -256 safe. The exposure is the RSA or elliptic-curve key exchange that delivered the AES key.
Better answer: say which endpoints negotiate hybrid key exchange, which don't, and when the rest will.

**"What is your timeline for adopting NIST post-quantum standards?"**
Answer: anchor your dates to the published schedule rather than inventing your own. "Our roadmap follows NIST IR 8547, which deprecates quantum-vulnerable algorithms after 2030 and disallows them after 2035. Hybrid ML-KEM key exchange on public endpoints by (your committed date); internal service-to-service TLS by (date); certificate and signing migration to ML-DSA as our CA and HSM vendors support it."
Why it works: the reviewer can check the external anchor, which is [NIST IR 8547](https://doi.org/10.6028/NIST.IR.8547). The internal dates are ones you control, and the order (key exchange first, signatures later) matches NIST's reasoning that harvest-now-decrypt-later threatens key exchange, not signatures.

## The evidence you need behind it

Every strong answer above is backed by two artifacts:

1. **A cryptographic inventory** — where you use public-key crypto and which of it is quantum-vulnerable. This is what a reviewer may ask to see, and it's the foundation NIST's guidance puts first (see [NIST migration guidance](/nist-post-quantum-cryptography-migration-guidance/)).
2. **A prioritized migration roadmap** — ordered by data sensitivity and exposure, tied to a timeline. Build it from the [migration checklist](/post-quantum-cryptography-migration-checklist/).

If you have these two documents, you can answer *any* PQC questionnaire item, because every question is really "show me your inventory and your plan."

## If the deadline is this week

You can produce a defensible first artifact today. Start with your public-facing TLS and certificates — it's the slice a reviewer can independently verify (they may run the same check on you), so it's the highest-credibility place to begin.

**[Check your public TLS handshakes](/tls-1-3-post-quantum/#check-your-own-connections)** for every external domain and record the TLS version, negotiated key-exchange group, and certificate algorithm. Note which are classical-only (quantum-vulnerable) and which already use a hybrid like `X25519MLKEM768`. That table is a credible current-state assessment you can reference in the response — turning an unanswerable line item into a documented, in-progress answer.

## Turn the questionnaire into an advantage

Handled well, a PQC questionnaire item is a chance to look *more* mature than competitors who wrote "N/A" or bluffed. A vendor that can produce a cryptographic inventory and a NIST-aligned roadmap on request signals exactly the operational discipline enterprise procurement is screening for.

Build the evidence from your public TLS first, then use the answer template above and extend the inventory to internal systems with the [migration checklist](/post-quantum-cryptography-migration-checklist/).

---

*Related: [Post-quantum readiness self-check](/post-quantum-readiness/) · [Migration checklist](/post-quantum-cryptography-migration-checklist/) · [ML-KEM vs ML-DSA](/ml-kem-vs-ml-dsa/) · [Harvest now, decrypt later](/harvest-now-decrypt-later/)*
