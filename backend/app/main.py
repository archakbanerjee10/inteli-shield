from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Updated application title for Inteli-Shield
app = FastAPI(
    title="Inteli-Shield API",
    description="AI-Powered Web Threat Detection & Digital Trust Intelligence Backend",
    version="1.0.0"
)

# Allow your frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to frontend origin in production
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