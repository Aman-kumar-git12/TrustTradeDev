import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Building, Shield, Calendar, Clock, Edit2, Save, X, Phone, Camera, Link as LinkIcon, AlertCircle, Briefcase, MapPin } from 'lucide-react';
import api from '../utils/api';

import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { confirm, showSnackbar } = useUI();
    const { login } = useAuth();
    const [profile, setProfile] = useState(null);
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        companyName: '',
        phone: '',
        avatarUrl: '',
        description: '', // Added description
        password: ''
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const [profileRes, businessRes] = await Promise.all([
                    api.get('/auth/me'),
                    api.get('/businesses')
                ]);

                setProfile(profileRes.data);
                if (profileRes.data.role === 'seller') {
                    setBusinesses(businessRes.data || []);
                }

                setFormData({
                    fullName: profileRes.data.fullName,
                    email: profileRes.data.email,
                    companyName: profileRes.data.companyName || '',
                    phone: profileRes.data.phone || '',
                    avatarUrl: profileRes.data.avatarUrl || '',
                    description: profileRes.data.description || '', // Fetch description
                    password: ''
                });
            } catch (error) {
                console.error('Failed to fetch data', error);
                showSnackbar('Failed to fetch profile data', 'error');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const isConfirmed = await confirm({
            title: 'Update Profile',
            message: 'Are you sure you want to save these changes to your profile?',
            confirmText: 'Save Changes'
        });

        if (!isConfirmed) return;

        try {
            const payload = { ...formData };
            if (!payload.password) delete payload.password;

            const { data } = await api.put('/auth/profile', payload);
            setProfile(data);
            // Removed localStorage update to ensure data consistency with DB

            setIsEditing(false);
            showSnackbar('Profile updated successfully!', 'success');
        } catch (error) {
            console.error('Update failed', error);
            showSnackbar(error.response?.data?.message || 'Update failed', 'error');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!profile) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center text-red-500 font-medium bg-white p-6 rounded-lg shadow-sm border border-red-100">
                <AlertCircle className="mx-auto h-10 w-10 mb-3 opacity-80" />
                Failed to load profile. Please try logging in again.
            </div>
        </div>
    );

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <form onSubmit={handleUpdate}>
                    {/* Header Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                        {/* Cover Area */}
                        <div className="h-48 bg-slate-900 relative">
                            {/* Texture/Image */}
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2000')] bg-cover bg-center opacity-30"></div>

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 z-10">
                                {isEditing ? (
                                    <div className="flex space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => { setIsEditing(false); }}
                                            className="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-gray-50 border border-gray-200 transition-colors flex items-center"
                                        >
                                            <X size={16} className="mr-2" /> Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors flex items-center"
                                        >
                                            <Save size={16} className="mr-2" /> Save
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/20 transition-colors flex items-center"
                                    >
                                        <Edit2 size={16} className="mr-2" /> Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Profile Info Bar */}
                        <div className="px-8 pb-6 bg-white relative">
                            <div className="flex flex-col md:flex-row items-end -mt-12 mb-2">
                                {/* Avatar */}
                                <div className="relative z-10">
                                    <div className="h-28 w-28 rounded-xl border-4 border-white bg-gray-200 shadow-lg overflow-hidden relative">
                                        {formData.avatarUrl ? (
                                            <img src={formData.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300 text-4xl font-bold">
                                                {profile.fullName.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-lg border-2 border-white shadow-md cursor-pointer hover:bg-blue-700">
                                            <Camera size={14} />
                                        </div>
                                    )}
                                </div>

                                {/* Text Info */}
                                <div className="md:ml-6 mt-4 md:mt-0 flex-1">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">{profile.fullName}</h1>
                                            <div className="flex items-center text-gray-500 text-sm mt-1">
                                                <Mail size={14} className="mr-1.5" />
                                                <span className="mr-4">{profile.email}</span>
                                                <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wide border ${profile.role === 'seller'
                                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                    : 'bg-blue-50 text-blue-700 border-blue-200'
                                                    }`}>
                                                    {profile.role}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Simple Stats */}
                                        {profile.role === 'seller' && (
                                            <div className="flex gap-4 mt-4 md:mt-0">
                                                <div className="text-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="text-xl font-bold text-gray-900">{businesses.length}</div>
                                                    <div className="text-xs text-gray-500 font-medium">Businesses</div>
                                                </div>
                                                <div className="text-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className="text-xl font-bold text-emerald-600">Active</div>
                                                    <div className="text-xs text-gray-500 font-medium">Status</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6 mb-6">
                        {/* Main Column - Personal Info */}
                        <div className="lg:col-span-2 flex flex-col">
                            {/* Personal Info Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 h-full">
                                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center border-b border-gray-100 pb-3">
                                    <User size={20} className="mr-2 text-blue-600" /> Personal Information
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all"
                                                value={formData.fullName}
                                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                            />
                                        ) : (
                                            <div className="text-gray-900 font-medium">{profile.fullName}</div>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                disabled
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm cursor-not-allowed"
                                                value={formData.email}
                                            />
                                        ) : (
                                            <div className="text-gray-900 font-medium">{profile.email}</div>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        ) : (
                                            <div className="text-gray-900 font-medium">{profile.phone || 'Not provided'}</div>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">Company</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all"
                                                value={formData.companyName}
                                                onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                                placeholder="Company Name"
                                            />
                                        ) : (
                                            <div className="text-gray-900 font-medium">{profile.companyName || 'Not provided'}</div>
                                        )}
                                    </div>

                                    {/* Description Field - Full Width */}
                                    <div className="md:col-span-2 space-y-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">About Me</label>
                                        {isEditing ? (
                                            <textarea
                                                rows="4"
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all resize-none"
                                                value={formData.description}
                                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Share a bit about yourself..."
                                            />
                                        ) : (
                                            <div className="text-gray-900 font-medium text-sm leading-relaxed whitespace-pre-wrap">
                                                {profile.description || 'No description provided.'}
                                            </div>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <div className="md:col-span-2 space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-500 uppercase">Avatar URL</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <LinkIcon size={14} className="text-gray-400" />
                                                </div>
                                                <input
                                                    type="url"
                                                    className="w-full pl-9 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all"
                                                    value={formData.avatarUrl}
                                                    onChange={e => setFormData({ ...formData, avatarUrl: e.target.value })}
                                                    placeholder="https://example.com/image.jpg"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-6">
                            {/* Security Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center border-b border-gray-100 pb-3">
                                    <Shield size={20} className="mr-2 text-emerald-600" /> Security
                                </h2>

                                {isEditing ? (
                                    <div className="space-y-3">
                                        <label className="text-xs font-semibold text-gray-500 uppercase">New Password</label>
                                        <input
                                            type="password"
                                            placeholder="Min 6 characters"
                                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all"
                                            value={formData.password}
                                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        />
                                        <p className="text-[10px] text-gray-400">Leave blank to keep current.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-sm font-medium text-gray-700">Password</span>
                                            <span className="text-xs text-gray-400 font-mono">••••••••</span>
                                        </div>
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-sm font-medium text-gray-700">2FA</span>
                                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded border border-gray-200">OFF</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Activity Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center border-b border-gray-100 pb-3">
                                    <Clock size={20} className="mr-2 text-purple-600" /> Activity
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="bg-blue-50 p-1.5 rounded-md mr-3 text-blue-600">
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase">Joined</div>
                                            <div className="text-sm text-gray-900 font-semibold">{new Date(profile.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="bg-green-50 p-1.5 rounded-md mr-3 text-green-600">
                                            <Clock size={16} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-500 font-medium uppercase">Last Active</div>
                                            <div className="text-sm text-gray-900 font-semibold flex items-center">
                                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                                Now
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* My Businesses Section - Full Width Bottom */}
                    {profile.role === 'seller' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                                    <Building size={20} className="mr-2 text-amber-600" /> My Businesses
                                </h2>
                                <Link to="/my-businesses" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                                    Manage All
                                </Link>
                            </div>

                            {businesses.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {businesses.slice(0, 3).map((b) => (
                                        <div key={b._id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors group bg-gray-50/50 flex flex-col">
                                            <div className="flex items-start space-x-4">
                                                <div className="h-16 w-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                                    {b.imageUrl ? (
                                                        <img src={b.imageUrl} alt={b.businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-gray-400">
                                                            <Building size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-900 truncate">{b.businessName}</h4>
                                                    <div className="flex items-center text-xs text-gray-500 mt-1 mb-3">
                                                        <MapPin size={12} className="mr-1" />
                                                        <span className="truncate">{b.location.city}, {b.location.place}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link to={`/my-businesses/${b._id}`} className="mt-auto pt-3 text-xs font-semibold text-blue-600 hover:underline border-t border-gray-200 flex items-center justify-center">
                                                View Details
                                            </Link>
                                        </div>
                                    ))}
                                    {businesses.length > 3 && (
                                        <Link to="/my-businesses" className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm font-medium h-full">
                                            <span>+{businesses.length - 3} More</span>
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <p className="text-gray-500 text-sm mb-3">No businesses added yet.</p>
                                    <Link to="/my-businesses/new" className="inline-flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                                        Add Business
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Profile;
