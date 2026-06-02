import React, { useState, useEffect } from 'react';
import { Login } from '../../pages/admin/Login';
import { Dashboard } from '../../pages/admin/Dashboard';

export const AdminPortalWrapper: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<any | null>(null);
  const [checking, setChecking] = useState<boolean>(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setAdminUser(JSON.parse(savedUser));
    }
    setChecking(false);
  }, []);

  const handleLoginSuccess = (newToken: string, newAdmin: any) => {
    setToken(newToken);
    setAdminUser(newAdmin);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken(null);
    setAdminUser(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans">
        <div className="h-10 w-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!token || !adminUser) {
    // Show pristine Arabic Admin credentials login
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Show the advanced responsive Admin Dashboard
  return (
    <Dashboard 
      token={token} 
      adminUser={adminUser} 
      onLogout={handleLogout} 
    />
  );
};
