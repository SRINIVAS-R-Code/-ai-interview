import api from './axiosInstance';

export const startInterview = (data) => api.post('/ai-interviews/start', data);
export const respondToInterview = (id, data) => api.post(`/ai-interviews/${id}/respond`, data);
export const getMyInterviews = () => api.get('/ai-interviews/my');
export const getInterviewById = (id) => api.get(`/ai-interviews/${id}`);
