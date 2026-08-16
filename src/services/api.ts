import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const api = axios.create({
  // URL relativa: Vite proxy redirige al backend automáticamente sin CORS
  baseURL: '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
