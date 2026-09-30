import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, default: '' },
  quantity: { type: Number, default: 1 },
  expiryDate: { type: Date, required: true },
  manufactureDate: { type: Date },
  batchNumber: { type: String, default: '' },
  brand: { type: String, default: '' },
  source: { type: String, enum: ['manual', 'scan'], default: 'manual' },
}, { timestamps: true })

export default mongoose.model('Product', productSchema)
