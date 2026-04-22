import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Building2, ShoppingBag, ShieldCheck, Download, ChevronDown, Mail, Phone } from 'lucide-react';
import { generateInvoice } from '../../utils/invoiceGenerator';
import { useUI } from '../../context/UIContext';

const OrderCard = ({ order, isExpanded, onToggle }) => {
    const { showSnackbar } = useUI();

    const handleExportBill = (e) => {
        e.stopPropagation();
        generateInvoice({
            saleId: order._id,
            status: order.status,
            buyerName: order.buyer?.fullName || 'Unknown Buyer',
            buyerEmail: order.buyer?.email || 'N/A',
            buyerPhone: order.buyer?.phone || 'N/A',
            assetTitle: order.asset?.title,
            quantity: order.quantity,
            unitPrice: order.price,
            totalAmount: order.totalAmount
        });
        showSnackbar("Invoice downloaded! 📄", "success");
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
                {/* Top Section: Image + Info */}
                <div className="flex flex-row gap-3 sm:gap-6 w-full sm:w-auto flex-1 items-start sm:items-center">
                    {/* Asset Image/Icon */}
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-gray-50 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-zinc-700">
                        {order.asset?.images?.[0] ? (
                            <img src={order.asset.images[0]} alt={order.asset?.title} className="w-full h-full object-cover" />
                        ) : (
                            <Building2 className="text-gray-400" size={20} />
                        )}
                    </div>

                    {/* Info Area */}
                    <div className="flex-1 min-w-0 py-0.5">
                        <div className="flex items-center space-x-2 text-[9px] font-extrabold text-blue-600 dark:text-blue-400 bluish:text-blue-400 uppercase tracking-widest mb-0.5">
                            <CheckCircle size={9} />
                            <span>Completed</span>
                        </div>
                        <h4 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white truncate mb-0.5">
                            {order.asset?.title}
                        </h4>
                        <div className="flex items-center text-[10px] sm:text-[11px] font-bold text-gray-500 dark:text-zinc-500 mb-1">
                            <Building2 size={10} className="mr-1 text-blue-500 dark:text-blue-500 bluish:text-blue-400" />
                            <span className="truncate max-w-[150px]">{order.asset?.business?.businessName || 'Independent Seller'}</span>
                        </div>
                        <div className="flex items-center text-[10px] sm:text-sm font-semibold text-gray-500 dark:text-gray-400 flex-wrap gap-y-1">
                            <span className="text-gray-900 dark:text-white font-bold">₹{order.price?.toLocaleString()}</span>
                            <span className="mx-1.5">•</span>
                            <span className="flex items-center">
                                <ShoppingBag size={10} className="mr-1 text-blue-500 dark:text-blue-500 bluish:text-blue-400" />
                                Qty: {order.quantity}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status and Action */}
                <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4 w-full sm:w-auto sm:min-w-[200px] border-t sm:border-0 border-gray-100 dark:border-zinc-800 pt-2 sm:pt-0 mt-1 sm:mt-0">
                    <span className="flex items-center px-2 py-1 text-[9px] sm:text-[10px] font-extrabold rounded-full border border-blue-500 dark:border-blue-500 bluish:border-blue-400 bg-blue-500/10 dark:bg-blue-500/10 bluish:bg-blue-400/10 text-blue-500 dark:text-blue-500 bluish:text-blue-400 uppercase tracking-wider">
                        <ShieldCheck size={10} className="mr-1" />
                        PAID
                    </span>

                    {/* Export Bill Button */}
                    <button
                        onClick={handleExportBill}
                        className="flex items-center px-3 py-1.5 ml-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-[10px] sm:text-xs font-bold rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                        title="Download Invoice"
                    >
                        <Download size={12} className="mr-1.5" />
                        Bill
                    </button>

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
                        <div className="px-5 pb-6 pt-4 border-t border-gray-50 dark:border-zinc-800">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h5 className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Transaction Summary</h5>
                                    <div className="p-4 bg-gray-50 dark:bg-zinc-800/30 rounded-xl border border-gray-100 dark:border-zinc-800">
                                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200 dark:border-zinc-700">
                                            <span className="text-xs text-gray-400 font-mono">ID: #{order._id.slice(-8).toUpperCase()}</span>
                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bluish:text-blue-400 bg-blue-100 dark:bg-blue-900/30 bluish:bg-blue-900/30 px-2 py-0.5 rounded">PAID & SECURE</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-500">Unit Price</span>
                                            <span className="text-sm font-bold dark:text-white">₹{order.price?.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-500">Quantity Sold</span>
                                            <span className="text-sm font-bold dark:text-white">{order.quantity}</span>
                                        </div>
                                        <div className="pt-2 border-t border-gray-200 dark:border-zinc-700 flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-900 dark:text-white uppercase">Total Paid</span>
                                            <span className="text-lg font-black text-blue-600 dark:text-blue-400 bluish:text-blue-400">₹{(order.totalAmount || (order.price * order.quantity)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-[10px] font-extrabold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Seller Contact</h5>
                                    <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                                        <div className="flex items-center mb-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 dark:bg-blue-600 bluish:bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-3">
                                                {order.seller?.fullName?.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold dark:text-white">{order.seller?.fullName}</span>
                                        </div>
                                        <div className="space-y-2">
                                            <a href={`mailto:${order.seller?.email}`} className="flex items-center text-xs text-blue-500 dark:text-blue-400 bluish:text-blue-400 font-bold hover:underline mb-2">
                                                <Mail size={12} className="mr-2" />
                                                {order.seller?.email}
                                            </a>
                                            {order.seller?.phone && (
                                                <a href={`tel:${order.seller?.phone}`} className="flex items-center text-xs text-blue-500 dark:text-blue-400 bluish:text-blue-400 font-bold hover:underline">
                                                    <Phone size={12} className="mr-2" />
                                                    {order.seller.phone}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OrderCard;
