import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { useUI } from '../context/UIContext';

const CATEGORIES = [
    'Industrial',
    'Vehicles',
    'IT Hardware',
    'Real Estate',
    'Medical',
    'Electronics',
    'Manufacturing',
    'Office Equipment'
];

const PostAsset = () => {
    const navigate = useNavigate();
    const { businessId } = useParams();
    const { showSnackbar } = useUI();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: CATEGORIES[0],
        condition: 'New',
        price: '',
        location: '',
        imageUrl: ''
    });

    const [isCustomCategory, setIsCustomCategory] = useState(false);

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value === 'Other') {
            setIsCustomCategory(true);
            setFormData({ ...formData, category: '' });
        } else {
            setIsCustomCategory(false);
            setFormData({ ...formData, category: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.category.trim()) {
                showSnackbar('Please specify a category', 'error');
                return;
            }

            await api.post('/assets', {
                ...formData,
                businessId, // Include businessId
                images: formData.imageUrl ? [formData.imageUrl] : []
            });
            showSnackbar('Asset listed successfully!', 'success');
            navigate('/dashboard/seller');
        } catch (error) {
            console.error('Failed to post asset', error);
            showSnackbar('Failed to post asset', 'error');
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-primary mb-8">List New Asset</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Asset Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                            <input
                                type="number"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <div className="space-y-2">
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                    value={isCustomCategory ? 'Other' : formData.category}
                                    onChange={handleCategoryChange}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    <option value="Other">Other</option>
                                </select>

                                {isCustomCategory && (
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter custom category"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none bg-slate-50"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        autoFocus
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                            value={formData.imageUrl}
                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            required
                            rows={4}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                value={formData.condition}
                                onChange={e => setFormData({ ...formData, condition: e.target.value })}
                            >
                                <option>New</option>
                                <option>Used - Like New</option>
                                <option>Used - Good</option>
                                <option>Used - Fair</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-accent outline-none"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-light transition-colors">
                            Publish Listing
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostAsset;
