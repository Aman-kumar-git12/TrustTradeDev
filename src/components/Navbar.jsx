import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, PlusCircle, Building2 } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { confirm, showSnackbar } = useUI();
    const { user, logout } = useAuth();

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

    return (
        <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <Building2 className="h-8 w-8 text-accent" />
                        <span className="font-display font-bold text-xl tracking-tight">TrustTrade</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/marketplace" className="hover:text-accent transition-colors">Marketplace</Link>

                        {user ? (
                            <div className="flex items-center space-x-6">
                                {user.role === 'seller' && (
                                    <Link to="/post-asset" className="flex items-center space-x-1 hover:text-accent">
                                        <PlusCircle size={18} />
                                        <span>Post Asset</span>
                                    </Link>
                                )}
                                <Link
                                    to={user.role === 'seller' ? "/dashboard/seller" : "/dashboard/buyer"}
                                    className="flex items-center space-x-1 hover:text-accent"
                                >
                                    <LayoutDashboard size={18} />
                                    <span>Dashboard</span>
                                </Link>
                                <div className="flex items-center space-x-4 border-l border-primary-light pl-6">
                                    <Link to="/profile" className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors">
                                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-600">
                                            {user.fullName.charAt(0)}
                                        </div>
                                        <span>{user.fullName}</span>
                                    </Link>
                                    <button onClick={handleLogout} className="text-gray-400 hover:text-white">
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-300 hover:text-white">Log in</Link>
                                <Link to="/register" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded-md font-medium transition-colors">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
