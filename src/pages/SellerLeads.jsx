import { useEffect, useState, useRef, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox, CheckCircle, Clock, XCircle, TrendingUp, Users, Mail, Phone, ChevronDown, MessageCircle, AlertCircle, CheckSquare, XSquare } from 'lucide-react';
import api from '../utils/api';
import LeadFilter from '../components/LeadFilter';
import LeadsShimmer from '../components/shimmers/LeadsShimmer';
import { useUI } from '../context/UIContext';

// Simple Modal Component for Price Input
const PriceInputModal = ({ isOpen, onClose, onSubmit, title }) => {
    const [price, setPrice] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(price);
        setPrice('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 border border-gray-100 dark:border-zinc-800">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Please enter the final sale price for this asset.</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">$</span>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            autoFocus
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 text-lg font-bold bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200/20 transition-all transform hover:-translate-y-0.5"
                        >
                            Confirm Sale
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, colorClass, trend }) => (
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
        <div>
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white">{value}</h3>
            {trend && (
                <span className={`text-xs font-bold ${trend > 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'} flex items-center mt-1`}>
                    {trend > 0 ? '+' : ''}{trend}%
                    <TrendingUp size={12} className="ml-1" />
                </span>
            )}
        </div>
        <div className={`p-3 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}>
            <Icon size={20} className="text-white" />
        </div>
    </div>
);

// Extracted Component for Expandable Row
const LeadRow = ({ lead, isExpanded, onToggle, onStatusUpdate, onLeadUpdate }) => {
    const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
    const { confirm, showSnackbar } = useUI();
    const rowRef = useRef(null);

    useEffect(() => {
        if (isExpanded && rowRef.current) {
            setTimeout(() => {
                rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 300);
        }
    }, [isExpanded]);

    const handleMarkAsSold = () => {
        if (lead.status !== 'accepted') {
            showSnackbar("First accept the request to mark as Sold", "error");
            return;
        }
        setIsPriceModalOpen(true);
    };

    const handlePriceSubmit = async (priceInput) => {
        setIsPriceModalOpen(false);
        const price = parseFloat(priceInput);

        try {
            const { data: newSale } = await api.post('/sales/sales', {
                price: price,
                status: 'sold',
                interestId: lead._id,
                assetId: lead.asset?._id,
                buyerId: lead.buyer?._id,
                sellerId: lead.seller
            });
            showSnackbar("Marked as Sold successfully!", "success");
            onLeadUpdate({ ...lead, salesStatus: 'sold', saleId: newSale._id });
        } catch (error) {
            console.error("Failed to mark as sold", error);
            showSnackbar("Failed to mark as sold", "error");
        }
    };

    const handleMarkAsUnsold = async () => {
        if (lead.status !== 'rejected' && lead.status !== 'accepted') {
            showSnackbar("Lead must be Accepted or Rejected to mark as Unsold", "error");
            return;
        }

        const confirmed = await confirm({
            title: "Mark as Unsold",
            message: "Are you sure you want to mark this item as Unsold? This will set the price to $0.",
            confirmText: "Mark Unsold",
            isDangerous: true
        });

        if (!confirmed) return;

        try {
            const { data: newSale } = await api.post('/sales/sales', {
                price: 0,
                status: 'unsold',
                interestId: lead._id,
                assetId: lead.asset?._id,
                buyerId: lead.buyer?._id,
                sellerId: lead.seller
            });
            showSnackbar("Marked as Unsold successfully!", "success");
            onLeadUpdate({ ...lead, salesStatus: 'unsold', saleId: newSale._id });
        } catch (error) {
            console.error("Failed to mark as unsold", error);
            showSnackbar("Failed to mark as unsold", "error");
        }
    };

    const handleUnmark = async () => {
        const confirmed = await confirm({
            title: "Unmark Sale Status",
            message: "Are you sure you want to remove this sale status? This will delete the sales record.",
            confirmText: "Unmark",
            isDangerous: true
        });

        if (!confirmed) return;

        try {
            await api.delete(`/sales/${lead.saleId}`);
            showSnackbar("Sale status removed successfully!", "success");
            onLeadUpdate({ ...lead, salesStatus: null, saleId: null });
        } catch (error) {
            console.error("Failed to unmark sale", error);
            showSnackbar("Failed to unmark sale", "error");
        }
    };

    // Conditional Styling
    const rowBaseClasses = `bg-white dark:bg-zinc-900 rounded-xl border transition-all duration-300 overflow-hidden`;
    let rowClasses = rowBaseClasses;
    if (lead.salesStatus === 'sold') {
        rowClasses = `bg-emerald-100/70 dark:bg-emerald-900/20 rounded-xl border border-emerald-400 dark:border-emerald-800 transition-all duration-200 overflow-hidden hover:shadow-md`;
    } else if (lead.salesStatus === 'unsold') {
        rowClasses = `bg-rose-100/70 dark:bg-rose-900/20 rounded-xl border border-rose-400 dark:border-rose-800 transition-all duration-200 overflow-hidden hover:shadow-md`;
    } else {
        rowClasses = `${rowBaseClasses} ${isExpanded ? 'shadow-lg border-emerald-400 ring-1 ring-emerald-100 dark:border-emerald-500 dark:ring-emerald-900' : 'border-gray-200 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-600 hover:shadow-md'}`;
    }

    return (
        <>
            <PriceInputModal
                isOpen={isPriceModalOpen}
                onClose={() => setIsPriceModalOpen(false)}
                onSubmit={handlePriceSubmit}
                title={`Mark "${lead.asset.title}" as Sold`}
            />

            <div className={rowClasses} ref={rowRef}>
                {/* Main Compact Row */}
                <div
                    className="p-4 grid grid-cols-1 md:grid-cols-[1.4fr_1.8fr_1fr_1.2fr_0.4fr] gap-4 md:items-center cursor-pointer group"
                    onClick={onToggle}
                >
                    {/* Asset Info */}
                    <div className="flex items-center min-w-0">
                        <div className={`mr-4 transition-transform duration-300 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white ${isExpanded ? 'rotate-90' : ''}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                        <div className="min-w-0 overflow-hidden">
                            <h4 className="font-extrabold text-base text-gray-950 dark:text-gray-200 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" title={lead.asset.title}>{lead.asset.title}</h4>
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 md:hidden mt-0.5 block">{new Date(lead.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Buyer Info */}
                    <div className="flex items-center space-x-3 overflow-hidden min-w-0">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-zinc-800 dark:to-zinc-700 border border-indigo-200 dark:border-zinc-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 shadow-sm">
                            {lead.buyer?.fullName?.charAt(0) || '?'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-200 truncate">{lead.buyer?.fullName || 'Unknown Buyer'}</p>
                            <p className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 truncate">{lead.buyer?.companyName || 'No Company'}</p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center">
                        <span className={`px-3 py-1 text-[11px] font-extrabold rounded-full border uppercase tracking-wider inline-flex items-center shadow-sm ${lead.status === 'pending' ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800' :
                            lead.status === 'accepted' ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' :
                                lead.status === 'negotiating' ? 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' :
                                    'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800'
                            }`}>
                            {lead.status === 'pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 mr-1.5 animate-pulse"></span>}
                            {lead.status}
                        </span>
                        {lead.salesStatus === 'sold' && <span className="ml-2 px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-emerald-200/70 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-sm tracking-wider">SOLD</span>}
                        {lead.salesStatus === 'unsold' && <span className="ml-2 px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-rose-200/70 dark:bg-rose-900/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700 shadow-sm tracking-wider">UNSOLD</span>}
                    </div>

                    {/* Date (Desktop) */}
                    <div className="hidden md:block text-xs font-semibold text-gray-600 dark:text-gray-400">
                        {new Date(lead.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>

                    {/* Actions */}
                    <div className="relative z-20 flex justify-end items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {(lead.status === 'pending' || lead.status === 'negotiating') ? (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onStatusUpdate(lead._id, 'accepted');
                                    }}
                                    title="Accept"
                                    className="p-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-200 dark:hover:border-emerald-800 rounded-lg transition-all shadow-sm hover:shadow-md group/btn"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:scale-110 transition-transform"><path d="M20 6 9 17l-5-5" /></svg>
                                </button>
                                {lead.salesStatus !== 'sold' && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onStatusUpdate(lead._id, 'rejected');
                                        }}
                                        title="Reject"
                                        className="p-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:border-rose-200 dark:hover:border-rose-800 rounded-lg transition-all shadow-sm hover:shadow-md group/btn"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:scale-110 transition-transform"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className={`text-[10px] font-bold px-3 py-1 rounded-full ${lead.status === 'accepted' ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-200/70 dark:bg-emerald-900/40' : 'text-rose-700 dark:text-rose-300 bg-rose-200/70 dark:bg-rose-900/40'}`}>
                                {lead.status === 'accepted' ? 'ACCEPTED' : 'REJECTED'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            className="bg-gray-50/80 dark:bg-zinc-800/20 border-t border-gray-100 dark:border-zinc-800 overflow-hidden"
                        >
                            <div className="p-6">
                                {/* Full Asset Title */}
                                <div className="mb-6 pb-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
                                    <div>
                                        <span className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mr-2">Asset Interest</span>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mt-1">{lead.asset.title}</h3>
                                    </div>
                                    <div className="flex gap-3">
                                        {!lead.salesStatus && (
                                            <>
                                                {lead.status !== 'rejected' && (
                                                    <button
                                                        onClick={handleMarkAsSold}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-sm shadow-emerald-200/20 transition-all hover:-translate-y-0.5"
                                                    >
                                                        Mark as Sold
                                                    </button>
                                                )}
                                                <button
                                                    onClick={handleMarkAsUnsold}
                                                    className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 text-xs font-bold py-2 px-4 rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
                                                >
                                                    Mark as Unsold
                                                </button>
                                            </>
                                        )}
                                        {lead.salesStatus && (
                                            <div className="flex items-center gap-3 bg-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-700 shadow-sm">
                                                <span className={`text-xs font-bold flex items-center ${lead.salesStatus === 'sold' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                    <span className={`w-2 h-2 rounded-full mr-2 ${lead.salesStatus === 'sold' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                    Marked as {lead.salesStatus.toUpperCase()}
                                                </span>
                                                {lead.salesStatus === 'sold' && (
                                                    <>
                                                        <div className="h-4 w-px bg-gray-200 dark:bg-zinc-600 mx-1"></div>
                                                        <button
                                                            onClick={handleUnmark}
                                                            className="text-[10px] font-bold text-gray-400 hover:text-rose-500 hover:underline cursor-pointer transition-colors"
                                                            title="Remove sales status"
                                                        >
                                                            Unmark
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Contact Info */}
                                    <div className="text-sm">
                                        <h5 className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Contact Details</h5>
                                        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm h-40 flex flex-col justify-center space-y-4">
                                            <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm group">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-4 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                                                    <Mail size={18} />
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 block font-medium mb-0.5">Email</span>
                                                    <a href={`mailto:${lead.buyer?.email}`} className="font-bold text-base hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline truncate transition-colors">{lead.buyer?.email}</a>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-gray-700 dark:text-gray-300 text-sm group">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-4 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                                                    <Phone size={18} />
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-400 dark:text-gray-500 block font-medium mb-0.5">Phone</span>
                                                    <span className="font-bold text-base">{lead.buyer?.phone || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full Message */}
                                    <div>
                                        <h5 className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Message</h5>
                                        <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed bg-white dark:bg-zinc-800 p-6 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm h-40 overflow-y-auto">
                                            {lead.message || 'No message provided.'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

const SellerLeads = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // Use context from SellerDashboard
    const { isFilterOpen, businessId, showStats } = useOutletContext();
    const { confirm, showSnackbar } = useUI();
    const [filters, setFilters] = useState({});

    const fetchLeads = async (params, showLoader = true) => {
        if (!businessId) return;
        if (showLoader) setLoading(true);
        try {
            // Use passed params or current filters if params is undefined (but careful with stale state in some contexts)
            // Ideally, we explicitly pass params when we know them (e.g., empty on reset), or use current filters on Apply.
            const activeFilters = params || filters;

            const query = new URLSearchParams();
            if (activeFilters.status && activeFilters.status !== 'all') query.append('status', activeFilters.status);
            if (activeFilters.salesStatus && activeFilters.salesStatus !== 'all') query.append('salesStatus', activeFilters.salesStatus);
            if (activeFilters.search) query.append('search', activeFilters.search);

            const { data } = await api.get(`/dashboard/business/${businessId}/leads?${query.toString()}`);
            // Sort by Date Descending
            const sortedLeads = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setLeads(sortedLeads);
        } catch (error) {
            console.error("Failed to fetch leads", error);
            showSnackbar("Failed to fetch leads", "error");
        } finally {
            if (showLoader) setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        // Reset filters on business change or initial load
        setFilters({});
        fetchLeads({});
    }, [businessId]);

    // Reset when filter panel closes
    useEffect(() => {
        if (!isFilterOpen) {
            setFilters({});
            fetchLeads({}, false);
        }
    }, [isFilterOpen]);

    const [expandedLeadId, setExpandedLeadId] = useState(null);

    const handleExpandTemplate = (id) => {
        setExpandedLeadId(prevId => prevId === id ? null : id);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            const { data: updatedLead } = await api.put(`/interests/${id}/status`, { status: newStatus });
            setLeads(prev => prev.map(l => l._id === id ? updatedLead : l));
            showSnackbar(`Lead marked as ${newStatus}`, "success");
        } catch (error) {
            console.error("Failed to update status", error);
            showSnackbar("Failed to update lead status", "error");
        }
    };

    const handleLeadUpdate = (updatedLead) => {
        setLeads(prev => prev.map(l => l._id === updatedLead._id ? updatedLead : l));
    };

    // Calculate Stats
    const stats = useMemo(() => {
        const total = leads.length;
        const pending = leads.filter(l => l.status === 'pending').length;
        const accepted = leads.filter(l => l.status === 'accepted').length;
        const conversionRate = total > 0 ? ((accepted / total) * 100).toFixed(1) : 0;
        return { total, pending, accepted, conversionRate };
    }, [leads]);

    // Only show full shimmer if we have no data and are loading (Initial load)
    if (loading && leads.length === 0) return <LeadsShimmer />;

    return (
        <div className="flex gap-8 items-start relative pb-20">
            {/* Main Content Area */}
            <div className="flex-1 min-w-0 transition-all duration-300 relative">

                {/* Refetch Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/50 z-50 rounded-2xl flex items-start justify-center pt-48 backdrop-blur-[1px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                    </div>
                )}

                {/* Hero Stats Section (Collapsible) */}
                <AnimatePresence>
                    {showStats && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginBottom: 32 }}
                            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
                            className="overflow-hidden"
                            style={{ overflow: 'hidden' }} // Ensure inner content doesn't spill during anim
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-1">
                                <StatCard
                                    title="Total Leads"
                                    value={stats.total}
                                    icon={Users}
                                    colorClass="bg-blue-500"
                                    trend={12} // hardcoded for now or calc real trend
                                />
                                <StatCard
                                    title="Pending"
                                    value={stats.pending}
                                    icon={Clock}
                                    colorClass="bg-amber-500"
                                />
                                <StatCard
                                    title="Sold/Closed"
                                    value={stats.accepted}
                                    icon={CheckCircle}
                                    colorClass="bg-emerald-500"
                                />
                                <StatCard
                                    title="Conversion"
                                    value={`${stats.conversionRate}%`}
                                    icon={TrendingUp}
                                    colorClass="bg-violet-500"
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Headers */}
                <div className="hidden md:grid grid-cols-[1.4fr_1.8fr_1fr_1.2fr_0.4fr] gap-4 px-4 pb-3 text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider pl-6">
                    <div>Assets</div>
                    <div>Buyer Name</div>
                    <div>Status</div>
                    <div>Date</div>
                    <div className="text-right pr-2">Action</div>
                </div>

                {/* Leads List */}
                <div className="space-y-4">
                    {leads.length === 0 ? (
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-gray-600">
                                <Inbox size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No leads found</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or check back later.</p>
                        </div>
                    ) : (
                        leads.map(lead => (
                            <LeadRow
                                key={lead._id}
                                lead={lead}
                                isExpanded={expandedLeadId === lead._id}
                                onToggle={() => handleExpandTemplate(lead._id)}
                                onStatusUpdate={handleStatusUpdate}
                                onLeadUpdate={handleLeadUpdate}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Right Side Filter Panel */}
            {isFilterOpen && (
                <div className="w-80 flex-shrink-0 transition-all duration-300 ease-in-out block h-[calc(100vh-8rem)] sticky top-24">
                    <LeadFilter
                        filters={filters}
                        setFilters={setFilters}
                        onClose={() => setIsFilterOpen(false)}
                        onApply={() => fetchLeads(filters)}
                        onClear={() => fetchLeads({})}
                    />
                </div>
            )}
        </div>
    );
};

export default SellerLeads;
