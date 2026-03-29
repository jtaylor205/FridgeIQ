import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback((authData) => {
    localStorage.setItem('token', authData.token);
    setUser(authData.user);
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentUser = await authService.getMe();
    setUser(currentUser);
    return currentUser;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        await refreshUser();
      } catch {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [clearSession, refreshUser]);

  const login = async (email, password) => {
    const authData = await authService.login(email, password);
    persistSession(authData);
    return authData.user;
  };

  const register = async (name, email, password) => {
    const authData = await authService.register(name, email, password);
    persistSession(authData);
    return authData.user;
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
