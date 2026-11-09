import React, { useState } from 'react';
import { scanTarget } from './services/Api';
import ResultsDashboard from './components/ResultsDashboard';

export default function App() {
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setLoading(true);
    try {
      const data = await scanTarget(inputVal);
      setScanResult(data);
    } catch (err) {
      alert('Failed to connect to FastAPI backend. Ensure uvicorn is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-4xl mx-auto mb-10 text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Inteli-Shield Intelligence</h1>
        <form onSubmit={handleScan} className="flex gap-3 justify-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Enter URL or threat target (e.g., netflix-billing.xyz)..."
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 w-96 text-sm focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-600 hover:bg-cyan-500 px-6 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Scan Target'}
          </button>
        </form>
      </div>

      {scanResult && <ResultsDashboard result={scanResult} />}
    </div>
  );
}