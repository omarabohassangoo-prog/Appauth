import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { routerEngine } from '../services/routerEngine';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; requiresOtp?: boolean; error?: string }>;
  verifyOtp: (code: string) => Promise<boolean>;
  register: (data: { name: string; email: string; phone?: string; role?: UserRole }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (data: Partial<User>) => void;
  pendingOtpEmail: string | null;
  cancelOtp: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => routerEngine.getCurrentUser());
  const [pendingOtpEmail, setPendingOtpEmail] = useState<string | null>(null);

  useEffect(() => {
    // If no user set, default to admin for seamless initial exploration
    if (!user) {
      const defaultAdmin = routerEngine.getUsers()[0];
      setUser(defaultAdmin);
      routerEngine.setCurrentUser(defaultAdmin);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; requiresOtp?: boolean; error?: string }> => {
    // Simulate auth check
    const existing = routerEngine.getUserByEmail(email);
    if (!existing) {
      return { success: false, error: 'البريد الإلكتروني غير مسجل في النظام' };
    }

    if (existing.status === 'suspended') {
      return { success: false, error: 'تم تجميد هذا الحساب من قبل مدير النظام' };
    }

    if (existing.mfaEnabled) {
      setPendingOtpEmail(email);
      // Dispatch simulated OTP message to user phone/email
      routerEngine.sendMessage('sms', existing.phone || '+966501234567', `رمز التحقق الخاص بك هو: 884210. صالح لمدة 5 دقائق.`);
      return { success: true, requiresOtp: true };
    }

    setUser(existing);
    routerEngine.setCurrentUser(existing);
    routerEngine.addLog('session', 'SESSION_CREATE', 'success', 22, `User ${existing.email} logged in (${existing.role})`);
    return { success: true };
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    if (code === '884210' || code.length === 6) {
      if (pendingOtpEmail) {
        const found = routerEngine.getUserByEmail(pendingOtpEmail);
        if (found) {
          setUser(found);
          routerEngine.setCurrentUser(found);
          routerEngine.addLog('session', 'MFA_VERIFY', 'success', 15, `MFA verified for ${found.email}`);
        }
      }
      setPendingOtpEmail(null);
      return true;
    }
    return false;
  };

  const cancelOtp = () => {
    setPendingOtpEmail(null);
  };

  const register = async (data: { name: string; email: string; phone?: string; role?: UserRole }): Promise<{ success: boolean; error?: string }> => {
    const existing = routerEngine.getUserByEmail(data.email);
    if (existing) {
      return { success: false, error: 'هذا البريد الإلكتروني مسجل مسبقاً' };
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '+966500000000',
      role: data.role || 'user',
      createdAt: new Date().toISOString(),
      status: 'active',
      mfaEnabled: false,
      planId: 'plan-starter',
      balance: 50.0,
      company: 'Individual Account',
    };

    routerEngine.saveUser(newUser);
    setUser(newUser);
    routerEngine.setCurrentUser(newUser);
    routerEngine.addLog('session', 'USER_REGISTER', 'success', 35, `New user registered: ${newUser.email}`);
    
    // Send welcome email
    routerEngine.sendMessage('mail', newUser.email, `أهلاً بك يا ${newUser.name} في منصة OmniRouter! تم تجهيز حسابك بنجاح.`, 'مرحباً بك في OmniRouter');

    return { success: true };
  };

  const logout = () => {
    if (user) {
      routerEngine.addLog('session', 'SESSION_DESTROY', 'success', 10, `User ${user.email} logged out`);
    }
    setUser(null);
    routerEngine.setCurrentUser(null);
  };

  const switchRole = (role: UserRole) => {
    const users = routerEngine.getUsers();
    const target = users.find((u) => u.role === role) || users[0];
    setUser(target);
    routerEngine.setCurrentUser(target);
    routerEngine.addLog('session', 'ROLE_SWITCH', 'success', 8, `Switched context to ${target.name} (${target.role})`);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    routerEngine.saveUser(updated);
    routerEngine.setCurrentUser(updated);
    routerEngine.addLog('session', 'USER_UPDATE', 'success', 12, `Updated profile for ${updated.email}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        verifyOtp,
        register,
        logout,
        switchRole,
        updateProfile,
        pendingOtpEmail,
        cancelOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
