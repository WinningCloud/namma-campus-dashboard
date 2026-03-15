import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getAllAssignments } from '../../api/assignments';
import { Table } from '../../components/ui/Table';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Assignment } from '../../types';

const STATUSES = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Writer Assigned', value: 'writer_assigned' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Mediator Assigned', value: 'mediator_assigned' },
  { label: 'Out for Delivery', value: 'out_for_delivery' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const AssignmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['assignments', status],
    queryFn: () => getAllAssignments(status || undefined),
  });

  const filtered = search
    ? assignments.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.subject.toLowerCase().includes(search.toLowerCase()) ||
        (typeof a.student === 'object' && a.student?.name?.toLowerCase().includes(search.toLowerCase()))
      )
    : assignments;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const columns = [
    {
      key: 'title',
      header: 'Assignment',
      render: (row: Assignment) => (
        <div>
          <p className="font-medium text-ink-900">{row.title}</p>
          <p className="text-xs text-ink-400 mt-0.5">{row.subject} · {row.pages} pages</p>
        </div>
      ),
    },
    {
      key: 'student',
      header: 'Student',
      render: (row: Assignment) => {
        const s = typeof row.student === 'object' ? row.student : null;
        return s ? (
          <div>
            <p className="font-medium text-ink-900">{s.name}</p>
            <p className="text-xs text-ink-400">{s.department}</p>
          </div>
        ) : <span className="text-ink-400">—</span>;
      },
    },
    {
      key: 'writer',
      header: 'Writer',
      render: (row: Assignment) => {
        const w = typeof row.writer === 'object' ? row.writer : null;
        return w ? <span className="font-medium text-ink-700">{w.name}</span> : <span className="text-ink-300">Unassigned</span>;
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Assignment) => <StatusBadge status={row.status} />,
    },
    {
      key: 'deadline',
      header: 'Deadline',
      render: (row: Assignment) => {
        const overdue = new Date(row.deadline) < new Date() && row.status !== 'delivered';
        return (
          <span className={`text-sm ${overdue ? 'text-red-600 font-medium' : 'text-ink-600'}`}>
            {formatDate(row.deadline)}
          </span>
        );
      },
    },
    {
      key: 'budget',
      header: 'Budget',
      render: (row: Assignment) => <span className="font-medium text-ink-700">₹{row.budget}</span>,
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Assignments</h1>
        <p className="text-sm text-ink-500 mt-0.5">{filtered.length} assignments</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          className="input w-64"
          placeholder="Search by title, subject or student..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map(s => (
            <button
              key={s.value}
              onClick={() => setStatus(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                status === s.value
                  ? 'bg-brand-500 text-white'
                  : 'bg-white border border-surface-200 text-ink-600 hover:bg-surface-50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <Table
          columns={columns}
          data={filtered}
          loading={isLoading}
          emptyMessage="No assignments found"
          onRowClick={row => navigate(`/assignments/${row._id}`)}
        />
      </div>
    </div>
  );
};
