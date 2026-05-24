import api from './api';

export const getQuizzes = (page = 1, limit = 10) => {
  return api.get('/quizzes', { params: { page, limit } });
};

export const getQuizById = (id) => {
  return api.get(`/quizzes/${id}`);
};

export const createQuiz = (data) => {
  return api.post('/quizzes', data);
};

export const updateQuiz = (id, data) => {
  return api.put(`/quizzes/${id}`, data);
};

export const deleteQuiz = (id) => {
  return api.delete(`/quizzes/${id}`);
};