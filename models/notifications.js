const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['friendRequest', 'message', 'call', 'reaction', 'storyReply'],
      required: true,
    },
    content: { type: String }, // Nội dung thông báo
    relatedId: { type: mongoose.Schema.Types.ObjectId }, // ID liên quan (tin nhắn, story, v.v.)
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false },
  });
  
  module.exports = mongoose.model('Notification', notificationSchema);
  