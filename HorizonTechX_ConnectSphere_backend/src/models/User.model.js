import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { SALT_ROUNDS } from '../constents.js';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      maxlength: [60, 'Full name cannot exceed 60 characters'],
      default: '',
    },
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
      lowercase: true,
      trim: true,
      default: null,
      sparse: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [160, 'Bio cannot exceed 160 characters'],
      default: '',
    },
    avatar: {
      type: String,
      trim: true,
      default: '',
    },
    followersCount: { type: Number, default: 0, min: 0 },
    followingCount: { type: Number, default: 0, min: 0 },
    postsCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
      },
    },
  }
);

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const User = mongoose.model('User', userSchema);

export default User;