import axiosInstance from './axiosInstance';
import jwt_decode from 'jwt-decode';



export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/api/token/', credentials);
    const { access, refresh } = response.data;

    localStorage.setItem('authToken', access);
    localStorage.setItem('refreshToken', refresh);

    const decoded = jwt_decode(access);
    const user = {
      username: decoded.username,
      user_id: decoded.user_id,
    };

    console.log('Login successful, tokens stored!');
    return { access, refresh, user };
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


