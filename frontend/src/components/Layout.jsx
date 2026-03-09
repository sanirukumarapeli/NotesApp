import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 overflow-hidden selection:bg-indigo-500/30 transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 overflow-y-auto relative">
                {children}
            </main>
            <CommandPalette />
        </div>
    );
};

export default Layout;
