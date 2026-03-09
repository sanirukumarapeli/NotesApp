import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import logo from '../assets/logo.svg';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-[#09090b]/60 border-b border-zinc-800/50 sticky top-0 z-50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <img src={logo} alt="CollabNotes" className="h-8 transition-transform group-hover:scale-105 duration-300 drop-shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
                    </Link>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="flex items-center space-x-3 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800/50 shadow-inner">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-zinc-300 hidden sm:inline pr-2">
                                        {user.name}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-zinc-800/80 text-zinc-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-zinc-700 hover:text-white active:scale-95 transition-all duration-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-zinc-400 hover:text-zinc-100 text-sm font-medium transition-colors px-3 py-2"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:shadow-[0_4px_25px_rgba(79,70,229,0.5)] active:scale-95 transition-all duration-200"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
