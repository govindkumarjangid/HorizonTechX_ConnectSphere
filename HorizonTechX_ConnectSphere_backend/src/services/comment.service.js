import ApiError from '../utils/ApiError.js';
import { buildPage } from '../utils/pagination.js';
import commentRepository from '../repositories/comment.repository.js';
import postRepository from '../repositories/post.repository.js';

const isSameId = (a, b) => String(a) === String(b);

const assertPostExists = async (postId) => {
  if (!(await postRepository.exists(postId))) throw ApiError.notFound('Post not found');
};

const addComment = async (postId, userId, { text }) => {
  await assertPostExists(postId);

  const comment = await commentRepository.create({ post: postId, author: userId, text });
  await postRepository.incrementCommentsCount(postId, 1);

  return comment;
};

const getComments = async (postId, pagination) => {
  await assertPostExists(postId);

  const { skip, limit } = pagination;
  const rows = await commentRepository.findByPost(postId, { skip, limit: limit + 1 });

  return buildPage(rows, pagination);
};

// allowed for the comment writer and for the owner of the post
const deleteComment = async (postId, commentId, userId) => {
  const comment = await commentRepository.findById(commentId);

  // the comment must belong to the post in the URL
  if (!comment || !isSameId(comment.post, postId)) {
    throw ApiError.notFound('Comment not found');
  }

  if (!isSameId(comment.author, userId)) {
    const postAuthorId = await postRepository.findAuthorId(postId);
    if (!isSameId(postAuthorId, userId)) {
      throw ApiError.forbidden('You cannot delete this comment');
    }
  }

  await commentRepository.deleteById(commentId);
  await postRepository.incrementCommentsCount(postId, -1);
};

export default { addComment, getComments, deleteComment };