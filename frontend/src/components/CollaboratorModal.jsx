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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Manage Collaborators
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-5">
                    <form onSubmit={handleAdd} className="space-y-3 mb-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="collaborator@example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="viewer">Viewer (read only)</option>
                                <option value="editor">Editor (can edit)</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Collaborator'}
                        </button>
                    </form>

                    {collaborators?.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                Current Collaborators
                            </h3>
                            <ul className="space-y-2">
                                {collaborators.map((c) => (
                                    <li
                                        key={c.user._id}
                                        className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {c.user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">{c.user.email}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded-full ${c.role === 'editor'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-200 text-gray-600'
                                                    }`}
                                            >
                                                {c.role}
                                            </span>
                                            <button
                                                onClick={() => handleRemove(c.user._id)}
                                                className="text-red-400 hover:text-red-600 text-sm"
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
                        <p className="text-sm text-gray-400 text-center">
                            No collaborators yet
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollaboratorModal;
