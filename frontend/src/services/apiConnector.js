import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Centrally configured Axios instance
const apiConnector = axios.create({
  baseURL: `${backendUrl}/api`,
});

// Request Interceptor: Automatically attach the JWT token to every outgoing request
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