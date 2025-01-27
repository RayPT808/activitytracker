import axiosInstance from './axiosInstance';

export const createActivity = (activityData) => axiosInstance.post('/activities/', activityData);

export const updateActivity = (id, activityData) => axiosInstance.put(`/activities/${id}/`, activityData);

export const deleteActivity = (id) => axiosInstance.delete(`/activities/${id}/`);
