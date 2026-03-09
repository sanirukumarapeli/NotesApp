import { Command } from 'cmdk';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, LogOut } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();

    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((o) => !o);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command) => {
        setOpen(false);
        command();
    };

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed inset-0 z-[100] bg-black/50 dark:bg-[#09090b]/80 backdrop-blur-sm flex items-start justify-center pt-[20vh] transition-all"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setOpen(false);
                }
            }}
        >
            <div
                className="w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center px-4 py-3 border-b border-zinc-200/80 dark:border-zinc-800/80">
                    <Search className="w-5 h-5 text-zinc-500 mr-3" />
                    <Command.Input
                        placeholder="Type a command or search..."
                        className="w-full bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-lg py-1"
                    />
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto p-2 scroll-py-2 custom-scrollbar">
                    <Command.Empty className="py-6 text-center text-sm text-zinc-500">
                        No results found.
                    </Command.Empty>

                    <Command.Group heading="Actions" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 py-2">
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/'))}
                            className="flex items-center px-3 py-2.5 rounded-lg text-sm text-zinc-600 dark:text-zinc-300 hover:bg-indigo-500/10 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer transition-colors aria-selected:bg-indigo-500/10 aria-selected:text-indigo-500 dark:aria-selected:text-indigo-400"
                        >
                            <Plus className="w-4 h-4 mr-3" />
                            <span>Create New Note</span>
                        </Command.Item>
                    </Command.Group>

                    <Command.Group heading="Navigation" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 py-2 mt-2">
                        <Command.Item
                            onSelect={() => runCommand(() => navigate('/'))}
                            className="flex items-center px-3 py-2.5 rounded-lg text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors aria-selected:bg-zinc-100 dark:aria-selected:bg-zinc-800 aria-selected:text-zinc-900 dark:aria-selected:text-zinc-100"
                        >
                            <FileText className="w-4 h-4 mr-3" />
                            <span>Go to Dashboard</span>
                        </Command.Item>
                    </Command.Group>

                    <Command.Group heading="Account" className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 py-2 mt-2">
                        <Command.Item
                            onSelect={() => runCommand(() => {
                                logout();
                                navigate('/login');
                            })}
                            className="flex items-center px-3 py-2.5 rounded-lg text-sm text-zinc-600 dark:text-zinc-300 hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-400 cursor-pointer transition-colors aria-selected:bg-rose-500/10 aria-selected:text-rose-500 dark:aria-selected:text-rose-400"
                        >
                            <LogOut className="w-4 h-4 mr-3" />
                            <span>Log Out</span>
                        </Command.Item>
                    </Command.Group>
                </Command.List>
            </div>
        </Command.Dialog>
    );
};

export default CommandPalette;
