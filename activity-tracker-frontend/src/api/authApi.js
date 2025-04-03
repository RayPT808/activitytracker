import axiosInstance from './axiosInstance';


export const login = async (credentials) => {
    try {
        const response = await axiosInstance.post('/api/token/', credentials);
        const { access, refresh } = response.data;

        // ✅ Store tokens
        localStorage.setItem('authToken', access);
        localStorage.setItem('refreshToken', refresh);

        console.log('Login successful, tokens stored!');
        return response.data;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error);
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


