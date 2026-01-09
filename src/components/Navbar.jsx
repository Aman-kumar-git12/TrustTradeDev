import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, PlusCircle, Building2 } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import Hover from './Hover';

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
        <nav className="bg-primary text-white shadow-lg sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2">
                        <Building2 className="h-8 w-8 text-accent" />
                        <span className="font-display font-bold text-xl tracking-tight text-white">TrustTrade</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Hover text="Browse Assets">
                            <Link to="/marketplace" className="text-gray-300 hover:text-white transition-colors font-medium">Marketplace</Link>
                        </Hover>

                        {user ? (
                            <div className="flex items-center space-x-6">
                                {user.role === 'seller' && (
                                    <Hover text="List New Asset">
                                        <Link to="/post-asset" className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium">
                                            <PlusCircle size={18} />
                                            <span>Post Asset</span>
                                        </Link>
                                    </Hover>
                                )}
                                <Hover text="View Dashboard">
                                    <Link
                                        to={user.role === 'seller' ? "/dashboard/seller" : "/dashboard/buyer"}
                                        className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium"
                                    >
                                        <LayoutDashboard size={18} />
                                        <span>Dashboard</span>
                                    </Link>
                                </Hover>
                                <div className="flex items-center space-x-4 border-l border-primary-light pl-6">
                                    {/* Profile Hover */}
                                    <Hover text="View Profile">
                                        <Link to="/profile" className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors">
                                            <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-600 shadow-sm group-hover:border-accent transition-colors">
                                                {user.fullName.charAt(0)}
                                            </div>
                                            <span className="font-medium tracking-wide">{user.fullName}</span>
                                        </Link>
                                    </Hover>

                                    <Hover text="Log Out">
                                        <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors">
                                            <LogOut size={18} />
                                        </button>
                                    </Hover>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-300 hover:text-white font-medium">Log in</Link>
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
