---
title: "NIST PQC Migration Guidance: What It Requires of You"
slug: nist-post-quantum-cryptography-migration-guidance
description: "What NIST's post-quantum migration guidance requires of you: cryptographic inventory, prioritization, crypto-agility, and the transition timeline."
target_keyword: nist post-quantum cryptography migration guidance
secondary_keywords:
  - nist pqc migration
  - what does nist require post-quantum
  - crypto migration standards
  - NIST IR 8547
search_intent: "Security lead needs to know what NIST's migration guidance obligates them to do and how to sequence it, not just what the algorithms are."
word_count: 1500
last_updated: 2026-10-30
evergreen: true
faq:
  - q: "Is NIST IR 8547 final?"
    a: "Yes. NIST published the final version of IR 8547, Transition to Post-Quantum Cryptography Standards, in October 2026, replacing the November 2024 initial public draft. The final version deprecates all quantum-vulnerable public-key algorithms after 2030 and disallows them after 2035."
  - q: "Is RSA-2048 deprecated?"
    a: "Not yet. Under the final NIST IR 8547, RSA (along with ECDSA, EdDSA, and elliptic-curve and finite-field Diffie-Hellman) is deprecated after 2030 and disallowed under NIST standards after 2035; until then it remains usable while you migrate. Federal high value assets and high-impact systems face earlier deadlines under OMB M-26-15."
  - q: "What happens in 2030 for post-quantum cryptography?"
    a: "Three things converge. NIST deprecates quantum-vulnerable public-key algorithms after 2030; OMB M-26-15 requires federal high value assets and high-impact systems to use post-quantum key establishment by December 31, 2030; and federal agencies must support TLS 1.3 by January 2, 2030."
  - q: "What is crypto agility?"
    a: "NIST defines crypto agility as the capabilities needed to replace and adapt cryptographic algorithms in protocols, applications, software, hardware, firmware and infrastructures while preserving security and ongoing operations. NIST's CSWP 39 covers how to build it, and IR 8547 calls long-term cryptographic agility a requirement for a smooth post-quantum transition."
  - q: "What does NIST require by 2035?"
    a: "After 2035, quantum-vulnerable public-key algorithms are disallowed under NIST standards and guidelines, and 2035 remains the National Security Memorandum 10 target for completing the federal migration. Lower-risk systems can use the 2030-2035 window; long-retention and high-sensitivity systems are expected to move first."
---

# NIST Post-Quantum Migration Guidance: What It Actually Requires of You

You've probably gathered that NIST standardized new algorithms. The more useful question for someone running the migration is: **what does NIST expect me to actually do, and in what order?** This page translates NIST's migration guidance into obligations and a sequence you can plan against — without assuming you're a cryptographer.

Two things to hold separate. The **standards** (FIPS 203/204/205) define the algorithms; the **migration guidance** defines the process and the timeline. This page is about the second.

## The core requirement: know your cryptography first

