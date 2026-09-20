import api from './axios';

export const postApi = {
  getPosts: (params) => api.get('/posts', { params }),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (postData) => api.post('/posts', postData),
  deletePost: (id) => api.delete(`/posts/${id}`),
  toggleLike: (id) => api.post(`/posts/${id}/like`),
};

export default postApi;
