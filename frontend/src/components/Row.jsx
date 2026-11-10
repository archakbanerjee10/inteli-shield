export default function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-400/15 py-2.5 text-[15px] last:border-0">
      <span className="text-slate-400">{label}</span>
      <span className="min-w-0 break-words text-right text-slate-100">{children}</span>
    </div>
  );
}