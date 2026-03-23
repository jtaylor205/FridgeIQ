import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USER } from '../mocks/data';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('mock_user');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const u = { ...MOCK_USER, email };
    localStorage.setItem('mock_user', JSON.stringify(u));
    setUser(u);
  };

  const register = async (name, email, password) => {
    const u = { ...MOCK_USER, name, email };
    localStorage.setItem('mock_user', JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('mock_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
