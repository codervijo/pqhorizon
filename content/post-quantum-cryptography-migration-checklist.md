---
title: "Post-Quantum Cryptography Migration Checklist (NIST-Aligned)"
slug: post-quantum-cryptography-migration-checklist
description: "An ordered, NIST-aligned post-quantum cryptography migration checklist: inventory, prioritize, deploy hybrid key exchange, migrate signatures, monitor."
target_keyword: post-quantum cryptography migration checklist
secondary_keywords:
  - migration to post-quantum cryptography
  - pqc migration steps
  - quantum-safe migration plan
  - crypto-agility checklist
search_intent: "Practitioner wants an actionable, ordered checklist to plan and execute a migration to post-quantum cryptography, aligned to NIST."
word_count: 1060
last_updated: 2026-07-04
evergreen: true
---

# Post-Quantum Cryptography Migration Checklist

If you've decided to start migrating to post-quantum cryptography and you want an ordered list of what to actually do — not another explainer on Shor's algorithm — this is that list. It's aligned to NIST's migration model and the [FIPS 203/204/205 standards](/nist-post-quantum-cryptography-standards/), and it's written for a security or IT lead running the project without a dedicated cryptographer.

Migration is not a rip-and-replace. It's a phased program: **inventory → prioritize → build crypto-agility → deploy hybrids → validate → monitor.** Skipping the inventory is the single most common failure, because you can't migrate cryptography you don't know you have. Work the phases in order; within a phase, parallelize freely.

## Phase 0 — Establish ownership and scope

- [ ] Name an accountable owner for the migration (usually the person who answers security questionnaires).
- [ ] Define scope: production systems, internal systems, third-party/SaaS, and long-retention data stores. Write down what's explicitly out of scope.
- [ ] Identify your compliance forcing functions — the RFP, audit, HIPAA/SOC 2/CMMC review, or insurance renewal driving the timeline. Anchor the plan to that date, not to the arrival of a quantum computer.
- [ ] Decide your target standards up front: **ML-KEM (FIPS 203)** for key establishment, **ML-DSA (FIPS 204)** for signatures, **SLH-DSA (FIPS 205)** where a conservative hash-based signature is warranted.

## Phase 1 — Build the cryptographic inventory

This is the load-bearing phase. The deliverable is a single document an auditor would accept.

- [ ] **Public-facing TLS.** Every external domain and endpoint: TLS version, cipher suite, negotiated key-exchange group, certificate signature and public-key algorithm. (You can bootstrap this with our [free scan](/#scan).)
- [ ] **Certificates.** Enumerate all certs — public and internal. Record signature algorithm (RSA/ECDSA), key size, issuer, and expiry. Expiring certs are your cheapest migration opportunities.
- [ ] **Key exchange in transit.** VPN, SSH, service-to-service mTLS, database connections, message queues.
- [ ] **Data at rest.** Backups, archives, object storage, databases. For each, record the key-wrapping/key-establishment algorithm and — critically — the required confidentiality lifetime.
- [ ] **Code signing / firmware / secure boot.** Any signature that establishes software authenticity.
- [ ] **Cryptographic libraries and versions.** OpenSSL, BoringSSL, libraries in your application dependencies. Note which support post-quantum algorithms and which don't.
- [ ] **Hardware roots of trust.** HSMs, TPMs, smartcards — these often have the longest replacement lead time.

Tag every entry as **quantum-vulnerable** (RSA, ECDSA, ECDH, DH, DSA) or **quantum-safe / not-applicable** (AES-256, SHA-256/384, HMAC). This tagging alone turns the inventory into a work queue.

## Phase 2 — Prioritize by real risk

Not everything migrates at once. Rank each inventory item on three axes:

- [ ] **Data-secrecy lifetime.** How long must this stay confidential? Long-retention data (PHI, financial, legal, IP) scores highest — it's already exposed to [harvest now, decrypt later](/harvest-now-decrypt-later/).
- [ ] **Exposure.** Public internet > partner network > internal-only.
- [ ] **Blast radius.** Root CAs, code-signing keys, and identity providers affect everything downstream.

Apply **Mosca's inequality**: if (secrecy lifetime + migration time) > (time until a quantum computer exists), that item is already late — migrate it first. In practice, *long-retention confidential data on public-facing systems* is almost always the top tier.

## Phase 3 — Build crypto-agility

You're going to change algorithms more than once (hybrids now, pure PQC later, and possibly a different PQC algorithm if one is deprecated). Design for that.

- [ ] Route cryptographic operations through a central library or service, not scattered inline calls.
- [ ] Make algorithm choice configuration-driven, not hard-coded.
- [ ] Confirm your TLS-terminating infrastructure (load balancers, CDNs, reverse proxies) can be updated to negotiate post-quantum groups.
- [ ] Inventory anywhere key sizes are assumed — ML-KEM and ML-DSA keys and ciphertexts are substantially larger than RSA/ECC, and some protocols, buffers, or hardware have size limits.

## Phase 4 — Deploy hybrid key exchange first

Hybrids give you post-quantum protection *without* betting everything on a young algorithm — the session is secure unless *both* the classical and the post-quantum part are broken.

- [ ] Enable **hybrid TLS 1.3 key exchange** on public endpoints: `X25519MLKEM768` (IANA codepoint `0x11EC`), or `P256MLKEM768` (`0x11EB`) where a FIPS-validated classical component is required. See [TLS 1.3 post-quantum](/tls-1-3-post-quantum/) for the mechanics.
- [ ] Verify negotiation end-to-end after enabling — middleboxes and old clients sometimes break on the larger `ClientHello`.
- [ ] Roll out to internal TLS and VPN where supported.
- [ ] For data at rest, begin re-wrapping long-retention data keys with ML-KEM-based key establishment.

## Phase 5 — Migrate signatures and PKI

Signatures are slower to migrate than key exchange because they touch PKI hierarchies and long-lived trust anchors.

- [ ] Pilot **ML-DSA (FIPS 204)** for new code-signing and internal PKI.
- [ ] Plan CA hierarchy changes — post-quantum or hybrid certificate chains — with your CA vendor.
- [ ] Use **SLH-DSA (FIPS 205)** where you need a stateless, hash-based signature with conservative security assumptions (e.g. firmware/root-of-trust signing) and can tolerate larger signatures.

## Phase 6 — Validate and monitor

- [ ] Re-scan public endpoints and confirm the negotiated groups changed as intended.
- [ ] Update the inventory to reflect migrated items — it's a living document.
- [ ] Set up drift monitoring: reissued certificates, new services, and infra changes can silently reintroduce classical-only crypto.
- [ ] Keep the inventory + plan export-ready for your next questionnaire or audit. That artifact *is* your [answer to the PQC line item](/post-quantum-cryptography-for-security-questionnaires/).

## The fastest way to start Phase 1

The inventory is where most teams stall, so start there and start narrow. Your public TLS is the highest-signal, lowest-effort slice — it's internet-visible, it's what a customer's security team will check first, and it maps cleanly to the NIST standards.

**[Run a free scan](/#scan)** to generate the public-TLS-and-certificate portion of your inventory automatically, with each finding ranked by severity and tied to the relevant NIST standard. It's the first checklist item done in under a minute, and it gives you a defensible artifact to build the rest of the plan around.

---

*Related: [Post-quantum readiness self-check](/post-quantum-readiness/) · [NIST migration guidance](/nist-post-quantum-cryptography-migration-guidance/) · [TLS 1.3 post-quantum key exchange](/tls-1-3-post-quantum/)*
