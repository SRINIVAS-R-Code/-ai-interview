import api from './axiosInstance';

export const getAllTests = () => api.get('/tests');
export const getTestWithQuestions = (id) => api.get(`/tests/${id}`);
export const submitTest = (id, answers) => api.post(`/tests/${id}/submit`, answers);
export const getMyResults = () => api.get('/tests/results/my');
export const getResultById = (id) => api.get(`/tests/results/${id}`);
