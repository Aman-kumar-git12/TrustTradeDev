import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Building, MapPin, Save, Trash2, ArrowLeft, Image as ImageIcon, Camera, Loader2, Link as LinkIcon, Plus, X, Eye } from 'lucide-react';
import api from '../utils/api';
import { useUI } from '../context/UIContext';
import BusinessDetailsShimmer from '../components/shimmers/BusinessDetailsShimmer';

const SellerBusinessDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { confirm, showSnackbar } = useUI();
    const isNew = id === 'new';

    // File Upload Ref
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(!isNew);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Changed imageUrl to images array
    const [formData, setFormData] = useState({
        businessName: '',
        images: [],
        city: '',
        place: '',
        description: ''
    });

    // Temporary state for the URL input
    const [urlInput, setUrlInput] = useState('');

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
                // Backend compatibility: if 'images' exists use it, otherwise use 'imageUrl' as single item array
                let images = business.images || [];
                if (images.length === 0 && business.imageUrl) {
                    images = [business.imageUrl];
                }

                setFormData({
                    businessName: business.businessName,
                    images: images,
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

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (formData.images.length >= 5) {
            showSnackbar('Maximum 5 images allowed', 'error');
            return;
        }

        try {
            setUploadingImage(true);
            const imageFormData = new FormData();
            imageFormData.append('image', file);

            // Upload to Cloudinary via backend proxy
            const uploadRes = await api.post('/images/upload', imageFormData);

            setFormData(prev => ({
                ...prev,
                images: [...prev.images, uploadRes.data.url]
            }));
            showSnackbar('Image uploaded successfully', 'success');
        } catch (error) {
            console.error('Image upload failed', error);
            showSnackbar('Failed to upload image', 'error');
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleAddLink = () => {
        if (!urlInput) return;
        if (formData.images.length >= 5) {
            showSnackbar('Maximum 5 images allowed', 'error');
            return;
        }

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, urlInput]
        }));
        setUrlInput('');
    };

    const handleRemoveImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const triggerFileInput = () => {
        if (formData.images.length >= 5) {
            showSnackbar('Maximum 5 images allowed', 'error');
            return;
        }
        fileInputRef.current.click();
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

    if (loading) return <BusinessDetailsShimmer />;

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-zinc-950 bluish:bg-[#0a0f1d] selection:bg-blue-500/30 dark:selection:bg-emerald-500/30 bluish:selection:bg-blue-500/30 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
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

            <div className="max-w-5xl mx-auto relative z-10">
                <button
                    onClick={() => navigate('/my-businesses')}
                    className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bluish:text-slate-400 bluish:hover:text-white mb-8 font-medium transition-colors group"
                >
                    <div className="bg-white dark:bg-zinc-900 bluish:bg-slate-800 p-2 rounded-lg shadow-sm group-hover:shadow-md mr-3 border border-gray-200 dark:border-zinc-800 bluish:border-white/5 transition-all">
                        <ArrowLeft size={18} />
                    </div>
                    Back to Businesses
                </button>

                <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800 bluish:to-slate-900 rounded-3xl shadow-xl dark:shadow-emerald-900/10 overflow-hidden border border-gray-100 dark:border-zinc-800 bluish:border-white/5 transition-all">
                    {/* Premium Header */}
                    <div className="h-40 bg-gradient-to-r from-zinc-900 to-zinc-800 bluish:from-slate-900 bluish:to-slate-800 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse-slow"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                                    {isNew ? 'Create New Business' : 'Edit Business Details'}
                                </h1>
                                <p className="text-gray-300 text-sm font-medium">
                                    {isNew ? 'Launch your new venture in seconds' : 'Update your business information and gallery'}
                                </p>
                            </div>
                            <div className="hidden sm:flex items-center gap-3">
                                {!isNew && (
                                    <Link
                                        to={`/businessdetails/${id}`}
                                        className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20 flex items-center transition-colors"
                                    >
                                        <Eye size={14} className="mr-2" /> View Public Page
                                    </Link>
                                )}
                                {isNew && (
                                    <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold border border-white/20">
                                        Step 1 of 1
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 lg:p-10 space-y-10">
                        <div className="flex flex-col lg:flex-row gap-12">
                            {/* Left Column - Gallery Section (Moved Left for better UX on desktop) */}
                            <div className="lg:w-[400px] flex-shrink-0 space-y-6 order-2 lg:order-1">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-base font-bold text-gray-800 dark:text-gray-200 bluish:text-slate-200 flex items-center gap-2">
                                            <ImageIcon size={18} className="text-blue-500 dark:text-emerald-500 bluish:text-blue-500" />
                                            Business Gallery
                                        </label>
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${formData.images.length >= 5
                                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-blue-100 text-blue-600 dark:bg-emerald-900/30 dark:text-emerald-400 bluish:bg-blue-500/20 bluish:text-blue-400'
                                            }`}>
                                            {formData.images.length}/5
                                        </span>
                                    </div>

                                    {/* Unified Grid Layout */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Main Cover (First Image) */}
                                        {formData.images.length > 0 && (
                                            <div className="col-span-2 aspect-video relative group rounded-2xl overflow-hidden shadow-md border border-gray-100 dark:border-zinc-700 bluish:border-white/10">
                                                <img src={formData.images[0]} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(0)}
                                                        className="p-3 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-all hover:scale-110 shadow-lg"
                                                    >
                                                        <Trash2 size={20} />
                                                    </button>
                                                </div>
                                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider border border-white/10 shadow-sm">
                                                    Main Cover
                                                </div>
                                            </div>
                                        )}

                                        {/* Remaining Images */}
                                        {formData.images.slice(1).map((img, idx) => (
                                            <div key={idx + 1} className="aspect-square relative group rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-700 bluish:border-white/10">
                                                <img src={img} alt={`Gallery ${idx + 2}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(idx + 1)}
                                                        className="p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-all hover:scale-110 shadow-md"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add Button (Integrated into Grid) */}
                                        {formData.images.length < 5 && (
                                            <button
                                                type="button"
                                                onClick={triggerFileInput}
                                                disabled={uploadingImage}
                                                className={`relative group overflow-hidden bg-gray-50 dark:bg-zinc-800/50 bluish:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-zinc-700 bluish:border-white/10 hover:border-blue-500 dark:hover:border-emerald-500 bluish:hover:border-blue-500 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400 bluish:hover:text-blue-400 transition-all duration-300 ${formData.images.length === 0 ? 'col-span-2 aspect-video' : 'aspect-square'
                                                    }`}
                                            >
                                                <div className="absolute inset-0 bg-blue-50/50 dark:bg-emerald-900/10 bluish:bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                {uploadingImage ? (
                                                    <Loader2 size={24} className="animate-spin mb-2 relative z-10" />
                                                ) : (
                                                    <Plus size={32} className="mb-2 relative z-10 group-hover:scale-110 transition-transform" />
                                                )}
                                                <span className="text-xs font-bold relative z-10">{uploadingImage ? 'Uploading...' : 'Add Image'}</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="bg-gray-50 dark:bg-zinc-800/50 bluish:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 bluish:border-white/5 space-y-4">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                        />

                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <LinkIcon size={14} className="text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-emerald-500 bluish:group-focus-within:text-blue-500 transition-colors" />
                                            </div>
                                            <div className="absolute inset-y-0 right-0 pr-1 flex items-center">
                                                <button
                                                    type="button"
                                                    onClick={handleAddLink}
                                                    disabled={!urlInput || formData.images.length >= 5}
                                                    className="p-1.5 bg-gray-200 dark:bg-zinc-700 bluish:bg-slate-700 text-gray-500 hover:bg-blue-500 dark:hover:bg-emerald-500 bluish:hover:bg-blue-500 hover:text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <input
                                                type="url"
                                                className="w-full pl-9 pr-10 py-2.5 bg-white dark:bg-zinc-900 bluish:bg-slate-900 border border-gray-200 dark:border-zinc-700 bluish:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 bluish:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-emerald-500 bluish:focus:border-blue-500 outline-none text-xs transition-all dark:text-white bluish:text-white placeholder-gray-400 font-medium"
                                                placeholder="Paste an image URL here..."
                                                value={urlInput}
                                                onChange={e => setUrlInput(e.target.value)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleAddLink();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <p className="text-[10px] text-gray-400 text-center font-medium">
                                            Supported: JPG, PNG, WebP
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Form Fields */}
                            <div className="flex-1 space-y-8 order-1 lg:order-2">
                                <div className="space-y-6">
                                    <div className="space-y-2 group">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 bluish:text-slate-300 group-focus-within:text-blue-600 dark:group-focus-within:text-emerald-400 bluish:group-focus-within:text-blue-400 transition-colors">Business Name</label>
                                        <div className="relative">
                                            <Building className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-emerald-500 bluish:group-focus-within:text-blue-500 transition-colors" size={18} />
                                            <input
                                                required
                                                type="text"
                                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-800/50 bluish:bg-slate-800 border border-gray-200 dark:border-zinc-700 bluish:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 bluish:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-emerald-500 bluish:focus:border-blue-500 outline-none transition-all dark:text-white bluish:text-white font-medium"
                                                placeholder="e.g. Acme Industries"
                                                value={formData.businessName}
                                                onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2 group">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 bluish:text-slate-300 group-focus-within:text-blue-600 dark:group-focus-within:text-emerald-400 bluish:group-focus-within:text-blue-400 transition-colors">City</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-emerald-500 bluish:group-focus-within:text-blue-500 transition-colors" size={18} />
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-800/50 bluish:bg-slate-800 border border-gray-200 dark:border-zinc-700 bluish:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 bluish:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-emerald-500 bluish:focus:border-blue-500 outline-none transition-all dark:text-white bluish:text-white font-medium"
                                                    placeholder="e.g. New York"
                                                    value={formData.city}
                                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2 group">
                                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 bluish:text-slate-300 group-focus-within:text-blue-600 dark:group-focus-within:text-emerald-400 bluish:group-focus-within:text-blue-400 transition-colors">Place / Area</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-500 dark:group-focus-within:text-emerald-500 bluish:group-focus-within:text-blue-500 transition-colors" size={18} />
                                                <input
                                                    required
                                                    type="text"
                                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-zinc-800/50 bluish:bg-slate-800 border border-gray-200 dark:border-zinc-700 bluish:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 bluish:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-emerald-500 bluish:focus:border-blue-500 outline-none transition-all dark:text-white bluish:text-white font-medium"
                                                    placeholder="e.g. Manhattan"
                                                    value={formData.place}
                                                    onChange={e => setFormData({ ...formData, place: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 group">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 bluish:text-slate-300 group-focus-within:text-blue-600 dark:group-focus-within:text-emerald-400 bluish:group-focus-within:text-blue-400 transition-colors">Description</label>
                                        <textarea
                                            required
                                            rows="5"
                                            className="w-full p-4 bg-gray-50 dark:bg-zinc-800/50 bluish:bg-slate-800 border border-gray-200 dark:border-zinc-700 bluish:border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 bluish:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-emerald-500 bluish:focus:border-blue-500 outline-none transition-all dark:text-white bluish:text-white resize-none font-medium leading-relaxed"
                                            placeholder="Tell us about your business..."
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Controls */}
                        <div className="pt-6 flex flex-col-reverse sm:flex-row items-center justify-between border-t border-gray-100 dark:border-zinc-800 bluish:border-white/5 gap-4">
                            {!isNew ? (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="w-full sm:w-auto text-red-500 dark:text-red-400 font-bold flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/10 bluish:hover:bg-red-900/10 px-6 py-3 rounded-xl transition-colors"
                                >
                                    <Trash2 size={18} className="mr-2" /> Delete Business
                                </button>
                            ) : (
                                <div></div>
                            )}
                            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
                                <button
                                    type="button"
                                    onClick={() => navigate('/my-businesses')}
                                    className="px-6 py-3 text-gray-500 dark:text-gray-400 bluish:text-slate-400 font-bold hover:bg-gray-100 dark:hover:bg-zinc-800 bluish:hover:bg-slate-800 rounded-xl transition-colors order-1 sm:order-0"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-8 py-3 bg-blue-600 dark:bg-emerald-600 bluish:bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-500/20 dark:shadow-emerald-500/20 bluish:shadow-blue-500/20 hover:bg-blue-700 dark:hover:bg-emerald-700 bluish:hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center order-0 sm:order-1"
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

export default SellerBusinessDetails;
