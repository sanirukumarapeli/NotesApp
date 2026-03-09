import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import api from '../services/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, Sun, Moon, Monitor, Eye, EyeOff } from 'lucide-react';

const Settings = () => {
    const { user, login } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            toast.error('Name and email are required');
            return;
        }
        try {
            setProfileLoading(true);
            const { data } = await api.put('/api/auth/profile', { name: name.trim(), email: email.trim() });
            localStorage.setItem('user', JSON.stringify(data));
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            toast.success('✅ Profile updated successfully');
            // Force refresh by reloading user state
            window.location.reload();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            toast.error('Please fill in all password fields');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }
        try {
            setPasswordLoading(true);
            await api.put('/api/auth/password', { currentPassword, newPassword });
            toast.success('🔒 Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update password');
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 mb-2">Settings</h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">Manage your account preferences</p>
            </motion.div>

            {/* Appearance Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 mb-6"
            >
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center space-x-2">
                    <Monitor size={20} className="text-indigo-500 dark:text-indigo-400" />
                    <span>Appearance</span>
                </h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Theme</p>
                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">Switch between light and dark mode</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="flex items-center space-x-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all duration-200 border border-zinc-200 dark:border-zinc-700"
                    >
                        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                    </button>
                </div>
            </motion.div>

            {/* Profile Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 mb-6"
            >
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center space-x-2">
                    <User size={20} className="text-indigo-500 dark:text-indigo-400" />
                    <span>Profile</span>
                </h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Name</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50/80 dark:bg-[#09090b]/80 border border-zinc-300/50 dark:border-zinc-700/50 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50/80 dark:bg-[#09090b]/80 border border-zinc-300/50 dark:border-zinc-700/50 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={profileLoading}
                        className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_25px_rgba(79,70,229,0.5)] transition-all duration-300 inline-flex items-center space-x-2 disabled:opacity-50"
                    >
                        <Save size={16} />
                        <span>{profileLoading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </form>
            </motion.div>

            {/* Password Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-200/80 dark:border-zinc-800/80 p-6"
            >
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center space-x-2">
                    <Lock size={20} className="text-indigo-500 dark:text-indigo-400" />
                    <span>Change Password</span>
                </h2>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Current Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                            <input
                                type={showCurrentPassword ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="w-full pl-10 pr-10 py-2.5 bg-zinc-50/80 dark:bg-[#09090b]/80 border border-zinc-300/50 dark:border-zinc-700/50 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                            >
                                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">New Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                            <input
                                type={showNewPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password (min 6 characters)"
                                className="w-full pl-10 pr-10 py-2.5 bg-zinc-50/80 dark:bg-[#09090b]/80 border border-zinc-300/50 dark:border-zinc-700/50 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                            >
                                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">Confirm New Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm new password"
                                className="w-full pl-10 pr-10 py-2.5 bg-zinc-50/80 dark:bg-[#09090b]/80 border border-zinc-300/50 dark:border-zinc-700/50 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 px-5 py-2.5 rounded-xl font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-all duration-200 inline-flex items-center space-x-2 disabled:opacity-50"
                    >
                        <Lock size={16} />
                        <span>{passwordLoading ? 'Updating...' : 'Update Password'}</span>
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Settings;
