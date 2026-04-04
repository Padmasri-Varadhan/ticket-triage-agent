const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const DB_FILE = path.join(__dirname, 'tickets.json');

// Mock AI Engine for Explainable AI
const analyzeTicketAI = (title, description) => {
  const text = (title + " " + description).toLowerCase();
  
  const rules = {
    billing: ["bill", "payment", "charge", "subscription", "price", "refund", "invoice", "double charged", "payment failed"],
    technical: ["bug", "error", "broken", "login", "failed", "crash", "not working", "slow", "api", "integration"],
    feature: ["request", "suggest", "improve", "add a", "could we", "new feature", "enhancement"],
    urgent: ["urgent", "immediately", "asap", "critical", "broken", "blocked", "emergency", "cannot access"],
    negative: ["angry", "frustrated", "terrible", "disappointed", "annoying", "bad service", "worst", "fix this now"]
  };

  let analysis = {
    category: "General",
    priority: "Low",
    sentiment: "Neutral",
    confidence: Math.floor(Math.random() * (98 - 85 + 1) + 85), // Simulated confidence
    assignedTeam: "Customer Support",
    explanation: {
      category: "Defaulted to general as no specific domain keywords were dominant.",
      priority: "Assigned low priority as no urgent indicators were detected.",
      sentiment: "Neutral tone detected.",
      keywords: []
    }
  };

  // Category Detection
  const billingCount = rules.billing.filter(k => text.includes(k)).length;
  const technicalCount = rules.technical.filter(k => text.includes(k)).length;
  const featureCount = rules.feature.filter(k => text.includes(k)).length;

  if (billingCount > 0 && billingCount >= technicalCount && billingCount >= featureCount) {
    analysis.category = "Billing";
    analysis.assignedTeam = "Finance Team";
    analysis.explanation.category = `Detected keywords related to financial transactions: ${rules.billing.filter(k => text.includes(k)).join(", ")}.`;
    analysis.explanation.keywords.push(...rules.billing.filter(k => text.includes(k)));
  } else if (technicalCount > 0 && technicalCount >= billingCount && technicalCount >= featureCount) {
    analysis.category = "Technical";
    analysis.assignedTeam = "Engineering Team";
    analysis.explanation.category = `Detected technical issues or error indicators: ${rules.technical.filter(k => text.includes(k)).join(", ")}.`;
    analysis.explanation.keywords.push(...rules.technical.filter(k => text.includes(k)));
  } else if (featureCount > 0) {
    analysis.category = "Feature Request";
    analysis.assignedTeam = "Product Team";
    analysis.explanation.category = `Content suggests a request for new functionality: ${rules.feature.filter(k => text.includes(k)).join(", ")}.`;
    analysis.explanation.keywords.push(...rules.feature.filter(k => text.includes(k)));
  }

  // Sentiment Detection
  const negativeCount = rules.negative.filter(k => text.includes(k)).length;
  if (negativeCount > 1) {
    analysis.sentiment = "Angry";
    analysis.explanation.sentiment = `Strong negative sentiment detected through words like: ${rules.negative.filter(k => text.includes(k)).join(", ")}.`;
    analysis.explanation.keywords.push(...rules.negative.filter(k => text.includes(k)));
  } else if (negativeCount === 1) {
    analysis.sentiment = "Neutral"; // Or "Slightly Unhappy"
    analysis.explanation.sentiment = "Mixed or neutral indicators detected.";
  } else {
    analysis.sentiment = "Happy";
    analysis.explanation.sentiment = "No negative indicators found; tone appears professional or positive.";
  }

  // Priority Logic
  const urgentCount = rules.urgent.filter(k => text.includes(k)).length;
  if (urgentCount > 0 || analysis.sentiment === "Angry") {
    analysis.priority = "High";
    analysis.explanation.priority = urgentCount > 0 
      ? `Priority elevated due to urgent keywords: ${rules.urgent.filter(k => text.includes(k)).join(", ")}.`
      : "Priority elevated due to detected customer frustration.";
    analysis.explanation.keywords.push(...rules.urgent.filter(k => text.includes(k)));
  } else if (analysis.category === "Technical" || analysis.category === "Billing") {
    analysis.priority = "Medium";
    analysis.explanation.priority = "Standard priority for functional issues.";
  }

  return analysis;
};

// Routes
app.post('/api/tickets', (req, res) => {
  const { title, description, userEmail } = req.body;
  
  if (!title || !description || !userEmail) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const analysis = analyzeTicketAI(title, description);
  
  const newTicket = {
    id: Date.now().toString(),
    title,
    description,
    userEmail,
    ...analysis,
    status: "Open",
    createdAt: new Date().toISOString()
  };

  const tickets = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  tickets.push(newTicket);
  fs.writeFileSync(DB_FILE, JSON.stringify(tickets, null, 2));

  res.status(201).json(newTicket);
});

app.get('/api/tickets', (req, res) => {
  const tickets = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  res.json(tickets);
});

app.patch('/api/tickets/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const tickets = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const ticketIndex = tickets.findIndex(t => t.id === id);
  
  if (ticketIndex === -1) return res.status(404).json({ error: "Ticket not found" });
  
  tickets[ticketIndex].status = status;
  fs.writeFileSync(DB_FILE, JSON.stringify(tickets, null, 2));
  
  res.json(tickets[ticketIndex]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
