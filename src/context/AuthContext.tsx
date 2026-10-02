import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, users } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (gameId: string, serial: string) => boolean;
  signup: (gameId: string) => { serial: string; success: boolean };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (gameId: string, serial: string): boolean => {
    const foundUser = users.find(u => u.gameId === gameId && u.serial === serial && u.status === 'active');
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const signup = (gameId: string): { serial: string; success: boolean } => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let serial = '';
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) serial += '-';
      serial += chars[Math.floor(Math.random() * chars.length)];
    }
    return { serial, success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
