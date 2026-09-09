import mongoose from 'mongoose'

const awarenessTopicSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  summary: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('AwarenessTopic', awarenessTopicSchema)
