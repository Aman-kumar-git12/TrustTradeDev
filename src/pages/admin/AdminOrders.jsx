import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpRight, Clock, CheckCircle2, AlertCircle, X, User, Mail, Phone, MessageSquare, Receipt, ExternalLink, Shield, ShoppingCart, Calendar, Award, Info, ShieldCheck, Layers, BadgeCheck, UserCheck, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const OrderDetailsSkeleton = () => (
    <div className="animate-pulse w-full">
        {/* Header Skeleton */}
        <div className="h-40 bg-gray-200 dark:bg-white/5 w-full relative">
            <div className="absolute bottom-6 left-8 flex items-end gap-6">
                <div className="w-20 h-20 bg-gray-300 dark:bg-white/10 rounded-2xl" />
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <div className="h-5 w-24 bg-gray-300 dark:bg-white/10 rounded-full" />
                        <div className="h-5 w-32 bg-gray-300 dark:bg-white/10 rounded-full" />
                    </div>
                    <div className="h-8 w-64 bg-gray-300 dark:bg-white/10 rounded-lg" />
                </div>
            </div>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column Skeletons */}
            <div className="lg:col-span-2 space-y-8">
                {/* Party Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map((i) => (
                        <div key={i} className="space-y-4">
                            <div className="h-4 w-32 bg-gray-200 dark:bg-white/5 rounded-full" />
                            <div className="bg-white dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/5 h-64">
                                <div className="flex gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-white/10" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-white/10 rounded" />
                                        <div className="h-4 w-1/2 bg-gray-200 dark:bg-white/10 rounded" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-10 w-full bg-gray-200 dark:bg-white/10 rounded-2xl" />
                                    <div className="h-10 w-full bg-gray-200 dark:bg-white/10 rounded-2xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Intel Skeleton */}
                <div className="h-48 bg-gray-100 dark:bg-white/5 rounded-3xl" />
            </div>

            {/* Right Column Skeleton */}
            <div className="space-y-6">
                <div className="h-4 w-32 bg-gray-200 dark:bg-white/10 rounded-full" />
                <div className="bg-zinc-900 dark:bg-zinc-950 rounded-[40px] p-8 h-96 border border-white/5 relative overflow-hidden">
                    <div className="space-y-8">
                        <div className="flex justify-between">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl" />
                            <div className="w-24 h-10 bg-white/10 rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-white/10 rounded" />
                            <div className="h-12 w-48 bg-white/10 rounded" />
                        </div>
                        <div className="space-y-4 pt-8 border-t border-white/5">
                            {[1, 2, 3].map(i => <div key={i} className="h-6 w-full bg-white/10 rounded" />)}
                        </div>
                    </div>
                </div>
                <div className="h-32 bg-gray-100 dark:bg-white/5 rounded-3xl" />
            </div>
        </div>
    </div>
);

