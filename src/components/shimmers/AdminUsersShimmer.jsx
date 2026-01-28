import React from 'react';

const AdminUsersShimmer = () => {
    return (
        <div className="animate-pulse">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 px-8 py-5 border-b border-gray-100 dark:border-white/5 transition-colors"
                >
                    {/* User Identity Column */}
                    <div className="flex items-center gap-4 w-1/4">
                        <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10" />
                        <div className="space-y-2 flex-1">
                            <div className="h-4 w-3/4 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 rounded" />
                            <div className="h-3 w-1/2 bg-gray-100 dark:bg-zinc-900 bluish:bg-white/5 rounded" />
                        </div>
                    </div>

                    {/* Contact Info Column */}
                    <div className="w-1/4 space-y-2">
                        <div className="h-4 w-5/6 bg-gray-200 dark:bg-zinc-800 bluish:bg-white/10 rounded" />
                        <div className="h-3 w-2/3 bg-gray-100 dark:bg-zinc-900 bluish:bg-white/5 rounded" />
                    </div>

                    {/* Role Column */}
                    <div className="w-1/6">
                        <div className="h-6 w-20 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded-full" />
                    </div>

                    {/* Joined Column */}
                    <div className="w-1/6">
                        <div className="h-4 w-24 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded" />
                    </div>

                    {/* Actions Column */}
                    <div className="w-1/6 flex justify-end">
                        <div className="h-8 w-8 bg-gray-100 dark:bg-zinc-800 bluish:bg-white/10 rounded-lg" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminUsersShimmer;
