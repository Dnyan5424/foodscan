/**
 * A lightweight, explainable keyword-based classifier that suggests an
 * issue type from a free-text complaint description. This is NOT a trained
 * ML model — it's a transparent bag-of-keywords scorer, chosen deliberately
 * over a black-box model since a CEP demo benefits more from an explainable,
 * dependency-free approach than from a model that needs a labeled dataset.
 *
 * To upgrade later: replace this with a trained text classifier (e.g. a
 * scikit-learn model served from a small Python/FastAPI microservice, or a
 * TensorFlow.js model) once you have real labeled complaint data to train on.
 */

const KEYWORDS = {
  'Food Adulteration': ['adulterat', 'mixed', 'fake', 'diluted', 'contaminat', 'foreign substance', 'artificial color', 'chemical'],
  'Expired Product Sold': ['expired', 'expiry date passed', 'out of date', 'stale', 'past date'],
  'Mislabeling': ['mislabel', 'wrong label', 'incorrect information', 'misleading claim', 'false claim on label'],
  'Unhygienic Premises': ['unhygienic', 'dirty', 'unclean', 'pest', 'insect', 'cockroach', 'rat', 'filthy'],
  'Packaging Issue': ['torn packet', 'damaged packaging', 'leaking', 'broken seal', 'punctured'],
  'False Information': ['false advertising', 'fake claim', 'misleading ad', 'untrue'],
}

export function suggestIssueType(description = '') {
  const text = description.toLowerCase()
  let bestType = 'Other'
  let bestScore = 0

  for (const [type, keywords] of Object.entries(KEYWORDS)) {
    const score = keywords.reduce((acc, kw) => acc + (text.includes(kw) ? 1 : 0), 0)
    if (score > bestScore) {
      bestScore = score
      bestType = type
    }
  }

  return bestScore > 0 ? bestType : 'Other'
}
