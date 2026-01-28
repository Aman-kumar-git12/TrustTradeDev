import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserCog, Shield, Mail, Calendar, Search, Filter, MoreVertical, CheckCircle, XCircle, UserPlus, ChevronDown, Phone, Globe, Clock, ArrowUpDown, MoreHorizontal, X, User, Trophy, Loader2 } from 'lucide-react';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from '../../components/admin/ConfirmationModal';

const RoleBadge = ({ role }) => {
    const styles = {
        admin: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        seller: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        buyer: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${styles[role] || styles.buyer}`}>
            {role}
        </span>
    );
};

const CustomDropdown = ({ options, value, onChange, icon: Icon, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find(opt => opt.value === value)?.label || label;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-950 bluish:from-[#24304a] bluish:to-[#131b2e] border border-gray-100 dark:border-white/5 rounded-xl text-sm font-medium transition-all hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 min-w-[160px] justify-between text-gray-700 dark:text-gray-200"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                    <span>{selectedLabel}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute top-full mt-2 left-0 w-full min-w-[200px] z-50 origin-top-left"
                    >
                        <div className="bg-gradient-to-b from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-950 bluish:from-[#1a243a] bluish:to-[#141b2d] border border-gray-100 dark:border-white/5 rounded-xl shadow-2xl p-1 overflow-hidden">
                            {options.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${value === opt.value
                                        ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {opt.label}
                                    {value === opt.value && <CheckCircle className="w-3.5 h-3.5" />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const UserModal = ({ user, onClose, onRoleChange, updating }) => {
    const [eliteScore, setEliteScore] = useState(null);
    const [loadingScore, setLoadingScore] = useState(false);

    if (!user) return null;

    const fetchEliteScore = async () => {
        setLoadingScore(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Random score between 700 and 900
        setEliteScore(Math.floor(Math.random() * (900 - 700 + 1) + 700));
        setLoadingScore(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg bg-gradient-to-b from-white to-gray-50 dark:from-[#0f0f11] dark:to-[#0a0a0c] bluish:from-[#0d121f] bluish:to-[#080b14] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10"
                onClick={e => e.stopPropagation()}
            >
                {/* Header with Pattern */}
                <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Profile Content */}
                <div className="px-8 pb-8 -mt-12 relative">
                    <div className="flex justify-between items-end mb-6">
                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-xl border-4 border-white dark:border-[#0f0f11] bluish:border-[#0d121f] ${user.role === 'admin' ? 'bg-purple-600' : user.role === 'seller' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                            {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="mb-2">
                            <RoleBadge role={user.role} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-tight">{user.fullName}</h2>
                            <p className="text-sm text-gray-500 font-mono">ID: {user._id}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Email</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate" title={user.email}>
                                    {user.email}
                                </div>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Joined</span>
                                </div>
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        {user.phone && (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm font-medium">{user.phone}</span>
                            </div>
                        )}

                        {/* Elite Score Section */}
                        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-100 dark:border-amber-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
                                    <Trophy className="w-5 h-5" />
                                    <span className="font-bold text-sm">Elite Score</span>
                                </div>
                                {eliteScore && (
                                    <span className="text-2xl font-black text-amber-600 dark:text-amber-500">{eliteScore}</span>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                The Elite Score represents the user's reputation and activity level within the platform.
                            </p>
                            {!eliteScore && (
                                <button
                                    onClick={fetchEliteScore}
                                    disabled={loadingScore}
                                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                                >
                                    {loadingScore ? (
                                        <>
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            Checking Score...
                                        </>
                                    ) : (
                                        'Data Fetch Elite Score'
                                    )}
                                </button>
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-100 dark:border-white/10">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Management Actions</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {['buyer', 'seller', 'admin'].map(role => (
                                    <button
                                        key={role}
                                        onClick={() => onRoleChange(user._id, role)}
                                        disabled={updating === user._id || user.role === role}
                                        className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${user.role === role
                                            ? 'bg-gray-100 dark:bg-white/5 text-gray-400 border-transparent cursor-default'
                                            : 'bg-white dark:bg-transparent hover:bg-blue-600 hover:text-white border-gray-200 dark:border-white/10 hover:border-transparent hover:shadow-lg hover:shadow-blue-600/20'
                                            }`}
                                    >
                                        {updating === user._id && role !== user.role ? (
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                                        ) : (
                                            `Make ${role}`
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

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

    const confirmRoleChange = async (userId, newRole) => {
        setUpdating(userId);
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
            if (selectedUser && selectedUser._id === userId) {
                setSelectedUser(prev => ({ ...prev, role: newRole }));
            }
        } catch (error) {
            console.error("Failed to update role", error);
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
                                    <td colSpan="5" className="p-16 text-center">
                                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                                        <p className="text-gray-400 font-medium">Loading ecosystem data...</p>
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
                                    layout
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
        </div>
    );
};

export default AdminUsers;
