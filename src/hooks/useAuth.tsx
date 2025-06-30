
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'artist' | 'listener' | 'developer') => Promise<void>;
  logout: () => void;
  loginWithGoogle: (googleUser: User, accessToken: string) => Promise<void>;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('musistash_user');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
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
      
      // Traditional email/password login (mock for demo)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: 'user123',
        name: 'Demo User',
        email: email,
        avatar: '/placeholder.svg',
        role: 'listener',
        createdAt: new Date().toISOString()
      };
      
      setUser(mockUser);
      localStorage.setItem('musistash_user', JSON.stringify(mockUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'artist' | 'listener' | 'developer') => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration for demo purposes
      const mockUser: User = {
        id: `user_${Date.now()}`,
        name: name,
        email: email,
        avatar: '/placeholder.svg',
        role: role,
        createdAt: new Date().toISOString()
      };
      
      setUser(mockUser);
      localStorage.setItem('musistash_user', JSON.stringify(mockUser));
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

  const loginWithGoogle = async (googleUser: User, accessToken: string) => {
    setIsLoading(true);
    try {
      setUser(googleUser);
      localStorage.setItem('musistash_user', JSON.stringify(googleUser));
      localStorage.setItem('access_token', accessToken);
    } catch (error) {
      console.error('Google login error:', error);
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
