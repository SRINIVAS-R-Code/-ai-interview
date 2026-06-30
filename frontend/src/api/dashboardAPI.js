import api from './axiosInstance';

export const getCoachTips = () => api.get('/dashboard/coach-tips');
