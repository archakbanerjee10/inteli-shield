from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import ScanRequest, ScanResponse, SeverityRating

app = FastAPI(
    title="Inteli-Shield API",
    description="AI-Powered Web Threat Detection & Digital Trust Intelligence Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status": "operational",
        "project": "Inteli-Shield",
        "message": "FastAPI security engine is running successfully!"
    }

@app.post("/api/v1/scan", response_model=ScanResponse)
async def run_threat_scan(payload: ScanRequest):
    # Provisional evaluation logic (we will plug in real URL checkers & LLM next!)
    target = payload.target
    
    # Simple keyword heuristic mock for testing the pipeline
    is_malicious = "phish" in target.lower() or "paypa1" in target.lower() or "urgent" in target.lower()
    
    if is_malicious:
        verdict = SeverityRating.MALICIOUS
        confidence = 0.95
        rationale = "Target contains known deceptive patterns, typosquatting indicators, or high-pressure social engineering hooks."
        anomalies = ["Typosquatting detected", "Suspicious TLD or redirect pattern"]
        remediation = ["Do not click or enter credentials.", "Report URL to threat registries."]
    else:
        verdict = SeverityRating.LOW
        confidence = 0.92
        rationale = "Target exhibits valid structure, standard cryptographic configuration, and lacks active threat signatures."
        anomalies = []
        remediation = ["Target appears safe for standard interaction."]

    return ScanResponse(
        target=target,
        verdict=verdict,
        confidence_score=confidence,
        social_engineering_hooks=["Urgency cue" if is_malicious else "None"],
        technical_anomalies=anomalies,
        explainable_rationale=rationale,
        actionable_remediation=remediation
    )