---
title: "NIST Post-Quantum Cryptography Standards, in Plain Terms"
slug: nist-post-quantum-cryptography-standards
description: "The NIST post-quantum standards in plain terms: FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), and FIPS 205 (SLH-DSA), and when to use each."
target_keyword: nist post-quantum cryptography standards
secondary_keywords:
  - FIPS 203
  - FIPS 204
  - FIPS 205
  - ML-KEM ML-DSA SLH-DSA
search_intent: "Non-cryptographer security lead wants to understand what the NIST PQC standards are and what each one is for, without the math."
word_count: 870
last_updated: 2026-07-04
evergreen: true
---

# NIST Post-Quantum Cryptography Standards, Explained for Non-Cryptographers

If you keep seeing "FIPS 203," "ML-KEM," and "ML-DSA" in vendor docs or a security questionnaire and want to know what they actually are — without a cryptography lecture — this page is the plain-terms version. You'll leave knowing what each standard does, when to use it, and what it replaces in your existing stack.

In August 2024, NIST published the first three finalized post-quantum cryptography standards [SOURCE: NIST FIPS 203/204/205]. That matters because it ended the "wait for the standard" excuse: the algorithms you migrate *to* are now official, named, and stable. Three standards, two jobs.

## The two jobs cryptography does — and what breaks

Public-key cryptography does two things, and a quantum computer breaks both of today's tools:

- **Key establishment** — agreeing on a secret key over an open network so traffic can be encrypted. Today: ECDH, RSA. Quantum-broken.
- **Digital signatures** — proving that a message, certificate, or software update is authentic. Today: ECDSA, RSA. Quantum-broken.

The NIST standards provide quantum-safe replacements for each: one for key establishment, two (plus one forthcoming) for signatures.

## FIPS 203 — ML-KEM (key establishment)

**ML-KEM** = Module-Lattice-Based Key-Encapsulation Mechanism. It's the finalized, standardized form of the algorithm previously known as **CRYSTALS-Kyber**.

- **What it's for:** establishing shared secret keys — the quantum-safe replacement for ECDH key exchange. This is the workhorse; it's what protects your data *in transit* against [harvest now, decrypt later](/harvest-now-decrypt-later/).
- **Where you'll meet it first:** TLS. Browsers now negotiate a hybrid `X25519MLKEM768` key exchange by default (see [TLS 1.3 post-quantum](/tls-1-3-post-quantum/)). The `768` is the middle parameter set (ML-KEM-768, ~AES-192 security category); ML-KEM-512 and ML-KEM-1024 sit below and above it.
- **What to know:** its keys and ciphertexts are much larger than an elliptic-curve key. Usually fine, occasionally a constraint for size-limited protocols or hardware.

If you migrate one thing first, it's key establishment — because recorded-today traffic is the data most exposed to future decryption.

## FIPS 204 — ML-DSA (primary signature)

**ML-DSA** = Module-Lattice-Based Digital Signature Algorithm, the standardized form of **CRYSTALS-Dilithium**.

- **What it's for:** digital signatures — the quantum-safe replacement for ECDSA/RSA signing. Certificates, code signing, authentication tokens.
- **Priority:** generally *after* key establishment. A recorded session can be decrypted retroactively, but a signature can only be forged by an attacker operating a quantum computer in real time — so the harvest-now risk doesn't apply to signatures the same way. You still migrate them, just typically second.
- **What to know:** ML-DSA is NIST's recommended default signature scheme for most uses.

## FIPS 205 — SLH-DSA (conservative signature)

**SLH-DSA** = Stateless Hash-Based Digital Signature Algorithm, from **SPHINCS+**.

- **What it's for:** signatures where you want the most conservative possible security foundation. Its security rests only on the strength of hash functions — a very well-understood, well-trusted primitive — rather than on the newer lattice math.
- **When to choose it over ML-DSA:** for long-lived, high-assurance signing where you'd rather not depend on lattice assumptions — firmware, secure boot, root-of-trust signing.
- **The trade-off:** SLH-DSA signatures are large and signing is slower. You accept that cost in exchange for conservative, hash-only security.

## What about FALCON / FN-DSA?

NIST also selected FALCON, to be standardized as **FN-DSA (FIPS 206)** — a lattice signature scheme with notably compact signatures, useful where signature size is tight. As of this writing FIPS 206 is forthcoming rather than final [VERIFY: FIPS 206 / FN-DSA publication status]. ML-DSA (FIPS 204) is the default to plan around today.

## How to choose — a cheat sheet

| You need to… | Use | Standard |
|---|---|---|
| Establish keys / protect data in transit | **ML-KEM** | FIPS 203 |
| Sign certificates, code, tokens (default) | **ML-DSA** | FIPS 204 |
| Sign with the most conservative assumptions (firmware, root of trust) | **SLH-DSA** | FIPS 205 |
| Sign where signature size is tightly constrained | **FN-DSA** (forthcoming) | FIPS 206 |

One rule of thumb: **KEM = keys, DSA = signatures.** ML-*KEM* establishes keys; ML-*DSA* and SLH-*DSA* sign.

## What the standards ask of you

Publishing the standards is only half the story — NIST also provides transition guidance on *when* to move and *how* to sequence it. The short version: inventory first, migrate key establishment first via hybrids, then signatures. That "what NIST actually requires of you" side is covered in [NIST post-quantum migration guidance](/nist-post-quantum-cryptography-migration-guidance/), and for a status/timeline snapshot see [NIST post-quantum standards 2026](/nist-post-quantum-cryptography-standards-2026/).

## From standards to your stack

Knowing the standards is useful; knowing where *your* systems still use the quantum-vulnerable predecessors (RSA, ECDSA, ECDH) is what a questionnaire or auditor actually asks for.

**[Run a free scan](/#scan)** and PQHorizon reports your public TLS and certificate posture with each finding mapped to the exact NIST standard that addresses it — turning "we should adopt FIPS 203" into "here's where we still need to." It's the bridge from reading the standards to acting on them.

---

*Related: [NIST migration guidance](/nist-post-quantum-cryptography-migration-guidance/) · [What is the purpose of post-quantum cryptography?](/what-is-the-purpose-of-post-quantum-cryptography/) · [NIST post-quantum standards 2026](/nist-post-quantum-cryptography-standards-2026/) · [TLS 1.3 post-quantum](/tls-1-3-post-quantum/)*
