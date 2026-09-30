import AwarenessTopic from '../models/AwarenessTopic.js'
import Myth from '../models/Myth.js'

export async function listTopics(req, res) {
  res.json(await AwarenessTopic.find())
}

export async function listMyths(req, res) {
  res.json(await Myth.find())
}
