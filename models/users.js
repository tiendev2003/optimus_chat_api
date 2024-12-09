const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Add bcrypt for password hashing

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String }, // URL ảnh đại diện
  status: {
    type: String,
    enum: ['online', 'offline', 'away'],
    default: 'offline',
  },
  lastSeen: { type: Date },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [
    {
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
    },
  ],
  pinnedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // Tin nhắn gim cá nhân
  stories: [
    {
      media: String,
      type: { type: String, enum: ['image', 'video', 'text'], required: true },
      reactions: [
        { user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, reaction: String },
      ],
      mutedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

// Hash password before saving user
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
