import { ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6">
        <div className="flex items-center gap-2 font-semibold tracking-tight text-zinc-100">
          <ShieldCheck className="h-5 w-5" aria-hidden />
          Inteli-Shield
        </div>
      </div>
    </header>
  );
}
