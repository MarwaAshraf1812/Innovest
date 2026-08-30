import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user_id: { type: String, ref: 'User', required: true },
  type: { type: String, required: true },
  data: { type: Object },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;