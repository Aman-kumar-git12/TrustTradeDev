import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Building2, Mail, Phone, User, ArrowLeft, Globe, Calendar, Image as ImageIcon } from 'lucide-react';
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
                <Link to="/" className="inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Return Home
                </Link>
            </div>
        </div>
    );

    const mainImage = (business.images && business.images.length > 0) ? business.images[0] : 'https://cdn-icons-png.freepik.com/512/1465/1465439.png';

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-zinc-950 font-sans transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative h-80 bg-zinc-900 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={mainImage}
                        alt={business.businessName}
                        className="w-full h-full object-cover opacity-60 blur-sm scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
                </div>

                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
                    <button
                        onClick={() => {
                            if (window.history.state && window.history.state.idx > 0) {
                                navigate(-1);
                            } else {
                                navigate('/marketplace'); // Safer fallback than home
                            }
                        }}
                        className="absolute top-8 left-4 sm:left-8 text-white/80 hover:text-white flex items-center transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
                    >
                        <ArrowLeft size={18} className="mr-2" /> Back
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end gap-8">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-zinc-800 rounded-2xl p-1 shadow-2xl rotate-3 transform border-4 border-white dark:border-zinc-700 overflow-hidden flex-shrink-0">
                            <img
                                src={mainImage}
                                alt={business.businessName}
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                        <div className="text-white pb-2">
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">{business.businessName}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm md:text-base font-medium">
                                <div className="flex items-center">
                                    <MapPin size={18} className="mr-1.5 text-emerald-400" />
                                    {business.location.city}, {business.location.place}
                                </div>
                                <div className="flex items-center">
                                    <Globe size={18} className="mr-1.5 text-blue-400" />
                                    {business.industry || 'General Business'}
                                </div>
                                <div className="flex items-center">
                                    <Calendar size={18} className="mr-1.5 text-amber-400" />
                                    Member since {new Date(business.createdAt).getFullYear()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: About */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl dark:shadow-none border border-gray-100 dark:border-zinc-800">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <Building2 className="mr-3 text-emerald-600" /> About the Business
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                                {business.description}
                            </p>
                        </div>

                        {/* Gallery Section */}
                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl dark:shadow-none border border-gray-100 dark:border-zinc-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Gallery</h2>
                            {business.images && business.images.length > 1 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {business.images.slice(1, 5).map((img, idx) => (
                                        <div key={idx} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/50">
                                    <ImageIcon size={48} className="mb-3 opacity-50" />
                                    <p className="font-medium">Gallery is empty</p>
                                    <p className="text-xs mt-1">Business has not uploaded additional photos</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Contact & Owner */}
                    <div className="space-y-6">
                        <Link to={`/user/${business.owner._id}`} className="block group">
                            <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden transition-transform hover:-translate-y-1">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <User size={120} />
                                </div>

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <h3 className="text-xl font-bold">Business Owner</h3>
                                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20 group-hover:bg-white group-hover:text-emerald-700 transition-colors">
                                        View Profile
                                    </div>
                                </div>

                                <div className="flex items-center mb-6 relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center overflow-hidden mr-4 group-hover:border-white transition-colors">
                                        {business.owner?.avatarUrl ? (
                                            <img src={business.owner.avatarUrl} alt={business.owner.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={32} className="text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg group-hover:underline underline-offset-2 decoration-2">{business.owner?.fullName || 'Hidden User'}</p>
                                        <p className="text-emerald-100 text-sm">Verified Seller</p>
                                    </div>
                                </div>

                                <div className="space-y-3 relative z-10">
                                    <div className="flex items-center bg-emerald-700/50 p-3 rounded-xl backdrop-blur-sm group-hover:bg-emerald-700/70 transition-colors">
                                        <Mail size={18} className="mr-3 text-emerald-200" />
                                        <span className="text-sm font-medium truncate">{business.owner?.email}</span>
                                    </div>
                                    <div className="flex items-center bg-emerald-700/50 p-3 rounded-xl backdrop-blur-sm group-hover:bg-emerald-700/70 transition-colors">
                                        <Phone size={18} className="mr-3 text-emerald-200" />
                                        <span className="text-sm font-medium">{business.owner?.phone || 'No Phone'}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-zinc-800 text-center">
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Want to inquire about assets?</p>
                            <button
                                onClick={() => navigate(`/businessdetails/${businessId}/listings`)}
                                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
                            >
                                View Active Listings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicBusinessDetails;
