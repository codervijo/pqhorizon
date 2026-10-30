---
title: "Why Post-Quantum Cryptography Exists, in Plain Terms"
slug: what-is-the-purpose-of-post-quantum-cryptography
description: "A plain-language explanation of what post-quantum cryptography is for, what it replaces (RSA, ECC), and why it matters before quantum computers arrive."
target_keyword: what is the purpose of post-quantum cryptography
secondary_keywords:
  - why post-quantum cryptography
  - post-quantum cryptography explained
  - quantum threat to encryption
  - is aes 256 quantum safe
  - is rsa quantum safe
search_intent: "Top-of-funnel reader wants a clear, non-hype explanation of why post-quantum cryptography exists and what problem it solves."
word_count: 1150
last_updated: 2026-10-30
evergreen: true
faq:
  - q: "Is AES-256 quantum safe?"
    a: "NIST's guidance is that current applications can continue to use AES with 128-, 192- or 256-bit keys, because Grover's algorithm is likely to give little or no practical advantage against AES. The quantum risk is in the public-key exchange that delivers the AES key, not in AES itself."
  - q: "Is RSA quantum safe?"
    a: "No. A large quantum computer running Shor's algorithm breaks RSA, and larger keys such as RSA-4096 do not change that outcome. NIST's transition plan deprecates RSA at every approved key size after 2030 and disallows it after 2035."
  - q: "Does post-quantum cryptography exist yet?"
    a: "Yes. NIST published the first three post-quantum standards — ML-KEM, ML-DSA and SLH-DSA — on August 13, 2024, and they run on ordinary computers. OpenSSL 3.5 and Chrome already support them."
  - q: "Why is it called post-quantum cryptography?"
    a: "Because it is designed to stay secure after large quantum computers exist. It is not quantum cryptography: it uses ordinary math on ordinary hardware, just math problems that quantum computers are not known to solve efficiently."
  - q: "Do I need post-quantum encryption?"
    a: "If you hold data that must stay confidential for years, or you sell to organizations bound by federal or NIST timelines, yes — and the work starts with an inventory of where you use RSA and elliptic-curve cryptography. If your data loses its value within days and no customer asks, the urgency is lower, but the 2030 deprecation still applies to the systems you run."
---

# What Is the Purpose of Post-Quantum Cryptography?

The purpose of post-quantum cryptography is to keep encryption working after quantum computers can break the encryption we use today. That's the whole idea in one sentence. The rest of this page explains *why* today's encryption is at risk, *what* post-quantum cryptography replaces, and *why the timing matters now* even though the threatening machine doesn't exist yet.

This is a plain-language explainer for a security or IT lead — no advanced math required.

## The problem it solves

Most secure communication on the internet relies on **public-key cryptography** — algorithms like **RSA** and **elliptic-curve cryptography (ECDSA, ECDH)**. These make two things possible: agreeing on a secret key over an open network (so your traffic can be encrypted) and proving identity with digital signatures (so you know a website or a software update is genuine).

The security of RSA and ECC rests on math problems that are effectively impossible for today's computers — factoring huge numbers, or solving elliptic-curve discrete logarithms. A large-scale quantum computer running **Shor's algorithm** solves exactly those problems efficiently. When such a machine exists, RSA and ECC stop protecting anything.

**Post-quantum cryptography (PQC)** is a new generation of public-key algorithms built on *different* math problems — primarily structured lattices — that neither classical *nor* quantum computers are known to solve efficiently. Same jobs (key exchange, signatures), different foundations, designed to survive quantum attack. PQC runs on the ordinary computers you already have; it is not "quantum cryptography" and needs no quantum hardware.

## What is and isn't at risk

A useful distinction, because "quantum breaks encryption" is only half true:

