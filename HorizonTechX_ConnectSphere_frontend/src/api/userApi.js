import api from './axios';

export const userApi = {
  getUserProfile: (username) => api.get(`/users/${username}`),
  getUserPosts: (username, params) => api.get(`/users/${username}/posts`, { params }),
  updateProfile: (profileData) => api.patch('/users/profile', profileData),
  getSuggestions: () => api.get('/users/suggestions'),
};

export default userApi;
