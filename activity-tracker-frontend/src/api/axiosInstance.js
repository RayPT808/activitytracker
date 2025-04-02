import axios from 'axios';



const BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://127.0.0.1:8000'  // Use localhost in dev
  : 'https://activitytracking-bf7924cd3676.herokuapp.com/ ';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
     
});



const getCSRFToken = async () => {
    try {
      const response = await axiosInstance.get("/api/csrf/");
      axiosInstance.defaults.headers.common["X-CSRFToken"] = response.data.csrfToken;
      console.log("CSRF Token Set:", response.data.csrfToken);
    } catch (error) {
      console.error("Error fetching CSRF Token", error);
    }
  };
  
  getCSRFToken();
  

// Request interceptor to add tokens (Auth and CSRF)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Get the auth token
        const csrfToken = getCsrfToken(); // Get the CSRF token

        if (token) {
            config.headers.Authorization = `JWT ${token}`; // Attach Bearer token for authentication
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
                    const refreshResponse = await axios.post('/api/token/refresh/', {
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
