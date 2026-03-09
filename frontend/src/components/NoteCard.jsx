import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { formatDate } from '../utils/formatDate';
import { motion } from 'framer-motion';
import { Pin, Trash2, Users, ArrowRight } from 'lucide-react';

const NoteCard = ({ note, onDelete, currentUserId }) => {
    const isOwner = note.owner?._id === currentUserId;

    // Strip HTML tags for preview
    const getPreview = (html) => {
        const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
        return clean.length > 150 ? clean.substring(0, 150) + '...' : clean;
    };

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-zinc-900/80 backdrop-blur-sm rounded-xl shadow-lg border border-zinc-800/80 hover:border-indigo-500/50 hover:shadow-[0_8px_30px_rgba(79,70,229,0.15)] transition-colors duration-300 p-5 flex flex-col group relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/50 group-hover:via-purple-500/50 group-hover:to-indigo-500/50 transition-all duration-500"></div>

            <div className="flex items-start justify-between mb-3 z-10">
                <Link
                    to={`/notes/${note._id}`}
                    className="text-lg font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors line-clamp-1 pr-2"
                >
                    {note.title}
                </Link>
                {note.isPinned && (
                    <span className="text-indigo-400 flex-shrink-0 bg-indigo-500/10 p-1.5 rounded-md" title="Pinned">
                        <Pin size={16} />
                    </span>
                )}
            </div>

            <p className="text-zinc-400 text-sm flex-1 mb-4 line-clamp-3 leading-relaxed z-10">
                {getPreview(note.content)}
            </p>

            <div className="flex items-center justify-between text-xs text-zinc-500 z-10">
                <span className="font-medium bg-zinc-800/50 px-2.5 py-1 rounded-md">{formatDate(note.updatedAt)}</span>
                <div className="flex items-center space-x-2">
                    {note.collaborators?.length > 0 && (
                        <span className="bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-full border border-indigo-500/20 flex items-center space-x-1 font-medium">
                            <Users size={12} />
                            <span>{note.collaborators.length}</span>
                        </span>
                    )}
                    {!isOwner && (
                        <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
                            Shared
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800/50 z-10">
                <Link
                    to={`/notes/${note._id}`}
                    className="flex items-center space-x-1 text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors"
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
                        className="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-md transition-all"
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
