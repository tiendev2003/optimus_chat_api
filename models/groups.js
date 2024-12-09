const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    groupImage: { type: String }, // URL ảnh nhóm
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Thành viên nhóm
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Quản trị viên nhóm
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }], // Tin nhắn trong nhóm
    pinnedMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // Tin nhắn được gim trong nhóm
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  module.exports = mongoose.model('Group', groupSchema);
  