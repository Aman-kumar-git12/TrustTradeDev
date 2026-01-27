import { loadRazorpay, startPayment } from "../assets/razorpay";
import { CreditCard, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Checkout() {
    const handlePay = async () => {
        const loaded = await loadRazorpay();
        if (!loaded) {
            alert("Razorpay SDK failed to load");
            return;
        }

        startPayment(500); // ₹500
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white dark:bg-[#141414] bluish:bg-[#1e293b] rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-white/5 relative overflow-hidden"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 dark:bg-emerald-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <Link to="/home" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 dark:hover:text-emerald-400 mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Home
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-600/10 dark:bg-emerald-600/10 rounded-2xl">
                        <CreditCard className="w-8 h-8 text-blue-600 dark:text-emerald-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold dark:text-white">Secure Checkout</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Complete your transaction via Razorpay</p>
                    </div>
                </div>

                <div className="space-y-6 mb-8">
                    <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-white/5">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Subscription Plan</span>
                        <span className="font-bold dark:text-white">Pro Plan</span>
                    </div>
                    <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-white/5">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">Amount Due</span>
                        <span className="text-2xl font-black text-blue-600 dark:text-emerald-500">₹500.00</span>
                    </div>
                </div>

                <button
                    onClick={handlePay}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-emerald-600 dark:to-emerald-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/20 dark:shadow-emerald-500/10 hover:shadow-blue-600/40 dark:hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    Pay Now with Razorpay
                </button>

                <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400 uppercase tracking-widest font-bold">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Secure 256-bit SSL Encrypted Payment
                </div>
            </motion.div>
        </div>
    );
}

export default Checkout;
