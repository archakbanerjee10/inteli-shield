import { AlertTriangle, BrainCircuit, CheckCircle2, Link2, Lock, XCircle } from "lucide-react";
import Badge, { TONE_BAR } from "./Badge";
import Card from "./Card";
import Row from "./Row";

const TONE_ICON = { safe: CheckCircle2, warn: AlertTriangle, crit: XCircle };
const TONE_TEXT = { safe: "text-emerald-400", warn: "text-amber-400", crit: "text-rose-400" };

function VerdictCard({ result }) {
  const Icon = TONE_ICON[result.tone];
  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge tone={result.tone} className="px-3 py-1 text-sm tracking-wide">
          <Icon className="h-4 w-4" aria-hidden />
          {result.verdict}
        </Badge>
        <span className="max-w-full truncate font-mono text-xs text-zinc-500" title={result.target}>
          {result.target}
        </span>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-baseline justify-between text-sm">
          <span className="text-zinc-400">Confidence</span>
          <span className="font-mono text-lg text-zinc-100">{result.confidence}%</span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-full bg-zinc-800"
          role="meter"
          aria-valuenow={result.confidence}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className={`h-full ${TONE_BAR[result.tone]}`} style={{ width: `${result.confidence}%` }} />
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-zinc-300">{result.summary}</p>

      <div className="mt-5 grid gap-x-8 sm:grid-cols-2">
        <Row label="Report hash">
          <span className="font-mono text-xs">
            {result.hash.slice(0, 10)}...{result.hash.slice(-6)}
          </span>
        </Row>
        <Row label="Scanned at (UTC)">
          <span className="font-mono text-xs">
            {result.scannedAt.replace("T", " ").slice(0, 19)}
          </span>
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
        {domain.distance > 0 && domain.distance <= 2 && (
          <Badge tone="crit" className="ml-2">Flagged</Badge>
        )}
      </Row>
      <Row label="Domain age">{domain.age}</Row>

      <p className="mb-2 mt-4 text-xs text-zinc-500">Threat feed matches</p>
      <ul className="space-y-1.5">
        {domain.feeds.map((feed) => (
          <li key={feed.name} className="flex items-center justify-between text-sm">
            <span className="text-zinc-300">{feed.name}</span>
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

      <ul className="mt-4 space-y-2">
        {tls.findings.map((finding) => {
          const Icon = TONE_ICON[finding.tone];
          return (
            <li key={finding.text} className="flex gap-2 text-sm text-zinc-300">
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${TONE_TEXT[finding.tone]}`} aria-hidden />
              {finding.text}
            </li>
          );
        })}
      </ul>

      <p className="mb-2 mt-4 text-xs text-zinc-500">Security headers</p>
      <ul className="space-y-1.5">
        {tls.headers.map((header) => (
          <li key={header.name} className="flex items-center justify-between gap-2 text-sm">
            <span className="truncate font-mono text-xs text-zinc-300">{header.name}</span>
            <Badge tone={header.present ? "safe" : "warn"}>
              {header.present ? "Present" : "Missing"}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function SocialCard({ social }) {
  return (
    <Card icon={BrainCircuit} title="AI social engineering analyzer" className="md:col-span-2 lg:col-span-1">
      <p className="text-sm italic leading-relaxed text-zinc-400">{social.excerpt}</p>

      <p className="mb-2 mt-4 text-xs text-zinc-500">Psychological hooks</p>
      <div className="flex flex-wrap gap-2">
        {social.hooks.length ? (
          social.hooks.map((hook) => <Badge key={hook} tone="warn">{hook}</Badge>)
        ) : (
          <Badge tone="safe">None detected</Badge>
        )}
      </div>

      <p className="mb-2 mt-4 text-xs text-zinc-500">Brand impersonation</p>
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
          <li key={text} className="flex gap-3 text-sm text-zinc-300">
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                tone === "safe"
                  ? "border-emerald-900/60 bg-emerald-950/40 text-emerald-400"
                  : "border-rose-900/60 bg-rose-950/40 text-rose-400"
              }`}
            >
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
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <VerdictCard result={result} />
        <DomainCard domain={result.domain} />
        <TlsCard tls={result.tls} />
        <SocialCard social={result.social} />
        <RemediationCard steps={result.remediation} tone={result.tone} />
      </div>
    </section>
  );
}
