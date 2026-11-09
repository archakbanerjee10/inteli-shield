#ensures that all the incoming quesrries and the outgoing results are in a valid json format
from typing import List
from enum import Enum
from pydantic import BaseModel, Field

class SeverityRating(str, Enum):
    LOW = "Low Risk"
    SUSPICIOUS = "Suspicious"
    HIGH = "High Risk"
    MALICIOUS = "Confirmed Malicious"
    INCONCLUSIVE = "Inconclusive"

class ScanRequest(BaseModel):
    target: str = Field(..., description="URL, domain, or raw text message to analyze")

class ScanResponse(BaseModel):
    target: str
    verdict: SeverityRating
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    social_engineering_hooks: List[str]
    technical_anomalies: List[str]
    explainable_rationale: str
    actionable_remediation: List[str]