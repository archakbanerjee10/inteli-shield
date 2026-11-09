import { Loader2 } from "lucide-react";
import { STEPS } from "../services/mockApi";

export default function ScanProgress({ step }) {
  const current = Math.min(step, STEPS.length - 1);
  const pct = Math.round((step / STEPS.length) * 100);

  return (
    <section className="mx-auto max-w-xl px-4 pb-16 sm:px-6" aria-live="polite">
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 shrink-0 animate-spin text-zinc-300" aria-hidden />
          <div className="min-w-0">
            <p className="text-xs text-zinc-500">
              Step {current + 1} of {STEPS.length}
            </p>
            <p className="truncate text-sm text-zinc-100">{STEPS[current]}...</p>
          </div>
        </div>
        <div
          className="mt-4 h-1 overflow-hidden rounded-full bg-zinc-800"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-zinc-300 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </section>
  );
}
