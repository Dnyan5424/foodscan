import mongoose from 'mongoose'

const quizQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
}, { timestamps: true })

export default mongoose.model('QuizQuestion', quizQuestionSchema)
