import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { scanTarget } from './services/Api';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScanProgress from './components/ScanProgress';
import ResultsDashboard from './components/ResultsDashboard';

export default function App() {
  const [inputVal, setInputVal] = useState('');
  const [mode, setMode] = useState('url');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');

  // Same flow as before: scanTarget() -> adapted result -> ResultsDashboard
  const handleScan = async (e) => {
    e?.preventDefault?.();
    if (!inputVal.trim()) return;

    setLoading(true);
    setError('');
    setScanResult(null);
    try {
      const data = await scanTarget(inputVal);
      setScanResult(data);
    } catch (err) {
      setError('We couldn’t reach the scan service. Make sure the FastAPI backend (uvicorn) is running, then try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen font-sans text-slate-100">
      <div className="app-bg" aria-hidden="true">
        <svg viewBox="0 0 200 240" fill="none" stroke="#9cc9ff" strokeWidth="1.2">
          <path d="M100 10 20 42v62c0 56 34 96 80 126 46-30 80-70 80-126V42z" />
          <path d="M100 40 48 60v44c0 38 22 66 52 88 30-22 52-50 52-88V60z" />
          <path d="M100 70 76 80v24c0 20 10 34 24 46 14-12 24-26 24-46V80z" />
        </svg>
      </div>

      <Navbar />

      <main>
        <Hero
          mode={mode}
          onModeChange={setMode}
          value={inputVal}
          onValueChange={setInputVal}
          onSubmit={handleScan}
          scanning={loading}
        />

        {error && (
          <div role="alert" className="mx-auto mb-10 max-w-6xl px-4 sm:px-6">
            <div className="flex max-w-2xl gap-3 rounded-xl border border-rose-400/25 bg-rose-400/10 p-4 text-sm text-rose-200">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {error}
            </div>
          </div>
        )}

        {loading && <ScanProgress target={inputVal} />}
        {!loading && scanResult && <ResultsDashboard result={scanResult} />}
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-10 text-sm text-slate-500 sm:px-6">
        © 2026 Inteli-Shield Intelligence
      </footer>
    </div>
  );
}