import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, Plus, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import GridShimmer from '../components/shimmers/GridShimmer';

const BusinessCard = ({ business }) => {
    const [image, setImage] = useState('');

    useEffect(() => {
        // Use provided default if no images exist
        if (!business.images || business.images.length === 0) {
            setImage('https://cdn-icons-png.freepik.com/512/1465/1465439.png');
        } else {
            setImage(business.images[0]);
        }
    }, [business]);

    return (
        <div className="bg-white dark:bg-zinc-900 bluish:bg-[#131b2e] bluish:backdrop-blur-md rounded-2xl shadow-sm bluish:shadow-lg border border-gray-100 dark:border-zinc-800 bluish:border-white/10 overflow-hidden hover:shadow-xl dark:hover:shadow-emerald-900/10 bluish:hover:shadow-blue-600/10 transition-all group flex flex-col h-full hover:-translate-y-1 duration-300 relative">
            <div className={`absolute -inset-[1px] bg-gradient-to-r from-transparent via-blue-500/20 dark:via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm rounded-2xl -z-10 hidden bluish:block`}></div>
            <div className="h-48 bg-zinc-200 dark:bg-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={image}
                        alt={business.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl shadow-sm pr-12">{business.businessName}</h3>
            </div>

            <div className="p-6 flex flex-col flex-grow relative z-10">
                <div className="flex items-start text-sm text-gray-500 dark:text-gray-400 bluish:text-gray-400 mb-4">
                    <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0 text-blue-500 dark:text-emerald-400 bluish:text-blue-500" />
                    <span>{business.location.city}, {business.location.place}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 bluish:text-gray-300 text-sm line-clamp-3 mb-6 flex-grow">
                    {business.description}
                </p>
                <Link
                    to={`/my-businesses/${business._id}`}
                    className="inline-flex items-center text-blue-600 dark:text-emerald-400 bluish:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-emerald-300 bluish:hover:text-blue-300 transition-colors mt-auto"
                >
                    Manage Business <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
};

const SellerMyBusinesses = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        try {
            const { data } = await api.get('/businesses');
            setBusinesses(data);
        } catch (error) {
            console.error('Failed to fetch businesses');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-[calc(100vh-64px)] bg-white dark:bg-zinc-950 bluish:bg-[#0a0f1d] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-64 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse"></div>
                    </div>
                </div>
                <GridShimmer />
            </div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-white dark:bg-zinc-950 bluish:bg-[#0a0f1d] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
            {/* Dynamic Background Elements - Bluish Theme Only */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden bluish:block">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>

                {/* Background Image & Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0f1d] via-[#0a0f1d]/95 to-[#0f172a]/90"></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white bluish:text-white transition-colors">My Businesses</h1>
                        <p className="text-gray-500 dark:text-gray-400 bluish:text-gray-400 mt-1 transition-colors">Manage your business profiles (Max 4)</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add New Card */}
                    {businesses.length < 4 && (
                        <Link to="/my-businesses/new" className="group bg-white dark:bg-zinc-900 bluish:bg-[#131b2e] bluish:backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 dark:border-zinc-700 bluish:border-white/10 hover:border-blue-500 dark:hover:border-emerald-500 bluish:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-emerald-900/10 bluish:hover:bg-blue-900/20 p-8 flex flex-col items-center justify-center text-center transition-all h-full min-h-[400px] cursor-pointer relative hover:-translate-y-1 duration-300">
                            <div className="bg-blue-100 dark:bg-emerald-900/30 bluish:bg-blue-500/10 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform text-blue-600 dark:text-emerald-400 bluish:text-blue-400 bluish:border bluish:border-blue-500/20 bluish:group-hover:border-blue-500/50">
                                <Plus size={32} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-800 dark:text-gray-200 bluish:text-white group-hover:text-blue-700 dark:group-hover:text-emerald-300 bluish:group-hover:text-blue-300 transition-colors">Add New Business</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 bluish:text-gray-400 mt-2">Create a new business profile to showcase your assets.</p>
                        </Link>
                    )}

                    {/* Business Cards */}
                    {businesses.map(business => (
                        <BusinessCard key={business._id} business={business} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SellerMyBusinesses;
