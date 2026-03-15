import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { loginApi, getMeApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]         = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) { setLoading(false); return; }
      try {
        const me = await getMeApi();
        if (me.role !== 'admin') throw new Error('Not an admin');
        setUser(me);
      } catch {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      } finally { setLoading(false); }
    };
    restore();
  }, []);

  const login = async (email: string, password: string) => {
    const { user, token } = await loginApi(email, password);
    if (user.role !== 'admin') throw new Error('Access denied. Admin accounts only.');
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
