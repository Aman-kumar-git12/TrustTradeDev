import { startTransition, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2,
    WifiOff,
    X,
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import networkErrorImg from '../assets/images/network-error.png';

// Sub-components
import ChatSidebar from '../components/agent/ChatSidebar';
import ChatHeader from '../components/agent/ChatHeader';
import ChatInput from '../components/agent/ChatInput';
import MessageContent from '../components/agent/MessageContent';
import ActionCard from '../components/agent/ActionCard';
import ThinkingState from '../components/agent/ThinkingState';
import QuoteCard from '../components/agent/QuoteCard';

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

const getLocalSession = (sessionId, userId) => {
    const session = readLocalSessions().find((entry) => entry.id === sessionId && entry.userId === userId) || null;
    if (!session || session.deletedAt) return null;
    return { ...session, mode: session.mode || 'conversation' };
};

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
    if (index >= 0) sessions[index] = nextSession;
    else sessions.push(nextSession);
    sessions.sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
    writeLocalSessions(sessions);
};

const removeLocalSession = (sessionId) => {
    const sessions = readLocalSessions().map((session) =>
        session.id === sessionId ? { ...session, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : session
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

const OFFLINE_REPLY = "Looks like there's a disruption in the neural link! My connection to the Intelligence Core is temporarily offline. Please verify your network signal, and I'll be ready to assist as soon as we're reconnected.";
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
    const [isOffline, setIsOffline] = useState(typeof navigator !== 'undefined' ? navigator.onLine === false : false);

    const messagesEndRef = useRef(null);
    const streamRunRef = useRef(0);
    const messagesRef = useRef(messages);
    const isSessionSwitchRef = useRef(false);

    useEffect(() => { messagesRef.current = messages; }, [messages]);

    useEffect(() => {
        const isSwitch = isSessionSwitchRef.current;
        messagesEndRef.current?.scrollIntoView({
            behavior: isSwitch ? 'auto' : (streamingMessageId ? 'auto' : 'smooth')
        });
        if (isSwitch && messages.length > 0) isSessionSwitchRef.current = false;
    }, [messages, isSending, streamingMessageId]);

    useEffect(() => {
        if (!isSending) { setThinkingIndex(0); return; }
        const delay = chatMode === 'agent' ? 1400 : 800;
        const intervalId = window.setInterval(() => {
            setThinkingIndex((current) => (current + 1) % thinkingStages.length);
        }, delay);
        return () => window.clearInterval(intervalId);
    }, [isSending, chatMode]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
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

    useEffect(() => {
        if (!currentUserId) {
            setSessions([]); setMessages([]); setCurrentSessionId(null); setIsLoadingSessions(false);
            return;
        }
        fetchSessions(currentUserId);
    }, [currentUserId]);

    const fetchSessions = async (targetUserId = currentUserId) => {
        if (!targetUserId) { setSessions([]); return; }
        const localSessions = listLocalSessions(targetUserId);
        try {
            setIsLoadingSessions(true);
            const { data } = await api.get('/agent/sessions');
            const mergedSessions = mergeSessions(data, localSessions);
            setSessions(mergedSessions);
            if (!currentSessionId && messagesRef.current.length === 0) {
                const preferredSession = mergedSessions.find((session) => resolveSessionMode(session) === chatMode) || mergedSessions[0];
                if (preferredSession) loadSession(preferredSession.id);
                else startNewChat();
            }
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
            setSessions(localSessions);
            if (!currentSessionId && messagesRef.current.length === 0) {
                const preferredSession = localSessions.find((session) => resolveSessionMode(session) === chatMode) || localSessions[0];
                if (preferredSession) loadSession(preferredSession.id);
                else startNewChat();
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
            if (!session) { setSessions((current) => current.filter((e) => e.id !== sessionId)); startNewChat(); return; }
            setChatMode(resolveSessionMode(session));
            setCurrentSessionId(sessionId);
            setMessages((session?.messages || []).map((msg) =>
                createMessage(msg.role, msg.content, msg.quickReplies || [], { metadata: msg.metadata || {} })
            ));
            return;
        }
        try {
            setIsLoadingHistory(true); setCurrentSessionId(sessionId);
            const { data } = await api.get(`/agent/sessions/${sessionId}`);
            setChatMode(resolveSessionMode(data));
            const transformedMessages = data.history.map((msg) =>
                createMessage(msg.role, msg.content, msg.quickReplies || [], { metadata: msg.metadata || {} })
            );
            setMessages(transformedMessages);
        } catch (error) { console.error('Failed to load history:', error);
        } finally { setIsLoadingHistory(false); }
    };

    const startNewChat = (mode = chatMode) => {
        const nextMode = mode === 'agent' || mode === 'conversation' ? mode : chatMode;
        isSessionSwitchRef.current = true;
        setChatMode(nextMode);
        setCurrentSessionId(createLocalSessionId());
        const greeting = nextMode === 'agent' 
            ? "Agent mode is live. Tell me what you want to buy, and I'll guide you step by step from discovery to quote to secure checkout."
            : `Welcome back, ${user?.fullName?.split(' ')[0] || 'Strategic Partner'}.\n\nI can walk you through the full TrustTrade website with clear, thoughtful answers about features, buying, selling, analytics, negotiation, and checkout. What would you like to explore first?`;
        const initialPrompts = nextMode === 'agent' ? ["Start buying", "Find an asset", "Compare options"] : [];
        setMessages([createMessage('assistant', greeting, initialPrompts)]);
    };

    const switchMode = (mode) => {
        if (chatMode === mode) return;
        setIsModeMenuOpen(false);
        setChatMode(mode);
        const targetSessions = sessions.filter(s => resolveSessionMode(s) === mode);
        if (targetSessions.length > 0) loadSession(targetSessions[0].id);
        else startNewChat(mode);
    };

    const confirmDeleteSession = async () => {
        if (!sessionToDelete) return;
        const targetId = sessionToDelete;
        setSessions(prev => prev.filter(s => s.id !== targetId));
        if (currentSessionId === targetId) startNewChat();
        try {
            removeLocalSession(targetId);
            await api.delete(`/agent/sessions/${targetId}`);
            fetchSessions();
        } catch (error) { console.warn('Backend sync failed:', error.message); fetchSessions();
        } finally { setSessionToDelete(null); }
    };

    const streamAssistantMessage = async (content, quickReplies = [], sessionIdForSave = null, baseMessages = [], options = {}) => {
        const replyText = content?.trim() || 'No response text received.';
        const messageId = createMessageId('assistant');
        const runId = ++streamRunRef.current;
        setStreamingMessageId(messageId);
        setMessages((current) => [...current, createMessage('assistant', replyText, [], { id: messageId, streamedContent: '', isStreaming: true, ...options })]);
        let cursor = 0;
        while (cursor < replyText.length && runId === streamRunRef.current) {
            const chunkSize = getStreamChunkSize(replyText, cursor);
            const nextCursor = Math.min(replyText.length, cursor + chunkSize);
            const visibleText = replyText.slice(0, nextCursor);
            cursor = nextCursor;
            startTransition(() => {
                setMessages((current) => current.map((entry) => entry.id === messageId ? { ...entry, streamedContent: visibleText } : entry));
            });
            await wait(getStreamDelay(replyText.slice(cursor - chunkSize, cursor)));
        }
        if (runId !== streamRunRef.current) return;
        setMessages((current) => current.map((entry) => entry.id === messageId ? { ...entry, streamedContent: replyText, quickReplies, isStreaming: false, ...options } : entry));
        setStreamingMessageId(null);
        if (isLocalSessionId(sessionIdForSave)) {
            upsertLocalSession({ id: sessionIdForSave, userId: currentUserId, mode: chatMode, messages: [...(baseMessages || []), { role: 'assistant', content: replyText, quickReplies, ...options }] });
        }
        setSessions(prev => {
            const sid = sessionIdForSave || currentSessionId;
            const existingIndex = prev.findIndex(s => s.id === sid);
            const firstUserMsg = baseMessages.find(m => m.role === 'user');
            const titleSource = firstUserMsg?.content?.trim() || 'New Conversation';
            const title = titleSource.length > 40 ? `${titleSource.slice(0, 40)}...` : titleSource;
            const updatedAt = new Date().toISOString();
            if (existingIndex >= 0) {
                const next = [...prev];
                const updatedSession = { ...next[existingIndex], title: (next[existingIndex].title === 'New Conversation' || next[existingIndex].title === 'Untitled') ? title : next[existingIndex].title, updatedAt };
                next.splice(existingIndex, 1);
                return [updatedSession, ...next];
            } else if (sid) { return [{ id: sid, title, mode: chatMode, updatedAt }, ...prev]; }
            return prev;
        });
    };

    const sendMessage = async (rawMessage, options = {}) => {
        const message = rawMessage.trim();
        if (!message || isBusy) return null;
        const userMessage = createMessage('user', message);
        const nextMessages = [...messagesRef.current, userMessage];
        setMessages(nextMessages); setInput(''); setIsSending(true);
        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
            setIsSending(false); await showOfflineAssistantMessage(nextMessages); return null;
        }
        try {
            const targetPath = chatMode === 'agent' ? '/agent/chat/strategic' : '/agent/chat/conversation';
            const { data } = await api.post(targetPath, {
                message, sessionId: currentSessionId, metadata: options.metadata || {},
                history: nextMessages.filter(m => m.role === 'user' || m.role === 'assistant').slice(-8).map(m => ({ role: m.role, content: m.content }))
            });
            let resolvedSessionId = currentSessionId;
            if (data.sessionId) {
                resolvedSessionId = data.sessionId;
                if (currentSessionId !== data.sessionId) {
                    if (isLocalSessionId(currentSessionId)) removeLocalSession(currentSessionId);
                    setCurrentSessionId(data.sessionId);
                }
            } else {
                resolvedSessionId = currentSessionId || createLocalSessionId();
                if (currentSessionId !== resolvedSessionId) setCurrentSessionId(resolvedSessionId);
                upsertLocalSession({ id: resolvedSessionId, userId: currentUserId, mode: chatMode, messages: nextMessages });
            }
            setIsSending(false);
            await streamAssistantMessage(data.reply, Array.isArray(data.quickReplies) ? data.quickReplies : [], resolvedSessionId, nextMessages, { toolCalls: data.toolCalls || [], metadata: data.metadata || {} });
            return { data, sessionId: resolvedSessionId };
        } catch (error) { setIsSending(false); await showOfflineAssistantMessage(nextMessages); return null; }
    };

    const showOfflineAssistantMessage = async (baseMessages) => {
        const localSessionId = currentSessionId || createLocalSessionId();
        if (currentSessionId !== localSessionId) setCurrentSessionId(localSessionId);
        upsertLocalSession({ id: localSessionId, userId: currentUserId, mode: chatMode, messages: baseMessages });
        await streamAssistantMessage(OFFLINE_REPLY, ['Retry Connection'], localSessionId, baseMessages, { isErrorState: true });
    };

    const isBusy = isSending || Boolean(streamingMessageId);
    const activeThinkingStage = thinkingStages[thinkingIndex];

    const handlePayNow = async (message) => {
        const { loadRazorpay, startAgentPayment } = await import('../assets/razorpay');
        const isLoaded = await loadRazorpay();
        if (!isLoaded) return;
        setInitiatingPayments(prev => ({ ...prev, [message.id]: true }));
        try {
            let paymentOrder = message.metadata?.paymentOrder;
            if (!paymentOrder?.razorpayOrderId) {
                const res = await sendMessage("Pay Securely Now");
                paymentOrder = res?.data?.metadata?.paymentOrder;
            }
            if (paymentOrder?.razorpayOrderId) {
                startAgentPayment(paymentOrder, { buyerName: user?.fullName, buyerEmail: user?.email }, async (res) => {
                    try {
                        await api.post('/agent/complete-purchase', { razorpayOrderId: res.razorpay_order_id, razorpayPaymentId: res.razorpay_payment_id, razorpaySignature: res.razorpay_signature });
                        setInitiatingPayments(prev => ({ ...prev, [message.id]: false }));
                        await sendMessage("I completed payment in the app.", { metadata: { paymentVerification: { razorpayOrderId: res.razorpay_order_id, razorpayPaymentId: res.razorpay_payment_id, razorpaySignature: res.razorpay_signature } } });
                    } catch(e) { console.error(e); }
                }, (err) => {
                    console.error("Payment failed:", err);
                    setInitiatingPayments(prev => ({ ...prev, [message.id]: false }));
                    sendMessage("Payment was not completed. Can we try again?");
                });
            } else { setInitiatingPayments(prev => ({ ...prev, [message.id]: false })); }
        } catch (err) { setInitiatingPayments(prev => ({ ...prev, [message.id]: false })); }
    };

    return (
        <div className="relative z-10 h-[calc(100vh-64px)] overflow-hidden bg-transparent font-sans">
            <div className="mx-auto flex h-full w-full max-w-[1600px] gap-4 p-4 lg:p-6">
                <ChatSidebar 
                    onNewChat={startNewChat}
                    chatMode={chatMode}
                    isLoadingSessions={isLoadingSessions}
                    visibleSessions={visibleSessions}
                    currentSessionId={currentSessionId}
                    onLoadSession={loadSession}
                    onDeleteSession={(e, id) => { e.stopPropagation(); setSessionToDelete(id); }}
                    resolveSessionMode={resolveSessionMode}
                />

                <main className="relative flex flex-1 flex-col overflow-visible rounded-[32px] border border-chat-border bg-chat-bg/40 shadow-[0_40px_100px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
                    <ChatHeader 
                        chatMode={chatMode} 
                        onMobileHistoryOpen={() => setIsMobileHistoryOpen(true)}
                    />

                    <div className="flex-1 overflow-y-auto px-4 py-8 lg:px-6 scrollbar-none">
                        <div className="mx-auto flex max-w-4xl flex-col gap-8">
                            {isOffline && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-[28px] border border-red-500/30 bg-red-500/[0.04] shadow-xl">
                                    <div className="grid md:grid-cols-[260px_1fr]">
                                        <div className="relative min-h-[220px] border-b border-red-500/20 md:border-b-0 md:border-r">
                                            <img src={networkErrorImg} alt="Offline" className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex flex-col justify-center gap-4 p-6">
                                            <h2 className="text-xl font-black text-chat-text-primary">Intelligence Core is offline</h2>
                                            <button onClick={() => window.location.reload()} className="w-fit rounded-xl bg-red-500/10 px-5 py-2.5 text-xs font-bold text-red-500">Try Reconnecting</button>
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
                                            <motion.div key={message.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
                                                <div className={`relative max-w-[85%] rounded-[24px] px-5 py-4 shadow-xl sm:max-w-[75%] ${message.isErrorState ? 'border border-red-500/20 bg-red-500/[0.03]' : isAssistant ? 'border border-chat-bubble-assistant-border bg-chat-bubble-assistant-bg text-chat-text-primary' : 'bg-chat-bubble-user-bg text-white'}`}>
                                                    <div className={`mb-2 text-[9px] font-black uppercase tracking-widest ${isAssistant ? 'text-chat-accent/80' : 'text-white/60'}`}>
                                                        {isAssistant ? 'UNIT-01 RESPONSE' : 'COMMAND UPLOAD'}
                                                    </div>
                                                    
                                                    {message.isErrorState && <img src={networkErrorImg} alt="Error" className="mb-4 rounded-xl border border-red-500/20 max-h-[300px] w-full object-cover" />}

                                                    <MessageContent 
                                                        content={isAssistant ? message.streamedContent : message.content} 
                                                        isAssistant={isAssistant} 
                                                    />

                                                    {isAssistant && message.isStreaming && <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-chat-accent align-middle" />}

                                                    {isAssistant && !message.isStreaming && message.metadata?.active_quote && (
                                                        <QuoteCard 
                                                            quote={message.metadata.active_quote} 
                                                            isBusy={isBusy} 
                                                            isCompleted={message.metadata?.paymentOrder?.is_completed}
                                                            isInitiating={initiatingPayments[message.id]}
                                                            onPay={() => handlePayNow(message)}
                                                            onCancel={() => sendMessage("Cancel this purchase.")}
                                                        />
                                                    )}

                                                    {isAssistant && !message.isStreaming && message.toolCalls?.map(tool => (
                                                        <ActionCard key={tool.id} type="tool_call" data={tool} isBusy={isBusy} onAction={sendMessage} />
                                                    ))}

                                                    {isAssistant && !message.isStreaming && message.metadata?.active_options?.length > 0 && (
                                                        <ActionCard type="options" data={message.metadata} isBusy={isBusy} onAction={sendMessage} />
                                                    )}

                                                    {isAssistant && !message.isStreaming && message.quickReplies?.length > 0 && (chatMode === 'agent' || message.isErrorState) && (
                                                        <div className="mt-6 flex flex-wrap gap-2">
                                                            {message.quickReplies.map((prompt) => (
                                                                <button key={prompt} onClick={() => sendMessage(prompt)} disabled={isBusy} className={`rounded-xl border px-3 py-2 text-[10px] font-bold transition-all disabled:opacity-30 ${message.isErrorState ? 'border-red-500/30 bg-red-500/10 text-red-300' : 'border-chat-border hover:bg-chat-bg text-chat-text-primary'}`}>
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
                            {isSending && <ThinkingState activeThinkingStage={activeThinkingStage} />}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <ChatInput 
                        input={input}
                        setInput={setInput}
                        isBusy={isBusy}
                        onSendMessage={sendMessage}
                        chatMode={chatMode}
                        isModeMenuOpen={isModeMenuOpen}
                        setIsModeMenuOpen={setIsModeMenuOpen}
                        switchMode={switchMode}
                    />

                    <AnimatePresence>
                        {isMobileHistoryOpen && (
                            <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="absolute inset-0 z-[100] bg-chat-bg lg:hidden overflow-y-auto">
                                <div className="p-4 border-b border-chat-border flex items-center justify-between">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-chat-text-secondary">History</h3>
                                    <button onClick={() => setIsMobileHistoryOpen(false)} className="p-2"><X className="h-5 w-5" /></button>
                                </div>
                                <div className="p-4">
                                    <ChatSidebar 
                                        onNewChat={() => { startNewChat(); setIsMobileHistoryOpen(false); }}
                                        chatMode={chatMode}
                                        isLoadingSessions={isLoadingSessions}
                                        visibleSessions={visibleSessions}
                                        currentSessionId={currentSessionId}
                                        onLoadSession={(id) => { loadSession(id); setIsMobileHistoryOpen(false); }}
                                        onDeleteSession={(e, id) => { e.stopPropagation(); setSessionToDelete(id); }}
                                        resolveSessionMode={resolveSessionMode}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            <ConfirmationModal
                isOpen={!!sessionToDelete} title="Delete Conversation" message="Are you sure you want to delete this conversation? This action cannot be undone."
                confirmText="Delete" cancelText="Cancel" isDangerous={true} onConfirm={confirmDeleteSession} onCancel={() => setSessionToDelete(null)}
            />
        </div>
    );
};

export default AIAgent;
