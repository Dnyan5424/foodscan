// Edit this file to add/update adulteration guide content.
// Each entry becomes a card on /adulteration-guide and a page at /adulteration-guide/:slug
export const adulterationGuides = [
  {
    slug: 'milk-dairy',
    category: 'Milk & Dairy',
    image: 'milk',
    summary: 'Water dilution, starch, and detergent are the most common adulterants found in loose milk.',
    commonAdulterants: [
      'Added water (reduces nutrient density)',
      'Starch or flour (added to thicken diluted milk)',
      'Detergent (added to create false foam/lather)',
      'Urea (added to fake protein content)',
    ],
    homeScreening: [
      { title: 'Water test', detail: 'A drop of pure milk leaves a white trail on a slanted surface; watered milk flows down without a trail.' },
      { title: 'Starch test', detail: 'Add a few drops of iodine solution — a blue-black color indicates starch.' },
      { title: 'Detergent test', detail: 'Shake milk vigorously with water — dense, lasting foam suggests detergent.' },
    ],
    labTesting: 'Labs test for lactometer readings (density), fat/SNF content, and specific chemical assays for urea, starch, and detergents.',
    healthImpact: 'Detergent and urea adulteration can cause gastrointestinal issues and long-term organ stress; starch dilution reduces nutritional value.',
  },
  {
    slug: 'spices',
    category: 'Spices',
    image: 'spices',
    summary: 'Powdered spices are among the easiest foods to adulterate with colors, dust, and filler starches.',
    commonAdulterants: [
      'Artificial colors (e.g. in chili or turmeric powder)',
      'Brick powder or sawdust (added to chili powder)',
      'Starch fillers (in turmeric or coriander powder)',
      'Lead chromate (illegal color additive in turmeric)',
    ],
    homeScreening: [
      { title: 'Water float test', detail: 'Sprinkle chili/turmeric powder on water — brick powder or sand sinks quickly and leaves a gritty residue.' },
      { title: 'Color bleed test', detail: 'Rub a pinch on a wet white cloth or filter paper — added synthetic color bleeds unevenly.' },
    ],
    labTesting: 'Labs test for lead content, artificial dye identification, and starch/ash content against permissible limits.',
    healthImpact: 'Lead chromate and other industrial dyes are linked to lead poisoning; brick powder can cause digestive irritation over time.',
  },
  {
    slug: 'cooking-oils',
    category: 'Cooking Oils',
    image: 'oil',
    summary: 'Blending cheaper oils into premium oils, or using argemone-contaminated oil, are the main risks.',
    commonAdulterants: [
      'Cheaper oil blended into premium-labeled oil',
      'Argemone oil in mustard oil',
      'Mineral oil in edible oil',
    ],
    homeScreening: [
      { title: 'Nitric acid layer test', detail: 'For mustard oil: adding nitric acid and shaking — a pink/red layer suggests argemone oil contamination (best left to trained testing, handle acids with care).' },
      { title: 'Cold test', detail: 'Refrigerate a sample — pure ghee/oil solidifies uniformly; blended oils often separate into layers.' },
    ],
    labTesting: 'Labs run gas chromatography to identify oil composition and detect argemone alkaloids.',
    healthImpact: 'Argemone contamination can cause epidemic dropsy; blended oils reduce the intended nutritional benefit of the labeled oil.',
  },
  {
    slug: 'grains',
    category: 'Grains',
    image: 'grains',
    summary: 'Foreign grains, stones, and iron filings are commonly mixed into loose grains sold by weight.',
    commonAdulterants: [
      'Stones or grit (added for weight)',
      'Iron filings (in some rice/wheat blends)',
      'Inferior grain varieties mixed with premium ones',
    ],
    homeScreening: [
      { title: 'Magnet test', detail: 'Run a magnet through a sample — iron filings will stick to it.' },
      { title: 'Visual sort test', detail: 'Spread a small quantity on a plate to check for stones, husk, or uneven grain size.' },
    ],
    labTesting: 'Labs assess moisture content, foreign matter percentage, and grain uniformity against FSSAI standards.',
    healthImpact: 'Physical adulterants like stones pose choking/dental risk; iron filings are a mechanical health hazard if ingested.',
  },
  {
    slug: 'honey',
    category: 'Honey',
    image: 'honey',
    summary: 'Sugar syrup dilution is the most widespread issue with commercially sold honey.',
    commonAdulterants: [
      'Sugar/glucose syrup blended with real honey',
      'Water dilution',
      'Caramel coloring to mimic natural honey color',
    ],
    homeScreening: [
      { title: 'Water test', detail: 'Pure honey settles at the bottom of a glass of water without dissolving quickly; adulterated honey dissolves fast.' },
      { title: 'Thumb test', detail: 'A drop of pure honey stays intact on the thumb; adulterated honey tends to spread and drip.' },
    ],
    labTesting: 'Labs use NMR spectroscopy and sugar-profile analysis (the same methods behind several honey-adulteration controversies in India) to detect syrup adulteration precisely.',
    healthImpact: 'Adulterated honey offers little of the nutritional/antibacterial benefit of real honey and can spike blood sugar unexpectedly for those managing diabetes.',
  },
  {
    slug: 'fruits-vegetables',
    category: 'Fruits & Vegetables',
    image: 'vegetables',
    summary: 'Artificial ripening agents and wax coatings are the main concerns with fresh produce.',
    commonAdulterants: [
      'Calcium carbide (illegal ripening agent for fruits like mangoes, bananas)',
      'Synthetic wax coating on apples/cucumbers for shine',
      'Malachite green (illegal dye on some green vegetables)',
    ],
    homeScreening: [
      { title: 'Uniform color check', detail: 'Carbide-ripened fruit often has unnaturally uniform color with a green tinge near the stem.' },
      { title: 'Wax scratch test', detail: 'Scratch the skin gently — a wax coating leaves a visible waxy residue on your nail.' },
    ],
    labTesting: 'Labs test for carbide residue, dye identification, and pesticide residue levels.',
    healthImpact: 'Calcium carbide residue (often containing arsenic/phosphorus traces) can irritate the mucous membrane and is banned under food safety rules.',
  },
]
