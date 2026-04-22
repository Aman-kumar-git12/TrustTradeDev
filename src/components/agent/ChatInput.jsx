import { Bot, MessageSquare, ChevronUp, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInput = ({ 
    input, 
    setInput, 
    isBusy, 
    onSendMessage, 
    chatMode, 
    isModeMenuOpen, 
    setIsModeMenuOpen, 
    switchMode 
}) => {
    return (
        <div className="px-4 py-6 lg:px-8">
            <form
                onSubmit={(e) => { e.preventDefault(); onSendMessage(input); }}
                className="relative mx-auto max-w-4xl"
            >
                <div className="group relative">
                    <div className="relative rounded-[20px] border border-chat-input-glow bg-chat-input-bg p-1 transition-all duration-300 group-focus-within:border-chat-accent group-focus-within:shadow-[0_0_12px_var(--chat-accent)]">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    onSendMessage(input);
                                }
                            }}
                            rows={2}
                            placeholder={chatMode === 'agent' ? "Tell me what you want to buy..." : "Ask anything about the TrustTrade website..."}
                            className="h-20 w-full resize-none bg-transparent px-5 py-4 text-sm font-medium text-chat-text-primary outline-none placeholder:text-chat-text-secondary/70"
                        />
                        <div className="flex items-center justify-between border-t border-chat-border py-3 pl-5 pr-3">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
                                        className="flex items-center gap-2 rounded-xl bg-chat-bg/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-chat-text-secondary transition-all hover:bg-chat-card hover:text-chat-text-primary"
                                    >
                                        {chatMode === 'agent' ? <Bot className="h-3 w-3 text-chat-accent" /> : <MessageSquare className="h-3 w-3 text-chat-accent" />}
                                        <span className="hidden sm:inline-block">{chatMode === 'agent' ? 'Agent Mode' : 'Conversation Mode'}</span>
                                        <ChevronUp className={`h-3 w-3 transition-transform ${isModeMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {isModeMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute bottom-full left-0 mb-3 w-[220px] sm:w-[320px] overflow-hidden rounded-2xl border border-chat-border bg-chat-bg/80 backdrop-blur-xl shadow-2xl z-[80] origin-bottom-left"
                                            >
                                                <div className="flex flex-col p-1.5 sm:p-2 gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => switchMode('conversation')}
                                                        className={`flex items-start gap-3 sm:gap-4 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-left transition-all ${chatMode === 'conversation' ? 'bg-chat-accent/10' : 'hover:bg-chat-bg'}`}
                                                    >
                                                        <MessageSquare className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5 ${chatMode === 'conversation' ? 'text-chat-accent' : 'text-chat-text-secondary'}`} />
                                                        <div className="flex flex-col gap-1 sm:gap-1.5">
                                                            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${chatMode === 'conversation' ? 'text-chat-accent' : 'text-chat-text-primary'}`}>
                                                                Conversation Mode
                                                            </span>
                                                            <span className="text-[10px] sm:text-[11px] font-medium leading-relaxed text-chat-text-secondary line-clamp-2">
                                                                Explains the full TrustTrade website with grounded answers about pages, features, workflows, and user journeys.
                                                            </span>
                                                        </div>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => switchMode('agent')}
                                                        className={`flex items-start gap-3 sm:gap-4 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-left transition-all ${chatMode === 'agent' ? 'bg-chat-accent/10' : 'hover:bg-chat-bg'}`}
                                                    >
                                                        <Bot className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5 ${chatMode === 'agent' ? 'text-chat-accent' : 'text-chat-text-secondary'}`} />
                                                        <div className="flex flex-col gap-1 sm:gap-1.5">
                                                            <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${chatMode === 'agent' ? 'text-chat-accent' : 'text-chat-text-primary'}`}>
                                                                Agent Mode
                                                            </span>
                                                            <span className="text-[10px] sm:text-[11px] font-medium leading-relaxed text-chat-text-secondary line-clamp-2">
                                                                Guides a structured buy flow with options, quotes, reservation, and secure checkout support.
                                                            </span>
                                                        </div>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-chat-text-secondary sm:block hidden">
                                    Ctrl+Enter
                                </p>
                            </div>
                            <button
                                type="submit"
                                disabled={isBusy || !input.trim()}
                                className="flex h-10 items-center justify-center gap-2 rounded-xl bg-chat-accent px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-chat-accent-hover active:scale-95 disabled:opacity-30"
                            >
                                <Send className="h-4 w-4" />
                                {isBusy ? 'Transmitting' : 'Execute'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ChatInput;
