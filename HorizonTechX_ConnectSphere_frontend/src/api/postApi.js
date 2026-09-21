import api from './axios';

export const postApi = {
  getFeed: (params) => api.get('/posts/feed', { params }),
  createPost: (postData) => api.post('/posts', postData),
  updatePost: (id, postData) => {
    if (postData instanceof FormData) {
      return api.patch(`/posts/${id}`, postData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.patch(`/posts/${id}`, postData);
  },
  deletePost: (id) => api.delete(`/posts/${id}`),
  toggleLike: (id) => api.post(`/posts/${id}/like`),
};

export default postApi;
