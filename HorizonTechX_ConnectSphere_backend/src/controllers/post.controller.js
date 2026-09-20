import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { getPagination } from '../utils/pagination.js';
import postService from '../services/post.service.js';

export const createPost = asyncHandler(async (req, res) => {
  const post = await postService.createPost(req.user._id, req.body, req.file);

  new ApiResponse(201, 'Post created', post).send(res);
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await postService.getPost(req.params.postId, req.user._id);

  new ApiResponse(200, 'Post fetched', post).send(res);
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await postService.updatePost(req.params.postId, req.user._id, req.body);

  new ApiResponse(200, 'Post updated', post).send(res);
});

export const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.postId, req.user._id);

  new ApiResponse(200, 'Post deleted').send(res);
});

export const getFeed = asyncHandler(async (req, res) => {
  const data = await postService.getFeed(req.user._id, getPagination(req.query));

  new ApiResponse(200, 'Feed fetched', data).send(res);
});

export const getUserPosts = asyncHandler(async (req, res) => {
  const data = await postService.getUserPosts(
    req.params.username,
    req.user._id,
    getPagination(req.query)
  );

  new ApiResponse(200, 'Posts fetched', data).send(res);
});

export const toggleLike = asyncHandler(async (req, res) => {
  const result = await postService.toggleLike(req.params.postId, req.user._id);

  new ApiResponse(200, result.isLiked ? 'Post liked' : 'Post unliked', result).send(res);
});