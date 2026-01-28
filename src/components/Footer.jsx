import { useState } from 'react';
import {
    Linkedin,
    Youtube,
    MessageCircle,
    Send,
    HelpCircle,
    Info,
    ChevronDown,
    ChevronUp,
    Mail,
    MapPin,
    Globe,
    CheckCircle,
    Phone,
    X,
    MessageSquare
} from 'lucide-react';
import api from '../utils/api';
import { AnimatePresence, motion } from 'framer-motion';

const Footer = () => {
    const [activeSection, setActiveSection] = useState(null); // 'about', 'faq', 'support', or null

    // Snackbar State
    const [snackbar, setSnackbar] = useState({ show: false, message: '', icon: null });

    const showSnackbar = (message, icon) => {
        setSnackbar({ show: true, message, icon });
        setTimeout(() => setSnackbar(prev => ({ ...prev, show: false })), 3000);
    };

    const handleSocialClick = (e, platform) => {
        e.preventDefault();
        let message = "";
        let Icon = Info;

        switch (platform) {
            case 'linkedin':
                message = "Hang tight! LinkedIn is on the way 🚀";
                Icon = Linkedin;
                break;
            case 'whatsapp':
                message = "Hold on! WhatsApp is coming soon 💬";
                Icon = MessageCircle;
                break;
            case 'youtube':
                message = "Grab popcorn! YouTube is loading... 🍿";
                Icon = Youtube;
                break;
            default:
                message = "Link is on the way!";
        }
        showSnackbar(message, Icon);
    };

    // Support Form State
    const [supportForm, setSupportForm] = useState({ subject: '', message: '' });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    // FAQ State
    const [expandedFaq, setExpandedFaq] = useState(null);

    const handleSupportSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await api.post('/support', {
                subject: supportForm.subject || 'General Inquiry from Footer',
                message: supportForm.message,
                priority: 'medium'
            });
            setSent(true);
            setSupportForm({ subject: '', message: '' });
            setTimeout(() => {
                setSent(false);
                setActiveSection(null);
            }, 5000);
        } catch (error) {
            console.error("Failed to send support message", error);
        } finally {
            setSending(false);
        }
    };

    const toggleContent = (section) => {
        if (activeSection === section) setActiveSection(null);
        else setActiveSection(section);
    };

    const toggleFaq = (idx) => {
        if (expandedFaq === idx) setExpandedFaq(null);
        else setExpandedFaq(idx);
    };

    const faqs = [
        { q: "How does TrustTrade verify businesses?", a: "We conduct a rigorous 3-step verification process including financial audits, owner identity verification, and asset functionality tests." },
        { q: "Is my payment secure?", a: "Yes. All payments are held in escrow until the asset transfer is confirmed by both parties. We use Razorpay for secure transaction processing." },
        { q: "Can I sell multiple businesses?", a: "Absolutely. Our platform is designed for serial entrepreneurs. You can list and manage multiple asset sales simultaneously from your dashboard." }
    ];

    return (
        <footer className="relative z-10 bg-gradient-to-b from-white to-gray-100 dark:from-[#0a0f1d] dark:to-black bluish:from-[#0a0f1d] bluish:to-[#05080f] pt-10 pb-10 border-t border-gray-200 dark:border-white/5 mt-0 transition-all duration-300">
            {/* Decorative Top Border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-50"></div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 mb-12">

                    {/* Left Side: Brand & Description */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                TrustTrade
                            </h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm max-w-sm">
                            The premier marketplace for buying and selling initialized digital assets. Building the future of business acquisition with security and trust.
                        </p>
                        <div className="flex gap-4">
                            <SocialButton
                                icon={<Linkedin className="w-5 h-5" />}
                                color="text-blue-600 hover:bg-blue-600"
                                onClick={(e) => handleSocialClick(e, 'linkedin')}
                            />
                            <SocialButton
                                icon={<MessageCircle className="w-5 h-5" />}
                                color="text-green-600 hover:bg-green-600"
                                onClick={(e) => handleSocialClick(e, 'whatsapp')}
                            />
                            <SocialButton
                                icon={<Youtube className="w-5 h-5" />}
                                color="text-red-600 hover:bg-red-600"
                                onClick={(e) => handleSocialClick(e, 'youtube')}
                            />
                        </div>
                    </div>

                    {/* Middle: About Us & FAQ */}
                    <div className="flex flex-col items-start md:items-center">
                        <div className="w-full max-w-xs">
                            <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Learn More</h3>
                            <ul className="space-y-4">
                                <FooterLink
                                    label="About Us"
                                    active={activeSection === 'about'}
                                    onClick={() => toggleContent('about')}
                                    icon={<Info className="w-4 h-4" />}
                                />
                                <FooterLink
                                    label="Frequently Asked Questions"
                                    active={activeSection === 'faq'}
                                    onClick={() => toggleContent('faq')}
                                    icon={<HelpCircle className="w-4 h-4" />}
                                />
                            </ul>
                        </div>
                    </div>

                    {/* Right Side: Contact Us (Direct, Email, Phone) */}
                    <div className="flex flex-col items-start md:items-end">
                        <div className="w-full max-w-xs md:text-right">
                            <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Contact Us</h3>
                            <div className="space-y-4 flex flex-col items-start md:items-end">
                                {/* Direct Message - Opens Input */}
                                <button
                                    onClick={() => toggleContent('support')}
                                    className={`flex items-center gap-3 group transition-all ${activeSection === 'support' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
                                >
                                    <span className="text-sm font-medium">Direct Message Support</span>
                                    <div className={`w-8 h-8 rounded-full bg-blue-50 dark:bg-white/5 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors ${activeSection === 'support' ? 'bg-blue-500 text-white' : ''}`}>
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                </button>

                                {/* Email */}
                                <a href="mailto:contact@trusttrade.com" className="flex items-center gap-3 group text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    <span className="text-sm font-medium">contact@trusttrade.com</span>
                                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-white/5 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                </a>

                                {/* Phone */}
                                <a href="tel:+919876543210" className="flex items-center gap-3 group text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    <span className="text-sm font-medium">+91 98765 43210</span>
                                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-white/5 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Content Area (Slides Down) */}
                <AnimatePresence mode="wait">
                    {activeSection && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -20 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -20 }}
                            className="bg-white dark:bg-[#111] bluish:bg-[#111827] rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl mb-12 relative"
                        >
                            <button
                                onClick={() => setActiveSection(null)}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors z-10"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>

                            {/* About Section */}
                            {activeSection === 'about' && (
                                <div className="p-8 md:p-12">
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                        <Info className="w-6 h-6" /> About TrustTrade
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-8 text-gray-600 dark:text-gray-300 leading-relaxed">
                                        <div>
                                            <p className="mb-4">
                                                TrustTrade is revolutionized the way digital assets are bought and sold. Founded in 2024, our mission is to provide a secure, transparent, and efficient marketplace for entrepreneurs and investors.
                                            </p>
                                            <p>
                                                We bridge the gap between innovation and acquisition. Whether you are selling a SaaS verified by Stripe, or an e-commerce store with logistic history, TrustTrade provides the verification layer you need.
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl">
                                            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Our Promise</h4>
                                            <ul className="space-y-2 text-sm">
                                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 100% Verified Sellers</li>
                                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Bank-Grade Escrow</li>
                                                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 24/7 Support Team</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* FAQ Section */}
                            {activeSection === 'faq' && (
                                <div className="p-8 md:p-12">
                                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 text-purple-600 dark:text-purple-400">
                                        <HelpCircle className="w-6 h-6" /> Frequently Asked Questions
                                    </h3>
                                    <div className="grid gap-4 max-w-3xl mx-auto">
                                        {faqs.map((faq, idx) => (
                                            <div key={idx} className="border border-gray-100 dark:border-white/5 rounded-xl overflow-hidden bg-gray-50 dark:bg-white/5">
                                                <button
                                                    onClick={() => toggleFaq(idx)}
                                                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                                >
                                                    <span className="font-semibold text-gray-900 dark:text-white">{faq.q}</span>
                                                    {expandedFaq === idx ? <ChevronUp className="w-5 h-5 text-blue-500" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                                </button>
                                                <AnimatePresence>
                                                    {expandedFaq === idx && (
                                                        <motion.div
                                                            initial={{ height: 0 }}
                                                            animate={{ height: 'auto' }}
                                                            exit={{ height: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="p-5 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-white/5">
                                                                {faq.a}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Support Form Section */}
                            {activeSection === 'support' && (
                                <div className="p-8 md:p-12">
                                    {sent ? (
                                        <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
                                                <CheckCircle className="w-10 h-10" />
                                            </div>
                                            <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Message Sent Successfully!</h4>
                                            <p className="text-gray-500 max-w-md mx-auto">Thank you for reaching out. Our support team has received your query and will get back to you via email within 24 hours.</p>
                                        </div>
                                    ) : (
                                        <div className="grid md:grid-cols-2 gap-12">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-600 dark:text-green-400">
                                                    <MessageCircle className="w-6 h-6" /> Direct Message Support
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                                    Facing an issue with a transaction or have a general inquiry? Fill out the form and our engineering team will assist you directly.
                                                </p>
                                                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                                                    <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2">Support Hours</h4>
                                                    <div className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                                                        <p className="flex justify-between"><span>Monday - Friday</span> <span>9:00 AM - 8:00 PM IST</span></p>
                                                        <p className="flex justify-between"><span>Weekend</span> <span>10:00 AM - 4:00 PM IST</span></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <form onSubmit={handleSupportSubmit} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                                                    <input
                                                        type="text"
                                                        placeholder="What is this about?"
                                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-400"
                                                        value={supportForm.subject}
                                                        onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                                    <textarea
                                                        placeholder="Describe your issue or question detailedly..."
                                                        rows="5"
                                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:border-green-500 transition-all placeholder:text-gray-400 resize-none"
                                                        value={supportForm.message}
                                                        onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                                                        required
                                                    ></textarea>
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={sending}
                                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20 active:scale-95 disabled:opacity-50"
                                                >
                                                    {sending ? (
                                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                                    ) : (
                                                        <>
                                                            Send Message <Send className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Snackbar */}
                <AnimatePresence>
                    {snackbar.show && (
                        <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.9 }}
                            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md bg-blue-600/90 text-white border-blue-400/50"
                        >
                            {snackbar.icon ? <snackbar.icon className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                            <span className="text-sm font-bold">{snackbar.message}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Copyright */}
                <div className="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} TrustTrade Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-blue-500 transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialButton = ({ icon, color, onClick }) => (
    <button
        onClick={onClick}
        className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 dark:text-gray-400 transition-all transform hover:-translate-y-1 hover:text-white ${color}`}
    >
        {icon}
    </button>
);

const FooterLink = ({ label, active, onClick, icon }) => (
    <li>
        <button
            onClick={onClick}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${active ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
        >
            <span className={`p-1 rounded-full ${active ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-transparent'}`}>{icon}</span>
            {label}
        </button>
    </li>
);

export default Footer;
