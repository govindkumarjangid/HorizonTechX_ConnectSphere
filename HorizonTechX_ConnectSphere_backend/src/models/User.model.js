import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from "../constents.js"

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true },
    publicId: { type: String, trim: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [
        /^[a-z0-9_.]+$/,
        'Username can only contain letters, numbers, underscore and dot',
      ],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      // bcrypt ignores everything after 72 bytes
      maxlength: [72, 'Password cannot exceed 72 characters'],
      select: false,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [60, 'Full name cannot exceed 60 characters'],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [160, 'Bio cannot exceed 160 characters'],
      default: '',
    },
    avatar: {
      type: imageSchema,
      default: () => ({}),
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // denormalized counters, updated with $inc in the service layer
    followersCount: { type: Number, default: 0, min: 0 },
    followingCount: { type: Number, default: 0, min: 0 },
    postsCount: { type: Number, default: 0, min: 0 },

    lastLoginAt: { type: Date },
    passwordChangedAt: { type: Date, select: false },

    // SHA-256 hash of the current refresh token, never the raw token
    refreshToken: { type: String, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.passwordChangedAt;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// username and email already get unique indexes from `unique: true`

// user search (search bar)
userSchema.index(
  { username: 'text', fullName: 'text' },
  { weights: { username: 5, fullName: 2 }, name: 'user_search_text' }
);

// suggested users / newest users
userSchema.index({ isActive: 1, createdAt: -1 });

// hash password only when it is new or changed
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);

  if (!this.isNew) {
    // 1s back so a token issued right after the change is still valid
    this.passwordChangedAt = new Date(Date.now() - 1000);
    // password changed, so the old refresh token must stop working
    this.refreshToken = undefined;
  }
});

// needs the document loaded with .select('+password')
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// jwtIssuedAt is the `iat` claim in seconds
userSchema.methods.changedPasswordAfter = function (jwtIssuedAt) {
  if (!this.passwordChangedAt) return false;
  return jwtIssuedAt < Math.floor(this.passwordChangedAt.getTime() / 1000);
};

const User = mongoose.model('User', userSchema);

export default User;