const PartyCard = ({ title, party, role, statusLabel, icon: Icon, colorClass, dateLabel, date }) => {
    if (!party) return null;

    return (
        <div className="space-y-4">
            <div className={`flex items-center gap-2 ${colorClass} font-bold uppercase tracking-widest text-[10px]`}>
                <Icon className="w-3.5 h-3.5" /> {title}
            </div>
            {/* Added min-h-[320px] to increase height as requested */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-[#0F172A] dark:to-[#0F172A] rounded-3xl p-6 border border-gray-100 dark:border-white/5 relative overflow-hidden group min-h-[320px] flex flex-col justify-between">
                <div className={`absolute top-0 right-0 w-24 h-24 ${colorClass} opacity-5 -mr-8 -mt-8 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />

                <div className="flex items-start gap-4 relative z-10">
                    <div className="relative">
                        {party.avatarUrl ? (
                            <img src={party.avatarUrl} alt={party.fullName} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/10" />
                        ) : (
                            <div className={`w-14 h-14 rounded-2xl ${colorClass.replace('text-', 'bg-')}/20 flex items-center justify-center`}>
                                <User className={`w-6 h-6 ${colorClass}`} />
                            </div>
                        )}
                        {party.masteryBadges > 0 && (
                            <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-lg shadow-lg">
                                <Award className="w-3 h-3" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{party.fullName}</h3>
                            <Link to={`/user/${party._id}`} className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-all">
                                <ExternalLink className={`w-4 h-4 ${colorClass}`} />
                            </Link>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                            <span className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded uppercase font-bold text-[9px] tracking-wider">{role}</span>
                            {date && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> {dateLabel} {new Date(date).toLocaleString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 mt-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-100 dark:border-white/5">
                        <Mail className="w-4 h-4 opacity-50" /> {party.email}
                    </div>
                    {party.phone && (
                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-100 dark:border-white/5">
                            <Phone className="w-4 h-4 opacity-50" /> {party.phone}
                        </div>
                    )}
                </div>

                <div className="mt-5 pt-5 border-t border-gray-100 dark:border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Status</span>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${colorClass.replace('text-', 'bg-')}/10 ${colorClass} border ${colorClass.replace('text-', 'border-')}/20`}>
                            <BadgeCheck className="w-3.5 h-3.5" /> {statusLabel}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getPartyStatus = (globalStatus, role) => {
    const statusMap = {
        'sold': { buyer: 'Payment Secured', seller: 'Sale Closed' },
        'completed': { buyer: 'Fully Managed', seller: 'Revenue Earned' },
        'unsold': { buyer: 'In Negotiation', seller: 'Listed' },
        'refunded': { buyer: 'Funds Returned', seller: 'Inventory Reclaimed' },
        'disputed': { buyer: 'Escalated Trace', seller: 'Verification Lock' },
    };
    return (statusMap[globalStatus] || { buyer: 'Active', seller: 'Active' })[role];
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });


    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedLoading, setSelectedLoading] = useState(false);

    // URL Params for Deep Linking
    const { orderId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (orderId) {
            fetchOrderDetail(orderId);
        } else {
            setSelectedOrder(null);
        }
    }, [orderId]);

    useEffect(() => {
        fetchOrders();
    }, [filters.status, filters.sortBy, filters.sortOrder]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/sales', {
                params: {
                    status: filters.status,
                    sortBy: filters.sortBy,
                    sortOrder: filters.sortOrder
                }
            });
            setOrders(data);
        } catch (error) {
            console.error("Failed to fetch admin sales", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderDetail = async (orderId) => {
        setSelectedLoading(true);
        try {
            const { data } = await api.get(`/admin/sales/${orderId}`);
            setSelectedOrder(data);
        } catch (error) {
            console.error("Failed to fetch order detail", error);
        } finally {
            setSelectedLoading(false);
        }
    };



    const handleExportLedger = () => {
        if (!selectedOrder) return;

        const doc = new jsPDF();

        // Header Background
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 0, 210, 40, 'F');

        // Brand Header
        doc.setFontSize(22);
        doc.setTextColor(37, 99, 235); // Blue-600
        doc.setFont(undefined, 'bold');
        doc.text("TRUST TRADE", 20, 25);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.setFont(undefined, 'normal');
        doc.text("Official Transaction Ledger", 20, 32);

        // Meta Info
        doc.setFontSize(9);
        doc.setTextColor(113, 113, 122);
        const dateStr = new Date().toLocaleString();
        doc.text(`Generated: ${dateStr}`, 190, 25, { align: 'right' });
        doc.text(`Ref: ${selectedOrder._id}`, 190, 32, { align: 'right' });

        // Status Badge
        const statusColor = selectedOrder.status === 'sold' ? [16, 185, 129] : [59, 130, 246];
        doc.setFillColor(...statusColor);
        doc.roundedRect(20, 50, 25, 8, 2, 2, 'F');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, 'bold');
        doc.text(selectedOrder.status.toUpperCase(), 32.5, 55, { align: 'center' });

        // Asset Title
        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42); // Slate-900
        doc.text(selectedOrder.asset?.title || "Digital Asset", 20, 70);

        // Two Column Layout
        const leftCol = 20;
        const rightCol = 110;
        const rowStart = 90;

        // Buyer Section
        doc.setFontSize(10);
        doc.setTextColor(37, 99, 235);
        doc.setFont(undefined, 'bold');
        doc.text("ACQUISITION LEAD (BUYER)", leftCol, rowStart);

        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        doc.setFont(undefined, 'normal');
        doc.text(selectedOrder.buyer?.fullName || "Verified User", leftCol, rowStart + 8);
        doc.text(selectedOrder.buyer?.email || "-", leftCol, rowStart + 14);
        doc.text(selectedOrder.buyer?.phone || "-", leftCol, rowStart + 20);

        // Seller Section
        doc.setFontSize(10);
        doc.setTextColor(16, 185, 129);
        doc.setFont(undefined, 'bold');
        doc.text("FULFILLMENT PARTNER (SELLER)", rightCol, rowStart);

        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        doc.setFont(undefined, 'normal');
        doc.text(selectedOrder.seller?.fullName || "Verified Merchant", rightCol, rowStart + 8);
        doc.text(selectedOrder.seller?.email || "-", rightCol, rowStart + 14);
        doc.text(selectedOrder.seller?.phone || "-", rightCol, rowStart + 20);

        // Financial Breakdown Table
        const tableY = 130;

        // Table Header
        doc.setFillColor(241, 245, 249);
        doc.rect(20, tableY, 170, 10, 'F');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        doc.setFont(undefined, 'bold');
        doc.text("DESCRIPTION", 25, tableY + 7);
        doc.text("QUANTITY", 130, tableY + 7, { align: 'right' });
        doc.text("AMOUNT", 185, tableY + 7, { align: 'right' });

        // Item Row
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.setFont(undefined, 'normal');
        doc.text("Unit Base Price", 25, tableY + 20);
        doc.text(`${selectedOrder.quantity}`, 130, tableY + 20, { align: 'right' });
        doc.text(`Rs. ${(selectedOrder.price || 0).toLocaleString()}`, 185, tableY + 20, { align: 'right' });

        // Fees Row (Dummy for style)
        doc.text("Platform & Processing Fees", 25, tableY + 30);
        doc.text("-", 130, tableY + 30, { align: 'right' });
        doc.text("Included", 185, tableY + 30, { align: 'right' });

        // Total Row
        doc.setDrawColor(226, 232, 240);
        doc.line(20, tableY + 40, 190, tableY + 40);

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text("NET SETTLEMENT", 25, tableY + 52);
        doc.text(`Rs. ${(selectedOrder.totalAmount || 0).toLocaleString()}`, 185, tableY + 52, { align: 'right' });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.setFont(undefined, 'normal');
        const bottomY = 270;
        doc.text("Payment ID:", 20, bottomY);
        doc.setFont(undefined, 'mono');
        doc.text(selectedOrder.razorpayPaymentId || "OFFLINE_SETTLEMENT", 60, bottomY);

        doc.setFont(undefined, 'normal');
        doc.text("This document is a computer-generated fiscal record and requires no physical signature.", 105, bottomY + 10, { align: 'center' });

        doc.save(`TrustTrade_Ledger_${selectedOrder._id}.pdf`);
    };

    const statusColors = {
        'sold': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        'completed': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        'refunded': 'bg-orange-500/10 text-orange-500 border-orange-500/20',
        'disputed': 'bg-red-500/10 text-red-500 border-red-500/20',
        'negotiating': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        'accepted': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
        'rejected': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        'unsold': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };

    const filteredOrders = orders.filter(order => {
        const search = filters.search.toLowerCase();
        const assetTitle = (order.asset?.title || '').toLowerCase();
        const sellerName = (order.seller?.fullName || '').toLowerCase();
        const buyerName = (order.buyer?.fullName || '').toLowerCase();

        return assetTitle.includes(search) ||
            sellerName.includes(search) ||
            buyerName.includes(search);
    });

    return (
        <div className="flex-1 h-full p-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-emerald-400 dark:to-teal-500">Order Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Monitor all platform transactions and billing status.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <div className="relative z-10">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by asset, seller, buyer..."
                            className="pl-10 pr-4 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-950 bluish:from-[#24304a] bluish:to-[#131b2e] border border-gray-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all w-64 shadow-lg text-gray-900 dark:text-white"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>
                    <select
                        className="px-4 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-950 bluish:from-[#24304a] bluish:to-[#131b2e] border border-gray-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all shadow-lg relative z-10 text-gray-900 dark:text-white"
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    >
                        <option value="">All Statuses</option>
                        <option value="negotiating">Negotiating</option>
                        <option value="accepted">Accepted</option>
                        <option value="sold">Sold</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <select
                        className="px-4 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-950 bluish:from-[#24304a] bluish:to-[#131b2e] border border-gray-100 dark:border-white/5 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all shadow-lg relative z-10 text-gray-900 dark:text-white"
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                        onChange={(e) => {
                            const [sortBy, sortOrder] = e.target.value.split('-');
                            setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                        }}
                    >
                        <option value="createdAt-desc">Date (Newest)</option>
                        <option value="createdAt-asc">Date (Oldest)</option>
                        <option value="totalAmount-desc">Amount (High-Low)</option>
                        <option value="totalAmount-asc">Amount (Low-High)</option>
                    </select>
                </div>
            </header>

            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] rounded-2xl border border-gray-100 dark:border-white/5 shadow-2xl overflow-hidden relative z-10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-white/5">
                            <tr>
                                <th className="px-6 py-5">Order Detail</th>
                                <th className="px-6 py-5">Seller</th>
                                <th className="px-6 py-5">Buyer</th>
                                <th className="px-6 py-5">Amount</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Date</th>
                                <th className="px-6 py-5">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {loading ? (
                                <tr><td colSpan="7" className="p-10 text-center text-gray-400">Loading orders...</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan="7" className="p-10 text-center text-gray-400">No orders found.</td></tr>
                            ) : filteredOrders.map((order) => (
                                <tr
                                    key={order._id}
                                    className="text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            {order.asset?.images?.[0] ? (
                                                <img
                                                    src={order.asset.images[0]}
                                                    alt={order.asset.title}
                                                    className="w-12 h-12 rounded-xl object-cover border border-gray-100 dark:border-white/10 shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                                                    <Layers className="w-6 h-6" />
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">{order.asset?.title}</div>
                                                <div className="text-xs text-gray-400 font-mono mt-1">ID: {order._id.substring(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="font-medium text-gray-900 dark:text-white transition-colors">{order.seller?.fullName}</div>
                                            <div className="text-xs text-gray-400">{order.seller?.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="font-medium text-gray-900 dark:text-white transition-colors">{order.buyer?.fullName}</div>
                                            <div className="text-xs text-gray-400">{order.buyer?.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-blue-600 dark:text-emerald-400 text-lg">₹{(order.totalAmount || 0).toLocaleString()}</div>
                                        <div className="text-[10px] text-gray-400">Incl. Taxes & Fees</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border text-center ${statusColors[order.status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{new Date(order.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/admin/orders/${order._id}`);
                                            }}
                                            className="p-2 hover:bg-blue-600/10 rounded-lg text-blue-500 transition-all active:scale-95 group-hover:translate-x-1"
                                        >
                                            <ArrowUpRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {(selectedOrder || selectedLoading) && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                navigate('/admin/orders');
                                setSelectedLoading(false);
                            }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ type: "spring", damping: 20, stiffness: 300 }}
                            className="relative w-full max-w-4xl bg-gradient-to-b from-white to-gray-50 dark:from-zinc-900 dark:to-[#0a0a0a] rounded-[40px] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/10 min-h-[400px]"
                        >
                            {selectedLoading ? (
                                <OrderDetailsSkeleton />
                            ) : selectedOrder ? (
                                <>
                                    {/* Modal Header */}
                                    <div className="relative h-40 overflow-hidden">
                                        <Link to={`/assets/${selectedOrder.asset?._id}`}>
                                            {selectedOrder.asset?.images?.[0] ? (
                                                <img
                                                    src={selectedOrder.asset.images[0]}
                                                    className="w-full h-full object-cover opacity-30 hover:opacity-50 transition-opacity"
                                                    alt="Asset"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20" />
                                            )}
                                        </Link>
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                                        <button
                                            onClick={() => navigate('/admin/orders')}
                                            className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all backdrop-blur-md z-10"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                        <div className="absolute bottom-6 left-8 flex items-end gap-6">
                                            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-600/40 border-2 border-white/10">
                                                <ShoppingCart className="w-10 h-10 text-white" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${statusColors[selectedOrder.status]}`}>
                                                        {selectedOrder.status}
                                                    </span>
                                                    <span className="text-gray-400 text-xs font-mono">Invoice #{selectedOrder._id.substring(18, 24).toUpperCase()}</span>
                                                </div>
                                                <Link to={`/assets/${selectedOrder.asset?._id}`} className="hover:opacity-80 transition-all">
                                                    <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">{selectedOrder.asset?.title}</h2>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        {/* Left Columns: Parties Information */}
                                        <div className="lg:col-span-2 space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {/* Buyer Details */}
                                                <PartyCard
                                                    title="Buyer Information"
                                                    party={selectedOrder.buyer}
                                                    role="Platform Buyer"
                                                    statusLabel={getPartyStatus(selectedOrder.status, 'buyer')}
                                                    icon={UserCheck}
                                                    colorClass="text-blue-500"
                                                    dateLabel="ordered"
                                                    date={selectedOrder.createdAt}
                                                />

                                                {/* Seller Details */}
                                                <PartyCard
                                                    title="Seller Information"
                                                    party={selectedOrder.seller}
                                                    role="Elite Seller"
                                                    statusLabel={getPartyStatus(selectedOrder.status, 'seller')}
                                                    icon={ShieldCheck}
                                                    colorClass="text-emerald-500"
                                                    dateLabel="completed"
                                                    date={selectedOrder.dealDate || (selectedOrder.status === 'sold' ? selectedOrder.updatedAt : null)}
                                                />
                                            </div>

                                            {/* Negotiation Details */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-amber-500 font-bold uppercase tracking-widest text-[10px]">
                                                        <MessageSquare className="w-3.5 h-3.5" /> Transaction Intel
                                                    </div>
                                                    {selectedOrder.interest?.createdAt && (
                                                        <div className="text-[9px] text-gray-400 font-mono">INTIATED: {new Date(selectedOrder.interest.createdAt).toLocaleString()}</div>
                                                    )}
                                                </div>
                                                <div className="bg-gradient-to-br from-amber-50 to-white dark:from-[#0F172A] dark:to-[#0F172A] rounded-3xl p-6 border border-amber-500/10 relative overflow-hidden">
                                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                                        <Layers className="w-20 h-20 text-amber-500" />
                                                    </div>
                                                    <div className="relative z-10">
                                                        <div className="flex items-center gap-2 mb-4">
                                                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                                            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Buyer's Terms & Inquiry</span>
                                                        </div>
                                                        <p className="italic text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                                                            &quot;{selectedOrder.interest?.message || "No specific negotiation notes provided. This order was likely a direct purchase based on catalog terms."}&quot;
                                                        </p>
                                                        <div className="mt-4 flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                                            <div className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified Quantity: {selectedOrder.interest?.quantity || selectedOrder.quantity} Units</div>
                                                            <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-500" /> Negotiation Lock: {selectedOrder.interest?.status || "Finalized"}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Financial Summary */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-widest text-[10px]">
                                                <Receipt className="w-3.5 h-3.5" /> Fiscal Ledger
                                            </div>
                                            <div className="bg-zinc-900 dark:bg-zinc-950 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
                                                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 rounded-full -mr-20 -mt-20 blur-3xl opacity-50" />
                                                <div className="relative z-10">
                                                    <div className="flex items-center justify-between mb-8">
                                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
                                                            <Info className="w-6 h-6 text-blue-400" />
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Transaction ID</div>
                                                            <div className="text-xs font-mono text-blue-400">{selectedOrder.razorpayPaymentId ? selectedOrder.razorpayPaymentId.substring(0, 15) : 'OFFLINE'}</div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1 mb-8">
                                                        <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Gross Settlement</div>
                                                        <div className="text-5xl font-bold tracking-tighter">₹{selectedOrder.totalAmount?.toLocaleString()}</div>
                                                    </div>

                                                    <div className="space-y-4 pt-8 border-t border-white/5">
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-500">Rate Per Unit</span>
                                                            <span className="font-bold text-blue-400 font-mono">₹{selectedOrder.price?.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-sm">
                                                            <span className="text-gray-500">Volume</span>
                                                            <span className="font-bold">{selectedOrder.quantity} Units</span>
                                                        </div>
                                                        <div className="flex justify-between items-center text-[10px] pt-4 border-t border-white/5">
                                                            <span className="text-gray-500 font-bold uppercase tracking-tighter">Tax Protocol</span>
                                                            <span className="text-emerald-400 font-bold uppercase tracking-tighter">Compliant</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-3 pt-4">
                                                <div className="p-4 bg-gray-50 dark:bg-white/2 px-6 rounded-3xl border border-gray-100 dark:border-white/5">
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Internal Reference</div>
                                                    <div className="text-xs font-mono text-gray-900 dark:text-white truncate">{selectedOrder._id}</div>
                                                </div>
                                                <button
                                                    onClick={handleExportLedger}
                                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                                                >
                                                    <Download className="w-4 h-4" /> Export Ledger Data PDF
                                                </button>
                                                <button
                                                    onClick={() => navigate('/admin/orders')}
                                                    className="w-full py-4 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 rounded-3xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-gray-100 dark:border-white/5"
                                                >
                                                    <X className="w-4 h-4" /> Close Inspection
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminOrders;
