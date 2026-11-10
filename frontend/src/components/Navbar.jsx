export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-400/15 bg-[#07111f]/70 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5 font-display text-lg font-bold text-slate-100">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
            <path d="M12 2 4 5v6c0 5 3.4 8.6 8 11 4.6-2.4 8-6 8-11V5z" fill="#19b5e8" />
            <path d="m8.5 12 2.5 2.5L16 9.5" stroke="#04202c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Inteli-Shield
        </div>
        <span className="hidden rounded-full border border-slate-400/15 px-3 py-1 text-xs text-slate-400 sm:inline">
          Threat intelligence
        </span>
      </div>
    </header>
  );
}