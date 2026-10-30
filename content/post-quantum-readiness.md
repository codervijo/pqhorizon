---
title: "Post-Quantum Readiness Self-Check: Are You Exposed?"
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
last_updated: 2026-10-30
evergreen: true
faq:
  - q: "Is TLS 1.3 quantum safe?"
    a: "Not by itself. TLS 1.3 is only protected against harvest-now attacks when the handshake negotiates a hybrid post-quantum group such as X25519MLKEM768 (RFC 10024). A TLS 1.3 connection that negotiates plain X25519 or P-256 is classical-only."
  - q: "Is X25519 quantum safe?"
    a: "No. X25519 is an elliptic-curve key exchange, which Shor's algorithm breaks. It is safe only inside a hybrid such as X25519MLKEM768, where ML-KEM-768 provides the quantum resistance and X25519 keeps classical security."
  - q: "Is RSA-4096 quantum resistant?"
    a: "No. A larger RSA key does not stop Shor's algorithm. NIST IR 8547 deprecates RSA at every key size with at least 112 bits of classical security after 2030 and disallows it after 2035, so RSA-4096 is on the same timeline as RSA-2048."
  - q: "Is ECDSA quantum safe?"
    a: "No. ECDSA signatures can be forged by a large quantum computer, and NIST IR 8547 deprecates ECDSA after 2030 and disallows it after 2035. The replacement is ML-DSA (FIPS 204). Signatures are not exposed to harvest-now attacks, so they usually migrate after key exchange."
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
4. **Data at rest with long retention.** Backups, archives, PHI, financial records, legal holds — anything encrypted today with a key wrapped by RSA/ECC that must stay secret for years.
5. **Code signing and firmware.** Signatures verify authenticity; a broken signature scheme lets an attacker forge trusted software.

If you can't answer these for your own environment, you're not "not ready" in a failing sense — you're at the normal starting line. The work is turning "we probably use RSA everywhere" into a documented inventory.

### How to read your own TLS handshake

You can inspect the quantum posture of any domain's TLS from the command line. Use OpenSSL 3.5 or later — it was the first release to support ML-KEM and to offer `X25519MLKEM768` by default ([release notes](https://openssl-library.org/news/openssl-3.5-notes/)). Check with `openssl version` first.

```
openssl s_client -connect example.com:443 -tls1_3 </dev/null 2>/dev/null \
  | grep -E "Protocol|Cipher is|Temp Key|Negotiated TLS1.3 group|Peer signature type"
```

