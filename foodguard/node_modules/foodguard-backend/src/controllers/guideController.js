import Guide from '../models/Guide.js'

export async function listGuides(req, res) {
  const guides = await Guide.find().sort({ category: 1 })
  res.json(guides)
}

export async function getGuide(req, res) {
  const guide = await Guide.findOne({ slug: req.params.slug })
  if (!guide) return res.status(404).json({ message: 'Guide not found' })
  res.json(guide)
}
