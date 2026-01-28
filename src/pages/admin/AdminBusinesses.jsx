import React, { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard,
    Search,
    Building2,
    User,
    Mail,
    Calendar,
    ArrowUpRight,
    MapPin,
    Globe,
    Phone,
    ShieldCheck,
    AlertCircle,
    Store,
    CheckCircle,
    XCircle,
    ChevronDown,
    ArrowUpDown,
    MoreHorizontal,
    X,
    Clock,
    Loader2,
    Info,
    Package,
    ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import AdminUsersShimmer from '../../components/shimmers/AdminUsersShimmer';
import UserModal from '../../components/admin/UserModal';

const CustomDropdown = ({ options, value, onChange, icon: Icon, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find(opt => opt.value === value)?.label || label;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-950 bluish:from-[#24304a] bluish:to-[#131b2e] border border-gray-100 dark:border-white/5 rounded-xl text-sm font-medium transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 min-w-[160px] justify-between text-gray-700 dark:text-gray-200"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                    <span>{selectedLabel}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full mt-2 left-0 w-full min-w-[200px] z-50 origin-top-left"
                    >
                        <div className="bg-gradient-to-b from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 bluish:from-[#1a243a] bluish:to-[#141b2d] border border-gray-100 dark:border-white/5 rounded-xl shadow-2xl p-1 overflow-hidden">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${value === opt.value
                                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {opt.label}
                                    {value === opt.value && <CheckCircle className="w-3.5 h-3.5" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const BusinessModal = ({ business, onClose }) => {
    const [activeTab, setActiveTab] = useState('info');
    const [products, setProducts] = useState([]);
    const [fullBusiness, setFullBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewingOwner, setViewingOwner] = useState(null);

    useEffect(() => {
        if (business) {
            fetchDetails();
        }
    }, [business]);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const [detailsRes, productsRes] = await Promise.all([
                api.get(`/admin/businesses/${business._id}`),
                api.get(`/admin/businesses/${business._id}/products`)
            ]);
            setFullBusiness(detailsRes.data);
            setProducts(productsRes.data);
        } catch (error) {
            console.error('Error fetching business details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!business) return null;

    const data = fullBusiness || business;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-4xl h-[700px] bg-white dark:bg-[#0f0f11] bluish:bg-[#0d121f] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 dark:border-white/5 flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md z-30"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="absolute -bottom-10 left-10 flex items-end gap-6 z-20">
                        <div className="w-24 h-24 rounded-3xl bg-white dark:bg-zinc-900 bluish:bg-[#1a243a] p-1 shadow-2xl flex items-center justify-center">
                            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-3xl">
                                {data.businessName?.charAt(0)}
                            </div>
                        </div>
                        <div className="mb-2">
                            <h2 className="text-3xl font-black text-white drop-shadow-lg tracking-tighter uppercase">{data.businessName}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                                    {data.industry || 'General'}
                                </span>
                                {data.isVerified && <ShieldCheck className="w-4 h-4 text-blue-300" />}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="absolute bottom-0 right-10 flex gap-1 p-1 bg-black/20 backdrop-blur-md rounded-t-2xl z-20">
                        {['info', 'products'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab
                                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-lg'
                                    : 'text-white/60 hover:text-white'
                                    }`}
                            >
                                {tab === 'info' ? 'The Specs' : 'The Inventory'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-hidden pt-14 p-10">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full flex flex-col items-center justify-center space-y-4"
                            >
                                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Hydrating data...</p>
                            </motion.div>
                        ) : activeTab === 'info' ? (
                            <motion.div
                                key="info"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="h-full overflow-y-auto pr-4 custom-scrollbar space-y-8"
                            >
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <User className="w-3.5 h-3.5" /> Owner Identity
                                            </h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</p>
                                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{data.owner?.fullName}</p>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div>
                                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</p>
                                                        <p className="text-sm font-medium text-blue-500">{data.owner?.email}</p>
                                                    </div>
                                                    {data.owner?.phone && (
                                                        <div>
                                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{data.owner?.phone}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/5">
                                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <MapPin className="w-3.5 h-3.5" /> Location
                                            </h3>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white leading-relaxed">
                                                {data.location?.place}, {data.location?.city}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-6 bg-blue-50 dark:bg-blue-500/5 rounded-3xl border border-blue-100 dark:border-blue-500/10 h-full">
                                            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <Info className="w-3.5 h-3.5" /> Description
                                            </h3>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed italic">
                                                "{data.description}"
                                            </p>
                                            <div className="mt-8 pt-6 border-t border-blue-100 dark:border-blue-500/10 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Onboarded Since</p>
                                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{new Date(data.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Inventory</p>
                                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{products.length} Products</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="products"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="h-full flex flex-col"
                            >
                                {products.length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                                        <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center">
                                            <Package className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tighter">Ghost Inventory</p>
                                            <p className="text-xs font-medium text-gray-500">This business is basically empty right now.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                                        <div className="grid grid-cols-2 gap-4">
                                            {products.map((product, idx) => (
                                                <motion.div
                                                    key={product._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 group hover:border-blue-500/30 transition-all cursor-pointer"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 rounded-xl bg-gray-200 dark:bg-zinc-800 overflow-hidden relative">
                                                            {product.images?.[0] ? (
                                                                <img src={product.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <Package className="w-6 h-6 text-gray-400" />
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/20 transition-colors"></div>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between">
                                                                <h4 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-500 transition-colors">{product.title}</h4>
                                                                <span className="text-[10px] font-black text-blue-500 font-mono">₹{product.price.toLocaleString()}</span>
                                                            </div>
                                                            <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">{product.category} • {product.condition}</p>
                                                            <div className="flex items-center justify-between mt-2">
                                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${product.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                                                    {product.status}
                                                                </span>
                                                                <span className="text-[9px] text-gray-500 font-bold flex items-center gap-1">
                                                                    <Package className="w-2.5 h-2.5" /> {product.quantity} Stock
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

const AdminBusinesses = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        newToday: 0,
        verifyPending: 0
    });

    const [filters, setFilters] = useState({
        industry: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'success' });
    const [selectedBusiness, setSelectedBusiness] = useState(null);

    const showSnackbar = (message, type = 'success') => {
        setSnackbar({ show: true, message, type });
        setTimeout(() => setSnackbar(prev => ({ ...prev, show: false })), 3000);
    };

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/businesses');
            setBusinesses(data);

            const today = new Date().setHours(0, 0, 0, 0);
            const newToday = data.filter(b => new Date(b.createdAt).getTime() >= today).length;

            setStats({
                total: data.length,
                newToday: newToday,
                verifyPending: 0
            });
        } catch (error) {
            console.error('Error fetching businesses:', error);
            showSnackbar("Failed to load businesses", "error");
        } finally {
            setLoading(false);
        }
    };

    const filteredBusinesses = businesses
        .filter(b => {
            const matchesSearch =
                b.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.owner?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.industry?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesIndustry = filters.industry === '' || b.industry === filters.industry;

            return matchesSearch && matchesIndustry;
        })
        .sort((a, b) => {
            const { sortBy, sortOrder } = filters;
            let comparison = 0;

            if (sortBy === 'createdAt') {
                comparison = new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortBy === 'businessName') {
                comparison = a.businessName.localeCompare(b.businessName);
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });

    const industries = ['All Industries', ...new Set(businesses.map(b => b.industry).filter(Boolean))];

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 bluish:bg-[#1a243a] p-6 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group"
        >
            <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${color} bg-opacity-10 transition-transform group-hover:scale-110`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="flex-1 h-full p-8 font-sans">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-gray-400 uppercase tracking-tighter">Enterprise Registry</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage and monitor all business entities on the platform</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative z-20 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find business..."
                            className="pl-11 pr-4 py-2.5 bg-gradient-to-r from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-950 bluish:from-[#24304a] bluish:to-[#131b2e] border border-gray-100 dark:border-white/5 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all w-64 shadow-sm hover:shadow-md"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <CustomDropdown
                        label="All Industries"
                        icon={Building2}
                        value={filters.industry}
                        onChange={(val) => setFilters(prev => ({ ...prev, industry: val }))}
                        options={industries.map(ind => ({ label: ind, value: ind === 'All Industries' ? '' : ind }))}
                    />

                    <CustomDropdown
                        label="Sort By"
                        icon={ArrowUpDown}
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                        onChange={(val) => {
                            const [sortBy, sortOrder] = val.split('-');
                            setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                        }}
                        options={[
                            { label: 'Newest First', value: 'createdAt-desc' },
                            { label: 'Oldest First', value: 'createdAt-asc' },
                            { label: 'Name (A-Z)', value: 'businessName-asc' },
                            { label: 'Name (Z-A)', value: 'businessName-desc' },
                        ]}
                    />
                </div>
            </header>



            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] rounded-[32px] border border-white/20 dark:border-white/5 shadow-xl overflow-hidden relative z-10">
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                            <tr>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Business Detail</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Ownership</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Industry</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-0">
                                        <AdminUsersShimmer />
                                    </td>
                                </tr>
                            ) : filteredBusinesses.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-16 text-center">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                            <Search className="w-6 h-6" />
                                        </div>
                                        <p className="text-gray-400 font-medium">No businesses match your criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredBusinesses.map((business, idx) => (
                                    <motion.tr
                                        key={business._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="group hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-colors cursor-pointer"
                                        onClick={() => setSelectedBusiness(business)}
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/10 transition-transform group-hover:scale-105">
                                                    {business.businessName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                                        {business.businessName}
                                                        {business.isVerified && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-mono mt-0.5 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(business.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                    <User className="w-3.5 h-3.5 opacity-50" />
                                                    <span className="text-xs font-medium">{business.owner?.fullName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                                                    <Mail className="w-3.5 h-3.5 opacity-50" />
                                                    {business.owner?.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-center">
                                            <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
                                                {business.industry || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase tracking-wider">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-white/5 rounded-lg transition-colors group/btn">
                                                <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Business Details Modal */}
            <AnimatePresence>
                {selectedBusiness && (
                    <BusinessModal
                        business={selectedBusiness}
                        onClose={() => setSelectedBusiness(null)}
                    />
                )}
            </AnimatePresence>

            {/* Snackbar Notification */}
            <AnimatePresence>
                {snackbar.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${snackbar.type === 'success'
                            ? 'bg-emerald-500/90 text-white border-emerald-400/50'
                            : 'bg-red-500/90 text-white border-red-400/50'
                            }`}
                    >
                        {snackbar.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        <span className="text-sm font-bold uppercase tracking-wider">{snackbar.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminBusinesses;
