import axios from 'axios';

// Create an instance of Axios
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',  // Use the base URL for your Django API
    timeout: 5000, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to get the CSRF token from cookies
const getCsrfToken = () => {
    const csrfCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] : null;
};

// Request interceptor to add tokens (Auth and CSRF)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Get the auth token
        const csrfToken = getCsrfToken(); // Get the CSRF token

        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Attach Bearer token for authentication
        }

        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken; // Attach CSRF token for protection
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration (401 errors)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Token expired or invalid. Attempting to refresh...');

            // Optional: If you have a refresh token mechanism implemented, this section will handle refreshing the JWT token
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const refreshResponse = await axios.post('/auth/refresh/', {
                        refresh: refreshToken,
                    });

                    // Store the new access token and retry the original request
                    localStorage.setItem('authToken', refreshResponse.data.access);
                    error.config.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
                    return axiosInstance(error.config);
                } else {
                    throw new Error('Refresh token not available');
                }
            } catch (refreshError) {
                console.error('Refresh token failed. Logging out...');
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; // Redirect to login page
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
