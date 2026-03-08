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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-5 flex flex-col">
            <div className="flex items-start justify-between mb-2">
                <Link
                    to={`/notes/${note._id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-1"
                >
                    {note.title}
                </Link>
                {note.isPinned && (
                    <span className="text-indigo-500 ml-2 flex-shrink-0" title="Pinned">
                        📌
                    </span>
                )}
            </div>

            <p className="text-gray-500 text-sm flex-1 mb-3 line-clamp-3">
                {getPreview(note.content)}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{formatDate(note.updatedAt)}</span>
                <div className="flex items-center space-x-2">
                    {note.collaborators?.length > 0 && (
                        <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
                            {note.collaborators.length} collaborator{note.collaborators.length > 1 ? 's' : ''}
                        </span>
                    )}
                    {!isOwner && (
                        <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                            Shared
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <Link
                    to={`/notes/${note._id}`}
                    className="text-indigo-600 text-sm font-medium hover:text-indigo-800"
                >
                    Open →
                </Link>
                {isOwner && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onDelete(note._id);
                        }}
                        className="text-red-400 text-sm hover:text-red-600 transition-colors"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default NoteCard;
