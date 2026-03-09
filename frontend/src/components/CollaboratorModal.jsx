import { useState } from 'react';
import api from '../services/api';
import { toast } from 'sonner';
import { UserPlus, X, Mail } from 'lucide-react';

const CollaboratorModal = ({ noteId, collaborators, onUpdate, onClose }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('viewer');
    const [loading, setLoading] = useState(false);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        try {
            const { data } = await api.post(`/api/notes/${noteId}/collaborators`, {
                email: email.trim(),
                role,
            });
            onUpdate(data);
            setEmail('');
            toast.success(`👥 ${email.trim()} added as ${role}!`);
        } catch (error) {
            const message = error.response?.data?.message;
            if (message?.includes('User not found')) {
                toast.error('👤 User with that email not found');
            } else if (message?.includes('already a collaborator')) {
                toast.error('⚠️ User is already a collaborator');
            } else if (message?.includes('cannot add yourself')) {
                toast.error('🙅 You cannot add yourself as a collaborator');
            } else {
                toast.error(`❌ ${message || 'Failed to add collaborator'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (userId) => {
        try {
            const { data } = await api.delete(
                `/api/notes/${noteId}/collaborators/${userId}`
            );
            onUpdate(data);
            toast.success('👋 Collaborator removed');
        } catch (error) {
            toast.error(`❌ ${error.response?.data?.message || 'Failed to remove collaborator'}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 dark:bg-[#09090b]/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all opacity-100 animate-in fade-in duration-300">
            <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-zinc-200/80 dark:border-zinc-800/80 w-full max-w-md animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between p-5 border-b border-zinc-200/50 dark:border-zinc-800/50">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400">
                        Manage Collaborators
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleAdd} className="space-y-4 mb-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 ml-1">
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="collaborator@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-50/50 dark:bg-[#09090b]/50 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-zinc-400 dark:placeholder-zinc-600 transition-all shadow-inner"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-300 ml-1">
                                Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-4 py-2.5 bg-zinc-50/50 dark:bg-[#09090b]/50 border border-zinc-300 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-inner appearance-none custom-select"
                            >
                                <option value="viewer">Viewer (Read Only)</option>
                                <option value="editor">Editor (Can Edit)</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 mt-2 rounded-xl text-sm font-medium hover:from-indigo-500 hover:to-purple-500 active:scale-95 transition-all duration-200 shadow-[0_4px_15px_rgba(79,70,229,0.3)] disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <span>Add Collaborator</span>
                                    <UserPlus size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {collaborators?.length > 0 && (
                        <div>
                            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 ml-1">
                                Current Collaborators
                            </h3>
                            <ul className="space-y-3">
                                {collaborators.map((c) => (
                                    <li
                                        key={c.user._id}
                                        className="flex items-center justify-between bg-zinc-50/50 dark:bg-[#09090b]/50 px-4 py-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm font-bold border border-indigo-500/20">
                                                {c.user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                                    {c.user.name}
                                                </p>
                                                <p className="text-xs text-zinc-500">{c.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <span
                                                className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${c.role === 'editor'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                    : 'bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-zinc-300/50 dark:border-zinc-700/50'
                                                    }`}
                                            >
                                                {c.role.charAt(0).toUpperCase() + c.role.slice(1)}
                                            </span>
                                            <button
                                                onClick={() => handleRemove(c.user._id)}
                                                className="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-all"
                                                title="Remove collaborator"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {(!collaborators || collaborators.length === 0) && (
                        <div className="text-center py-6 px-4 bg-zinc-50/30 dark:bg-[#09090b]/30 rounded-xl border border-zinc-200/30 dark:border-zinc-800/30 border-dashed mt-4">
                            <p className="text-sm text-zinc-500">
                                No collaborators yet. Add someone to start sharing this note.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollaboratorModal;
