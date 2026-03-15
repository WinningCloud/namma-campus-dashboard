import axios from 'axios';

const client = axios.create({
  baseURL: 'https://namma-campus-backend.onrender.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.message || err.message || 'Something went wrong';
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(new Error(msg));
  }
);

export default client;
