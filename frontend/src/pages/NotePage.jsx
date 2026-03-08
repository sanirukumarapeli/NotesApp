import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import NoteEditor from '../components/NoteEditor';
import CollaboratorModal from '../components/CollaboratorModal';
import toast from 'react-hot-toast';

const NotePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [note, setNote] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showCollaborators, setShowCollaborators] = useState(false);

    const fetchNote = useCallback(async () => {
        try {
            const { data } = await api.get(`/api/notes/${id}`);
            setNote(data);
            setTitle(data.title);
            setContent(data.content);
        } catch (error) {
            toast.error('Failed to load note');
            navigate('/');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchNote();
    }, [fetchNote]);

    const isOwner = note?.owner?._id === user?._id;
    const userRole = note?.collaborators?.find(
        (c) => c.user?._id === user?._id
    )?.role;
    const canEdit = isOwner || userRole === 'editor';

    const handleSave = async () => {
        if (!canEdit) return;
        setSaving(true);
        try {
            const { data } = await api.put(`/api/notes/${id}`, { title, content });
            setNote(data);
            toast.success('Saved!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleTogglePin = async () => {
        if (!isOwner) return;
        try {
            const { data } = await api.put(`/api/notes/${id}`, {
                isPinned: !note.isPinned,
            });
            setNote(data);
            toast.success(data.isPinned ? 'Note pinned' : 'Note unpinned');
        } catch (error) {
            toast.error('Failed to update pin status');
        }
    };

    const handleCollaboratorUpdate = (updatedNote) => {
        setNote(updatedNote);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!note) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigate('/')}
                    className="text-zinc-400 hover:text-zinc-200 text-sm font-medium inline-flex items-center space-x-1 transition-colors"
                >
                    <span>← Back to Dashboard</span>
                </button>
                <div className="flex items-center space-x-3">
                    {isOwner && (
                        <>
                            <button
                                onClick={handleTogglePin}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${note.isPinned
                                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400'
                                    : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                                    }`}
                            >
                                {note.isPinned ? '📌 Pinned' : '📌 Pin'}
                            </button>
                            <button
                                onClick={() => setShowCollaborators(true)}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                            >
                                👥 Collaborators ({note.collaborators?.length || 0})
                            </button>
                        </>
                    )}
                    {canEdit && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-indigo-600 text-white px-5 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-500 active:scale-95 transition-all duration-200 shadow-[0_0_10px_rgba(79,70,229,0.3)] disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    )}
                </div>
            </div>

            {/* Note info */}
            <div className="mb-4 flex items-center space-x-3 text-xs text-zinc-500">
                <span>By {note.owner?.name}</span>
                <span>•</span>
                <span>
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                </span>
                {!isOwner && userRole && (
                    <>
                        <span>•</span>
                        <span
                            className={`px-2 py-0.5 rounded-full border ${userRole === 'editor'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                                }`}
                        >
                            {userRole}
                        </span>
                    </>
                )}
            </div>

            {/* Title */}
            <div className="mb-4">
                {canEdit ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-3xl font-bold text-zinc-100 border-none outline-none focus:ring-0 p-0 bg-transparent placeholder-zinc-700 transition-colors"
                        placeholder="Untitled"
                    />
                ) : (
                    <h1 className="text-3xl font-bold text-zinc-100">{title}</h1>
                )}
            </div>

            {/* Editor */}
            <div className="bg-zinc-900 rounded-xl shadow-lg border border-zinc-800 min-h-[500px]">
                <NoteEditor
                    value={content}
                    onChange={setContent}
                    readOnly={!canEdit}
                />
            </div>

            {/* Collaborator Modal */}
            {showCollaborators && (
                <CollaboratorModal
                    noteId={note._id}
                    collaborators={note.collaborators}
                    onUpdate={handleCollaboratorUpdate}
                    onClose={() => setShowCollaborators(false)}
                />
            )}
        </div>
    );
};

export default NotePage;
