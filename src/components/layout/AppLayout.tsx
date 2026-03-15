import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Spinner } from '../ui/Spinner';

export const AppLayout: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
