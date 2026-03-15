import client from './client';
import { User } from '../types';

const normalize = (u: any): User => ({ ...u, id: u._id || u.id });

export const getAllUsers = async () => {
  const res = await client.get('/auth/users');
  return (res.data.data.users as any[]).map(normalize) as User[];
};

export const updateUserRole = async (id: string, role: string) => {
  const res = await client.put(`/auth/users/${id}/role`, { role });
  return normalize(res.data.data.user) as User;
};

export const toggleUserStatus = async (id: string) => {
  const res = await client.put(`/auth/users/${id}/status`, {});
  return normalize(res.data.data.user) as User;
};
