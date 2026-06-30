import api from './axiosInstance';

export const getTopics = () => api.get('/aptitude/topics');
export const getQuestions = (topic, difficulty) => api.get(`/aptitude/${topic}`, { params: { difficulty } });
export const submitAptitude = (topic, answers) => api.post(`/aptitude/${topic}/submit`, answers);
export const getMyAptitudeResults = () => api.get('/aptitude/results/my');
