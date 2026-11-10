import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

// Visual only: the real scan runs in App.jsx. This just shows activity while waiting.
const STEPS = [
  "Reading the target",
  "Checking threat feeds",
  "Inspecting the certificate",
  "Analyzing the wording",
  "Building your report",
];

export default function ScanProgress({ target }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1100);
    return () => clearInterval(id);
  }, []);

  const pct = Math.round(((step + 1) / (STEPS.length + 1)) * 100);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6" aria-live="polite">
      <div className="glass relative max-w-2xl overflow-hidden rounded-2xl p-6">
        <div className="sweep absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />
        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-display text-[17px] font-bold">Scanning</h3>
            <span className="max-w-[60%] truncate font-mono text-xs text-slate-400" title={target}>
              {target}
            </span>
          </div>
          <div
            className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-700/50"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-cyan-400 transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-5 space-y-2.5 text-[15px]">
            {STEPS.map((label, i) => (
              <li key={label} className={`flex items-center gap-2.5 ${i > step ? "text-slate-600" : i === step ? "text-slate-100" : "text-slate-400"}`}>
                {i < step ? (
                  <Check className="h-4 w-4 text-emerald-300" aria-hidden />
                ) : i === step ? (
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-300" aria-hidden />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-slate-600" aria-hidden />
                )}
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}