import { useRef, useState, type FormEvent } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Activity,
  GitBranch,
  Boxes,
  Cloud,
  Database,
  Loader2,
  ArrowRight,
  Terminal,
  Check,
  AlertTriangle,
  Info,
} from "lucide-react";

/* ---- Types (ported from genai/src/routes/api/scan.ts) ---- */

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

export default function LandingPage() {
  const scanRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <NavBar
        onScanClick={() => scanRef.current?.scrollIntoView({ behavior: "smooth" })}
        onLeadClick={() => leadRef.current?.scrollIntoView({ behavior: "smooth" })}
      />
      <Hero
        onScanClick={() => scanRef.current?.scrollIntoView({ behavior: "smooth" })}
        onLeadClick={() => leadRef.current?.scrollIntoView({ behavior: "smooth" })}
      />
      <div ref={scanRef} id="scan">
        <ScanSection />
      </div>
      <HowItWorks />
      <div ref={leadRef}>
        <LeadSection />
      </div>
      <Footer />
    </main>
  );
}

/* ---------------- Nav ---------------- */

function NavBar({
  onScanClick,
  onLeadClick,
}: {
  onScanClick: () => void;
  onLeadClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <PQHorizonMark />
          <span className="font-semibold tracking-tight">PQHorizon</span>
          <span className="hidden text-xs text-muted-foreground font-mono-tight sm:inline">
            / pqc-readiness
          </span>
        </a>
        <nav className="flex items-center gap-2">
          <button
            onClick={onScanClick}
            className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
          >
            Free scan
          </button>
          <button
            onClick={onLeadClick}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Book a full scan
          </button>
        </nav>
      </div>
    </header>
  );
}

function PQHorizonMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-primary"
      aria-hidden
    >
      <path d="M3 7l9-5 9 5-9 5-9-5z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 17l9 5 9-5" />
    </svg>
  );
}

/* ---------------- Hero ---------------- */

function Hero({
  onScanClick,
  onLeadClick,
}: {
  onScanClick: () => void;
  onLeadClick: () => void;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground font-mono-tight">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          NIST IR 8547 · FIPS 203 / 204 · CNSA 2.0 deadline 2029
        </div>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
          Nation-states are recording your encrypted traffic{" "}
          <span className="text-primary">today</span> to decrypt it once quantum
          hardware matures.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          See what breaks before your auditor asks. PQHorizon builds a defensible
          cryptographic inventory and maps every finding to the NIST PQ migration
          standards — before your 2029 deadline turns into a fire drill.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={onScanClick}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Run free PQ scan <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onLeadClick}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
          >
            Book a full scan
          </button>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          <HeroStat label="Harvest-now-decrypt-later" value="Active today" tone="alert" />
          <HeroStat label="Federal PQ deadline" value="2029 (CNSA 2.0)" tone="warn" />
          <HeroStat label="Avg. cert lifetime" value="90–398 days" tone="info" />
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "alert" | "warn" | "info";
}) {
  const dot =
    tone === "alert"
      ? "bg-sev-critical"
      : tone === "warn"
        ? "bg-sev-medium"
        : "bg-sev-info";
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {label}
      </div>
      <div className="mt-2 font-mono-tight text-xl text-foreground">{value}</div>
    </div>
  );
}

/* ---------------- Scan section ---------------- */

const LOADING_STEPS = [
  "Resolving DNS…",
  "Inspecting TLS handshake…",
  "Reading X.509 chain…",
  "Checking key-exchange groups…",
  "Mapping to NIST FIPS 203/204…",
];

