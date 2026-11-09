import { Search } from "lucide-react";

const MODES = [
  ["url", "URL / Domain Mode"],
  ["text", "Raw Text Payload Mode"],
];

const SAMPLES = {
  url: "https://paypa1-secure.top/login",
  text: "URGENT: Your PayPal account will be limited in 24 hours. Verify now at paypa1-secure.top/login",
};

export default function Hero({ mode, onModeChange, value, onValueChange, onSubmit, scanning }) {
  const placeholder = "Enter URL, domain name, or paste suspicious email/SMS text...";
  const fieldClass =
    "w-full bg-transparent text-left text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none";

  return (
    <section className="mx-auto max-w-3xl px-4 pb-10 pt-14 text-center sm:px-6 sm:pt-20">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
        Digital trust intelligence
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-zinc-400">
        Analyze suspicious URLs, domains, or raw text payloads with zero-trust technical intelligence.
      </p>

      <div
        role="tablist"
        aria-label="Scan mode"
        className="mt-8 inline-flex flex-wrap justify-center rounded-lg border border-zinc-800 bg-zinc-900 p-1 text-sm"
      >
        {MODES.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            disabled={scanning}
            onClick={() => onModeChange(id)}
            className={`rounded-md px-3 py-1.5 transition-colors ${
              mode === id ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
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
        className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-2 transition-colors focus-within:border-zinc-600 focus-within:ring-2 focus-within:ring-zinc-700/60"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-start gap-2 px-3 py-2">
            <Search className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
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
                onChange={(e) => onValueChange(e.target.value)}
                className={fieldClass}
              />
            )}
          </div>
          <button
            type="submit"
            disabled={scanning || !value.trim()}
            className="rounded-lg bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            {scanning ? "Scanning…" : "Run Threat Scan"}
          </button>
        </div>
      </form>

      <button
        type="button"
        disabled={scanning}
        onClick={() => onValueChange(SAMPLES[mode])}
        className="mt-3 text-xs text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-300 hover:underline"
      >
        Use a sample suspicious input
      </button>
    </section>
  );
}
