import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
};

export const userAPI = {
  getAll: () => api.get('/users'),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
};

export const studentAPI = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  updatePoints: (id, criteriaId, points) => 
    api.put(`/students/${id}/points`, { criteria_id: criteriaId, points }),
  getCourses: (id) => api.get(`/students/${id}/courses`),
  updateCourseStatus: (id, courseId, status) =>
    api.put(`/students/${id}/courses/${courseId}`, { status }),
};

export const criteriaAPI = {
  getAll: () => api.get('/criteria'),
  create: (criteriaData) => api.post('/criteria', criteriaData),
  update: (id, criteriaData) => api.put(`/criteria/${id}`, criteriaData),
};

export const courseAPI = {
  getAll: () => api.get('/courses'),
  create: (courseData) => api.post('/courses', courseData),
  update: (id, courseData) => api.put(`/courses/${id}`, courseData),
  delete: (id) => api.delete(`/courses/${id}`),
};

export const eventAPI = {
  getAll: () => api.get('/events'),
  create: (eventData) => api.post('/events', eventData),
  update: (id, eventData) => api.put(`/events/${id}`, eventData),
  delete: (id) => api.delete(`/events/${id}`),
};

export default api;