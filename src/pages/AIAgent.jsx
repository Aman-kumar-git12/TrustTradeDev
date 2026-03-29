import { startTransition, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowUpRight,
    Bot,
    Loader2,
    MessageSquare,
    Send,
    ShieldCheck,
    Sparkles,
    Store,
    ChevronRight,
    Zap,
    Plus,
    Trash2,
    Clock
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const promptSets = {
    seller: [
        'Help me write a better asset listing.',
        'How should I negotiate with buyers on TrustTrade?',
        'What should I do first in the seller dashboard?'
    ],
    buyer: [
        'Help me compare two marketplace listings.',
        'How do I negotiate a better deal as a buyer?',
        'What should I review before checkout?'
    ],
    default: [
        'Show me how TrustTrade works.',
        'How do I get started faster?',
        'What can this AI agent help me with?'
    ]
};

const thinkingStages = [
    {
        label: 'Scanning TrustTrade knowledge',
        detail: 'Checking platform context, role signals, and the latest conversation trail.'
    },
    {
        label: 'Aligning the best path',
        detail: 'Matching the request to the strongest workflow before drafting.'
    },
    {
        label: 'Rendering live response',
        detail: 'Streaming a structured answer into the conversation pane.'
    }
];

const createMessageId = (role) => `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createMessage = (role, content, quickReplies = [], overrides = {}) => ({
    id: overrides.id || createMessageId(role),
    role,
    content,
    quickReplies,
    streamedContent: overrides.streamedContent ?? content,
    isStreaming: overrides.isStreaming ?? false
});

const wait = (delay) => new Promise((resolve) => {
    window.setTimeout(resolve, delay);
});

const getStreamChunkSize = (fullText, cursor) => {
    const remaining = fullText.length - cursor;
    const currentChar = fullText[cursor] || '';
    if (currentChar === '\n') return 1;
    if (remaining > 320) return 8;
    if (remaining > 180) return 6;
    if (remaining > 90) return 4;
    return 2;
};

const getStreamDelay = (chunk) => {
    if (chunk.includes('\n\n')) return 150;
    if (/[.!?]\s*$/.test(chunk)) return 110;
    if (/[:,;]\s*$/.test(chunk)) return 70;
    return 24;
};

const AIAgent = () => {
    const { user } = useAuth();
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [thinkingIndex, setThinkingIndex] = useState(0);
    const [streamingMessageId, setStreamingMessageId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [isLoadingSessions, setIsLoadingSessions] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    
    const messagesEndRef = useRef(null);
    const streamRunRef = useRef(0);
    const messagesRef = useRef(messages);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: streamingMessageId ? 'auto' : 'smooth'
        });
    }, [messages, isSending, streamingMessageId]);

    useEffect(() => {
        if (!isSending) {
            setThinkingIndex(0);
            return undefined;
        }
        const intervalId = window.setInterval(() => {
            setThinkingIndex((current) => (current + 1) % thinkingStages.length);
        }, 1400);
        return () => window.clearInterval(intervalId);
    }, [isSending]);

    // Initial load: Fetch sessions
    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setIsLoadingSessions(true);
            const { data } = await api.get('/agent/sessions');
            setSessions(data);
            
            // If no active session, start with a fresh state
            if (!currentSessionId && data.length === 0) {
                startNewChat();
            }
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            if (!currentSessionId) {
                startNewChat();
            }
        } finally {
            setIsLoadingSessions(false);
        }
    };

    const loadSession = async (sessionId) => {
        if (currentSessionId === sessionId) return;
        
        try {
            setIsLoadingHistory(true);
            setCurrentSessionId(sessionId);
            const { data } = await api.get(`/agent/sessions/${sessionId}`);
            
            const transformedMessages = data.history.map(msg => createMessage(msg.role, msg.content));
            setMessages(transformedMessages);
        } catch (error) {
            console.error('Failed to load history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const startNewChat = () => {
        setCurrentSessionId(null);
        setMessages([
            createMessage(
                'assistant',
                `Welcome back, ${user?.fullName?.split(' ')[0] || 'Strategic Partner'}. I am your TrustTrade Intelligence Agent.\n\nI'm ready to assist with marketplace analysis, negotiation strategy, and workflow optimization. How can I move the needle for you today?`,
                promptSets[user?.role] || promptSets.default
            )
        ]);
    };

    const deleteSession = async (e, sessionId) => {
        e.stopPropagation();
        try {
            await api.delete(`/agent/sessions/${sessionId}`);
            setSessions(prev => prev.filter(s => s.id !== sessionId));
            if (currentSessionId === sessionId) {
                startNewChat();
            }
        } catch (error) {
            console.error('Failed to delete session:', error);
        }
    };

    const streamAssistantMessage = async (content, quickReplies = []) => {
        const replyText = content?.trim() || 'No response text received.';
        const messageId = createMessageId('assistant');
        const runId = ++streamRunRef.current;

        setStreamingMessageId(messageId);
        setMessages((current) => [
            ...current,
            createMessage('assistant', replyText, [], {
                id: messageId,
                streamedContent: '',
                isStreaming: true
            })
        ]);

        let cursor = 0;
        while (cursor < replyText.length && runId === streamRunRef.current) {
            const chunkSize = getStreamChunkSize(replyText, cursor);
            const nextCursor = Math.min(replyText.length, cursor + chunkSize);
            const nextChunk = replyText.slice(cursor, nextCursor);
            const visibleText = replyText.slice(0, nextCursor);
            cursor = nextCursor;

            startTransition(() => {
                setMessages((current) =>
                    current.map((entry) =>
                        entry.id === messageId ? { ...entry, streamedContent: visibleText } : entry
                    )
                );
            });
            await wait(getStreamDelay(nextChunk));
        }

        if (runId !== streamRunRef.current) return;

        setMessages((current) =>
            current.map((entry) =>
                entry.id === messageId
                    ? { ...entry, streamedContent: replyText, quickReplies, isStreaming: false }
                    : entry
            )
        );
        setStreamingMessageId(null);
        
        // Refresh sessions list to show the new/updated session title
        fetchSessions();
    };

    const sendMessage = async (rawMessage) => {
        const message = rawMessage.trim();
        if (!message || isBusy) return;

        const userMessage = createMessage('user', message);
        const nextMessages = [...messagesRef.current, userMessage];

        setMessages(nextMessages);
        setInput('');
        setIsSending(true);

        try {
            const { data } = await api.post('/agent/chat', {
                message,
                sessionId: currentSessionId,
                history: nextMessages
                    .filter(m => m.role === 'user' || m.role === 'assistant')
                    .slice(-8)
                    .map(m => ({ role: m.role, content: m.content }))
            });

            if (data.sessionId && !currentSessionId) {
                setCurrentSessionId(data.sessionId);
            }

            setIsSending(false);
            await streamAssistantMessage(
                data.reply,
                Array.isArray(data.quickReplies) ? data.quickReplies : []
            );
        } catch (error) {
            setIsSending(false);
            const errorMessage = 'Communication error with Intelligence Core. Please check your connection.';
            await streamAssistantMessage(errorMessage);
        }
    };

    const isBusy = isSending || Boolean(streamingMessageId);
    const visiblePrompts = promptSets[user?.role] || promptSets.default;
    const activeThinkingStage = thinkingStages[thinkingIndex];

    return (
        <div className="relative z-10 h-[calc(100vh-64px)] overflow-hidden bg-transparent font-sans">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden opacity-10">
                <div className="h-[800px] w-[800px] animate-pulse rounded-full bg-blue-500/30 blur-[150px]" />
            </div>

            <div className="mx-auto flex h-full w-full max-w-[1600px] gap-4 p-4 lg:p-6">
                {/* Sidebar */}
                <aside className="hidden w-80 flex-col gap-4 lg:flex">
                    <div className="flex flex-col gap-4 h-full rounded-[32px] border border-white/5 bg-[#0a0f1d]/40 p-4 backdrop-blur-2xl">
                        <button
                            onClick={startNewChat}
                            className="flex items-center gap-3 w-full rounded-2xl border border-blue-500/30 bg-blue-600/10 px-4 py-3 text-sm font-bold text-blue-400 transition-all hover:bg-blue-600/20 active:scale-95"
                        >
                            <Plus className="h-5 w-5" />
                            New Conversation
                        </button>

                        <div className="flex-1 overflow-y-auto space-y-2 scrollbar-none">
                            <h3 className="px-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                Recent History
                            </h3>
                            
                            {isLoadingSessions ? (
                                <div className="flex items-center justify-center p-8 text-slate-500">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : sessions.length === 0 ? (
                                <div className="p-4 text-center text-xs text-slate-500 italic">
                                    No past sessions found.
                                </div>
                            ) : (
                                sessions.map(session => (
                                    <div
                                        key={session.id}
                                        onClick={() => loadSession(session.id)}
                                        className={`group relative flex items-center justify-between gap-3 cursor-pointer rounded-xl p-3 transition-all ${
                                            currentSessionId === session.id 
                                            ? 'bg-blue-600/20 border border-blue-500/30 text-white' 
                                            : 'hover:bg-white/5 text-slate-400'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <MessageSquare className={`h-4 w-4 shrink-0 ${currentSessionId === session.id ? 'text-blue-400' : 'text-slate-600'}`} />
                                            <span className="truncate text-xs font-semibold">{session.title}</span>
                                        </div>
                                        <button 
                                            onClick={(e) => deleteSession(e, session.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-auto pt-4 border-t border-white/5">
                            <div className="flex items-center gap-4 p-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/20 text-blue-400">
                                    <Bot className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400/70">Intelligence</p>
                                    <h2 className="text-sm font-black italic tracking-tight text-white">AGENT PRO</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Chat Area */}
                <main className="relative flex flex-1 flex-col overflow-hidden rounded-[32px] border border-white/5 bg-[#0a0f1d]/40 shadow-[0_40px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
                    <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-500/10 text-blue-400 lg:hidden">
                                <Bot className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                                    Strategic Command
                                    <span className="hidden sm:inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-blue-400">
                                        LPU CLUSTER
                                    </span>
                                </h1>
                                <p className="text-[10px] font-medium text-slate-500">Active Node: Neural-Tier-1</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="hidden items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-[10px] font-bold text-slate-400 sm:flex">
                                <Zap className="h-3 w-3 text-yellow-500" />
                                3.2 TFLOPS
                            </div>
                            <Link to="/dashboard" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all">
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto px-4 py-8 lg:px-6">
                        <div className="mx-auto flex max-w-4xl flex-col gap-8">
                            {isLoadingHistory ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Reconstructing Memory...</p>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {messages.map((message) => {
                                        const isAssistant = message.role === 'assistant';
                                        return (
                                            <motion.div
                                                key={message.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
                                            >
                                                <div className={`relative max-w-[85%] rounded-[24px] px-5 py-4 shadow-xl sm:max-w-[75%] ${
                                                    isAssistant 
                                                    ? 'border border-white/10 bg-white/[0.03] text-slate-200' 
                                                    : 'bg-blue-600 text-white shadow-blue-900/20'
                                                }`}>
                                                    <div className={`mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${isAssistant ? 'text-blue-400/80' : 'text-blue-100/60'}`}>
                                                        {isAssistant ? 'UNIT-01 RESPONSE' : 'COMMAND UPLOAD'}
                                                    </div>
                                                    <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed tracking-tight">
                                                        {isAssistant ? message.streamedContent : message.content}
                                                        {message.isStreaming && (
                                                            <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-blue-400 align-middle" />
                                                        )}
                                                    </p>
                                                    {isAssistant && !message.isStreaming && message.quickReplies?.length > 0 && (
                                                        <div className="mt-6 flex flex-wrap gap-2">
                                                            {message.quickReplies.map((prompt) => (
                                                                <button
                                                                    key={prompt}
                                                                    onClick={() => sendMessage(prompt)}
                                                                    disabled={isBusy}
                                                                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[10px] font-bold text-slate-300 transition-all hover:bg-white/10 active:scale-95 disabled:opacity-30"
                                                                >
                                                                    {prompt}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            )}
                            
                            {isSending && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                    <div className="max-w-[85%] rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-4 text-slate-400 sm:max-w-[75%]">
                                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-blue-400/80">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            {activeThinkingStage.label}
                                        </div>
                                        <p className="mt-3 text-sm font-medium italic text-slate-500">{activeThinkingStage.detail}</p>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="px-4 py-6 lg:px-8">
                        <form
                            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                            className="relative mx-auto max-w-4xl"
                        >
                            <div className="group relative">
                                <div className="absolute -inset-0.5 rounded-[28px] bg-gradient-to-r from-blue-600 to-indigo-600 opacity-20 blur-md transition duration-500 group-focus-within:opacity-40" />
                                <div className="relative rounded-[26px] border border-white/10 bg-[#0a0f1d] p-1 shadow-2xl transition-all group-focus-within:border-blue-500/40">
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                sendMessage(input);
                                            }
                                        }}
                                        rows={2}
                                        placeholder="Query TrustTrade Strategic Mind..."
                                        className="h-20 w-full resize-none bg-transparent px-5 py-4 text-sm font-medium text-slate-100 outline-none placeholder:text-slate-600/70"
                                    />
                                    <div className="flex items-center justify-between border-t border-white/5 py-3 pl-5 pr-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 sm:block hidden">
                                            Ctrl+Enter to Execute
                                        </p>
                                        <button
                                            type="submit"
                                            disabled={isBusy || !input.trim()}
                                            className="flex h-10 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-blue-500 active:scale-95 disabled:opacity-30"
                                        >
                                            <Send className="h-4 w-4" />
                                            {isBusy ? 'Transmitting' : 'Execute'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AIAgent;
