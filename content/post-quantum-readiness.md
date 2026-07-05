---
title: "Post-Quantum Readiness: How to Tell If Your Organization Is Exposed"
slug: post-quantum-readiness
description: "Find out if your organization is exposed to quantum risk and where to start — a practical post-quantum readiness self-check for security and IT leads."
target_keyword: post-quantum readiness
secondary_keywords:
  - quantum readiness assessment
  - am I quantum vulnerable
  - post-quantum migration starting point
  - cryptographic inventory
search_intent: "Security lead needs to know whether their organization is exposed to quantum risk and where to begin — practical self-assessment, not theory."
word_count: 1180
last_updated: 2026-07-04
evergreen: true
---

# Post-Quantum Readiness: How to Tell If You're Exposed and Where to Start

If you own your company's audit and security-questionnaire responses and someone just asked whether you're "post-quantum ready," this page is written for you. You don't need a cryptography background to answer the question. You need to know three things: what in your stack is quantum-vulnerable, which of it matters, and what a defensible first step looks like. That's what this page covers.

Post-quantum readiness is not a product you buy or a checkbox you flip. It's a *known state* — you have an inventory of where you use public-key cryptography, you know which of those uses are vulnerable to a future quantum computer, and you have a dated plan to migrate the ones that matter. Most 50–500-person organizations are at step zero: they can't produce the inventory. That's the gap this page helps you close.

## The one-sentence version of the threat

A sufficiently large quantum computer running Shor's algorithm can break the public-key cryptography that protects almost all internet traffic and stored secrets today — specifically **RSA, ECDSA, ECDH, and Diffie-Hellman**. Symmetric cryptography (AES) and hashing (SHA-2/SHA-3) are only mildly affected and are considered safe with adequate key sizes. So "quantum readiness" is really a question about your public-key footprint: your TLS certificates, your key exchange, your code-signing, your VPN, and any long-lived encrypted data.

The machine that can do this — a *cryptographically relevant quantum computer* (CRQC) — does not exist yet publicly. The reason you can't wait for it to arrive is **harvest now, decrypt later**: an adversary can record your encrypted traffic today and decrypt it the day the hardware matures. Any data whose confidentiality must outlive the CRQC is *already* exposed. (More on that in [harvest now, decrypt later](/harvest-now-decrypt-later/).)

## Are you exposed? A 5-minute self-check

You almost certainly are — nearly every organization is, because the vulnerable algorithms are the default across the entire internet. The useful question is *where*. Walk these five surfaces:

1. **Your public TLS.** Load any of your externally facing domains. What key exchange does the handshake negotiate? If it's classical X25519 or P-256 ECDH with no post-quantum hybrid, that session has no quantum protection. You can check this yourself in seconds — see below.
2. **Your certificates.** What public-key algorithm signs them? RSA-2048 and ECDSA P-256 are both quantum-vulnerable. Note their expiry dates; certificates you'll reissue soon are cheap migration wins.
3. **Your key exchange for data in transit.** VPNs, internal service-to-service TLS, SSH. All typically use ECDH or RSA.
4. **Data at rest with long retention.** Backups, archives, PHI, financial records, legal holds — anything encrypted today with a key wrapped by RSA/ECC, that must stay secret for 5–15+ years.
5. **Code signing and firmware.** Signatures verify authenticity; a broken signature scheme lets an attacker forge trusted software.

If you can't answer these for your own environment, you're not "not ready" in a failing sense — you're at the normal starting line. The work is turning "we probably use RSA everywhere" into a documented inventory.

### How to read your own TLS handshake

You can inspect the quantum posture of any domain's TLS from the command line:

```
openssl s_client -connect example.com:443 -tls1_3 </dev/null 2>/dev/null | grep -E "Protocol|Cipher|Server Temp Key"
```

