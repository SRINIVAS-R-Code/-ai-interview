import api from './axiosInstance';

export const getChallenges = (params) => api.get('/coding', { params });
export const getChallenge = (id) => api.get(`/coding/${id}`);
export const submitCode = (id, data) => api.post(`/coding/${id}/submit`, data);
export const getMySubmissions = () => api.get('/coding/submissions/my');
export const runCode = (id, data) => api.post(`/coding/${id}/run`, data);
