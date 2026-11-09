from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import ScanRequest, ScanResponse
from api.ai_engine import synthesize_threat_report
from app.tls_analyzer import analyze_tls_certificate

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
        "message": "FastAPI security engine running with Groq AI & TLS Verification!"
    }

@app.post("/api/v1/scan", response_model=ScanResponse)
async def run_threat_scan(payload: ScanRequest):
    # 1. Run AI Social Engineering & Threat Synthesis
    ai_evaluation = synthesize_threat_report(payload.target)

    # 2. Run TLS/SSL Low-Level Certificate Inspection
    tls_evaluation = analyze_tls_certificate(payload.target)

    # 3. Combine Technical Anomalies from both AI + TLS Engine
    combined_anomalies = list(ai_evaluation.get("technical_anomalies", []))
    for tls_signal in tls_evaluation.get("risk_signals", []):
        if tls_signal not in combined_anomalies:
            combined_anomalies.append(tls_signal)

    return ScanResponse(
        target=payload.target,
        verdict=ai_evaluation.get("verdict", "Inconclusive"),
        confidence_score=ai_evaluation.get("confidence_score", 0.5),
        social_engineering_hooks=ai_evaluation.get("social_engineering_hooks", []),
        technical_anomalies=combined_anomalies,
        explainable_rationale=ai_evaluation.get("explainable_rationale", "No rationale generated."),
        actionable_remediation=ai_evaluation.get("actionable_remediation", [])
    )