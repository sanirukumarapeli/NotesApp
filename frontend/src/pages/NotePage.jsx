import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import NoteEditor from '../components/NoteEditor';
import CollaboratorModal from '../components/CollaboratorModal';
import { toast } from 'sonner';
import { ArrowLeft, Pin, Users, Save, Loader2 } from 'lucide-react';

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
            toast.error('📄 Failed to load note');
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
            toast.success('✅ Changes saved!');
        } catch (error) {
            toast.error(`❌ ${error.response?.data?.message || 'Failed to save changes'}`);
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
            toast.success(data.isPinned ? '📌 Note pinned!' : '📎 Note unpinned!');
        } catch (error) {
            toast.error('❌ Failed to update pin status');
        }
    };

    const handleCollaboratorUpdate = (updatedNote) => {
        setNote(updatedNote);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
            </div>
        );
    }

    if (!note) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="group flex items-center space-x-2 text-zinc-400 hover:text-zinc-100 text-sm font-medium transition-colors bg-zinc-900/50 hover:bg-zinc-800/80 px-4 py-2 rounded-xl border border-zinc-800"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                </button>
                <div className="flex items-center space-x-4">
                    {isOwner && (
                        <>
                            <button
                                onClick={handleTogglePin}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${note.isPinned
                                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.2)]'
                                    : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                                    }`}
                            >
                                <Pin size={16} className={note.isPinned ? "fill-current" : ""} />
                                <span>{note.isPinned ? 'Pinned' : 'Pin'}</span>
                            </button>
                            <button
                                onClick={() => setShowCollaborators(true)}
                                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                            >
                                <Users size={16} />
                                <span>Collaborators ({note.collaborators?.length || 0})</span>
                            </button>
                        </>
                    )}
                    {canEdit && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl text-sm font-medium hover:from-indigo-500 hover:to-purple-500 active:scale-95 transition-all duration-200 shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_25px_rgba(79,70,229,0.5)] disabled:opacity-50 flex items-center space-x-2"
                        >
                            {saving ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Save size={16} />
                            )}
                            <span>{saving ? 'Saving...' : 'Save Notes'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Note info */}
            <div className="mb-6 flex items-center space-x-3 text-sm text-zinc-500 font-medium">
                <span className="flex items-center space-x-1.5 bg-zinc-900/50 px-3 py-1 rounded-lg border border-zinc-800/50">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                        {note.owner?.name?.charAt(0).toUpperCase()}
                    </span>
                    <span>{note.owner?.name}</span>
                </span>
                <span>•</span>
                <span className="bg-zinc-900/50 px-3 py-1 rounded-lg border border-zinc-800/50">
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                </span>
                {!isOwner && userRole && (
                    <>
                        <span>•</span>
                        <span
                            className={`px-3 py-1 rounded-lg border ${userRole === 'editor'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50'
                                }`}
                        >
                            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                        </span>
                    </>
                )}
            </div>

            {/* Title */}
            <div className="mb-6 relative group">
                {canEdit ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400 border-none outline-none focus:ring-0 p-0 hover:from-white hover:to-zinc-300 transition-all placeholder-zinc-700 caret-indigo-500"
                        placeholder="Untitled Note"
                    />
                ) : (
                    <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">{title}</h1>
                )}
            </div>

            {/* Editor */}
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-zinc-800/80 min-h-[500px] overflow-hidden group-focus-within:border-indigo-500/30 group-focus-within:shadow-[0_0_30px_rgba(79,70,229,0.1)] transition-all duration-500">
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
