// src/api/axiosInstance.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const getCSRFToken = async () => {
  try {
    const response = await axiosInstance.get('/accounts/csrf/');
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

getCSRFToken();

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

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token found');

        const refreshResponse = await axiosInstance.post('/token/refresh/', {
          refresh: refreshToken,
        });

        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem('authToken', newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
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