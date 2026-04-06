import axios from 'axios';
import type { Question, Answer, AuthResponse } from './types';

const api = axios.create({
  baseURL: 'http://localhost:4000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),

  googleLogin: (idToken: string) =>
    api.post<AuthResponse>('/auth/google', { idToken }),
};

export const questionsApi = {
  create: (data: { title: string; content: string; latitude: number; longitude: number; userId: string }) =>
    api.post<Question>('/questions', data),

  getAll: (params?: { latitude?: number; longitude?: number }) =>
    api.get<Question[]>('/questions', { params }),

  getLiked: (userId: string) =>
    api.get<Question[]>(`/questions/liked/${userId}`),

  toggleLike: (questionId: string, userId: string) =>
    api.post<Question>(`/questions/${questionId}/like`, { userId }),
};

export const answersApi = {
  create: (questionId: string, data: { content: string; userId: string }) =>
    api.post<Answer>('/answers', { ...data, questionId }),

  getByQuestion: (questionId: string) =>
    api.get<Answer[]>(`/answers/question/${questionId}`),
};