import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { getPagination } from '../utils/pagination.js';
import commentService from '../services/comment.service.js';

export const addComment = asyncHandler(async (req, res) => {
  const comment = await commentService.addComment(req.params.postId, req.user._id, req.body);

  new ApiResponse(201, 'Comment added', comment).send(res);
});

export const getComments = asyncHandler(async (req, res) => {
  const data = await commentService.getComments(req.params.postId, getPagination(req.query));

  new ApiResponse(200, 'Comments fetched', data).send(res);
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { postId, commentId } = req.params;
  await commentService.deleteComment(postId, commentId, req.user._id);

  new ApiResponse(200, 'Comment deleted').send(res);
});