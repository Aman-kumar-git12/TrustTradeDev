import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: initialRole
    });
    const { showSnackbar } = useUI();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', formData);
            login(data); // Use context login

            showSnackbar('Registration successful! Welcome.', 'success');

            if (data.role === 'seller') navigate('/dashboard/seller');
            else navigate(`/dashboard/buyer/${data._id}`);

        } catch (err) {
            const msg = err.response?.data?.message || 'Registration failed';
            showSnackbar(msg, 'error');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-[#0a0f1d] px-4 py-12 relative overflow-hidden">
            {/* Dynamic Background Elements - Bluish Theme Only */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden block">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-md w-full bg-[#131b2e]/80 backdrop-blur-xl rounded-2xl shadow-xl p-8 relative z-10 border border-white/10">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Create Account</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-[#0a0f1d] text-white transition-all placeholder-gray-500"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-[#0a0f1d] text-white transition-all placeholder-gray-500"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-[#0a0f1d] text-white transition-all placeholder-gray-500"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">I want to...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'buyer' })}
                                className={`py-2 rounded-lg border font-medium transition-all ${formData.role === 'buyer' ? 'bg-blue-600 text-white border-blue-600' : 'bg-[#0a0f1d] text-gray-400 border-white/10'}`}
                            >
                                Buy Assets
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'seller' })}
                                className={`py-2 rounded-lg border font-medium transition-all ${formData.role === 'seller' ? 'bg-blue-600 text-white border-blue-600' : 'bg-[#0a0f1d] text-gray-400 border-white/10'}`}
                            >
                                Sell Assets
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-4 shadow-lg shadow-blue-500/20">
                        Register
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                    Already have an account? <Link to="/login" className="text-blue-400 font-semibold hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
