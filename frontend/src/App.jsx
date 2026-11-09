import { useRef, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ScanProgress from "./components/ScanProgress";
import ResultsDashboard from "./components/ResultsDashboard";
import { scanTarget } from "./services/mockApi";

export default function App() {
  const [mode, setMode] = useState("url");
  const [value, setValue] = useState("");
  const [scanning, setScanning] = useState(false);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const scanId = useRef(0);

  const handleScan = async () => {
    if (!value.trim() || scanning) return;
    const id = ++scanId.current;
    setResult(null);
    setError("");
    setStep(0);
    setScanning(true);

    try {
      const data = await scanTarget(value, (s) => {
        if (id === scanId.current) setStep(s);
      });
      if (id === scanId.current) setResult(data);
    } catch {
      if (id === scanId.current) setError("The scan failed. Check your connection and try again.");
    } finally {
      if (id === scanId.current) setScanning(false);
    }
  };

  const handleModeChange = (next) => {
    setMode(next);
    setValue("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-zinc-700">
      <Navbar />
      <main>
        <Hero
          mode={mode}
          onModeChange={handleModeChange}
          value={value}
          onValueChange={setValue}
          onSubmit={handleScan}
          scanning={scanning}
        />
        {scanning && <ScanProgress step={step} />}
        {error && (
          <p className="mx-auto max-w-xl px-4 pb-10 text-center text-sm text-rose-400">{error}</p>
        )}
        {result && !scanning && <ResultsDashboard result={result} />}
      </main>
    </div>
  );
}
