import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';
import { trackLogin, trackLogout, trackError } from '../utils/analytics';

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
    const sessionId = urlParams.get('session');
    const errorParam = urlParams.get('error');

    if (errorParam) {
      const details = urlParams.get('details');
      setError(`Authentication failed: ${details || errorParam}`);
      console.error('Auth error from backend:', errorParam, details);
      // Clean up URL
      window.history.replaceState({}, '', '/');
      return;
    }

    if (sessionId && !token) {
      // Fetch session data from backend using session ID
      const fetchSessionData = async () => {
        try {
          setIsLoading(true);
          const response = await authAPI.getSessionData(sessionId);
          const { token: newToken, user: newUser } = response.data;

          setToken(newToken);
          setUser(newUser);
          localStorage.setItem('authToken', newToken);
          localStorage.setItem('authUser', JSON.stringify(newUser));

          // Track successful login
          trackLogin('openid-connect', newUser.id || newUser.sub);

          // Clean up URL
          window.history.replaceState({}, '', '/');
        } catch (err) {
          console.error('Failed to fetch session data:', err);
          setError('Failed to process authentication session');
          trackError('Session fetch failed', false);
          window.history.replaceState({}, '', '/');
        } finally {
          setIsLoading(false);
        }
      };

      fetchSessionData();
    }
  }, [token]);

  const login = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authAPI.getLoginUrl();
      const { authUrl } = response.data;

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

      // Track logout
      trackLogout();

      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Logout failed';
      setError(errorMessage);
      trackError(`Logout failed: ${errorMessage}`, false);
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