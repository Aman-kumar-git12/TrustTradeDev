import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ScrollButtons = () => {
    const { theme } = useTheme();
    const [showUp, setShowUp] = useState(false);
    const [showDown, setShowDown] = useState(true);

    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        setShowUp(scrollTop > 300);
        setShowDown(scrollTop + clientHeight < scrollHeight - 300);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    };

    // Theme based colors
    const getButtonStyles = () => {
        if (theme === 'dark') {
            return 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20';
        }
        if (theme === 'bluish') {
            return 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20';
        }
        return 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20';
    };

    const buttonClass = `p-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 flex items-center justify-center border border-white/10 ${getButtonStyles()}`;

    return (
        <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
            <AnimatePresence>
                {showUp && (
                    <motion.button
                        key="scroll-up"
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollToTop}
                        className={buttonClass}
                        aria-label="Scroll to top"
                    >
                        <ChevronUp size={24} />
                    </motion.button>
                )}

                {showDown && (
                    <motion.button
                        key="scroll-down"
                        initial={{ opacity: 0, y: -20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={scrollToBottom}
                        className={buttonClass}
                        aria-label="Scroll to bottom"
                    >
                        <ChevronDown size={24} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ScrollButtons;
