// Loads starter content into MongoDB: adulteration guides, myths, awareness
// topics, and quiz questions. Safe to re-run — it clears and re-inserts.
import 'dotenv/config'
import mongoose from 'mongoose'
import Guide from '../src/models/Guide.js'
import AwarenessTopic from '../src/models/AwarenessTopic.js'
import Myth from '../src/models/Myth.js'
import QuizQuestion from '../src/models/QuizQuestion.js'

import { adulterationGuides } from './content/adulterationGuides.js'
import { myths } from './content/myths.js'
import { awarenessTopics } from './content/awarenessTopics.js'
import { quizQuestions } from './content/quizQuestions.js'

async function run() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected — seeding...')

  await Guide.deleteMany({})
  await Guide.insertMany(adulterationGuides)

  await AwarenessTopic.deleteMany({})
  await AwarenessTopic.insertMany(awarenessTopics)

  await Myth.deleteMany({})
  await Myth.insertMany(myths)

  await QuizQuestion.deleteMany({})
  await QuizQuestion.insertMany(quizQuestions)

  console.log('Seed complete:', {
    guides: adulterationGuides.length,
    topics: awarenessTopics.length,
    myths: myths.length,
    quizQuestions: quizQuestions.length,
  })
  await mongoose.disconnect()
}

run().catch((err) => { console.error(err); process.exit(1) })
