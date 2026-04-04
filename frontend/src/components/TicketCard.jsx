import React, { useState } from 'react';
import { Tag, ShieldAlert, Cpu, Brain, User, Calendar, MessageSquare, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TicketCard = ({ ticket }) => {
    const [showXAI, setShowXAI] = useState(false);

    const getPriorityBadgeClass = (priority) => {
        switch (priority) {
            case 'High': return 'badge badge-high';
            case 'Medium': return 'badge badge-medium';
            case 'Low': return 'badge badge-low';
            default: return 'badge';
        }
    };

    const getSentimentIcon = (sentiment) => {
        switch (sentiment) {
            case 'Angry': return '😡';
            case 'Neutral': return '😐';
            case 'Happy': return '😊';
            default: return '🤔';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ overflow: 'hidden' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: '600' }}>{ticket.title}</h3>
                <span className={getPriorityBadgeClass(ticket.priority)}>
                    {ticket.priority}
                </span>
            </div>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>
                {ticket.description.length > 120
                    ? ticket.description.substring(0, 120) + '...'
                    : ticket.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Tag size={14} /> {ticket.category}
                </div>
                <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Cpu size={14} /> {ticket.assignedTeam}
                </div>
                <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <MessageSquare size={14} /> {getSentimentIcon(ticket.sentiment)} {ticket.sentiment}
                </div>
                <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Brain size={14} /> Confidence: {ticket.confidence}%
                </div>
            </div>

            <button
                onClick={() => setShowXAI(!showXAI)}
                className="btn"
                style={{
                    width: '100%',
                    fontSize: '0.8rem',
                    padding: '0.5rem',
                    background: showXAI ? '#f1f5f9' : 'transparent',
                    color: showXAI ? 'var(--primary)' : 'var(--text-secondary)',
                    border: `1px solid ${showXAI ? 'var(--primary)' : 'var(--border-color)'}`,
                }}
            >
                {showXAI ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {showXAI ? 'Hide AI Reasoning' : 'Explain AI Reasoning'}
            </button>

            <AnimatePresence>
                {showXAI && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="xai-section"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Brain size={16} color="var(--primary)" />
                            <span className="xai-title">Classification Explanation</span>
                        </div>

                        <div style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                            <strong>Category Logic:</strong> {ticket.explanation.category}
                        </div>
                        <div style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                            <strong>Priority Logic:</strong> {ticket.explanation.priority}
                        </div>
                        <div style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                            <strong>Sentiment Logic:</strong> {ticket.explanation.sentiment}
                        </div>

                        {ticket.explanation.keywords.length > 0 && (
                            <div className="tag-list">
                                {ticket.explanation.keywords.map((kw, idx) => (
                                    <span key={idx} className="keyword">{kw}</span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <User size={12} /> {ticket.userEmail.split('@')[0]}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} /> {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
            </div>
        </motion.div>
    );
};

export default TicketCard;
