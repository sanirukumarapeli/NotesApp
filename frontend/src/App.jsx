import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotePage from './pages/NotePage';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30">
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/notes/:id"
                            element={
                                <PrivateRoute>
                                    <NotePage />
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
                <Toaster
                    position="top-center"
                    richColors
                    theme="dark"
                    duration={4000}
                    closeButton
                    expand={true}
                    visibleToasts={5}
                />
            </Router>
        </AuthProvider>
    );
}

export default App;
