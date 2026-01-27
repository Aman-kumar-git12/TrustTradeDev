import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';

import QuickRegisterButton from '../components/QuickRegisterButton';

const Register = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';
    const autoFill = searchParams.get('autoFill') === 'true';

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: initialRole
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isHighlightingRole, setIsHighlightingRole] = useState(false);
    const [isAutoFilled, setIsAutoFilled] = useState(false);

    const { showSnackbar } = useUI();
    const { setAuth, user, loading } = useAuth();
    const navigate = useNavigate();

    const generateRandomData = () => {
        const randomId = Math.floor(1000 + Math.random() * 9000);
        const dynamicName = `User${randomId}`;
        return {
            fullName: dynamicName,
            email: `user${randomId}@gmail.com`,
            password: `${dynamicName}@123`
        };
    };

    useEffect(() => {
        if (autoFill) {
            const data = generateRandomData();
            setFormData(prev => ({ ...prev, ...data }));
            setIsHighlightingRole(true);
            setIsAutoFilled(true);
            const timer = setTimeout(() => setIsHighlightingRole(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [autoFill]);

    const handleQuickRegisterToggle = () => {
        if (isAutoFilled) {
            // Clear Data
            setFormData({
                fullName: '',
                email: '',
                password: '',
                role: initialRole
            });
            setIsAutoFilled(false);
            // Remove query param if present without reloading
            navigate('/register', { replace: true });
        } else {
            // Fill Data
            const data = generateRandomData();
            setFormData(prev => ({ ...prev, ...data }));
            setIsHighlightingRole(true);
            setIsAutoFilled(true);
            setTimeout(() => setIsHighlightingRole(false), 2000);
        }
    };


    useEffect(() => {
        if (!loading && user) {
            navigate('/home');
        }
    }, [user, loading, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.post('/auth/register', formData);
            setAuth(data); // Directly update user state

            showSnackbar('Registration successful! Welcome.', 'success');

            navigate('/home');

        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            showSnackbar(msg, 'error');
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#0a0f1d] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Dotted Background Pattern */}
            <div className="fixed inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff33_1px,#000000_1px)] bluish:bg-[radial-gradient(#ffffff33_1px,#0a0f1d_1px)] [background-size:20px_20px] opacity-20 dark:opacity-[0.26] bluish:opacity-[0.26] pointer-events-none z-[1]"></div>

            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob animation-delay-4000"></div>

            <div className="max-w-md w-full bg-[#0f1629]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 relative z-10 transition-all duration-300 overflow-hidden">
                {/* Vertical Scanning Beam Removed */}

                <div className="text-center mb-5 relative z-10">
                    <div className="inline-block p-2 rounded-full bg-blue-500/10 mb-3 animate-fade-in-up">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 shadow-lg shadow-blue-500/30"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Create Account</h2>
                    <p className="text-gray-400 text-xs animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Join TrustTrade today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 bg-[#0a0f1d]/50 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-600 text-sm"
                            placeholder="John Doe"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 bg-[#0a0f1d]/50 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-600 text-sm"
                            placeholder="name@company.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full px-4 py-2 bg-[#0a0f1d]/50 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-600 text-sm"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">I want to...</label>
                        <div className={`grid grid-cols-2 gap-3 p-1 rounded-2xl transition-all duration-300 ${isHighlightingRole ? 'animate-siren' : ''}`}>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'buyer' })}
                                className={`py-2 rounded-xl border font-medium text-xs transition-all duration-300 transform active:scale-95 ${formData.role === 'buyer' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25 scale-[1.02]' : 'bg-[#0a0f1d]/50 text-gray-400 border-white/10 hover:border-white/20'}`}
                            >
                                Buy Assets
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'seller' })}
                                className={`py-2 rounded-xl border font-medium text-xs transition-all duration-300 transform active:scale-95 ${formData.role === 'seller' ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25 scale-[1.02]' : 'bg-[#0a0f1d]/50 text-gray-400 border-white/10 hover:border-white/20'}`}
                            >
                                Sell Assets
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 rounded-xl transition-all mt-4 shadow-lg shadow-blue-500/25 transform hover:scale-[1.02] active:scale-[0.98] animate-fade-in-up text-sm disabled:opacity-70 disabled:cursor-not-allowed" style={{ animationDelay: '0.6s' }}>
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Registering...</span>
                            </div>
                        ) : (
                            'Register'
                        )}
                    </button>

                    <div className="mt-3 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                        <QuickRegisterButton onClick={handleQuickRegisterToggle} />
                    </div>
                </form>

                <div className="mt-6 text-center text-xs text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                    Already have an account? <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
