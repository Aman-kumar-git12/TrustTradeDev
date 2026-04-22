import { Receipt, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';

const QuoteCard = ({ quote, isBusy, isCompleted, isInitiating, onPay, onCancel }) => {
    return (
        <div className="mt-6 overflow-hidden rounded-2xl border border-chat-accent/30 bg-chat-card/50 backdrop-blur-xl shadow-2xl relative group">
            <div className="absolute inset-0 bg-chat-accent/5 mix-blend-overlay pointer-events-none"></div>
            <div className="p-5 border-b border-chat-border/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-chat-accent">
                        <Receipt className="h-4 w-4" />
                        Strategic Purchase Quote
                    </div>
                    <div className="px-2 py-1 rounded-md bg-chat-accent/10 border border-chat-accent/20 text-[10px] font-bold text-chat-accent animate-pulse">
                        SECURED FOR 15:00
                    </div>
                </div>
                
                <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-chat-text-secondary">
                        <span>Base Asset Price</span>
                        <span className="font-mono">₹{quote.basePrice}</span>
                    </div>
                    <div className="flex justify-between text-chat-text-secondary">
                        <span>Quantity</span>
                        <span className="font-mono">x{quote.quantity}</span>
                    </div>
                    <div className="flex justify-between text-chat-text-secondary">
                        <span>Strategic Platform Fee</span>
                        <span className="font-mono">₹{quote.platformFee}</span>
                    </div>
                    <div className="flex justify-between text-chat-text-secondary">
                        <span>Estimated Tax</span>
                        <span className="font-mono">₹{quote.tax}</span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-chat-border/50 flex justify-between text-base font-black text-chat-text-primary">
                        <span className="uppercase tracking-tighter">Total All-In Cost</span>
                        <span className="text-chat-accent font-mono">₹{quote.total}</span>
                    </div>
                </div>
            </div>
            
            <div className="p-4 bg-chat-accent/5 flex gap-3 relative z-20">
                <button
                    disabled={isBusy || isCompleted || isInitiating}
                    onClick={onPay}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black text-white transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:grayscale ${isCompleted ? 'bg-chat-accent/40' : 'bg-chat-accent hover:opacity-90'}`}
                >
                    {isCompleted ? (
                        <>
                            <ShieldCheck className="h-4 w-4" />
                            PURCHASE COMPLETED
                        </>
                    ) : isInitiating ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            INITIATING...
                        </>
                    ) : (
                        <>
                            <CreditCard className="h-4 w-4" />
                            PAY SECURELY NOW
                        </>
                    )}
                </button>
                <button
                    disabled={isBusy}
                    onClick={onCancel}
                    className="rounded-xl bg-transparent border border-chat-border px-4 py-3 text-xs font-bold text-chat-text-secondary transition-all hover:bg-chat-bg hover:text-chat-text-primary active:scale-95 disabled:opacity-50"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default QuoteCard;
