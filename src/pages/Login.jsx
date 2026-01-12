import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15, when: 'beforeChildren' } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } },
};

const buttonHover = {
    scale: 1.05,
    boxShadow: '0px 0px 20px rgba(59,130,246,0.6)',
    transition: { duration: 0.3 },
};

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await login(email, password);
            navigate('/home');
        } catch (err) {
            setError('Invalid credentials');
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen bg-[#0a0f1d] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Dotted Background Pattern */}
            <div className="fixed inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff33_1px,#000000_1px)] bluish:bg-[radial-gradient(#ffffff33_1px,#0a0f1d_1px)] [background-size:20px_20px] opacity-20 dark:opacity-[0.26] bluish:opacity-[0.26] pointer-events-none z-[1]"></div>

            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob animation-delay-2000"></div>

            <motion.div
                className="relative bg-[#0f1629]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md z-10 overflow-hidden"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                {/* Vertical Scanning Beam Removed */}
                <div className="text-center mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block p-2 rounded-full bg-blue-500/10 mb-3"
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 shadow-lg shadow-blue-500/30"></div>
                    </motion.div>
                    <motion.h2
                        className="text-3xl font-bold text-white mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Welcome Back
                    </motion.h2>
                    <motion.p
                        className="text-gray-400 text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Sign in to access your dashboard
                    </motion.p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm py-2 px-3 rounded-lg text-center mb-6"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#0a0f1d]/50 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-600 text-sm"
                            placeholder="name@company.com"
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                            <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[#0a0f1d]/50 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-gray-600 text-sm"
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2 text-sm animate-fade-in-up"
                        style={{ animationDelay: '0.6s' }}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Logging in...</span>
                            </div>
                        ) : (
                            <>Sign In <ArrowRight className="ml-2" size={16} /></>
                        )}
                    </button>
                </form>

                <motion.div
                    className="mt-6 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <p className="text-gray-400 text-xs">
                        Don't have an account?{' '}
                        <span onClick={() => navigate('/register')} className="text-blue-400 font-semibold hover:text-blue-300 cursor-pointer transition-colors">
                            Create account
                        </span>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
