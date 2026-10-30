---
title: "TLS 1.3 Post-Quantum: How Hybrid Key Exchange Works"
slug: tls-1-3-post-quantum
description: "How post-quantum key exchange works in TLS 1.3: X25519MLKEM768 (0x11EC), SecP256r1MLKEM768 (0x11EB), and how to check whether your own connections use it."
target_keyword: tls 1.3 post quantum
secondary_keywords:
  - tls post-quantum
  - X25519MLKEM768
  - post-quantum key exchange
  - hybrid tls key exchange
search_intent: "Technical reader wants to understand how post-quantum key exchange works in TLS 1.3 and how to check/enable it — concrete codepoints and mechanics."
word_count: 1400
last_updated: 2026-10-30
evergreen: true
faq:
  - q: "Is TLS 1.3 quantum safe?"
    a: "Not by itself. TLS 1.3 is quantum-resistant only when the handshake negotiates a post-quantum group such as X25519MLKEM768; a TLS 1.3 connection that negotiates plain X25519 or P-256 is still exposed to harvest-now-decrypt-later. Check the negotiated group, not the protocol version."
  - q: "Is TLS 1.2 PQC compliant?"
    a: "No. The IETF's hybrid ML-KEM groups (RFC 10024) are defined for TLS 1.3, so a TLS 1.2 connection falls back to classical ECDHE key exchange. NIST IR 8547 notes that federal agencies must support TLS 1.3 no later than January 2, 2030, partly because it is the practical path to quantum-resistant key establishment."
  - q: "Is AES-256 quantum safe?"
    a: "Yes, as far as NIST is concerned. NIST IR 8547 says approved symmetric algorithms with at least 128 bits of classical security are believed to meet post-quantum security category 1, places AES-256 in category 5, and does not expect a transition away from them. The quantum risk in TLS sits in the key exchange that delivers the AES key, not in AES."
  - q: "Is X25519MLKEM768 FIPS compliant?"
    a: "It can be. RFC 10024 says all of its hybrid groups permit FIPS-approved key derivation; for X25519MLKEM768 the ML-KEM implementation must be the certified component, while SecP256r1MLKEM768 relies on a certified P-256 ECDHE implementation instead. RFC 10024 expects certified implementations to stay more common for P-256 in the coming years, which is why SecP256r1MLKEM768 exists."
  - q: "Does OpenSSL support ML-KEM?"
    a: "Yes, from OpenSSL 3.5.0 (released April 8, 2025). That release added ML-KEM, ML-DSA and SLH-DSA and changed the default TLS key shares to offer X25519MLKEM768 and X25519; OpenSSL 3.4 and earlier do not negotiate ML-KEM groups."
  - q: "What is the difference between X25519MLKEM768 and X25519?"
    a: "X25519MLKEM768 runs X25519 and ML-KEM-768 side by side and combines both secrets, so the session holds unless both are broken; plain X25519 has no post-quantum component. The cost is size: the client's key share grows from 32 bytes to 1,216 bytes."
---

# TLS 1.3 Post-Quantum Key Exchange, Explained

Post-quantum TLS means one thing in practice: the TLS 1.3 handshake negotiates a **hybrid key-exchange group** such as `X25519MLKEM768`, which pairs classical X25519 with the NIST-standardized ML-KEM. If your handshake negotiates that group, recorded traffic can't be decrypted later by a quantum computer; if it negotiates plain `X25519` or `P-256`, it can. This page covers what the hybrid groups are, how to read your own handshake (including the output that misleads people), and how to turn it on.

## What "post-quantum TLS" actually changes

TLS 1.3 protects a session in two cryptographic halves:

- **Key exchange** (how the client and server agree on a shared secret) — traditionally **ECDHE** over X25519 or P-256.
- **Symmetric encryption** (how the agreed secret protects the data) — AES-GCM or ChaCha20-Poly1305.