Every strand of NIST's migration guidance starts in the same place — **you cannot migrate what you haven't inventoried.** The final [NIST IR 8547](https://csrc.nist.gov/pubs/ir/8547/final) tells organizations to treat the migration as "a current operational priority, beginning with cryptographic inventories, migration planning, and early deployments of PQC-enabled products and services." NIST's National Cybersecurity Center of Excellence (NCCoE) ran a dedicated project, *Migration to Post-Quantum Cryptography* (NIST SP 1800-38, published as a [preliminary draft practice guide](https://csrc.nist.gov/pubs/sp/1800/38/iprd-%281%29)), and the first workstream is cryptographic discovery: automated tooling to find where public-key crypto lives across your systems, protocols, and data.

The practical obligation on you: produce a **cryptographic inventory** — every place you use RSA, ECDSA, ECDH, and Diffie-Hellman, across certificates, TLS/VPN/SSH, code signing, and data at rest. This is the artifact an auditor or customer actually asks to see, and it's the input to every later decision.

## The sequence that follows from it

NIST's guidance treats migration as a phased program, not a switch. In practice that means:

1. **Discover / inventory** — find all uses of quantum-vulnerable public-key cryptography.
2. **Assess and prioritize** — rank by data sensitivity, confidentiality lifetime, and exposure. Long-retention confidential data comes first because of [harvest now, decrypt later](/harvest-now-decrypt-later/).
3. **Plan** — choose target algorithms (ML-KEM for key establishment, ML-DSA/SLH-DSA for signatures) and design for **crypto-agility** so you can change algorithms again later without re-architecting.
4. **Migrate** — deploy, favoring hybrids for key establishment so you retain classical security while adding quantum resistance.
5. **Validate and maintain** — confirm the change, keep the inventory current, monitor for drift.

The [migration checklist](/post-quantum-cryptography-migration-checklist/) turns this sequence into concrete tasks.

## Crypto-agility is an explicit expectation

NIST doesn't just want you on new algorithms once — it wants your systems built so algorithms can be *swapped again*. [IR 8547](https://csrc.nist.gov/pubs/ir/8547/final) says a smooth transition "requires building long-term cryptographic agility into organizational infrastructure," and NIST's [CSWP 39, *Considerations for Achieving Cryptographic Agility*](https://csrc.nist.gov/pubs/cswp/39/considerations-for-achieving-cryptographic-agility/final) (December 2025) is the reference on how. That's **crypto-agility**: cryptographic choices routed through central, configurable components rather than hard-coded throughout your code. The reasoning is practical — hybrids are an interim step, one PQC algorithm could later be deprecated, and you don't want another multi-year rewrite each time. Building agility now is part of doing the migration correctly, not a nice-to-have.

## The transition timeline

NIST finalized its schedule in [NIST IR 8547, *Transition to Post-Quantum Cryptography Standards*](https://csrc.nist.gov/pubs/ir/8547/final), published October 2026. The final version is stricter than the [November 2024 draft](https://csrc.nist.gov/pubs/ir/8547/ipd): the draft deprecated only 112-bit-strength algorithms such as RSA-2048 after 2030, while the final deprecates **all** quantum-vulnerable public-key cryptography after 2030.

| Algorithm family | Deprecated | Disallowed |
|---|---|---|
| RSA, ECDSA, EdDSA (signatures) | after 2030 | after 2035 |
| RSA, elliptic-curve and finite-field Diffie-Hellman (key establishment) | after 2030 | after 2035 |

"Deprecated" means you may still use it but must accept the risk; "disallowed" means it's no longer acceptable under NIST standards. The 2030–2035 window is there for lower-risk systems with legacy constraints. It isn't a grace period for everything.

Federal deadlines run earlier. Per IR 8547, Executive Order 14412 and OMB Memorandum M-26-15 require federal **high value assets and high-impact systems** to use post-quantum **key establishment by December 31, 2030** and post-quantum **signatures by December 31, 2031**, and require agencies to **support TLS 1.3 by January 2, 2030**. National Security Memorandum 10's goal of completing the federal migration by **2035** still stands.

For U.S. national-security systems, the NSA's [**CNSA 2.0**](https://media.defense.gov/2025/May/30/2003728741/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS.PDF) suite runs a separate, staggered schedule: new National Security Systems acquisitions must be CNSA 2.0 compliant from **January 1, 2027**; software/firmware signing and networking equipment must use it exclusively by **2030**; web browsers/servers, cloud services, and operating systems by **2033**.

Why this matters even if you're not a federal contractor: these federal timelines become the *de facto* schedule for the private sector. They flow into vendor requirements, cyber-insurance expectations, and the PQC line items now appearing in commercial RFPs and [security questionnaires](/post-quantum-cryptography-for-security-questionnaires/). Your effective deadline is usually your customer's audit, and their audit is anchored to these dates.

## Worked example: sequencing three real systems

Take a hypothetical mid-sized B2B software company with healthcare customers. Its inventory turns up, among others, these three systems. Here's how the guidance orders them, and where it goes wrong.

**System A — customer-facing API carrying patient records.** Public internet, TLS terminated at a CDN, data retained by the customer for years. Long confidentiality lifetime plus maximum exposure puts it in the top tier for key establishment. *Action:* enable `X25519MLKEM768` at the CDN edge first; it's a configuration change, not a re-architecture (see [TLS 1.3 post-quantum](/tls-1-3-post-quantum/)). *Conclusion:* migrate now. This is the system harvest-now-decrypt-later is about.

**System B — internal code-signing key for release builds.** Not internet-exposed, but every customer install trusts it. Recorded traffic isn't the issue here; forgery is, and that requires a working quantum computer at the time. *Action:* plan an ML-DSA (FIPS 204) signing path and test that your build and update tooling can verify it. Don't rush it ahead of System A. *Conclusion:* migrate second, but start the plan now, because signing keys and the clients that verify them change slowly.

**System C, the failure case — "done" at the edge, classical behind it.** The team enables hybrid key exchange at the CDN, re-runs the handshake check from a browser-facing hostname, sees `X25519MLKEM768`, and marks the API migrated. But the CDN-to-origin hop is a separate TLS connection. [Cloudflare's documentation](https://developers.cloudflare.com/ssl/post-quantum-cryptography/pqc-to-origin/), for example, says it prefers post-quantum key agreement to the origin *only when the origin supports it*. An origin still on a pre-3.5 OpenSSL negotiates a classical key exchange on that hop, and patient data crossing it stays harvestable. *Conclusion:* inventory each TLS hop, not each hostname. Re-check the origin directly before marking the system done.

## What "compliance" looks like in practice

There is no single "NIST PQC certified" stamp for an organization. Demonstrating alignment means being able to show:

- a current **cryptographic inventory** identifying quantum-vulnerable usage,
- a **prioritized migration plan** tied to data sensitivity and a timeline,
- **evidence of progress** — hybrids deployed on public endpoints, a crypto-agility posture, and monitoring in place.

That package is what turns "are you post-quantum ready?" from an unanswerable question into a documented yes-in-progress.

## Start with the step NIST puts first

Since the entire guidance rests on inventory, and inventory is where teams stall, start with the highest-signal slice: your public-facing TLS and certificates. It's internet-visible, it maps directly to the NIST standards, and it's the first thing a customer's security team will check themselves.

**[Check your public TLS handshakes](/tls-1-3-post-quantum/#check-your-own-connections)** to build that slice — the negotiated key-exchange group and certificate algorithm for each domain. It's step one of the NIST-prescribed sequence and a defensible foundation for the rest of your plan.

---

*Related: [ML-KEM vs ML-DSA compared](/ml-kem-vs-ml-dsa/) · [Migration checklist](/post-quantum-cryptography-migration-checklist/) · [Post-quantum readiness self-check](/post-quantum-readiness/)*
