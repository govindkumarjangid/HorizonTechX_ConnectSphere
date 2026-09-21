import User from '../models/User.model.js';
import { PUBLIC_FIELDS, COUNTER_FIELDS, escapeRegex } from "../constents.js";

const userRepository = {
  create(data) {
    return User.create(data);
  },

  findById(id) {
    return User.findById(id);
  },

  findByIdForAuth(id) {
    return User.findById(id).select('+passwordChangedAt');
  },

  findByIdWithPassword(id) {
    return User.findById(id).select('+password');
  },

  findByIdWithRefreshToken(id) {
    return User.findById(id).select('+refreshToken');
  },

  findByEmailWithPassword(email) {
    return User.findOne({ email }).select('+password');
  },

  findPublicById(id) {
    return User.findOne({ _id: id, isActive: true }).select(PUBLIC_FIELDS).lean();
  },

  findPublicByUsername(username) {
    return User.findOne({ username, isActive: true }).select(PUBLIC_FIELDS).lean();
  },

  existsByEmail(email) {
    return User.exists({ email });
  },

  existsByUsername(username) {
    return User.exists({ username });
  },

  updateProfile(id, changes) {
    return User.findByIdAndUpdate(id, { $set: changes }, { new: true, runValidators: true });
  },


  savePassword(user, newPassword) {
    user.password = newPassword;
    return user.save();
  },

  saveRefreshToken(id, hashedToken) {
    const update = hashedToken
      ? { $set: { refreshToken: hashedToken } }
      : { $unset: { refreshToken: 1 } };

    return User.updateOne({ _id: id }, update);
  },

  markLogin(id) {
    return User.updateOne({ _id: id }, { $set: { lastLoginAt: new Date() } });
  },

  incrementCounter(id, field, amount) {
    if (!COUNTER_FIELDS.includes(field))
      throw new Error(`Unknown counter field: ${field}`);

    const filter = amount < 0 ? { _id: id, [field]: { $gt: 0 } } : { _id: id };

    return User.findOneAndUpdate(
      filter,
      { $inc: { [field]: amount } },
      { new: true, projection: field }
    ).lean();
  },

  search(text, { skip, limit }) {
    const lowerText = escapeRegex(text.toLowerCase());
    const rawText = escapeRegex(text);

    return User.find({
      isActive: true,
      $or: [
        { username: new RegExp(`^${lowerText}`) },
        { fullName: new RegExp(`^${rawText}`, 'i') },
      ],
    })
      .select(PUBLIC_FIELDS)
      .sort({ username: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
  },

  findSuggestions(excludeIds, limit) {
    return User.find({ _id: { $nin: excludeIds }, isActive: true })
      .select(PUBLIC_FIELDS)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  },
};

export default userRepository;