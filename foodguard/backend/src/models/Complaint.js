import mongoose from 'mongoose'

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  trackingId: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  category: { type: String, default: '' },
  issueType: {
    type: String,
    enum: ['Food Adulteration', 'Expired Product Sold', 'Mislabeling', 'Unhygienic Premises', 'Packaging Issue', 'False Information', 'Other'],
    required: true,
  },
  suggestedIssueType: { type: String, default: '' }, // filled by the keyword classifier for comparison
  location: { type: String, default: '' },
  incidentDate: { type: Date },
  description: { type: String, default: '' },
  evidenceUrl: { type: String, default: '' },
  status: { type: String, enum: ['submitted', 'review', 'investigation', 'action', 'resolved'], default: 'submitted' },
}, { timestamps: true })

export default mongoose.model('Complaint', complaintSchema)
