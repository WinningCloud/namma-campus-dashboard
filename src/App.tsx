import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { AssignmentsPage } from './pages/assignments/AssignmentsPage';
import { AssignmentDetailPage } from './pages/assignments/AssignmentDetailPage';
import { UsersPage } from './pages/users/UsersPage';
import { MasterConfigPage } from './pages/master/MasterConfigPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/"            element={<DashboardPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/assignments/:id" element={<AssignmentDetailPage />} />
          <Route path="/users"       element={<UsersPage />} />
          <Route path="/master"      element={<MasterConfigPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
