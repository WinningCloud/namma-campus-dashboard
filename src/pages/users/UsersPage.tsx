import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, updateUserRole, toggleUserStatus } from '../../api/users';
import { Table } from '../../components/ui/Table';
import { RoleBadge } from '../../components/ui/RoleBadge';
import { Modal } from '../../components/ui/Modal';
import { User } from '../../types';

const ROLES = ['student', 'writer', 'mediator', 'admin'];
const ROLE_FILTERS = ['', 'student', 'writer', 'mediator', 'admin'];

export const UsersPage: React.FC = () => {
  const qc = useQueryClient();

  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch]         = useState('');
  const [roleModal, setRoleModal]   = useState<User | null>(null);
  const [newRole, setNewRole]       = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => toggleUserStatus(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => updateUserRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      setRoleModal(null);
    },
  });

  const filtered = users.filter(u => {
    const matchRole = roleFilter ? u.role === roleFilter : true;
    const matchSearch = search
      ? u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchRole && matchSearch;
  });

  const columns = [
    {
      key: 'name',
      header: 'User',
      render: (u: User) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-200 flex items-center justify-center text-xs font-bold text-ink-600 shrink-0">
            {u.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-ink-900">{u.name}</p>
            <p className="text-xs text-ink-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (u: User) => <span className="font-mono text-sm text-ink-600">{u.phone}</span> },
    { key: 'college', header: 'College', render: (u: User) => (
      <div>
        <p className="text-ink-700">{u.college}</p>
        <p className="text-xs text-ink-400">{u.department}</p>
      </div>
    )},
    { key: 'role', header: 'Role', render: (u: User) => <RoleBadge role={u.role} /> },
    {
      key: 'status',
      header: 'Status',
      render: (u: User) => (
        <span className={`badge ${u.isActive ? 'bg-green-50 text-green-700 ring-1 ring-green-200' : 'bg-red-50 text-red-700 ring-1 ring-red-200'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 inline-block" />
          {u.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (u: User) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            className="btn-ghost text-xs"
            onClick={e => { e.stopPropagation(); setNewRole(u.role); setRoleModal(u); }}
          >
            Change Role
          </button>
          <button
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              u.isActive
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'bg-green-50 text-green-600 hover:bg-green-100'
            }`}
            onClick={e => { e.stopPropagation(); toggleMutation.mutate(u.id); }}
            disabled={toggleMutation.isPending}
          >
            {u.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Users</h1>
        <p className="text-sm text-ink-500 mt-0.5">{filtered.length} users</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input
          type="text"
          className="input w-64"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-1.5">
          {ROLE_FILTERS.map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                roleFilter === r
                  ? 'bg-brand-500 text-white'
                  : 'bg-white border border-surface-200 text-ink-600 hover:bg-surface-50'
              }`}
            >
              {r || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <Table
          columns={columns}
          data={filtered}
          loading={isLoading}
          emptyMessage="No users found"
        />
      </div>

      {/* Change Role Modal */}
      <Modal
        open={!!roleModal}
        onClose={() => setRoleModal(null)}
        title={`Change role — ${roleModal?.name}`}
        width="max-w-sm"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="label">New Role</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => (
                <button
                  key={r}
                  onClick={() => setNewRole(r)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors capitalize ${
                    newRole === r
                      ? 'border-brand-500 bg-brand-50 text-brand-700'
                      : 'border-surface-200 bg-white text-ink-600 hover:bg-surface-50'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="btn-secondary flex-1 justify-center" onClick={() => setRoleModal(null)}>
              Cancel
            </button>
            <button
              className="btn-primary flex-1 justify-center"
              onClick={() => roleModal && roleMutation.mutate({ id: roleModal.id, role: newRole })}
              disabled={roleMutation.isPending || newRole === roleModal?.role}
            >
              {roleMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
