import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// 1. Create a centralized Axios instance
const apiConnector = axios.create({
  baseURL: `${backendUrl}/api`,
});

// 2. Add a Request Interceptor
// This intercepts EVERY request right before it leaves the browser.
// It grabs the absolute newest token from localStorage and attaches it securely.
// This fixes the "Error toggling bookmark" glitch caused by missing headers.
apiConnector.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiConnector;