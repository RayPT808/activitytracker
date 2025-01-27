import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api', // Fallback to localhost
    timeout: 5000, // Optional: set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
