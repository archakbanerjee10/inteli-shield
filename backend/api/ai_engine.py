import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from app.schemas import SeverityRating

load_dotenv()

# Initialize OpenAI client configured for Groq's LPU inference endpoint
api_key = os.getenv("GROQ_API_KEY") or os.getenv("OPENAI_API_KEY")
client = OpenAI(
    api_key=api_key,
    base_url="https://api.groq.com/openai/v1"
) if api_key else None

def synthesize_threat_report(target: str) -> dict:
    if not api_key:
        return {
            "verdict": SeverityRating.SUSPICIOUS,
            "confidence_score": 0.85,
            "social_engineering_hooks": ["Missing API Key - Mock Analysis Triggered"],
            "technical_anomalies": ["Environment key not detected"],
            "explainable_rationale": "Groq API key is missing. Please set GROQ_API_KEY in your .env file.",
            "actionable_remediation": ["Configure your environment variables."]
        }

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-120b",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert AI Cybersecurity Threat Synthesis Engine. "
                        "Analyze the input target for security risks, scams, and social engineering indicators. "
                        "You must return a valid JSON object with the exact keys: "
                        "'verdict' (Low Risk | Suspicious | High Risk | Confirmed Malicious | Inconclusive), "
                        "'confidence_score' (float 0.0 to 1.0), 'social_engineering_hooks' (list of strings), "
                        "'technical_anomalies' (list of strings), 'explainable_rationale' (string summary), "
                        "and 'actionable_remediation' (list of strings)."
                    )
                },
                {
                    "role": "user",
                    "content": f"Analyze this target input for threats: {target}"
                }
            ],
            temperature=0.2,
            timeout=10.0
        )
        
        result_json = json.loads(response.choices[0].message.content)
        return result_json
        
    except Exception as e:
        return {
            "verdict": SeverityRating.SUSPICIOUS,
            "confidence_score": 0.80,
            "social_engineering_hooks": ["API Execution Warning"],
            "technical_anomalies": [str(e)],
            "explainable_rationale": f"Groq inference error encountered: {str(e)}",
            "actionable_remediation": ["Check API key validity or network connection."]
        }