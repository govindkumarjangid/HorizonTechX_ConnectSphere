import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
      immutable: true,
    },
    content: {
      type: String,
      required: [true, 'Post content cannot be empty'],
      trim: true,
      maxlength: [2000, 'Post cannot exceed 2000 characters'],
    },
    likesCount: { type: Number, default: 0, min: 0 },
    commentsCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

// Indexes for feed and author posts
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;