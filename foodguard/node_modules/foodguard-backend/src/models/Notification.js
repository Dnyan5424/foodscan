import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null, index: true },
  type: {
    type: String,
    enum: ['expiry_7', 'expiry_3', 'expiry_1', 'expiry_0'],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false, index: true },
  pushSent: { type: Boolean, default: false },
  scheduledFor: { type: Date, required: true, index: true },
  sentAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true })

notificationSchema.index({ userId: 1, foodId: 1, type: 1 }, { unique: true })

export default mongoose.model('Notification', notificationSchema)
