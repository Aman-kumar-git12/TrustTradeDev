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
    ChevronUp,
    CreditCard,
    Zap,
    Plus,
    Receipt,
    Trash2,
    Clock,
    WifiOff,
    Star,
    Tag,
    ChevronRight,
    X
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import networkErrorImg from '../assets/images/network-error.png';

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

const LOCAL_SESSION_PREFIX = 'local-';
const LOCAL_SESSION_STORAGE_KEY = 'trusttrade_agent_local_sessions';

const createMessageId = (role) => `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const createLocalSessionId = () => `${LOCAL_SESSION_PREFIX}${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createMessage = (role, content, quickReplies = [], overrides = {}) => ({
    id: overrides.id || createMessageId(role),
    role,
    content,
    quickReplies: Array.isArray(quickReplies) ? quickReplies : [],
    streamedContent: overrides.streamedContent ?? content,
    isStreaming: overrides.isStreaming ?? false,
    metadata: overrides.metadata || {},
    ...overrides
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

const isLocalSessionId = (sessionId) => typeof sessionId === 'string' && sessionId.startsWith(LOCAL_SESSION_PREFIX);
const resolveUserId = (user) => String(user?._id || user?.id || '');

const readLocalSessions = () => {
    if (typeof window === 'undefined') return [];

    try {
        const raw = window.localStorage.getItem(LOCAL_SESSION_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error('Failed to read local AI sessions:', error);
        return [];
    }
};

const writeLocalSessions = (sessions) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LOCAL_SESSION_STORAGE_KEY, JSON.stringify(sessions));
};

const listLocalSessions = (userId) =>
    readLocalSessions()
        .filter((session) => userId && session.userId === userId && !session.deletedAt)
        .map((session) => ({
            id: session.id,
            title: session.title || 'Untitled',
            mode: session.mode || 'conversation',
            updatedAt: session.updatedAt || new Date(0).toISOString()
        }))
        .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));

const getLocalSession = (sessionId, userId) =>
    (() => {
        const session = readLocalSessions().find((entry) => entry.id === sessionId && entry.userId === userId) || null;
        if (!session || session.deletedAt) return null;
        return { ...session, mode: session.mode || 'conversation' };
    })();

const upsertLocalSession = ({ id, userId, messages, mode = 'conversation' }) => {
    if (!id) return;

    const normalizedMessages = (messages || [])
        .filter((message) => message?.role === 'user' || message?.role === 'assistant')
        .map((message) => ({
            role: message.role,
            content: message.content,
            metadata: message.metadata || {},
            quickReplies: Array.isArray(message.quickReplies) ? message.quickReplies : []
        }));

    const firstUserMessage = normalizedMessages.find((message) => message.role === 'user');
    const titleSource = firstUserMessage?.content?.trim() || 'New Conversation';
    const title = titleSource.length > 40 ? `${titleSource.slice(0, 40)}...` : titleSource;
    const updatedAt = new Date().toISOString();

    const sessions = readLocalSessions();
    const nextSession = { id, userId, title, updatedAt, mode, messages: normalizedMessages };
    const index = sessions.findIndex((session) => session.id === id);

    if (index >= 0) {
        sessions[index] = nextSession;
    } else {
        sessions.push(nextSession);
    }

    sessions.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    writeLocalSessions(sessions);
};

