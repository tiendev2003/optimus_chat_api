const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Chat cá nhân
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // Chat nhóm
  type: {
    type: String,
    enum: ['text', 'image', 'video', 'file', 'audio', 'location', 'emoji'],
    required: true,
  },
  content: { type: String }, // Nội dung tin nhắn
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
  reactions: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      emoji: { type: String },
    },
  ],
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // Tin nhắn được reply
  isPinned: { type: Boolean, default: false }, // Đánh dấu tin nhắn được gim
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
