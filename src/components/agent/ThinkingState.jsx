import { motion } from 'framer-motion';

const ThinkingState = ({ activeThinkingStage }) => {
    return (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
            <div className="max-w-[85%] rounded-[24px] border border-chat-bubble-assistant-border bg-chat-bubble-assistant-bg px-5 py-4 text-chat-text-secondary sm:max-w-[75%] shadow-xl">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-chat-accent/80 mb-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-chat-accent animate-pulse" />
                    SYSTEM THINKING
                </div>
                <p className="text-sm font-medium italic opacity-70">
                    {activeThinkingStage.label}...
                </p>
                <p className="text-[10px] mt-1 opacity-50">
                    {activeThinkingStage.detail}
                </p>
            </div>
        </motion.div>
    );
};

export default ThinkingState;
