const ingredientGuidance = [
  ['sodium nitrite', 'A preservative used in some processed meats; frequent high intake should be limited.', 'Choose less-processed alternatives and follow the package serving guidance.'],
  ['sodium nitrate', 'A preservative used in some cured foods; frequent high intake should be limited.', 'Choose less-processed alternatives and follow the package serving guidance.'],
  ['tartrazine', 'A synthetic yellow food colour that some people may choose to avoid.', 'Check the label for colour additives if you are sensitive to them.'],
  ['sunset yellow', 'A synthetic orange-yellow food colour that some people may choose to avoid.', 'Check the label for colour additives if you are sensitive to them.'],
  ['aspartame', 'An intense sweetener that requires avoidance by people with phenylketonuria.', 'People with phenylketonuria should follow medical dietary advice.'],
  ['monosodium glutamate', 'A flavour enhancer; sensitivity varies between individuals.', 'Use personal tolerance and the full nutrition label as your guide.'],
  ['palm oil', 'A common vegetable oil; its presence alone does not indicate adulteration or unsafe food.', 'Consider the complete nutrition label rather than one ingredient alone.'],
]

export function analyzeIngredientText(ingredientsText) {
  const normalizedText = ingredientsText.toLowerCase()
  const riskyIngredients = ingredientGuidance
    .filter(([name]) => normalizedText.includes(name))
    .map(([name, reason, alternative]) => ({ name, reason, alternative }))

  return {
    summary: riskyIngredients.length
      ? `Found ${riskyIngredients.length} ingredient${riskyIngredients.length === 1 ? '' : 's'} worth checking. This is general label guidance, not a medical diagnosis.`
      : 'No commonly flagged ingredients were found by this basic label check. Review the full nutrition and allergen information for your needs.',
    risky_ingredients: riskyIngredients,
  }
}