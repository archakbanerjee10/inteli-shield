import { useEffect, useState } from "react";
import { AlertTriangle, BrainCircuit, Check, CheckCircle2, Copy, Link2, Lock, XCircle } from "lucide-react";
import Badge, { TONE_BAR } from "./Badge";
import Card from "./Card";
import Row from "./Row";

const TONE_ICON = { safe: CheckCircle2, warn: AlertTriangle, crit: XCircle };
const TONE_TEXT = { safe: "text-emerald-300", warn: "text-amber-300", crit: "text-rose-300" };
const TONE_RING = { safe: "glow-safe", warn: "glow-warn", crit: "glow-crit" };
const TONE_STEP = {
  safe: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  warn: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  crit: "border-rose-400/25 bg-rose-400/10 text-rose-300",
};

// Display-only check: raw text (an SMS, a sentence) has no domain or certificate to look up.
const looksLikeDomain = (t = "") => /^(https?:\/\/)?[^\s/]+\.[a-z]{2,}(:\d+)?([/?#]\S*)?$/i.test(t.trim());

function CopyButton({ text }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button type="button" onClick={copy} aria-label="Copy full report hash" className="ml-2 rounded p-1 text-slate-500 transition-colors hover:text-slate-200">
      {done ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

function VerdictCard({ result }) {
  const Icon = TONE_ICON[result.tone];
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setW(result.confidence));
    return () => cancelAnimationFrame(id);
  }, [result.confidence]);

  return (
    <Card className={`md:col-span-2 lg:col-span-3 ${TONE_RING[result.tone]}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge tone={result.tone} className="px-3 py-1 text-sm">
          <Icon className="h-4 w-4" aria-hidden />
          {result.verdict}
        </Badge>
        <span className="max-w-full truncate font-mono text-xs text-slate-400" title={result.target}>
          {result.target}
        </span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-slate-400">Confidence</span>
          <span className="font-display text-3xl font-bold text-slate-50">{result.confidence}%</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-slate-700/50"
          role="meter"
          aria-valuenow={result.confidence}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full rounded-full transition-[width] duration-1000 ease-out ${TONE_BAR[result.tone]}`}
            style={{ width: `${w}%` }}
          />
        </div>
      </div>

      <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-slate-300">{result.summary}</p>

      <div className="mt-5 grid gap-x-8 sm:grid-cols-2">
        <Row label="Report hash">
          <span className="inline-flex items-center font-mono text-xs">
            {result.hash.slice(0, 10)}...{result.hash.slice(-6)}
            <CopyButton text={result.hash} />
          </span>
        </Row>
        <Row label="Scanned at (UTC)">
          <span className="font-mono text-xs">{result.scannedAt.replace("T", " ").slice(0, 19)}</span>
        </Row>
      </div>
    </Card>
  );
}

function DomainCard({ domain }) {
  return (
    <Card icon={Link2} title="URL & domain intelligence">
      <Row label="Typosquatting">
        <Badge tone={domain.typosquat.tone}>{domain.typosquat.label}</Badge>
      </Row>
      <Row label="Closest brand">
        <span className="font-mono text-xs">{domain.lookalike}</span>
      </Row>
      <Row label="Levenshtein distance">
        <span className="font-mono text-xs">{domain.distance}</span>
        {domain.distance > 0 && domain.distance <= 2 && <Badge tone="crit" className="ml-2">Flagged</Badge>}
      </Row>
      <Row label="Domain age">{domain.age}</Row>

      <p className="mb-2 mt-5 text-sm text-slate-400">Threat feed matches</p>
      <ul>
        {domain.feeds.map((feed) => (
          <li key={feed.name} className="flex items-center justify-between border-b border-slate-400/15 py-2 text-[15px] last:border-0">
            <span className="text-slate-300">{feed.name}</span>
            <Badge tone={feed.hit ? "crit" : "safe"}>{feed.hit ? "Listed" : "Clear"}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function TlsCard({ tls }) {
  return (
    <Card icon={Lock} title="TLS certificate & trust chain">
      <Row label="Issuer">{tls.issuer}</Row>
      <Row label="Validity">{tls.validity}</Row>

      {tls.findings.length > 0 && (
        <ul className="mt-4 space-y-2">
          {tls.findings.map((finding) => {
            const Icon = TONE_ICON[finding.tone];
            return (
              <li key={finding.text} className="flex gap-2.5 rounded-lg bg-slate-900/40 p-3 text-sm text-slate-300">
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${TONE_TEXT[finding.tone]}`} aria-hidden />
                {finding.text}
              </li>
            );
          })}
        </ul>
      )}

      <p className="mb-2 mt-5 text-sm text-slate-400">Security headers</p>
      <ul>
        {tls.headers.map((header) => (
          <li key={header.name} className="flex items-center justify-between gap-2 border-b border-slate-400/15 py-2 last:border-0">
            <span className="truncate font-mono text-xs text-slate-300">{header.name}</span>
            <Badge tone={header.present ? "safe" : "warn"}>{header.present ? "Present" : "Missing"}</Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function SkippedCard() {
  return (
    <Card icon={Link2} title="Domain & certificate checks" className="md:col-span-2">
      <p className="text-[15px] text-slate-400">
        Skipped. This input is plain text rather than a URL or domain, so there’s no domain or certificate to look up.
      </p>
    </Card>
  );
}

function SocialCard({ social }) {
  return (
    <Card icon={BrainCircuit} title="AI social engineering analyzer" className="md:col-span-2 lg:col-span-1">
      <p className="break-words text-sm italic leading-relaxed text-slate-400">{social.excerpt}</p>

      <p className="mb-2 mt-5 text-sm text-slate-400">Psychological hooks</p>
      <div className="flex flex-wrap gap-2">
        {social.hooks.length ? (
          social.hooks.map((hook) => <Badge key={hook} tone="warn">{hook}</Badge>)
        ) : (
          <Badge tone="safe">None detected</Badge>
        )}
      </div>

      <p className="mb-2 mt-5 text-sm text-slate-400">Brand impersonation</p>
      <div className="flex flex-wrap gap-2">
        {social.brands.length ? (
          social.brands.map((brand) => <Badge key={brand} tone="crit">Impersonates {brand}</Badge>)
        ) : (
          <Badge tone="safe">None detected</Badge>
        )}
      </div>
    </Card>
  );
}

function RemediationCard({ steps, tone }) {
  return (
    <Card title="Recommended actions" className="md:col-span-2 lg:col-span-3">
      <ol className="space-y-3">
        {steps.map((text, i) => (
          <li key={text} className="flex gap-3 text-[15px] text-slate-300">
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${TONE_STEP[tone === "safe" ? "safe" : "crit"]}`}>
              {i + 1}
            </span>
            <span className="leading-relaxed">{text}</span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export default function ResultsDashboard({ result }) {
  const showDomain = looksLikeDomain(result.target) || result.tls.findings.length > 0;
  return (
    <section className="rise mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <VerdictCard result={result} />
        {showDomain ? (
          <>
            <DomainCard domain={result.domain} />
            <TlsCard tls={result.tls} />
          </>
        ) : (
          <SkippedCard />
        )}
        <SocialCard social={result.social} />
        <RemediationCard steps={result.remediation} tone={result.tone} />
      </div>
    </section>
  );
}