The `Server Temp Key` line shows the negotiated key-exchange group. If it reads `X25519` or `P-256`, there is no post-quantum protection on that connection. If it reads something like `X25519MLKEM768`, the connection is using a **hybrid post-quantum key exchange** — classical X25519 combined with ML-KEM-768, the NIST-standardized lattice KEM. That hybrid is exactly what modern browsers now negotiate by default. (We explain the mechanics on [TLS 1.3 and post-quantum key exchange](/tls-1-3-post-quantum/).)

This one line is also the core of our free scan. **[Run a free scan](/#scan)** and PQHorizon does this check against your domain, decodes the certificate and negotiated group, and maps each finding to the relevant NIST guidance — no install, no signup.

## What "ready" actually requires

Readiness is a sequence, and NIST frames it the same way (see [NIST post-quantum migration guidance](/nist-post-quantum-cryptography-migration-guidance/)):

- **Inventory.** Discover everywhere you use public-key crypto — certificates, protocols, libraries, hardware. You cannot migrate what you can't see. This is the step almost everyone is missing.
- **Prioritize.** Rank by data sensitivity, retention lifetime, and exposure. Long-retention confidential data exposed over the public internet is your top tier; a self-signed cert on an internal dashboard is your bottom.
- **Migrate.** Move to NIST-standardized algorithms — **ML-KEM (FIPS 203)** for key establishment, **ML-DSA (FIPS 204)** for signatures — usually via crypto-agile hybrids first, so you keep classical security while adding quantum resistance.
- **Monitor.** Crypto configurations drift. Certificates get reissued, services get added. Readiness is a state you maintain, not a project you close.

The [post-quantum migration checklist](/post-quantum-cryptography-migration-checklist/) turns this into concrete, orderable tasks.

## Why now, when the quantum computer isn't here yet

Three forcing functions, none of which wait for the CRQC:

- **The data-lifetime math.** Cryptographer Michele Mosca's framing: if the time your data must stay secret, plus the time it takes you to migrate, is greater than the time until a CRQC exists, you are already too late. For anything with a 7–10 year confidentiality requirement, that inequality is likely already true.
- **The standards are final.** NIST published the first post-quantum standards — FIPS 203, 204, and 205 — in August 2024 [SOURCE: NIST FIPS 203/204/205]. There is no longer a "wait for the standard" excuse; the migration target exists.
- **The deadlines are landing in your contracts.** Google has stated a goal of having post-quantum cryptography deployed by 2029 [SOURCE: Google post-quantum roadmap] [VERIFY: exact 2029 wording/date], NIST's draft transition guidance signals deprecation of RSA/ECC around 2030 [SOURCE: NIST IR 8547 draft] [VERIFY: exact deprecation years], and these dates are already showing up as line items in RFPs, vendor security questionnaires, and cyber-insurance renewals. If you sell into regulated enterprises, the deadline that matters isn't the quantum computer's — it's your customer's next audit.

## Your defensible first move

You don't start by rewriting cryptography. You start by producing an inventory you can hand to an auditor. That single artifact — "here is where we use public-key crypto, here's what's vulnerable, here's our prioritized plan" — is what converts a panic-inducing questionnaire item into a five-minute answer.

PQHorizon's free scan gives you the first slice of that inventory: your public-facing TLS and certificate posture, findings ranked by severity, each tied to the NIST standard it maps to. It's an honest public-TLS check, not a sales gate.

**[Run a free scan of your domain](/#scan)** and get the first page of your cryptographic inventory in under a minute. When you're ready to go deeper, the same engine covers your full footprint and produces the roadmap.

---

*Related: [Post-quantum migration checklist](/post-quantum-cryptography-migration-checklist/) · [TLS 1.3 post-quantum key exchange](/tls-1-3-post-quantum/) · [Harvest now, decrypt later](/harvest-now-decrypt-later/) · [What is the purpose of post-quantum cryptography?](/what-is-the-purpose-of-post-quantum-cryptography/)*
