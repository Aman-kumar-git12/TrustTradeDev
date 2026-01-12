import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, PlusCircle, Building2 } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Hover from './Hover';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { confirm, showSnackbar } = useUI();
    const { user, logout } = useAuth();
    const { theme, mode } = useTheme();

    const handleLogout = async () => {
        const isConfirmed = await confirm({
            title: 'Confirm Logout',
            message: 'Are you sure you want to log out of your account?',
            confirmText: 'Log Out',
            isDangerous: true
        });

        if (isConfirmed) {
            logout(); // Use context logout
            showSnackbar('Logged out successfully', 'success');
            navigate('/login');
        }
    };

    const handleNavClick = (e, path, sectionName) => {
        // Normalizing paths by removing trailing slashes for safer comparison
        const currentPath = location.pathname.replace(/\/$/, '');
        const targetPath = path.replace(/\/$/, '');

        // Special handling for dashboard sub-routes
        if (sectionName === 'Dashboard') {
            if (currentPath.startsWith(targetPath)) {
                e.preventDefault();
                showSnackbar(`You are already at the ${sectionName} section`, 'info');
                return;
            }
        } else if (currentPath === targetPath) {
            e.preventDefault();
            showSnackbar(`You are already at the ${sectionName} page`, 'info');
            return;
        }
    };

    const isDark = theme === 'dark';
    const isBluish = theme === 'bluish' || mode === 'bluish';

    const isLanding = location.pathname === '/';
    const isPublicBusiness = location.pathname.startsWith('/businessdetails/') || location.pathname.startsWith('/assets/');

    // Theme Standardization Logic:
    // Dark Mode = Emerald
    // Bluish/Light Mode = Blue
    const accentColor = isDark && !isBluish ? 'emerald' : 'blue';

    const accentClass = accentColor === 'emerald' ? 'text-emerald-500' : 'text-blue-500';
    const accentBgClass = accentColor === 'emerald' ? 'bg-emerald-500/10' : 'bg-blue-500/10';

    const hideMarketplace = location.pathname === '/register' || location.pathname === '/login';
    const buttonClass = accentColor === 'emerald'
        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 hover:shadow-emerald-500/40'
        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 hover:shadow-blue-500/40';

    return (
        <nav className={`sticky top-0 z-[999] border-b shadow-2xl transition-all duration-300 ${isBluish
            ? 'bg-[#0f172a] border-white/5 text-white backdrop-blur-md'
            : isDark
                ? 'bg-gray-900 border-white/5 text-white backdrop-blur-md'
                : 'bg-gray-900 border-white/5 text-white'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to={user ? "/home" : "/"} className="flex items-center space-x-2 group">
                        <div className={`p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-300 ${accentBgClass}`}>
                            <Building2 className={`h-6 w-6 ${accentClass}`} />
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight transition-colors text-white">TrustTrade</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {isLanding ? (
                            <div className="flex items-center space-x-8">
                                <Hover text="Home">
                                    <Link
                                        to="/"
                                        className={`text-sm font-bold transition-all ${accentClass}`}
                                    >
                                        Home
                                    </Link>
                                </Hover>
                                {!user && (
                                    <>
                                        <Link to="/login" className="text-sm font-bold transition-colors text-gray-400 hover:text-white">Log in</Link>
                                        <Link to="/register" className={`${buttonClass} text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5`}>
                                            Get Started
                                        </Link>
                                    </>
                                )}
                                {user && (
                                    <Link to="/home" className={`${buttonClass} text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5`}>
                                        Go to Dashboard
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <>
                                <Hover text="Home">
                                    <Link
                                        to={user ? "/home" : "/"}
                                        className={`text-sm font-bold transition-all ${location.pathname === (user ? '/home' : '/')
                                            ? accentClass
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                        onClick={(e) => handleNavClick(e, user ? "/home" : "/", 'Home')}
                                    >
                                        Home
                                    </Link>
                                </Hover>
                                {!hideMarketplace && (
                                    <Hover text="Browse Assets">
                                        <Link
                                            to="/marketplace"
                                            className={`text-sm font-bold transition-all ${location.pathname.startsWith('/marketplace')
                                                ? accentClass
                                                : 'text-gray-400 hover:text-white'
                                                }`}
                                            onClick={(e) => handleNavClick(e, '/marketplace', 'Marketplace')}
                                        >
                                            Marketplace
                                        </Link>
                                    </Hover>
                                )}

                                {user ? (
                                    <div className="flex items-center space-x-6">
                                        {user.role === 'seller' && (
                                            <Hover text="List New Asset">
                                                <Link
                                                    to="/post-asset"
                                                    className={`flex items-center space-x-1.5 text-sm font-bold transition-all ${location.pathname.startsWith('/post-asset')
                                                        ? accentClass
                                                        : 'text-gray-400 hover:text-white'
                                                        }`}
                                                    onClick={(e) => handleNavClick(e, '/post-asset', 'Post Asset')}
                                                >
                                                    <PlusCircle size={18} />
                                                    <span>Post Asset</span>
                                                </Link>
                                            </Hover>
                                        )}
                                        <Hover text="View Dashboard">
                                            <Link
                                                to={user.role === 'seller' ? "/dashboard/seller" : `/dashboard/buyer/${user._id}`}
                                                className={`flex items-center space-x-1.5 text-sm font-bold transition-all ${location.pathname.includes('/dashboard/')
                                                    ? accentClass
                                                    : 'text-gray-400 hover:text-white'
                                                    }`}
                                                onClick={(e) => handleNavClick(e, user.role === 'seller' ? "/dashboard/seller" : `/dashboard/buyer/${user._id}`, 'Dashboard')}
                                            >
                                                <LayoutDashboard size={18} />
                                                <span>Dashboard</span>
                                            </Link>
                                        </Hover>
                                        <div className={`flex items-center space-x-4 border-l pl-6 border-white/10`}>
                                            <Hover text="View Profile">
                                                <Link
                                                    to="/profile"
                                                    className="flex items-center space-x-3 group"
                                                    onClick={(e) => handleNavClick(e, '/profile', 'Profile')}
                                                >
                                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all group-hover:scale-110 ${accentBgClass} ${accentClass} border-white/5`}>
                                                        {user.fullName?.charAt(0) || 'U'}
                                                    </div>
                                                    <span className={`text-sm font-bold transition-colors text-gray-300 group-hover:text-white`}>
                                                        {user.fullName}
                                                    </span>
                                                </Link>
                                            </Hover>

                                            <Hover text="Log Out">
                                                <button
                                                    onClick={handleLogout}
                                                    className={`p-2 rounded-lg transition-all text-gray-400 hover:text-rose-400 hover:bg-rose-400/10`}
                                                >
                                                    <LogOut size={18} />
                                                </button>
                                            </Hover>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-4">
                                        <Link to="/login" className="text-sm font-bold transition-colors text-gray-400 hover:text-white">Log in</Link>
                                        <Link to="/register" className={`${buttonClass} text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5`}>
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
