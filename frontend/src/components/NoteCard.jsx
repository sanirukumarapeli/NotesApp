import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { formatDate } from '../utils/formatDate';
import { motion } from 'framer-motion';
import { Pin, Trash2, Users, ArrowRight, FileText, Star } from 'lucide-react';

const NoteCard = ({ note, onDelete, onToggleFavorite, currentUserId, viewMode = 'grid' }) => {
    const isOwner = note.owner?._id === currentUserId;
    const isFavorite = note.isFavorite && note.isFavorite[currentUserId];

    // Strip HTML tags for preview
    const getPreview = (html) => {
        const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
        return clean.length > 150 ? clean.substring(0, 150) + '...' : clean;
    };

    if (viewMode === 'list') {
        return (
            <motion.div
                whileHover={{ x: 4, scale: 1.005 }}
                className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 hover:border-indigo-500/30 hover:bg-zinc-50/60 dark:hover:bg-zinc-800/60 transition-all duration-200 p-4 flex items-center justify-between group overflow-hidden relative"
            >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="p-2 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-lg text-zinc-500 dark:text-zinc-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors flex-shrink-0">
                        <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center space-x-2">
                            <Link
                                to={`/notes/${note._id}`}
                                className="text-base font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors truncate"
                            >
                                {note.title}
                            </Link>
                            {note.isPinned && (
                                <Pin size={14} className="text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                            )}
                        </div>
                        <p className="text-zinc-400 dark:text-zinc-500 text-sm truncate mt-0.5">
                            {getPreview(note.content)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-6 flex-shrink-0">
                    <div className="hidden sm:flex items-center space-x-3 text-xs">
                        <span className="text-zinc-400 dark:text-zinc-500">{formatDate(note.updatedAt)}</span>
                        {note.collaborators?.length > 0 && (
                            <span className="text-indigo-500/80 dark:text-indigo-400/80 flex items-center space-x-1" title="Collaborators">
                                <Users size={14} />
                                <span>{note.collaborators.length}</span>
                            </span>
                        )}
                        {!isOwner && (
                            <span className="text-emerald-600/80 dark:text-emerald-500/80 font-medium">Shared</span>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onToggleFavorite?.(note);
                            }}
                            className={`p-2 rounded-lg transition-colors ${isFavorite ? 'text-yellow-500 dark:text-yellow-400 hover:bg-yellow-500/10' : 'text-zinc-400 dark:text-zinc-500 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-500/10'}`}
                            aria-label="Toggle favorite"
                        >
                            <Star size={18} className={isFavorite ? 'fill-current' : ''} />
                        </button>
                        <Link
                            to={`/notes/${note._id}`}
                            className="text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 p-2 rounded-lg hover:bg-indigo-500/10 transition-colors"
                        >
                            <ArrowRight size={18} />
                        </Link>
                        {isOwner && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onDelete(note._id);
                                }}
                                className="text-zinc-400 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors"
                                aria-label="Delete note"
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-zinc-200/80 dark:border-zinc-800/80 hover:border-indigo-500/50 hover:shadow-[0_8px_30px_rgba(79,70,229,0.15)] transition-colors duration-300 p-5 flex flex-col group relative overflow-hidden h-full"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/50 group-hover:via-purple-500/50 group-hover:to-indigo-500/50 transition-all duration-500"></div>

            <div className="flex items-start justify-between mb-3 z-10">
                <Link
                    to={`/notes/${note._id}`}
                    className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1 pr-2"
                >
                    {note.title}
                </Link>
                <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onToggleFavorite?.(note);
                        }}
                        className={`p-1.5 rounded-md transition-all ${isFavorite ? 'text-yellow-500 dark:text-yellow-400 bg-yellow-500/10' : 'text-zinc-400 dark:text-zinc-500 hover:text-yellow-500 dark:hover:text-yellow-400 hover:bg-yellow-500/10'}`}
                        aria-label="Toggle favorite"
                    >
                        <Star size={16} className={isFavorite ? 'fill-current' : ''} />
                    </button>
                    {note.isPinned && (
                        <span className="text-indigo-500 dark:text-indigo-400 flex-shrink-0 bg-indigo-500/10 p-1.5 rounded-md" title="Pinned">
                            <Pin size={16} />
                        </span>
                    )}
                </div>
            </div>

            <p className="text-zinc-500 dark:text-zinc-400 text-sm flex-1 mb-4 line-clamp-3 leading-relaxed z-10">
                {getPreview(note.content)}
            </p>

            <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 z-10">
                <span className="font-medium bg-zinc-100/50 dark:bg-zinc-800/50 px-2.5 py-1 rounded-md">{formatDate(note.updatedAt)}</span>
                <div className="flex items-center space-x-2">
                    {note.collaborators?.length > 0 && (
                        <span className="bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/20 flex items-center space-x-1 font-medium">
                            <Users size={12} />
                            <span>{note.collaborators.length}</span>
                        </span>
                    )}
                    {!isOwner && (
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
                            Shared
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50 z-10">
                <Link
                    to={`/notes/${note._id}`}
                    className="flex items-center space-x-1 text-indigo-500 dark:text-indigo-400 text-sm font-medium hover:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                >
                    <span>Open note</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                {isOwner && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete(note._id);
                        }}
                        className="text-zinc-400 dark:text-zinc-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-md transition-all"
                        aria-label="Delete note"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default NoteCard;
