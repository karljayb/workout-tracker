"use client";

import React, { createContext, useContext } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async () => {
    await signIn('github', { callbackUrl: '/' });
  };

  const logout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <AuthContext.Provider value={{ 
      user: session?.user ?? null, 
      login, 
      logout, 
      isLoading: status === 'loading' 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}