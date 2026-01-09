import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Tag, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AssetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showInterestModal, setShowInterestModal] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const { data } = await api.get(`/assets/${id}`);
                setAsset(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAsset();
    }, [id]);

    const handleShowInterest = async () => {
        if (!user) return navigate('/login');

        try {
            await api.post('/interests', {
                assetId: asset._id,
                message
            });
            alert('Interest sent successfully! The seller will be notified.');
            setShowInterestModal(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to send interest');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh] transition-colors duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
    );

    if (!asset) return (
        <div className="p-12 text-center text-gray-500 dark:text-gray-400 min-h-screen transition-colors duration-300">
            Asset not found
        </div>
    );

    return (
        <div className="min-h-screen transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="bg-gray-50 dark:bg-zinc-900 rounded-xl h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-inner">
                        {asset.images && asset.images.length > 0 ? (
                            <img src={asset.images[0]} alt={asset.title} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-400 dark:text-zinc-600 font-medium">No Image Available</span>
                        )}
                    </div>

                    {/* Info Section */}
                    <div>
                        <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-sm mb-4 transition-colors duration-300">
                            <Tag size={16} /> <span>{asset.category}</span>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <span>{asset.condition}</span>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">{asset.title}</h1>
                        <div className="text-3xl font-display font-bold text-gray-900 dark:text-gray-200 mb-8 transition-colors duration-300">
                            ${asset.price.toLocaleString()}
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8 transition-colors duration-300">
                            {asset.description}
                        </p>

                        <div className="bg-slate-50 dark:bg-zinc-900 p-6 rounded-xl border border-slate-100 dark:border-zinc-800 mb-8 shadow-sm transition-colors duration-300">
                            <div className="flex items-center text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-300">
                                <MapPin className="mr-2 text-emerald-500 dark:text-emerald-400" /> Location: <strong className="ml-1 text-gray-900 dark:text-white">{asset.location}</strong>
                            </div>
                            <div className="flex items-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                                <CheckCircle className="mr-2 text-emerald-500 dark:text-emerald-400" /> Seller: <strong className="ml-1 text-gray-900 dark:text-white">{asset.seller?.companyName || asset.seller?.fullName}</strong>
                            </div>
                        </div>

                        {user?.role === 'seller' ? (
                            <div className="text-gray-500 dark:text-gray-400 italic bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg text-center border border-gray-100 dark:border-zinc-800">
                                Logged in as Seller (Cannot buy)
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowInterestModal(true)}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-xl shadow-lg shadow-emerald-600/20 transition-all transform hover:scale-[1.02]"
                            >
                                Show Interest & Contact
                            </button>
                        )}
                    </div>
                </div>

                {/* Modal */}
                {showInterestModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-8 relative border border-gray-100 dark:border-zinc-800 shadow-2xl transition-colors duration-300">
                            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Contact Seller</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">Send a message to express your interest. If the seller accepts, you'll get their direct contact details.</p>

                            <textarea
                                className="w-full border border-gray-200 dark:border-zinc-700 rounded-xl p-3 mb-4 h-32 focus:ring-2 focus:ring-emerald-500 outline-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-white transition-colors duration-300"
                                placeholder="I'm interested in this asset..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />

                            <div className="flex space-x-4">
                                <button
                                    onClick={handleShowInterest}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-600/20"
                                >
                                    Send Request
                                </button>
                                <button
                                    onClick={() => setShowInterestModal(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-bold transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssetDetails;
