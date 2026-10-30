---
title: "NIST PQC Standards in 2026: Status and Deadlines"
slug: nist-post-quantum-cryptography-standards-2026
description: "Where NIST's post-quantum standards stand in 2026 — FIPS 203/204/205 final, FIPS 206 and HQC pending — and the 2030/2035 dates in the final IR 8547."
target_keyword: nist post-quantum cryptography standards 2026
secondary_keywords:
  - pqc standards status 2026
  - nist post-quantum timeline
  - FIPS 203 204 205 status
  - nist post quantum deadline
  - when will rsa be deprecated
search_intent: "Reader wants the current (2026) status of NIST's post-quantum standards and the migration timeline dates."
word_count: 1150
last_updated: 2026-10-30
evergreen: false
faq:
  - q: "When will FIPS 206 be released?"
    a: "NIST has not announced a date. As of October 2026, its standardization page lists FIPS 206 (FN-DSA, based on FALCON) as in development, so plan around ML-DSA (FIPS 204) for signatures today."
  - q: "When will RSA be deprecated?"
    a: "Under NIST IR 8547, finalized in October 2026, RSA is deprecated after 2030 and disallowed under NIST standards after 2035, at every key size NIST currently approves. Federal high-impact systems face earlier deadlines: post-quantum key establishment by December 31, 2030 and signatures by December 31, 2031."
  - q: "Is post-quantum cryptography ready to use?"
    a: "Yes for the core algorithms: FIPS 203, 204 and 205 have been final since August 13, 2024, OpenSSL 3.5 ships ML-KEM, ML-DSA and SLH-DSA, and Chrome has offered hybrid ML-KEM key exchange since Chrome 131. Signature deployment in public certificates is less mature than key exchange."
  - q: "When will quantum computers break encryption?"
    a: "No one knows, and NIST does not publish a prediction. What matters for planning is that data recorded today can be decrypted later, which is why NIST's transition plan targets completing the migration by 2035 and federal directives set earlier dates for sensitive systems."
  - q: "What is HQC cryptography?"
    a: "HQC is a code-based key-encapsulation mechanism that NIST selected on March 11, 2025 as a backup to ML-KEM, so that a weakness in lattice math would not leave key establishment without a standardized alternative. Its standard is still in development."
---

# NIST Post-Quantum Cryptography Standards: 2026 Status and Timeline

**Time-sensitive — current as of October 2026.** The core post-quantum standards (FIPS 203, 204, 205) are final and stable; FIPS 206 and the backup KEM, HQC, are still in development. The biggest change this year is that NIST's transition plan, [IR 8547](https://csrc.nist.gov/pubs/ir/8547/final), became final on October 27, 2026: quantum-vulnerable public-key algorithms are deprecated after 2030 and disallowed after 2035. For what each standard *does*, see [ML-KEM vs ML-DSA](/ml-kem-vs-ml-dsa/).

## Where the standards stand in 2026

The three core standards have been final since August 2024 and remain the stable targets to plan around:

- **FIPS 203 — ML-KEM** (key establishment). Final. Already deployed in the wild via hybrid TLS key exchange.
- **FIPS 204 — ML-DSA** (primary signatures). Final.
- **FIPS 205 — SLH-DSA** (hash-based signatures). Final.

Still forthcoming:

