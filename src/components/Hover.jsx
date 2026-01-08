import React from 'react';

const Hover = ({ children, text }) => {
    return (
        <div className="group relative flex items-center justify-center">
            {children}
            <div className="absolute top-full mt-2 hidden flex-col items-center group-hover:flex z-50">
                {/* Arrow */}
                <div className="h-3 w-3 -mb-2 rotate-45 bg-gray-900/80 backdrop-blur-md"></div>
                {/* Tooltip Body */}
                <span className="relative z-10 whitespace-nowrap rounded-lg bg-gray-900/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-white shadow-xl transition-all duration-300 ease-out transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 animate-fade-in-up border border-white/10">
                    {text}
                </span>
            </div>
        </div>
    );
};

export default Hover;
