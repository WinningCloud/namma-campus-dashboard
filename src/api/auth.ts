import client from './client';
import { User } from '../types';

const normalize = (u: any): User => ({ ...u, id: u._id || u.id });

export const loginApi = async (email: string, password: string) => {
  const res = await client.post('/auth/login', { email, password });
  const { user, token } = res.data.data;
  return { user: normalize(user) as User, token };
};

export const getMeApi = async () => {
  const res = await client.get('/auth/me');
  return normalize(res.data.data.user) as User;
};
