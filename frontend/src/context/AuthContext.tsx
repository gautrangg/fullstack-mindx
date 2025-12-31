import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

export interface User {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  uid?: string;
  sub?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Handle auth callback from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authData = urlParams.get('auth');
    const errorParam = urlParams.get('error');
    
    if (errorParam) {
      const details = urlParams.get('details');
      setError(`Authentication failed: ${details || errorParam}`);
      console.error('Auth error from backend:', errorParam, details);
      // Clean up URL
      window.history.replaceState({}, '', '/');
      return;
    }
    
    if (authData && !token) {
      try {
        console.log('Auth data received in URL, parsing...');
        const decoded = JSON.parse(decodeURIComponent(authData));
        console.log('Decoded auth data:', decoded);
        
        const { token: newToken, user: newUser } = decoded;
        
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('authUser', JSON.stringify(newUser));
        
        console.log('✅ User logged in:', newUser);
        
        // Clean up URL
        window.history.replaceState({}, '', '/');
      } catch (err) {
        console.error('Failed to parse auth data:', err);
        setError('Failed to process authentication data');
        window.history.replaceState({}, '', '/');
      }
    }
  }, [token]);

  const login = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Getting login URL from backend...');
      const response = await authAPI.getLoginUrl();
      const { authUrl } = response.data;
      
      console.log('Redirecting to:', authUrl);
      // Redirect to OpenID provider
      window.location.href = authUrl;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      console.error('Login error:', err);
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authAPI.logout();
      
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      
      console.log('✅ User logged out');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Logout failed';
      setError(errorMessage);
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};