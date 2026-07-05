---
title: "TLS 1.3 Post-Quantum: How Hybrid Key Exchange Actually Works"
slug: tls-1-3-post-quantum
description: "How post-quantum key exchange works in TLS 1.3: X25519MLKEM768 (0x11EC), P256MLKEM768 (0x11EB), and how to check whether your own connections use it."
target_keyword: tls 1.3 post quantum
secondary_keywords:
  - tls post-quantum
  - X25519MLKEM768
  - post-quantum key exchange
  - hybrid tls key exchange
search_intent: "Technical reader wants to understand how post-quantum key exchange works in TLS 1.3 and how to check/enable it — concrete codepoints and mechanics."
word_count: 900
last_updated: 2026-07-04
evergreen: true
---

# TLS 1.3 Post-Quantum Key Exchange, Explained

If you want to know exactly how post-quantum cryptography plugs into TLS 1.3 — what `X25519MLKEM768` means, why it's a *hybrid*, and how to check whether your own connections use it — this page is the concrete version. No hand-waving; real codepoints and real commands. This is also precisely what our [free scan](/#scan) inspects, so you can read the mechanics here and then see them on your own domain.

## What "post-quantum TLS" actually changes

TLS 1.3 protects a session in two cryptographic halves:

- **Key exchange** (how the client and server agree on a shared secret) — traditionally **ECDHE** over X25519 or P-256.
- **Symmetric encryption** (how the agreed secret protects the data) — AES-GCM or ChaCha20-Poly1305.

Only the **key exchange** is broken by a quantum computer. Shor's algorithm defeats the elliptic-curve Diffie-Hellman that establishes the shared secret; the symmetric layer (AES) is fine. So "post-quantum TLS" is really "post-quantum *key exchange*." Certificate signatures are a separate, later migration (ML-DSA), because a passively recorded session can be decrypted retroactively but a signature can only be forged in real time — which is why key exchange is the urgent half. This is the [harvest-now-decrypt-later](/harvest-now-decrypt-later/) logic applied to the handshake.

## Why hybrid, not pure post-quantum

The industry did not swap ECDHE for a lone lattice algorithm. Instead, TLS 1.3 uses a **hybrid** key exchange that runs *both* a classical and a post-quantum algorithm and combines their outputs into the shared secret.

The security property is the point: **the session stays secure unless both halves are broken.** If the post-quantum algorithm (still young) turns out to have a flaw, you fall back to classical security. If a quantum computer breaks the classical half, the post-quantum half holds. You give up nothing and add quantum resistance. That conservatism is why hybrids are the recommended migration path in NIST's guidance and why browsers deploy them by default.

## The codepoints you'll actually see

Post-quantum key exchange in TLS 1.3 is negotiated as a **named group** in the `supported_groups` extension. The ones that matter:

| Named group | IANA codepoint | Classical part | Post-quantum part | Notes |
|---|---|---|---|---|
| `X25519MLKEM768` | `0x11EC` | X25519 | ML-KEM-768 | The de-facto standard hybrid; default in modern Chrome and Firefox |
| `P256MLKEM768` | `0x11EB` | NIST P-256 (secp256r1) | ML-KEM-768 | For environments requiring a FIPS-validated classical component |
| `X25519Kyber768Draft00` | `0x6399` | X25519 | Kyber-768 (pre-standard) | **Deprecated** — pre-FIPS draft, being phased out |

**ML-KEM** is the Module-Lattice Key Encapsulation Mechanism standardized as **NIST FIPS 203** — the finalized form of what was CRYSTALS-Kyber. The `768` denotes ML-KEM-768, the parameter set targeting roughly the AES-192 security category — the middle, and most widely deployed, option.

If you see `X25519MLKEM768` on a handshake, that connection has quantum-resistant key exchange. If you see bare `X25519` or `P-256`, it does not.

## Check your own connections

From the command line:

```
openssl s_client -connect example.com:443 -tls1_3 </dev/null 2>/dev/null \
  | grep -E "Protocol|Cipher|Server Temp Key"
```

The `Server Temp Key` line reports the negotiated group. `X25519MLKEM768` means hybrid post-quantum key exchange is live; `X25519` or `P-256` means classical-only. (Requires an OpenSSL build with ML-KEM support — recent OpenSSL 3.5+ ships it.)

In a browser, open a site's connection security details / DevTools security panel and look at the key-exchange group on the TLS 1.3 connection.

**This handshake inspection is the core of PQHorizon's free scan.** [Run it against your domain](/#scan) and it decodes the TLS version, cipher, certificate signature algorithm, public-key algorithm, and the negotiated group — then tells you, in plain terms, whether the connection is quantum-exposed and which NIST standard the fix maps to. It's the fastest honest answer to "is my TLS post-quantum?"

## How to enable it on your endpoints

- **CDN / edge in front of your site.** The fastest lever. Cloudflare, for example, negotiates hybrid post-quantum key exchange for eligible client connections; check your CDN's post-quantum setting. If your traffic terminates TLS at the edge, enabling it there covers your public surface immediately.
- **Your own TLS terminators.** Recent OpenSSL (3.5+) and BoringSSL support ML-KEM hybrids. Update the library, then add `X25519MLKEM768` (and `P256MLKEM768` for FIPS contexts) to your configured groups.
- **Watch the `ClientHello` size.** ML-KEM public keys are far larger than an X25519 key, which inflates the handshake. Most stacks handle it, but old middleboxes and size-assuming code occasionally choke — validate end-to-end after enabling.
- **Client support drives it.** The server offers groups; the client picks. Modern Chrome and Firefox already prefer `X25519MLKEM768`, so enabling it server-side means real sessions start using it right away.

## Where this fits in the bigger migration

Hybrid key exchange is the *first* and easiest phase of a post-quantum migration — it protects data in transit against harvest-now-decrypt-later with minimal disruption. Certificate/signature migration (ML-DSA, FIPS 204) and long-retention data-at-rest come later. See the full sequence in the [migration checklist](/post-quantum-cryptography-migration-checklist/) and how NIST frames the standards in [NIST post-quantum standards](/nist-post-quantum-cryptography-standards/).

**[Run a free scan](/#scan)** to see your domain's exact key-exchange group and certificate posture right now — then use it as the first entry in your inventory.

---

*Related: [Post-quantum readiness self-check](/post-quantum-readiness/) · [NIST post-quantum standards](/nist-post-quantum-cryptography-standards/) · [Migration checklist](/post-quantum-cryptography-migration-checklist/)*
