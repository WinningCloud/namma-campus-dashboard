import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAssignmentById, assignWriter, assignMediator,
  updateStatus, getAvailableStaff,
} from '../../api/assignments';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { RoleBadge } from '../../components/ui/RoleBadge';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { Table } from '../../components/ui/Table';
import { User } from '../../types';

export const AssignmentDetailPage: React.FC = () => {
  const { id }    = useParams<{ id: string }>();
  const navigate  = useNavigate();
  const qc        = useQueryClient();

  const [writerModal, setWriterModal]     = useState(false);
  const [mediatorModal, setMediatorModal] = useState(false);
  const [otpModal, setOtpModal]           = useState(false);
  const [generatedOtp, setGeneratedOtp]   = useState('');
  const [adminNotes, setAdminNotes]       = useState('');

  const { data: assignment, isLoading } = useQuery({
    queryKey: ['assignment', id],
    queryFn: () => getAssignmentById(id!),
    enabled: !!id,
  });

  const { data: writers = [], isLoading: wLoading } = useQuery({
    queryKey: ['staff', 'writer'],
    queryFn: () => getAvailableStaff('writer'),
    enabled: writerModal,
  });

  const { data: mediators = [], isLoading: mLoading } = useQuery({
    queryKey: ['staff', 'mediator'],
    queryFn: () => getAvailableStaff('mediator'),
    enabled: mediatorModal,
  });

  const assignWriterMutation = useMutation({
    mutationFn: (writer: User) => assignWriter(id!, writer.id, adminNotes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['assignment', id] });
      qc.invalidateQueries({ queryKey: ['assignments'] });
      setWriterModal(false);
      setAdminNotes('');
    },
  });

  const assignMediatorMutation = useMutation({
    mutationFn: (mediator: User) => assignMediator(id!, mediator.id),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['assignment', id] });
      qc.invalidateQueries({ queryKey: ['assignments'] });
      setMediatorModal(false);
      setGeneratedOtp(data.delivery.otp);
      setOtpModal(true);
    },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center h-full p-8">
      <Spinner size="lg" />
    </div>
  );

  if (!assignment) return (
    <div className="p-8 text-ink-400">Assignment not found</div>
  );

  const student  = typeof assignment.student  === 'object' ? assignment.student  : null;
  const writer   = typeof assignment.writer   === 'object' ? assignment.writer   : null;
  const mediator = typeof assignment.mediator === 'object' ? assignment.mediator : null;

  const canAssignWriter   = ['pending', 'writer_assigned'].includes(assignment.status);
  const canAssignMediator = assignment.status === 'completed';

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const staffColumns = [
    { key: 'name', header: 'Name', render: (u: User) => (
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-600">
          {u.name.charAt(0)}
        </div>
        <span className="font-medium text-ink-900">{u.name}</span>
      </div>
    )},
    { key: 'phone',      header: 'Phone',      render: (u: User) => <span className="font-mono text-sm">{u.phone}</span> },
    { key: 'department', header: 'Department', render: (u: User) => <span className="text-ink-600">{u.department}</span> },
    { key: 'action',     header: '',           render: (u: User) => (
      <button
        className="btn-primary text-xs px-3 py-1.5"
        onClick={() => writerModal ? assignWriterMutation.mutate(u) : assignMediatorMutation.mutate(u)}
        disabled={assignWriterMutation.isPending || assignMediatorMutation.isPending}
      >
        Assign
      </button>
    )},
  ];

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <button className="btn-ghost px-0 text-ink-400 hover:text-ink-700 mb-2 text-xs" onClick={() => navigate('/assignments')}>
            ← Back to assignments
          </button>
          <h1 className="text-2xl font-bold text-ink-900">{assignment.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={assignment.status} />
            <span className="text-ink-300">·</span>
            <span className="text-sm text-ink-500">Created {formatDate(assignment.createdAt)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {canAssignWriter && (
            <button className="btn-primary" onClick={() => setWriterModal(true)}>
              Assign Writer
            </button>
          )}
          {canAssignMediator && (
            <button className="btn-primary" onClick={() => setMediatorModal(true)}>
              Assign Mediator
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5">
            <h2 className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-4">Assignment Details</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                ['Subject',    assignment.subject],
                ['Pages',      `${assignment.pages} pages`],
                ['Budget',     `₹${assignment.budget}`],
                ['Department', assignment.department],
                ['College',    assignment.college],
                ['Deadline',   formatDate(assignment.deadline)],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-ink-400 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-ink-900">{value}</p>
                </div>
              ))}
            </div>
            {assignment.description && (
              <div className="mt-4 pt-4 border-t border-surface-100">
                <p className="text-xs text-ink-400 mb-1">Description</p>
                <p className="text-sm text-ink-700 leading-relaxed">{assignment.description}</p>
              </div>
            )}
          </div>

          {assignment.adminNotes && (
            <div className="card p-5 bg-amber-50 border-amber-200">
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Admin Notes</p>
              <p className="text-sm text-amber-800 leading-relaxed">{assignment.adminNotes}</p>
            </div>
          )}

          {assignment.writerNotes && (
            <div className="card p-5">
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Writer Notes</p>
              <p className="text-sm text-ink-700 leading-relaxed">{assignment.writerNotes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Student */}
          {student && (
            <div className="card p-5">
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">Student</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{student.name}</p>
                  <p className="text-xs text-ink-400">{student.email}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-ink-500">
                <p>{student.phone}</p>
                <p>{student.department} · Year {student.year}</p>
              </div>
            </div>
          )}

          {/* Writer */}
          {writer ? (
            <div className="card p-5">
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">Writer</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-600">
                  {writer.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{writer.name}</p>
                  <p className="text-xs text-ink-400">{writer.email}</p>
                </div>
              </div>
              <p className="text-xs text-ink-500">{writer.phone}</p>
            </div>
          ) : (
            <div className="card p-5 border-dashed">
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Writer</p>
              <p className="text-sm text-ink-400">Not yet assigned</p>
            </div>
          )}

          {/* Mediator */}
          {mediator ? (
            <div className="card p-5">
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">Mediator</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-600">
                  {mediator.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink-900">{mediator.name}</p>
                  <p className="text-xs text-ink-400">{mediator.email}</p>
                </div>
              </div>
              <p className="text-xs text-ink-500">{mediator.phone}</p>
            </div>
          ) : (
            <div className="card p-5 border-dashed">
              <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-2">Mediator</p>
              <p className="text-sm text-ink-400">Not yet assigned</p>
            </div>
          )}
        </div>
      </div>

      {/* Assign Writer Modal */}
      <Modal open={writerModal} onClose={() => setWriterModal(false)} title="Assign Writer" width="max-w-2xl">
        <div className="p-6 space-y-4">
          <div>
            <label className="label">Admin Notes (optional)</label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Instructions for the writer..."
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Select Writer</label>
            <Table
              columns={staffColumns}
              data={writers}
              loading={wLoading}
              emptyMessage="No available writers"
            />
          </div>
        </div>
      </Modal>

      {/* Assign Mediator Modal */}
      <Modal open={mediatorModal} onClose={() => setMediatorModal(false)} title="Assign Mediator" width="max-w-2xl">
        <div className="p-6">
          <label className="label">Select Mediator</label>
          <Table
            columns={staffColumns}
            data={mediators}
            loading={mLoading}
            emptyMessage="No available mediators"
          />
        </div>
      </Modal>

      {/* OTP Modal */}
      <Modal open={otpModal} onClose={() => setOtpModal(false)} title="Delivery OTP Generated">
        <div className="p-6 text-center">
          <p className="text-sm text-ink-500 mb-6">
            Share this OTP with the student. The mediator will enter this to confirm delivery.
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            {generatedOtp.split('').map((digit, i) => (
              <div key={i} className="w-12 h-14 rounded-xl bg-brand-50 border-2 border-brand-200 flex items-center justify-center">
                <span className="text-2xl font-bold text-brand-600 font-mono">{digit}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-6">
            Valid for 60 minutes. Share only with the student.
          </p>
          <button className="btn-primary w-full justify-center" onClick={() => setOtpModal(false)}>
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
};
