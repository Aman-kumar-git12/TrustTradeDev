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

    if (loading) return <div className="p-12 text-center">Loading...</div>;
    if (!asset) return <div className="p-12 text-center">Asset not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-2 gap-12">
                {/* Image Section */}
                <div className="bg-gray-100 rounded-xl h-[400px] lg:h-[500px] flex items-center justify-center overflow-hidden">
                    {asset.images && asset.images.length > 0 ? (
                        <img src={asset.images[0]} alt={asset.title} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-400">No Image Available</span>
                    )}
                </div>

                {/* Info Section */}
                <div>
                    <div className="flex items-center space-x-2 text-accent font-bold uppercase tracking-wider text-sm mb-4">
                        <Tag size={16} /> <span>{asset.category}</span>
                        <span>•</span>
                        <span>{asset.condition}</span>
                    </div>

                    <h1 className="text-4xl font-bold text-primary mb-4">{asset.title}</h1>
                    <div className="text-3xl font-display font-bold text-gray-900 mb-8">
                        ${asset.price.toLocaleString()}
                    </div>

                    <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {asset.description}
                    </p>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 icon-text mb-8">
                        <div className="flex items-center text-gray-700 mb-2">
                            <MapPin className="mr-2 text-accent" /> Location: <strong>{asset.location}</strong>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <CheckCircle className="mr-2 text-accent" /> Seller: <strong>{asset.seller?.companyName || asset.seller?.fullName}</strong>
                        </div>
                    </div>

                    {user?.role === 'seller' ? (
                        <div className="text-gray-500 italic">Logged in as Seller (Cannot buy)</div>
                    ) : (
                        <button
                            onClick={() => setShowInterestModal(true)}
                            className="w-full bg-accent hover:bg-accent-hover text-white py-4 rounded-xl font-bold text-xl shadow-lg shadow-accent/20 transition-all transform hover:scale-[1.02]"
                        >
                            Show Interest & Contact
                        </button>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showInterestModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-8 relative">
                        <h3 className="text-2xl font-bold mb-4">Contact Seller</h3>
                        <p className="text-gray-600 mb-4">Send a message to express your interest. If the seller accepts, you'll get their direct contact details.</p>

                        <textarea
                            className="w-full border rounded-lg p-3 mb-4 h-32 focus:ring-2 focus:ring-accent outline-none"
                            placeholder="I'm interested in this asset..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />

                        <div className="flex space-x-4">
                            <button
                                onClick={handleShowInterest}
                                className="flex-1 bg-accent text-white py-3 rounded-lg font-bold"
                            >
                                Send Request
                            </button>
                            <button
                                onClick={() => setShowInterestModal(false)}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetDetails;
