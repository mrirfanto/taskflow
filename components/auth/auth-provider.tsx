'use client';

import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  user: null | { id: string; email: string; name: string };
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name: string;
  } | null>(null);

  const login = async (email: string, password: string) => {
    // This would be replaced with actual Supabase auth
    console.log('Login with', email, password);
    // Simulate login
    setIsAuthenticated(true);
    setUser({
      id: '1',
      email,
      name: 'Demo User',
    });
  };

  const register = async (name: string, email: string, password: string) => {
    // This would be replaced with actual Supabase auth
    console.log('Register with', name, email, password);
    // Simulate registration
    setIsAuthenticated(true);
    setUser({
      id: '1',
      email,
      name,
    });
  };

  const logout = async () => {
    // This would be replaced with actual Supabase auth
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
