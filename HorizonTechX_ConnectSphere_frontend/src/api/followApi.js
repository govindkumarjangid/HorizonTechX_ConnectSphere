import api from './axios';

export const followApi = {
  followUser: (userId) => api.post(`/follow/${userId}`),
  unfollowUser: (userId) => api.delete(`/follow/${userId}`),
  getFollowers: (userId) => api.get(`/follow/${userId}/followers`),
  getFollowing: (userId) => api.get(`/follow/${userId}/following`),
};

export default followApi;
