import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';  

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = (userData) => api.post('register/', userData);
export const loginUser = (credentials) => api.post('login/', credentials);
export const getActivities = () => api.get('activities/');
export const recordActivity = (activityData) => api.post('activities/', activityData);
export const updateActivity = (activityId, updatedData) => api.put(`activities/${activityId}/`, updatedData);
export const deleteActivity = (activityId) => api.delete(`activities/${activityId}/`);
export const logoutUser = () => api.post('logout/');
