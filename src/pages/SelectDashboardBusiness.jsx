import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowRight, Briefcase, MapPin } from 'lucide-react';
import api from '../utils/api';

const SelectDashboardBusiness = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const { data } = await api.get('/businesses');
                setBusinesses(data);
            } catch (error) {
                console.error('Failed to fetch businesses', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBusinesses();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-500 font-medium">Loading your businesses...</p>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                        Seller Workspace
                    </span>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">Select Business Dashboard</h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">Choose a business entity to view its performance, leads, and manage its listings.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Business List */}
                    {businesses.map((business) => (
                        <div
                            key={business._id}
                            onClick={() => navigate(`/dashboard/seller/${business._id}/overview`)}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-primary/10 border border-gray-100 p-6 flex flex-col transition-all duration-300 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex items-start justify-between mb-6">
                                <div className="h-16 w-16 bg-slate-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                                    {business.imageUrl ? (
                                        <img src={business.imageUrl} alt={business.businessName} className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 className="text-slate-400" size={28} />
                                    )}
                                </div>
                                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <ArrowRight size={16} />
                                </div>
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">{business.businessName}</h3>

                                <div className="space-y-2">
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <Briefcase size={14} className="mr-2 text-gray-400" />
                                        <span className="truncate">{business.industry || 'No Industry'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <MapPin size={14} className="mr-2 text-gray-400" />
                                        <span className="truncate">{business.location?.city || 'No Location'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Launch Dashboard</span>
                                <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                    Open &rarr;
                                </span>
                            </div>
                        </div>
                    ))}

                    {businesses.length === 0 && (
                        <div className="md:col-span-2 lg:col-span-3 text-center py-12">
                            <p className="text-gray-400 italic">No businesses found. Please create a business profile first.</p>
                            <button
                                onClick={() => navigate('/my-businesses')}
                                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-light transition-colors"
                            >
                                Manage Businesses
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SelectDashboardBusiness;
