const TONES = {
  safe: "bg-emerald-400/10 text-emerald-300 border-emerald-400/25",
  warn: "bg-amber-400/10 text-amber-300 border-amber-400/25",
  crit: "bg-rose-400/10 text-rose-300 border-rose-400/25",
};

export const TONE_BAR = {
  safe: "bg-emerald-400",
  warn: "bg-amber-400",
  crit: "bg-rose-400",
};

export default function Badge({ tone = "safe", className = "", children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-[13px] font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}