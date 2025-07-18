
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { supabaseService } from '@/services/supabaseService';
import type { Database } from '@/lib/supabase';

type User = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'artist' | 'listener' | 'developer') => Promise<void>;
  logout: () => void;
  loginWithGoogle: (googleUser: any, accessToken: string) => Promise<void>;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user in localStorage (for backward compatibility)
    const savedUser = localStorage.getItem('musistash_user');
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('musistash_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Check if this is a Google OAuth login (password will be 'google_auth_token')
      if (password === 'google_auth_token') {
        // For Google OAuth, the user data is already stored in localStorage
        // by the GoogleSignIn component, just retrieve it
        const savedUser = localStorage.getItem('musistash_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          return;
        } else {
          throw new Error('Google authentication data not found');
        }
      }
      
      // Check for admin account first
      if (email === 'akshathapliyal27@gmail.com' && password === 'admin123') {
        const adminUser = await supabaseService.getUserByEmail(email);
        if (adminUser) {
          setUser(adminUser);
          localStorage.setItem('musistash_user', JSON.stringify(adminUser));
          return;
        }
      }
      
      // Check for demo accounts
      if (email === 'demo@musistash.com' && password === 'demo123') {
        let demoUser = await supabaseService.getUserByEmail(email);
        if (!demoUser) {
          // Create demo user if it doesn't exist
          demoUser = await supabaseService.createUser({
            name: 'Demo User',
            email: email,
            role: 'listener'
          });
        }
        if (demoUser) {
          setUser(demoUser);
          localStorage.setItem('musistash_user', JSON.stringify(demoUser));
          return;
        }
      }
      
      // Try to find existing user
      const existingUser = await supabaseService.getUserByEmail(email);
      if (existingUser) {
        setUser(existingUser);
        localStorage.setItem('musistash_user', JSON.stringify(existingUser));
        return;
      }
      
      // Create new user for demo purposes
      const newUser = await supabaseService.createUser({
        name: 'Demo User',
        email: email,
        role: 'listener'
      });
      
      if (newUser) {
        setUser(newUser);
        localStorage.setItem('musistash_user', JSON.stringify(newUser));
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'artist' | 'listener' | 'developer' | 'admin') => {
    setIsLoading(true);
    
    try {
      // Check if user already exists
      const existingUser = await supabaseService.getUserByEmail(email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser = await supabaseService.createUser({
        name,
        email,
        role
      });
      
      if (newUser) {
        setUser(newUser);
        localStorage.setItem('musistash_user', JSON.stringify(newUser));
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('musistash_user');
    localStorage.removeItem('access_token');
  };

  const loginWithGoogle = async (googleUser: any, accessToken: string) => {
    setIsLoading(true);
    try {
      console.log('🔍 Attempting Google login with user:', googleUser);
      
      // For now, use the simplified approach that stores user in localStorage
      const user = {
        ...googleUser,
        accessToken
      };
      
      setUser(user);
      localStorage.setItem('musistash_user', JSON.stringify(user));
      localStorage.setItem('musistash_token', accessToken);
      
      console.log('🔍 User logged in successfully:', user);
      
    } catch (error) {
      console.error('🔍 Google login error:', error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        loginWithGoogle,
        getAuthHeaders
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
