import React from 'react';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrendItem = ({ rank, tag, posts, trendLine }) => {
    // Generate a simple SVG sparkline based on the trendLine string (up, down, flat)
    const getColor = () => {
        if (trendLine === 'up') return 'stroke-purple-500';
        if (trendLine === 'down') return 'stroke-pink-500';
        return 'stroke-cyan-500';
    };

    return (
        <div className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
            <div className="flex items-center gap-4">
                <span className="text-gray-600 font-bold w-4 text-center">{rank}</span>
                <div>
                    <h4 className="text-white font-bold text-sm group-hover:text-purple-400 transition-colors">{tag}</h4>
                    <p className="text-gray-500 text-xs">{posts} posts</p>
                </div>
            </div>
            <div className={`w-12 h-6`}>
                <svg viewBox="0 0 100 30" className={`w-full h-full fill-none stroke-[3px] ${getColor()} stroke-linecap-round stroke-linejoin-round opacity-80 group-hover:opacity-100 transition-opacity`}>
                    {trendLine === 'up' && <path d="M 0 30 Q 25 15 50 20 T 100 0" />}
                    {trendLine === 'down' && <path d="M 0 0 Q 25 10 50 5 T 100 30" />}
                    {trendLine === 'flat' && <path d="M 0 15 Q 25 5 50 25 T 100 15" />}
                    {trendLine === 'mixed' && <path d="M 0 20 Q 20 5 40 25 T 80 10 T 100 15" className="stroke-indigo-500" />}
                </svg>
            </div>
        </div>
    );
};

const UserItem = ({ avatar, name, handle, badgeColor = 'bg-purple-500' }) => (
    <div className="flex items-center justify-between group">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${badgeColor}`}>
                {avatar}
            </div>
            <div>
                <h4 className="text-white font-bold text-sm cursor-pointer hover:underline decoration-white/30">{name}</h4>
                <p className="text-gray-500 text-xs">New Discovery</p>
            </div>
        </div>
        <button className="px-4 py-1.5 rounded-full border border-white/20 text-white text-xs font-bold hover:bg-white/10 transition-colors cursor-pointer active:scale-95">
            Follow
        </button>
    </div>
);

const SidebarRight = () => {
    return (
        <div className="h-full flex flex-col pt-6 pb-6 px-4 bg-[#0a0a0a] border-l border-white/5 overflow-y-auto scrollbar-hide">
            {/* Search Bar */}
            <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search CLIQ..."
                    className="w-full bg-[#121212] border border-white/10 text-white text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-gray-500"
                />
            </div>

            {/* Trending Section */}
            <div className="mb-10">
                <div className="flex items-center justify-between px-1 mb-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">TRENDING</h3>
                    <Link to="/trends" className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">See all &rarr;</Link>
                </div>
                <div className="space-y-1">
                    <TrendItem rank="1" tag="#BuildInPublic" posts="12.4k" trendLine="up" />
                    <TrendItem rank="2" tag="#AIart" posts="8.1k" trendLine="down" />
                    <TrendItem rank="3" tag="#motivation" posts="6.7k" trendLine="flat" />
                    <TrendItem rank="4" tag="#devlife" posts="4.2k" trendLine="mixed" />
                </div>
            </div>

            {/* Discover People Section */}
            <div className="mb-auto">
                <div className="flex items-center justify-between px-1 mb-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">DISCOVER PEOPLE</h3>
                    <Link to="/explore/people" className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors">Explore &rarr;</Link>
                </div>
                <div className="space-y-4">
                    <UserItem avatar="TU" name="Test_User" badgeColor="bg-gradient-to-br from-pink-500 to-purple-500" />
                    <UserItem avatar="SJ" name="Shail_Jerry" badgeColor="bg-gradient-to-br from-yellow-400 to-orange-500" />
                    <UserItem avatar="NM" name="Narendra_Modi" badgeColor="bg-gradient-to-br from-teal-400 to-emerald-500" />
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex flex-wrap gap-x-3 gap-y-2 text-[11px] text-gray-500 mb-4 px-1">
                    <Link to="/about" className="hover:text-gray-300 transition-colors">About</Link>
                    <Link to="/help" className="hover:text-gray-300 transition-colors">Help</Link>
                    <Link to="/press" className="hover:text-gray-300 transition-colors">Press</Link>
                    <Link to="/api" className="hover:text-gray-300 transition-colors">API</Link>
                    <Link to="/jobs" className="hover:text-gray-300 transition-colors">Jobs</Link>
                    <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
                    <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
                    <span className="text-gray-600 block w-full mt-1">Meta Verified</span>
                </div>
                <p className="text-[11px] text-gray-600 px-1">&copy; 2026 CLIQ</p>
            </div>
        </div>
    );
};

export default SidebarRight;
