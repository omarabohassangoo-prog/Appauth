import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { OtpModal } from './components/auth/OtpModal';
import { ForgotPasswordModal } from './components/auth/ForgotPasswordModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserDashboard } from './components/user/UserDashboard';
import { LandingHero } from './components/landing/LandingHero';

const MainLayout: React.FC = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { t } = useApp();

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [forgotPassOpen, setForgotPassOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Header */}
      <Header
        onOpenLogin={() => setLoginOpen(true)}
        onOpenRegister={() => setRegisterOpen(true)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1">
        {isAuthenticated ? (
          isAdmin ? (
            <AdminDashboard />
          ) : (
            <UserDashboard />
          )
        ) : (
          <LandingHero
            onOpenLogin={() => setLoginOpen(true)}
            onOpenRegister={() => setRegisterOpen(true)}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>OmniRouter Suite © 2026 · {t('نظام إدارة الرواترات والمصادقة الموحد', 'Unified Enterprise Router & Auth Engine')}</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>PostgreSQL · S3 · Resend · Twilio · PayPal</span>
          </div>
        </div>
      </footer>

      {/* Modals & Notifications */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onOpenRegister={() => setRegisterOpen(true)}
        onOpenForgotPassword={() => setForgotPassOpen(true)}
      />

      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onOpenLogin={() => setLoginOpen(true)}
      />

      <ForgotPasswordModal
        isOpen={forgotPassOpen}
        onClose={() => setForgotPassOpen(false)}
        onOpenLogin={() => setLoginOpen(true)}
      />

      <OtpModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </AppProvider>
  );
}
