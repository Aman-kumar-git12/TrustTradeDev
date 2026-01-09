import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building, MapPin, Save, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import api from '../utils/api';
import { useUI } from '../context/UIContext';

const BusinessDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { confirm, showSnackbar } = useUI();
    const isNew = id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [formData, setFormData] = useState({
        businessName: '',
        imageUrl: '',
        city: '',
        place: '',
        description: ''
    });

    useEffect(() => {
        if (!isNew) {
            fetchBusiness();
        }
    }, [id]);

    const fetchBusiness = async () => {
        try {
            const { data } = await api.get('/businesses');
            const business = data.find(b => b._id === id);

            if (business) {
                setFormData({
                    businessName: business.businessName,
                    imageUrl: business.imageUrl || '',
                    city: business.location.city,
                    place: business.location.place,
                    description: business.description
                });
            } else {
                showSnackbar('Business not found', 'error');
                navigate('/my-businesses');
            }
        } catch (error) {
            console.error('Failed to fetch business');
            showSnackbar('Failed to fetch business details', 'error');
            navigate('/my-businesses');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                location: { city: formData.city, place: formData.place }
            };

            if (isNew) {
                await api.post('/businesses', payload);
                showSnackbar('Business created successfully', 'success');
            } else {
                await api.put(`/businesses/${id}`, payload);
                showSnackbar('Business updated successfully', 'success');
            }
            navigate('/my-businesses');
        } catch (error) {
            console.error(error);
            showSnackbar(error.response?.data?.message || 'Operation failed', 'error');
        }
    };

    const handleDelete = async () => {
        const isConfirmed = await confirm({
            title: 'Delete Business',
            message: 'Are you sure you want to delete this business? This cannot be undone.',
            confirmText: 'Delete Business',
            isDangerous: true
        });

        if (!isConfirmed) return;

        try {
            await api.delete(`/businesses/${id}`);
            showSnackbar('Business deleted successfully', 'success');
            navigate('/my-businesses');
        } catch (error) {
            showSnackbar('Delete failed', 'error');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-[calc(100vh-64px)] bg-white dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate('/my-businesses')}
                    className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 font-medium transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" /> Back to Businesses
                </button>

                <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl dark:shadow-emerald-900/10 overflow-hidden border border-gray-100 dark:border-zinc-800 transition-all">
                    <div className="h-32 bg-emerald-600 dark:bg-emerald-900 relative">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                        <h1 className="absolute bottom-6 left-8 text-3xl font-bold text-white">
                            {isNew ? 'Create New Business' : 'Edit Business Details'}
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Business Name</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-10 p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white"
                                        placeholder="e.g. Acme Corp"
                                        value={formData.businessName}
                                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Cover Image URL</label>
                                <div className="relative">
                                    <ImageIcon className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
                                    <input
                                        type="url"
                                        className="w-full pl-10 p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white"
                                        placeholder="https://..."
                                        value={formData.imageUrl}
                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">City</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-10 p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white"
                                        placeholder="e.g. New York"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Place / Area</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
                                    <input
                                        required
                                        type="text"
                                        className="w-full pl-10 p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white"
                                        placeholder="e.g. Manhattan"
                                        value={formData.place}
                                        onChange={e => setFormData({ ...formData, place: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Description</label>
                            <textarea
                                required
                                rows="4"
                                className="w-full p-4 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all dark:text-white"
                                placeholder="Describe your business..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-zinc-800">
                            {!isNew && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="text-red-500 dark:text-red-400 font-bold flex items-center hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} className="mr-2" /> Delete Business
                                </button>
                            )}
                            <div className={`flex space-x-4 ${isNew ? 'w-full justify-end' : ''}`}>
                                <button
                                    type="button"
                                    onClick={() => navigate('/my-businesses')}
                                    className="px-6 py-3 text-gray-500 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 shadow-emerald-200/20 dark:shadow-none transform hover:-translate-y-0.5 transition-all flex items-center"
                                >
                                    <Save size={18} className="mr-2" /> {isNew ? 'Create Business' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BusinessDetails;
