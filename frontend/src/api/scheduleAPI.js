import api from './axiosInstance';

export const getMySchedules = () => api.get('/schedule/my');
export const createSchedule = (data) => api.post('/schedule', data);
export const updateSchedule = (id, data) => api.put(`/schedule/${id}`, data);
export const deleteSchedule = (id) => api.delete(`/schedule/${id}`);
