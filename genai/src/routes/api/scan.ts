import { createFileRoute } from "@tanstack/react-router";
import tls from "node:tls";
import { X509Certificate } from "node:crypto";

export type Severity = "Critical" | "High" | "Medium" | "OK" | "Info";

export interface Finding {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
  nistNote: string;
}

export interface ScanResult {
  domain: string;
  tlsVersion: string | null;
  cipher: string | null;
  certSignatureAlgorithm: string | null;
  publicKeyAlgorithm: string | null;
  publicKeyBits: number | null;
  issuer: string | null;
  subject: string | null;
  validFrom: string | null;
  validTo: string | null;
  daysUntilExpiry: number | null;
  negotiatedGroup: string | null;
  hybridPq: boolean;
  findings: Finding[];
  inspectedAt: string;
}

const PQ_GROUPS = [
  "X25519MLKEM768",
  "P256MLKEM768",
  "x25519_kyber768",
  "X25519Kyber768Draft00",
];

function normalizeDomain(input: string): string | null {
  if (!input) return null;
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "");
  d = d.split("/")[0];
  d = d.split("?")[0];
  d = d.split("#")[0];
  d = d.replace(/:\d+$/, "");
  if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/.test(d)) {
    return null;
  }
  if (d.length > 253) return null;
  return d;
}

interface TlsProbe {
  protocol: string | null;
  cipher: string | null;
  cert: tls.PeerCertificate | null;
  ephemeral: { type?: string; name?: string; size?: number } | null;
  error?: string;
}

async function probeTls(host: string, groups?: string): Promise<TlsProbe> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (r: TlsProbe) => {
      if (settled) return;
      settled = true;
      try {
        socket.destroy();
      } catch {
        // ignore
      }
      resolve(r);
    };

    const opts: tls.ConnectionOptions = {
      host,
      port: 443,
      servername: host,
      ALPNProtocols: ["h2", "http/1.1"],
      rejectUnauthorized: false,
    };
    // @ts-expect-error - groups is a valid Node tls option
    if (groups) opts.groups = groups;

    const socket = tls.connect(opts, () => {
      try {
        const cert = socket.getPeerCertificate(true);
        const protocol = socket.getProtocol();
        const cipher = socket.getCipher()?.name ?? null;
        let ephemeral: TlsProbe["ephemeral"] = null;
        try {
          ephemeral = socket.getEphemeralKeyInfo?.() ?? null;
        } catch {
          ephemeral = null;
        }
        finish({ protocol, cipher, cert, ephemeral });
      } catch (e) {
        finish({
          protocol: null,
          cipher: null,
          cert: null,
          ephemeral: null,
          error: (e as Error).message,
        });
      }
    });

    socket.setTimeout(8000, () => {
      finish({
        protocol: null,
        cipher: null,
        cert: null,
        ephemeral: null,
        error: "timeout",
      });
    });

    socket.on("error", (err) => {
      finish({
        protocol: null,
        cipher: null,
        cert: null,
        ephemeral: null,
        error: err.message,
      });
    });
  });
}

function detectPqAlgorithm(name: string | undefined): boolean {
  if (!name) return false;
  const n = name.toUpperCase();
  return n.includes("MLKEM") || n.includes("KYBER");
}

function classifyPublicKey(cert: tls.PeerCertificate): {
  algorithm: string;
  bits: number | null;
} {
  const bits = cert.bits ?? null;
  // Try crypto.createPublicKey on the DER cert to get a reliable asymmetricKeyType.
  if (cert.raw) {
    try {
      const x509 = new X509Certificate(cert.raw);
      const pk = x509.publicKey;
      const t = pk.asymmetricKeyType?.toUpperCase() ?? "";
      if (t === "RSA" || t === "RSA-PSS") return { algorithm: "RSA", bits };
      if (t === "EC") {
        const detail = pk.asymmetricKeyDetails as { namedCurve?: string } | undefined;
        const curve = detail?.namedCurve;
        const label =
          curve === "prime256v1"
            ? "ECDSA-P256"
            : curve === "secp384r1"
              ? "ECDSA-P384"
              : curve === "secp521r1"
                ? "ECDSA-P521"
                : `ECDSA-${curve ?? "unknown"}`;
        return { algorithm: label, bits };
      }
      if (t === "ED25519") return { algorithm: "Ed25519", bits };
      if (t === "ED448") return { algorithm: "Ed448", bits };
      if (t) return { algorithm: t, bits };
    } catch {
      // fall through
    }
  }
  if (bits && bits >= 1024) return { algorithm: "RSA", bits };
  return { algorithm: "unknown", bits };
}

