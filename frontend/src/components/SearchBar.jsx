import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query.trim());
    };

    const handleClear = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 w-full max-w-md">
            <div className="relative flex-1">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search notes..."
                    className="w-full pl-10 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-zinc-500 transition-all"
                />
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        ✕
                    </button>
                )}
            </div>
            <button
                type="submit"
                className="bg-zinc-800 text-zinc-100 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-700 active:scale-95 transition-all duration-200"
            >
                Search
            </button>
        </form>
    );
};

export default SearchBar;
