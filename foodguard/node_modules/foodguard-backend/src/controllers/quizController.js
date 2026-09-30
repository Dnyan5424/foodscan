import QuizQuestion from '../models/QuizQuestion.js'
import QuizAttempt from '../models/QuizAttempt.js'

export async function listQuestions(req, res) {
  // Never send correctIndex to the client before they answer
  const questions = await QuizQuestion.find().select('-correctIndex')
  res.json(questions)
}

export async function submitAttempt(req, res) {
  const { answers } = req.body // [{ questionId, selectedIndex }]
  const questions = await QuizQuestion.find({ _id: { $in: answers.map((a) => a.questionId) } })

  let score = 0
  const results = answers.map((a) => {
    const q = questions.find((q) => q._id.toString() === a.questionId)
    const correct = q && q.correctIndex === a.selectedIndex
    if (correct) score += 1
    return { questionId: a.questionId, correct, correctIndex: q?.correctIndex }
  })

  await QuizAttempt.create({ user: req.user._id, score, total: answers.length })
  res.json({ score, total: answers.length, results })
}

export async function myAttempts(req, res) {
  const attempts = await QuizAttempt.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(attempts)
}
