import { Bot, Zap, Clock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChatHeader = ({ chatMode, onMobileHistoryOpen }) => {
    return (
        <header className="flex items-center justify-between border-b border-chat-border px-6 py-4">
            <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-chat-accent/30 bg-chat-accent/10 text-chat-accent lg:hidden">
                    <Bot className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="flex items-center gap-2 text-sm font-bold text-chat-text-primary uppercase tracking-wider">
                        {chatMode === 'agent' ? 'Strategic Command' : 'TrustTrade Guide'}
                        <span className="hidden sm:inline-block rounded-full border border-chat-accent/20 bg-chat-accent/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-chat-accent">
                            {chatMode === 'agent' ? 'Agent Flow' : 'Conversation'}
                        </span>
                    </h1>
                    <p className="text-[10px] font-medium text-chat-text-secondary">
                        {chatMode === 'agent' ? 'Active Node: Guided purchase workflow' : 'Active Node: Full website guidance'}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="hidden items-center gap-2 rounded-full bg-chat-card px-3 py-1.5 text-[10px] font-bold text-chat-text-secondary sm:flex">
                    <Zap className="h-3 w-3 text-yellow-500" />
                    3.2 TFLOPS
                </div>
                <button
                    onClick={onMobileHistoryOpen}
                    className="lg:hidden flex items-center justify-center rounded-xl bg-chat-card p-2 text-chat-text-primary transition-all hover:bg-chat-accent/10"
                >
                    <Clock className="h-4 w-4" />
                </button>
                <Link to="/dashboard" className="hidden items-center justify-center rounded-xl bg-chat-card p-2 text-chat-text-primary transition-all hover:bg-chat-accent/10 lg:flex">
                    <ArrowUpRight className="h-4 w-4" />
                </Link>
            </div>
        </header>
    );
};

export default ChatHeader;