const removeLocalSession = (sessionId) => {
    const sessions = readLocalSessions().map((session) =>
        session.id === sessionId
            ? {
                ...session,
                deletedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            : session
    );
    writeLocalSessions(sessions);
};

const mergeSessions = (remoteSessions, localSessions) => {
    const seen = new Set();
    const merged = [];

    [...(remoteSessions || []), ...(localSessions || [])].forEach((session) => {
        if (!session?.id || seen.has(session.id) || session.deletedAt) return;
        seen.add(session.id);
        merged.push(session);
    });

    return merged.sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
};

const OFFLINE_REPLY =
    "Looks like there's a disruption in the neural link! My connection to the Intelligence Core is temporarily offline. Please verify your network signal, and I'll be ready to assist as soon as we're reconnected.";

const resolveSessionMode = (session) => (session?.mode === 'agent' ? 'agent' : 'conversation');

const AIAgent = () => {
    const { user } = useAuth();
    const currentUserId = resolveUserId(user);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [thinkingIndex, setThinkingIndex] = useState(0);
    const [streamingMessageId, setStreamingMessageId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [isLoadingSessions, setIsLoadingSessions] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState(null);
    const [isMobileHistoryOpen, setIsMobileHistoryOpen] = useState(false);
    const [chatMode, setChatMode] = useState('conversation');
    const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
    const [initiatingPayments, setInitiatingPayments] = useState({});

    // Consolidated mode switcher that handles history restoration
    const switchMode = (mode) => {
        if (chatMode === mode) return;
        
        setIsModeMenuOpen(false);
        setChatMode(mode);
        
        // Find the most recent session for the target mode
        const targetSessions = sessions.filter(s => resolveSessionMode(s) === mode);
        if (targetSessions.length > 0) {
            loadSession(targetSessions[0].id);
        } else {
            startNewChat(mode);
        }
    };
    const [isOffline, setIsOffline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine === false : false
    );

    const messagesEndRef = useRef(null);
    const streamRunRef = useRef(0);
    const messagesRef = useRef(messages);
    const isSessionSwitchRef = useRef(false);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        const isSwitch = isSessionSwitchRef.current;
        messagesEndRef.current?.scrollIntoView({
            behavior: isSwitch ? 'auto' : (streamingMessageId ? 'auto' : 'smooth')
        });
        if (isSwitch && messages.length > 0) {
            isSessionSwitchRef.current = false;
        }
    }, [messages, isSending, streamingMessageId]);

    useEffect(() => {
        if (!isSending) {
            setThinkingIndex(0);
            return undefined;
        }
        const delay = chatMode === 'agent' ? 1400 : 800;
        const intervalId = window.setInterval(() => {
            setThinkingIndex((current) => (current + 1) % thinkingStages.length);
        }, delay);
        return () => window.clearInterval(intervalId);
    }, [isSending]);

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const visibleSessions = sessions.filter((session) => resolveSessionMode(session) === chatMode);

    // Initial load: Fetch sessions
    useEffect(() => {
        if (!currentUserId) {
            setSessions([]);
            setMessages([]);
            setCurrentSessionId(null);
            setIsLoadingSessions(false);
            return;
        }

        setSessions([]);
        setMessages([]);
        setCurrentSessionId(null);
        fetchSessions(currentUserId);
    }, [currentUserId]);

    const fetchSessions = async (targetUserId = currentUserId) => {
        if (!targetUserId) {
            setSessions([]);
            return;
        }

        const localSessions = listLocalSessions(targetUserId);
        try {
            setIsLoadingSessions(true);
            const { data } = await api.get('/agent/sessions');
            const mergedSessions = mergeSessions(data, localSessions);
            setSessions(mergedSessions);

            if (!currentSessionId && messagesRef.current.length === 0) {
                const preferredSession = mergedSessions.find((session) => resolveSessionMode(session) === chatMode) || mergedSessions[0];
                if (preferredSession) {
                    loadSession(preferredSession.id);
                } else {
                    startNewChat();
                }
            }
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            setSessions(localSessions);
            if (!currentSessionId && messagesRef.current.length === 0) {
                const preferredSession = localSessions.find((session) => resolveSessionMode(session) === chatMode) || localSessions[0];
                if (preferredSession) {
                    loadSession(preferredSession.id);
                } else {
                    startNewChat();
                }
            }
        } finally {
            setIsLoadingSessions(false);
        }
    };

    const loadSession = async (sessionId) => {
        if (currentSessionId === sessionId) return;
        isSessionSwitchRef.current = true;

        if (isLocalSessionId(sessionId)) {
            const session = getLocalSession(sessionId, currentUserId);
            if (!session) {
                setSessions((current) => current.filter((entry) => entry.id !== sessionId));
                startNewChat();
                return;
            }
            setChatMode(resolveSessionMode(session));
            setCurrentSessionId(sessionId);
            setMessages((session?.messages || []).map((msg) =>
                createMessage(msg.role, msg.content, msg.quickReplies || [], { metadata: msg.metadata || {} })
            ));
            return;
        }

        try {
            setIsLoadingHistory(true);
            setCurrentSessionId(sessionId);
            const { data } = await api.get(`/agent/sessions/${sessionId}`);

            setChatMode(resolveSessionMode(data));
            const transformedMessages = data.history.map((msg) =>
                createMessage(msg.role, msg.content, msg.quickReplies || [], { metadata: msg.metadata || {} })
            );
            setMessages(transformedMessages);
        } catch (error) {
            console.error('Failed to load history:', error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const startNewChat = (mode = chatMode) => {
        const nextMode = mode === 'agent' || mode === 'conversation' ? mode : chatMode;
        isSessionSwitchRef.current = true;
        setChatMode(nextMode);
        setCurrentSessionId(createLocalSessionId());
        
        const greeting = nextMode === 'agent' 
            ? "Agent mode is live. Tell me what you want to buy, and I'll guide you step by step from discovery to quote to secure checkout."
            : `Welcome back, ${user?.fullName?.split(' ')[0] || 'Strategic Partner'}.\n\nI can walk you through the full TrustTrade website with clear, thoughtful answers about features, buying, selling, analytics, negotiation, and checkout. What would you like to explore first?`;
            
        const initialPrompts = nextMode === 'agent'
            ? ["Start buying", "Find an asset", "Compare options"]
            : [];

        setMessages([
            createMessage('assistant', greeting, initialPrompts)
        ]);
    };

    const triggerDeleteSession = (e, sessionId) => {
        e.stopPropagation();
        setSessionToDelete(sessionId);
    };

    const confirmDeleteSession = async () => {
        if (!sessionToDelete) return;
        const targetId = sessionToDelete;
        
        // 1. Optimistic UI: Remove from list immediately
        setSessions(prev => prev.filter(s => s.id !== targetId));
        if (currentSessionId === targetId) {
            startNewChat();
        }

        try {
            // 2. Perform background delete (Dual Wipe)
            // First, scrub the local storage for immediate browser consistency
            removeLocalSession(targetId);

            // Second, attempt server-side purge from MongoDB
            // Even local-prefix sessions are synced, so we must tell the backend to wipe them
            await api.delete(`/agent/sessions/${targetId}`);
            
            // 3. Final sync re-validation
            fetchSessions();
        } catch (error) {
            console.warn('Backend sync failed (already deleted or local-only):', error.message);
            // Re-fetch to ensure the final state is consistent with the server
            fetchSessions();
        } finally {
            setSessionToDelete(null);
        }
    };

    const streamAssistantMessage = async (content, quickReplies = [], sessionIdForSave = null, baseMessages = [], options = {}) => {
        const replyText = content?.trim() || 'No response text received.';
        const messageId = createMessageId('assistant');
        const runId = ++streamRunRef.current;

        setStreamingMessageId(messageId);
        setMessages((current) => [
            ...current,
            createMessage('assistant', replyText, [], {
                id: messageId,
                streamedContent: '',
                isStreaming: true,
                ...options
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
                    ? { ...entry, streamedContent: replyText, quickReplies, isStreaming: false, ...options }
                    : entry
            )
        );
        setStreamingMessageId(null);

        if (isLocalSessionId(sessionIdForSave)) {
            upsertLocalSession({
                id: sessionIdForSave,
                userId: currentUserId,
                mode: chatMode,
                messages: [
                    ...(baseMessages || []),
                    { role: 'assistant', content: replyText, quickReplies, ...options }
                ]
            });
        }

        // Update local sessions state manually to avoid full re-fetch/list flicker
        setSessions(prev => {
            const sid = sessionIdForSave || currentSessionId;
            const existingIndex = prev.findIndex(s => s.id === sid);
            const firstUserMsg = baseMessages.find(m => m.role === 'user');
            const titleSource = firstUserMsg?.content?.trim() || 'New Conversation';
            const title = titleSource.length > 40 ? `${titleSource.slice(0, 40)}...` : titleSource;
            const updatedAt = new Date().toISOString();

            if (existingIndex >= 0) {
                const next = [...prev];
                const updatedSession = {
                    ...next[existingIndex],
                    title: (next[existingIndex].title === 'New Conversation' || next[existingIndex].title === 'Untitled') ? title : next[existingIndex].title,
                    updatedAt
                };
                next.splice(existingIndex, 1);
                return [updatedSession, ...next];
            } else if (sid) {
                return [{
                    id: sid,
                    title,
                    mode: chatMode,
                    updatedAt
                }, ...prev];
            }
            return prev;
        });
    };

    const showOfflineAssistantMessage = async (baseMessages) => {
        const localSessionId = currentSessionId || createLocalSessionId();
        if (currentSessionId !== localSessionId) {
            setCurrentSessionId(localSessionId);
        }
        upsertLocalSession({
            id: localSessionId,
            userId: currentUserId,
            mode: chatMode,
            messages: baseMessages
        });
        await streamAssistantMessage(
            OFFLINE_REPLY,
            ['Retry Connection'],
            localSessionId,
            baseMessages,
            { isErrorState: true }
        );
    };

    const sendMessage = async (rawMessage, options = {}) => {
        const message = rawMessage.trim();
        if (!message || isBusy) return null;

        const userMessage = createMessage('user', message);
        const nextMessages = [...messagesRef.current, userMessage];

        setMessages(nextMessages);
        setInput('');
        setIsSending(true);

        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
            setIsSending(false);
            await showOfflineAssistantMessage(nextMessages);
            return null;
        }

        try {
            const { data } = await api.post('/agent/chat', {
                message,
                mode: chatMode,
                sessionId: currentSessionId,
                metadata: options.metadata || {},
                history: nextMessages
                    .filter(m => m.role === 'user' || m.role === 'assistant')
                    .slice(-8)
                    .map(m => ({ role: m.role, content: m.content }))
            });

            let resolvedSessionId = currentSessionId;

            if (data.sessionId) {
                resolvedSessionId = data.sessionId;

                if (currentSessionId !== data.sessionId) {
                    if (isLocalSessionId(currentSessionId)) {
                        removeLocalSession(currentSessionId);
                    }
                    setCurrentSessionId(data.sessionId);
                }
            } else {
                resolvedSessionId = currentSessionId || createLocalSessionId();
                if (currentSessionId !== resolvedSessionId) {
                    setCurrentSessionId(resolvedSessionId);
                }
                upsertLocalSession({
                    id: resolvedSessionId,
                    userId: currentUserId,
                    mode: chatMode,
                    messages: nextMessages
                });
            }

            setIsSending(false);
            await streamAssistantMessage(
                data.reply,
                Array.isArray(data.quickReplies) ? data.quickReplies : [],
                resolvedSessionId,
                nextMessages,
                { 
                    toolCalls: data.toolCalls || [],
                    metadata: data.metadata || {}
                }
            );
            return { data, sessionId: resolvedSessionId };
        } catch (error) {
            setIsSending(false);
            await showOfflineAssistantMessage(nextMessages);
            return null;
        }
    };

    const isBusy = isSending || Boolean(streamingMessageId);
    const activeThinkingStage = thinkingStages[thinkingIndex];

    return (
        <div className="relative z-10 h-[calc(100vh-64px)] overflow-hidden bg-transparent font-sans">


            <div className="mx-auto flex h-full w-full max-w-[1600px] gap-4 p-4 lg:p-6">
                {/* Sidebar */}
                <aside className="hidden w-80 flex-col gap-4 lg:flex">
                    <div className="flex flex-col gap-4 h-full rounded-[32px] border border-chat-border bg-chat-card p-4 backdrop-blur-2xl shadow-xl">
                        <button
                            onClick={startNewChat}
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
                                        onClick={() => loadSession(session.id)}
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
                                            onClick={(e) => triggerDeleteSession(e, session.id)}
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

                {/* Main Chat Area */}
                <main className="relative flex flex-1 flex-col overflow-visible rounded-[32px] border border-chat-border bg-chat-bg/40 shadow-[0_40px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
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
                                onClick={() => setIsMobileHistoryOpen(true)}
                                className="lg:hidden flex items-center justify-center rounded-xl bg-chat-card p-2 text-chat-text-primary transition-all hover:bg-chat-accent/10"
                            >
                                <Clock className="h-4 w-4" />
                            </button>
                            <Link to="/dashboard" className="hidden items-center justify-center rounded-xl bg-chat-card p-2 text-chat-text-primary transition-all hover:bg-chat-accent/10 lg:flex">
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto px-4 py-8 lg:px-6">
                        <div className="mx-auto flex max-w-4xl flex-col gap-8">
                            {isOffline && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="overflow-hidden rounded-[28px] border border-red-500/30 bg-red-500/[0.04] shadow-[0_20px_60px_rgba(239,68,68,0.12)]"
                                >
                                    <div className="grid gap-0 md:grid-cols-[260px_1fr]">
                                        <div className="relative min-h-[220px] border-b border-red-500/20 md:min-h-full md:border-b-0 md:border-r">
                                            <div className="absolute inset-0 bg-red-500/5" />
                                            <img
                                                src={networkErrorImg}
                                                alt="Network disconnected"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center gap-4 p-6">
                                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-red-400">
                                                <WifiOff className="h-4 w-4" />
                                                Network Disconnected
                                            </div>
                                            <h2 className="text-xl font-black tracking-tight text-chat-text-primary">
                                                Intelligence Core is offline right now
                                            </h2>
                                            <p className="text-sm font-medium leading-relaxed text-chat-text-secondary">
                                                Your internet connection looks down, so the AI agent cannot reach the backend.
                                                Reconnect to the network and then send your message again.
                                            </p>
                                            <button
                                                onClick={() => window.location.reload()}
                                                className="mt-1 w-fit rounded-xl bg-red-500/10 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-red-500 transition-all hover:bg-red-500/20 active:scale-95"
                                            >
                                                Try Reconnecting
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {isLoadingHistory ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="h-10 w-10 animate-spin text-chat-accent" />
                                    <p className="text-sm font-bold uppercase tracking-widest text-chat-text-secondary">Reconstructing Memory...</p>
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
                                                <div className={`relative max-w-[85%] rounded-[24px] px-5 py-4 shadow-xl sm:max-w-[75%] ${message.isErrorState
                                                    ? 'border border-red-500/20 bg-red-500/[0.03] text-chat-text-primary'
                                                    : isAssistant
                                                        ? 'border border-chat-bubble-assistant-border bg-chat-bubble-assistant-bg text-chat-text-primary'
                                                        : 'bg-chat-bubble-user-bg text-white shadow-chat-bubble-user-shadow'
                                                    }`}>
                                                    <div className={`mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${message.isErrorState ? 'text-red-400/80' : isAssistant ? 'text-chat-accent/80' : 'text-white/60'
                                                        }`}>
                                                        {message.isErrorState && <WifiOff className="h-3 w-3" />}
                                                        {message.isErrorState ? 'CONNECTION LOST' : isAssistant ? 'UNIT-01 RESPONSE' : 'COMMAND UPLOAD'}
                                                    </div>

                                                    {message.isErrorState && (
                                                        <div className="mb-4 overflow-hidden rounded-xl border border-red-500/20 shadow-[-10px_0_30px_rgba(239,68,68,0.1)] relative">
                                                            <div className="absolute inset-0 bg-red-500/5 mix-blend-overlay"></div>
                                                            <img
                                                                src={networkErrorImg}
                                                                alt="Network Error Robot"
                                                                className="w-full max-h-[300px] object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                                                            />
                                                        </div>
                                                    )}

                                                    <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed tracking-tight">
                                                        {isAssistant ? message.streamedContent : message.content}
                                                        {message.isStreaming && (
                                                            <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-chat-accent align-middle" />
                                                        )}
                                                    </p>

                                                    {isAssistant && !message.isStreaming && message.metadata?.active_quote && (
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
                                                                        <span className="font-mono">₹{message.metadata.active_quote.basePrice}</span>
                                                                    </div>
                                                                    <div className="flex justify-between text-chat-text-secondary">
                                                                        <span>Quantity</span>
                                                                        <span className="font-mono">x{message.metadata.active_quote.quantity}</span>
                                                                    </div>
                                                                    <div className="flex justify-between text-chat-text-secondary">
                                                                        <span>Strategic Platform Fee</span>
                                                                        <span className="font-mono">₹{message.metadata.active_quote.platformFee}</span>
                                                                    </div>
                                                                    <div className="flex justify-between text-chat-text-secondary">
                                                                        <span>Estimated Tax</span>
                                                                        <span className="font-mono">₹{message.metadata.active_quote.tax}</span>
                                                                    </div>
                                                                    <div className="pt-3 mt-3 border-t border-chat-border/50 flex justify-between text-base font-black text-chat-text-primary">
                                                                        <span className="uppercase tracking-tighter">Total All-In Cost</span>
                                                                        <span className="text-chat-accent font-mono">₹{message.metadata.active_quote.total}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="p-4 bg-chat-accent/5 flex gap-3 relative z-20">
                                                                <button
                                                                    disabled={isBusy || message.metadata?.paymentOrder?.is_completed || initiatingPayments[message.id]}
                                                                    onClick={async () => {
                                                                        const { loadRazorpay, startAgentPayment } = await import('../assets/razorpay');
                                                                        const isLoaded = await loadRazorpay();
                                                                        if (!isLoaded) return;

                                                                        // Mark as initiating locally
                                                                        setInitiatingPayments(prev => ({ ...prev, [message.id]: true }));

                                                                        try {
                                                                            // 1. Check if we already have the payment details
                                                                            let paymentOrder = message.metadata?.paymentOrder;
                                                                            
                                                                            // 2. If not, ask the Agent to prepare them
                                                                            if (!paymentOrder?.razorpayOrderId) {
                                                                                const res = await sendMessage("Pay Securely Now");
                                                                                paymentOrder = res?.data?.metadata?.paymentOrder;
                                                                            }

                                                                            // 3. Initiate if we have the order details now
                                                                            if (paymentOrder?.razorpayOrderId) {
                                                                                startAgentPayment(paymentOrder, { buyerName: user?.fullName, buyerEmail: user?.email }, async (res) => {
                                                                                    // Authoritative verification first
                                                                                    try {
                                                                                        await api.post('/agent/complete-purchase', {
                                                                                            razorpayOrderId: res.razorpay_order_id,
                                                                                            razorpayPaymentId: res.razorpay_payment_id,
                                                                                            razorpaySignature: res.razorpay_signature
                                                                                        });
                                                                                        
                                                                                        setInitiatingPayments(prev => ({ ...prev, [message.id]: false }));
                                                                                         await sendMessage("I completed payment in the app.", {
                                                                                        metadata: {
                                                                                            paymentVerification: {
                                                                                                razorpayOrderId: res.razorpay_order_id,
                                                                                                razorpayPaymentId: res.razorpay_payment_id,
                                                                                                razorpaySignature: res.razorpay_signature
                                                                                            }
                                                                                        }
                                                                                    }); } catch(e) { console.error(e); }
                                                                                }, (err) => {
                                                                                    console.error("Payment failed:", err);
                                                                                    setInitiatingPayments(prev => ({ ...prev, [message.id]: false }));
                                                                                    sendMessage("Payment was not completed. Can we try again?");
                                                                                });
                                                                            } else {
                                                                                setInitiatingPayments(prev => ({ ...prev, [message.id]: false }));
                                                                            }
                                                                        } catch (err) {
                                                                            setInitiatingPayments(prev => ({ ...prev, [message.id]: false }));
                                                                        }
                                                                    }}
                                                                    className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-black text-white transition-all active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:grayscale ${message.metadata?.paymentOrder?.is_completed ? 'bg-chat-accent/40' : 'bg-chat-accent hover:opacity-90'}`}
                                                                >
                                                                    {message.metadata?.paymentOrder?.is_completed ? (
                                                                        <>
                                                                            <ShieldCheck className="h-4 w-4" />
                                                                            PURCHASE COMPLETED
                                                                        </>
                                                                    ) : initiatingPayments[message.id] ? (
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
                                                                    onClick={() => sendMessage("Cancel this purchase.")}
                                                                    className="rounded-xl bg-transparent border border-chat-border px-4 py-3 text-xs font-bold text-chat-text-secondary transition-all hover:bg-chat-bg hover:text-chat-text-primary active:scale-95 disabled:opacity-50"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {isAssistant && !message.isStreaming && message.toolCalls && message.toolCalls.length > 0 && (
                                                        <div className="mt-6 flex flex-col gap-4">
                                                            {message.toolCalls.map((tool) => (
                                                                <div key={tool.id} className="rounded-2xl border border-chat-accent/30 bg-chat-card p-4 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                                                                    <div className="absolute inset-0 bg-chat-accent/5 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                                                    <div className="relative z-10 flex flex-col">
                                                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-chat-accent mb-2">
                                                                            <ShieldCheck className="h-4 w-4" />
                                                                            Action Required: {tool.function?.name?.replace(/_/g, ' ')}
                                                                        </div>
                                                                        <p className="text-xs text-chat-text-secondary mb-4 font-mono bg-black/10 p-2 rounded-lg border border-chat-border break-all">
                                                                            Payload: {JSON.stringify(tool.function?.arguments)}
                                                                        </p>
                                                                        <div className="flex gap-3">
                                                                            <button
                                                                                disabled={isBusy}
                                                                                onClick={() => sendMessage(`Execute Action: ${tool.function?.name}`)}
                                                                                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-chat-accent hover:opacity-90 px-4 py-2.5 text-xs font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                                                                            >
                                                                                <Zap className="h-3 w-3" />
                                                                                Confirm Proceed
                                                                            </button>
                                                                            <button
                                                                                disabled={isBusy}
                                                                                onClick={() => sendMessage('Cancel the action.')}
                                                                                className="flex-1 rounded-xl bg-transparent border border-chat-border px-4 py-2.5 text-xs font-bold text-chat-text-primary transition-all hover:bg-chat-bg active:scale-95 disabled:opacity-50"
                                                                            >
                                                                                Dismiss
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}                                                     {isAssistant && !message.isStreaming && message.metadata?.active_options?.length > 0 && (
                                                         <div className="mt-6 flex flex-col gap-4">
                                                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                 {message.metadata.active_options.map((asset, idx) => {
                                                                     const globalIdx = (message.metadata.optionOffset || 0) + idx + 1;
                                                                     return (
                                                                         <button
                                                                             key={asset._id}
                                                                             disabled={isBusy}
                                                                             onClick={() => sendMessage(`Select Option ${globalIdx}`)}
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
                                                             {message.metadata.has_more && (
                                                                <button
                                                                    disabled={isBusy}
                                                                    onClick={() => sendMessage("Show More Options")}
                                                                    className="w-full py-2 rounded-xl border border-dashed border-chat-border text-[10px] font-bold text-chat-text-secondary hover:border-chat-accent/50 hover:text-chat-accent transition-all"
                                                                >
                                                                    Show More Options
                                                                </button>
                                                             )}
                                                         </div>
                                                     )}

                                                    {isAssistant && !message.isStreaming && message.quickReplies?.length > 0 && (chatMode === 'agent' || message.isErrorState) && (
                                                        <div className="mt-6 flex flex-wrap gap-2">
                                                            {message.quickReplies.map((prompt) => (
                                                                <button
                                                                    key={prompt}
                                                                    onClick={() => sendMessage(prompt)}
                                                                    disabled={isBusy}
                                                                    className={`rounded-xl border px-3 py-2 text-[10px] font-bold transition-all hover:bg-chat-bg active:scale-95 disabled:opacity-30 ${message.isErrorState
                                                                        ? 'border-red-500/30 bg-red-500/10 text-red-300'
                                                                        : 'border-chat-border bg-transparent text-chat-text-primary'
                                                                        }`}
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
                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                                    <div className="max-w-[85%] rounded-[24px] border border-chat-bubble-assistant-border bg-chat-bubble-assistant-bg px-5 py-4 text-chat-text-secondary sm:max-w-[75%] shadow-xl">
                                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-chat-accent/80 mb-1">
                                            <div className="h-1.5 w-1.5 rounded-full bg-chat-accent animate-pulse" />
                                            SYSTEM THINKING
                                        </div>
                                        <p className="text-sm font-medium italic opacity-70">
                                            {activeThinkingStage.label}...
                                        </p>
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
                                <div className="relative rounded-[20px] border border-chat-input-glow bg-chat-input-bg p-1 transition-all duration-300 group-focus-within:border-chat-accent group-focus-within:shadow-[0_0_12px_var(--chat-accent)]">
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

                    {/* Mobile History Drawer */}
                    <AnimatePresence>
                        {isMobileHistoryOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: '100%' }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: '100%' }}
                                transition={{ damping: 25, stiffness: 200 }}
                                className="absolute inset-0 z-[100] flex flex-col bg-chat-bg lg:hidden"
                            >
                                <div className="p-4 border-b border-chat-border flex items-center justify-between">
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-chat-text-secondary flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        Conversation History
                                    </h3>
                                    <button
                                        onClick={() => setIsMobileHistoryOpen(false)}
                                        className="p-2 rounded-xl text-chat-text-secondary hover:text-chat-text-primary hover:bg-chat-card transition-all"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="p-4 flex-1 overflow-y-auto w-full">
                                    <button
                                        onClick={() => { startNewChat(); setIsMobileHistoryOpen(false); }}
                                        className="flex items-center justify-center gap-3 w-full mb-6 mx-auto rounded-2xl border border-chat-accent/30 bg-chat-accent/10 px-4 py-3 text-sm font-bold text-chat-accent transition-all hover:bg-chat-accent/20 active:scale-95"
                                    >
                                        <Plus className="h-5 w-5" />
                                        {chatMode === 'agent' ? 'New Agent Session' : 'New Conversation'}
                                    </button>

                                    <div className="flex flex-col gap-2 w-full mx-auto">
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
                                                    onClick={() => { loadSession(session.id); setIsMobileHistoryOpen(false); }}
                                                    className={`group relative flex items-center justify-between gap-3 cursor-pointer rounded-xl p-3 transition-all ${currentSessionId === session.id
                                                        ? 'bg-chat-accent/20 border border-chat-accent/30 text-chat-text-primary'
                                                        : 'hover:bg-chat-card text-chat-text-secondary'
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
                                                        onClick={(e) => triggerDeleteSession(e, session.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 text-chat-text-secondary hover:text-red-400 transition-all"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            <ConfirmationModal
                isOpen={!!sessionToDelete}
                title="Delete Conversation"
                message="Are you sure you want to delete this conversation? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isDangerous={true}
                onConfirm={confirmDeleteSession}
                onCancel={() => setSessionToDelete(null)}
            />
        </div>
    );
};

export default AIAgent;
