import axios from 'axios';

// Base URL of your API
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

export const recordActivity = (activityData) => {
  const token = localStorage.getItem('authToken');
  return api.post('activities/', activityData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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

