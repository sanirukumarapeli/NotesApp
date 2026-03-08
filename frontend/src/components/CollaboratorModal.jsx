import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

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
            toast.success('Collaborator added!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add collaborator');
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
            toast.success('Collaborator removed');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove collaborator');
        }
    };

    return (
        <div className="fixed inset-0 bg-[#09090b]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 w-full max-w-md">
                <div className="flex items-center justify-between p-5 border-b border-zinc-800/50">
                    <h2 className="text-lg font-semibold text-zinc-100">
                        Manage Collaborators
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-300 text-xl transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-5">
                    <form onSubmit={handleAdd} className="space-y-3 mb-5">
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="collaborator@example.com"
                                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-zinc-600 transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-1">
                                Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 bg-[#09090b] border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            >
                                <option value="viewer">Viewer (read only)</option>
                                <option value="editor">Editor (can edit)</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500 active:scale-95 transition-all duration-200 shadow-[0_0_15px_rgba(79,70,229,0.2)] disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Collaborator'}
                        </button>
                    </form>

                    {collaborators?.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-zinc-400 mb-2">
                                Current Collaborators
                            </h3>
                            <ul className="space-y-2">
                                {collaborators.map((c) => (
                                    <li
                                        key={c.user._id}
                                        className="flex items-center justify-between bg-[#09090b] px-3 py-2 rounded-lg border border-zinc-800/50"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-zinc-200">
                                                {c.user.name}
                                            </p>
                                            <p className="text-xs text-zinc-500">{c.user.email}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full border ${c.role === 'editor'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                                    }`}
                                            >
                                                {c.role}
                                            </span>
                                            <button
                                                onClick={() => handleRemove(c.user._id)}
                                                className="text-rose-500 hover:text-rose-400 text-sm p-1 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {(!collaborators || collaborators.length === 0) && (
                        <p className="text-sm text-zinc-600 text-center py-2">
                            No collaborators yet
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollaboratorModal;
