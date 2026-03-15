import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getAllAssignments } from '../../api/assignments';
import { getAllUsers } from '../../api/users';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Spinner } from '../../components/ui/Spinner';
import { Assignment } from '../../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const { data: assignments = [], isLoading: aLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: () => getAllAssignments(),
  });

  const { data: users = [], isLoading: uLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });

  const stats = {
    total:      assignments.length,
    pending:    assignments.filter(a => a.status === 'pending').length,
    inProgress: assignments.filter(a => ['assigned', 'in_progress'].includes(a.status)).length,
    completed:  assignments.filter(a => a.status === 'writing_completed').length,
    delivering: assignments.filter(a => ['picked_up', 'out_for_delivery'].includes(a.status)).length,
    delivered:  assignments.filter(a => a.status === 'delivered').length,
  };

  const userStats = {
    total:     users.length,
    students:  users.filter(u => u.role === 'student').length,
    writers:   users.filter(u => u.role === 'writer').length,
    mediators: users.filter(u => u.role === 'mediator').length,
  };

  const needsAction = assignments.filter(a =>
    a.status === 'pending' || a.status === 'writing_completed'
  ).slice(0, 8);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>
        <p className="text-sm text-ink-500 mt-0.5">Platform overview and pending actions</p>
      </div>

      {/* Assignment Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <StatCard label="Total"       value={stats.total}      />
        <StatCard label="Pending"     value={stats.pending}     accent="text-amber-600" />
        <StatCard label="Active"      value={stats.inProgress}  accent="text-blue-600" />
        <StatCard label="Completed"   value={stats.completed}   accent="text-brand-600" />
        <StatCard label="Delivering"  value={stats.delivering}  accent="text-orange-500" />
        <StatCard label="Delivered"   value={stats.delivered}   accent="text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Needs Action Table */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
            <div>
              <h2 className="text-sm font-semibold text-ink-900">Needs Action</h2>
              <p className="text-xs text-ink-400 mt-0.5">Assignments waiting for assignment</p>
            </div>
            <button className="btn-ghost text-xs" onClick={() => navigate('/assignments')}>
              View all
            </button>
          </div>

          {aLoading ? (
            <div className="flex items-center justify-center py-12"><Spinner /></div>
          ) : needsAction.length === 0 ? (
            <div className="text-center py-12 text-sm text-ink-400">All assignments are assigned</div>
          ) : (
            <div className="divide-y divide-surface-100">
              {needsAction.map((a: Assignment) => {
                const student = typeof a.student === 'object' ? a.student : null;
                return (
                  <div
                    key={a._id}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-surface-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/assignments/${a._id}`)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink-900 truncate">{a.title}</p>
                      <p className="text-xs text-ink-400 mt-0.5">
                        {student?.name || 'Unknown'} · {a.subject} · {a.pages}p
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <span className="text-xs text-ink-400">{formatDate(a.deadline)}</span>
                      <StatusBadge status={a.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Users Summary */}
        <div className="card">
          <div className="px-6 py-4 border-b border-surface-200">
            <h2 className="text-sm font-semibold text-ink-900">Users</h2>
            <p className="text-xs text-ink-400 mt-0.5">Platform user breakdown</p>
          </div>
          {uLoading ? (
            <div className="flex items-center justify-center py-12"><Spinner /></div>
          ) : (
            <div className="p-6 space-y-4">
              {[
                { label: 'Total Users',  value: userStats.total,     color: 'bg-ink-900' },
                { label: 'Students',     value: userStats.students,  color: 'bg-indigo-500' },
                { label: 'Writers',      value: userStats.writers,   color: 'bg-brand-500' },
                { label: 'Mediators',    value: userStats.mediators, color: 'bg-amber-500' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-sm text-ink-700">{label}</span>
                  </div>
                  <span className="text-sm font-semibold text-ink-900 tabular-nums">{value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-surface-100">
                <button className="btn-ghost text-xs w-full justify-center" onClick={() => navigate('/users')}>
                  Manage users
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