- **FIPS 206 — FN-DSA** (FALCON, compact lattice signatures). Selected but not yet published; as of October 2026, NIST's [standardization page](https://csrc.nist.gov/projects/post-quantum-cryptography/post-quantum-cryptography-standardization) still lists it as in development.
- **Additional signature schemes.** NIST's "on-ramp" process to diversify signature options beyond lattices is ongoing: [nine candidates advanced to a third round](https://www.nist.gov/news-events/news/2026/05/nine-candidates-advance-third-round-additional-digital-signatures-pqc) in May 2026, a phase NIST expects to last about two years. One of them, HAWK, has since been [withdrawn by its submission team](https://csrc.nist.gov/projects/pqc-dig-sig/round-3-additional-signatures).
- **HQC** was selected on March 11, 2025 as a backup key-establishment mechanism based on different (code-based) math than ML-KEM. At [selection](https://www.nist.gov/news-events/news/2025/03/nist-selects-hqc-fifth-algorithm-post-quantum-encryption), NIST said it planned a draft standard for public comment in about a year and a finalized standard in 2027.

The headline for planning: **the algorithms you migrate to today (ML-KEM, ML-DSA) are settled.** The forthcoming items are additions and hedges, not replacements — they're no reason to wait.

## The timeline that drives your deadline

The migration schedule, not the algorithm list, is what sets your urgency. NIST's final IR 8547 (October 2026) sets it:

- **After 2030 — deprecated.** All quantum-vulnerable public-key algorithms NIST currently approves — RSA, ECDSA, EdDSA, Diffie-Hellman, ECDH — are deprecated after 2030. Deprecated means still usable, but the data owner must weigh the security risk of continuing. This is broader than the November 2024 [draft](https://csrc.nist.gov/pubs/ir/8547/ipd), which put only 112-bit-strength algorithms such as RSA-2048 on the 2030 date.
- **After 2035 — disallowed.** The same algorithms may no longer be used under NIST standards and guidelines. 2035 remains the target for completing the federal migration.
- **Earlier dates for sensitive federal systems.** Per IR 8547, Executive Order 14412 and OMB Memorandum M-26-15 require federal high-value assets and high-impact systems to adopt post-quantum cryptography for key establishment by **December 31, 2030** and for digital signatures by **December 31, 2031**. Agencies must also support TLS 1.3 by **January 2, 2030**.
- **2029 — Google's migration timeline.** In March 2026, Google [announced](https://blog.google/innovation-and-ai/technology/safety-security/cryptography-migration-timeline/) it is "setting a timeline for post-quantum cryptography migration to 2029."
- **CNSA 2.0 milestones** for U.S. national-security systems run on their own schedule ([NSA CNSA 2.0 advisory](https://media.defense.gov/2025/May/30/2003728741/-1/-1/0/CSA_CNSA_2.0_ALGORITHMS.PDF)): new acquisitions must be compliant from January 1, 2027; software/firmware signing and networking equipment must use CNSA 2.0 exclusively by 2030; web browsers/servers, cloud services, and operating systems by 2033.

For a mid-market organization, the operative deadline usually isn't any of these directly — it's your customer's next audit or RFP, which inherits them. That's where [post-quantum questions in security questionnaires](/post-quantum-cryptography-for-security-questionnaires/) come from.

## What's actually deployed in 2026

Post-quantum key exchange is live in production: Chrome has offered the `X25519MLKEM768` hybrid since [Chrome 131](https://security.googleblog.com/2024/09/a-new-path-for-kyber-on-web.html), and [OpenSSL 3.5](https://openssl-library.org/news/openssl-3.5-notes/) offers it in its default TLS key shares (see [TLS 1.3 post-quantum](/tls-1-3-post-quantum/)). If your public endpoints still negotiate classical-only key exchange, you're behind the deployed baseline — and exposed to [harvest now, decrypt later](/harvest-now-decrypt-later/).

## Worked examples

**1. Failure case — planning RSA-3072 to 2035 off the draft.** A team read the 2024 draft of IR 8547, saw that only 112-bit-strength algorithms like RSA-2048 were deprecated in 2030, and scheduled its RSA-3072 code-signing keys for replacement "before 2035." The final IR 8547 deprecates RSA at every approved strength after 2030. **Conclusion:** the keys aren't forbidden in 2031, but they're deprecated, and auditors working from the final document will flag them. Re-plan against the final text, not the draft.

**2. Failure case — "we turned on post-quantum in 2024."** A server enabled the early Kyber hybrid in 2024, which used TLS codepoint `0x6399`. Google's [Kyber-to-ML-KEM notice](https://security.googleblog.com/2024/09/a-new-path-for-kyber-on-web.html) explains that final ML-KEM is incompatible with that Kyber, so Chrome 131 switched to `0x11EC` and dropped `0x6399`. **Conclusion:** that server now negotiates classical-only key exchange with current Chrome, even though its config still says "post-quantum." Check the negotiated group by name — `X25519MLKEM768` — not just whether a PQ option is enabled.

**3. Reading your deadline through a federal customer.** Your product sits in the data path of an agency system rated high-impact. Under the directives cited in IR 8547, that system must use post-quantum key establishment by December 31, 2030 and post-quantum signatures by December 31, 2031. **Conclusion:** your practical deadline is your customer's — 2030 and 2031, not the 2035 disallowance date — and it will show up in their procurement questions well before then.

## What to do with this in 2026

The 2026 status doesn't change the playbook, it sharpens the dates: the standards are final, the tooling ships by default, and the transition plan is no longer a draft. Inventory first, migrate key establishment first via hybrids, then signatures — the sequence in the [NIST migration guidance](/nist-post-quantum-cryptography-migration-guidance/).

**[Check your own TLS handshake](/tls-1-3-post-quantum/#check-your-own-connections)** to see where your public endpoints stand against the 2026 baseline: if browsers negotiate `X25519MLKEM768` with you, you're keeping pace; if you see bare `X25519` or `P-256`, you're behind the deployed state of the art.

---

*Last updated: 2026-10-30. NIST statuses (FIPS 203–206, HQC, IR 8547) checked against NIST CSRC on that date; the NSA CNSA 2.0, Google 2029, and signature on-ramp items were last checked against their sources on 2026-09-22.*

*Related: [ML-KEM vs ML-DSA](/ml-kem-vs-ml-dsa/) · [NIST migration guidance](/nist-post-quantum-cryptography-migration-guidance/) · [Post-quantum readiness self-check](/post-quantum-readiness/)*
