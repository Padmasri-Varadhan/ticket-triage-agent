import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TicketCard from './TicketCard';
import { Loader2, ArrowRight, Cpu, Brain, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const API_URL = "https://ticket-triage-agent-t86f.onrender.com/api/tickets";

const WorkflowDiagram = () => (
    <div className="workflow-container">
        <div className="workflow-step">
            <User size={20} color="var(--primary)" style={{ marginBottom: 4 }} />
            <div>Ticket Submitted</div>
        </div>
        <ArrowRight size={16} className="arrow" />
        <div className="workflow-step" style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
            <Brain size={20} color="#0284c7" style={{ marginBottom: 4 }} />
            <div>NLP Parsing</div>
        </div>
        <ArrowRight size={16} className="arrow" />
        <div className="workflow-step" style={{ backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
            <Cpu size={20} color="#0284c7" style={{ marginBottom: 4 }} />
            <div>AI Triage Logic</div>
        </div>
        <ArrowRight size={16} className="arrow" />
        <div className="workflow-step" style={{ borderStyle: 'dashed' }}>
            <CheckCircle size={20} color="var(--secondary)" style={{ marginBottom: 4 }} />
            <div>Assigned & Sorted</div>
        </div>
    </div>
);

const User = ({ size, color, style }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: 'All',
        priority: 'All'
    });

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await axios.get(API_URL);

            console.log("API Response:", response.data);

            const data = Array.isArray(response.data)
                ? response.data
                : response.data?.tickets || [];

            setTickets(data);

        } catch (error) {
            console.error("Fetch error:", error.response?.data || error.message);
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredTickets = (Array.isArray(tickets) ? tickets : [])
        .filter(ticket =>
            (filters.category === 'All' || ticket.category === filters.category) &&
            (filters.priority === 'All' || ticket.priority === filters.priority)
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="dashboard">
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontFamily: 'Outfit, sans-serif' }}>
                    AI Triage Pipeline
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                    Real-time analysis of support tickets using our explainable AI model.
                </p>
                <WorkflowDiagram />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    >
                        <option>All</option>
                        <option>Billing</option>
                        <option>Technical</option>
                        <option>Feature Request</option>
                        <option>General</option>
                    </select>

                    <select
                        value={filters.priority}
                        onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    >
                        <option>All</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </div>

                <div style={{ fontSize: '0.8rem' }}>
                    Showing <strong>{filteredTickets.length}</strong> of {tickets.length}
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                    <Loader2 className="animate-spin" size={48} />
                </div>
            ) : (
                <motion.div layout className="ticket-grid">
                    {filteredTickets.map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}

                    {filteredTickets.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            No tickets found.
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;