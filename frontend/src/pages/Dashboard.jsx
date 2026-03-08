import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchNotes = async () => {
        try {
            const { data } = await api.get('/api/notes');
            setNotes(data);
        } catch (error) {
            toast.error('Failed to load notes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleSearch = async (query) => {
        if (!query) {
            fetchNotes();
            return;
        }
        try {
            setLoading(true);
            const { data } = await api.get(`/api/notes/search?q=${encodeURIComponent(query)}`);
            setNotes(data);
        } catch (error) {
            toast.error('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const { data } = await api.post('/api/notes', { title: title.trim() });
            toast.success('Note created!');
            navigate(`/notes/${data._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create note');
        }
    };

    const handleDelete = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            await api.delete(`/api/notes/${noteId}`);
            setNotes((prev) => prev.filter((n) => n._id !== noteId));
            toast.success('Note deleted');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete note');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-100">My Notes</h1>
                    <p className="text-sm text-zinc-400 mt-1">
                        {notes.length} note{notes.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="bg-indigo-600/90 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-600 active:scale-95 transition-all duration-200 inline-flex items-center space-x-2 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                >
                    <span>+ New Note</span>
                </button>
            </div>

            {/* Create Note Form */}
            {showCreate && (
                <div className="bg-zinc-900 rounded-xl shadow-lg border border-zinc-800 p-5 mb-6">
                    <form onSubmit={handleCreate} className="flex items-center space-x-3">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter note title..."
                            className="flex-1 px-4 py-2.5 bg-[#09090b] border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-zinc-500 transition-all"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="bg-zinc-800 text-zinc-100 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-700 active:scale-95 transition-all duration-200"
                        >
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowCreate(false);
                                setTitle('');
                            }}
                            className="text-zinc-500 hover:text-zinc-300 px-3 py-2.5 transition-colors"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {/* Search */}
            <div className="mb-6">
                <SearchBar onSearch={handleSearch} />
            </div>

            {/* Notes Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
                </div>
            ) : notes.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-5xl mb-4 opacity-70">📝</div>
                    <h2 className="text-xl font-semibold text-zinc-300 mb-2">
                        No notes yet
                    </h2>
                    <p className="text-zinc-500 text-sm">
                        Click &quot;+ New Note&quot; to create your first note
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {notes.map((note) => (
                        <NoteCard
                            key={note._id}
                            note={note}
                            onDelete={handleDelete}
                            currentUserId={user?._id}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
