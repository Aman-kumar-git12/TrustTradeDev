import { useEffect, useState, useRef, useMemo } from 'react';
import { useOutletContext, useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox, CheckCircle, Clock, XCircle, TrendingUp, Users, Mail, Phone, ChevronDown, MessageCircle, AlertCircle, CheckSquare, XSquare, ShoppingBag } from 'lucide-react';
import api from '../utils/api';
import LeadFilter from '../components/LeadFilter';
import LeadsShimmer from '../components/shimmers/LeadsShimmer';
import { useUI } from '../context/UIContext';

const PriceInputModal = ({ isOpen, onClose, onSubmit, title, maxQuantity, requestedQuantity, originalPrice }) => {
    const [totalPrice, setTotalPrice] = useState('');
    const [quantity, setQuantity] = useState(maxQuantity || 1);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Calculate unit price from total
        const unitPrice = parseFloat(totalPrice) / quantity;
        onSubmit(unitPrice, quantity);
        setTotalPrice('');
        setQuantity(maxQuantity || 1);
    };

    const effectiveUnitPrice = totalPrice && quantity ? (parseFloat(totalPrice) / quantity) : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-zinc-900 bluish:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-2xl p-6 transform transition-all scale-100 border border-gray-100 dark:border-zinc-800 bluish:border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none bluish:block hidden"></div>

                {/* Left Column: Inputs */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white bluish:text-white mb-2">{title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 bluish:text-gray-400 text-sm mb-6">Please enter the total sale amount for this deal.</p>

                    <form onSubmit={handleSubmit} id="sale-form">
                        <div className="mb-6 relative">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Sale Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    autoFocus
                                    value={totalPrice}
                                    onChange={(e) => setTotalPrice(e.target.value)}
                                    className="w-full pl-8 pr-4 py-3 text-lg font-bold bg-white dark:bg-zinc-800 bluish:bg-[#0f172a] border border-gray-200 dark:border-zinc-700 bluish:border-white/10 text-gray-900 dark:text-white bluish:text-white rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-emerald-500/20 bluish:focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-emerald-500 bluish:focus:border-blue-500 outline-none transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Quantity Sold</label>
                            <div className="flex items-center space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-300 bluish:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 bluish:hover:bg-white/10 transition-colors font-bold"
                                >
                                    -
                                </button>
                                <span className="text-xl font-bold dark:text-white bluish:text-white w-8 text-center">{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.min(maxQuantity || 999, quantity + 1))}
                                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-300 bluish:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 bluish:hover:bg-white/10 transition-colors font-bold"
                                >
                                    +
                                </button>
                                {maxQuantity && (
                                    <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium">(Max: {maxQuantity})</span>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Column: Bills */}
                <div className="space-y-4">
                    {/* Actual Bill (Buyer Request) */}
                    <div className="bg-white dark:bg-zinc-800/30 bluish:bg-[#0f172a]/50 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-800 bluish:border-indigo-500/30 overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                        <div className="px-4 py-3 bg-indigo-50 dark:bg-indigo-900/10 bluish:bg-indigo-500/10 border-b border-dashed border-indigo-100 dark:border-indigo-800 bluish:border-indigo-500/20 flex justify-between items-center">
                            <span className="text-xs font-black text-indigo-800 dark:text-indigo-300 uppercase tracking-widest">Actual Bill (Request)</span>
                            <span className="text-xs font-bold text-indigo-400">Orig. Order</span>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Quantity</span>
                                <span className="font-bold text-gray-900 dark:text-white bluish:text-white">{requestedQuantity}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Total Price</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">₹{(originalPrice * requestedQuantity)?.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-indigo-100 dark:bg-indigo-900/30 border-t border-dashed my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Unit Price</span>
                                <span className="text-xs font-medium text-gray-500">₹{originalPrice?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Preview Sale (Your Offer) */}
                    <div className="bg-gray-50 dark:bg-zinc-800/50 bluish:bg-[#0f172a] rounded-xl border border-dashed border-blue-300 dark:border-blue-700/50 bluish:border-blue-500/30 overflow-hidden shadow-sm">
                        <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/10 bluish:bg-blue-500/10 border-b border-dashed border-blue-100 dark:border-blue-800/50 bluish:border-blue-500/20 flex justify-between items-center">
                            <span className="text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-widest">Preview Sale</span>
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Final Deal</span>
                        </div>
                        <div className="p-5 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Quantity</span>
                                <span className="font-bold text-gray-900 dark:text-white bluish:text-white">{quantity}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Unit Price</span>
                                <span className="text-xs font-medium text-gray-500">₹{originalPrice?.toLocaleString()}</span>
                            </div>
                            <div className="h-px bg-indigo-100 dark:bg-indigo-900/30 border-t border-dashed my-2"></div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Total Price</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400 text-2xl">₹{totalPrice ? parseFloat(totalPrice).toLocaleString() : '0.00'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-400 bluish:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 bluish:hover:bg-white/5 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="sale-form"
                            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 dark:bg-emerald-600 bluish:bg-blue-600 hover:bg-blue-700 dark:hover:bg-emerald-700 bluish:hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-200/20 dark:shadow-emerald-500/20 bluish:shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                        >
                            Confirm Sale
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

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

    const handlePriceSubmit = async (priceInput, quantityInput) => {
        setIsPriceModalOpen(false);
        const price = parseFloat(priceInput);
        const quantity = parseInt(quantityInput);

        try {
            const payload = {
                price: price,
                quantity: quantity,
                status: 'sold',
                interestId: lead._id,
                assetId: lead.asset?._id,
                buyerId: lead.buyer?._id,
                sellerId: lead.seller
            };

            // Using /sales because we will change backend route to '/'
            const { data: newSale } = await api.post('/sales', payload);
            showSnackbar("Marked as Sold successfully!", "success");
            onLeadUpdate({
                ...lead,
                salesStatus: 'sold',
                isManuallyMarkedSold: true,
                saleId: newSale._id,
                soldQuantity: quantity,
                soldPrice: price,
                soldTotalAmount: price * quantity
            });
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
            message: "Are you sure you want to mark this item as Unsold? This will set the price to ₹0.",
            confirmText: "Mark Unsold",
            isDangerous: true
        });

        if (!confirmed) return;

        try {
            const { data: newSale } = await api.post('/sales', {
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
    const rowBaseClasses = `bg-white dark:bg-zinc-900 bluish:bg-gradient-to-r bluish:from-[#1e293b] bluish:to-[#0f172a] rounded-xl border transition-all duration-300 overflow-hidden relative z-10`;
    let rowClasses = rowBaseClasses;
    if (lead.salesStatus === 'sold' && lead.isManuallyMarkedSold) {
        rowClasses = `bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-all duration-200 overflow-hidden hover:shadow-md`;
    } else if (lead.salesStatus === 'unsold') {
        rowClasses = `bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-200 dark:border-rose-800 transition-all duration-200 overflow-hidden hover:shadow-md`;
    } else {
        rowClasses = `${rowBaseClasses} ${isExpanded ? 'shadow-lg border-blue-400 ring-1 ring-blue-100 dark:border-emerald-500 dark:ring-emerald-900 bluish:border-blue-500/50 bluish:ring-blue-500/20' : 'border-gray-200 dark:border-zinc-800 bluish:border-white/5 hover:border-gray-400 dark:hover:border-zinc-600 bluish:hover:border-blue-500/30 hover:shadow-md'}`;
    }

    return (
        <>
            <PriceInputModal
                isOpen={isPriceModalOpen}
                onClose={() => setIsPriceModalOpen(false)}
                onSubmit={handlePriceSubmit}
                title={`Mark "${lead.asset.title}" as Sold`}
                maxQuantity={lead.quantity}
                requestedQuantity={lead.quantity}
                originalPrice={lead.asset.price}
            />

            <div className={rowClasses} ref={rowRef}>
                {/* Main Compact Row */}
                <div
                    className="p-4 grid grid-cols-1 md:grid-cols-[1.4fr_1.8fr_1fr_1.2fr_0.4fr] gap-4 md:items-center cursor-pointer group"
                    onClick={onToggle}
                >
                    {/* Asset Info */}
                    <div className="flex items-center min-w-0">
                        <div className={`mr-4 transition-transform duration-300 text-gray-500 dark:text-gray-400 bluish:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white bluish:group-hover:text-white ${isExpanded ? 'rotate-90' : ''}`}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </div>
                        <div className="min-w-0 overflow-hidden">
                            <h4 className="font-extrabold text-base text-gray-950 dark:text-gray-200 bluish:text-white truncate group-hover:text-blue-600 dark:group-hover:text-emerald-400 bluish:group-hover:text-blue-400 transition-colors" title={lead.asset.title}>{lead.asset.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bluish:text-gray-500 md:hidden">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                <span className="hidden md:inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 text-gray-700 dark:text-gray-300 bluish:text-gray-300 border border-gray-200 dark:border-zinc-700 bluish:border-white/10">
                                    Listed: ₹{lead.asset.price?.toLocaleString() || '0'}/unit
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Buyer Info */}
                    {/* Buyer Info */}
                    <div className="flex items-center space-x-3 overflow-hidden min-w-0">
                        <Link
                            to={`/user/${lead.buyer?._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-shrink-0 group/logo"
                        >
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-zinc-800 dark:to-zinc-700 bluish:from-blue-500/20 bluish:to-indigo-500/20 border border-indigo-200 dark:border-zinc-600 bluish:border-white/10 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300 bluish:text-blue-300 shadow-sm transition-transform group-hover/logo:scale-105">
                                {lead.buyer?.fullName?.charAt(0) || '?'}
                            </div>
                        </Link>
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-200 bluish:text-gray-200 truncate">{lead.buyer?.fullName || 'Unknown Buyer'}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                {/* Quantity Badge */}
                                <span className="flex items-center text-[10px] font-extrabold text-gray-600 dark:text-gray-300 bluish:text-gray-400 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 px-2 py-0.5 rounded border border-gray-200 dark:border-zinc-700 bluish:border-white/10" title="Requested Quantity">
                                    <ShoppingBag size={10} className="mr-1.5 text-blue-500 dark:text-emerald-500" />
                                    Qty: {lead.quantity}
                                </span>

                                {/* Estimated Value Badge Removed as per user request */}
                            </div>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center">
                            <span className={`px-3 py-1 text-[11px] font-extrabold rounded-full border uppercase tracking-wider inline-flex items-center shadow-sm ${lead.salesStatus === 'sold' ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' :
                                lead.salesStatus === 'unsold' ? 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800' :
                                    lead.status === 'accepted' ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800' :
                                        lead.status === 'negotiating' ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800' :
                                            'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800'
                                }`}>
                                {lead.salesStatus === 'sold' ? (
                                    <>
                                        <CheckCircle size={12} className="mr-1.5" />
                                        PAID
                                    </>
                                ) : (
                                    <>
                                        {lead.status === 'negotiating' && <span className="w-1.5 h-1.5 rounded-full bg-amber-600 dark:bg-amber-400 mr-1.5 animate-pulse"></span>}
                                        {lead.status === 'accepted' ? 'ACCEPTED' : lead.status.toUpperCase()}
                                    </>
                                )}
                            </span>
                            {lead.salesStatus === 'sold' && lead.isManuallyMarkedSold && <span className="ml-2 px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 shadow-sm tracking-wider">SOLD</span>}
                            {lead.salesStatus === 'unsold' && <span className="ml-2 px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-700 shadow-sm tracking-wider">UNSOLD</span>}
                        </div>
                    </div>

                    {/* Date (Desktop) */}
                    <div className="hidden md:flex flex-col justify-center items-start min-w-0">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 bluish:text-gray-500 mb-1">
                            {new Date(lead.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="relative z-20 flex justify-end items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {lead.status === 'negotiating' && lead.salesStatus !== 'sold' ? (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onStatusUpdate(lead._id, 'accepted'); }}
                                    title="Accept"
                                    className="p-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 rounded-lg transition-all shadow-sm hover:shadow-md"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onStatusUpdate(lead._id, 'rejected'); }}
                                    title="Reject"
                                    className="p-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-lg transition-all shadow-sm hover:shadow-md"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </>
                        ) : (
                            <div className={`text-[9px] font-black px-3 py-1 rounded-full shadow-sm border transition-all ${(lead.salesStatus === 'sold' && !lead.negotiationStartDate && !lead.message)
                                ? 'bg-[#059669] text-white border-transparent'
                                : lead.status === 'accepted'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800/50'
                                    : (lead.status === 'rejected' || lead.salesStatus === 'unsold' ? 'bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800/50' : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800/50')
                                }`}>
                                {(lead.salesStatus === 'sold' && !lead.negotiationStartDate && !lead.message)
                                    ? 'PAID'
                                    : lead.status.toUpperCase()}
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
                            className="bg-gray-50 dark:bg-zinc-900 bluish:bg-[#0f172a] border-t border-gray-100 dark:border-zinc-800 bluish:border-white/5 overflow-hidden"
                        >
                            <div className="p-6">
                                {/* Full Asset Title */}
                                <div className="mb-6 pb-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center">
                                    <div>
                                        <span className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 bluish:text-gray-500 uppercase tracking-widest mr-2">Asset Interest</span>
                                        <h3 className="font-bold text-gray-900 dark:text-white bluish:text-white text-lg mt-1">{lead.asset.title}</h3>
                                    </div>
                                    <div className="flex gap-3">
                                        {(lead.salesStatus === 'sold' && (!lead.isOnlinePayment || lead.isManuallyMarkedSold)) ? (
                                            <div className="px-6 py-2 bg-emerald-600 text-white text-xs font-black rounded-xl shadow-md border border-transparent flex items-center">
                                                <CheckCircle size={14} className="mr-2" />
                                                Marked as SOLD
                                            </div>
                                        ) : lead.salesStatus === 'unsold' ? (
                                            <div className="px-6 py-2 bg-rose-600 text-white text-xs font-black rounded-xl shadow-md border border-transparent flex items-center">
                                                Marked as UNSOLD
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                {lead.status !== 'rejected' && (
                                                    <button
                                                        onClick={handleMarkAsSold}
                                                        className="px-6 py-2 bg-blue-600 dark:bg-blue-600 text-white text-xs font-black rounded-xl shadow-lg border border-transparent transition-all active:scale-95"
                                                    >
                                                        Mark as Sold
                                                    </button>
                                                )}
                                                {(lead.status === 'negotiating' || lead.status === 'rejected') && (
                                                    <button
                                                        onClick={handleMarkAsUnsold}
                                                        className="px-6 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-200 text-xs font-black rounded-xl shadow-sm transition-all hover:bg-gray-50 active:scale-95"
                                                    >
                                                        Mark as Unsold
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* 1. Actual Bill (Incoming Request) */}
                                    <div className="text-sm">
                                        <h5 className="text-xs font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Actual Bill (Request)</h5>
                                        <div className="bg-white dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 bluish:bg-[#0f172a] p-0 rounded-xl border border-dashed border-indigo-200 dark:border-indigo-800 shadow-sm h-48 flex flex-col overflow-hidden relative">
                                            <div className="px-5 py-3 bg-indigo-50 dark:bg-indigo-900/20 border-b border-dashed border-indigo-100 dark:border-indigo-800 flex justify-between items-center">
                                                <span className="text-xs font-black text-indigo-800 dark:text-indigo-300 uppercase tracking-wider">Actual Bill</span>
                                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Orig. Order</span>
                                            </div>
                                            <div className="p-5 flex flex-col justify-center flex-1 space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500 font-medium">Quantity</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">{lead.quantity}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Unit Price</span>
                                                    <span className="text-xs font-medium text-gray-500">₹{lead.asset.price?.toLocaleString()}</span>
                                                </div>
                                                <div className="h-px bg-indigo-100 dark:bg-indigo-900/30 border-t border-dashed my-2"></div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500 font-medium">Total Price</span>
                                                    <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-2xl">
                                                        ₹{(lead.asset.price * lead.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. Preview Bill (Final/Estimate) */}
                                    <div className="text-sm">
                                        <h5 className="text-xs font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
                                            {lead.salesStatus === 'sold' ? 'Preview Bill (Final)' : 'Preview Sale (Quote)'}
                                        </h5>
                                        <div className={`bg-white dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 bluish:bg-[#0f172a] p-0 rounded-xl border border-dashed shadow-sm h-48 flex flex-col overflow-hidden relative ${lead.salesStatus === 'sold' ? 'border-blue-300 dark:border-emerald-700' : 'border-gray-200 dark:border-zinc-700'}`}>
                                            <div className={`px-5 py-3 border-b flex justify-between items-center ${lead.salesStatus === 'sold' ? 'bg-blue-50 dark:bg-emerald-900/20 border-blue-100 dark:border-emerald-800' : 'bg-gray-50 dark:bg-zinc-800 border-gray-100 dark:border-zinc-700'}`}>
                                                <span className={`text-xs font-black uppercase tracking-wider ${lead.salesStatus === 'sold' ? 'text-blue-800 dark:text-emerald-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                                    {lead.salesStatus === 'sold' ? 'Preview' : 'Estimate'}
                                                </span>
                                                <span className={`text-xs font-bold ${lead.salesStatus === 'sold' ? 'text-blue-600 dark:text-emerald-400' : 'text-gray-500'}`}>
                                                    {lead.salesStatus === 'sold' ? 'Final Deal' : 'Pending'}
                                                </span>
                                            </div>
                                            <div className="p-5 flex flex-col justify-center flex-1 space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500 font-medium">Quantity</span>
                                                    <span className="font-bold text-gray-900 dark:text-white">
                                                        {lead.salesStatus === 'sold' ? lead.soldQuantity : lead.quantity}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Unit Price</span>
                                                    <span className="text-xs font-medium text-gray-500">
                                                        ₹{(lead.salesStatus === 'sold' ? (lead.soldPrice || lead.asset.price) : lead.asset.price)?.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="h-px bg-gray-100 dark:bg-zinc-700 border-t border-dashed my-2"></div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500 font-medium">{lead.salesStatus === 'sold' ? 'Total Paid' : 'Est. Total'}</span>
                                                    <span className={`font-bold font-mono text-2xl ${lead.salesStatus === 'sold' ? 'text-blue-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                                                        ₹{(lead.salesStatus === 'sold' ? lead.soldTotalAmount : (lead.asset.price * lead.quantity))?.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3. Contact Details */}
                                    <div className="text-sm">
                                        <h5 className="text-xs font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Contact Details</h5>
                                        <div className="bg-gray-800 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 bluish:bg-[#0f172a] text-white p-6 rounded-xl shadow-inner h-40 flex flex-col justify-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white/10 p-2.5 rounded-lg">
                                                    <Mail size={18} className="text-indigo-300" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Email</p>
                                                    <p className="font-bold text-base tracking-wide">{lead.buyer?.email || 'No email provided'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white/10 p-2.5 rounded-lg">
                                                    <Phone size={18} className="text-indigo-300" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Phone</p>
                                                    <p className="font-bold text-base tracking-wide">{lead.buyer?.phone || '+1 (555) 123-4567'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 4. Message */}
                                    <div className="text-sm">
                                        <h5 className="text-xs font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Message</h5>
                                        <div className="bg-gray-800 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 bluish:bg-[#0f172a] text-white p-6 rounded-xl shadow-inner h-40 overflow-y-auto custom-scrollbar">
                                            <p className="text-gray-300 italic leading-relaxed">
                                                "{lead.message || `I am interested in this ${lead.asset.title}. Is it still available?`}"
                                            </p>
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



    const [expandedLeadId, setExpandedLeadId] = useState(null);

    const handleExpandTemplate = (id) => {
        setExpandedLeadId(prevId => prevId === id ? null : id);
    };

    const handleStatusUpdate = async (id, newStatus) => {
        const action = newStatus === 'accepted' ? 'Accept' : 'Reject';

        const isConfirmed = await confirm({
            title: `${action} Lead Request`,
            message: `Are you sure you want to ${action.toLowerCase()} this lead? This action notifies the buyer.`,
            confirmText: action,
            isDangerous: newStatus === 'rejected', // Red button for reject
            // Optional: icon: newStatus === 'accepted' ? CheckCircle : XCircle
        });

        if (!isConfirmed) return;

        try {
            const { data: updatedLead } = await api.put(`/interests/${id}/status`, { status: newStatus });
            // Merge in place to ensure we keep populated details if they aren't returned
            setLeads(prev => prev.map(l => l._id === id ? { ...l, ...updatedLead } : l));
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
        const negotiating = leads.filter(l => l.status === 'negotiating').length;
        const paid = leads.filter(l => l.status === 'accepted').length;
        const conversionRate = total > 0 ? ((paid / total) * 100).toFixed(1) : 0;
        return { total, negotiating, paid, conversionRate };
    }, [leads]);

    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const handleCloseFilter = () => {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('filter');
        setSearchParams(newParams);
    };

    // Only show full shimmer if we have no data and are loading (Initial load)
    if (loading && leads.length === 0) return <LeadsShimmer />;

    return (
        <div className="flex flex-col md:flex-row-reverse gap-8 items-start relative pb-20">
            {/* Filter Sidebar */}
            {isFilterOpen && (
                <div className="w-full md:w-80 flex-shrink-0 transition-all duration-300 ease-in-out block animate-fade-in h-fit sticky top-24">
                    <LeadFilter
                        filters={filters}
                        setFilters={setFilters}
                        onClose={handleCloseFilter}
                        onApply={() => fetchLeads(filters)}
                        onClear={() => fetchLeads({})}
                    />
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 min-w-0 transition-all duration-300 relative">
                {/* Refetch Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-zinc-950/50 z-50 rounded-2xl flex items-start justify-center pt-48 backdrop-blur-[1px]">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 dark:border-emerald-500"></div>
                    </div>
                )}

                {/* Headers */}
                <div className="hidden md:grid grid-cols-[1.4fr_1.8fr_1fr_1.2fr_0.4fr] gap-4 px-4 pb-3 text-xs font-bold text-gray-400 dark:text-zinc-500 bluish:text-gray-400 uppercase tracking-wider pl-6">
                    <div>Assets</div>
                    <div>Buyer Name</div>
                    <div>Status</div>
                    <div>Date</div>
                    <div className="text-right pr-2">Action</div>
                </div>

                {/* Leads List */}
                <div className="space-y-4">
                    {leads.length === 0 ? (
                        <div className="bg-white dark:bg-zinc-900 bluish:bg-[#1e293b] rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700 bluish:border-white/10 p-12 text-center relative z-10">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 bluish:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-gray-600 bluish:text-gray-500">
                                <Inbox size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white bluish:text-white mb-1">No leads found</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 bluish:text-gray-400">Try adjusting your filters or check back later.</p>
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
        </div>
    );
};

export default SellerLeads
