import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotePage from './pages/NotePage';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import useTheme from './hooks/useTheme';

const AppContent = () => {
    const { theme } = useTheme();

    return (
        <Router>
            <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500/30 transition-colors duration-300">
                <Routes>
                    <Route path="/login" element={
                        <>
                            <Navbar />
                            <Login />
                        </>
                    } />
                    <Route path="/register" element={
                        <>
                            <Navbar />
                            <Register />
                        </>
                    } />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Layout>
                                    <Dashboard />
                                </Layout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/search"
                        element={
                            <PrivateRoute>
                                <Layout>
                                    <Dashboard filter="search" />
                                </Layout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/favorites"
                        element={
                            <PrivateRoute>
                                <Layout>
                                    <Dashboard filter="favorites" />
                                </Layout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/shared"
                        element={
                            <PrivateRoute>
                                <Layout>
                                    <Dashboard filter="shared" />
                                </Layout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <PrivateRoute>
                                <Layout>
                                    <Settings />
                                </Layout>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/notes/:id"
                        element={
                            <PrivateRoute>
                                <Layout>
                                    <NotePage />
                                </Layout>
                            </PrivateRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
            <Toaster
                position="top-center"
                richColors
                theme={theme}
                duration={4000}
                closeButton
                expand={true}
                visibleToasts={5}
            />
        </Router>
    );
};

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
