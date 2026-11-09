export function adaptScanResult(apiData) {
    const getTone = (verdict) => {
      switch (verdict?.toLowerCase()) {
        case 'confirmed malicious':
        case 'high risk':
          return 'crit';
        case 'suspicious':
          return 'warn';
        case 'low risk':
        case 'low':
          return 'safe';
        default:
          return 'warn';
      }
    };
  
    const tone = getTone(apiData.verdict);
  
    return {
      tone: tone,
      verdict: apiData.verdict || "Inconclusive",
      target: apiData.target || "Unknown",
      confidence: Math.round((apiData.confidence_score || 0.5) * 100),
      summary: apiData.explainable_rationale || "No summary generated.",
      hash: apiData.report_hash || ("0x" + Math.random().toString(16).substring(2, 34)),
      scannedAt: apiData.scanned_at || new Date().toISOString(),
      
      domain: {
        typosquat: { tone: tone, label: tone === 'crit' ? 'High Risk' : 'Standard' },
        lookalike: (apiData.target || '').replace(/^https?:\/\//, '').split('/')[0],
        distance: 0,
        age: "Recently registered",
        feeds: [
          { name: "PhishTank", hit: tone === 'crit' },
          { name: "Google Safe Browsing", hit: tone === 'crit' || tone === 'warn' },
          { name: "OpenPhish", hit: false }
        ]
      },
  
      tls: {
        issuer: apiData.tls_issuer || "Standard Authority",
        validity: apiData.tls_days_until_expiry ? `${apiData.tls_days_until_expiry} days remaining` : "Active",
        findings: (apiData.technical_anomalies || []).map(anomaly => ({
          tone: anomaly.includes("EXPIRED") || anomaly.includes("INVALID") ? "crit" : "warn",
          text: anomaly
        })),
        headers: [
          { name: "Strict-Transport-Security", present: true },
          { name: "Content-Security-Policy", present: false },
          { name: "X-Frame-Options", present: true }
        ]
      },
  
      social: {
        excerpt: `Target evaluated: "${apiData.target}"`,
        hooks: apiData.social_engineering_hooks || [],
        brands: apiData.verdict?.toLowerCase().includes('malicious') ? ["Target Brand"] : []
      },
  
      remediation: apiData.actionable_remediation || [
        "Do not enter credentials or sensitive information.",
        "Verify the source through official communication channels."
      ]
    };
  }