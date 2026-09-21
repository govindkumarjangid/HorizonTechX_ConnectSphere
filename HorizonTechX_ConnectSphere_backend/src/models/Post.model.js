import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true },
    publicId: { type: String, trim: true },
  },
  { _id: false }
);

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
      trim: true,
      maxlength: [2000, 'Post cannot exceed 2000 characters'],
      default: '',
    },
    image: {
      type: imageSchema,
      default: undefined,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likesCount: { type: Number, default: 0, min: 0 },
    commentsCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ content: 'text' }, { name: 'post_search_text' });

postSchema.pre('validate', function () {
  if (!this.content && !this.image?.url)
    this.invalidate('content', 'Post must have text or an image');
});

const Post = mongoose.model('Post', postSchema);

export default Post;