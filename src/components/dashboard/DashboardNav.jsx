import React from 'react';
import { motion } from 'framer-motion';
import { Tag, ShoppingBag, Zap } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const DashboardNav = ({ activeTab, onTabChange, counts = { interests: 0, orders: 0 } }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams();

    const tabs = [
        { id: 'interests', label: 'My Interests', icon: Tag, count: counts.interests, path: `/dashboard/buyer/${userId}/interest` },
        { id: 'orders', label: 'My Orders', icon: ShoppingBag, count: counts.orders, path: `/dashboard/buyer/${userId}/orders` },
        { id: 'intelligence', label: 'Intelligence Hub', icon: Zap, path: `/dashboard/buyer/${userId}/intelligence` }
    ];

    return (
        <div className="inline-flex p-1.5 bg-gray-100/50 dark:bg-zinc-900/50 bluish:bg-[#1e293b]/50 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-zinc-800/50 bluish:border-white/10 shadow-2xl relative overflow-hidden group">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl pointer-events-none"></div>

                <div className="flex items-center relative z-10">
                    {tabs.map((tab, index) => {
                        const isActive = activeTab === tab.id || location.pathname === tab.path;
                        
                        return (
                            <React.Fragment key={tab.id}>
                                <button
                                    onClick={() => {
                                        if (onTabChange) onTabChange(tab.id);
                                        navigate(tab.path);
                                    }}
                                    className={`relative px-5 py-3 rounded-xl text-sm font-black transition-all duration-300 flex items-center group/btn active:scale-95 ${
                                        isActive 
                                        ? 'text-blue-600 dark:text-blue-400' 
                                        : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="dash-nav-pill"
                                            className="absolute inset-0 bg-white dark:bg-zinc-800 bluish:bg-blue-500/10 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-zinc-700 bluish:border-blue-500/20"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    
                                    <div className="relative flex items-center z-20">
                                        <tab.icon 
                                            size={18} 
                                            className={`mr-2.5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover/btn:scale-110'}`} 
                                        />
                                        <span className="tracking-tight">{tab.label}</span>
                                        
                                        {tab.count !== undefined && (
                                            <span className={`ml-2.5 px-2 py-0.5 text-[10px] font-black rounded-lg transition-colors duration-300 ${
                                                isActive 
                                                ? 'bg-blue-600 text-white' 
                                                : 'bg-gray-200 dark:bg-zinc-800 text-gray-500'
                                            }`}>
                                                {tab.count}
                                            </span>
                                        )}
                                    </div>
                                </button>
                                
                                {index < tabs.length - 1 && (
                                    <div className="w-px h-5 bg-gray-200 dark:bg-zinc-800 mx-1 opacity-50" />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
        </div>
    );
};

export default DashboardNav;
