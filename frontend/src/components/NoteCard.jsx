import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { formatDate } from '../utils/formatDate';

const NoteCard = ({ note, onDelete, currentUserId }) => {
    const isOwner = note.owner?._id === currentUserId;

    // Strip HTML tags for preview
    const getPreview = (html) => {
        const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
        return clean.length > 150 ? clean.substring(0, 150) + '...' : clean;
    };

    return (
        <div className="bg-zinc-900 rounded-xl shadow-lg border border-zinc-800 hover:border-zinc-700 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 p-5 flex flex-col group">
            <div className="flex items-start justify-between mb-2">
                <Link
                    to={`/notes/${note._id}`}
                    className="text-lg font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors line-clamp-1"
                >
                    {note.title}
                </Link>
                {note.isPinned && (
                    <span className="text-indigo-400 ml-2 flex-shrink-0" title="Pinned">
                        📌
                    </span>
                )}
            </div>

            <p className="text-zinc-400 text-sm flex-1 mb-3 line-clamp-3">
                {getPreview(note.content)}
            </p>

            <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{formatDate(note.updatedAt)}</span>
                <div className="flex items-center space-x-2">
                    {note.collaborators?.length > 0 && (
                        <span className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/20">
                            {note.collaborators.length} collaborator{note.collaborators.length > 1 ? 's' : ''}
                        </span>
                    )}
                    {!isOwner && (
                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Shared
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/50">
                <Link
                    to={`/notes/${note._id}`}
                    className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors"
                >
                    Open →
                </Link>
                {isOwner && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete(note._id);
                        }}
                        className="text-rose-500 text-sm hover:text-rose-400 transition-colors"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default NoteCard;
