import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomDropdown = ({ options, value, onChange, icon: Icon, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find(opt => opt.value === value)?.label || label;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-950 bluish:from-[#24304a] bluish:to-[#131b2e] border border-gray-100 dark:border-white/5 rounded-xl text-sm font-medium transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 min-w-[160px] justify-between text-gray-700 dark:text-gray-200"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                    <span>{selectedLabel}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full mt-2 left-0 w-full min-w-[200px] z-50 origin-top-left"
                    >
                        <div className="bg-gradient-to-b from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 bluish:from-[#1a243a] bluish:to-[#141b2d] border border-gray-100 dark:border-white/5 rounded-xl shadow-2xl p-1 overflow-hidden">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${value === opt.value
                                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {opt.label}
                                    {value === opt.value && <CheckCircle className="w-3.5 h-3.5" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomDropdown;
