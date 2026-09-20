import api from './axios';

export const userApi = {
  getUserProfile: (username) => api.get(`/users/${username}`),
  updateProfile: (profileData) => api.patch('/users/profile', profileData),
  getSuggestedUsers: () => api.get('/users/suggested'),
  searchUsers: (query) => api.get('/users/search', { params: { q: query } }),
};

export default userApi;
