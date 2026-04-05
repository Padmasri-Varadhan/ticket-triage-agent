import React, { useState } from 'react';
import axios from 'axios';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TicketForm = ({ onTicketSubmitted }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        userEmail: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post(
                "https://ticket-triage-agent-t86f.onrender.com/api/tickets", // ✅ FIXED URL
                formData // ✅ FIXED variable
            );

            console.log("Success:", response.data);

            setIsSuccess(true);

            setTimeout(() => {
                setIsSuccess(false);
                setFormData({ title: '', description: '', userEmail: '' });

                // update dashboard
                if (onTicketSubmitted) {
                    onTicketSubmitted(response.data);
                }
            }, 2000);

        } catch (error) {
            console.error("Submission error:", error.response?.data || error.message);
            alert("Failed to submit ticket. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="ticket-form card"
        >
            <h2 style={{ marginBottom: '1.5rem', fontFamily: 'Outfit, sans-serif' }}>
                Submit Support Ticket
            </h2>

            <AnimatePresence mode="wait">
                {isSuccess ? (
                    <motion.div
                        key="success"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        style={{ textAlign: 'center', padding: '3rem 0' }}
                    >
                        <CheckCircle2 color="#10b981" size={64} style={{ marginBottom: '1rem' }} />
                        <h3 style={{ color: '#10b981' }}>Ticket Submitted!</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Our AI is triaging your request...
                        </p>
                    </motion.div>
                ) : (
                    <form key="form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="userEmail">Your Email</label>
                            <input
                                type="email"
                                id="userEmail"
                                required
                                placeholder="alex@company.com"
                                value={formData.userEmail}
                                onChange={(e) =>
                                    setFormData({ ...formData, userEmail: e.target.value })
                                }
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="title">Issue Title</label>
                            <input
                                type="text"
                                id="title"
                                required
                                placeholder="Brief summary of the issue"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="description">Detailed Description</label>
                            <textarea
                                id="description"
                                rows="5"
                                required
                                placeholder="Please describe your issue in detail..."
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="btn"
                            disabled={isSubmitting}
                            style={{ width: '100%' }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} /> Processing...
                                </>
                            ) : (
                                <>
                                    <Send size={20} /> Submit Ticket
                                </>
                            )}
                        </button>
                    </form>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TicketForm;