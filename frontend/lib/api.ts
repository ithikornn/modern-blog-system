import axios from 'axios';
import { getToken } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000',
});

// แนบ token ทุก request อัตโนมัติ
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ถ้า 401 → redirect ไป login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      window.location.pathname.startsWith('/admin')
    ) {
      window.location.href = '/admin/login';
    }

    return Promise.reject(err);
  },
);

export default api;