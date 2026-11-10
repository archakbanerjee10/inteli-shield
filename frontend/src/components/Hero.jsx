import { Search } from "lucide-react";

const MODES = [
  ["url", "URL or domain"],
  ["text", "Email or SMS text"],
];

const SAMPLES = {
  url: "https://paypa1-secure.top/login",
  text: "URGENT: Your PayPal account will be limited in 24 hours. Verify now at paypa1-secure.top/login",
};

export default function Hero({ mode, onModeChange, value, onValueChange, onSubmit, scanning }) {
  const placeholder =
    mode === "text" ? "Paste the suspicious email or SMS here" : "Enter a URL or domain, e.g. netflix-billing.xyz";
  const fieldClass =
    "w-full bg-transparent text-left text-base text-slate-100 placeholder:text-slate-500 focus:outline-none";

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:px-6 sm:pt-20">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-slate-50 sm:text-6xl">
          Check it before you trust it
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-400">
          Paste a suspicious link, domain or message. We check the domain, the certificate and the wording, then tell you what to do.
        </p>

        <div
          role="tablist"
          aria-label="Scan mode"
          className="mt-8 inline-flex flex-wrap rounded-xl border border-slate-400/15 bg-slate-900/50 p-1 text-sm"
        >
          {MODES.map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mode === id}
              disabled={scanning}
              onClick={() => onModeChange(id)}
              className={`rounded-lg px-3.5 py-1.5 transition-colors ${
                mode === id ? "bg-slate-700/70 text-slate-50" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="glass mt-4 rounded-2xl p-2 transition-all focus-within:border-cyan-400 focus-within:ring-4 focus-within:ring-cyan-400/15"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-start gap-3 px-3 py-2.5">
              <Search className="mt-1 h-5 w-5 shrink-0 text-slate-500" aria-hidden />
              {mode === "text" ? (
                <textarea
                  rows={3}
                  value={value}
                  disabled={scanning}
                  placeholder={placeholder}
                  onChange={(e) => onValueChange(e.target.value)}
                  className={`${fieldClass} resize-none`}
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  disabled={scanning}
                  placeholder={placeholder}
                  autoCapitalize="off"
                  spellCheck={false}
                  onChange={(e) => onValueChange(e.target.value)}
                  className={fieldClass}
                />
              )}
            </div>
            <button
              type="submit"
              disabled={scanning || !value.trim()}
              className="rounded-xl bg-cyan-400 px-6 py-3 text-base font-medium text-slate-950 transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-700/60 disabled:text-slate-500"
            >
              {scanning ? "Scanning…" : "Scan target"}
            </button>
          </div>
        </form>


      </div>
    </section>
  );
}