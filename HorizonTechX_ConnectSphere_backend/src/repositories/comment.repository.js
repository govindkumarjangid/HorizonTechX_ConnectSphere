import Comment from '../models/Comment.model.js';
import { AUTHOR_FIELDS } from "../constents.js";

const commentRepository = {

  async create(data) {
    const comment = await Comment.create(data);
    return Comment.findById(comment._id).populate('author', AUTHOR_FIELDS).lean();
  },

  findById(id) {
    return Comment.findById(id).lean();
  },

  findByPost(postId, { skip, limit }) {
    return Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', AUTHOR_FIELDS)
      .lean();
  },

  deleteById(id) {
    return Comment.findByIdAndDelete(id).lean();
  },

  deleteByPost(postId) {
    return Comment.deleteMany({ post: postId });
  },
};

export default commentRepository;