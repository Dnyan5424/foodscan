import mongoose from 'mongoose'

const guideSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  summary: { type: String, default: '' },
  commonAdulterants: [{ type: String }],
  homeScreening: [{ title: String, detail: String }],
  labTesting: { type: String, default: '' },
  healthImpact: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('Guide', guideSchema)
