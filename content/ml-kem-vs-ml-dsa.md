---
title: "ML-KEM vs ML-DSA: Which Does What, and When You Need Each"
slug: ml-kem-vs-ml-dsa
description: "ML-KEM sets up keys; ML-DSA signs. They aren't alternatives — you need both. Sizes, use cases, and where SLH-DSA fits, from FIPS 203/204/205."
target_keyword: ml-kem vs ml-dsa
secondary_keywords:
  - fips 203 vs 204 vs 205
  - ml-dsa vs slh-dsa
  - ml-kem and ml-dsa
  - ml-kem ml-dsa and slh-dsa
search_intent: "Security or engineering lead has seen ML-KEM and ML-DSA (or FIPS 203/204/205) in vendor docs or a questionnaire and wants to know how they differ, which one applies where, and whether they need both."
word_count: 1400
last_updated: 2026-10-30
evergreen: true
faq:
  - q: "Is ML-KEM symmetric or asymmetric?"
    a: "Asymmetric. ML-KEM has a public encapsulation key and a private decapsulation key, and its output is a 32-byte shared secret that you then use with a symmetric cipher such as AES to encrypt the actual data."
  - q: "Is ML-KEM the same as Kyber?"
    a: "ML-KEM is the standardized algorithm derived from CRYSTALS-Kyber, but the final version includes technical changes that make it incompatible with the earlier deployed Kyber. In TLS that meant a new codepoint: hybrid Kyber768 used 0x6399, while hybrid ML-KEM uses 0x11EC."
  - q: "What is ML-KEM-768?"
    a: "It is the middle of ML-KEM's three parameter sets, claimed by NIST to meet security category 3. It uses a 1,184-byte encapsulation key and a 1,088-byte ciphertext, and it is the ML-KEM half of the X25519MLKEM768 hybrid used in TLS."
  - q: "What is ML-DSA-65?"
    a: "It is the middle of ML-DSA's three parameter sets, claimed to meet security category 3, with a 1,952-byte public key and a 3,309-byte signature. ML-DSA-44 is smaller (category 2) and ML-DSA-87 is larger (category 5)."
  - q: "Does OpenSSL support ML-KEM and ML-DSA?"
    a: "Yes. OpenSSL 3.5 added ML-KEM, ML-DSA and SLH-DSA, and changed its default TLS key shares to offer X25519MLKEM768 alongside X25519."
---

# ML-KEM vs ML-DSA (and SLH-DSA): FIPS 203, 204 and 205 Compared

