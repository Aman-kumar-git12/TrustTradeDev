import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building, MapPin, Plus, ArrowRight, AlertCircle } from 'lucide-react';
import api from '../utils/api';

const MyBusinesses = () => {
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Businesses</h1>
                        <p className="text-gray-500 mt-1">Manage your business profiles (Max 4)</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Add New Card */}
                    {businesses.length < 4 && (
                        <Link to="/my-businesses/new" className="group bg-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-primary hover:bg-blue-50/50 p-8 flex flex-col items-center justify-center text-center transition-all h-full min-h-[250px] cursor-pointer">
                            <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:scale-110 transition-transform text-primary">
                                <Plus size={32} />
                            </div>
                            <h3 className="font-bold text-xl text-gray-800">Add New Business</h3>
                            <p className="text-sm text-gray-500 mt-2">Create a new business profile to showcase your assets.</p>
                        </Link>
                    )}

                    {/* Business Cards */}
                    {businesses.map(business => (
                        <div key={business._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
                            <div className="h-40 bg-slate-200 relative overflow-hidden">
                                {business.imageUrl ? (
                                    <img src={business.imageUrl} alt={business.businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">
                                        <Building size={48} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl shadow-sm">{business.businessName}</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-start text-sm text-gray-500 mb-4">
                                    <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0 text-accent" />
                                    <span>{business.location.city}, {business.location.place}</span>
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                                    {business.description}
                                </p>
                                <Link
                                    to={`/my-businesses/${business._id}`}
                                    className="inline-flex items-center text-primary font-bold hover:text-primary-light transition-colors"
                                >
                                    Manage Business <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyBusinesses;
