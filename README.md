# AI-Powered Ticket Triage Agent with Explainable AI (XAI)

A full-stack application that uses an AI engine (NLP-based) to automatically categorize, prioritize, and analyze the sentiment of incoming support tickets, while providing clear reasoning for every decision.

## Visual Dashboard Overview
- **Category Extraction**: Billing, Technical, Feature Request, or General.
- **Priority Logic**: High, Medium, or Low (driven by urgency and sentiment).
- **Sentiment Analysis**: Detecting Angry, Neutral, or Happy tones.
- **Explainable AI (XAI)**: A toggleable section for every ticket showing *why* the AI made its decision.

## Project Structure
- **/backend**: Node.js & Express server with the AI Analysis Engine.
- **/frontend**: Vite + React modern dashboard with Framer Motion animations.

## How to Run

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev (or: node server.js)
```
The backend will run on `http://localhost:5000`.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Key Features
- **Ticket Input**: An elegant form with real-time feedback.
- **Explainable AI Section**: Visualizes the keywords and logic used by the engine.
- **Priority Rules**: Automated logic for "High" priority based on urgent keywords (error, failed, urgent) and negative sentiment.
- **Team Routing**: Automatically assigns tickets based on category (e.g., Billing -> Finance Team).
- **Admin Dashboard**: Filter and sort through tickets easily.