Only the **key exchange** is broken by a quantum computer. Shor's algorithm defeats the elliptic-curve Diffie-Hellman that establishes the shared secret; NIST's [IR 8547](https://csrc.nist.gov/pubs/ir/8547/final) says approved symmetric algorithms with at least 128-bit classical strength are believed to hold up and does not expect to transition away from them. So "post-quantum TLS" is really "post-quantum *key exchange*." Certificate signatures are a separate, later migration (ML-DSA), because a passively recorded session can be decrypted retroactively but a signature can only be forged in real time — which is why key exchange is the urgent half. This is the [harvest-now-decrypt-later](/harvest-now-decrypt-later/) logic applied to the handshake.

## Why hybrid, not pure post-quantum

The industry did not swap ECDHE for a lone lattice algorithm. Instead, TLS 1.3 uses a **hybrid** key exchange that runs *both* a classical and a post-quantum algorithm and combines their outputs into the shared secret.

The security property is the point: **the session stays secure unless both halves are broken.** If the post-quantum algorithm (still young) turns out to have a flaw, you fall back to classical security. If a quantum computer breaks the classical half, the post-quantum half holds. NIST's [IR 8547](https://csrc.nist.gov/pubs/ir/8547/final) describes TLS 1.3 as "a practical near-term path to quantum-resistant key establishment, including through hybrid key-exchange mechanisms that combine ML-KEM with classical algorithms," and says it will accommodate hybrid key establishment in FIPS 140 validation when one component is NIST-approved.

## The codepoints you'll actually see

Post-quantum key exchange in TLS 1.3 is negotiated as a **named group** in the `supported_groups` and `key_share` extensions. The groups are defined in [RFC 10024](https://www.rfc-editor.org/rfc/rfc10024) and registered in the [IANA TLS Supported Groups registry](https://www.iana.org/assignments/tls-parameters/tls-parameters.xhtml#tls-parameters-8):

| Named group | IANA codepoint | Classical part | Post-quantum part | Notes |
|---|---|---|---|---|
| `X25519MLKEM768` | `0x11EC` (4588) | X25519 | ML-KEM-768 | The only one IANA marks "Recommended"; what Chrome and Cloudflare negotiate |
| `SecP256r1MLKEM768` | `0x11EB` (4587) | NIST P-256 | ML-KEM-768 | For FIPS 140 environments where the certified component is P-256 ECDHE |
| `SecP384r1MLKEM1024` | `0x11ED` (4589) | NIST P-384 | ML-KEM-1024 | Higher security margin; RFC 10024 positions it for high-security FIPS environments |
| `X25519Kyber768Draft00` | `0x6399` (25497) | X25519 | Kyber-768 (pre-standard) | **Obsolete** per IANA — replaced by `X25519MLKEM768` |

**ML-KEM** is the Module-Lattice Key Encapsulation Mechanism standardized as [**NIST FIPS 203**](https://csrc.nist.gov/pubs/fips/203/final) — the finalized form of what was CRYSTALS-Kyber. ML-KEM-768 is security category 3 (comparable to AES-192 key search), and NIST [recommends it as the default parameter set](https://csrc.nist.gov/pubs/ir/8547/final). For how ML-KEM relates to the signature standards, see [ML-KEM vs ML-DSA](/ml-kem-vs-ml-dsa/).

Google moved Chrome from the obsolete `0x6399` Kyber codepoint to `0x11EC` ML-KEM in [Chrome 131](https://security.googleblog.com/2024/09/a-new-path-for-kyber-on-web.html), and Firefox [added `mlkem768x25519` for TLS 1.3 in Firefox 132](https://www.mozilla.org/en-US/firefox/132.0/releasenotes/).

## Check your own connections

From the command line, with **OpenSSL 3.5 or later**:

```
openssl s_client -connect example.com:443 -tls1_3 </dev/null 2>/dev/null \
  | grep -E "Protocol|Cipher is|Temp Key|Negotiated TLS1.3 group|Peer signature type"
```

Read it this way:

- `Negotiated TLS1.3 group: X25519MLKEM768` — hybrid post-quantum key exchange is live.
- `Peer Temp Key: X25519, 253 bits` (or `P-256`) — classical-only key exchange.
- `Peer signature type` — the certificate's signature algorithm, which stays classical (ECDSA or RSA) even when key exchange is post-quantum.

Two output details trip people up. OpenSSL 3.5 prints the hybrid group on a `Negotiated TLS1.3 group` line, not as a temp key, so a grep for `Server Temp Key` alone — the line older guides tell you to look for — never shows it. And the client matters as much as the server: [OpenSSL 3.5.0](https://github.com/openssl/openssl/blob/openssl-3.5/NEWS.md) is the release that added ML-KEM and made `X25519MLKEM768` a default key share. Run `openssl version` first. On 3.4 or earlier, the check can't see post-quantum support even where it exists.

## Reading real results

We ran the command above on 2026-10-30. Three results, three different conclusions.

**1. Hybrid key exchange, classical certificate.** Against `cloudflare.com` with OpenSSL 3.5.7:

```
Peer signature type: ecdsa_secp256r1_sha256
Negotiated TLS1.3 group: X25519MLKEM768
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
```

*Conclusion:* traffic to this endpoint is protected against harvest-now-decrypt-later. The certificate is still signed with ECDSA P-256, so authentication is classical. That's the normal state today and the correct order of migration — but it's not "fully post-quantum," and an inventory should record both facts.

**2. TLS 1.3, still classical.** Against `github.com` with the same OpenSSL 3.5.7 client, which offered `X25519MLKEM768`:

```
Peer signature type: ecdsa_secp256r1_sha256
Peer Temp Key: X25519, 253 bits
New, TLSv1.3, Cipher is TLS_AES_128_GCM_SHA256
```

*Conclusion:* the server chose classical X25519 even though the client offered the hybrid. TLS 1.3 alone is not post-quantum; a TLS 1.3 endpoint that hasn't enabled an ML-KEM group is fully exposed to recorded-traffic decryption.

**3. The failure case: an old client hides the answer.** Against the same `cloudflare.com` from a stock Ubuntu 22.04 OpenSSL 3.0.2:

```
Server Temp Key: X25519, 253 bits
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
```

*Conclusion:* this looks identical to result 2, but the server supports the hybrid; the 3.0.2 client simply never offered it, and a server can only pick a group the client offers. If you record "classical-only" in an inventory from a pre-3.5 client, you may be recording your tooling, not your endpoint. Confirm your client first (`openssl list -kem-algorithms` lists `X25519MLKEM768` on 3.5+).

The same logic applies to TLS 1.2. Forcing `-tls1_2` against `cloudflare.com` negotiated `ECDHE-ECDSA-CHACHA20-POLY1305` with `Peer Temp Key: X25519` — classical, because the hybrid groups in RFC 10024 are defined for TLS 1.3 only.

## How to enable it on your endpoints

- **CDN / edge in front of your site.** The fastest lever. [Cloudflare](https://developers.cloudflare.com/ssl/post-quantum-cryptography/) has deployed `X25519MLKEM768` for visitor connections; check your CDN's post-quantum setting. If your traffic terminates TLS at the edge, enabling it there covers the browser-to-edge hop.
- **Then check the hop behind the edge.** Edge support doesn't make the CDN-to-origin connection post-quantum. Cloudflare's [origin documentation](https://developers.cloudflare.com/ssl/post-quantum-cryptography/pqc-to-origin/) says it prefers post-quantum key agreement *when the origin supports it* — an origin running a pre-3.5 OpenSSL still gets a classical hop, even though browsers see a hybrid handshake at the edge.
- **Your own TLS terminators.** Update to OpenSSL 3.5 or later, then check that any explicit group list in your server config includes `X25519MLKEM768` (and `SecP256r1MLKEM768` for FIPS contexts).
- **Watch the `ClientHello` size.** Per [RFC 10024](https://www.rfc-editor.org/rfc/rfc10024), the client's `X25519MLKEM768` key share is 1,216 bytes, against 32 bytes for X25519 alone. [Cloudflare notes](https://developers.cloudflare.com/ssl/post-quantum-cryptography/pqc-to-origin/) that this typically splits the `ClientHello` across two packets — legal under TLS 1.3, but old middleboxes and load balancers sometimes mishandle it. Validate end-to-end after enabling.
- **Client support drives it.** The server picks from what the client offers. Chrome 131+ already sends an `X25519MLKEM768` key share, so enabling it server-side means real browser sessions start using it right away.

## Where this fits in the bigger migration

Hybrid key exchange is the *first* and easiest phase of a post-quantum migration — it protects data in transit against harvest-now-decrypt-later with minimal disruption. Certificate/signature migration (ML-DSA, FIPS 204) and long-retention data-at-rest come later. See the full sequence in the [migration checklist](/post-quantum-cryptography-migration-checklist/) and which standard does which job in [ML-KEM vs ML-DSA](/ml-kem-vs-ml-dsa/).

**[Run the handshake check](#check-your-own-connections)** against each of your public domains — from an OpenSSL 3.5+ client — and record the negotiated group and certificate signature type. That's the first entry in your inventory.

---

*Related: [Post-quantum readiness self-check](/post-quantum-readiness/) · [ML-KEM vs ML-DSA compared](/ml-kem-vs-ml-dsa/) · [Migration checklist](/post-quantum-cryptography-migration-checklist/)*
