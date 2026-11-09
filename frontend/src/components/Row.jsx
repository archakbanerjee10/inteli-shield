export default function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-zinc-800/70 py-2 text-sm last:border-0">
      <span className="text-zinc-400">{label}</span>
      <span className="min-w-0 break-words text-right text-zinc-100">{children}</span>
    </div>
  );
}
