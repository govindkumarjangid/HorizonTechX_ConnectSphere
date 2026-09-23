import api from './axios';

export const userApi = {
  getUserProfile: (username) => api.get(`/users/${username}`),
  getUserPosts: (username, params) => api.get(`/users/${username}/posts`, { params }),
  updateProfile: async (profileData) => {
    try {
      return await api.put('/users/profile', profileData);
    } catch (err) {
      if (err.response?.status === 405 || !err.response) {
        try {
          return await api.patch('/users/profile', profileData);
        } catch {
          return await api.post('/users/profile', profileData);
        }
      }
      throw err;
    }
  },
  getSuggestions: () => api.get('/users/suggestions'),
};

export default userApi;