- **Public-key crypto — broken.** RSA, ECDSA, ECDH, Diffie-Hellman. This is what PQC replaces.
- **Symmetric crypto — mostly fine.** AES and hash functions (SHA-2, SHA-3) are only modestly weakened (by Grover's algorithm) and stay secure with adequate key sizes — NIST's [post-quantum FAQ](https://csrc.nist.gov/projects/post-quantum-cryptography/faqs) says current applications can continue to use AES with 128-, 192-, or 256-bit keys. You don't replace these.

So the purpose of PQC is narrow and specific: shore up the *public-key* layer — the part that establishes keys and proves identity.

## Why it matters now, before the quantum computer arrives

The natural objection is: "If the machine doesn't exist yet, why act?" Three reasons:

- **Harvest now, decrypt later.** An adversary can record your encrypted data *today* and simply store it until a quantum computer can decrypt it. Anything that must stay confidential for years — health records, financial data, legal files, trade secrets — is effectively exposed the moment it crosses the wire, even though the decryption happens later. That's the sharpest reason to act early, and we cover it in depth in [harvest now, decrypt later](/harvest-now-decrypt-later/).
- **Migration is slow.** Replacing cryptography across certificates, protocols, code-signing, and hardware takes years for a real organization. You have to start well before the threat lands.
- **The standards and deadlines already exist.** In August 2024, NIST [published the first finished post-quantum standards](https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards) (FIPS 203, 204, and 205), so the replacement algorithms are ready. And the deadlines are now final: NIST's transition plan, [IR 8547](https://csrc.nist.gov/pubs/ir/8547/final) (October 2026), deprecates quantum-vulnerable public-key algorithms after 2030 and disallows them after 2035. Google has separately [set 2029 as its own timeline](https://blog.google/innovation-and-ai/technology/safety-security/cryptography-migration-timeline/) for post-quantum migration.

## The tools of post-quantum cryptography

NIST standardized the first PQC algorithms as Federal Information Processing Standards:

- **ML-KEM (FIPS 203)** — key establishment. Replaces the key-exchange role of ECDH/RSA. Based on CRYSTALS-Kyber.
- **ML-DSA (FIPS 204)** — digital signatures. Replaces ECDSA/RSA signatures. Based on CRYSTALS-Dilithium.
- **SLH-DSA (FIPS 205)** — a hash-based signature alternative with very conservative security assumptions, based on SPHINCS+.

How the first two differ — and why you need both — is covered in [ML-KEM vs ML-DSA](/ml-kem-vs-ml-dsa/). In practice the first place most organizations meet them is TLS: Chrome has offered a hybrid ML-KEM key exchange since [Chrome 131](https://security.googleblog.com/2024/09/a-new-path-for-kyber-on-web.html) (see [TLS 1.3 post-quantum](/tls-1-3-post-quantum/)).

## Worked examples

**1. Failure case — "our VPN uses AES-256, so we're quantum-safe."** The tunnel encrypts traffic with AES-256, which NIST says remains fine. But the AES key was agreed using a classical elliptic-curve Diffie-Hellman exchange at the start of the session. An adversary who recorded that session can later use a quantum computer to break the key exchange, recover the AES key, and decrypt everything. **Conclusion:** the strength of the bulk cipher doesn't help if the key exchange that delivered it is classical. The post-quantum fix has to reach the key exchange.

**2. Sorting one web connection into "replace" and "keep."** Take a typical HTTPS connection: X25519 key exchange, an ECDSA P-256 certificate, AES-256-GCM for the data, SHA-256 inside the signatures. X25519 → replace (with hybrid ML-KEM). ECDSA → replace (with ML-DSA, later). AES-256-GCM → keep. SHA-256 → keep. **Conclusion:** post-quantum migration touches two of the four pieces — the public-key ones — which is why it's a targeted project rather than a rewrite of all your encryption.

**3. Why the timing matters even though the machine isn't here.** Suppose a record you send today must stay confidential for ten years, and your migration will take three. If a quantum computer capable of breaking your key exchange arrives any time in the next decade, that record is exposed, and anything you send during the three migration years adds to the pile. **Conclusion:** the question isn't "when will the computer exist?" but "how long must my data stay secret, and how long will my migration take?" — the reasoning behind [harvest now, decrypt later](/harvest-now-decrypt-later/).

## What this means for you

If you run security or IT, the purpose of post-quantum cryptography translates into a practical mandate: know where you use RSA and ECC, protect anything with a long confidentiality lifetime first, and move to the NIST algorithms — starting with hybrid key exchange, which adds quantum resistance without giving up today's security.

You don't have to become a cryptographer to begin. The first useful step is simply seeing your current posture.

**[Check your own TLS handshake](/tls-1-3-post-quantum/#check-your-own-connections)** to see whether your public TLS is already quantum-exposed and where your migration starts. It's one command — and the first concrete step from "I understand the purpose" to "I know my exposure." From there, the [post-quantum readiness self-check](/post-quantum-readiness/) walks you through the rest.

---

*Related: [The NIST algorithms compared](/ml-kem-vs-ml-dsa/) · [Harvest now, decrypt later](/harvest-now-decrypt-later/) · [Post-quantum readiness self-check](/post-quantum-readiness/)*
