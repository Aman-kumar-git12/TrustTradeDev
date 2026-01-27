import React from 'react';

const AppLoader = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black bluish:bg-[#0a0f1d] overflow-hidden relative">
            {/* Global Background from App.jsx */}
            <div className="fixed inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff33_1px,#000000_1px)] bluish:bg-[radial-gradient(#ffffff33_1px,#0a0f1d_1px)] [background-size:20px_20px] opacity-20 dark:opacity-[0.26] bluish:opacity-[0.26] pointer-events-none z-[1]"></div>

            {/* Navbar Skeleton */}
            <div className="fixed top-0 left-0 right-0 h-16 border-b border-gray-200 dark:border-white/5 bluish:border-white/5 bg-white/80 dark:bg-gray-900/80 bluish:bg-[#0f172a]/80 backdrop-blur-md z-50 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <div className="h-9 w-9 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 rounded-lg animate-pulse" />
                    <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse hidden sm:block" />
                </div>

                {/* Nav Links */}
                <div className="hidden md:flex items-center space-x-8">
                    <div className="h-4 w-12 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 rounded animate-pulse" />
                    <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 animate-pulse ml-4" />
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
                {/* Hero-like Banner */}
                <div className="w-full h-48 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/5 rounded-2xl animate-pulse" />

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-64 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/5 rounded-2xl animate-pulse" />
                    <div className="h-64 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/5 rounded-2xl animate-pulse" />
                    <div className="h-64 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/5 rounded-2xl animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default AppLoader;
