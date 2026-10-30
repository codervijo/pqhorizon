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
last_updated: 2026-10-30
evergreen: true
faq:
  - q: "Is harvest now, decrypt later a real threat or a theoretical one?"
    a: "NIST treats it as real and current. Its final transition report, NIST IR 8547 (October 2026), describes adversaries collecting encrypted data now to decrypt once quantum technology matures, and calls this one of the main reasons the post-quantum transition is urgent."
  - q: "Is AES-256 quantum safe?"
    a: "Yes, as far as anyone knows. NIST's post-quantum FAQ says Grover's algorithm gives little or no practical advantage against AES and that AES-128, AES-192 and AES-256 remain safe. The harvest-now risk is not the AES cipher but the RSA or elliptic-curve key exchange that delivered the AES key."
  - q: "When will quantum computers break encryption?"
    a: "No one can give a reliable date, and NIST does not publish one. That is why the useful question is how long your data must stay secret plus how long your migration takes, not when the machine arrives."
  - q: "Is SSH vulnerable to store now, decrypt later?"
    a: "Only when the session uses a classical key exchange. OpenSSH has used a post-quantum hybrid key exchange by default since version 9.0, switched the default to mlkem768x25519-sha256 in 10.0, and version 10.1 warns when a non-post-quantum scheme is negotiated. Old servers, old clients and hard-coded KexAlgorithms settings are where recorded sessions remain exposed."
  - q: "Do I need a quantum-safe SSH key to stop harvest now, decrypt later?"
    a: "No. SSH host and user keys are signature keys, and NIST IR 8547 notes that signatures are not vulnerable to harvest-now attacks because a forgery has to happen in real time. What protects recorded sessions is the key exchange, so check the negotiated KexAlgorithm before replacing keys."
---

# Harvest Now, Decrypt Later: Why Your Data Is Already at Risk

The most counterintuitive fact about the quantum threat is this: **you can be breached today by a quantum computer that won't exist for years.** That's the harvest-now-decrypt-later attack (also called store-now-decrypt-later, HNDL, or retrospective decryption). If you retain any data that must stay confidential for a long time, this is the single most important reason to act on post-quantum cryptography now, not when the hardware arrives. NIST's final transition report, [IR 8547](https://doi.org/10.6028/NIST.IR.8547) (October 2026), calls it "one of the main reasons why the transition to post-quantum cryptography is urgent."

This page explains the attack plainly and helps you identify which of *your* data is already exposed.

## How the attack works

There's no exotic mechanism. Three steps:

1. **Harvest.** An adversary records your encrypted data as it crosses the network — TLS sessions, VPN traffic, API calls — or exfiltrates encrypted files and backups. They can't read it yet. They don't need to.
2. **Store.** They keep the ciphertext. Storage is cheap; patience is free.
3. **Decrypt later.** When a cryptographically relevant quantum computer (CRQC) exists, they run Shor's algorithm against the recorded key exchange, recover the session keys, and decrypt everything they saved — retroactively.

The defining property: **the confidentiality of data sent today depends on cryptography being unbroken for the entire time that data must stay secret.** If a quantum computer arrives inside that window, data you sent long before it existed is compromised.

## Why "the computer doesn't exist yet" is the wrong comfort

Most quantum-risk objections assume the threat starts when the CRQC is built. HNDL breaks that assumption. The recording happens now; only the decryption waits. So the relevant question isn't "when will a quantum computer exist?" — it's "how long must this data stay secret, and could a quantum computer exist before that window closes?"

