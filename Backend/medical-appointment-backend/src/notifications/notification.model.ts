import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
  message: { type: String, required: true },
  type: { type: String, required: true },
  recipient: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model('Notification', notificationSchema);