from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import ScanRequest, ScanResponse, SeverityRating
from api.ai_engine import synthesize_threat_report

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
    # Pass the target straight into our Gemini AI Threat Synthesis Engine
    ai_evaluation = synthesize_threat_report(payload.target)

    return ScanResponse(
        target=payload.target,
        verdict=ai_evaluation.get("verdict", "Inconclusive"),
        confidence_score=ai_evaluation.get("confidence_score", 0.5),
        social_engineering_hooks=ai_evaluation.get("social_engineering_hooks", []),
        technical_anomalies=ai_evaluation.get("technical_anomalies", []),
        explainable_rationale=ai_evaluation.get("explainable_rationale", "No rationale returned."),
        actionable_remediation=ai_evaluation.get("actionable_remediation", [])
    )