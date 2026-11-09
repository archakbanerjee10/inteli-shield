// All mock data and simulated backend logic lives here.
// To go live, replace the body of `scanTarget` with a real fetch() call
// and keep the same return shape, so no UI component has to change.

export const STEPS = [
  "SSRF & Sanitization Check",
  "Static Domain & Threat Feed Query",
  "Non-Intrusive TLS & Header Inspection",
  "AI Social Engineering Parsing",
  "Web3 On-Chain Hash Commitment",
];

export const SAFE_HOSTS = ["github.com", "google.com", "vercel.com", "wikipedia.org"];

export const MOCK_MALICIOUS = {
  tone: "crit",
  verdict: "CONFIRMED MALICIOUS",
  confidence: 98.4,
  summary:
    "Typosquatted PayPal login clone on a 3-day-old domain, listed on two active phishing feeds and built to harvest credentials under time pressure.",
  domain: {
    typosquat: { label: "Detected", tone: "crit" },
    lookalike: "paypal.com",
    distance: 2,
    age: "3 days",
    feeds: [
      { name: "PhishTank", hit: true },
      { name: "OpenPhish", hit: true },
      { name: "URLhaus", hit: false },
      { name: "Google Safe Browsing", hit: false },
    ],
  },
  tls: {
    issuer: "R11 (Let's Encrypt)",
    validity: "Issued 2 days ago · 90-day term",
    findings: [
      { text: "SAN mismatch: certificate covers *.paypa1-secure.top only", tone: "crit" },
      { text: "Certificate is valid and chains to a trusted root", tone: "safe" },
      { text: "A valid certificate does not mean the site is safe", tone: "warn" },
    ],
    headers: [
      { name: "Strict-Transport-Security", present: false },
      { name: "Content-Security-Policy", present: false },
      { name: "X-Frame-Options", present: true },
    ],
  },
  social: {
    hooks: ["Urgency cue", "Fear of account loss", "Authority appeal", "Credential request"],
    brands: ["PayPal"],
    excerpt: "“Your account will be limited within 24 hours unless you verify now.”",
  },
  remediation: [
    "Do not click links or open attachments from this source, and do not enter credentials.",
    "Report the URL to anti-phishing feeds such as PhishTank and Google Safe Browsing.",
    "If you already entered a password, change it on the real site and enable two-factor authentication.",
    "Share the report hash with your security team as proof of this verdict.",
  ],
};

export const MOCK_SAFE = {
  tone: "safe",
  verdict: "LOW RISK",
  confidence: 96.1,
  summary:
    "Long-established domain with a clean threat-feed history, strict transport policy, and no manipulative language detected.",
  domain: {
    typosquat: { label: "None", tone: "safe" },
    lookalike: "—",
    distance: 0,
    age: "11 years",
    feeds: [
      { name: "PhishTank", hit: false },
      { name: "OpenPhish", hit: false },
      { name: "URLhaus", hit: false },
      { name: "Google Safe Browsing", hit: false },
    ],
  },
  tls: {
    issuer: "DigiCert Global G2",
    validity: "Valid · 11 months remaining",
    findings: [
      { text: "Certificate matches the requested hostname", tone: "safe" },
      { text: "A valid certificate alone does not prove a site is safe", tone: "warn" },
    ],
    headers: [
      { name: "Strict-Transport-Security", present: true },
      { name: "Content-Security-Policy", present: true },
      { name: "X-Frame-Options", present: true },
    ],
  },
  social: {
    hooks: [],
    brands: [],
    excerpt: "No urgency, impersonation, or credential-harvesting patterns found.",
  },
  remediation: [
    "No action required. Proceed as normal.",
    "Stay alert to unexpected redirects or login prompts.",
    "Share the report hash with your security team if you need a record of this check.",
  ],
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function randomHash() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return "0x" + Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Simulates a 5-step threat scan.
 * @param {string} input  URL, domain, or raw text payload
 * @param {(stepIndex: number) => void} [onStep]  called as each step starts
 * @returns {Promise<object>} scan result
 */
export async function scanTarget(input, onStep = () => {}) {
  for (let i = 0; i < STEPS.length; i++) {
    onStep(i);
    await sleep(600 + Math.random() * 300); // 0.6s–0.9s per step
  }
  onStep(STEPS.length);

  const safe = SAFE_HOSTS.some((host) => input.toLowerCase().includes(host));
  const base = safe ? MOCK_SAFE : MOCK_MALICIOUS;

  return {
    ...base,
    target: input.trim(),
    hash: randomHash(),
    scannedAt: new Date().toISOString(),
  };
}
