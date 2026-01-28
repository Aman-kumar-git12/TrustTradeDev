import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Settings, LogOut, Shield, UserCog, Home } from 'lucide-react';

const AdminSidebar = () => {
    const location = useLocation();

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Overview' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'All Orders' },
        { path: '/admin/users', icon: UserCog, label: 'Manage Users' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="w-64 bg-gradient-to-b from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] border-r border-gray-100 dark:border-white/5 h-screen flex-shrink-0 p-6 flex flex-col relative z-20 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">TrustTrade Admin</span>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <Link
                to="/home"
                className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
            >
                <Home className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
            </Link>


        </div>
    );
};

export default AdminSidebar;
