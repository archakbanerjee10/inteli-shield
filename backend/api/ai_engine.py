import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from app.schemas import SeverityRating

# Load environment variables from .env file
load_dotenv()

# Configure the Gemini API key
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def synthesize_threat_report(target: str) -> dict:
    """
    Sends the target payload to Gemini with strict JSON schema instructions
    to analyze social engineering tactics, urgency cues, and threat levels.
    """
    if not api_key:
        # Fallback response if API key is not yet configured during local testing
        return {
            "verdict": SeverityRating.SUSPICIOUS,
            "confidence_score": 0.85,
            "social_engineering_hooks": ["Missing API Key - Mock Analysis Triggered"],
            "technical_anomalies": ["Environment key not detected"],
            "explainable_rationale": "Gemini API key is missing. Please set GEMINI_API_KEY in your .env file to enable live AI threat synthesis.",
            "actionable_remediation": ["Configure your environment variables."]
        }

    # Using gemini-2.5-flash or standard flash model for fast hackathon inference
    model = genai.GenerativeModel(
        model_name="gemini-flash-latest",
        generation_config={
            "response_mime_type": "application/json"
        }
    )

    prompt = f"""
    You are an expert AI Cybersecurity Threat Synthesis Engine. Analyze the following untrusted input target (which could be a URL, domain, or raw text message/email) for security risks, scams, and social engineering indicators.

    Target Input: "{target}"

    Evaluate for:
    - Urgency cues or artificial pressure (e.g., "account suspended in 2 hours")
    - Brand impersonation or typosquatting patterns
    - Payment traps, credential harvesting links, or crypto scams
    - Technical anomalies or suspicious structures

    You must return a valid JSON object matching this exact structure:
    {{
      "verdict": "Low Risk" | "Suspicious" | "High Risk" | "Confirmed Malicious" | "Inconclusive",
      "confidence_score": <float between 0.0 and 1.0>,
      "social_engineering_hooks": ["list", "of", "detected", "tactics"],
      "technical_anomalies": ["list", "of", "anomalies"],
      "explainable_rationale": "A concise, evidence-grounded paragraph explaining why this verdict was assigned.",
      "actionable_remediation": ["Step 1 for user", "Step 2 for user"]
    }}
    """

    try:
        response = model.generate_content(prompt)
        result_json = json.loads(response.text)
        return result_json
    except Exception as e:
        return {
            "verdict": SeverityRating.INCONCLUSIVE,
            "confidence_score": 0.50,
            "social_engineering_hooks": ["Parsing Error"],
            "technical_anomalies": [str(e)],
            "explainable_rationale": "Failed to parse structured response from AI engine securely.",
            "actionable_remediation": ["Retry scan or check API status."]
        }