import axios from 'axios';

// Base URL from Vite env; fall back to localhost for local dev
const baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

// Create a dedicated axios instance for admin
const api = axios.create({
  baseURL,
  // Include credentials only if you switch to cookie-based auth later
  withCredentials: false,
});

// Attach Authorization header from localStorage token on every request
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      // For backward compatibility with backend that may also look at 'token'
      config.headers.token = `Bearer ${token}`;
    }
  } catch (_) {
    // no-op
  }
  return config;
});

export default api;
