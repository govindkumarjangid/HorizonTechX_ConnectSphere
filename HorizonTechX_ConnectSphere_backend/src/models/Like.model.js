import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      immutable: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: [true, 'Post is required'],
      immutable: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

// Unique compound index on (user, post)
likeSchema.index({ user: 1, post: 1 }, { unique: true });
likeSchema.index({ post: 1 });

const Like = mongoose.model('Like', likeSchema);

export default Like;