Cryptographer Michele Mosca formalized this as an inequality, which NIST restates in [IR 8547](https://doi.org/10.6028/NIST.IR.8547):

> If **X** (how long your data must stay secret) + **Y** (how long your migration takes) is greater than **Z** (time until a cryptanalytically relevant quantum computer exists), data you protect today will be exposed.

Nobody knows Z. You don't need it to act: X is set by your data, Y by your organization, and IR 8547 notes that previous cryptographic transitions have taken 10 to 20 years. That makes X + Y large for almost any long-lived data, which is why NIST concludes that "even if quantum computers are a decade away, organizations must begin the migration to post-quantum cryptography today."

## Working the inequality: three examples

The inputs below are illustrative, chosen to show how the reasoning works. They are not predictions of when a quantum computer will exist.

**Patient records on a portal.** A clinic's patient portal serves records about adults who will be alive for decades. Take X = 30 years and Y = 5 years for a small IT team: X + Y = 35. Portal traffic recorded today is readable if a quantum computer arrives at any point in the next 35 years. Unless you would bet that Z is more than 35 years, this traffic is your top tier. Put hybrid key exchange on the portal first.

**One-time login codes.** A six-digit code that expires in five minutes has X ≈ 0. By the time anyone could decrypt a recorded copy, it unlocks nothing. Conclusion: this traffic doesn't need HNDL priority. It migrates on the normal schedule with everything else.

**The failure case: planning to the compliance date.** A vendor reads that NIST disallows quantum-vulnerable algorithms after 2035 and schedules its key-exchange migration for 2034. Its customer contracts and pricing stay sensitive for X = 7 years. Every session sent between now and 2034 still uses classical key exchange. Traffic recorded in 2026 has to stay secret until 2033, and traffic recorded in 2034 until 2041. The disallowance date says when the algorithm stops being acceptable. It says nothing about when recorded traffic becomes readable. Conclusion: schedule HNDL-exposed links by X + Y, not by the compliance deadline.

## Which of your data is most at risk

HNDL risk is proportional to **retention lifetime × sensitivity × exposure.** The worst quadrant is long-retention, highly sensitive data that traverses or lives on internet-exposed systems. Concretely:

- **Protected health information (PHI).** Medical records stay sensitive for a patient's lifetime, and [NIST IR 8547](https://doi.org/10.6028/NIST.IR.8547) names them alongside government secrets as data with long-term sensitivity — a near-worst case, and directly relevant to HIPAA-adjacent risk for smaller healthcare orgs.
- **Financial records.** Account data, transaction history, and PII carry multi-year regulatory retention and long-tail sensitivity.
- **Legal and IP.** Contracts, privileged communications, trade secrets, source code, designs — value and confidentiality can span a decade or more.
- **Government and defense data.** Classified or controlled information with long declassification horizons; the motivating case for HNDL and for standards like CNSA 2.0.
- **Credentials and long-lived keys.** Anything that unlocks *other* data extends the blast radius.

By contrast, data whose sensitivity expires in days — an ephemeral session token, a public press release in transit — carries little HNDL risk. **Retention lifetime is the deciding variable.** Federal guidance offers a usable bar: as summarized in [NIST IR 8547](https://doi.org/10.6028/NIST.IR.8547), OMB Memorandum M-26-15 tells agencies to prioritize systems holding data "expected to remain mission-sensitive in 2030." If your data clears that bar, treat it as exposed today.

## What actually defends against it

HNDL targets the **key exchange** in your encrypted connections — the part a quantum computer breaks. The defense is post-quantum key establishment:

- **Deploy hybrid post-quantum key exchange on data in transit.** Moving TLS to `X25519MLKEM768`, standardized in [RFC 10024](https://datatracker.ietf.org/doc/rfc10024/) (see [TLS 1.3 post-quantum](/tls-1-3-post-quantum/)), means recorded sessions can't be retroactively decrypted even by a future quantum computer, because the shared secret is now protected by ML-KEM as well as X25519. This is the highest-leverage HNDL defense and the easiest migration step.
- **Re-protect long-retention data at rest.** For archives and backups that must stay confidential for years, migrate the key establishment/wrapping to ML-KEM-based schemes.
- **Check SSH, too.** OpenSSH has negotiated a post-quantum hybrid key exchange by default since 9.0 and made `mlkem768x25519-sha256` the default in 10.0; [OpenSSH 10.1 warns](https://www.openssh.org/pq.html) when a session falls back to a non-post-quantum scheme. Old servers and pinned `KexAlgorithms` settings are where recorded admin sessions stay exposed.
- **Prioritize by the Mosca inequality.** Long-retention confidential data on public-facing systems is your top tier — migrate it first.

Note what *doesn't* fully help: rotating symmetric keys or using AES-256 protects the payload cipher, but if the *key exchange* that delivered those keys is classical and recorded, the keys themselves are recoverable. The fix has to reach the key establishment.

## The urgency, in one line

Every day you run classical-only key exchange on long-retention data is a day of ciphertext an adversary can bank against a future decryption. You can't un-send what's already been harvested — but you can stop adding to the pile.

**[Check your own TLS handshake](/tls-1-3-post-quantum/#check-your-own-connections)** to see whether your public endpoints still use classical-only key exchange — the exact surface HNDL harvests. One `openssl` command shows the negotiated key-exchange group; if it isn't a hybrid like `X25519MLKEM768`, recorded-today traffic on that endpoint is exposed.

---

*Related: [Post-quantum readiness self-check](/post-quantum-readiness/) · [TLS 1.3 post-quantum key exchange](/tls-1-3-post-quantum/) · [Post-quantum cryptography for security questionnaires](/post-quantum-cryptography-for-security-questionnaires/)*
