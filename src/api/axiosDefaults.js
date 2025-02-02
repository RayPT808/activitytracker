import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",  
  withCredentials: true, 
});

export const getCSRFToken = async () => {
  try {
    const response = await axiosInstance.get("/api/csrf/");
    axiosInstance.defaults.headers.common["X-CSRFToken"] = response.data.csrfToken;
    console.log("CSRF Token Set:", response.data.csrfToken);
  } catch (error) {
    console.error("Error fetching CSRF Token", error);
  }
};

getCSRFToken();

export default axiosInstance;
