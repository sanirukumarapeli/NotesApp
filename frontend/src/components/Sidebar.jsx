import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import logoDark from '../assets/logo.svg';
import logoLight from '../assets/logo-light.svg';
import { Home, Search, Star, Users, Settings, LogOut, Sun, Moon } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'All Notes', path: '/', icon: Home },
        { name: 'Search', path: '/search', icon: Search },
        { name: 'Favorites', path: '/favorites', icon: Star },
        { name: 'Shared', path: '/shared', icon: Users },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-xl h-screen flex flex-col transition-colors duration-300">
            <div className="p-6 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-3 group">
                    <img src={theme === 'dark' ? logoDark : logoLight} alt="CollabNotes" className="h-8 transition-transform group-hover:scale-105 duration-300 drop-shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                </Link>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all duration-200"
                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.path === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(item.path);
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100'
                                }`}
                        >
                            <Icon size={18} className={isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800/80">
                <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800/50 shadow-inner">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">{user?.name}</p>
                            <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-white active:scale-95 transition-all duration-200"
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
