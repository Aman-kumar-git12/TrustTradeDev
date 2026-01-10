import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Calendar, ArrowLeft, Building2, ShieldCheck, ShoppingBag } from 'lucide-react';
import api from '../utils/api';
import ProfileShimmer from '../components/shimmers/ProfileShimmer';

const PublicUserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get(`/auth/public/${userId}`);
                setUser(data.user);
                setBusinesses(data.businesses);
            } catch (error) {
                console.error('Failed to fetch user profile', error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfile();
        }
    }, [userId]);

    if (loading) return <ProfileShimmer />;

    if (!user) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 p-4">
            <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl max-w-lg w-full">
                <User size={64} className="mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold"
                >
                    Go Back
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 dark:bg-zinc-950 font-sans transition-colors duration-300 relative z-0">
            {/* Header / Cover */}
            <div className="h-60 bg-gradient-to-r from-zinc-900 to-zinc-800 relative">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between py-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="self-start px-4 py-2 bg-black/20 backdrop-blur-md rounded-full text-white text-sm font-bold border border-white/10 hover:bg-black/30 transition-colors flex items-center"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Back
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Profile Card - Overlapping Header */}
                <div className="relative -mt-20 mb-12">
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-gray-100 dark:border-zinc-800 p-8 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
                        {/* Avatar */}
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white dark:bg-zinc-800 p-1.5 shadow-lg border-4 border-white dark:border-zinc-700 -mt-16 md:-mt-24 flex-shrink-0 relative">
                            {user.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt={user.fullName}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                                    <User size={64} className="text-gray-300 dark:text-gray-600" />
                                </div>
                            )}
                            {/* Role Badge on Avatar */}
                            <div className={`absolute bottom-2 right-2 p-2 rounded-full border-4 border-white dark:border-zinc-900 ${user.role === 'seller' ? 'bg-emerald-500' : 'bg-blue-500'
                                }`}>
                                <ShieldCheck size={16} className="text-white" />
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left mb-2 md:mb-4">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.fullName}</h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center ${user.role === 'seller'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    }`}>
                                    <ShieldCheck size={14} className="mr-1.5" />
                                    {user.role === 'seller' ? 'Verified Seller' : 'Verified Buyer'}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                                    <Calendar size={14} className="mr-1.5" />
                                    Joined {new Date(user.createdAt).getFullYear()}
                                </span>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300 md:items-end">
                            <div className="flex items-center gap-2">
                                <Mail size={16} className="text-emerald-500" />
                                <span>{user.email}</span>
                            </div>
                            {user.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-emerald-500" />
                                    <span>{user.phone}</span>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* Seller Content: Businesses */}
                {user.role === 'seller' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                            <Building2 className="mr-3 text-emerald-500" />
                            Businesses by {user.fullName}
                        </h2>

                        {businesses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {businesses.map((business) => (
                                    <Link
                                        to={`/businessdetails/${business._id}`}
                                        key={business._id}
                                        className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm hover:shadow-xl dark:shadow-none border border-gray-100 dark:border-zinc-800 transition-all group hover:-translate-y-1"
                                    >
                                        <div className="aspect-video bg-gray-100 dark:bg-zinc-800 rounded-xl overflow-hidden mb-4 relative">
                                            <img
                                                src={(business.images && business.images.length > 0) ? business.images[0] : 'https://cdn-icons-png.freepik.com/512/1465/1465439.png'}
                                                alt={business.businessName}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                            {business.businessName}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                                            {business.description || 'No description available.'}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800">
                                <Building2 size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">This seller hasn't set up any businesses yet.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Buyer Content */}
                {user.role === 'buyer' && (
                    <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
                            <ShoppingBag size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verified Buyer</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                            {user.fullName} is a verified, active member of the TrustTrade community looking for great deals.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicUserProfile;
