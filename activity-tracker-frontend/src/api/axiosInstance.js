import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api', 
    timeout: 5000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

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
        if (error.response && error.response.status === 401) {
            console.error('Token expired. Attempting to refresh...');
            try {
                const refreshResponse = await axios.post('/auth/refresh/', {
                    refresh: localStorage.getItem('refreshToken'),
                });
                localStorage.setItem('authToken', refreshResponse.data.access);
                error.config.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
                return axiosInstance(error.config); 
            } catch (refreshError) {
                console.error('Refresh token failed. Logging out...');
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; // Redirect to login
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
