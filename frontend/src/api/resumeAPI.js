import api from './axiosInstance';

export const uploadResume = (formData) => api.post('/resume/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getMyResume = () => api.get('/resume/my');
export const getAllResumes = () => api.get('/resume/all');
export const analyzeResume = (id) => api.post(`/resume/analyze/${id}`);
