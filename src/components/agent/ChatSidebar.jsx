import { Plus, Clock, Loader2, MessageSquare, Trash2, Bot } from 'lucide-react';

const ChatSidebar = ({ 
    onNewChat, 
    chatMode, 
    isLoadingSessions, 
    visibleSessions, 
    currentSessionId, 
    onLoadSession, 
    onDeleteSession,
    resolveSessionMode
}) => {
    return (
        <aside className="hidden w-80 flex-col gap-4 lg:flex h-full">
            <div className="flex flex-col gap-4 h-full rounded-[32px] border border-chat-border bg-chat-card p-4 backdrop-blur-2xl shadow-xl">
                <button
                    onClick={() => onNewChat()}
                    className="flex items-center gap-3 w-full rounded-2xl border border-chat-accent/30 bg-chat-accent/10 px-4 py-3 text-sm font-bold text-chat-accent transition-all hover:bg-chat-accent/20 active:scale-95"
                >
                    <Plus className="h-5 w-5" />
                    {chatMode === 'agent' ? 'New Agent Session' : 'New Conversation'}
                </button>

                <div className="flex-1 overflow-y-auto space-y-2 scrollbar-none">
                    <h3 className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-chat-text-secondary flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Recent History
                    </h3>

                    {isLoadingSessions ? (
                        <div className="flex items-center justify-center p-8 text-chat-text-secondary">
                            <Loader2 className="h-6 w-6 animate-spin text-chat-accent" />
                        </div>
                    ) : visibleSessions.length === 0 ? (
                        <div className="p-4 text-center text-xs text-chat-text-secondary italic">
                            No {chatMode === 'agent' ? 'agent' : 'conversation'} sessions found.
                        </div>
                    ) : (
                        visibleSessions.map(session => (
                            <div
                                key={session.id}
                                onClick={() => onLoadSession(session.id)}
                                className={`group relative flex items-center justify-between gap-3 cursor-pointer rounded-xl p-3 transition-all ${currentSessionId === session.id
                                    ? 'bg-chat-accent/20 border border-chat-accent/30 text-chat-text-primary'
                                    : 'hover:bg-chat-bg text-chat-text-secondary'
                                    }`}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <MessageSquare className={`h-4 w-4 shrink-0 ${currentSessionId === session.id ? 'text-chat-accent' : 'opacity-60'}`} />
                                    <div className="min-w-0">
                                        <span className="block truncate text-xs font-semibold text-chat-text-primary">{session.title}</span>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-chat-text-secondary/80">
                                            {resolveSessionMode(session) === 'agent' ? 'Agent flow' : 'Conversation'}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => onDeleteSession(e, session.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 text-chat-text-secondary hover:text-red-400 transition-all"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-auto pt-4 border-t border-chat-border">
                    <div className="flex items-center gap-4 p-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-chat-accent/30 bg-chat-accent/10 text-chat-accent">
                            <Bot className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-chat-accent/70">Intelligence</p>
                            <h2 className="text-sm font-black italic tracking-tight text-chat-text-primary">AGENT PRO</h2>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default ChatSidebar;