On OpenSSL 3.5, a hybrid post-quantum connection prints a `Negotiated TLS1.3 group` line. A classical-only connection prints `Peer Temp Key` instead (older builds call it `Server Temp Key`). `X25519MLKEM768` is classical X25519 combined with ML-KEM-768, the NIST-standardized lattice KEM, defined for TLS 1.3 in [RFC 10024](https://datatracker.ietf.org/doc/rfc10024/). (We explain the mechanics on [TLS 1.3 and post-quantum key exchange](/tls-1-3-post-quantum/).)

### Three real readings

These are actual outputs captured on 2026-10-30 against live public domains.

**Reading 1 — hybrid key exchange, classical certificate** (OpenSSL 3.5.7):

```
Peer signature type: ecdsa_secp256r1_sha256
Negotiated TLS1.3 group: X25519MLKEM768
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
```

The key exchange is post-quantum hybrid, so recorded sessions to this endpoint are protected against harvest-now-decrypt-later. The signature line is still ECDSA on P-256: the certificate is classical. That is not a harvest-now exposure — NIST IR 8547 notes signatures can't be attacked that way — but it goes on the inventory for the later signature migration. Record it as "key exchange: done; certificate: classical."

**Reading 2 — the failure case: TLS 1.3 without post-quantum** (OpenSSL 3.5.7):

```
Peer signature type: ecdsa_secp256r1_sha256
Peer Temp Key: X25519, 253 bits
New, TLSv1.3, Cipher is TLS_AES_128_GCM_SHA256
```

This is TLS 1.3, and it is still classical-only. There is no negotiated hybrid group, and the temporary key is plain X25519, even though the client offered `X25519MLKEM768`. Sessions recorded today are exposed. "We run TLS 1.3" is not the same answer as "we are post-quantum." Record it as "key exchange: needs hybrid."

**Reading 3 — a false alarm from an old client** (OpenSSL 3.0.2, the same server as Reading 1):

```
Peer signature type: ECDSA
Server Temp Key: X25519, 253 bits
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
```

This looks like Reading 2, but the server is the one that negotiated `X25519MLKEM768` above. OpenSSL 3.0 never offered ML-KEM, so the server fell back to what the client supported. Don't record an endpoint as classical-only until you've tested it with OpenSSL 3.5 or later.

Run it against each public domain you own and record the result — that list is the first page of your cryptographic inventory.

## What "ready" actually requires

Readiness is a sequence, and NIST frames it the same way (see [NIST post-quantum migration guidance](/nist-post-quantum-cryptography-migration-guidance/)):

- **Inventory.** Discover everywhere you use public-key crypto — certificates, protocols, libraries, hardware. You cannot migrate what you can't see. This is the step almost everyone is missing.
- **Prioritize.** Rank by data sensitivity, retention lifetime, and exposure. Long-retention confidential data exposed over the public internet is your top tier; a self-signed cert on an internal dashboard is your bottom.
- **Migrate.** Move to NIST-standardized algorithms — **ML-KEM (FIPS 203)** for key establishment, **ML-DSA (FIPS 204)** for signatures — usually via crypto-agile hybrids first, so you keep classical security while adding quantum resistance.
- **Monitor.** Crypto configurations drift. Certificates get reissued, services get added. Readiness is a state you maintain, not a project you close.

The [post-quantum migration checklist](/post-quantum-cryptography-migration-checklist/) turns this into concrete, orderable tasks.

## Why now, when the quantum computer isn't here yet

Three forcing functions, none of which wait for the CRQC:

- **The data-lifetime math.** Michele Mosca's inequality compares how long your data must stay secret plus how long your migration takes against the time until a quantum computer exists. NIST notes that previous cryptographic transitions have taken 10 to 20 years ([IR 8547](https://doi.org/10.6028/NIST.IR.8547)), so the migration term alone is large. It's worked through with examples on [harvest now, decrypt later](/harvest-now-decrypt-later/).
- **The standards are final.** NIST published the first post-quantum standards — FIPS 203, 204, and 205 — [in August 2024](https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards). There is no longer a "wait for the standard" excuse; the migration target exists.
- **The deadlines are landing in your contracts.** Google has [set 2029 as its timeline](https://blog.google/innovation-and-ai/technology/safety-security/cryptography-migration-timeline/) for post-quantum migration, NIST's final transition report ([IR 8547](https://doi.org/10.6028/NIST.IR.8547), October 2026) deprecates quantum-vulnerable public-key algorithms — RSA, ECDSA, ECDH and the rest — after 2030 and disallows them under NIST standards after 2035, and these dates are already showing up as line items in RFPs, vendor security questionnaires, and cyber-insurance renewals. If you sell into regulated enterprises, the deadline that matters isn't the quantum computer's — it's your customer's next audit.

## Your defensible first move

You don't start by rewriting cryptography. You start by producing an inventory you can hand to an auditor. That single artifact — "here is where we use public-key crypto, here's what's vulnerable, here's our prioritized plan" — is what converts a panic-inducing questionnaire item into a five-minute answer.

The first slice of that inventory is the one you can verify from outside: your public-facing TLS and certificate posture.

**[Read your own TLS handshake](#how-to-read-your-own-tls-handshake)** for every public domain and record the results — that's the first page of your cryptographic inventory. Then work outward with the [migration checklist](/post-quantum-cryptography-migration-checklist/).

---

*Related: [Post-quantum migration checklist](/post-quantum-cryptography-migration-checklist/) · [TLS 1.3 post-quantum key exchange](/tls-1-3-post-quantum/) · [Harvest now, decrypt later](/harvest-now-decrypt-later/) · [What is the purpose of post-quantum cryptography?](/what-is-the-purpose-of-post-quantum-cryptography/)*
