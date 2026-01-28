import { useState, useEffect } from 'react';
import { Sparkles, Save, Upload, Link as LinkIcon, Calendar, Info } from 'lucide-react';
import api from '../../utils/api';

const AdminSettings = () => {
    const [eventData, setEventData] = useState({
        title: '',
        subtitle: '',
        description: '',
        imageUrl: '',
        link: '',
        expiresAt: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const { data } = await api.get('/admin/event');
                if (data) {
                    setEventData({
                        ...data,
                        expiresAt: data.expiresAt ? data.expiresAt.substring(0, 10) : ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch event", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await api.post('/admin/event', eventData);
            setMessage({ type: 'success', text: 'Featured event updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update featured event.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center bg-transparent bluish:bg-[#0a0f1d] min-h-screen">Loading settings...</div>;

    return (
        <div className="flex-1 h-full p-8">
            <header className="mb-10 relative z-10">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-emerald-400 dark:to-teal-500">Platform Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Manage global configurations and promotional content.</p>
            </header>

            <div className="max-w-4xl relative z-10">
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] rounded-2xl border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden p-8">
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-100 dark:border-white/5 pb-6">
                        <div className="w-10 h-10 bg-yellow-400/10 text-yellow-500 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold uppercase tracking-tight">Featured Event Billboard</h2>
                            <p className="text-sm text-gray-500">This changes the main hero banner on the homepage.</p>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                            <Info className="w-5 h-5" />
                            <span className="font-medium text-sm">{message.text}</span>
                        </div>
                    )}

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Main Title</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 bluish:bg-[#080c14] border border-gray-100 dark:border-white/5 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                                    placeholder="e.g. Global Industrial"
                                    value={eventData.title}
                                    onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Gradient Subtitle</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 bluish:bg-[#080c14] border border-gray-100 dark:border-white/5 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                                    placeholder="e.g. Liquidation Event"
                                    value={eventData.subtitle}
                                    onChange={(e) => setEventData(prev => ({ ...prev, subtitle: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Event Name (Top Right)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-950 bluish:bg-[#080c14] border border-gray-100 dark:border-white/5 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                                    placeholder="e.g. Industrial Robotics Auction"
                                    value={eventData.description}
                                    onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Expiry Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-950 bluish:bg-[#080c14] border border-gray-100 dark:border-white/5 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                                        value={eventData.expiresAt}
                                        onChange={(e) => setEventData(prev => ({ ...prev, expiresAt: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Background Image URL</label>
                            <div className="relative">
                                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-950 bluish:bg-[#080c14] border border-gray-100 dark:border-white/5 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                                    placeholder="Unsplash URL, Cloudinary URL, etc."
                                    value={eventData.imageUrl}
                                    onChange={(e) => setEventData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">CTA Redirect Link</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-zinc-950 bluish:bg-[#080c14] border border-gray-100 dark:border-white/5 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                                    placeholder="/marketplace, /assets/123, etc."
                                    value={eventData.link}
                                    onChange={(e) => setEventData(prev => ({ ...prev, link: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? 'Saving...' : 'Update Event'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 flex gap-6">
                    <div className="flex-1 bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] rounded-2xl border border-gray-100 dark:border-white/5 p-6 shadow-xl">
                        <h3 className="font-bold mb-2">Pro Tip</h3>
                        <p className="text-sm text-gray-500">Ensure the background image is at least 1920x1080 for the best visual experience on large screens.</p>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] rounded-2xl border border-gray-100 dark:border-white/5 p-6 shadow-xl">
                        <h3 className="font-bold mb-2">Drafting</h3>
                        <p className="text-sm text-gray-500">Changes are applied immediately to the homepage once you click update.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
