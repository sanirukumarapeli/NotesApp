import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Search, FileText, LayoutGrid, List, Pin, Trash2, Edit, Star, Users } from 'lucide-react';

const SkeletonNote = () => (
    <div className="bg-zinc-100/40 dark:bg-zinc-900/40 rounded-xl shadow-lg border border-zinc-200/30 dark:border-zinc-800/30 p-5 flex flex-col animate-pulse">
        <div className="flex items-start justify-between mb-4">
            <div className="h-6 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
            <div className="h-6 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
        </div>
        <div className="space-y-2 mb-6 flex-1">
            <div className="h-4 w-full bg-zinc-200/60 dark:bg-zinc-800/60 rounded"></div>
            <div className="h-4 w-5/6 bg-zinc-200/60 dark:bg-zinc-800/60 rounded"></div>
            <div className="h-4 w-4/6 bg-zinc-200/60 dark:bg-zinc-800/60 rounded"></div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-200/30 dark:border-zinc-800/30">
            <div className="h-4 w-20 bg-zinc-200/60 dark:bg-zinc-800/60 rounded"></div>
            <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md"></div>
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

const Dashboard = ({ filter }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [contextMenu, setContextMenu] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchNotes = async () => {
        try {
            let endpoint = '/api/notes';
            if (filter === 'favorites') endpoint = '/api/notes/favorites';
            else if (filter === 'shared') endpoint = '/api/notes/shared';
            const { data } = await api.get(endpoint);
            setNotes(data);
        } catch (error) {
            toast.error('📝 Failed to load notes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        setSearchQuery('');
        fetchNotes();
    }, [filter]);

    const handleSearch = async (query) => {
        setSearchQuery(query);
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

    const handleToggleFavorite = async (note) => {
        try {
            const { data } = await api.put(`/api/notes/${note._id}/favorite`);
            if (filter === 'favorites' && !(data.isFavorite && data.isFavorite[user?._id])) {
                setNotes((prev) => prev.filter((n) => n._id !== note._id));
            } else {
                setNotes((prev) => prev.map((n) => (n._id === note._id ? data : n)));
            }
            const isFav = data.isFavorite && data.isFavorite[user?._id];
            toast.success(isFav ? '⭐ Added to favorites!' : '☆ Removed from favorites');
        } catch (error) {
            toast.error('❌ Failed to update favorite');
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

    const handleTogglePin = async (note) => {
        if (note.owner?._id !== user?._id) {
            toast.error('Only the owner can pin notes');
            return;
        }
        try {
            const { data } = await api.put(`/api/notes/${note._id}`, {
                isPinned: !note.isPinned,
            });
            setNotes((prev) => prev.map((n) => (n._id === note._id ? data : n)));
            toast.success(data.isPinned ? '📌 Note pinned!' : '📎 Note unpinned!');
        } catch (error) {
            toast.error('❌ Failed to update pin status');
        }
    };

    const pageTitle = filter === 'favorites' ? 'Favorites' : filter === 'shared' ? 'Shared with Me' : filter === 'search' ? 'Search Notes' : 'My Notes';
    const pageIcon = filter === 'favorites' ? Star : filter === 'shared' ? Users : null;
    const showCreateSection = !filter || filter === 'all';

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400">{pageTitle}</h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 font-medium flex items-center space-x-2">
                        <span>{notes.length} note{notes.length !== 1 ? 's' : ''} organized</span>
                        <span className="hidden sm:inline bg-zinc-200/50 dark:bg-zinc-800/50 px-2 py-0.5 rounded text-xs">Press <kbd className="font-sans font-semibold">Cmd+K</kbd> to search</span>
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3"
                >
                    <div className="flex items-center bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl p-1 border border-zinc-200/80 dark:border-zinc-800/80 shadow-inner">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                            title="Grid View"
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm' : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setShowCreate(!showCreate)}
                        className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-[0_4px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_25px_rgba(79,70,229,0.5)] transition-all duration-300 inline-flex items-center space-x-2"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline">New Note</span>
                    </motion.button>
                </motion.div>
            </div>

            {/* Create Note Form */}
            {showCreateSection && showCreate && (
                <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 mb-8"
                >
                    <form onSubmit={handleCreate} className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="relative flex-1">
                            <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter an inspiring note title..."
                                className="w-full pl-11 pr-4 py-3 bg-zinc-50/80 dark:bg-[#09090b]/80 border border-zinc-300/50 dark:border-zinc-700/50 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all shadow-inner"
                                autoFocus
                            />
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                type="submit"
                                disabled={!title.trim()}
                                className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-white active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:active:scale-100"
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCreate(false);
                                    setTitle('');
                                }}
                                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-3 rounded-xl hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
                <SearchBar onSearch={handleSearch} autoFocus={filter === 'search'} />
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
                    className="flex flex-col items-center justify-center py-24 px-4 bg-zinc-100/30 dark:bg-zinc-900/30 rounded-3xl border border-zinc-200/30 dark:border-zinc-800/30 border-dashed"
                >
                    <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                        <FileText size={40} className="text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                        {filter === 'favorites' ? 'No favorites yet' : filter === 'shared' ? 'No shared notes' : filter === 'search' ? 'Search for notes' : "It's quiet here"}
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-center max-w-sm mb-8 text-lg">
                        {filter === 'favorites'
                            ? 'Star notes to add them to your favorites for quick access.'
                            : filter === 'shared'
                                ? "Notes shared with you by others will appear here."
                                : filter === 'search'
                                    ? 'Use the search bar above to find notes by title or content.'
                                    : "You don't have any notes yet. Create your first note to start organizing your thoughts."}
                    </p>
                    {showCreateSection && (
                        <button
                            onClick={() => setShowCreate(true)}
                            className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline flex items-center space-x-2"
                        >
                            <span>Create first note</span>
                            <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>→</motion.span>
                        </button>
                    )}
                </motion.div>
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className={viewMode === 'grid'
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                        : "flex flex-col gap-3"
                    }
                >
                    <AnimatePresence>
                        {notes.map((note) => (
                            <motion.div
                                key={note._id}
                                variants={itemVariants}
                                layout
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    setContextMenu({ mouseX: e.clientX, mouseY: e.clientY, note });
                                }}
                            >
                                <NoteCard
                                    note={note}
                                    onDelete={handleDelete}
                                    onToggleFavorite={handleToggleFavorite}
                                    currentUserId={user?._id}
                                    viewMode={viewMode}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed z-50 w-48 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                    style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => {
                            navigate(`/notes/${contextMenu.note._id}`);
                            setContextMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center space-x-2"
                    >
                        <Edit size={14} />
                        <span>Open Note</span>
                    </button>
                    {contextMenu.note.owner?._id === user?._id && (
                        <>
                            <button
                                onClick={() => {
                                    handleTogglePin(contextMenu.note);
                                    setContextMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center space-x-2"
                            >
                                <Pin size={14} className={contextMenu.note.isPinned ? "fill-current" : ""} />
                                <span>{contextMenu.note.isPinned ? 'Unpin Note' : 'Pin Note'}</span>
                            </button>
                            <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1 w-full" />
                            <button
                                onClick={() => {
                                    handleDelete(contextMenu.note._id);
                                    setContextMenu(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center space-x-2"
                            >
                                <Trash2 size={14} />
                                <span>Delete Note</span>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
