import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/supabaseService';

// Device fingerprint generation
const getDeviceFingerprint = (): string => {
  const stored = localStorage.getItem('eclesiar_device_fp');
  if (stored) return stored;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx!.textBaseline = 'top';
  ctx!.font = '14px Arial';
  ctx!.fillText('Eclesiar-FP-2024', 2, 2);

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    canvas.toDataURL(),
    navigator.hardwareConcurrency || 'unknown',
  ];

  const fp = 'fp_' + btoa(components.join('|')).slice(0, 32);
  localStorage.setItem('eclesiar_device_fp', fp);
  return fp;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (gameId: string, serial: string) => Promise<{ success: boolean; error?: string }>;
  signup: (gameId: string) => Promise<{ success: boolean; serial?: string; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = () => {
      const storedUser = localStorage.getItem('eclesiar_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          // Verify device fingerprint
          const currentFp = getDeviceFingerprint();
          if (parsed.device_fingerprint === currentFp) {
            setUser(parsed);
          } else {
            localStorage.removeItem('eclesiar_user');
          }
        } catch {
          localStorage.removeItem('eclesiar_user');
        }
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = async (gameId: string, serial: string) => {
    const deviceFp = getDeviceFingerprint();
    const result = await authService.login(gameId, serial, deviceFp);

    if (result.success && result.user) {
      setUser(result.user);
      localStorage.setItem('eclesiar_user', JSON.stringify(result.user));
      return { success: true };
    }
    return { success: false, error: result.error || 'خطأ غير معروف' };
  };

  const signup = async (gameId: string) => {
    const deviceFp = getDeviceFingerprint();
    const result = await authService.signup(gameId, deviceFp);
    return {
      success: result.success,
      serial: result.serial || undefined,
      error: result.error || undefined,
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eclesiar_user');
  };

  const refreshUser = async () => {
    if (user) {
      const deviceFp = getDeviceFingerprint();
      const result = await authService.login(user.game_id, user.serial, deviceFp);
      if (result.success && result.user) {
        setUser(result.user);
        localStorage.setItem('eclesiar_user', JSON.stringify(result.user));
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
