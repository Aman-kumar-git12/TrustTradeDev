import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Building, Shield, Calendar, Clock, Edit2, Save, X, Phone, Camera, Link as LinkIcon, AlertCircle, Briefcase, MapPin, Sun, Moon, Loader2, Sparkles, Zap, ChevronRight, Settings, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';
import ProfileShimmer from '../components/shimmers/ProfileShimmer';

import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
    const { confirm, showSnackbar } = useUI();
    const { login } = useAuth();
    const { theme, mode, setMode } = useTheme();
    const [profile, setProfile] = useState(null);
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // File Upload State
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef(null);

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        description: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

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
                    phone: profileRes.data.phone || '',
                    description: profileRes.data.description || '',
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

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            const imageFormData = new FormData();
            imageFormData.append('image', file);
            const uploadRes = await api.post('/images/upload', imageFormData);
            const newAvatarUrl = uploadRes.data.url;
            const { data } = await api.put('/auth/profile', { avatarUrl: newAvatarUrl });
            setProfile(data);
            showSnackbar('Profile picture updated!', 'success');
        } catch (error) {
            console.error('Image upload failed', error);
            showSnackbar('Failed to upload image', 'error');
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const isConfirmed = await confirm({
            title: 'Update Profile',
            message: 'Save these changes to your profile?',
            confirmText: 'Save Changes'
        });

        if (!isConfirmed) return;

        try {
            const payload = { ...formData };
            if (!payload.password) delete payload.password;
            const { data } = await api.put('/auth/profile', payload);
            setProfile(data);
            setIsEditing(false);
            showSnackbar('Profile updated successfully!', 'success');
        } catch (error) {
            console.error('Update failed', error);
            showSnackbar(error.response?.data?.message || 'Update failed', 'error');
        }
    };

    if (loading) return <ProfileShimmer />;
    if (!profile) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
            <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4 opacity-80" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Failed to load profile</h3>
                <p className="text-gray-500 mt-2">Please try refreshing the page.</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black bluish:bg-[#020617] font-sans pb-20 relative overflow-hidden transition-colors duration-500">
            {/* Ambient Background Glows */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Header Banner */}
            <div className="h-64 md:h-80 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 z-0" />
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 scale-105 blur-sm"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2564')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-black bluish:from-[#020617] via-transparent to-transparent" />
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 md:-mt-60 relative z-10 animate-fade-in-up">
                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                    .animate-fade-in-up {
                        animation: fadeInUp 0.8s ease-out forwards;
                    }
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                `}</style>
                <form onSubmit={handleUpdate}>
                    {/* Main Profile Header Card */}
                    <div className="bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-zinc-900/90 dark:to-black/90 bluish:from-slate-900/90 bluish:to-slate-950/90 backdrop-blur-xl rounded-3xl p-6 md:p-10 shadow-xl border border-white/20 dark:border-white/5 bluish:border-slate-700/50 mb-8 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left transition-all hover:shadow-2xl hover:scale-[1.01] duration-500 group/card">

                        {/* Avatar Section */}
                        <div className="relative group shrink-0 animate-float">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] p-2 bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/50 dark:border-white/20 shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105">
                                <div className="w-full h-full rounded-[2rem] overflow-hidden bg-gray-100 dark:bg-zinc-900 relative shadow-inner">
                                    {profile.avatarUrl ? (
                                        <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-4xl font-bold">
                                            {profile.fullName.charAt(0)}
                                        </div>
                                    )}
                                    {uploadingImage && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><Loader2 className="text-white animate-spin" /></div>}
                                </div>
                            </div>

                            {/* Floating Camera Button */}
                            <button
                                type="button"
                                onClick={triggerFileInput}
                                className="absolute -bottom-2 -right-2 bg-black dark:bg-white text-white dark:text-black p-3 rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 z-20"
                            >
                                <Camera size={18} />
                            </button>
                            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} accept="image/*" />
                        </div>

                        {/* Text Info section */}
                        <div className="flex-1 w-full pt-2 md:pt-4">
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                                        {profile.fullName}
                                    </h1>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center text-gray-500 dark:text-gray-400 font-medium">
                                        <div className="flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                                            <Mail size={14} className="mr-2" /> {profile.email}
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${profile.role === 'seller' ?
                                            'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' :
                                            'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                            }`}>
                                            {profile.role === 'seller' ? <Briefcase size={12} /> : <User size={12} />}
                                            {profile.role}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    {isEditing ? (
                                        <>
                                            <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-xl font-bold bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all">Cancel</button>
                                            <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-black dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                                                <Save size={18} /> Save
                                            </button>
                                        </>
                                    ) : (
                                        <button type="button" onClick={() => setIsEditing(true)} className="px-5 py-2.5 rounded-xl font-bold bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-all flex items-center gap-2 shadow-sm hover:shadow-md">
                                            <Edit2 size={16} /> Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Bio / Description */}
                            <div className="max-w-2xl bg-gray-50 dark:bg-black/20 rounded-2xl p-4 md:p-0 md:bg-transparent md:dark:bg-transparent border border-gray-100 dark:border-white/5 md:border-none">
                                {isEditing ? (
                                    <textarea
                                        rows="3"
                                        className="w-full px-4 py-3 bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none text-gray-700 dark:text-gray-200 resize-none shadow-inner"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                                        {profile.description || "No bio added yet. Click edit to tell your story."}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Details Column */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Basic Info Card */}
                            <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-zinc-900 dark:to-zinc-950 bluish:from-slate-900 bluish:to-slate-950 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-slate-800 hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                        <Zap size={24} />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Details</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                                        {isEditing ? (
                                            <input type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium" />
                                        ) : (
                                            <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl font-semibold text-gray-700 dark:text-gray-200">{profile.fullName}</div>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                                        {isEditing ? (
                                            <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+1234567890" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium" />
                                        ) : (
                                            <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl font-semibold text-gray-700 dark:text-gray-200">{profile.phone || 'N/A'}</div>
                                        )}
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                                        {isEditing ? (
                                            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium" />
                                        ) : (
                                            <div className="p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-xl font-semibold text-gray-500 dark:text-gray-400 flex justify-between items-center">
                                                {profile.email}
                                                <Shield size={14} className="text-green-500" />
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={formData.password}
                                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                    placeholder="Leave blank to keep current password"
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Businesses Section */}
                            {profile.role === 'seller' && (
                                <div className="bg-gradient-to-br from-white to-amber-50/30 dark:from-zinc-900 dark:to-zinc-950 bluish:from-slate-900 bluish:to-slate-950 rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-slate-800 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                                                <Building size={24} />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">My Businesses</h2>
                                        </div>
                                        <Link to="/my-businesses" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
                                    </div>

                                    {businesses.length > 0 ? (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {businesses.slice(0, 4).map(b => (
                                                <Link key={b._id} to={`/my-businesses/${b._id}`} className="group p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 hover:bg-white dark:hover:bg-zinc-800 border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-zinc-700 overflow-hidden shrink-0">
                                                        <img src={(b.images?.[0]) || 'https://via.placeholder.com/150'} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{b.businessName}</h4>
                                                        <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                                            <MapPin size={10} className="mr-1" /> {b.location?.city}
                                                        </div>
                                                    </div>
                                                    <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-blue-500 transition-colors" />
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 rounded-2xl border-2 border-dashed border-gray-200 dark:border-zinc-800">
                                            <p className="text-gray-500 font-medium">No businesses listed yet.</p>
                                            <Link to="/my-businesses/new" className="inline-block mt-3 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold hover:opacity-80 transition-opacity">Add Business</Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">

                            {/* Stats Card - Floating aesthetic */}
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-10"><Sparkles size={100} /></div>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Sparkles size={18} /> Impact Score</h3>
                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                        <div className="text-3xl font-black mb-1">{businesses.length}</div>
                                        <div className="text-xs font-medium opacity-80 uppercase tracking-wider">Listings</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                        <div className="text-3xl font-black mb-1">Active</div>
                                        <div className="text-xs font-medium opacity-80 uppercase tracking-wider">Status</div>
                                    </div>
                                </div>
                            </div>

                            {/* Appearance Settings */}
                            <div className="bg-gradient-to-br from-white to-purple-50/30 dark:from-zinc-900 dark:to-zinc-950 bluish:from-slate-900 bluish:to-slate-950 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-slate-800 hover:shadow-md transition-shadow duration-300">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Settings size={18} /> Preferences
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Theme</label>
                                        <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-100 dark:bg-zinc-800 rounded-xl">
                                            {['light', 'dark', 'default'].map((m) => (
                                                <button
                                                    type="button"
                                                    key={m}
                                                    onClick={() => setMode(m)}
                                                    className={`py-2 rounded-lg text-xs font-bold capitalize transition-all ${mode === m ? 'bg-white dark:bg-zinc-700 text-black dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                                                        }`}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Date Joined */}
                            <div className="bg-white dark:bg-zinc-900 bluish:bg-slate-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 bluish:border-slate-800 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Member Since</div>
                                    <div className="text-gray-900 dark:text-white font-bold">{new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</div>
                                </div>
                                <Calendar size={24} className="text-gray-300 dark:text-zinc-700" />
                            </div>

                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default Profile;
