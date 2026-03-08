import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUser(parsed);
                api.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
            } catch {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/api/auth/login', { email, password });
        localStorage.setItem('user', JSON.stringify(data));
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data);
        return data;
    };

    const register = async (name, email, password) => {
        const { data } = await api.post('/api/auth/register', { name, email, password });
        localStorage.setItem('user', JSON.stringify(data));
        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
