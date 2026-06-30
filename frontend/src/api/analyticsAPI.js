import api from './axiosInstance';

export const getSummary = () => api.get('/analytics/summary');
export const getProgress = () => api.get('/analytics/progress');
export const getSubjectBreakdown = () => api.get('/analytics/subjects');
export const getLeaderboard = () => api.get('/leaderboard');
export const getMyRank = () => api.get('/leaderboard/my-rank');
