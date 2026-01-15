import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Upload, IndianRupee, MapPin, Tag, FileText, CheckCircle, AlertCircle, Image as ImageIcon,
    Factory, Truck, Cpu, Building2, Stethoscope, Smartphone, Hammer, Printer, HelpCircle,
    Loader2, Link as LinkIcon, Plus, Trash2, X
} from 'lucide-react';
import api from '../utils/api';
import { useUI } from '../context/UIContext';
import PostAssetShimmer from '../components/shimmers/PostAssetShimmer';

// Map categories to icons
const CATEGORIES = [
    { name: 'Industrial', icon: Factory },
    { name: 'Vehicles', icon: Truck },
    { name: 'IT Hardware', icon: Cpu },
    { name: 'Real Estate', icon: Building2 },
    { name: 'Medical', icon: Stethoscope },
    { name: 'Electronics', icon: Smartphone },
    { name: 'Manufacturing', icon: Hammer },
    { name: 'Office Equipment', icon: Printer }
];

const SellerPostAsset = () => {
    const navigate = useNavigate();
    const { businessId } = useParams();
    const { showSnackbar } = useUI();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [business, setBusiness] = useState(null);

    // Fetch Business Details to show context
    useEffect(() => {
        const fetchBusinessContext = async () => {
            try {
                setInitialLoading(true);
                const { data } = await api.get(`/businesses/${businessId}`);
                setBusiness(data);
            } catch (error) {
                console.error("Failed to load business context");
            } finally {
                setInitialLoading(false);
            }
        };
        if (businessId) {
            fetchBusinessContext();
        } else {
            setInitialLoading(false);
        }
    }, [businessId]);

    // Image Upload State
    const fileInputRef = useRef(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [urlInput, setUrlInput] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: CATEGORIES[0].name,
        condition: 'New',
        price: '',
        location: '',
        images: []
    });

    const [isCustomCategory, setIsCustomCategory] = useState(false);

    const handleCategorySelect = (categoryName) => {
        setIsCustomCategory(false);
        setFormData({ ...formData, category: categoryName });
    };

    const handleCustomCategory = () => {
        setIsCustomCategory(true);
        setFormData({ ...formData, category: '' });
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

            // Upload using existing endpoint
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
        setLoading(true);
        try {
            if (!formData.category.trim()) {
                showSnackbar('Please specify a category', 'error');
                setLoading(false);
                return;
            }

            await api.post('/assets', {
                ...formData,
                businessId
            });
            showSnackbar('Asset listed successfully!', 'success');
            navigate('/dashboard/seller');
        } catch (error) {
            console.error('Failed to post asset', error);
            showSnackbar('Failed to post asset', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <PostAssetShimmer />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 bluish:bg-[#0a0f1d] selection:bg-blue-500/30 dark:selection:bg-emerald-500/30 bluish:selection:bg-blue-500/30 py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative overflow-hidden">
            {/* Dotted Background Pattern */}
            <div className="fixed inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff33_1px,#000000_1px)] bluish:bg-[radial-gradient(#ffffff33_1px,#0a0f1d_1px)] [background-size:20px_20px] opacity-20 dark:opacity-[0.26] bluish:opacity-[0.26] pointer-events-none z-[1]"></div>
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

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-4 p-2 rounded-full hover:bg-white dark:hover:bg-zinc-800 bluish:hover:bg-slate-800 hover:shadow-sm text-gray-500 dark:text-gray-400 bluish:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white bluish:text-white transition-colors duration-300">List New Asset</h1>
                        <p className="text-gray-500 dark:text-gray-400 bluish:text-slate-400 mt-1 transition-colors duration-300">
                            Posting to <span className="font-bold text-blue-600 dark:text-emerald-400 bluish:text-blue-400">{business ? business.businessName : '...'}</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800 bluish:to-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 bluish:border-white/5 overflow-hidden transition-colors duration-300">
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-400 dark:from-emerald-600 dark:to-emerald-400 bluish:from-blue-500 bluish:to-blue-400 w-full"></div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-10">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                            {/* LEFT COLUMN: Asset Specification */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white bluish:text-white border-b border-gray-100 dark:border-zinc-800 bluish:border-white/10 pb-2 mb-6 transition-colors duration-300">Asset Details</h3>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 bluish:text-slate-300 mb-2 transition-colors duration-300">Asset Title</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g., 2020 CNC Milling Machine"
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-700 bluish:border-white/10 bg-white dark:bg-zinc-800 bluish:bg-slate-800 text-gray-900 dark:text-white bluish:text-white rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-emerald-500/10 focus:border-blue-500 dark:focus:border-emerald-500 bluish:focus:ring-blue-500/10 bluish:focus:border-blue-500 transition-all outline-none"
                                                    value={formData.title}
                                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 bluish:text-slate-300 mb-2 transition-colors duration-300">Price (INR)</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <IndianRupee className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                                    </div>
                                                    <input
                                                        type="number"
                                                        required
                                                        placeholder="0.00"
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-700 bluish:border-white/10 bg-white dark:bg-zinc-800 bluish:bg-slate-800 text-gray-900 dark:text-white bluish:text-white rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-emerald-500/10 focus:border-blue-500 dark:focus:border-emerald-500 bluish:focus:ring-blue-500/10 bluish:focus:border-blue-500 transition-all outline-none"
                                                        value={formData.price}
                                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 bluish:text-slate-300 mb-2 transition-colors duration-300">Condition</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Tag className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                                    </div>
                                                    <select
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-700 bluish:border-white/10 bg-white dark:bg-zinc-800 bluish:bg-slate-800 text-gray-900 dark:text-white bluish:text-white rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 bluish:focus:ring-blue-500/10 bluish:focus:border-blue-500 transition-all outline-none appearance-none"
                                                        value={formData.condition}
                                                        onChange={e => setFormData({ ...formData, condition: e.target.value })}
                                                    >
                                                        <option>New</option>
                                                        <option>Used - Like New</option>
                                                        <option>Used - Good</option>
                                                        <option>Used - Fair</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 bluish:text-slate-300 mb-2 transition-colors duration-300">Location</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="City, State"
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-zinc-700 bluish:border-white/10 bg-white dark:bg-zinc-800 bluish:bg-slate-800 text-gray-900 dark:text-white bluish:text-white rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-emerald-500/10 focus:border-blue-500 dark:focus:border-emerald-500 bluish:focus:ring-blue-500/10 bluish:focus:border-blue-500 transition-all outline-none"
                                                    value={formData.location}
                                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Selection Grid */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 bluish:text-slate-300 mb-3 transition-colors duration-300">Category</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.name}
                                                type="button"
                                                onClick={() => handleCategorySelect(cat.name)}
                                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${!isCustomCategory && formData.category === cat.name
                                                    ? 'border-blue-500 dark:border-emerald-500 bg-blue-50 dark:bg-emerald-900/30 bluish:bg-blue-500/20 bluish:border-blue-500 text-blue-600 dark:text-emerald-400 bluish:text-blue-400 shadow-sm scale-[1.02]'
                                                    : 'border-gray-200 dark:border-zinc-700 bluish:border-white/10 hover:border-gray-300 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800 bluish:hover:bg-slate-800/50 text-gray-600 dark:text-gray-400 bluish:text-slate-400'
                                                    }`}
                                            >
                                                <cat.icon size={24} className="mb-2" />
                                                <span className="text-xs font-medium text-center">{cat.name}</span>
                                            </button>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={handleCustomCategory}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${isCustomCategory
                                                ? 'border-blue-500 dark:border-emerald-500 bg-blue-50 dark:bg-emerald-900/30 bluish:bg-blue-500/20 bluish:border-blue-500 text-blue-600 dark:text-emerald-400 bluish:text-blue-400 shadow-sm scale-[1.02]'
                                                : 'border-gray-200 dark:border-zinc-700 bluish:border-white/10 hover:border-gray-300 dark:hover:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800 bluish:hover:bg-slate-800/50 text-gray-600 dark:text-gray-400 bluish:text-slate-400'
                                                }`}
                                        >
                                            <HelpCircle size={24} className="mb-2" />
                                            <span className="text-xs font-medium text-center">Other</span>
                                        </button>
                                    </div>

                                    {isCustomCategory && (
                                        <div className="mt-3 animate-fade-in">
                                            <input
                                                type="text"
                                                required
                                                placeholder="Specify custom category..."
                                                className="w-full px-4 py-2 border border-blue-500/30 dark:border-emerald-500/30 bluish:border-blue-500/30 rounded-lg focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 focus:border-blue-500 dark:focus:border-emerald-500 bluish:focus:border-blue-500 outline-none bg-blue-50/30 dark:bg-emerald-900/10 bluish:bg-blue-900/10 text-gray-900 dark:text-white bluish:text-white"
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                autoFocus
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT COLUMN: Media & Description */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white bluish:text-white border-b border-gray-100 dark:border-zinc-800 bluish:border-white/10 pb-2 mb-4 transition-colors duration-300">Media & Description</h3>

                                {/* Image Gallery Section */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 bluish:text-slate-300 flex items-center gap-2">
                                            Asset Images
                                        </label>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${formData.images.length >= 5
                                            ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-blue-100 dark:bg-emerald-900/30 text-blue-600 dark:text-emerald-400 bluish:bg-blue-500/20 bluish:text-blue-400'
                                            }`}>
                                            {formData.images.length}/5
                                        </span>
                                    </div>

                                    {/* Grid Layout */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {/* Existing Images */}
                                        {formData.images.map((img, idx) => (
                                            <div key={idx} className="aspect-square relative group rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-700 bluish:border-white/10 bg-gray-50 dark:bg-zinc-800 bluish:bg-slate-800">
                                                <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(idx)}
                                                        className="p-2 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-all hover:scale-110 shadow-md"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Add Button */}
                                        {formData.images.length < 5 && (
                                            <button
                                                type="button"
                                                onClick={triggerFileInput}
                                                disabled={uploadingImage}
                                                className={`relative group overflow-hidden bg-gray-50 dark:bg-zinc-800/50 bluish:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-zinc-700 bluish:border-white/10 hover:border-blue-500 dark:hover:border-emerald-500 bluish:hover:border-blue-500 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 dark:hover:text-emerald-400 bluish:hover:text-blue-400 transition-all duration-300 ${formData.images.length === 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}
                                            >
                                                {uploadingImage ? (
                                                    <Loader2 size={24} className="animate-spin mb-2" />
                                                ) : (
                                                    <Plus size={32} className="mb-2 group-hover:scale-110 transition-transform" />
                                                )}
                                                <span className="text-xs font-bold">{uploadingImage ? 'Uploading...' : 'Add Image'}</span>
                                            </button>
                                        )}
                                    </div>

                                    {/* URL Input Handling */}
                                    <div className="bg-gray-50 dark:bg-zinc-800/50 bluish:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 bluish:border-white/5">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                        />

                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <LinkIcon size={14} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            </div>
                                            <div className="absolute inset-y-0 right-0 pr-1 flex items-center">
                                                <button
                                                    type="button"
                                                    onClick={handleAddLink}
                                                    disabled={!urlInput || formData.images.length >= 5}
                                                    className="p-1.5 bg-gray-200 dark:bg-zinc-700 bluish:bg-slate-700 text-gray-500 hover:bg-blue-500 bluish:hover:bg-blue-600 hover:text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <input
                                                type="url"
                                                className="w-full pl-9 pr-10 py-2 bg-white dark:bg-zinc-900 bluish:bg-slate-900 border border-gray-200 dark:border-zinc-700 bluish:border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 focus:border-blue-500 dark:focus:border-emerald-500 bluish:focus:border-blue-500 outline-none text-xs transition-all dark:text-white bluish:text-white placeholder-gray-400 font-medium"
                                                placeholder="Or paste an image URL..."
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
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 flex items-center">
                                        <AlertCircle size={10} className="mr-1" />
                                        Upload up to 5 images. Supported: JPG, PNG, WEBP.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 bluish:text-slate-300 mb-2 transition-colors duration-300">Description</label>
                                    <textarea
                                        required
                                        rows={6}
                                        placeholder="Describe the condition, history, and key features of the asset..."
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-700 bluish:border-white/10 bg-white dark:bg-zinc-800 bluish:bg-slate-800 text-gray-900 dark:text-white bluish:text-white rounded-xl focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-emerald-500/10 focus:border-blue-500 dark:focus:border-emerald-500 bluish:focus:ring-blue-500/10 bluish:focus:border-blue-500 transition-all outline-none resize-none shadow-sm"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8 border-t border-gray-100 dark:border-zinc-800 bluish:border-white/10 mt-8 transition-colors duration-300">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full md:min-w-[240px] bg-gradient-to-r from-blue-600 to-blue-500 dark:from-emerald-600 dark:to-emerald-500 bluish:from-blue-600 bluish:to-blue-500 hover:from-blue-700 dark:hover:from-emerald-700 bluish:hover:from-blue-700 hover:to-blue-600 dark:hover:to-emerald-600 bluish:hover:to-blue-600 text-white font-bold text-lg py-4 px-8 rounded-xl shadow-lg shadow-blue-600/30 dark:shadow-emerald-600/30 bluish:shadow-blue-600/30 hover:shadow-blue-600/50 dark:hover:shadow-emerald-600/50 bluish:hover:shadow-blue-600/50 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Publishing...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <CheckCircle className="mr-2" size={24} />
                                        Publish Asset Listing
                                    </span>
                                )}
                            </button>
                            <div className="clear-both"></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SellerPostAsset;
