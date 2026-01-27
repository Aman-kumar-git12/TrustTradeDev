import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Building2, Mail, Phone, User, ArrowLeft, Globe, Calendar, Image as ImageIcon, Star } from 'lucide-react';
import api from '../utils/api';
import UniversalShimmer from '../components/shimmers/UniversalShimmer';
import OptimizedImage from '../components/OptimizedImage';

const PublicBusinessDetails = () => {
    const { businessId } = useParams();
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBusinessDetails = async () => {
            try {
                const { data } = await api.get(`/businesses/${businessId}`);
                setBusiness(data);
            } catch (err) {
                console.error('Failed to fetch business details', err);
                setError('Failed to load business details. It may not exist or has been removed.');
            } finally {
                setLoading(false);
            }
        };

        if (businessId) {
            fetchBusinessDetails();
        }
    }, [businessId]);

    if (loading) return <UniversalShimmer />;

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
            <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl max-w-lg w-full">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                    <Building2 size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Business Not Found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
                <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Return Home
                </Link>
            </div>
        </div>
    );

    const mainImage = (business.images && business.images.length > 0) ? business.images[0] : 'https://cdn-icons-png.freepik.com/512/1465/1465439.png';

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-zinc-950 bluish:bg-[#0a0f1d] selection:bg-blue-500/30 dark:selection:bg-emerald-500/30 bluish:selection:bg-blue-500/30 font-sans transition-colors duration-300 relative overflow-hidden">

            {/* Background Image & Overlay - Simple static background for performance */}
            <div className="fixed inset-0 z-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1d]/5 via-[#0a0f1d]/80 to-[#0a0f1d] pointer-events-none"></div>
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <div className="relative h-[28rem] md:h-[32rem] bg-zinc-900 overflow-hidden">
                    <div className="absolute inset-0">
                        {/* Use OptimizedImage but without blur implementation here to allow custom styling if needed or just use standard img if we want absolute control, but OptimizedImage is better for loading. 
                            However, for Hero background, we want it to be cover and perhaps slightly darker.
                         */}
                        <img
                            src={mainImage}
                            alt={business.businessName}
                            className="w-full h-full object-cover opacity-40 scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/60 to-transparent"></div>
                    </div>

                    <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16">
                        <button
                            onClick={() => {
                                if (window.history.state && window.history.state.idx > 0) {
                                    navigate(-1);
                                } else {
                                    navigate('/marketplace'); // Safer fallback than home
                                }
                            }}
                            className="absolute top-8 left-4 sm:left-8 text-blue-100 dark:text-emerald-100 hover:text-white flex items-center transition-colors bg-black/40 backdrop-blur-sm px-5 py-2.5 rounded-full border border-blue-500/20 dark:border-emerald-500/20 hover:bg-blue-600/30 dark:hover:bg-emerald-600/30"
                        >
                            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back
                        </button>

                        <div className="flex flex-col md:flex-row md:items-end gap-10">
                            {/* Static Card for Main Image - Removed expensive rotation and heavy shadows */}
                            <div className="w-32 h-32 md:w-56 md:h-56 bg-white dark:bg-zinc-800 bluish:bg-slate-900 rounded-3xl p-1 shadow-2xl overflow-hidden flex-shrink-0 relative border border-white/10">
                                <OptimizedImage
                                    src={mainImage}
                                    alt={business.businessName}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>

                            {/* Text Content */}
                            <div className="text-white pb-3 flex-grow">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-3 py-1 rounded-full bg-blue-500/20 dark:bg-emerald-500/20 border border-blue-400/30 dark:border-emerald-400/30 text-blue-300 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                                        Verified Business
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight leading-none text-white">
                                    {business.businessName}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 text-gray-300 bluish:text-blue-100 text-sm md:text-base font-medium">
                                    <div className="flex items-center bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                                        <MapPin size={18} className="mr-2 text-cyan-400" />
                                        {business.location.city}, {business.location.place}
                                    </div>
                                    <div className="flex items-center bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                                        <Globe size={18} className="mr-2 text-blue-400 dark:text-emerald-400" />
                                        {business.industry || 'General Business'}
                                    </div>
                                    <div className="flex items-center bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                                        <Calendar size={18} className="mr-2 text-indigo-400" />
                                        Member since {new Date(business.createdAt).getFullYear()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Left Column: About */}
                        <div className="md:col-span-2 space-y-8">
                            <div className="bg-white dark:bg-zinc-900 bluish:bg-slate-900 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-zinc-800 bluish:border-white/5">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white bluish:text-white mb-6 flex items-center">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-emerald-500/10 flex items-center justify-center mr-4 border border-blue-500/20 dark:border-emerald-500/20">
                                        <Building2 className="text-blue-400 dark:text-cyan-400" size={20} />
                                    </div>
                                    About the Business
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 bluish:text-blue-100 leading-relaxed text-lg whitespace-pre-wrap font-light tracking-wide">
                                    {business.description}
                                </p>
                            </div>

                            {/* Gallery Section */}
                            <div className="bg-white dark:bg-zinc-900 bluish:bg-slate-900 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-zinc-800 bluish:border-white/5">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white bluish:text-white mb-6 flex items-center">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mr-4 border border-indigo-500/20">
                                        <ImageIcon className="text-indigo-400" size={20} />
                                    </div>
                                    Gallery
                                </h2>
                                {business.images && business.images.length > 1 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {business.images.slice(1, 5).map((img, idx) => (
                                            <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-transparent dark:border-zinc-800 bluish:border-white/10 hover:opacity-90 transition-opacity relative bg-gray-100 dark:bg-zinc-800">
                                                <OptimizedImage src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 bluish:text-blue-300/60 border-2 border-dashed border-gray-100 dark:border-zinc-800 bluish:border-white/5 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/50">
                                        <ImageIcon size={48} className="mb-3 opacity-50" />
                                        <p className="font-medium">Gallery is empty</p>
                                        <p className="text-xs mt-1 opacity-70">Business has not uploaded additional photos</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Contact & Owner */}
                        <div className="space-y-6">
                            <Link to={`/user/${business.owner._id}`} className="block group">
                                <div className="bg-blue-600 dark:bg-emerald-600 bluish:bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl border bluish:border-white/10 group-hover:border-blue-400/30">
                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <h3 className="text-xl font-bold tracking-tight text-white/95">Business Owner</h3>
                                        <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20 group-hover:bg-white group-hover:text-slate-900 transition-colors shadow">
                                            View Profile
                                        </div>
                                    </div>

                                    <div className="flex items-center mb-6 relative z-10">
                                        <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden mr-4 shadow-lg bg-gray-800">
                                            {business.owner?.avatarUrl ? (
                                                <img src={business.owner.avatarUrl} alt={business.owner.fullName} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={32} className="text-white/50" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-white group-hover:text-blue-100 transition-colors">{business.owner?.fullName || 'Hidden User'}</p>
                                            <p className="text-blue-100 dark:text-emerald-100 bluish:text-blue-300 text-sm font-medium flex items-center">
                                                <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" /> Verified Seller
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 relative z-10">
                                        <div className="flex items-center bg-black/20 p-3 rounded-xl backdrop-blur-sm border border-white/5">
                                            <Mail size={18} className="mr-3 text-blue-200 dark:text-emerald-200 bluish:text-cyan-400" />
                                            <span className="text-sm font-medium truncate opacity-90 text-blue-100 dark:text-emerald-100">{business.owner?.email}</span>
                                        </div>
                                        <div className="flex items-center bg-black/20 p-3 rounded-xl backdrop-blur-sm border border-white/5">
                                            <Phone size={18} className="mr-3 text-blue-200 dark:text-emerald-200 bluish:text-cyan-400" />
                                            <span className="text-sm font-medium opacity-90 text-blue-100 dark:text-emerald-100">{business.owner?.phone || 'No Phone'}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <div className="bg-white dark:bg-zinc-900 bluish:bg-slate-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-zinc-800 bluish:border-white/5 text-center">
                                <p className="text-gray-500 dark:text-gray-400 bluish:text-blue-200 text-sm mb-4 font-bold tracking-wide uppercase">Interested in this business?</p>
                                <button
                                    onClick={() => navigate(`/businessdetails/${businessId}/listings`)}
                                    className="w-full py-4 bg-gray-900 dark:bg-white bluish:bg-blue-600 text-white dark:text-gray-900 bluish:text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    View Active Listings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicBusinessDetails;
