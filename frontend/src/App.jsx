import React, { useState } from 'react';
import TicketForm from './components/TicketForm';
import Dashboard from './components/Dashboard';
import { Ticket, Activity, LifeBuoy, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); // Default to dashboard for the prototype view

    return (
        <div className="app-container">
            <header>
                <div className="logo">
                    <BrainCircuit size={32} color="#6366f1" />
                    <span>TriageAI</span>
                </div>

                <nav className="nav-tabs">
                    <button
                        className={`nav-tab ${activeTab === 'submit' ? 'active' : ''}`}
                        onClick={() => setActiveTab('submit')}
                    >
                        <Ticket size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        New Ticket
                    </button>
                    <button
                        className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <Activity size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        Triage Feed
                    </button>
                </nav>
            </header>

            <main>
                <AnimatePresence mode="wait">
                    {activeTab === 'submit' && (
                        <motion.div
                            key="submit"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TicketForm onTicketSubmitted={() => setActiveTab('dashboard')} />
                        </motion.div>
                    )}

                    {activeTab === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Dashboard />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <footer style={{ marginTop: '4rem', textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-color)' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <LifeBuoy size={14} /> Driven by Explainable AI Engine v1.0.0
                </p>
            </footer>
        </div>
    );
};

export default App;
