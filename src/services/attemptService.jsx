import api from './api';

export const startQuiz = (quizId) => {
  return api.post(`/quizzes/${quizId}/start`);
};

export const submitAttempt = (attemptId, answers) => {
  return api.post(`/attempts/${attemptId}/submit`, { answers });
};

export const getResult = (attemptId) => {
  return api.get(`/attempts/${attemptId}/result`);
};