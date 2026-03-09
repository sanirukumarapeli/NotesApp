import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Plus, X, Search, FileText } from 'lucide-react';

const SkeletonNote = () => (
    <div className="bg-zinc-900/40 rounded-xl shadow-lg border border-zinc-800/30 p-5 flex flex-col animate-pulse">
        <div className="flex items-start justify-between mb-4">
            <div className="h-6 w-3/4 bg-zinc-800 rounded-lg"></div>
            <div className="h-6 w-8 bg-zinc-800 rounded-md"></div>
        </div>
        <div className="space-y-2 mb-6 flex-1">
            <div className="h-4 w-full bg-zinc-800/60 rounded"></div>
            <div className="h-4 w-5/6 bg-zinc-800/60 rounded"></div>
            <div className="h-4 w-4/6 bg-zinc-800/60 rounded"></div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/30">
            <div className="h-4 w-20 bg-zinc-800/60 rounded"></div>
            <div className="h-8 w-16 bg-zinc-800 rounded-md"></div>
        </div>
    </div>
);

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
            toast.error('📝 Failed to load notes');
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
            toast.error('🔍 Search failed. Please try again');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const { data } = await api.post('/api/notes', { title: title.trim() });
            toast.success(`✨ Note "${data.title}" created!`);
            navigate(`/notes/${data._id}`);
        } catch (error) {
            const message = error.response?.data?.message;
            if (message?.includes('Title is required')) {
                toast.error('✏️ Please enter a note title');
            } else {
                toast.error(`❌ ${message || 'Failed to create note'}`);
            }
        }
    };

    const handleDelete = async (noteId) => {
        if (!window.confirm('Are you sure you want to delete this note?')) return;

        try {
            await api.delete(`/api/notes/${noteId}`);
            setNotes((prev) => prev.filter((n) => n._id !== noteId));
            toast.success('🗑️ Note deleted successfully');
        } catch (error) {
            toast.error(`❌ ${error.response?.data?.message || 'Failed to delete note'}`);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">My Notes</h1>
                    <p className="text-sm text-zinc-400 mt-1 font-medium">
                        {notes.length} note{notes.length !== 1 ? 's' : ''} organized
                    </p>
                </motion.div>
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreate(!showCreate)}
                    className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_25px_rgba(79,70,229,0.5)] transition-all duration-300 inline-flex items-center space-x-2"
                >
                    <Plus size={18} />
                    <span>New Note</span>
                </motion.button>
            </div>

            {/* Create Note Form */}
            {showCreate && (
                <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="bg-zinc-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-800/80 p-5 mb-8"
                >
                    <form onSubmit={handleCreate} className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="relative flex-1">
                            <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter an inspiring note title..."
                                className="w-full pl-11 pr-4 py-3 bg-[#09090b]/80 border border-zinc-700/50 rounded-xl text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-zinc-500 transition-all shadow-inner"
                                autoFocus
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                type="submit"
                                disabled={!title.trim()}
                                className="bg-zinc-100 text-zinc-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-white active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:active:scale-100"
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCreate(false);
                                    setTitle('');
                                }}
                                className="text-zinc-400 hover:text-zinc-200 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
                <SearchBar onSearch={handleSearch} />
            </motion.div>

            {/* Notes Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonNote key={i} />)}
                </div>
            ) : notes.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 px-4 bg-zinc-900/30 rounded-3xl border border-zinc-800/30 border-dashed"
                >
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                        <FileText size={40} className="text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-zinc-100 mb-2">
                        It's quiet here
                    </h2>
                    <p className="text-zinc-400 text-center max-w-sm mb-8 text-lg">
                        You don't have any notes yet. Create your first note to start organizing your thoughts.
                    </p>
                    <button
                        onClick={() => setShowCreate(true)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline flex items-center space-x-2"
                    >
                        <span>Create first note</span>
                        <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                    </button>
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {notes.map((note) => (
                        <motion.div key={note._id} variants={itemVariants}>
                            <NoteCard
                                note={note}
                                onDelete={handleDelete}
                                currentUserId={user?._id}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;
