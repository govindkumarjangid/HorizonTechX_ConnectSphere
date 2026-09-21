import api from './axios';

export const followApi = {
  followUser: (userId) => api.post(`/follow/${userId}`),
  unfollowUser: (userId) => api.delete(`/follow/${userId}`),
  getFollowers: (username, params) => api.get(`/follow/${username}/followers`, { params }),
  getFollowing: (username, params) => api.get(`/follow/${username}/following`, { params }),
};

export default followApi;
