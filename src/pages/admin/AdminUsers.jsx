import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserCog, Shield, Mail, Calendar, Search, Filter, MoreVertical, CheckCircle, XCircle, UserPlus, ChevronDown, Phone, Globe, Clock, ArrowUpDown, MoreHorizontal, X, User, Trophy, Loader2, Tag, Edit } from 'lucide-react';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '../../components/admin/ConfirmationModal';
import ListingsShimmer from '../../components/shimmers/ListingsShimmer';
import LeadsShimmer from '../../components/shimmers/LeadsShimmer';
import AdminUsersShimmer from '../../components/shimmers/AdminUsersShimmer';

import UserModal, { RoleBadge } from '../../components/admin/UserModal';
import CustomDropdown from '../../components/admin/CustomDropdown';
const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [updating, setUpdating] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filters, setFilters] = useState({
        role: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const [confirmation, setConfirmation] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDestructive: false
    });

    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Debounce search to prevent too many API calls
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);

        return () => clearTimeout(timer);
    }, [filters, search]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/users', {
                params: {
                    role: filters.role,
                    sortBy: filters.sortBy,
                    sortOrder: filters.sortOrder,
                    search: search
                }
            });
            setUsers(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle Deep Linking
    useEffect(() => {
        if (userId && users.length > 0) {
            const user = users.find(u => u._id === userId);
            if (user) {
                setSelectedUser(user);
            }
        } else if (!userId) {
            setSelectedUser(null);
        }
    }, [userId, users]);

    const handleUserClick = (user) => {
        setSelectedUser(user);
        navigate(`/admin/users/${user._id}`);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        navigate('/admin/users');
    };

    const handleRoleChange = (userId, newRole) => {
        setConfirmation({
            isOpen: true,
            title: 'Change User Role',
            message: `Are you sure you want to change this user's role to ${newRole}? This will update their permissions immediately.`,
            confirmText: 'Change Role',
            isDestructive: false,
            onConfirm: () => confirmRoleChange(userId, newRole)
        });
    };

    const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'success' });

    const showSnackbar = (message, type = 'success') => {
        setSnackbar({ show: true, message, type });
        setTimeout(() => setSnackbar(prev => ({ ...prev, show: false })), 3000);
    };

    const handleUpdateUser = async (userId, userData) => {
        try {
            const { data } = await api.put(`/admin/users/${userId}`, userData);
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, ...data } : u));
            if (selectedUser && selectedUser._id === userId) {
                setSelectedUser(prev => ({ ...prev, ...data }));
            }
        } catch (error) {
            throw error;
        }
    };

    const confirmRoleChange = async (userId, newRole) => {
        setUpdating(userId);
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
            if (selectedUser && selectedUser._id === userId) {
                setSelectedUser(prev => ({ ...prev, role: newRole }));
            }
            showSnackbar(`Role updated to ${newRole}`, "success");
        } catch (error) {
            console.error("Failed to update role", error);
            showSnackbar("Failed to update role", "error");
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="flex-1 h-full p-8 font-sans">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-gray-400 uppercase tracking-tighter">Identity Management</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Manage user identities, roles, and platform permissions.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative z-20 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find user..."
                            className="pl-11 pr-4 py-2.5 bg-gradient-to-r from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-950 bluish:from-[#24304a] bluish:to-[#131b2e] border border-gray-100 dark:border-white/5 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all w-64 shadow-sm hover:shadow-md"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <CustomDropdown
                        label="All Roles"
                        icon={Filter}
                        value={filters.role}
                        onChange={(val) => setFilters(prev => ({ ...prev, role: val }))}
                        options={[
                            { label: 'All Roles', value: '' },
                            { label: 'Buyers', value: 'buyer' },
                            { label: 'Sellers', value: 'seller' },
                            { label: 'Admins', value: 'admin' },
                        ]}
                    />

                    <CustomDropdown
                        label="Sort By"
                        icon={ArrowUpDown}
                        value={`${filters.sortBy}-${filters.sortOrder}`}
                        onChange={(val) => {
                            const [sortBy, sortOrder] = val.split('-');
                            setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                        }}
                        options={[
                            { label: 'Newest First', value: 'createdAt-desc' },
                            { label: 'Oldest First', value: 'createdAt-asc' },
                            { label: 'Name (A-Z)', value: 'fullName-asc' },
                            { label: 'Name (Z-A)', value: 'fullName-desc' },
                        ]}
                    />
                </div>
            </header>

            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-black bluish:from-[#1a243a] bluish:to-[#0d121f] rounded-[32px] border border-white/20 dark:border-white/5 shadow-xl overflow-hidden relative z-10">

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                            <tr>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">User Identity</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Contact Info</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                                <th className="px-8 py-5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-0">
                                        <AdminUsersShimmer />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-16 text-center">
                                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                            <Search className="w-6 h-6" />
                                        </div>
                                        <p className="text-gray-400 font-medium">No users match your criteria.</p>
                                    </td>
                                </tr>
                            ) : users.map((user) => (
                                <motion.tr
                                    key={user._id}
                                    onClick={() => handleUserClick(user)}
                                    className="group hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-colors cursor-pointer"
                                >
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/10 transition-transform group-hover:scale-105 ${user.role === 'admin' ? 'bg-purple-600' : user.role === 'seller' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                                                {user.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{user.fullName}</div>
                                                <div className="text-[10px] text-gray-400 font-mono mt-0.5">#{user._id.substring(0, 8)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Mail className="w-3.5 h-3.5 opacity-50" />
                                                <span className="text-xs font-medium">{user.email}</span>
                                            </div>
                                            {user.phone && (
                                                <div className="text-[10px] text-gray-400 font-mono ml-5.5">{user.phone}</div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar className="w-3.5 h-3.5 opacity-50" />
                                            <span className="text-xs font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-white/5 rounded-lg transition-colors">
                                            <MoreHorizontal className="w-5 h-5" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {selectedUser && (
                    <UserModal
                        user={selectedUser}
                        onClose={handleCloseModal}
                        onRoleChange={handleRoleChange}
                        updating={updating}
                        onUpdateUser={handleUpdateUser}
                        showSnackbar={showSnackbar}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {confirmation.isOpen && (
                    <ConfirmationModal
                        isOpen={confirmation.isOpen}
                        onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                        {...confirmation}
                    />
                )}
            </AnimatePresence>

            {/* Snackbar Notification */}
            <AnimatePresence>
                {snackbar.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${snackbar.type === 'success'
                            ? 'bg-emerald-500/90 text-white border-emerald-400/50'
                            : 'bg-red-500/90 text-white border-red-400/50'
                            }`}
                    >
                        {snackbar.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        <span className="text-sm font-bold uppercase tracking-wider">{snackbar.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminUsers;
