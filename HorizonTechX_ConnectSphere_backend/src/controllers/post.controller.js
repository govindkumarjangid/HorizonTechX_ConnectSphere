import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { getPagination } from '../utils/pagination.js';
import postService from '../services/post.service.js';

export const createPost = asyncHandler(async (req, res) => {
  const post = await postService.createPost(req.user._id, req.body);
  new ApiResponse(201, 'Post created successfully', post).send(res);
});

export const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.postId, req.user._id);
  new ApiResponse(200, 'Post deleted successfully').send(res);
});

export const getFeed = asyncHandler(async (req, res) => {
  const data = await postService.getFeed(req.user._id, getPagination(req.query));
  new ApiResponse(200, 'Feed fetched successfully', data).send(res);
});

export const getUserPosts = asyncHandler(async (req, res) => {
  const data = await postService.getUserPosts(
    req.params.username,
    req.user._id,
    getPagination(req.query)
  );
  new ApiResponse(200, 'Posts fetched successfully', data).send(res);
});

export const toggleLike = asyncHandler(async (req, res) => {
  const result = await postService.toggleLike(req.params.postId, req.user);
  new ApiResponse(200, result.isLiked ? 'Post liked' : 'Post unliked', result).send(res);
});