function ScanSection() {
  const [domain, setDomain] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    setStepIdx(0);
    const interval = setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, LOADING_STEPS.length - 1));
    }, 700);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Scan failed.");
      } else {
        setResult(data as ScanResult);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  return (
    <section className="relative border-b border-border/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-wider text-primary font-mono-tight">
            01 · Free preview
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Run a real PQ-readiness check on any public domain.
          </h2>
          <p className="mt-3 text-muted-foreground">
            A live TLS handshake from our server. No agents, no credentials, no
            fabricated findings — just what's negotiable over the public
            internet, mapped to NIST migration guidance.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:p-5"
        >
          <label htmlFor="domain" className="sr-only">
            Domain
          </label>
          <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
            <Terminal className="h-4 w-4 text-muted-foreground" aria-hidden />
            <input
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="yourcompany.com"
              required
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className="w-full bg-transparent font-mono-tight text-base outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Scanning…
              </>
            ) : (
              <>
                Run free preview <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden />
          <span>
            The free preview inspects only publicly reachable TLS on port 443.
            No authenticated access is performed, and no scan data is stored.
          </span>
        </p>

        {/* Output */}
        <div className="mt-8">
          {loading && <LoadingPanel stepIdx={stepIdx} />}
          {error && !loading && (
            <div className="rounded-lg border border-sev-critical/40 bg-sev-critical/10 p-4 text-sm">
              <div className="flex items-center gap-2 font-medium text-sev-critical">
                <AlertTriangle className="h-4 w-4" /> Scan failed
              </div>
              <div className="mt-1 text-muted-foreground">{error}</div>
            </div>
          )}
          {result && !loading && <FindingsPanel result={result} />}
        </div>

        {/* Locked categories */}
        <div className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                What a full scan also surfaces
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The free preview is public TLS only. A full PQHorizon scan covers
                your whole crypto footprint with continuous monitoring for
                drift.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <LockedCard
              icon={<GitBranch className="h-5 w-5" />}
              title="Source-repo crypto"
              detail="GitHub / GitLab read-only scan for RSA/ECC usage, hard-coded keys, and pinned-but-classical TLS clients."
            />
            <LockedCard
              icon={<Boxes className="h-5 w-5" />}
              title="Dependency manifests"
              detail="OpenSSL, BoringSSL, libsodium, JCE providers — flagged by version against PQ-capable releases."
            />
            <LockedCard
              icon={<Cloud className="h-5 w-5" />}
              title="Cloud KMS & certs"
              detail="AWS KMS, Azure Key Vault, GCP CMEK. Inventory of key algorithms, cert templates, and ACM/Let's Encrypt usage."
            />
            <LockedCard
              icon={<Database className="h-5 w-5" />}
              title="Harvest-now-decrypt-later"
              detail="Long-lived data exposure track: which datasets remain confidential past 2030 and rely on classical KEX in transit."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function LoadingPanel({ stepIdx }: { stepIdx: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5 font-mono-tight text-sm">
      <div className="flex items-center gap-2 text-primary">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>pqhorizon scan in progress</span>
      </div>
      <ul className="mt-4 space-y-2">
        {LOADING_STEPS.map((step, i) => {
          const done = i < stepIdx;
          const active = i === stepIdx;
          return (
            <li
              key={step}
              className={`flex items-center gap-3 ${
                done
                  ? "text-muted-foreground"
                  : active
                    ? "text-foreground"
                    : "text-muted-foreground/50"
              }`}
            >
              {done ? (
                <Check className="h-3.5 w-3.5 text-sev-ok" />
              ) : active ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-border" />
              )}
              <span>{step}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FindingsPanel({ result }: { result: ScanResult }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      {/* Header */}
      <div className="border-b border-border bg-surface-2 px-5 py-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div className="flex items-center gap-2 font-mono-tight">
            <span className="text-muted-foreground">target:</span>
            <span className="text-foreground">{result.domain}</span>
          </div>
          <div className="text-xs text-muted-foreground font-mono-tight">
            inspected {new Date(result.inspectedAt).toUTCString()}
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-xs font-mono-tight sm:grid-cols-4">
          <KV k="tls" v={result.tlsVersion ?? "—"} />
          <KV k="cipher" v={result.cipher ?? "—"} />
          <KV
            k="pubkey"
            v={
              result.publicKeyAlgorithm
                ? result.publicKeyBits
                  ? `${result.publicKeyAlgorithm}-${result.publicKeyBits}`
                  : result.publicKeyAlgorithm
                : "—"
            }
          />
          <KV k="sigalg" v={result.certSignatureAlgorithm ?? "—"} />
          <KV k="issuer" v={result.issuer ?? "—"} />
          <KV k="subject" v={result.subject ?? "—"} />
          <KV
            k="expires"
            v={
              result.validTo
                ? `${new Date(result.validTo).toISOString().slice(0, 10)} (${result.daysUntilExpiry}d)`
                : "—"
            }
          />
          <KV k="kex-group" v={result.negotiatedGroup ?? "—"} />
        </dl>
      </div>

      {/* Findings */}
      <ul className="divide-y divide-border">
        {result.findings.map((f) => (
          <FindingRow key={f.id} f={f} />
        ))}
      </ul>

      {/* Renewal timeline */}
      {result.validTo && (
        <div className="border-t border-border bg-surface-2 px-5 py-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-mono-tight">
            Certificate renewal timeline
          </div>
          <div className="mt-3">
            <RenewalBar daysUntilExpiry={result.daysUntilExpiry ?? 0} validTo={result.validTo} />
          </div>
        </div>
      )}
    </div>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="truncate text-foreground" title={v}>
        {v}
      </dd>
    </div>
  );
}

function FindingRow({ f }: { f: Finding }) {
  return (
    <li className="px-5 py-4">
      <div className="flex flex-wrap items-start gap-3">
        <SeverityChip severity={f.severity} />
        <div className="min-w-0 flex-1">
          <div className="font-medium text-foreground">{f.title}</div>
          <p className="mt-1 text-sm text-muted-foreground">{f.detail}</p>
          <p className="mt-2 text-xs text-muted-foreground font-mono-tight">
            <span className="text-primary">NIST · </span>
            {f.nistNote}
          </p>
        </div>
      </div>
    </li>
  );
}

function SeverityChip({ severity }: { severity: Severity }) {
  const styles: Record<Severity, string> = {
    Critical: "border-sev-critical/40 bg-sev-critical/15 text-sev-critical",
    High: "border-sev-high/40 bg-sev-high/15 text-sev-high",
    Medium: "border-sev-medium/40 bg-sev-medium/15 text-sev-medium",
    OK: "border-sev-ok/40 bg-sev-ok/15 text-sev-ok",
    Info: "border-sev-info/40 bg-sev-info/15 text-sev-info",
  };
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider font-mono-tight ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}

function RenewalBar({
  daysUntilExpiry,
  validTo,
}: {
  daysUntilExpiry: number;
  validTo: string;
}) {
  const max = Math.max(daysUntilExpiry, 30, 90);
  const pct = Math.max(2, Math.min(100, (Math.max(daysUntilExpiry, 0) / max) * 100));
  const tone =
    daysUntilExpiry < 0
      ? "bg-sev-critical"
      : daysUntilExpiry < 30
        ? "bg-sev-high"
        : daysUntilExpiry < 90
          ? "bg-sev-medium"
          : "bg-sev-ok";
  return (
    <div>
      <div className="flex justify-between text-[11px] text-muted-foreground font-mono-tight">
        <span>today</span>
        <span>{new Date(validTo).toISOString().slice(0, 10)}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-background">
        <div className={`h-full ${tone}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {daysUntilExpiry < 0
          ? "Certificate already expired."
          : `${daysUntilExpiry} days until renewal — use this cycle as your PQ-hybrid pilot anchor.`}
      </div>
    </div>
  );
}

function LockedCard({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="rounded-md bg-surface-2 p-2 text-muted-foreground">{icon}</div>
        <Lock className="h-4 w-4 text-muted-foreground" aria-label="Locked" />
      </div>
      <div className="mt-4 font-medium text-foreground">{title}</div>
      <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs font-mono-tight">
        <span className="text-muted-foreground">findings</span>
        <span className="select-none text-foreground/30 blur-[2px]">— —</span>
      </div>
    </div>
  );
}

/* ---------------- How it works ---------------- */

function HowItWorks() {
  const cards = [
    {
      icon: <Activity className="h-5 w-5" />,
      title: "Discover",
      body: "One read-only scan maps your full cryptographic footprint: TLS endpoints, certs, repos, dependencies, and cloud KMS.",
    },
    {
      icon: <ShieldAlert className="h-5 w-5" />,
      title: "Prioritize",
      body: "Every finding is mapped to NIST FIPS 203/204 and CNSA 2.0 timelines, with a replacement priority — not a 200-page PDF.",
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Stay ready",
      body: "Continuous monitoring catches new certs, repos, and dependencies as they ship. Not a one-time snapshot.",
    },
  ];
  return (
    <section className="border-b border-border/60 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-xs uppercase tracking-wider text-primary font-mono-tight">
          02 · How it works
        </div>
        <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          A defensible inventory, not a hype deck.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.title}
              className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-primary/40"
            >
              <div className="inline-flex rounded-md bg-surface-2 p-2 text-primary">
                {c.icon}
              </div>
              <div className="mt-4 text-lg font-semibold">{c.title}</div>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Lead capture ---------------- */

const TIMELINE_OPTIONS = [
  { value: "rfp", label: "RFP / customer contract" },
  { value: "audit", label: "Audit (SOC 2 / ISO / FedRAMP)" },
  { value: "customer", label: "Customer security requirement" },
  { value: "insurance", label: "Cyber insurance renewal" },
  { value: "planning", label: "Just planning ahead" },
];

function LeadSection() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [timeline, setTimeline] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    setErr(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, timeline }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErr(data.error ?? "Submission failed.");
        setState("err");
      } else {
        setState("ok");
      }
    } catch (e) {
      setErr((e as Error).message);
      setState("err");
    }
  }

  return (
    <section className="border-b border-border/60 py-20">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-xs uppercase tracking-wider text-primary font-mono-tight">
          03 · Full scan
        </div>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Book your full cryptographic inventory.
        </h2>
        <p className="mt-3 text-muted-foreground">
          We'll reach out within one business day to scope a read-only scan
          across your repos, dependencies, and cloud KMS.
        </p>

        {state === "ok" ? (
          <div className="mt-8 rounded-xl border border-sev-ok/40 bg-sev-ok/10 p-6">
            <div className="flex items-center gap-2 font-semibold text-sev-ok">
              <Check className="h-5 w-5" /> Request received
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              A PQHorizon engineer will follow up at <span className="font-mono-tight">{email}</span> within
              one business day. In the meantime, you can share the free preview
              report with your team.
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-8 grid gap-4 rounded-xl border border-border bg-surface p-6"
          >
            <Field label="Work email">
              <input
                type="email"
                required
                value={email}
                maxLength={255}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono-tight text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label="Company">
              <input
                type="text"
                required
                value={company}
                maxLength={120}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme, Inc."
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </Field>
            <Field label="What's forcing your timeline?">
              <select
                required
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="" disabled>
                  Select one
                </option>
                {TIMELINE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            {err && <div className="text-sm text-sev-critical">{err}</div>}
            <button
              type="submit"
              disabled={state === "loading"}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
            >
              {state === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                </>
              ) : (
                <>Request full scan</>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wider text-muted-foreground font-mono-tight">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

/* ---------------- Footer ---------------- */

function Footer() {
  return (
    <footer className="py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <PQHorizonMark />
            <span className="font-semibold tracking-tight">PQHorizon</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Built for teams too small for a six-figure PKI platform, too exposed
            to wait.
          </p>
        </div>

        <nav
          aria-label="Guides"
          className="mt-10 grid grid-cols-1 gap-x-8 gap-y-2 border-t border-border pt-8 text-sm sm:grid-cols-2 lg:grid-cols-3"
        >
          <span className="col-span-full mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Post-quantum guides
          </span>
          {[
            ["/post-quantum-readiness/", "Post-quantum readiness self-check"],
            ["/post-quantum-cryptography-migration-checklist/", "PQC migration checklist"],
            ["/tls-1-3-post-quantum/", "TLS 1.3 post-quantum key exchange"],
            ["/what-is-the-purpose-of-post-quantum-cryptography/", "What is post-quantum cryptography for?"],
            ["/nist-post-quantum-cryptography-standards/", "NIST PQC standards (FIPS 203/204/205)"],
            ["/nist-post-quantum-cryptography-migration-guidance/", "NIST migration guidance"],
            ["/harvest-now-decrypt-later/", "Harvest now, decrypt later"],
            ["/post-quantum-cryptography-for-security-questionnaires/", "PQC on security questionnaires & RFPs"],
            ["/nist-post-quantum-cryptography-standards-2026/", "NIST PQC standards: 2026 status"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="mt-6 border-t border-border pt-6 text-xs text-muted-foreground">
          The free preview inspects only public TLS endpoints, performs no
          authenticated access, and stores no scan data. Not legal or compliance
          advice.
        </div>
      </div>
    </footer>
  );
}
