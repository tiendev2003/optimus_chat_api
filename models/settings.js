
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notifications: { type: Boolean, default: true }, // Bật/tắt thông báo
    mute: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Danh sách người bị tắt thông báo
    privacy: {
      showLastSeen: { type: Boolean, default: true }, // Hiển thị lần cuối online
      showStatus: { type: Boolean, default: true }, // Hiển thị trạng thái hoạt động
    },
  });
  
  module.exports = mongoose.model('Settings', settingsSchema);
  