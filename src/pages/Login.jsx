import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/home');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <motion.div
            className="min-h-screen bg-[#0a0f1d] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#0a0f1d] via-[#0a0f1d]/80 to-[#0a0f1d]"
                animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
            />

            <motion.div
                className="relative bg-[#131b2e] rounded-xl shadow-2xl p-8 w-full max-w-md z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h2 className="text-3xl font-bold text-center text-blue-400 mb-6" variants={itemVariants}>
                    Sign In
                </motion.h2>
                {error && (
                    <motion.p className="text-red-400 text-center mb-4" variants={itemVariants}>
                        {error}
                    </motion.p>
                )}
                <motion.form onSubmit={handleSubmit} className="space-y-4" variants={itemVariants}>
                    <motion.div variants={itemVariants}>
                        <label className="block text-gray-300 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 bg-[#0f1629] text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className="block text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 bg-[#0f1629] text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </motion.div>
                    <motion.button
                        type="submit"
                        className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors"
                        whileHover={buttonHover}
                        variants={itemVariants}
                    >
                        Login <ArrowRight className="ml-2" size={18} />
                    </motion.button>
                </motion.form>
            </motion.div>
        </motion.div>
    );
};

export default Login;
