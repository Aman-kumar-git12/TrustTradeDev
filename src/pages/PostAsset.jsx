import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Upload, DollarSign, MapPin, Tag, LayoutGrid, FileText, CheckCircle, AlertCircle, Image as ImageIcon,
    Factory, Truck, Cpu, Building2, Stethoscope, Smartphone, Hammer, Printer, HelpCircle
} from 'lucide-react';
import api from '../utils/api';
import { useUI } from '../context/UIContext';

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

const PostAsset = () => {
    const navigate = useNavigate();
    const { businessId } = useParams();
    const { showSnackbar } = useUI();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: CATEGORIES[0].name,
        condition: 'New',
        price: '',
        location: '',
        imageUrl: ''
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
                businessId,
                images: formData.imageUrl ? [formData.imageUrl] : []
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

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="mr-4 p-2 rounded-full hover:bg-white hover:shadow-sm text-gray-500 hover:text-primary transition-all"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">List New Asset</h1>
                        <p className="text-gray-500 mt-1">Fill in the details to publish your asset to the marketplace.</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-primary to-accent w-full"></div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-10">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                            {/* LEFT COLUMN: Asset Specification */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-6">Asset Details</h3>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Asset Title</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FileText className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g., 2020 CNC Milling Machine"
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                                    value={formData.title}
                                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Price (USD)</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="number"
                                                        required
                                                        placeholder="0.00"
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                                        value={formData.price}
                                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Condition</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Tag className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <select
                                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none appearance-none bg-white"
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
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MapPin className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="City, State"
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                                                    value={formData.location}
                                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Selection Grid */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Category</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat.name}
                                                type="button"
                                                onClick={() => handleCategorySelect(cat.name)}
                                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${!isCustomCategory && formData.category === cat.name
                                                        ? 'border-primary bg-primary/5 text-primary shadow-sm scale-[1.02]'
                                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
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
                                                    ? 'border-primary bg-primary/5 text-primary shadow-sm scale-[1.02]'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600'
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
                                                className="w-full px-4 py-2 border border-primary/30 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-blue-50/30"
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
                                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Media & Description</h3>

                                {/* Image Preview Box */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Asset Image</label>

                                    <div className="mb-4 w-full h-64 bg-slate-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden relative group">
                                        {formData.imageUrl ? (
                                            <>
                                                <img
                                                    src={formData.imageUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/400x300?text=Invalid+Image+URL"
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium backdrop-blur-sm">
                                                    Image Preview
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center p-6">
                                                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3 text-primary">
                                                    <ImageIcon size={32} />
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">No Image Selected</p>
                                                <p className="text-xs text-gray-500 mt-1">Paste a URL below to preview</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Upload className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="url"
                                            placeholder="Paste image URL here (https://...)"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none shadow-sm"
                                            value={formData.imageUrl}
                                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                                        <AlertCircle size={12} className="mr-1" />
                                        Supported formats: JPG, PNG, WEBP.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                    <textarea
                                        required
                                        rows={6}
                                        placeholder="Describe the condition, history, and key features of the asset..."
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none shadow-sm"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8 border-t border-gray-100 mt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full md:w-auto md:min-w-[240px] float-right bg-gradient-to-r from-primary to-primary-focus text-white font-bold text-lg py-4 px-8 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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

export default PostAsset;
