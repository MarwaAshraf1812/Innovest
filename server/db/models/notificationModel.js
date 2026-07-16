const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { type: String, ref: 'User', required: true },
  type: { type: String, required: true },
  data: { type: Object },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);