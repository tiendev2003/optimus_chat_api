const mongoose = require('mongoose');


const callSchema = new mongoose.Schema({
    caller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Người nhận (nếu là gọi cá nhân)
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },  // Nhóm (nếu là gọi nhóm)
    type: { type: String, enum: ['audio', 'video'], required: true },
    duration: { type: Number }, // Thời lượng cuộc gọi (giây)
    timestamp: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['missed', 'answered', 'rejected'],
      default: 'missed',
    },
  });
  
  module.exports = mongoose.model('Call', callSchema);
  