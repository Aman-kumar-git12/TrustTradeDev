import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Hover = ({ children, text, duration = 2000 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef(null);

    const handleMouseEnter = () => {
        setIsVisible(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setIsVisible(false);
        }, duration);
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div
            className="relative flex items-center justify-center"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full mt-2 flex flex-col items-center z-50 pointer-events-none"
                    >
                        {/* Arrow */}
                        <div className="h-3 w-3 -mb-2 rotate-45 bg-gray-900/90 backdrop-blur-md shadow-sm"></div>
                        {/* Tooltip Body */}
                        <div className="relative z-10 whitespace-nowrap rounded-xl bg-gray-900/90 backdrop-blur-md px-4 py-2 text-xs font-bold text-white shadow-xl border border-white/10 ring-1 ring-black/5">
                            {text}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Hover;
