import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Building2, ShoppingBag, Zap, ShieldCheck, ChevronDown, Trash2, Mail, Phone, Clock } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { loadRazorpay, startPayment } from '../../assets/razorpay';

const InterestCard = ({ interest, isExpanded, onToggle, onDelete, navigate, setActiveTab }) => {
    const { userId } = useParams();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const getStatusColor = (status) => {
        switch (status) {
            case 'accepted': return 'bg-emerald-100/80 text-emerald-900 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800';
            case 'rejected': return 'bg-rose-100/80 text-rose-900 border-rose-300 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800';
            case 'negotiating': return 'bg-amber-100/80 text-amber-900 border-amber-300 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800';
            default: return 'bg-gray-100 text-gray-900 border-gray-300';
        }
    };

    const handlePayment = async (e) => {
        e.stopPropagation();
        const amount = interest.soldTotalAmount || (interest.soldPrice * interest.soldQuantity) || (interest.asset?.price * interest.quantity);

        await loadRazorpay();
        await startPayment(amount, { interestId: interest._id }, () => {
            // Success Callback: Switch to orders tab
            if (setActiveTab) setActiveTab('orders');
            navigate(`/dashboard/buyer/${userId}/orders`);
        });
    };

    return (
        <div className={`bg-white dark:bg-[#111] bluish:bg-[#152033] rounded-2xl border transition-all duration-300 overflow-hidden relative z-10 ${isExpanded
            ? 'border-blue-500 dark:border-blue-500 bluish:border-blue-500 shadow-xl ring-1 ring-blue-500/10 dark:ring-blue-500/10 bluish:ring-blue-500/10'
            : 'border-gray-100 dark:border-zinc-800 bluish:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/30 bluish:hover:border-blue-500/30 shadow-sm hover:shadow-md'
            }`}>
            <div
                className="p-3 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 cursor-pointer"
                onClick={onToggle}
            >
                {/* Top Section: Image + Info (Grouped for mobile horizontal layout) */}
                <div className="flex flex-row gap-3 sm:gap-6 w-full sm:w-auto flex-1 items-start sm:items-center">
                    {/* Asset Image/Icon */}
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-gray-50 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-zinc-700">
                        {interest.asset?.images?.[0] ? (
                            <img src={interest.asset.images[0]} alt={interest.asset.title} className="w-full h-full object-cover" />
                        ) : (
                            <Building2 className="text-gray-400" size={20} />
                        )}
                    </div>

                    {/* Info Area */}
                    <div className="flex-1 min-w-0 py-0.5">
                        <div className="flex items-center space-x-2 text-[9px] font-extrabold text-blue-600 dark:text-blue-400 bluish:text-blue-400 uppercase tracking-widest mb-0.5">
                            <Tag size={9} />
                            <span>{interest.asset?.category || 'General'}</span>
                        </div>
                        <h4 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white truncate mb-0.5">
                            {interest.asset?.title}
                        </h4>
                        <div className="flex items-center text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-zinc-500 mb-1">
                            <Building2 size={10} className="mr-1 text-blue-500 dark:text-blue-500 bluish:text-blue-400" />
                            <span className="truncate max-w-[150px]">{interest.asset?.business?.businessName || 'Independent Seller'}</span>
                        </div>
                        <div className="flex items-center text-[10px] sm:text-sm font-semibold text-gray-500 dark:text-gray-400 flex-wrap gap-y-1">
                            <span className="text-gray-900 dark:text-gray-200">₹{interest.asset?.price?.toLocaleString()}</span>
                            <span className="mx-1.5">•</span>
                            <span className="flex items-center">
                                <ShoppingBag size={10} className="mr-1 text-blue-500 dark:text-blue-500 bluish:text-blue-400" />
                                Qty: {interest.quantity}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status and Action - Full width on mobile, auto on desktop */}
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto sm:min-w-[200px] border-t sm:border-0 border-gray-100 dark:border-zinc-800 pt-2 sm:pt-0 mt-1 sm:mt-0">
                    {(interest.status === 'accepted' || interest.status === 'negotiating') && interest.salesStatus !== 'sold' && (
                        <button
                            onClick={handlePayment}
                            className="flex-1 sm:flex-none justify-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-xs font-black rounded-lg transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                        >
                            <Zap size={12} fill="currentColor" />
                            PAY NOW
                        </button>
                    )}
                    {interest.salesStatus === 'sold' ? (
                        <span className="flex items-center px-2 py-1 text-[9px] sm:text-[10px] font-extrabold rounded-full border border-blue-500 dark:border-blue-500 bluish:border-blue-400 bg-blue-500/10 dark:bg-blue-500/10 bluish:bg-blue-400/10 text-blue-500 dark:text-blue-500 bluish:text-blue-400 uppercase tracking-wider">
                            <ShieldCheck size={10} className="mr-1" />
                            PAID
                        </span>
                    ) : (
                        <span className={`px-2 py-1 text-[9px] sm:text-[10px] font-extrabold rounded-full border uppercase tracking-wider ${getStatusColor(interest.status)}`}>
                            {interest.status}
                        </span>
                    )}
                    <div className={`p-1.5 sm:p-2 rounded-lg transition-transform ml-auto sm:ml-0 ${isExpanded ? 'rotate-180 bg-blue-50 dark:bg-blue-900/20 bluish:bg-blue-500/10 text-blue-600 dark:text-blue-400 bluish:text-blue-400' : 'text-gray-400'}`}>
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="px-5 pb-6 pt-2 border-t border-gray-50 dark:border-zinc-800">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Message Sent */}
                                <div>
                                    <h5 className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Your Message</h5>
                                    <div className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl text-sm text-gray-600 dark:text-gray-300 italic border border-gray-100 dark:border-zinc-700 h-32 overflow-y-auto">
                                        "{interest.message || 'No message provided.'}"
                                    </div>

                                    {/* Sold Details for Analysis */}
                                    {(interest.status === 'accepted' || interest.salesStatus === 'sold') && (
                                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                            <h6 className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bluish:text-blue-400 uppercase tracking-widest mb-2">Deal Summary</h6>
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase">Unit Price</p>
                                                    <p className="font-bold text-gray-900 dark:text-white">₹{(interest.soldPrice || interest.asset?.price || 0).toLocaleString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase">Qty</p>
                                                    <p className="font-bold text-gray-900 dark:text-white">{interest.soldQuantity || interest.quantity}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-500 uppercase">Total</p>
                                                    <p className="font-bold text-blue-600 dark:text-blue-400 bluish:text-blue-400">₹{(interest.soldTotalAmount || (interest.soldPrice * interest.soldQuantity) || 0).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Next Steps / Seller Contact */}
                                <div>
                                    <h5 className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Seller Details</h5>
                                    {interest.status === 'accepted' || interest.salesStatus === 'sold' ? (
                                        <div className="space-y-4">
                                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 bluish:bg-blue-900/30 text-blue-800 dark:text-blue-200 bluish:text-blue-200 text-xs font-bold rounded-xl border border-blue-200 dark:border-blue-800/50 bluish:border-blue-800/50 mb-2">
                                                🎉 Your request has been accepted! Contact the number below, otherwise our team will contact you in a while.
                                            </div>

                                            <div className="flex items-center p-3 bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700 shadow-sm">
                                                <div className="h-10 w-10 rounded-full bg-blue-500 dark:bg-blue-600 bluish:bg-blue-600 flex items-center justify-center text-white mr-4 shadow-md font-bold text-lg">
                                                    {interest.seller?.fullName?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{interest.seller?.fullName}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{interest.seller?.companyName || 'Seller'}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <a href={`mailto:${interest.seller?.email}`} className="flex items-center p-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-zinc-700">
                                                    <Mail size={16} className="mr-3 text-blue-500 dark:text-blue-400 bluish:text-blue-400" />
                                                    {interest.seller?.email}
                                                </a>
                                                {interest.seller?.phone && (
                                                    <a href={`tel:${interest.seller?.phone}`} className="flex items-center p-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-transparent hover:border-gray-200 dark:hover:border-zinc-700">
                                                        <Phone size={16} className="mr-3 text-blue-500 dark:text-blue-400 bluish:text-blue-400" />
                                                        {interest.seller.phone}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-40 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-200 dark:border-zinc-800 border-dashed p-6 text-center">
                                            <Clock className="text-gray-400 mb-2" size={24} />
                                            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                                Contact details will be visible once the seller accepts your request.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Deletion/Retraction Option */}
                                {interest.status === 'negotiating' && (
                                    <div className="md:col-span-2 pt-4 border-t border-gray-50 dark:border-zinc-800 flex justify-end">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(interest._id);
                                            }}
                                            className="flex items-center text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                        >
                                            <Trash2 size={14} className="mr-2" />
                                            Retract Interest
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InterestCard;
