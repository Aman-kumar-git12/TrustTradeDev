import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Tag, CheckCircle, ArrowLeft, Edit, Trash2, Eye, PauseCircle, PlayCircle } from 'lucide-react';
import { useUI } from '../context/UIContext';

const SellerAssetDetails = () => {
    const { id } = useParams(); // Using 'id' from route /dashboard/seller/:businessId/listings/:id
    const navigate = useNavigate();
    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showSnackbar, confirm } = useUI();

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                // Use the new specific endpoint for seller asset details
                const { data } = await api.get(`/assets/my-listings/${id}`);
                setAsset(data);
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

    const handleStatusChange = async () => {
        if (!asset) return;
        const newStatus = asset.status === 'active' ? 'inactive' : 'active';
        console.log("New status:", newStatus);
        try {
            const { data } = await api.patch(`/assets/${id}/status`, { status: newStatus });
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

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!asset) return <div className="p-12 text-center">Asset not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors group"
            >
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Listings
            </button>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
                {/* Image Section - Left (Rounded as per image) */}
                <div className="bg-gray-100 rounded-2xl overflow-hidden aspect-[4/3] shadow-inner relative group">
                    {asset.images && asset.images.length > 0 ? (
                        <img
                            src={asset.images[0]}
                            alt={asset.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}

                    {/* Status Overlay */}
                    <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${asset.status === 'active' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                            }`}>
                            {asset.status}
                        </span>
                    </div>
                </div>

                {/* Info Section - Right */}
                <div className="space-y-6">
                    {/* Tags */}
                    <div className="flex items-center space-x-3 text-sm font-bold tracking-wider uppercase">
                        <span className="text-orange-500 flex items-center gap-1">
                            <Tag size={14} /> {asset.category}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-orange-500">
                            {asset.condition}
                        </span>
                    </div>

                    {/* Title & Price */}
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-2">
                            {asset.title}
                        </h1>
                        <div className="text-3xl font-bold text-gray-900">
                            ${asset.price.toLocaleString()}
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex items-center gap-6 py-4 border-y border-gray-100">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Eye size={18} />
                            <span className="font-medium">{asset.views || 0} views</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={18} />
                            <span className="font-medium">{asset.location}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed">
                        <p>{asset.description}</p>
                    </div>

                    {/* Location & Seller Info Box matching image style */}
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-3">
                        <div className="flex items-center text-gray-700">
                            <div className="w-8 flex justify-center mr-3">
                                <MapPin className="text-orange-500" />
                            </div>
                            <span>Location: <strong>{asset.location}</strong></span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <div className="w-8 flex justify-center mr-3">
                                <CheckCircle className="text-orange-500" />
                            </div>
                            <span>Seller: <strong>Tech Liquidators Inc. (You)</strong></span>
                        </div>
                    </div>

                    {/* Seller Actions */}
                    <div className="mt-8 pt-8 border-t border-gray-100">
                        <div className="flex flex-col sm:flex-row gap-4">

                            {asset.status === 'active' ? (
                                <button
                                    onClick={handleStatusChange}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <PauseCircle size={20} /> Deactivate
                                </button>
                            ) : (
                                <button
                                    onClick={handleStatusChange}
                                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-3 px-6 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    <PlayCircle size={20} /> Activate
                                </button>
                            )}

                            <button className="flex-1 bg-[#1a202c] hover:bg-gray-900 text-white py-3 px-6 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg">
                                <Edit size={20} /> Edit Listing
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-white border-2 border-red-100 text-red-600 py-3 px-6 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 size={20} /> Delete
                            </button>
                        </div>
                        <p className="text-center text-gray-400 text-sm mt-4 italic">
                            Logged in as Seller (Cannot buy)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerAssetDetails;
