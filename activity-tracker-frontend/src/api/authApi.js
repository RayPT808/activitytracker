import axiosInstance from './axiosInstance';


export const login = async (credentials) => {
    try {
        const response = await axiosInstance.post('/api/token/', credentials); // Use JWT endpoint

        // Store tokens in localStorage
        localStorage.setItem('authToken', response.data.access);  // Access Token
        localStorage.setItem('refreshToken', response.data.refresh); // Refresh Token

        console.log('Login successful, tokens stored!');

        return response.data; // Return user data or token
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error);
        throw error;
    }
};

export const register = (userData) => axiosInstance.post('/api/register/', userData);

export const logout = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");  // Get refresh token
        await axiosInstance.post("/api/logout/", { refresh_token: refreshToken });

        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        console.log("Logout successful!");
    } catch (error) {
        console.error("Logout error:", error);
    }
};


const handleLogin = async (event) => {
    event.preventDefault();
    try {
        const userData = await login({ username, password });
        console.log("User logged in:", userData);
        window.location.href = "/dashboard"; // Redirect to dashboard
    } catch (error) {
        console.error("Login error:", error);
    }
};