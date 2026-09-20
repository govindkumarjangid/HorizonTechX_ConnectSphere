import mongoose from 'mongoose';

const followSchema = new mongoose.Schema(
  {
    // the user who is following
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Follower is required'],
      immutable: true,
    },
    // the user who is being followed
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

// one follow per pair, also makes "am I following X?" a fast lookup
followSchema.index({ follower: 1, following: 1 }, { unique: true });

// "following" list of a user, newest first
followSchema.index({ follower: 1, createdAt: -1 });

// "followers" list of a user, newest first
followSchema.index({ following: 1, createdAt: -1 });

followSchema.pre('validate', function () {
  if (String(this.follower) === String(this.following)) {
    this.invalidate('following', 'You cannot follow yourself');
  }
});

const Follow = mongoose.model('Follow', followSchema);

export default Follow;