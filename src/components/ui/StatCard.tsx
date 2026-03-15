import React from 'react';

interface Props {
  label: string;
  value: number | string;
  sub?: string;
  accent?: string;
}

export const StatCard: React.FC<Props> = ({ label, value, sub, accent = 'text-ink-900' }) => (
  <div className="card p-5">
    <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">{label}</p>
    <p className={`text-3xl font-bold ${accent} tabular-nums`}>{value}</p>
    {sub && <p className="text-xs text-ink-400 mt-1">{sub}</p>}
  </div>
);
