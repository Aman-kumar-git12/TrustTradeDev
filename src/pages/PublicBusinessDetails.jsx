import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Building2, Mail, Phone, User, ArrowLeft, Globe, Calendar, Image as ImageIcon, Star } from 'lucide-react';
import api from '../utils/api';
import UniversalShimmer from '../components/shimmers/UniversalShimmer';

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

            <div className="relative z-10">
                {/* Hero Section */}
                <div className="relative h-[32rem] bg-zinc-900 overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={mainImage}
                            alt={business.businessName}
                            className="w-full h-full object-cover opacity-60 blur-sm scale-110 contrast-125"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/80 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 dark:from-emerald-900/30 to-transparent mix-blend-overlay"></div>
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
                            className="absolute top-8 left-4 sm:left-8 text-blue-100 dark:text-emerald-100 hover:text-white flex items-center transition-colors bg-black/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-blue-500/20 dark:border-emerald-500/20 hover:bg-blue-600/20 dark:hover:bg-emerald-600/20 hover:border-blue-400/50 dark:hover:border-emerald-400/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] group"
                        >
                            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back
                        </button>

                        <div className="flex flex-col md:flex-row md:items-end gap-10 animate-fade-in-up">
                            {/* Floating Glass Card for Main Image */}
                            <div className="w-32 h-32 md:w-56 md:h-56 bg-white dark:bg-zinc-800 bluish:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-2 shadow-[0_0_40px_rgba(59,130,246,0.15)] dark:shadow-[0_0_40px_rgba(16,185,129,0.15)] rotate-3 transform border border-blue-500/20 dark:border-emerald-500/20 overflow-hidden flex-shrink-0 relative group hover:rotate-0 transition-transform duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_50px_rgba(16,185,129,0.3)] hover:border-blue-400/40 dark:hover:border-emerald-400/40">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10"></div>
                                <img
                                    src={mainImage}
                                    alt={business.businessName}
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            </div>

                            {/* Text Content */}
                            <div className="text-white pb-3 flex-grow">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="px-3 py-1 rounded-full bg-blue-500/10 dark:bg-emerald-500/10 border border-blue-400/30 dark:border-emerald-400/30 text-blue-300 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.2)] dark:shadow-[0_0_15px_rgba(16,185,129,0.2)] backdrop-blur-md">
                                        Verified Business
                                    </span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight leading-none drop-shadow-2xl">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-200 dark:via-emerald-100 dark:to-emerald-200 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] dark:drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                        {business.businessName}
                                    </span>
                                </h1>
                                <div className="flex wrap items-center gap-3 text-gray-300 bluish:text-blue-100 text-sm md:text-base font-medium">
                                    <div className="flex items-center bg-blue-900/20 dark:bg-emerald-900/20 backdrop-blur-md px-4 py-2 rounded-xl border border-blue-500/20 dark:border-emerald-500/20 hover:bg-blue-600/20 dark:hover:bg-emerald-600/20 transition-colors">
                                        <MapPin size={18} className="mr-2 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                        {business.location.city}, {business.location.place}
                                    </div>
                                    <div className="flex items-center bg-blue-900/20 dark:bg-emerald-900/20 backdrop-blur-md px-4 py-2 rounded-xl border border-blue-500/20 dark:border-emerald-500/20 hover:bg-blue-600/20 dark:hover:bg-emerald-600/20 transition-colors">
                                        <Globe size={18} className="mr-2 text-blue-400 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] dark:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        {business.industry || 'General Business'}
                                    </div>
                                    <div className="flex items-center bg-blue-900/20 dark:bg-emerald-900/20 backdrop-blur-md px-4 py-2 rounded-xl border border-blue-500/20 dark:border-emerald-500/20 hover:bg-blue-600/20 dark:hover:bg-emerald-600/20 transition-colors">
                                        <Calendar size={18} className="mr-2 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
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
                            <div className="bg-white dark:bg-zinc-900 bluish:bg-slate-900/60 rounded-3xl p-8 shadow-xl dark:shadow-none border border-gray-100 dark:border-zinc-800 bluish:border-blue-500/10 backdrop-blur-sm animate-fade-in-up transition-all hover:border-blue-500/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]" style={{ animationDelay: '100ms' }}>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white bluish:text-white mb-6 flex items-center">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-emerald-500/10 flex items-center justify-center mr-4 border border-blue-500/20 dark:border-emerald-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)] dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                        <Building2 className="text-blue-400 dark:text-cyan-400" size={20} />
                                    </div>
                                    About the Business
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 bluish:text-blue-100 leading-relaxed text-lg whitespace-pre-wrap font-light tracking-wide">
                                    {business.description}
                                </p>
                            </div>

                            {/* Gallery Section */}
                            <div className="bg-white dark:bg-zinc-900 bluish:bg-slate-900/60 rounded-3xl p-8 shadow-xl dark:shadow-none border border-gray-100 dark:border-zinc-800 bluish:border-blue-500/10 backdrop-blur-sm animate-fade-in-up transition-all hover:border-blue-500/20 dark:hover:border-emerald-500/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]" style={{ animationDelay: '200ms' }}>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white bluish:text-white mb-6 flex items-center">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center mr-4 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                        <ImageIcon className="text-indigo-400" size={20} />
                                    </div>
                                    Gallery
                                </h2>
                                {business.images && business.images.length > 1 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {business.images.slice(1, 5).map((img, idx) => (
                                            <div key={idx} className="aspect-square rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 border border-transparent dark:border-zinc-800 bluish:border-blue-500/20 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:border-blue-400/50 dark:hover:border-emerald-400/50 group relative">
                                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 dark:from-emerald-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"></div>
                                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 bluish:text-blue-300/60 border-2 border-dashed border-gray-100 dark:border-zinc-800 bluish:border-blue-500/10 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/50 bluish:bg-blue-500/5">
                                        <ImageIcon size={48} className="mb-3 opacity-50" />
                                        <p className="font-medium">Gallery is empty</p>
                                        <p className="text-xs mt-1 opacity-70">Business has not uploaded additional photos</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Contact & Owner */}
                        <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <Link to={`/user/${business.owner._id}`} className="block group">
                                <div className="bg-blue-600 dark:bg-emerald-600 bluish:bg-gradient-to-br bluish:from-slate-900 bluish:to-slate-800 rounded-3xl p-8 text-white shadow-xl shadow-blue-600/20 dark:shadow-emerald-600/20 bluish:shadow-[0_0_30px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(59,130,246,0.25)] dark:hover:shadow-[0_0_40px_rgba(16,185,129,0.25)] border bluish:border-blue-500/20 group-hover:border-blue-400/40 dark:group-hover:border-emerald-400/40">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                                    <div className="absolute inset-0 bluish:bg-gradient-to-tr bluish:from-blue-600/10 bluish:to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
                                        <User size={120} />
                                    </div>

                                    <div className="flex justify-between items-start mb-6 relative z-10">
                                        <h3 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-cyan-300 dark:from-emerald-100 dark:to-cyan-300 drop-shadow-sm">Business Owner</h3>
                                        <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20 group-hover:bg-white group-hover:text-slate-900 transition-colors shadow">
                                            View Profile
                                        </div>
                                    </div>

                                    <div className="flex items-center mb-6 relative z-10">
                                        <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-blue-400/30 dark:border-emerald-400/30 flex items-center justify-center overflow-hidden mr-4 group-hover:border-blue-400/60 dark:group-hover:border-emerald-400/60 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.2)] dark:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                                            {business.owner?.avatarUrl ? (
                                                <img src={business.owner.avatarUrl} alt={business.owner.fullName} className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={32} className="text-blue-200" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">{business.owner?.fullName || 'Hidden User'}</p>
                                            <p className="text-blue-100 dark:text-emerald-100 bluish:text-blue-300 text-sm font-medium flex items-center">
                                                <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" /> Verified Seller
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 relative z-10">
                                        <div className="flex items-center bg-black/30 bluish:bg-slate-950/50 p-3 rounded-xl backdrop-blur-sm group-hover:bg-slate-950/70 transition-colors border border-blue-500/10 dark:border-emerald-500/10 group-hover:border-blue-500/30 dark:group-hover:border-emerald-500/30">
                                            <Mail size={18} className="mr-3 text-blue-200 dark:text-emerald-200 bluish:text-cyan-400" />
                                            <span className="text-sm font-medium truncate opacity-90 text-blue-100 dark:text-emerald-100">{business.owner?.email}</span>
                                        </div>
                                        <div className="flex items-center bg-black/30 bluish:bg-slate-950/50 p-3 rounded-xl backdrop-blur-sm group-hover:bg-slate-950/70 transition-colors border border-blue-500/10 dark:border-emerald-500/10 group-hover:border-blue-500/30 dark:group-hover:border-emerald-500/30">
                                            <Phone size={18} className="mr-3 text-blue-200 dark:text-emerald-200 bluish:text-cyan-400" />
                                            <span className="text-sm font-medium opacity-90 text-blue-100 dark:text-emerald-100">{business.owner?.phone || 'No Phone'}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-b bluish:from-slate-900/60 bluish:to-[#0a0f1d]/60 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-zinc-800 bluish:border-blue-500/20 text-center backdrop-blur-xl">
                                <p className="text-gray-500 dark:text-gray-400 bluish:text-blue-200 text-sm mb-4 font-bold tracking-wide uppercase">Interested in this business?</p>
                                <button
                                    onClick={() => navigate(`/businessdetails/${businessId}/listings`)}
                                    className="w-full py-4 bg-gray-900 dark:bg-white bluish:bg-gradient-to-r bluish:from-blue-600 bluish:to-cyan-600 text-white dark:text-gray-900 bluish:text-white font-bold rounded-xl hover:opacity-90 bluish:hover:from-blue-50 bluish:hover:to-cyan-500 transition-all shadow-lg bluish:shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-xl hover:-translate-y-0.5"
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
