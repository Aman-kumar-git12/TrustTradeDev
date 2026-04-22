import { ShieldCheck, Zap, Tag, Star, ChevronRight, Loader2 } from 'lucide-react';

const ActionCard = ({ type, data, isBusy, onAction }) => {
    if (type === 'tool_call') {
        return (
            <div className="mt-6 rounded-2xl border border-chat-accent/30 bg-chat-card p-4 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-chat-accent/5 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="relative z-10 flex flex-col">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-chat-accent mb-2">
                        <ShieldCheck className="h-4 w-4" />
                        Action Required: {data.function?.name?.replace(/_/g, ' ')}
                    </div>
                    <p className="text-xs text-chat-text-secondary mb-4 font-mono bg-black/10 p-2 rounded-lg border border-chat-border break-all">
                        Payload: {JSON.stringify(data.function?.arguments)}
                    </p>
                    <div className="flex gap-3">
                        <button
                            disabled={isBusy}
                            onClick={() => onAction(`Execute Action: ${data.function?.name}`)}
                            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-chat-accent hover:opacity-90 px-4 py-2.5 text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Zap className="h-3 w-3" />
                            Confirm Proceed
                        </button>
                        <button
                            disabled={isBusy}
                            onClick={() => onAction('Cancel the action.')}
                            className="flex-1 rounded-xl bg-transparent border border-chat-border px-4 py-2.5 text-xs font-bold text-chat-text-primary transition-all hover:bg-chat-bg active:scale-95 disabled:opacity-50"
                        >
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'options') {
        const { active_options, optionOffset = 0, has_more } = data;
        return (
            <div className="mt-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {active_options.map((asset, idx) => {
                        const globalIdx = optionOffset + idx + 1;
                        return (
                            <button
                                key={asset._id}
                                disabled={isBusy}
                                onClick={() => onAction(`Select Option ${globalIdx}`)}
                                className="group relative flex flex-col overflow-hidden rounded-2xl border border-chat-border bg-chat-card/30 backdrop-blur-xl transition-all hover:border-chat-accent/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] active:scale-[0.98] text-left"
                            >
                                <div className="aspect-[4/3] w-full overflow-hidden bg-black/20 relative">
                                    {asset.images?.[0]?.url ? (
                                        <img 
                                            src={asset.images[0].url} 
                                            alt={asset.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-chat-text-secondary/20">
                                            <Tag className="h-12 w-12" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] font-black text-white border border-white/10">
                                        Option {globalIdx}
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h4 className="text-xs font-bold text-chat-text-primary line-clamp-1 mb-1 group-hover:text-chat-accent transition-colors">
                                        {asset.title}
                                    </h4>
                                    <div className="flex items-center gap-1 mb-3">
                                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                        <span className="text-[10px] font-bold text-chat-text-secondary">
                                            {asset.rating || '4.5'}
                                        </span>
                                    </div>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="text-sm font-black text-chat-accent">
                                            ₹{Number(asset.price).toLocaleString()}
                                        </div>
                                        <div className="h-6 w-6 rounded-lg bg-chat-accent/10 flex items-center justify-center text-chat-accent group-hover:bg-chat-accent group-hover:text-white transition-all">
                                            <ChevronRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-chat-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </button>
                        );
                    })}
                </div>
                {has_more && (
                    <button
                        disabled={isBusy}
                        onClick={() => onAction("Show More Options")}
                        className="w-full py-2 rounded-xl border border-dashed border-chat-border text-[10px] font-bold text-chat-text-secondary hover:border-chat-accent/50 hover:text-chat-accent transition-all"
                    >
                        Show More Options
                    </button>
                )}
            </div>
        );
    }

    return null;
};

export default ActionCard;
