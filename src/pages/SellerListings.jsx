import { useEffect, useState } from 'react';
import api from '../utils/api';

const SellerListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const { data } = await api.get('/assets/my-listings');
                setListings(data);
            } catch (error) {
                console.error("Failed to fetch listings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    if (loading) return <div className="text-center py-12">Loading Listings...</div>;

    return (
        <div className="grid gap-6 animate-fade-in">
            {listings.map(asset => (
                <div key={asset._id} className="bg-white p-6 rounded-xl border flex justify-between items-center group hover:border-primary transition-all">
                    <div>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{asset.title}</h3>
                        <p className="text-gray-500">${asset.price.toLocaleString()} • <span className={`font-semibold ${asset.status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>{asset.status.toUpperCase()}</span></p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">
                            Listed on {new Date(asset.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs font-bold bg-slate-100 px-2 py-1 rounded inline-block">
                            {asset.views || 0} Views
                        </div>
                    </div>
                </div>
            ))}
            {listings.length === 0 && <div className="text-center py-12 text-gray-500">No listings yet.</div>}
        </div>
    );
};

export default SellerListings;
