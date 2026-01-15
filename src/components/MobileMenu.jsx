import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home as HomeIcon, ShoppingBag, PlusCircle, LayoutDashboard, User, LogOut } from 'lucide-react';

const MobileMenu = ({
    isOpen,
    setIsOpen,
    user,
    accentClass,
    accentBgClass,
    handleNavClick,
    handleLogout,
    isBluish,
    isDark,
    buttonClass,
    hideMarketplace
}) => {
    const location = useLocation();

    // Define the 5 core options requested
    const navLinks = [
        { label: 'Home', path: user ? '/home' : '/', icon: HomeIcon, id: 'Home' },
        { label: 'Marketplace', path: '/marketplace', icon: ShoppingBag, id: 'Marketplace' },
        { label: 'Post Assets', path: '/post-asset', icon: PlusCircle, id: 'Post Assets', role: 'seller' },
        { label: 'Dashboard', path: user?.role === 'seller' ? '/dashboard/seller' : `/dashboard/buyer/${user?._id}`, icon: LayoutDashboard, id: 'Dashboard', auth: true },
        { label: 'Profile', path: '/profile', icon: User, id: 'Profile', auth: true },
    ].filter(link => {
        if (link.id === 'Marketplace' && hideMarketplace) return false;
        if (link.auth && !user) return false;
        if (link.role && user?.role !== link.role) return false;
        return true;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 25,
                stiffness: 200
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="md:hidden">
                    {/* Backdrop - High Z-Index and Fixed */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md"
                    />

                    {/* Menu - Slides UP from the bottom */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className={`fixed bottom-0 left-0 right-0 z-[2001] rounded-t-[32px] border-t shadow-2xl flex flex-col max-h-[85vh] overflow-hidden ${isBluish ? 'bg-[#0f172a] border-white/5 text-white' :
                            isDark ? 'bg-gray-900 border-white/5 text-white' :
                                'bg-white border-gray-100 text-gray-900'
                            }`}
                    >
                        {/* Pull handle for visual cue */}
                        <div className="flex justify-center py-4">
                            <div className={`w-12 h-1.5 rounded-full ${isBluish || isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
                        </div>

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col h-full"
                        >
                            {/* Header Section */}
                            <motion.div variants={itemVariants} className="px-8 pb-6 border-b border-white/5">
                                {user ? (
                                    <div className="flex items-center space-x-4">
                                        <div className={`h-14 w-14 rounded-full flex items-center justify-center text-xl font-bold border ${accentBgClass} ${accentClass} border-white/10 shadow-lg`}>
                                            {user.fullName?.charAt(0) || 'U'}
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="font-bold text-lg truncate">{user.fullName}</div>
                                            <div className="text-sm text-gray-400 capitalize">{user.role} Account</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-xl ${accentBgClass}`}>
                                            <HomeIcon className={accentClass} size={24} />
                                        </div>
                                        <span className="font-bold text-xl tracking-tight">Main Menu</span>
                                    </div>
                                )}
                            </motion.div>

                            {/* Nav Links */}
                            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
                                {(!user && location.pathname === '/') ? (
                                    // Landing Page - Show nothing in the main list, or maybe "Home" if desired, 
                                    // but user asked for ONLY Login, Register, Get Started.
                                    // Those are in the footer. So we render nothing here or a placeholder.
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                                        <p>Welcome to TrustTrade</p>
                                    </div>
                                ) : (
                                    navLinks.map((link) => {
                                        const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));

                                        return (
                                            <motion.div key={link.id} variants={itemVariants}>
                                                <Link
                                                    to={link.path}
                                                    className={`flex items-center space-x-4 w-full px-5 py-4 rounded-2xl text-base font-bold transition-all group ${isActive && link.id !== 'Home' ? `${accentBgClass} ${accentClass}` :
                                                        isActive && link.id === 'Home' ? accentClass :
                                                            'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-white'
                                                        }`}
                                                    onClick={(e) => {
                                                        handleNavClick(e, link.path, link.id);
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    <div className={`p-2 rounded-xl transition-colors ${isActive && link.id !== 'Home' ? accentBgClass : 'bg-transparent group-hover:bg-white/5'}`}>
                                                        <link.icon size={22} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? accentClass : ''}`} />
                                                    </div>
                                                    <span>{link.label}</span>
                                                </Link>
                                            </motion.div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Footer Section */}
                            <motion.div variants={itemVariants} className="p-8 pb-10 border-t border-white/5 bg-black/5">
                                {user ? (
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                        className="flex items-center justify-center space-x-3 w-full px-6 py-4 rounded-2xl text-base font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-all group"
                                    >
                                        <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                                        <span>Log Out</span>
                                    </button>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link
                                            to="/login"
                                            className="flex items-center justify-center px-6 py-4 rounded-2xl text-base font-bold text-gray-400 hover:text-white hover:bg-white/5 border border-white/5 transition-all text-center"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            to="/register"
                                            className={`flex items-center justify-center px-6 py-4 rounded-2xl text-base font-bold text-white shadow-xl transition-all ${buttonClass} text-center`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
