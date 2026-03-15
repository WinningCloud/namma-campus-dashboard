import React from 'react';

const CONFIG: Record<string, { label: string; classes: string }> = {
  pending:           { label: 'Pending',          classes: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  writer_assigned:   { label: 'Writer Assigned',  classes: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  in_progress:       { label: 'In Progress',      classes: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200' },
  completed:         { label: 'Completed',        classes: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200' },
  mediator_assigned: { label: 'Mediator Assigned',classes: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200' },
  out_for_delivery:  { label: 'Out for Delivery', classes: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200' },
  delivered:         { label: 'Delivered',        classes: 'bg-green-50 text-green-700 ring-1 ring-green-200' },
  cancelled:         { label: 'Cancelled',        classes: 'bg-red-50 text-red-700 ring-1 ring-red-200' },
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg = CONFIG[status] || { label: status, classes: 'bg-surface-100 text-ink-500' };
  return (
    <span className={`badge ${cfg.classes}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 inline-block" />
      {cfg.label}
    </span>
  );
};
