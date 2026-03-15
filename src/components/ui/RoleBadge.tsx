import React from 'react';

const CONFIG: Record<string, string> = {
  student:  'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
  writer:   'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  mediator: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  admin:    'bg-red-50 text-red-700 ring-1 ring-red-200',
};

export const RoleBadge: React.FC<{ role: string }> = ({ role }) => (
  <span className={`badge ${CONFIG[role] || 'bg-surface-100 text-ink-500'} capitalize`}>
    {role}
  </span>
);