**ML-KEM and ML-DSA are not competing options — they do different jobs, and a post-quantum system needs both.** ML-KEM ([FIPS 203](https://csrc.nist.gov/pubs/fips/203/final)) is a key-encapsulation mechanism: it lets two parties agree on a shared secret key, replacing ECDH and RSA key exchange. ML-DSA ([FIPS 204](https://csrc.nist.gov/pubs/fips/204/final)) is a digital signature algorithm: it proves who signed something, replacing ECDSA and RSA signatures. SLH-DSA ([FIPS 205](https://csrc.nist.gov/pubs/fips/205/final)) is the conservative alternative to ML-DSA — not to ML-KEM.

One rule of thumb covers most confusion: **KEM = keys, DSA = signatures.** NIST published all three standards on [August 13, 2024](https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards), so the algorithms you migrate *to* are official, named, and stable.

## At a glance

| | ML-KEM | ML-DSA | SLH-DSA |
|---|---|---|---|
| Standard | FIPS 203 | FIPS 204 | FIPS 205 |
| Job | Key establishment | Digital signatures (default) | Digital signatures (conservative) |
| Replaces | ECDH, RSA key transport | ECDSA, RSA signatures | ECDSA, RSA signatures |
| Derived from | CRYSTALS-Kyber | CRYSTALS-Dilithium | SPHINCS+ |
| Security rests on | Module lattices | Module lattices | Hash functions only |
| Middle parameter set | ML-KEM-768 | ML-DSA-65 | SLH-DSA-*-192s / 192f |
| Public key (middle set) | 1,184 bytes | 1,952 bytes | 48 bytes |
| Per-use output (middle set) | 1,088-byte ciphertext | 3,309-byte signature | 16,224 / 35,664-byte signature |

Sizes are from the standards' own tables: FIPS 203 Table 3, FIPS 204 Table 2, FIPS 205 Table 2.

## The two jobs — and what breaks

Public-key cryptography does two things, and a quantum computer breaks today's tools for both:

- **Key establishment** — agreeing on a secret key over an open network so traffic can be encrypted. Today: ECDH, RSA. Quantum-broken. Post-quantum replacement: **ML-KEM**.
- **Digital signatures** — proving that a message, certificate, or software update is authentic. Today: ECDSA, RSA. Quantum-broken. Post-quantum replacement: **ML-DSA**, or **SLH-DSA** where you want hash-only assumptions.

You can't substitute one for the other. A KEM produces a shared secret; it cannot sign anything. A signature scheme proves authorship; it cannot agree a key. A TLS connection uses both: key exchange for the session keys, signatures for the server's certificate chain.

## ML-KEM (FIPS 203) — key establishment

**ML-KEM** = Module-Lattice-Based Key-Encapsulation Mechanism, the standardized form of **CRYSTALS-Kyber**.

- **What it's for:** establishing shared secret keys — the quantum-safe replacement for ECDH. This is what protects data *in transit* against [harvest now, decrypt later](/harvest-now-decrypt-later/).
- **Parameter sets:** ML-KEM-512, ML-KEM-768, and ML-KEM-1024, which FIPS 203 claims meet NIST security categories 1, 3, and 5. All three produce a 32-byte shared secret.
- **Where you'll meet it first:** TLS. The hybrid group `X25519MLKEM768` (codepoint `0x11EC`) combines classical X25519 with ML-KEM-768. Chrome began offering it in [Chrome 131](https://security.googleblog.com/2024/09/a-new-path-for-kyber-on-web.html), and [OpenSSL 3.5](https://openssl-library.org/news/openssl-3.5-notes/) offers it in its default key shares. See [how hybrid key exchange works in TLS 1.3](/tls-1-3-post-quantum/).

If you migrate one thing first, it's key establishment — recorded-today traffic is the data most exposed to future decryption.

## ML-DSA (FIPS 204) — the default signature

**ML-DSA** = Module-Lattice-Based Digital Signature Algorithm, the standardized form of **CRYSTALS-Dilithium**.

- **What it's for:** certificates, code signing, authentication tokens — anywhere ECDSA or RSA signs today.
- **Parameter sets:** ML-DSA-44, ML-DSA-65, ML-DSA-87, claimed at security categories 2, 3, and 5.
- **Priority:** usually *after* key establishment. A recorded session can be decrypted retroactively, but a signature can only be forged by an attacker with a quantum computer at the time they use the forgery — so harvest-now risk doesn't apply to signatures the same way. You still migrate them; NIST's final transition plan ([IR 8547](https://csrc.nist.gov/pubs/ir/8547/final), October 2026) deprecates quantum-vulnerable signature algorithms after 2030 and disallows them after 2035.

## SLH-DSA (FIPS 205) — the conservative signature

**SLH-DSA** = Stateless Hash-Based Digital Signature Algorithm, from **SPHINCS+**.

- **Why it exists:** its security rests only on hash functions — a well-studied primitive — rather than on lattice math. If a weakness in lattices ever emerged, ML-KEM and ML-DSA would share it; SLH-DSA would not.
- **The cost:** tiny keys, large signatures. Each security level comes in an "s" variant (smaller signatures) and an "f" variant (faster signing). The smallest option, SLH-DSA-SHA2-128s, still produces a 7,856-byte signature.
- **When to choose it over ML-DSA:** long-lived, high-assurance signing where you'd rather not depend on lattice assumptions and size matters less than confidence — firmware, secure boot, root-of-trust keys.

## What about FALCON / FN-DSA?

NIST also selected FALCON, to be standardized as **FN-DSA (FIPS 206)** — a lattice signature scheme with compact signatures. As of October 2026, NIST's [standardization page](https://csrc.nist.gov/projects/post-quantum-cryptography/post-quantum-cryptography-standardization) still lists FIPS 206 as in development, with no publication date. Plan around ML-DSA today.

## Worked examples

**1. Sizing a TLS handshake (ML-KEM's cost).** With `X25519MLKEM768`, the client's key share is 1,216 bytes (1,184 for ML-KEM plus 32 for X25519) and the server's is 1,120 bytes (1,088 plus 32), per the [IETF hybrid ML-KEM draft](https://datatracker.ietf.org/doc/draft-ietf-tls-ecdhe-mlkem/). A classical X25519 share is 32 bytes. **Conclusion:** the client share grows about 38×, but it's paid once per handshake, not per byte of data transferred afterward.

**2. Signing a certificate (ML-DSA's cost).** An Ed25519 signature is 64 bytes and its public key 32 bytes ([RFC 8032](https://www.rfc-editor.org/rfc/rfc8032)). An ML-DSA-65 signature is 3,309 bytes and its public key 1,952 bytes. A certificate carries the subject's public key *and* the issuer's signature, and a TLS server sends a chain of them. **Conclusion:** signatures are where post-quantum size really bites, and why signature migration is slower and more carefully staged than key exchange.

**3. Failure case — "We enabled ML-KEM, so we're post-quantum."** A server negotiates `X25519MLKEM768`, but its certificate is still signed with ECDSA P-256. The session keys are now protected against harvest-now-decrypt-later — a real win. But authentication is still entirely classical. **Conclusion:** you've finished the ML-KEM half, not the migration. Track ML-DSA for certificates and code signing as a separate workstream with its own deadline.

**4. Failure case — reaching for SLH-DSA everywhere.** A team picks SLH-DSA-SHA2-128f for TLS server certificates "to be safe." Each signature is 17,088 bytes, more than five times ML-DSA-65's 3,309, and every handshake carries several. **Conclusion:** SLH-DSA's conservatism is worth paying for on rarely-verified, long-lived signatures like firmware; on high-volume handshakes, ML-DSA is the default for a reason.

## How to choose — a cheat sheet

| You need to… | Use | Standard |
|---|---|---|
| Establish keys / protect data in transit | **ML-KEM** | FIPS 203 |
| Sign certificates, code, tokens (default) | **ML-DSA** | FIPS 204 |
| Sign with the most conservative assumptions (firmware, root of trust) | **SLH-DSA** | FIPS 205 |
| Sign where signature size is tightly constrained | **FN-DSA** (not yet final) | FIPS 206 |

## What the standards ask of you

The standards define the algorithms; NIST's transition guidance defines *when*. The short version: inventory first, migrate key establishment first via hybrids, then signatures. That side is covered in [what NIST's migration guidance actually requires](/nist-post-quantum-cryptography-migration-guidance/), and the current status of each standard is tracked in [NIST post-quantum standards: 2026 status](/nist-post-quantum-cryptography-standards-2026/).

## From standards to your stack

Knowing the difference between ML-KEM and ML-DSA is useful; knowing where *your* systems still use their classical predecessors is what an auditor asks for. Start with the surface you can check in a minute: **[read your own TLS handshake](/tls-1-3-post-quantum/#check-your-own-connections)**. The negotiated key-exchange group tells you whether ML-KEM is already protecting that connection; the certificate's signature algorithm tells you how far you are from ML-DSA.

---

*Related: [NIST migration guidance](/nist-post-quantum-cryptography-migration-guidance/) · [Why post-quantum cryptography exists](/what-is-the-purpose-of-post-quantum-cryptography/) · [NIST post-quantum standards: 2026 status](/nist-post-quantum-cryptography-standards-2026/) · [TLS 1.3 post-quantum](/tls-1-3-post-quantum/)*
