import { answerQuestion } from '../services/assistantService.js'

export async function ask(req, res) {
  try {
    const { question } = req.body
    if (!question) return res.status(400).json({ message: 'A question is required' })
    const result = await answerQuestion(question)
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: 'Assistant failed to respond', error: err.message })
  }
}
