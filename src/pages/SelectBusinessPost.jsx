import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, ArrowRight, Plus } from 'lucide-react';
import api from '../utils/api';

const SelectBusinessPost = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const { data } = await api.get('/businesses');
                // If user has no businesses, maybe redirect to create one or post as individual?
                // For now, listing them.
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Select a Business to Post As</h1>
                    <p className="text-slate-500">Choose which business entity this asset will belong to.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Removed Add New Business Card as per request */}
                    {businesses.length === 0 && (
                        <div className="md:col-span-2 text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                            <p className="text-slate-500 mb-4">You don't have any businesses yet.</p>
                            <Link to="/my-businesses/new" className="text-blue-600 font-semibold hover:underline">
                                Create your first business here
                            </Link>
                        </div>
                    )}

                    {businesses.map((business) => (
                        <div
                            key={business._id}
                            onClick={() => navigate(`/post-assets/${business._id}`)}
                            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-14 w-14 bg-slate-100 rounded-lg overflow-hidden">
                                    {business.imageUrl ? (
                                        <img src={business.imageUrl} alt={business.businessName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400">
                                            <Building size={24} />
                                        </div>
                                    )}
                                </div>
                                <ArrowRight className="text-slate-300" />
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-1">{business.businessName}</h3>
                            <div className="text-sm text-slate-500 flex items-center">
                                <span className="truncate">{business.location?.city || 'Location N/A'}</span>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 w-full">
                                <button className="w-full bg-slate-900 text-white rounded-lg py-2 text-sm font-semibold hover:bg-slate-800 transition-colors">
                                    Select & Post Asset
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SelectBusinessPost;
