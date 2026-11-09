Inteli-Shield 
AI-Powered Web Threat Detection & Digital Trust Intelligence Platform

Inteli-Shield is a real-time security assessment and threat intelligence tool built to combat modern digital scams, phishing campaigns, and social engineering attacks. By combining high-speed AI text synthesis with low-level cryptographic TLS/SSL inspection, Inteli-Shield delivers instant, explainable threat verdicts directly through a modern web dashboard.

Important Features
Groq AI Threat Synthesis: Leverages ultra-fast LLMs (openai/gpt-oss-20b) via the OpenAI SDK to analyze psychological manipulation tactics, urgency hooks, and brand impersonation patterns.

Low-Level TLS/SSL Certificate Inspector: Connects directly to port 443 (ssl/socket) to extract X.509 certificate details, evaluate issuer authority, track expiration windows, and flag ephemeral or suspicious certificate configurations.

Actionable Remediation Engine: Generates clear, step-by-step guidance and technical anomaly reports for users and security analysts.

Modern Responsive Dashboard: Built with React and Tailwind CSS featuring dynamic risk-toned badges, confidence meters, and clear categorization of threats.

 Tech Stack
Frontend: React, Vite, Tailwind CSS, Lucide Icons, Axios

Backend: Python, FastAPI, Uvicorn, Pydantic, Python-Dotenv

AI & Security Layer: Groq API (openai/gpt-oss-20b), Python Standard Library (ssl, socket)

Project Structure
New-Folder/
├── backend/
│   ├── app/
│   │   ├── ai_engine.py       # Groq AI threat analysis integration
│   │   ├── main.py            # FastAPI entrypoint & endpoints
│   │   ├── schemas.py         # Pydantic data validation schemas
│   │   └── tls_analyzer.py    # Direct port 443 TLS certificate inspector
│   ├── .env                   # Environment variables (GROQ_API_KEY)
│   └── requirements.txt       # Python dependencies
└── frontend/
    ├── src/
    │   ├── components/        # Tailwind UI components (VerdictCard, TlsCard, etc.)
    │   ├── services/          # API communication layer (api.js)
    │   ├── utils/             # Response adapters and formatters
    │   ├── App.jsx            # Main application layout
    │   └── main.jsx           # React DOM root
    └── package.json           # Frontend dependencies
 Getting Started & Installation
1. Clone the Repository
Bash
git clone https://github.com/your-username/inteli-shield.git
cd inteli-shield
2. Backend Setup (FastAPI)
Navigate to the backend directory, set up your virtual environment, and install dependencies:

Bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

pip install fastapi uvicorn python-dotenv openai pydantic
Create a .env file inside the backend/ folder and add your Groq API key:

Code snippet
GROQ_API_KEY=your_groq_api_key_here
Start the FastAPI server:

Bash
uvicorn app.main:app --reload
Backend will run locally at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

Interactive Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

3. Frontend Setup (React & Tailwind)
Open a new terminal window, navigate to the frontend folder, install packages, and start the development server:

Bash
cd frontend
npm install
npm run dev
Frontend will run locally at: http://localhost:5173

💡 How to Use
Open the React frontend in your browser (http://localhost:5173).

Enter a target domain, URL, or suspicious message into the search bar (e.g., [https://netflix-billing-update.xyz](https://netflix-billing-update.xyz)).

Click Scan Target to trigger real-time AI synthesis and TLS certificate handshakes.

Review the comprehensive Verdict Card, TLS Trust Chain, AI Social Engineering Analysis, and Remediation Steps instantly on your dashboard.

Hackathon Context
Developed as a rapid prototype to showcase how automated AI inference can bridge the gap between slow traditional blocklists and fast-moving modern phishing infrastructure.