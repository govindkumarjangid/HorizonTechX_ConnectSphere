import mongoose from 'mongoose';

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Follower is required'],
      immutable: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Following user is required'],
      immutable: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

followSchema.index({ follower: 1, following: 1 }, { unique: true });
followSchema.index({ follower: 1, createdAt: -1 });
followSchema.index({ following: 1, createdAt: -1 });

followSchema.pre('validate', function () {
  if (String(this.follower) === String(this.following)) {
    this.invalidate('following', 'You cannot follow yourself');
  }
});

const Follow = mongoose.model('Follow', followSchema);

export default Follow;