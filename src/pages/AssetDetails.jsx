import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Tag, CheckCircle, ArrowLeft, X, PartyPopper, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import AssetDetailsShimmer from '../components/shimmers/AssetDetailsShimmer';
import { motion, AnimatePresence } from 'framer-motion';

const AssetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showSnackbar } = useUI();
    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [showInterestModal, setShowInterestModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showLightbox, setShowLightbox] = useState(false);
    const [modalAction, setModalAction] = useState('pending'); // 'pending' or 'negotiating'
    const [message, setMessage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const { data } = await api.get(`/assets/${id}`);
                setAsset(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAsset();

        // Record View
        const recordView = async () => {
            try {
                await api.post(`/assets/${id}/view`, {});
            } catch (error) {
                // Fail silently, views aren't critical to UX
                console.error('Failed to log view', error);
            }
        };
        if (id) recordView();
    }, [id]);

    // Auto-scroll images
    useEffect(() => {
        if (!asset?.images || asset.images.length <= 1 || isHovered || showLightbox) return;

        const timer = setInterval(() => {
            setActiveImageIndex(prev => (prev + 1) % asset.images.length);
        }, 3000);

        return () => clearInterval(timer);
    }, [asset, isHovered, showLightbox]);

    const handleOpenModal = (action) => {
        if (!user) return navigate('/login');
        setModalAction(action);
        // Default messages based on action
        if (action === 'negotiating') {
            setMessage(`I would like to negotiate the price for "${asset.title}". My initial thoughts are...`);
        } else {
            setMessage(`I am interested in acquiring "${asset.title}". Could you please provide more details?`);
        }
        setShowInterestModal(true);
    };

    const handleShowInterest = async () => {
        try {
            await api.post('/interests', {
                assetId: asset._id,
                message,
                status: modalAction,
                quantity
            });
            setShowInterestModal(false);
            setShowSuccessModal(true);
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to send request', 'error');
        }
    };

    if (loading) return <AssetDetailsShimmer />;

    if (!asset) return (
        <div className="p-12 text-center text-gray-500 dark:text-gray-400 min-h-screen transition-colors duration-300">
            Asset not found
        </div>
    );

    return (
        <div className="min-h-screen transition-colors duration-300 bg-slate-50 dark:bg-zinc-950 bluish:bg-[#0a0f1d] selection:bg-blue-500/30 bluish:selection:bg-blue-500/30 font-sans relative overflow-hidden scrollbar-thin scrollbar-thumb-blue-600 dark:scrollbar-thumb-emerald-600 scrollbar-track-slate-900">
            <div className="fixed inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff33_1px,#000000_1px)] bluish:bg-[radial-gradient(#ffffff33_1px,#0a0f1d_1px)] [background-size:20px_20px] opacity-20 dark:opacity-[0.26] bluish:opacity-[0.26] pointer-events-none z-[1]"></div>
            {/* Dynamic Background Elements - Bluish Theme Only */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden bluish:block">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>

                {/* Background Image & Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1d]/90 via-[#0a0f1d]/80 to-[#0a0f1d]"></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
                {/* Navigation and Heading */}
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-zinc-800 pb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors group"
                    >
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">Asset Details</h1>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Gallery Section */}
                    <div
                        className="space-y-4 select-none"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        {/* Main Image */}
                        <div
                            className="bg-gray-50 dark:bg-zinc-900 bluish:bg-slate-900 bluish:backdrop-blur-xl rounded-2xl h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden border border-gray-100 dark:border-zinc-800 bluish:border-blue-500/20 shadow-inner bluish:shadow-[0_0_40px_rgba(59,130,246,0.1)] relative group cursor-zoom-in hover:border-blue-400/30 transition-all duration-500"
                            onClick={() => setShowLightbox(true)}
                        >
                            {asset.images && asset.images.length > 0 ? (
                                <img
                                    src={asset.images[activeImageIndex]}
                                    alt={asset.title}
                                    className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <span className="text-gray-400 dark:text-zinc-600 font-medium">No Image Available</span>
                            )}

                            {/* Slide Indicators */}
                            {asset.images && asset.images.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                    {asset.images.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${activeImageIndex === idx ? 'w-6 bg-blue-500 dark:bg-emerald-500' : 'w-1.5 bg-gray-300/50'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {asset.images && asset.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                                {asset.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all p-1 bg-white dark:bg-zinc-900 snap-start ${activeImageIndex === idx
                                            ? 'border-blue-500 dark:border-emerald-500 shadow-md scale-105'
                                            : 'border-transparent hover:border-blue-300 dark:hover:border-emerald-700 opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div>
                        <div className="flex items-center space-x-2 text-blue-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-sm mb-4">
                            <Tag size={16} /> <span>{asset.category}</span>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <span>{asset.condition}</span>
                        </div>

                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
                            <span className="bluish:text-transparent bluish:bg-clip-text bluish:bg-gradient-to-r bluish:from-white bluish:via-blue-100 bluish:to-blue-200 bluish:drop-shadow-lg">
                                {asset.title}
                            </span>
                        </h1>
                        <div className="text-3xl font-display font-bold text-gray-900 dark:text-gray-200 bluish:text-white mb-2 transition-colors duration-300 flex items-center gap-2">
                            <span className="bluish:text-cyan-400 bluish:drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                                ${asset.price.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                                <CheckCircle size={14} className="mr-1.5 text-blue-500 dark:text-emerald-500" />
                                {asset.quantity} Available
                            </div>
                            {asset.sales > 0 && (
                                <div className="flex items-center text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                                    <Tag size={14} className="mr-1.5 text-blue-500 dark:text-emerald-500" />
                                    {asset.sales} Sold
                                </div>
                            )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 bluish:text-blue-100/90 text-lg leading-relaxed mb-8 transition-colors duration-300 font-light tracking-wide">
                            {asset.description}
                        </p>

                        <div className="bg-slate-50 dark:bg-zinc-900 bluish:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800 bluish:border-blue-500/20 mb-8 shadow-sm bluish:shadow-lg backdrop-blur-md transition-colors duration-300">
                            <div className="flex items-center text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                <MapPin className="mr-2 text-blue-500 dark:text-emerald-400" /> Location: <strong className="ml-1 text-gray-900 dark:text-white">{asset.location}</strong>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                <CheckCircle className="mr-2 text-blue-500 dark:text-emerald-400" /> Seller: <strong className="ml-1 text-gray-900 dark:text-white">{asset.seller?.fullName}</strong>
                            </div>
                        </div>

                        {user?._id === asset.seller?._id ? (
                            <div className="text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg text-center border border-gray-100 dark:border-zinc-800">
                                This is your listing
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleOpenModal('pending')}
                                    className="bg-blue-600 hover:bg-blue-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 bluish:bg-gradient-to-r bluish:from-blue-600 bluish:to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 dark:shadow-emerald-500/20 bluish:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-[1.02] bluish:hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] border border-transparent bluish:border-blue-400/30"
                                >
                                    Show Interest
                                </button>
                                <button
                                    onClick={() => handleOpenModal('negotiating')}
                                    className="bg-indigo-600 hover:bg-indigo-700 bluish:bg-gradient-to-r bluish:from-blue-600 bluish:to-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/20 bluish:shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all transform hover:scale-[1.02] bluish:hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] border border-transparent bluish:border-indigo-400/30"
                                >
                                    Negotiate Price
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Modals */}
                <AnimatePresence>
                    {/* Input Modal */}
                    {showInterestModal && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-8 relative border border-gray-100 dark:border-zinc-800 shadow-2xl transition-colors duration-300"
                            >
                                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                                    {modalAction === 'negotiating' ? 'Start Negotiation' : 'Express Interest'}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {modalAction === 'negotiating'
                                        ? "Propose your terms or ask for a price discussion. Direct communication helps close deals faster."
                                        : "Send a message to express your interest. If the seller accepts, you'll get their direct contact details."}
                                </p>

                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Quantity</label>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors font-bold"
                                        >
                                            -
                                        </button>
                                        <span className="text-xl font-bold dark:text-white w-8 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(asset.quantity, quantity + 1))}
                                            className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors font-bold"
                                        >
                                            +
                                        </button>
                                        <span className="text-sm text-gray-500 dark:text-zinc-500 font-medium">({asset.quantity} units available)</span>
                                    </div>
                                </div>

                                <textarea
                                    className="w-full border border-gray-200 dark:border-zinc-700 rounded-xl p-3 mb-4 h-32 focus:ring-2 focus:ring-blue-500 dark:focus:ring-emerald-500 outline-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-white transition-colors duration-300 font-medium"
                                    placeholder={modalAction === 'negotiating' ? "Describe your offer or negotiation goal..." : "I'm interested in this asset..."}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />

                                <div className="flex space-x-4">
                                    <button
                                        onClick={handleShowInterest}
                                        className={`flex-1 ${modalAction === 'negotiating' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20' : 'bg-blue-600 hover:bg-blue-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-blue-500/20 dark:shadow-emerald-500/20'} text-white py-3 rounded-xl font-bold transition-colors shadow-lg`}
                                    >
                                        {modalAction === 'negotiating' ? 'Begin Negotiation' : 'Send Request'}
                                    </button>
                                    <button
                                        onClick={() => setShowInterestModal(false)}
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Celebration Modal */}
                    {showSuccessModal && (
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                className="bg-[#121212] border border-blue-500/30 rounded-3xl max-w-md w-full p-10 text-center shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ y: [-20, 20], rotate: [0, 360], opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 2 + i, repeat: Infinity, ease: "linear" }}
                                            className="absolute"
                                            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, color: i % 2 === 0 ? '#10b981' : '#6366f1' }}
                                        >
                                            <PartyPopper size={24} />
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="w-24 h-24 bg-blue-500/20 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/50 dark:border-emerald-500/50"
                                >
                                    <CheckCircle size={48} className="text-blue-400 dark:text-emerald-400" />
                                </motion.div>

                                <h2 className="text-3xl font-bold text-white mb-4">Request Sent Successfully!</h2>
                                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                                    You successfully sent interest. Go to the dashboard to see the details.
                                </p>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => navigate(`/dashboard/buyer/${user?._id}`)}
                                        className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center group transition-all"
                                    >
                                        Go to Buyer Dashboard
                                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => setShowSuccessModal(false)}
                                        className="w-full text-gray-500 hover:text-white font-medium py-2 transition-colors"
                                    >
                                        Keep Browsing
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Lightbox */}
                    {showLightbox && asset.images && (
                        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 overflow-hidden" onClick={() => setShowLightbox(false)}>
                            <button className="absolute top-6 right-6 text-white/50 hover:text-white z-[70] transition-colors">
                                <X size={40} />
                            </button>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative max-w-7xl max-h-screen flex items-center justify-center"
                                onClick={e => e.stopPropagation()}
                            >
                                <img
                                    src={asset.images[activeImageIndex]}
                                    alt="Full View"
                                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                                />
                                {asset.images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev - 1 + asset.images.length) % asset.images.length); }}
                                            className="absolute -left-16 top-1/2 -translate-y-1/2 p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all hidden md:block"
                                        >
                                            <ArrowLeft size={32} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev + 1) % asset.images.length); }}
                                            className="absolute -right-16 top-1/2 -translate-y-1/2 p-4 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all hidden md:block"
                                        >
                                            <ArrowRight size={32} />
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AssetDetails;
