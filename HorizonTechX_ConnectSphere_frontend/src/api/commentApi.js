import api from './axios';

export const commentApi = {
  getComments: (postId, params) => api.get(`/posts/${postId}/comments`, { params }),
  addComment: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  deleteComment: (postId, commentId) => api.delete(`/posts/${postId}/comments/${commentId}`),
};

export default commentApi;
