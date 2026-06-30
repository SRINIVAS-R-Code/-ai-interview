import api from './axiosInstance';

export const generateFeedback = (data) => api.post('/feedback/generate', data);
export const getMyFeedback = () => api.get('/feedback/my');
export const getFeedbackById = (id) => api.get(`/feedback/${id}`);
export const getAIHint = (data) => api.post('/feedback/hint', data);
export const getIdealSolution = (data) => api.post('/feedback/solution', data);
