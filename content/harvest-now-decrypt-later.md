---
title: "Harvest Now, Decrypt Later: The Data You're Losing Today"
slug: harvest-now-decrypt-later
description: "Harvest now, decrypt later explained: which of your data is already at risk from future quantum decryption, and how to defend the key exchange today."
target_keyword: harvest now decrypt later
secondary_keywords:
  - store now decrypt later
  - HNDL attack
  - quantum harvesting
  - retrospective decryption
search_intent: "Reader wants to understand the harvest-now-decrypt-later threat and which of their data is already at risk from it."
word_count: 870
last_updated: 2026-07-04
evergreen: true
---

# Harvest Now, Decrypt Later: Why Your Data Is Already at Risk

The most counterintuitive fact about the quantum threat is this: **you can be breached today by a quantum computer that won't exist for years.** That's the harvest-now-decrypt-later attack (also called store-now-decrypt-later, HNDL, or retrospective decryption). If you retain any data that must stay confidential for a long time, this is the single most important reason to act on post-quantum cryptography now — not in 2030.

This page explains the attack plainly and helps you identify which of *your* data is already exposed.

## How the attack works

There's no exotic mechanism. Three steps:

1. **Harvest.** An adversary records your encrypted data as it crosses the network — TLS sessions, VPN traffic, API calls — or exfiltrates encrypted files and backups. They can't read it yet. They don't need to.
2. **Store.** They keep the ciphertext. Storage is cheap; patience is free.
3. **Decrypt later.** When a cryptographically relevant quantum computer (CRQC) exists, they run Shor's algorithm against the recorded key exchange, recover the session keys, and decrypt everything they saved — retroactively.

The defining property: **the confidentiality of data sent today depends on cryptography being unbroken for the entire time that data must stay secret.** If a quantum computer arrives inside that window, data you sent long before it existed is compromised.

## Why "the computer doesn't exist yet" is the wrong comfort

Most quantum-risk objections assume the threat starts when the CRQC is built. HNDL breaks that assumption. The recording happens now; only the decryption waits. So the relevant question isn't "when will a quantum computer exist?" — it's "how long must this data stay secret, and could a quantum computer exist before that window closes?"

Cryptographer Michele Mosca formalized this as an inequality:

> If **(how long your data must stay secret) + (how long your migration takes)** is greater than **(time until a quantum computer exists)**, you are already too late.

For data with a 7–10+ year confidentiality requirement, and a migration that realistically takes years, that inequality is very plausibly *already true* — regardless of exactly when the CRQC arrives. That's why HNDL turns a future hardware milestone into a present-tense exposure.

## Which of your data is most at risk

HNDL risk is proportional to **retention lifetime × sensitivity × exposure.** The worst quadrant is long-retention, highly sensitive data that traverses or lives on internet-exposed systems. Concretely:

- **Protected health information (PHI).** Medical records stay sensitive for a patient's lifetime and are often retained for decades — a near-worst case, and directly relevant to HIPAA-adjacent risk for smaller healthcare orgs.
- **Financial records.** Account data, transaction history, and PII carry multi-year regulatory retention and long-tail sensitivity.
- **Legal and IP.** Contracts, privileged communications, trade secrets, source code, designs — value and confidentiality can span a decade or more.
- **Government and defense data.** Classified or controlled information with long declassification horizons; the motivating case for HNDL and for standards like CNSA 2.0.
- **Credentials and long-lived keys.** Anything that unlocks *other* data extends the blast radius.

By contrast, data whose sensitivity expires in days — an ephemeral session token, a public press release in transit — carries little HNDL risk. **Retention lifetime is the deciding variable.** If you hold data that must stay secret past roughly 2030, treat it as exposed today.

## What actually defends against it

HNDL targets the **key exchange** in your encrypted connections — the part a quantum computer breaks. The defense is post-quantum key establishment:

- **Deploy hybrid post-quantum key exchange on data in transit.** Moving TLS to `X25519MLKEM768` (see [TLS 1.3 post-quantum](/tls-1-3-post-quantum/)) means recorded sessions can't be retroactively decrypted even by a future quantum computer, because the shared secret is now protected by ML-KEM as well as X25519. This is the highest-leverage HNDL defense and the easiest migration step.
- **Re-protect long-retention data at rest.** For archives and backups that must outlive 2030, migrate the key establishment/wrapping to ML-KEM-based schemes.
- **Prioritize by the Mosca inequality.** Long-retention confidential data on public-facing systems is your top tier — migrate it first.

Note what *doesn't* fully help: rotating symmetric keys or using AES-256 protects the payload cipher, but if the *key exchange* that delivered those keys is classical and recorded, the keys themselves are recoverable. The fix has to reach the key establishment.

## The urgency, in one line

Every day you run classical-only key exchange on long-retention data is a day of ciphertext an adversary can bank against a future decryption. You can't un-send what's already been harvested — but you can stop adding to the pile.

**[Run a free scan](/#scan)** to see whether your public TLS still uses classical-only key exchange — the exact surface HNDL harvests. PQHorizon shows your negotiated key-exchange group and flags where recorded-today traffic is exposed, mapped to the fix. It's the fastest way to find your open HNDL surface and start closing it.

---

*Related: [Post-quantum readiness self-check](/post-quantum-readiness/) · [TLS 1.3 post-quantum key exchange](/tls-1-3-post-quantum/) · [Post-quantum cryptography for security questionnaires](/post-quantum-cryptography-for-security-questionnaires/)*
