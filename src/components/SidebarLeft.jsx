import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home, MessageSquare, Bell, Search, PlusCircle, Image as ImageIcon,
    User, Bookmark, Settings, MoreHorizontal
} from 'lucide-react';

const SidebarLeft = () => {
    const { user } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Feed', icon: Home, path: '/home', badge: 0 },
        { name: 'Messages', icon: MessageSquare, path: '/messages', badge: 3 },
        { name: 'Notifications', icon: Bell, path: '/notifications', badge: 7 },
        { name: 'Explore', icon: Search, path: '/explore', badge: 0 },
    ];

    const createItems = [
        { name: 'New Post', icon: PlusCircle, path: '/post/new' },
        { name: 'Story', icon: ImageIcon, path: '/story/new' },
    ];

    const youItems = [
        { name: 'Profile', icon: User, path: `/user/${user?._id || 'me'}` },
        { name: 'Saved', icon: Bookmark, path: '/saved' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    const NavGroup = ({ title, items }) => (
        <div className="mb-6">
            {title && <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4 mb-3">{title}</h3>}
            <nav className="space-y-1">
                {items.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-white/10 text-white font-semibold'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon className={`w-6 h-6 ${isActive ? 'text-pink-500' : 'text-gray-400'} transition-colors`} />
                                <span className="text-[15px]">{item.name}</span>
                            </div>
                            {item.badge > 0 && (
                                <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center justify-center min-w-[20px]">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );

    return (
        <div className="h-full flex flex-col pt-6 pb-6 px-3 bg-[#0a0a0a] border-r border-white/5 overflow-y-auto scrollbar-hide">
            {/* Logo */}
            <div className="px-4 mb-10 flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                    <span className="text-white font-black text-xl">C</span>
                </div>
                <span className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    CLIQ
                </span>
            </div>

            {/* Navigation Groups */}
            <div className="flex-1">
                <NavGroup items={navItems} />
                <NavGroup title="CREATE" items={createItems} />
                <NavGroup title="YOU" items={youItems} />
            </div>

            {/* User Profile Card */}
            <div className="mt-auto px-2">
                <div className="relative group cursor-pointer">
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="relative flex items-center gap-3 p-3 rounded-2xl border border-white/5 bg-[#121212] transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">{user?.name?.charAt(0) || 'U'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-white font-bold text-sm truncate">{user?.name || 'Guest User'}</h4>
                            <p className="text-gray-500 text-xs truncate">@{user?.name?.toLowerCase().replace(/\s+/g, '_') || 'guest'}</p>
                        </div>
                        <MoreHorizontal className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidebarLeft;
