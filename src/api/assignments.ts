import client from './client';
import { Assignment } from '../types';

export const getAllAssignments = async (status?: string) => {
  const url = status ? `/assignments/admin?status=${status}` : '/assignments/admin';
  const res = await client.get(url);
  return res.data.data.assignments as Assignment[];
};

export const getAssignmentById = async (id: string) => {
  const res = await client.get(`/assignments/${id}`);
  return res.data.data.assignment as Assignment;
};

export const assignWriter = async (id: string, writerId: string, adminNotes?: string) => {
  const res = await client.put(`/assignments/${id}/assign-writer`, { writerId, adminNotes });
  return res.data.data.assignment as Assignment;
};

export const assignMediator = async (id: string, mediatorId: string) => {
  const res = await client.put(`/assignments/${id}/assign-mediator`, { mediatorId });
  return res.data.data as { assignment: Assignment; delivery: { otp: string; otpExpiresAt: string } };
};

export const updateStatus = async (id: string, status: string) => {
  const res = await client.put(`/assignments/${id}/status`, { status });
  return res.data.data.assignment as Assignment;
};

export const getAvailableStaff = async (role: 'writer' | 'mediator') => {
  const res = await client.get(`/assignments/available-staff?role=${role}`);
  return (res.data.data.staff as any[]).map((u: any) => ({ ...u, id: u._id || u.id }));
};
