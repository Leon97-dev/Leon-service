import Axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const axios = Axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axios.interceptors.request.use((config) => {
  console.log(`[프론트] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      const current = window.location.pathname;
      const allowAnonymous = ['/login', '/register'].some((path) => current.startsWith(path));
      if (!allowAnonymous) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
