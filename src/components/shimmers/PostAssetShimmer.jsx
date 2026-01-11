import React from 'react';
import { ArrowLeft } from 'lucide-react';

const PostAssetShimmer = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 bluish:bg-[#0a0f1d] py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10 animate-pulse">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <div className="mr-4 p-2 rounded-full bg-gray-200 dark:bg-zinc-800 bluish:bg-white/5 h-10 w-10"></div>
                    <div>
                        <div className="h-8 w-48 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 rounded mb-2"></div>
                        <div className="h-5 w-32 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/5 rounded"></div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 bluish:bg-gradient-to-br bluish:from-slate-800/80 bluish:to-slate-900/80 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 bluish:border-white/5 overflow-hidden">
                    <div className="h-1 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 w-full"></div>

                    <div className="p-8 md:p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* LEFT COLUMN */}
                            <div className="space-y-8">
                                <div>
                                    <div className="h-7 w-40 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 rounded mb-6 border-b border-gray-100 dark:border-zinc-800 bluish:border-white/5 pb-2"></div>

                                    <div className="space-y-6">
                                        <div>
                                            <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/5 rounded mb-2"></div>
                                            <div className="h-12 w-full bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded-xl"></div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/5 rounded mb-2"></div>
                                                <div className="h-12 w-full bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded-xl"></div>
                                            </div>
                                            <div>
                                                <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/5 rounded mb-2"></div>
                                                <div className="h-12 w-full bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded-xl"></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/5 rounded mb-2"></div>
                                            <div className="h-12 w-full bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded-xl"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* Category Selection Grid */}
                                <div>
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/5 rounded mb-3"></div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                            <div key={i} className="aspect-square rounded-xl bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 border border-gray-200 dark:border-zinc-800 bluish:border-white/5"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="space-y-6">
                                <div className="h-7 w-48 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 rounded mb-4 border-b border-gray-100 dark:border-zinc-800 bluish:border-white/5 pb-2"></div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/5 rounded"></div>
                                        <div className="h-5 w-10 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/5 rounded-full"></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="col-span-2 aspect-video bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded-xl border border-dashed border-gray-300 dark:border-zinc-700 bluish:border-white/10"></div>
                                    </div>

                                    <div className="h-14 w-full bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded-xl"></div>
                                </div>

                                <div>
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/5 rounded mb-2"></div>
                                    <div className="h-40 w-full bg-gray-100 dark:bg-zinc-800 bluish:bg-white/5 rounded-xl"></div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8 border-t border-gray-100 dark:border-zinc-800 bluish:border-white/10 mt-8">
                            <div className="h-14 w-full md:w-64 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostAssetShimmer;
