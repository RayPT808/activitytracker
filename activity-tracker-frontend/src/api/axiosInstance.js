// src/api/axiosInstance.js
import axios from 'axios';

// Determine base URL based on environment
const BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:8000'  // Local Django backend
    : 'https://reactivity-789dd5d26427.herokuapp.com';  // Replace with your prod backend

// Create axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important if using cookies or CSRF
});

// Optional: Fetch CSRF token on app start (if needed for logout or cookie-auth views)
const getCSRFToken = async () => {
  try {
    const response = await axiosInstance.get('/accounts/csrf/'); // Adjust if needed
    const csrfToken = response.data.csrfToken;

    axiosInstance.defaults.headers.common['X-CSRFToken'] = csrfToken;
    console.log('CSRF Token Set:', csrfToken);
  } catch (error) {
    console.error('Error fetching CSRF Token:', error.message);
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Response Status:', error.response.status);
    }
  }
};

// Call CSRF token loader (optional)
getCSRFToken();

// Request interceptor: Add Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 and refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token found');

        const refreshResponse = await axios.post(`${BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem('authToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
