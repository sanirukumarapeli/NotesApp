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
        <nav className="bg-[#09090b] border-b border-zinc-800/50 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <img src={logo} alt="CollabNotes" className="h-8 transition-transform group-hover:scale-105 duration-300" />
                    </Link>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-sm text-zinc-400 hidden sm:inline">
                                    {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-zinc-800 text-zinc-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-700 active:scale-95 transition-all duration-200"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-zinc-400 hover:text-zinc-100 text-sm font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600/90 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 active:scale-95 transition-all duration-200 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
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
