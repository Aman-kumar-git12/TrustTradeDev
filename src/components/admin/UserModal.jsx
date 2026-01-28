import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserCog, Shield, Mail, Calendar, Search, Filter, CheckCircle, XCircle, ChevronDown, Phone, Trophy, Loader2, Tag, Edit, Clock, ArrowLeft, X, ShoppingBag } from 'lucide-react';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from './ConfirmationModal';
import ListingsShimmer from '../shimmers/ListingsShimmer';
import LeadsShimmer from '../shimmers/LeadsShimmer';

export const RoleBadge = ({ role }) => {
    const styles = {
        admin: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        seller: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        buyer: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${styles[role] || styles.buyer}`}>
            {role}
        </span>
    );
};

const UserModal = ({
    user,
    onClose,
    onRoleChange,
    updating,
    onUpdateUser,
    showSnackbar,
    isStandalone = true, // New prop to control URL sync
    initialTab = 'profile', // New prop for default tab
    showTabs = true, // New prop to toggle tab bar
    onBack = null // New prop for back navigation
}) => {
    const params = useParams(); // conditionally used
    const navigate = useNavigate();

    // If standalone, use URL param, else use prop
    const currentTab = isStandalone ? params.tab : initialTab;

    const [activeTab, setActiveTab] = useState(currentTab || 'profile');
    const [eliteScore, setEliteScore] = useState(null);
    const [loadingScore, setLoadingScore] = useState(false);

    // Filter & Search States
    const [listingSearch, setListingSearch] = useState('');
    const [listingStatusFilter, setListingStatusFilter] = useState('all');
    const [listingBusinessFilter, setListingBusinessFilter] = useState('all');

    const [leadSearch, setLeadSearch] = useState('');
    const [leadStatusFilter, setLeadStatusFilter] = useState('all');
    const [leadBusinessFilter, setLeadBusinessFilter] = useState('all');

    const [orderSearch, setOrderSearch] = useState('');
    const [orderStatusFilter, setOrderStatusFilter] = useState('all');

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);

    const [editForm, setEditForm] = useState({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || ''
    });
    const [saving, setSaving] = useState(false);

    // Asset Toggling State
    const [assetToToggle, setAssetToToggle] = useState(null);
    const [togglingStatus, setTogglingStatus] = useState(null);

    // Dynamic Data State
    const [listings, setListings] = useState([]);
    const [leads, setLeads] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingData, setLoadingData] = useState((currentTab === 'listings' || currentTab === 'leads' || currentTab === 'orders'));

    // Sync tab with URL only if standalone
    useEffect(() => {
        if (isStandalone && currentTab && currentTab !== activeTab) {
            setActiveTab(currentTab);
        }
    }, [currentTab, isStandalone]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if ((tab === 'listings' && listings.length === 0) || (tab === 'leads' && leads.length === 0) || (tab === 'orders' && orders.length === 0)) {
            setLoadingData(true);
        }
        if (isStandalone) {
            navigate(`/admin/users/${user._id}/${tab}`);
        }
    };

    useEffect(() => {
        if (activeTab === 'listings' && listings.length === 0) fetchListings();
        if (activeTab === 'leads' && leads.length === 0) fetchLeads();
        if (activeTab === 'orders' && orders.length === 0) fetchOrders();
    }, [activeTab]);

    const fetchListings = async () => {
        setLoadingData(true);
        try {
            const { data } = await api.get(`/admin/users/${user._id}/listings`);
            setListings(data);
        } catch (error) {
            showSnackbar("Failed to fetch listings", "error");
        } finally {
            setLoadingData(false);
        }
    };

    const fetchLeads = async () => {
        setLoadingData(true);
        try {
            const { data } = await api.get(`/admin/users/${user._id}/leads`);
            setLeads(data);
        } catch (error) {
            showSnackbar("Failed to fetch leads", "error");
        } finally {
            setLoadingData(false);
        }
    };

    const fetchOrders = async () => {
        setLoadingData(true);
        try {
            const { data } = await api.get(`/admin/users/${user._id}/orders`);
            setOrders(data);
        } catch (error) {
            showSnackbar("Failed to fetch orders", "error");
        } finally {
            setLoadingData(false);
        }
    };

    const confirmToggleStatus = async () => {
        if (!assetToToggle) return;
        const assetId = assetToToggle._id;
        setTogglingStatus(assetId);
        setAssetToToggle(null);
        try {
            const { data } = await api.put(`/admin/assets/${assetId}/toggle-status`);
            setListings(prev => prev.map(a => a._id === assetId ? data : a));
            showSnackbar(
                data.status === 'active'
                    ? "Listing is back from vacation and ready for work! ✅"
                    : "Listing is officially on leave. Shhh! 🤫",
                "success"
            );
        } catch (error) {
            showSnackbar("Failed to toggle asset status", "error");
        } finally {
            setTogglingStatus(null);
        }
    };

    const handleToggleAssetStatus = (asset) => {
        setAssetToToggle(asset);
    };

    const filteredListings = [...listings]
        .filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(listingSearch.toLowerCase());
            const status = (item.status || '').toLowerCase();
            const matchesBusiness = listingBusinessFilter === 'all' || item.business?._id?.toString() === listingBusinessFilter;

            if (listingStatusFilter === 'all') {
                return matchesSearch && matchesBusiness;
            }
            return matchesSearch && status === listingStatusFilter.toLowerCase() && matchesBusiness;
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        });

    const filteredLeads = [...leads]
        .filter(lead => {
            const buyerName = lead.buyer?.fullName?.toLowerCase() || '';
            const assetTitle = lead.asset?.title?.toLowerCase() || '';
            const matchesSearch = buyerName.includes(leadSearch.toLowerCase()) || assetTitle.includes(leadSearch.toLowerCase());
            const matchesStatus = leadStatusFilter === 'all' || lead.status === leadStatusFilter || lead.salesStatus === leadStatusFilter;
            const matchesBusiness = leadBusinessFilter === 'all' || lead.asset?.business?._id === leadBusinessFilter;
            return matchesSearch && matchesStatus && matchesBusiness;
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        });

    const filteredOrders = [...orders]
        .filter(order => {
            const sellerName = order.seller?.fullName?.toLowerCase() || '';
            const assetTitle = order.asset?.title?.toLowerCase() || '';
            const matchesSearch = sellerName.includes(orderSearch.toLowerCase()) || assetTitle.includes(orderSearch.toLowerCase());
            const status = order.salesStatus === 'sold' ? 'sold' : order.status; // Consistent status
            const matchesStatus = orderStatusFilter === 'all' || status === orderStatusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
        });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onUpdateUser(user._id, editForm);
            setIsEditing(false);
            showSnackbar("Profile updated successfully", "success");
        } catch (error) {
            showSnackbar(error.response?.data?.message || "Failed to update profile", "error");
        } finally {
            setSaving(false);
        }
    };

    if (!user) return null;

    const fetchEliteScore = async () => {
        setLoadingScore(true);
        // Simulate API call with intentional delay for "drama"
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Random humorous score
        setEliteScore(Math.floor(Math.random() * (999 - 420 + 1) + 420));
        setLoadingScore(false);
    };

    const getScoreVerdict = (score) => {
        if (!score) return null;
        if (score > 900) return "Basically a God ⚡️";
        if (score > 800) return "Pure Professionalism (mostly) 🎩";
        if (score > 700) return "Legend in the Making 🚀";
        if (score > 600) return "Needs more Coffee ☕️";
        return "Still Loading Personality... 🛠️";
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm ${!isStandalone ? 'absolute' : ''}`}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full max-w-4xl h-[750px] bg-gradient-to-b from-white to-gray-50 dark:from-[#0f0f11] dark:to-[#0a0a0c] bluish:from-[#0d121f] bluish:to-[#080b14] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header with Pattern */}
                <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                    {/* Back Button for nested view */}
                    {onBack && (
                        <button
                            onClick={onBack}
                            className="absolute top-4 left-4 p-2.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md z-30 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </button>
                    )}

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md z-30"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Tabs Overlay - Conditional */}
                    {showTabs && (
                        <div className="absolute bottom-0 left-0 right-0 flex px-8 gap-4 translate-y-1/2 z-20">
                            {(() => {
                                const getTabsVals = () => {
                                    if (user.role === 'buyer') return ['profile', 'orders'];
                                    if (user.role === 'seller') return ['profile', 'listings', 'leads'];
                                    return ['profile']; // Default/Admin
                                };
                                return getTabsVals().map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabChange(tab)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg ${activeTab === tab
                                            ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 scale-105'
                                            : 'bg-white/90 dark:bg-zinc-900/90 text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        {tab === 'orders' ? 'My Orders' : tab}
                                    </button>
                                ));
                            })()}
                        </div>
                    )}
                </div>

                {/* Content Area - Fixed Height & Scrollable */}
                <div className="flex-1 overflow-hidden relative flex flex-col">
                    <div className="p-8 pt-10 h-full overflow-hidden flex flex-col relative">
                        <AnimatePresence>
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="flex-1 min-h-0 flex flex-col space-y-6"
                                >
                                    <div className="flex justify-between items-end mb-6">
                                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-xl border-4 border-white dark:border-[#0f0f11] bluish:border-[#0d121f] ${user.role === 'admin' ? 'bg-purple-600' : user.role === 'seller' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                                            {user.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <RoleBadge role={user.role} />
                                            {onUpdateUser && (
                                                <button
                                                    onClick={() => setIsEditing(!isEditing)}
                                                    className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                    {isEditing ? "Cancel" : "Edit Profile"}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {isEditing ? (
                                        <form onSubmit={handleUpdateProfile} className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Full Name</label>
                                                    <input
                                                        type="text"
                                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                                                        value={editForm.fullName}
                                                        onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email</label>
                                                    <input
                                                        type="email"
                                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                                                        value={editForm.email}
                                                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Phone</label>
                                                <input
                                                    type="text"
                                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl text-sm outline-none focus:border-blue-500 transition-colors"
                                                    value={editForm.phone}
                                                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                                            >
                                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                Save Changes
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 transition-transform hover:scale-[1.02]">
                                                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                                                        <Mail className="w-4 h-4" />
                                                        <span className="text-xs font-bold uppercase tracking-wider">Email</span>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate" title={user.email}>
                                                        {user.email}
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 transition-transform hover:scale-[1.02]">
                                                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                                                        <Clock className="w-4 h-4" />
                                                        <span className="text-xs font-bold uppercase tracking-wider">Joined</span>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                                        {new Date(user.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            {user.phone && (
                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                                                    <Phone className="w-4 h-4" />
                                                    <span className="text-sm font-medium">{user.phone}</span>
                                                </div>
                                            )}

                                            {/* Elite Score Section */}
                                            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-500/20">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-50">
                                                        <Trophy className="w-5 h-5" />
                                                        <span className="font-bold text-sm">Elite Score</span>
                                                    </div>
                                                    {eliteScore && (
                                                        <div className="text-right">
                                                            <div className="text-2xl font-black text-amber-600 dark:text-amber-50 leading-none">{eliteScore}</div>
                                                            <div className="text-[10px] font-bold uppercase tracking-tighter text-amber-500/70 mt-1">{getScoreVerdict(eliteScore)}</div>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">
                                                    {eliteScore
                                                        ? "Our AI algorithms have spoken. This score is 100% scientific (and 50% made up)."
                                                        : "Ranking this human's value in the intergalactic marketplace..."}
                                                </p>
                                                <div className="text-[10px] text-amber-600/50 dark:text-amber-500/50 font-bold uppercase tracking-widest text-center border-t border-amber-500/10 pt-2">
                                                    ⚠️ This is dummy data 😂
                                                </div>
                                                {!eliteScore && (
                                                    <button
                                                        onClick={fetchEliteScore}
                                                        disabled={loadingScore}
                                                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mt-4"
                                                    >
                                                        {loadingScore ? (
                                                            <>
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                                Reading tea leaves...
                                                            </>
                                                        ) : (
                                                            'Fetch Vibe Statistics'
                                                        )}
                                                    </button>
                                                )}
                                            </div>

                                            {onRoleChange && (
                                                <div className="pt-6 border-t border-gray-100 dark:border-white/10">
                                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Management Actions</h3>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {['buyer', 'seller', 'admin'].map(role => (
                                                            <button
                                                                key={role}
                                                                onClick={() => onRoleChange(user._id, role)}
                                                                disabled={updating === user._id || user.role === role}
                                                                className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${user.role === role
                                                                    ? 'bg-gray-100 dark:bg-white/5 text-gray-400 border-transparent cursor-default'
                                                                    : 'bg-white dark:bg-transparent hover:bg-blue-600 hover:text-white border-gray-200 dark:border-white/10 hover:border-transparent hover:shadow-lg hover:shadow-blue-600/20'
                                                                    }`}
                                                            >
                                                                {updating === user._id && role !== user.role ? (
                                                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                                                                ) : (
                                                                    `Make ${role}`
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'listings' && showTabs && (
                                <motion.div
                                    key="listings"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex-1 min-h-0 flex flex-col space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">User Listings</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="relative group">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="Search assets..."
                                                    value={listingSearch}
                                                    onChange={(e) => setListingSearch(e.target.value)}
                                                    className="pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg text-[10px] font-bold outline-none focus:border-blue-500 transition-all w-32"
                                                />
                                            </div>
                                            <select
                                                value={listingStatusFilter}
                                                onChange={(e) => setListingStatusFilter(e.target.value)}
                                                className="px-2 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg text-[10px] font-bold outline-none focus:border-blue-500 transition-all"
                                            >
                                                <option value="all">All Status</option>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                            <select
                                                value={listingBusinessFilter}
                                                onChange={(e) => setListingBusinessFilter(e.target.value)}
                                                className="px-2 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg text-[10px] font-bold outline-none focus:border-blue-500 transition-all max-w-[100px]"
                                            >
                                                <option value="all">All Business</option>
                                                {Array.from(new Map(listings.map(l => l.business).filter(Boolean).map(b => [b._id, b.businessName])).entries()).map(([id, name]) => (
                                                    <option key={id} value={id}>{name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {loadingData ? (
                                        <div className="flex-1 overflow-hidden">
                                            <ListingsShimmer />
                                        </div>
                                    ) : filteredListings.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                                            <Tag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm font-medium">No results found.</p>
                                        </div>
                                    ) : (
                                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="grid grid-cols-2 gap-3 pb-4">
                                                {filteredListings.map((item) => (
                                                    <div
                                                        key={item._id}
                                                        onClick={() => handleToggleAssetStatus(item)}
                                                        className="p-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl flex items-center gap-4 transition-all hover:border-blue-500/30 group cursor-pointer relative overflow-hidden"
                                                    >
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                                                            {item.images?.[0] ? (
                                                                <img src={item.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                            ) : (
                                                                <Tag className="w-full h-full p-3 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold text-[11px] text-gray-900 dark:text-white truncate uppercase tracking-tight group-hover:text-blue-500 transition-colors">{item.title}</div>
                                                            <div className="text-[10px] text-blue-500 font-black mt-0.5">₹{item.price.toLocaleString()}</div>
                                                            <div className="text-[9px] text-gray-400 mt-1 flex items-center gap-1 font-mono uppercase tracking-tighter">
                                                                <Clock className="w-2.5 h-2.5" />
                                                                {new Date(item.createdAt).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end justify-center">
                                                            <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${item.status === 'active'
                                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white'
                                                                : 'bg-zinc-100 dark:bg-zinc-800 text-gray-400 border-transparent group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 dark:group-hover:text-white'
                                                                }`}>
                                                                {item.status}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'leads' && showTabs && (
                                <motion.div
                                    key="leads"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex-1 min-h-0 flex flex-col space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Incoming Interests</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="relative group">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="Search leads..."
                                                    value={leadSearch}
                                                    onChange={(e) => setLeadSearch(e.target.value)}
                                                    className="pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg text-[10px] font-bold outline-none focus:border-blue-500 transition-all w-32"
                                                />
                                            </div>
                                            <select
                                                value={leadStatusFilter}
                                                onChange={(e) => setLeadStatusFilter(e.target.value)}
                                                className="px-2 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg text-[10px] font-bold outline-none focus:border-blue-500 transition-all"
                                            >
                                                <option value="all">All status</option>
                                                <option value="negotiating">Negotiating</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="sold">Sold Out</option>
                                            </select>
                                            <select
                                                value={leadBusinessFilter}
                                                onChange={(e) => setLeadBusinessFilter(e.target.value)}
                                                className="px-2 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg text-[10px] font-bold outline-none focus:border-blue-500 transition-all max-w-[100px]"
                                            >
                                                <option value="all">All Business</option>
                                                {Array.from(new Map(leads.map(l => l.asset?.business).filter(Boolean).map(b => [b._id, b.businessName])).entries()).map(([id, name]) => (
                                                    <option key={id} value={id}>{name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {loadingData ? (
                                        <div className="flex-1 overflow-hidden">
                                            <LeadsShimmer />
                                        </div>
                                    ) : filteredLeads.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                                            <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm font-medium">No results found.</p>
                                        </div>
                                    ) : (
                                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="grid grid-cols-1 gap-4 pb-4">
                                                {filteredLeads.map((lead) => (
                                                    <div key={lead._id} className="p-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl space-y-4 transition-all hover:border-blue-500/30 group shadow-sm hover:shadow-md">
                                                        <div className="flex flex-wrap justify-between items-start gap-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase shadow-lg ${lead.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                                                                    {lead.buyer?.fullName?.charAt(0) || '?'}
                                                                </div>
                                                                <div>
                                                                    <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight">{lead.buyer?.fullName}</div>
                                                                    <div className="text-[10px] text-gray-500 flex items-center gap-1">
                                                                        <Mail className="w-3 h-3" />
                                                                        {lead.buyer?.email}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-2">
                                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${lead.salesStatus === 'sold' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                                    lead.status === 'accepted' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                                        lead.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                            lead.status === 'negotiating' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                                                                'bg-gray-100 dark:bg-zinc-800 text-gray-500 border-transparent'
                                                                    }`}>
                                                                    {lead.salesStatus === 'sold' ? 'Status: Sold Out' : `Status: ${lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}`}
                                                                </span>
                                                                <div className="flex items-center gap-1 text-gray-400 text-[10px] font-mono">
                                                                    <Clock className="w-3 h-3" />
                                                                    {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-white/5">
                                                                <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0 shadow-sm">
                                                                    {lead.asset?.images?.[0] && <img src={lead.asset.images[0]} className="w-full h-full object-cover" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">Target Asset</div>
                                                                    <div className="text-xs font-bold text-gray-900 dark:text-white truncate uppercase">
                                                                        {lead.asset?.title}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div className="p-3 bg-blue-50/50 dark:bg-blue-500/5 rounded-xl border border-blue-100/50 dark:border-blue-500/10">
                                                                    <div className="text-[9px] text-blue-500 uppercase font-black tracking-widest leading-none mb-1">
                                                                        {lead.salesStatus === 'sold' ? 'Sold Price' : 'Offer Info'}
                                                                    </div>
                                                                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                                                                        ₹{(lead.salesStatus === 'sold' ? lead.soldPrice : lead.price)?.toLocaleString()}
                                                                        <span className="text-[10px] text-gray-400"> ×{lead.salesStatus === 'sold' ? (lead.soldQuantity || lead.quantity) : lead.quantity}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-xl border border-emerald-100/50 dark:border-emerald-500/10">
                                                                    <div className="text-[9px] text-emerald-500 uppercase font-black tracking-widest leading-none mb-1">Total Value</div>
                                                                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                                                                        ₹{(lead.salesStatus === 'sold'
                                                                            ? (lead.soldTotalAmount || ((lead.soldPrice || 0) * (lead.soldQuantity || lead.quantity || 1)))
                                                                            : ((lead.price || 0) * (lead.quantity || 1))).toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="p-3 bg-gray-50/50 dark:bg-zinc-800/20 rounded-xl border border-gray-100/50 dark:border-white/5 relative">
                                                            <div className="text-[9px] text-gray-400 uppercase font-black tracking-widest leading-none mb-2">Message from Buyer</div>
                                                            <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">
                                                                "{lead.message || 'The buyer didn\'t leave a message. Maybe they are shy?'}"
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                            {activeTab === 'orders' && showTabs && (
                                <motion.div
                                    key="orders"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="flex-1 min-h-0 flex flex-col space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">Purchase History</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="relative group">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="Search orders..."
                                                    value={orderSearch}
                                                    onChange={(e) => setOrderSearch(e.target.value)}
                                                    className="pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg text-[10px] font-bold outline-none focus:border-blue-500 transition-all w-32"
                                                />
                                            </div>
                                            <select
                                                value={orderStatusFilter}
                                                onChange={(e) => setOrderStatusFilter(e.target.value)}
                                                className="px-2 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-lg text-[10px] font-bold outline-none focus:border-blue-500 transition-all"
                                            >
                                                <option value="all">All status</option>
                                                <option value="negotiating">Negotiating</option>
                                                <option value="accepted">Accepted</option>
                                                <option value="rejected">Rejected</option>
                                                <option value="sold">Purchased</option>
                                            </select>
                                        </div>
                                    </div>
                                    {loadingData ? (
                                        <div className="flex-1 overflow-hidden">
                                            <LeadsShimmer />
                                        </div>
                                    ) : filteredOrders.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                                            <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm font-medium">No orders found.</p>
                                        </div>
                                    ) : (
                                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                            <div className="grid grid-cols-1 gap-4 pb-4">
                                                {filteredOrders.map((order) => (
                                                    <div key={order._id} className="p-5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl space-y-4 transition-all hover:border-blue-500/30 group shadow-sm hover:shadow-md">
                                                        <div className="flex flex-wrap justify-between items-start gap-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase shadow-lg bg-indigo-600`}>
                                                                    {order.seller?.fullName?.charAt(0) || '?'}
                                                                </div>
                                                                <div>
                                                                    <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Seller</div>
                                                                    <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight">{order.seller?.fullName}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-2">
                                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${order.salesStatus === 'sold' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                                    order.status === 'accepted' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                                        order.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                            order.status === 'negotiating' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                                                                'bg-gray-100 dark:bg-zinc-800 text-gray-500 border-transparent'
                                                                    }`}>
                                                                    {order.salesStatus === 'sold' ? 'Status: Purchased' : `Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`}
                                                                </span>
                                                                <div className="flex items-center gap-1 text-gray-400 text-[10px] font-mono">
                                                                    <Clock className="w-3 h-3" />
                                                                    {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-white/5">
                                                                <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-zinc-700 overflow-hidden flex-shrink-0 shadow-sm">
                                                                    {order.asset?.images?.[0] && <img src={order.asset.images[0]} className="w-full h-full object-cover" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none mb-1">Purchased Asset</div>
                                                                    <div className="text-xs font-bold text-gray-900 dark:text-white truncate uppercase">
                                                                        {order.asset?.title}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-2">
                                                                <div className="p-3 bg-blue-50/50 dark:bg-blue-500/5 rounded-xl border border-blue-100/50 dark:border-blue-500/10">
                                                                    <div className="text-[9px] text-blue-500 uppercase font-black tracking-widest leading-none mb-1">
                                                                        {order.salesStatus === 'sold' ? 'Sold Price' : 'Listing Price'}
                                                                    </div>
                                                                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                                                                        ₹{(order.salesStatus === 'sold' ? order.soldPrice : order.asset?.price)?.toLocaleString()}
                                                                        <span className="text-[10px] text-gray-400"> ×{order.salesStatus === 'sold' ? (order.soldQuantity || order.quantity) : order.quantity}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="p-3 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-xl border border-emerald-100/50 dark:border-emerald-500/10">
                                                                    <div className="text-[9px] text-emerald-500 uppercase font-black tracking-widest leading-none mb-1">Total Paid</div>
                                                                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                                                                        ₹{(order.salesStatus === 'sold'
                                                                            ? (order.soldTotalAmount || ((order.soldPrice || 0) * (order.soldQuantity || order.quantity || 1)))
                                                                            : ((order.asset?.price || 0) * (order.quantity || 1))).toLocaleString()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <AnimatePresence>
                    {assetToToggle && (
                        <ConfirmationModal
                            isOpen={!!assetToToggle}
                            onClose={() => setAssetToToggle(null)}
                            title={`${assetToToggle.status === 'active' ? 'Deactivate' : 'Activate'} Listing?`}
                            message={`Are you sure you want to ${assetToToggle.status === 'active' ? 'deactivate' : 'activate'} "${assetToToggle.title}"? This will affect its visibility on the platform.`}
                            confirmText={assetToToggle.status === 'active' ? 'Deactivate' : 'Activate'}
                            onConfirm={confirmToggleStatus}
                            isDestructive={assetToToggle.status === 'active'}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default UserModal;
