import Post from '../models/Post.model.js';
import { AUTHOR_FIELDS } from "../constents.js"

const withAuthor = (query) => query.populate('author', AUTHOR_FIELDS).lean();

const postRepository = {
  create(data) {
    return Post.create(data);
  },

  findById(id) {
    return withAuthor(Post.findById(id));
  },

  exists(id) {
    return Post.exists({ _id: id });
  },

  async findAuthorId(id) {
    const post = await Post.findById(id).select('author').lean();
    return post ? post.author : null;
  },

  updateContent(id, content) {
    return withAuthor(
      Post.findByIdAndUpdate(id, { $set: { content } }, { returnDocument: 'after', runValidators: true })
    );
  },

  deleteById(id) {
    return Post.findByIdAndDelete(id).lean();
  },

  findByAuthorIds(authorIds, { skip, limit }) {
    return withAuthor(
      Post.find({ author: { $in: authorIds } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    );
  },

  addLike(postId, userId) {
    return Post.findOneAndUpdate(
      { _id: postId, likes: { $ne: userId } },
      { $addToSet: { likes: userId }, $inc: { likesCount: 1 } },
      { returnDocument: 'after', projection: 'likesCount' }
    ).lean();
  },

  removeLike(postId, userId) {
    return Post.findOneAndUpdate(
      { _id: postId, likes: userId },
      { $pull: { likes: userId }, $inc: { likesCount: -1 } },
      { returnDocument: 'after', projection: 'likesCount' }
    ).lean();
  },

  incrementCommentsCount(id, amount) {
    const filter = amount < 0 ? { _id: id, commentsCount: { $gt: 0 } } : { _id: id };
    return Post.updateOne(filter, { $inc: { commentsCount: amount } });
  },
};

export default postRepository;