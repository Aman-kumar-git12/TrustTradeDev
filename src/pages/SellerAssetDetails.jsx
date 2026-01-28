import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Tag, CheckCircle, ArrowLeft, Edit, Trash2, Eye, PauseCircle, PlayCircle, FileText } from 'lucide-react';
import { useUI } from '../context/UIContext';
import AssetDetailsShimmer from '../components/shimmers/AssetDetailsShimmer';

const SellerAssetDetails = () => {
    const { id } = useParams(); // Using 'id' from route /dashboard/seller/:businessId/listings/:id
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [asset, setAsset] = useState(null);
    const { showSnackbar, confirm } = useUI();
    const [editForm, setEditForm] = useState({
        title: '',
        price: '',
        description: '',
        location: '',
        category: '',
        condition: '',
        quantity: ''
    });

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                // Use the new specific endpoint for seller asset details
                const { data } = await api.get(`/assets/my-listings/${id}`);
                setAsset(data);
                setEditForm({
                    title: data.title,
                    price: data.price,
                    description: data.description,
                    location: data.location,
                    category: data.category,
                    condition: data.condition,
                    quantity: data.quantity
                });
            } catch (error) {
                console.error("Failed to fetch asset", error);
                showSnackbar("Failed to fetch asset details", "error");
                // navigate(-1); // Go back if failed?
            } finally {
                setLoading(false);
            }
        };
        fetchAsset();
    }, [id]);

    const handleInputChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdateAsset = async () => {
        try {
            const { data } = await api.put(`/assets/my-listings/${id}`, editForm);
            setAsset(data);
            setIsEditing(false);
            showSnackbar("Asset updated successfully", "success");
        } catch (error) {
            console.error("Failed to update asset", error);
            showSnackbar("Failed to update asset", "error");
        }
    };

    const handleStatusChange = async () => {
        if (!asset) return;
        const newStatus = asset.status === 'active' ? 'inactive' : 'active';
        console.log("New status:", newStatus);
        try {
            const { data } = await api.put(`/assets/${id}/status`, { status: newStatus });
            setAsset({ ...asset, status: data.status });
            showSnackbar(`Listing ${newStatus === 'active' ? 'activated' : 'deactivated'}`, 'success');
        } catch (error) {
            console.error("Failed to update status", error);
            showSnackbar("Failed to update status", "error");
        }
    };

    const handleDelete = () => {
        confirm({
            title: "Delete Asset",
            message: "Are you sure you want to delete this listing? This action cannot be undone.",
            isDangerous: true,
            confirmText: "Delete",
        }).then(async (confirmed) => {
            if (confirmed) {
                try {
                    await api.delete(`/assets/${id}`);
                    showSnackbar("Asset deleted", "success");
                    navigate(-1); // Go back to listings
                } catch (error) {
                    showSnackbar("Failed to delete", "error");
                }
            }
        });
    };

    if (loading) return <AssetDetailsShimmer />;

    if (!asset) return <div className="p-12 text-center text-gray-500 dark:text-gray-400">Asset not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors group"
            >
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Listings
            </button>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Image Section - Left (Rounded as per image) */}
                <div className="bg-gray-100 dark:bg-zinc-800 rounded-2xl overflow-hidden aspect-[4/3] shadow-inner relative group transition-colors duration-300">
                    {asset.images && asset.images.length > 0 ? (
                        <img
                            src={asset.images[0]}
                            alt={asset.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-zinc-600">No Image</div>
                    )}

                    {/* Status Overlay */}
                    <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${asset.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-emerald-900/40 dark:text-emerald-300' :
                            'bg-gray-100 text-gray-700 dark:bg-zinc-700 dark:text-gray-300'
                            } transition-colors duration-300`}>
                            {asset.status}
                        </span>
                    </div>
                </div>

                {/* Info Section - Right */}
                <div className={`space-y-6 transition-all duration-300 ${isEditing ? 'bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800' : ''}`}>
                    {/* Tags */}
                    {/* Tags */}
                    {!isEditing ? (
                        <div className="flex items-center space-x-3 text-sm font-bold tracking-wider uppercase">
                            <span className="text-blue-500 dark:text-emerald-400 flex items-center gap-1 transition-colors duration-300">
                                <Tag size={14} /> {asset.category}
                            </span>
                            <span className="text-gray-300 dark:text-zinc-700">•</span>
                            <span className="text-blue-500 dark:text-emerald-400 transition-colors duration-300">
                                {asset.condition}
                            </span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex flex-col">
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 transition-colors duration-300">Category</label>
                                <select
                                    name="category"
                                    value={['Industrial', 'Vehicles', 'IT Hardware', 'Real Estate', 'Medical', 'Electronics', 'Manufacturing', 'Office Equipment'].includes(editForm.category) ? editForm.category : 'Other'}
                                    onChange={(e) => {
                                        if (e.target.value === 'Other') {
                                            setEditForm({ ...editForm, category: '' });
                                        } else {
                                            setEditForm({ ...editForm, category: e.target.value });
                                        }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 focus:border-blue-500 dark:focus:border-emerald-500 outline-none transition-all cursor-pointer"
                                >
                                    {['Industrial', 'Vehicles', 'IT Hardware', 'Real Estate', 'Medical', 'Electronics', 'Manufacturing', 'Office Equipment'].map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    <option value="Other">Other</option>
                                </select>
                                {(!['Industrial', 'Vehicles', 'IT Hardware', 'Real Estate', 'Medical', 'Electronics', 'Manufacturing', 'Office Equipment'].includes(editForm.category)) && (
                                    <input
                                        type="text"
                                        placeholder="Specify Category"
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        className="mt-2 w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 focus:border-blue-500 dark:focus:border-emerald-500 outline-none transition-all"
                                        autoFocus
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 transition-colors duration-300">Condition</label>
                                <select
                                    name="condition"
                                    value={editForm.condition}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 focus:border-blue-500 dark:focus:border-emerald-500 outline-none transition-all cursor-pointer"
                                >
                                    <option value="New">New</option>
                                    <option value="Like New">Like New</option>
                                    <option value="Used - Good">Used - Good</option>
                                    <option value="Used - Fair">Used - Fair</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Title & Price */}
                    <div className="space-y-4">
                        {!isEditing ? (
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-2 transition-colors duration-300">
                                {asset.title}
                            </h1>
                        ) : (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 transition-colors duration-300">Title</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                                        <FileText size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        name="title"
                                        value={editForm.title}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 text-xl font-bold text-gray-900 dark:text-white bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 focus:border-blue-500 dark:focus:border-emerald-500 outline-none transition-all"
                                        placeholder="Asset Title"
                                    />
                                </div>
                            </div>
                        )}

                        {!isEditing ? (
                            <div className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                                ${asset.price.toLocaleString()}
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 transition-colors duration-300">Price (USD)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-gray-400 font-bold">₹</div>
                                    <input
                                        type="number"
                                        name="price"
                                        value={editForm.price}
                                        onChange={handleInputChange}
                                        className="w-full pl-8 pr-4 py-3 text-xl font-bold text-gray-900 dark:text-white bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 focus:border-blue-500 dark:focus:border-emerald-500 outline-none transition-all"
                                        placeholder="Price"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quantity Section */}
                    <div>
                        {!isEditing ? (
                            <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                <span className="font-bold text-lg">Quantity Available:</span>
                                <span className="text-xl font-bold text-blue-600 dark:text-white">{asset.quantity}</span>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 transition-colors duration-300">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={editForm.quantity}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-3 text-xl font-bold text-gray-900 dark:text-white bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 focus:border-blue-500 dark:focus:border-emerald-500 outline-none transition-all"
                                    placeholder="Quantity"
                                />
                            </div>
                        )}
                    </div>

                    {/* Stats Row */}
                    {/* Stats Row */}
                    <div className="flex items-center gap-6 py-4 border-y border-gray-100 dark:border-zinc-800 transition-colors duration-300">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Eye size={18} />
                            <span className="font-medium">{asset.views || 0} views</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <MapPin size={18} />
                            {!isEditing ? (
                                <span className="font-medium">{asset.location}</span>
                            ) : (
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="location"
                                        value={editForm.location}
                                        onChange={handleInputChange}
                                        className="border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-1 text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 focus:border-blue-500 dark:focus:border-emerald-500 outline-none transition-all"
                                        placeholder="Location"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">
                        {!isEditing ? (
                            <p>{asset.description}</p>
                        ) : (
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 transition-colors duration-300">Description</label>
                                <textarea
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-200 dark:border-zinc-700 rounded-xl p-4 text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 focus:border-blue-500 dark:focus:border-emerald-500 outline-none transition-all shadow-sm"
                                    rows="6"
                                    placeholder="Asset Description"
                                />
                            </div>
                        )}
                    </div>

                    {/* Location & Seller Info Box matching image style */}
                    <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-xl p-6 border border-slate-100 dark:border-zinc-700 space-y-3 transition-colors duration-300">
                        <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                            <div className="w-8 flex justify-center mr-3">
                                <MapPin className="text-blue-500 dark:text-emerald-400" />
                            </div>
                            <span>Location: <strong className="text-gray-900 dark:text-white transition-colors duration-300">{asset.location}</strong></span>
                        </div>
                        <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                            <div className="w-8 flex justify-center mr-3">
                                <CheckCircle className="text-blue-500 dark:text-emerald-400" />
                            </div>
                            <span>Seller: <strong className="text-gray-900 dark:text-white transition-colors duration-300">Tech Liquidators Inc. (You)</strong></span>
                        </div>
                    </div>

                    {/* Seller Actions */}
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-zinc-800 transition-colors duration-300">
                        {isEditing ? (
                            <div className="flex gap-4">
                                <button
                                    onClick={handleUpdateAsset}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-emerald-600 dark:to-emerald-500 hover:from-blue-700 hover:to-blue-600 dark:hover:from-emerald-700 dark:hover:to-emerald-600 text-white py-3 px-6 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                                >
                                    <CheckCircle size={20} /> Save Changes
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditForm({
                                            title: asset.title,
                                            price: asset.price,
                                            description: asset.description,
                                            location: asset.location,
                                            category: asset.category,
                                            condition: asset.condition,
                                            quantity: asset.quantity
                                        });
                                    }}
                                    className="flex-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-4">
                                {asset.status === 'active' ? (
                                    <button
                                        onClick={handleStatusChange}
                                        className="flex-1 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <PauseCircle size={20} /> Deactivate
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleStatusChange}
                                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-emerald-600 dark:to-emerald-500 hover:from-blue-700 hover:to-blue-600 dark:hover:from-emerald-700 dark:hover:to-emerald-600 text-white py-3 px-6 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                                    >
                                        <PlayCircle size={20} /> Activate
                                    </button>
                                )}

                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex-1 bg-[#1a202c] dark:bg-zinc-700 hover:bg-gray-900 dark:hover:bg-zinc-600 text-white py-3 px-6 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                                >
                                    <Edit size={20} /> Edit Listing
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="bg-white dark:bg-zinc-900 border-2 border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 py-3 px-6 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={20} /> Delete
                                </button>
                            </div>
                        )}
                        <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-4 italic">
                            Logged in as Seller (Cannot buy)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerAssetDetails;
