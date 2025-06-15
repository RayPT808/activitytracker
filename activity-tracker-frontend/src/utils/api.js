import axios from 'axios';

// Base URL of your API
 //const API_URL = "https://psychic-lamp-pj7rjp4jvgg7f7jxr-8000.app.github.dev/api/";
 const API_URL = "https://psychic-lamp-pj7rjp4jvgg7f7jxr-8000.app.github.dev/api/";


// Create axios instance with base config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth endpoints (no token required)
export const registerUser = (userData) => api.post('register/', userData);
export const loginUser = (credentials) => api.post('login/', credentials);
export const logoutUser = () => {
  const token = localStorage.getItem('authToken');
  return api.post('logout/', {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Activity endpoints (token required)
export const getActivities = () => {
  const token = localStorage.getItem('authToken');
  return api.get('activities/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const recordActivity = async (activityData) => {
  const token = localStorage.getItem('authToken');
  console.log("📤 Payload to be sent to backend:", activityData);  // log payload

  try {
    const response = await api.post('activities/', activityData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("✅ Response from backend:", response.data);  // log success
    return response;
  } catch (error) {
    console.error("❌ Error posting activity:", error.response?.data || error.message);  // log error
    throw error;
  }
};

export const updateActivity = (activityId, updatedData) => {
  const token = localStorage.getItem('authToken');
  return api.put(`activities/${activityId}/`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteActivity = (activityId) => {
  const token = localStorage.getItem('authToken');
  return api.delete(`activities/${activityId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

