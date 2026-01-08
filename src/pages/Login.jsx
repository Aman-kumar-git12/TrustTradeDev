import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { showSnackbar } = useUI();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', formData);
            login(data); // Use context login

            showSnackbar('Login successful!', 'success');

            // Redirect based on role
            // Seller -> /dashboard/seller (which auto-redirects to first business)
            // Buyer -> /marketplace
            if (data.role === 'seller') {
                navigate('/dashboard/seller');
            } else {
                navigate('/marketplace');
            }

        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed';
            showSnackbar(msg, 'error');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-100 px-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-primary mb-6 text-center">Welcome Back</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-lg transition-colors">
                        Log In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/register" className="text-accent font-semibold hover:underline">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