function extractSigAlg(cert: tls.PeerCertificate): string | null {
  if (!cert.raw) return null;
  try {
    const x509 = new X509Certificate(cert.raw);
    const text = x509.toString();
    const m = text.match(/Signature Algorithm:\s*([^\s\n]+)/);
    if (m) return m[1];
  } catch {
    // ignore
  }
  return null;
}

function buildFindings(r: Omit<ScanResult, "findings" | "inspectedAt">): Finding[] {
  const findings: Finding[] = [];

  // TLS version
  if (r.tlsVersion) {
    const v = r.tlsVersion;
    if (v === "TLSv1.3") {
      findings.push({
        id: "tls-version",
        title: "TLS 1.3 negotiated",
        detail: `Server negotiated ${v} with ${r.cipher ?? "unknown cipher"}.`,
        severity: "OK",
        nistNote: "TLS 1.3 is the prerequisite for hybrid post-quantum key exchange (RFC 8446).",
      });
    } else if (v === "TLSv1.2") {
      findings.push({
        id: "tls-version",
        title: "TLS 1.2 only",
        detail: `Server negotiated ${v}. Hybrid PQ key exchange requires TLS 1.3.`,
        severity: "Medium",
        nistNote: "NIST SP 800-52 Rev. 2 requires TLS 1.2+; PQ migration assumes TLS 1.3.",
      });
    } else {
      findings.push({
        id: "tls-version",
        title: `Legacy TLS: ${v}`,
        detail: `Server negotiated ${v}. This protocol is deprecated.`,
        severity: "High",
        nistNote: "NIST SP 800-52 Rev. 2 prohibits TLS < 1.2.",
      });
    }
  }

  // Key exchange / PQ
  if (r.hybridPq) {
    findings.push({
      id: "kex",
      title: "Hybrid post-quantum key exchange detected",
      detail: `Negotiated group: ${r.negotiatedGroup}. Session keys resist a future CRQC.`,
      severity: "OK",
      nistNote:
        "Aligns with NIST IR 8547 transition guidance and draft-ietf-tls-hybrid-design.",
    });
  } else {
    findings.push({
      id: "kex",
      title: "Classical key exchange only",
      detail: r.negotiatedGroup
        ? `Negotiated group: ${r.negotiatedGroup}. No ML-KEM hybrid offered.`
        : "Server did not negotiate a hybrid ML-KEM group when offered.",
      severity: "High",
      nistNote:
        "Session keys are harvestable today and decryptable by a future CRQC. NIST FIPS 203 (ML-KEM) is the migration target.",
    });
  }

  // Public key algorithm
  if (r.publicKeyAlgorithm) {
    const algo = r.publicKeyAlgorithm;
    const bits = r.publicKeyBits;
    const label = bits ? `${algo}-${bits}` : algo;
    const vulnerable = ["RSA", "EC", "DSA", "DH"].some((a) => algo.toUpperCase().includes(a));
    if (vulnerable) {
      findings.push({
        id: "pubkey",
        title: `${label} certificate key is quantum-vulnerable`,
        detail: `Leaf certificate uses ${label}. Shor's algorithm on a CRQC breaks RSA and classical ECC.`,
        severity: "Critical",
        nistNote:
          "Migration target: NIST FIPS 204 (ML-DSA) signatures. Migration is gated on CA support.",
      });
    } else {
      findings.push({
        id: "pubkey",
        title: `${label} certificate key`,
        detail: `Leaf certificate uses ${label}.`,
        severity: "Info",
        nistNote: "Non-classical signature algorithm detected.",
      });
    }
  }

  // Cert signature
  if (r.certSignatureAlgorithm) {
    const sig = r.certSignatureAlgorithm.toUpperCase();
    const vulnerable =
      sig.includes("RSA") || sig.includes("ECDSA") || sig.includes("SHA") && !sig.includes("ML");
    if (vulnerable) {
      findings.push({
        id: "sigalg",
        title: `Certificate signed with ${r.certSignatureAlgorithm}`,
        detail:
          "Signature algorithm is classical. Forging it requires a CRQC, but it is on the deprecation path.",
        severity: "Medium",
        nistNote:
          "PQ certificate migration (ML-DSA / SLH-DSA) is gated on public CA support — track NIST IR 8547.",
      });
    }
  }

  // Expiry
  if (r.daysUntilExpiry != null) {
    if (r.daysUntilExpiry < 0) {
      findings.push({
        id: "expiry",
        title: "Certificate is expired",
        detail: `Expired ${Math.abs(r.daysUntilExpiry)} days ago (${r.validTo}).`,
        severity: "Critical",
        nistNote: "Renewal cycle is the natural insertion point for PQ-ready certs.",
      });
    } else if (r.daysUntilExpiry < 30) {
      findings.push({
        id: "expiry",
        title: `Certificate expires in ${r.daysUntilExpiry} days`,
        detail: `Valid until ${r.validTo}. Renewal is imminent — plan PQ-hybrid issuance now.`,
        severity: "High",
        nistNote: "Use the next renewal to pilot ML-DSA hybrid certs once your CA supports them.",
      });
    } else {
      findings.push({
        id: "expiry",
        title: `Certificate expires in ${r.daysUntilExpiry} days`,
        detail: `Valid until ${r.validTo}. Next renewal is the planning anchor.`,
        severity: "Info",
        nistNote: "Map this renewal date into your PQ migration timeline.",
      });
    }
  }

  return findings;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/scan")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),
      POST: async ({ request }) => {
        let body: { domain?: string };
        try {
          body = await request.json();
        } catch {
          return Response.json(
            { error: "Invalid JSON body." },
            { status: 400, headers: corsHeaders },
          );
        }
        const domain = normalizeDomain(body.domain ?? "");
        if (!domain) {
          return Response.json(
            {
              error:
                "Enter a valid domain like yourcompany.com. Don't include paths or protocols.",
            },
            { status: 400, headers: corsHeaders },
          );
        }

        // Probe twice in parallel: once offering hybrid PQ groups, once with default groups
        // to capture what the server normally negotiates.
        const [pqProbe, defaultProbe] = await Promise.all([
          probeTls(domain, "X25519MLKEM768:P256MLKEM768:X25519:P-256:P-384"),
          probeTls(domain),
        ]);

        const main = defaultProbe.cert ? defaultProbe : pqProbe;
        if (!main.cert) {
          const reason = main.error ?? "unknown error";
          let friendly = `We couldn't complete a TLS handshake with ${domain}.`;
          if (/timeout/i.test(reason)) friendly += " The host did not respond within 8 seconds.";
          else if (/ENOTFOUND|EAI_AGAIN/i.test(reason))
            friendly += " The domain did not resolve in DNS.";
          else if (/ECONNREFUSED/i.test(reason)) friendly += " Port 443 refused the connection.";
          else friendly += ` (${reason})`;
          return Response.json(
            { error: friendly },
            { status: 502, headers: corsHeaders },
          );
        }

        const cert = main.cert;
        const pubkey = classifyPublicKey(cert);
        const validFrom = cert.valid_from ? new Date(cert.valid_from).toISOString() : null;
        const validTo = cert.valid_to ? new Date(cert.valid_to).toISOString() : null;
        const daysUntilExpiry = validTo
          ? Math.floor((new Date(validTo).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : null;

        const pqEphemeralName = pqProbe.ephemeral?.name;
        const defaultEphemeralName = defaultProbe.ephemeral?.name;
        const hybridPq =
          detectPqAlgorithm(pqEphemeralName) || detectPqAlgorithm(defaultEphemeralName);
        const negotiatedGroup =
          pqEphemeralName && PQ_GROUPS.some((g) => pqEphemeralName.toUpperCase().includes(g.toUpperCase().slice(0, 6)))
            ? pqEphemeralName
            : defaultEphemeralName ?? pqEphemeralName ?? null;

        const flatten = (v: string | string[] | undefined | null): string | null =>
          Array.isArray(v) ? v.join(", ") : (v ?? null);
        const issuerCN = flatten(cert.issuer?.CN) ?? flatten(cert.issuer?.O);
        const subjectCN = flatten(cert.subject?.CN);

        const base = {
          domain,
          tlsVersion: main.protocol,
          cipher: main.cipher,
          certSignatureAlgorithm: extractSigAlg(cert),
          publicKeyAlgorithm: pubkey.algorithm,
          publicKeyBits: pubkey.bits,
          issuer: issuerCN,
          subject: subjectCN,
          validFrom,
          validTo,
          daysUntilExpiry,
          negotiatedGroup,
          hybridPq,
        };

        const result: ScanResult = {
          ...base,
          findings: buildFindings(base),
          inspectedAt: new Date().toISOString(),
        };

        return Response.json(result, { headers: corsHeaders });
      },
    },
  },
});
