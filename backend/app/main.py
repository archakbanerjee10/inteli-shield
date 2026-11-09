from fastapi import FastAPI, HTTPException
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
    return {"status": "operational", "project": "Inteli-Shield"}

@app.post("/api/v1/scan", response_model=ScanResponse)
async def run_threat_scan(payload: ScanRequest):
    try:
        # 1. Run AI Threat Synthesis
        ai_evaluation = synthesize_threat_report(payload.target)
    except Exception as e:
        # Fallback if Groq API fails or key is missing
        ai_evaluation = {
            "verdict": "Suspicious",
            "confidence_score": 0.6,
            "social_engineering_hooks": ["API Synthesis Warning: AI engine fallback triggered."],
            "explainable_rationale": f"Could not reach AI model securely. Error: {str(e)}",
            "actionable_remediation": ["Verify network connection and Groq API key."]
        }

    try:
        # 2. Run TLS/SSL Certificate Inspection
        tls_evaluation = analyze_tls_certificate(payload.target)
    except Exception as e:
        tls_evaluation = {
            "has_tls": False,
            "risk_signals": [f"TLS Inspection Error: {str(e)}"]
        }

    # 3. Combine Technical Anomalies
    combined_anomalies = list(ai_evaluation.get("technical_anomalies", []))
    for tls_signal in tls_evaluation.get("risk_signals", []):
        if tls_signal not in combined_anomalies:
            combined_anomalies.append(tls_signal)

    return ScanResponse(
        target=payload.target,
        verdict=ai_evaluation.get("verdict", "Suspicious"),
        confidence_score=ai_evaluation.get("confidence_score", 0.5),
        social_engineering_hooks=ai_evaluation.get("social_engineering_hooks", []),
        technical_anomalies=combined_anomalies,
        explainable_rationale=ai_evaluation.get("explainable_rationale", "No rationale generated."),
        actionable_remediation=ai_evaluation.get("actionable_remediation", [])
    )