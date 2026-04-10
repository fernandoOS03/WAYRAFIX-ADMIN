import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('wayrafix_token');
      if (token) {
        try {
          // Normally we would hit /api/v1/auth/me here
          // For now, since it's a simple setup, we just mock user decode or wait for real backend API
          setUser({ id: 1, name: 'Administrador', email: 'admin@wayrafix.com', role: 'ADMIN' });
        } catch (error) {
          localStorage.removeItem('wayrafix_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Example implementation, will be replaced with real backend
      // const { data } = await api.post('/auth/login', { email, password });
      // localStorage.setItem('wayrafix_token', data.token);
      // setUser(data.user);
      
      // Mock login for now
      if (email && password) {
        localStorage.setItem('wayrafix_token', 'mock_jwt_token_123');
        setUser({ id: 1, name: 'Administrador', email, role: 'ADMIN' });
        toast.success('Sesión iniciada correctamente');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al iniciar sesión');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('wayrafix_token');
    setUser(null);
    toast.success('Sesión cerrada');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
