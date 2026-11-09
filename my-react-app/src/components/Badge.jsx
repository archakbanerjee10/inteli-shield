const TONES = {
  safe: "bg-emerald-950/40 text-emerald-400 border-emerald-900/60",
  warn: "bg-amber-950/40 text-amber-400 border-amber-900/60",
  crit: "bg-rose-950/40 text-rose-400 border-rose-900/60",
};

export const TONE_BAR = {
  safe: "bg-emerald-500/80",
  warn: "bg-amber-500/80",
  crit: "bg-rose-500/80",
};

export default function Badge({ tone = "safe", className = "", children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
