import mongoose from 'mongoose'

const mythSchema = new mongoose.Schema({
  myth: { type: String, required: true },
  fact: { type: String, required: true },
}, { timestamps: true })

export default mongoose.model('Myth', mythSchema)
