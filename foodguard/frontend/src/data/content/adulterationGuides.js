// src/data/content/adulterationGuides.js

// Images
import milkImage from '../../assets/adulteration/milk.jpg';
import spicesImage from '../../assets/adulteration/spices.jpg';
import oilImage from '../../assets/adulteration/oil.jpg';
import grainsImage from '../../assets/adulteration/grains.jpg';
import honeyImage from '../../assets/adulteration/honey.jpg';
import vegetablesImage from '../../assets/adulteration/vegetables.jpg';

import sugarImage from '../../assets/adulteration/sugar.jpg';
import teaImage from '../../assets/adulteration/tea.avif';
import pulsesImage from '../../assets/adulteration/pulses.jpg';
import gheeImage from '../../assets/adulteration/ghee.jpg';
import paneerImage from '../../assets/adulteration/paneer.jpg';
import sweetsImage from '../../assets/adulteration/sweets.avif';
import jaggeryImage from '../../assets/adulteration/jaggery.avif';
import flourImage from '../../assets/adulteration/flour.jpg';
import meatImage from '../../assets/adulteration/meat.jpg';
import packagedFoodImage from '../../assets/adulteration/packeged-food.avif';
import waterImage from '../../assets/adulteration/water.jpg';
import saltImage from '../../assets/adulteration/salt.avif';
import coconutOilImage from '../../assets/adulteration/coconut-oil.webp';
import dryFruitsImage from '../../assets/adulteration/dry-fruits.avif';
export const adulterationGuides = [

  // =====================================================
  // 1. MILK & DAIRY
  // =====================================================

  {
    slug: 'milk-dairy',
    category: 'Milk & Dairy',
    image: milkImage,

    summary:
      'Milk may be diluted with water or adulterated with starch, detergent, urea, or other substances to imitate quality.',

    commonAdulterants: [
      'Added water (reduces nutrient density)',
      'Starch or flour (used to thicken diluted milk)',
      'Detergent or surfactants (may create artificial foam)',
      'Urea (may be used to imitate protein-related readings)',
      'Synthetic milk ingredients or unauthorized additives',
    ],

    homeScreening: [
      {
        title: 'Water dilution check',
        detail:
          'A lactometer can help estimate milk density. An unusually low reading may indicate dilution, although density alone cannot prove adulteration.',
      },
      {
        title: 'Starch test',
        detail:
          'With appropriate iodine reagent, a blue or blue-black color can indicate starch. Do not consume the tested sample.',
      },
      {
        title: 'Foam observation',
        detail:
          'Shake a small sample with water. Excessive, persistent foam can be a warning sign, but this observation is not a definitive detergent test.',
      },
    ],

    labTesting:
      'Laboratories can measure density, fat, SNF, acidity, protein and other quality parameters, along with specific chemical tests for suspected adulterants.',

    healthImpact:
      'Dilution reduces nutritional value. Some chemical adulterants may cause gastrointestinal irritation or other health effects depending on the substance and exposure.',
  },


  // =====================================================
  // 2. SPICES
  // =====================================================

  {
    slug: 'spices',
    category: 'Spices',
    image: spicesImage,

    summary:
      'Powdered spices can be adulterated with artificial colors, starch, fillers, dust, or other low-cost materials.',

    commonAdulterants: [
      'Unauthorized synthetic colors',
      'Brick powder or mineral fillers',
      'Starch or flour fillers',
      'Sawdust or other plant material',
      'Lead-containing pigments such as lead chromate in illegally colored products',
    ],

    homeScreening: [
      {
        title: 'Water dispersion test',
        detail:
          'Place a small amount of powdered spice in water and observe the sediment. Heavy gritty material may indicate foreign matter, but this test cannot identify a specific adulterant.',
      },
      {
        title: 'Color bleed observation',
        detail:
          'Place a small amount on a wet white surface. Rapid, unusually strong color bleeding can indicate added dye and should be investigated further.',
      },
      {
        title: 'Visual inspection',
        detail:
          'Look for unusual particles, excessive brightness, inconsistent texture, or foreign material.',
      },
    ],

    labTesting:
      'Labs can identify synthetic dyes, heavy metals, starch, ash, foreign matter, pesticide residues, and other contaminants using validated analytical methods.',

    healthImpact:
      'Certain unauthorized dyes and heavy metals can be toxic. Foreign materials may cause digestive irritation or physical injury if present in significant amounts.',
  },


  // =====================================================
  // 3. COOKING OILS
  // =====================================================

  {
    slug: 'cooking-oils',
    category: 'Cooking Oils',
    image: oilImage,

    summary:
      'Edible oils may be adulterated by blending cheaper oils into premium oils or through contamination with non-edible oils.',

    commonAdulterants: [
      'Cheaper edible oil blended into premium-labeled oil',
      'Argemone oil in mustard oil',
      'Mineral oil or other non-edible oils',
      'Unauthorized reused or degraded oil',
    ],

    homeScreening: [
      {
        title: 'Label and batch check',
        detail:
          'Check the ingredient declaration, FSSAI license details, batch number, packaging integrity, and expiry or best-before information.',
      },
      {
        title: 'Appearance check',
        detail:
          'Look for unusual cloudiness, sediment, separation, or unexpected odor. These observations alone cannot confirm adulteration.',
      },
      {
        title: 'Avoid acid tests at home',
        detail:
          'Chemical tests involving concentrated acids should not be performed at home. Use a certified food-testing laboratory for confirmation.',
      },
    ],

    labTesting:
      'Laboratories can analyze fatty-acid profiles and other chemical markers using techniques such as chromatography to identify oil composition and suspected adulteration.',

    healthImpact:
      'Argemone oil contamination has been associated with epidemic dropsy. Poor-quality or degraded oils may also pose health risks depending on the contaminant and exposure.',
  },


  // =====================================================
  // 4. GRAINS
  // =====================================================

  {
    slug: 'grains',
    category: 'Grains',
    image: grainsImage,

    summary:
      'Loose grains can contain stones, dust, husk, foreign seeds, inferior grains, or other unwanted materials.',

    commonAdulterants: [
      'Stones and grit',
      'Dust and excess foreign matter',
      'Inferior grain varieties mixed with premium varieties',
      'Foreign seeds',
      'Metal fragments or filings in rare contamination cases',
    ],

    homeScreening: [
      {
        title: 'Visual sorting test',
        detail:
          'Spread grains on a clean plate and inspect for stones, insects, foreign seeds, husk, discoloration, and unusual grain shapes.',
      },
      {
        title: 'Magnet check',
        detail:
          'A magnet can detect ferrous metal particles if they are present. It cannot detect all types of metal contamination.',
      },
      {
        title: 'Cleaning check',
        detail:
          'Wash or clean a small sample and inspect the removed material for excessive dust, stones, or other foreign matter.',
      },
    ],

    labTesting:
      'Labs can measure moisture, foreign matter, damaged grains, grain quality, pesticide residues, and other parameters according to applicable standards.',

    healthImpact:
      'Stones and hard foreign materials can damage teeth or create choking risks. Contaminated grains may also introduce microbial, chemical, or physical hazards.',
  },


  // =====================================================
  // 5. HONEY
  // =====================================================

  {
    slug: 'honey',
    category: 'Honey',
    image: honeyImage,

    summary:
      'Honey can be adulterated with sugar syrups, water, or other sweetening materials that imitate genuine honey.',

    commonAdulterants: [
      'Sugar syrup',
      'Glucose or fructose syrup',
      'High-fructose or other commercial sweetener syrups',
      'Water dilution',
      'Unauthorized coloring or flavoring materials',
    ],

    homeScreening: [
      {
        title: 'Label check',
        detail:
          'Check the ingredient declaration, manufacturer information, batch details, and packaging. Genuine honey should meet the applicable food standard.',
      },
      {
        title: 'Water observation',
        detail:
          'Mixing behavior in water is sometimes used as a home screening method, but viscosity and temperature affect the result, so it cannot confirm authenticity.',
      },
      {
        title: 'Avoid flame tests',
        detail:
          'Popular internet flame tests are unreliable and can cause burns or fires. They should not be used to judge honey purity.',
      },
    ],

    labTesting:
      'Laboratories may use sugar-profile analysis, stable-isotope methods, NMR and other validated techniques to detect different types of syrup adulteration.',

    healthImpact:
      'Adulterated honey may provide less of the nutritional value expected from genuine honey. Added sugars can also increase total sugar intake.',
  },


  // =====================================================
  // 6. FRUITS & VEGETABLES
  // =====================================================

  {
    slug: 'fruits-vegetables',
    category: 'Fruits & Vegetables',
    image: vegetablesImage,

    summary:
      'Fresh produce may be affected by unauthorized ripening agents, excessive wax, dyes, or pesticide residues.',

    commonAdulterants: [
      'Calcium carbide used illegally for ripening',
      'Unauthorized artificial colors',
      'Excessive or unauthorized surface coatings',
      'Non-permitted dyes',
      'Excess pesticide residues',
    ],

    homeScreening: [
      {
        title: 'Appearance check',
        detail:
          'Be cautious of produce with unusually uniform color, unnatural shine, damaged skin, or suspicious surface deposits.',
      },
      {
        title: 'Surface cleaning',
        detail:
          'Wash fruits and vegetables thoroughly under clean running water before consumption. Washing can reduce some surface contaminants but cannot remove every chemical residue.',
      },
      {
        title: 'Cut-and-inspect',
        detail:
          'Check the inside for abnormal discoloration, unusual texture, or an unpleasant chemical smell.',
      },
    ],

    labTesting:
      'Laboratories can test for pesticide residues, unauthorized dyes, heavy metals, and other chemical contaminants using validated analytical methods.',

    healthImpact:
      'Some unauthorized ripening chemicals and dyes may cause irritation or toxicity. Excess pesticide exposure can also present health risks.',
  },


  // =====================================================
  // 7. SUGAR & SALT
  // =====================================================

  {
    slug: 'sugar-salt',
    category: 'Sugar & Salt',
    image: sugarImage,

    summary:
      'Sugar and salt may be contaminated with chalk, sand, excessive moisture, or other insoluble foreign matter.',

    commonAdulterants: [
      'Chalk or calcium carbonate in some salt products',
      'Sand or dust',
      'Excess insoluble matter',
      'Low-quality fillers',
      'Moisture or caking caused by poor storage',
    ],

    homeScreening: [
      {
        title: 'Water dissolution test',
        detail:
          'Dissolve a small amount in clean water. Genuine soluble material should dissolve appropriately, while insoluble foreign matter may settle at the bottom.',
      },
      {
        title: 'Visual inspection',
        detail:
          'Check for unusual particles, discoloration, excessive dust, or inconsistent crystal size.',
      },
      {
        title: 'Packaging check',
        detail:
          'Prefer sealed, properly labeled products and inspect for damaged packaging or signs of moisture contamination.',
      },
    ],

    labTesting:
      'Labs can determine purity, insoluble matter, moisture, mineral composition, and other quality parameters.',

    healthImpact:
      'Foreign matter may cause digestive irritation. Excessive salt or sugar intake itself can also contribute to diet-related health problems.',
  },


  // =====================================================
  // 8. TEA & COFFEE
  // =====================================================

  {
    slug: 'tea-coffee',
    category: 'Tea & Coffee',
    image: teaImage,

    summary:
      'Tea and coffee powders can be mixed with exhausted leaves, fillers, roasted grains, or artificial colors.',

    commonAdulterants: [
      'Used or exhausted tea leaves',
      'Artificial colors',
      'Foreign plant material',
      'Roasted cereal or chicory in products where it is not declared',
      'Dust and other foreign matter',
    ],

    homeScreening: [
      {
        title: 'Water color observation',
        detail:
          'Place a small amount in cool water and observe whether an intense color appears immediately. Very rapid color release can be a warning sign, but it is not conclusive.',
      },
      {
        title: 'Visual inspection',
        detail:
          'Look for excessive dust, unusually bright leaves, foreign plant material, or inconsistent particle size.',
      },
      {
        title: 'Aroma check',
        detail:
          'Unusual chemical, burnt, or musty odors can indicate poor quality or improper storage.',
      },
    ],

    labTesting:
      'Labs can analyze artificial colors, caffeine and chemical profiles, foreign matter, moisture, and other quality parameters.',

    healthImpact:
      'Unauthorized dyes or contaminated materials may pose health risks. Poor storage can also allow mold or other contamination.',
  },


  // =====================================================
  // 9. PULSES & LEGUMES
  // =====================================================

  {
    slug: 'pulses-legumes',
    category: 'Pulses & Legumes',
    image: pulsesImage,

    summary:
      'Pulses can be mixed with cheaper varieties, foreign seeds, stones, or unauthorized coloring agents.',

    commonAdulterants: [
      'Cheaper or inferior pulse varieties',
      'Foreign seeds',
      'Stones and grit',
      'Artificial colors',
      'Excessive moisture or damaged grains',
    ],

    homeScreening: [
      {
        title: 'Visual sorting',
        detail:
          'Spread the pulses on a clean plate and check for differences in size, shape, color, and foreign seeds.',
      },
      {
        title: 'Water observation',
        detail:
          'Soak a small sample and observe unusual color release or floating foreign material. This is only a preliminary screening method.',
      },
      {
        title: 'Storage inspection',
        detail:
          'Look for insects, webbing, mold, unusual odor, or moisture damage.',
      },
    ],

    labTesting:
      'Labs can check foreign matter, moisture, pesticide residues, coloring agents, contaminants, and variety-specific quality parameters.',

    healthImpact:
      'Foreign materials can cause physical injury, while contaminated or spoiled pulses may cause digestive illness.',
  },


  // =====================================================
  // 10. GHEE & BUTTER
  // =====================================================

  {
    slug: 'ghee-butter',
    category: 'Ghee & Butter',
    image: gheeImage,

    summary:
      'Ghee and butter may be adulterated with cheaper vegetable fats, oils, starches, or other substances.',

    commonAdulterants: [
      'Vegetable oils or fats',
      'Cheaper animal or vegetable fats',
      'Starch or flour fillers',
      'Unauthorized coloring materials',
    ],

    homeScreening: [
      {
        title: 'Texture observation',
        detail:
          'Observe consistency and melting behavior. Unusual separation or texture may indicate a quality issue but cannot identify a specific adulterant.',
      },
      {
        title: 'Label inspection',
        detail:
          'Check ingredients, product category, manufacturer details, batch number, and best-before date.',
      },
      {
        title: 'Avoid chemical tests',
        detail:
          'Do not perform acid-based purity tests at home. Laboratory analysis is safer and more reliable.',
      },
    ],

    labTesting:
      'Labs can examine fatty-acid profiles, sterol composition, moisture, and other parameters to detect added fats and oils.',

    healthImpact:
      'Adulterated products may have a different nutritional profile from the labeled product and can expose consumers to unauthorized substances.',
  },


  // =====================================================
  // 11. PANEER & DAIRY PRODUCTS
  // =====================================================

  {
    slug: 'milk-products',
    category: 'Paneer & Dairy Products',
    image: paneerImage,

    summary:
      'Paneer, khoa, condensed milk, and other dairy products may be diluted or made with unauthorized starches, fats, or non-dairy ingredients.',

    commonAdulterants: [
      'Starch or flour',
      'Non-dairy vegetable fat',
      'Excess water',
      'Synthetic milk ingredients',
      'Unauthorized preservatives or additives',
    ],

    homeScreening: [
      {
        title: 'Texture check',
        detail:
          'Look for unusual rubbery texture, excessive water release, abnormal color, or chemical smell.',
      },
      {
        title: 'Starch screening',
        detail:
          'An iodine-based test can indicate starch in a suitable laboratory or controlled setting. Do not consume the tested sample.',
      },
      {
        title: 'Cold storage check',
        detail:
          "Follow the product's storage instructions and avoid dairy products that show spoilage, swelling, mold, or unusual odor.",
      },
    ],

    labTesting:
      'Labs can analyze fat, protein, moisture, starch, preservatives, microbial quality, and other composition parameters.',

    healthImpact:
      'Spoiled dairy can cause foodborne illness. Unauthorized additives or adulterants can reduce nutritional quality and may create additional health risks.',
  },


  // =====================================================
  // 12. SWEETS
  // =====================================================

  {
    slug: 'sweets',
    category: 'Sweets & Confectionery',
    image: sweetsImage,

    summary:
      'Traditional sweets may contain unauthorized colors, low-quality fats, starch fillers, or contaminated ingredients.',

    commonAdulterants: [
      'Unauthorized synthetic colors',
      'Cheap vegetable fats',
      'Starch or flour fillers',
      'Poor-quality milk solids',
      'Non-permitted preservatives',
    ],

    homeScreening: [
      {
        title: 'Color check',
        detail:
          'Avoid sweets with extremely bright or unnatural colors. Strong color alone cannot prove adulteration.',
      },
      {
        title: 'Freshness check',
        detail:
          'Check smell, texture, mold, excessive moisture, and storage conditions before eating.',
      },
      {
        title: 'Buy from reliable sources',
        detail:
          'Prefer hygienic shops and properly labeled packaged sweets, especially for products containing milk or cream.',
      },
    ],

    labTesting:
      'Labs can test for artificial colors, fat composition, preservatives, microbial contamination, heavy metals, and other contaminants.',

    healthImpact:
      'Unauthorized colors and contaminated ingredients can create health risks. Spoiled milk-based sweets can cause foodborne illness.',
  },


  // =====================================================
  // 13. JAGGERY
  // =====================================================

  {
    slug: 'jaggery',
    category: 'Jaggery',
    image: jaggeryImage,

    summary:
      'Jaggery can contain excess moisture, chalky materials, unauthorized colors, or other impurities.',

    commonAdulterants: [
      'Chalk or mineral materials',
      'Artificial colors',
      'Excess sugar or syrup',
      'Foreign matter',
      'Excess moisture',
    ],

    homeScreening: [
      {
        title: 'Water test',
        detail:
          'Dissolve a small sample in clean water and observe insoluble particles or sediment.',
      },
      {
        title: 'Appearance check',
        detail:
          'Extremely bright or unnaturally uniform coloring can be a warning sign.',
      },
      {
        title: 'Odor check',
        detail:
          'A strong chemical, moldy, or unusual smell may indicate poor quality or contamination.',
      },
    ],

    labTesting:
      'Labs can analyze moisture, ash, insoluble matter, sugars, heavy metals, colors, and other quality parameters.',

    healthImpact:
      'Impurities may cause digestive irritation or other health effects depending on the contaminant.',
  },


  // =====================================================
  // 14. FLOUR & BAKERY PRODUCTS
  // =====================================================

  {
    slug: 'bakery-flour',
    category: 'Flour & Bakery Products',
    image: flourImage,

    summary:
      'Flour and bakery ingredients may be affected by cheaper fillers, unauthorized additives, or contamination during storage.',

    commonAdulterants: [
      'Starch or cheaper flour fillers',
      'Excessive bran or foreign matter',
      'Unauthorized bleaching agents',
      'Mineral contamination',
      'Mold or insect contamination due to poor storage',
    ],

    homeScreening: [
      {
        title: 'Visual inspection',
        detail:
          'Check for unusual particles, insects, webbing, discoloration, or excessive dust.',
      },
      {
        title: 'Water mixing check',
        detail:
          'Mix a small sample with water and observe unusual sediment or foreign particles.',
      },
      {
        title: 'Odor check',
        detail:
          'A musty or rancid smell can indicate poor storage or spoilage.',
      },
    ],

    labTesting:
      'Labs can test moisture, ash, protein, foreign matter, microbial quality, contaminants, and additives.',

    healthImpact:
      'Mold-contaminated or otherwise spoiled flour can cause foodborne illness. Foreign matter may also create physical hazards.',
  },


  // =====================================================
  // 15. FISH & MEAT
  // =====================================================

  {
    slug: 'fish-meat',
    category: 'Fish & Meat',
    image: meatImage,

    summary:
      'Fish and meat can face risks from unauthorized preservatives, dyes, excessive water addition, species substitution, or poor storage.',

    commonAdulterants: [
      'Unauthorized preservatives',
      'Excess water added to increase weight',
      'Unauthorized coloring agents',
      'Species substitution',
      'Spoiled or improperly stored meat',
    ],

    homeScreening: [
      {
        title: 'Freshness check',
        detail:
          'Look for abnormal odor, sliminess, discoloration, damaged packaging, or improper storage temperature.',
      },
      {
        title: 'Packaging check',
        detail:
          'For packaged products, inspect the label, storage instructions, batch information, and expiry or use-by date.',
      },
      {
        title: 'Do not use chemical tests',
        detail:
          'Do not attempt chemical preservative tests at home. Suspected chemical adulteration should be checked by a food laboratory.',
      },
    ],

    labTesting:
      'Labs can test for microbial contamination, chemical residues, preservatives, species identity, heavy metals, and other food-safety parameters.',

    healthImpact:
      'Spoiled or contaminated meat and fish can cause serious foodborne illness. Certain chemical contaminants can create additional health risks.',
  },


  // =====================================================
  // 16. PACKAGED FOODS
  // =====================================================

  {
    slug: 'packaged-foods',
    category: 'Packaged Foods',
    image: packagedFoodImage,

    summary:
      'Packaged foods can be affected by misleading labeling, unauthorized additives, contamination, or products sold after their recommended date.',

    commonAdulterants: [
      'Undeclared or unauthorized ingredients',
      'Misleading substitution of ingredients',
      'Unauthorized colors or preservatives',
      'Foreign matter',
      'Damaged or tampered packaging',
    ],

    homeScreening: [
      {
        title: 'Read the ingredient list',
        detail:
          'Check ingredients, allergens, nutritional information, manufacturer details, batch number, and applicable license information.',
      },
      {
        title: 'Check package condition',
        detail:
          'Avoid swollen, leaking, punctured, badly damaged, or visibly tampered packaging.',
      },
      {
        title: 'Date check',
        detail:
          "Check the applicable expiry, use-by, or best-before information and follow the manufacturer's storage instructions.",
      },
    ],

    labTesting:
      'Laboratories can analyze composition, additives, contaminants, microbial quality, heavy metals, pesticide residues, and label-related parameters.',

    healthImpact:
      'Risks depend on the contaminant or undeclared ingredient. Allergens and microbial contamination can be particularly important food-safety concerns.',
  },


  // =====================================================
  // 17. DRINKING WATER
  // =====================================================

  {
    slug: 'water',
    category: 'Drinking Water',
    image: waterImage,

    summary:
      'Drinking water quality can be affected by microbial contamination, excess minerals, chemicals, or physical impurities.',

    commonAdulterants: [
      'Microbial contamination',
      'Excess dissolved solids',
      'Heavy metals',
      'Chemical contaminants',
      'Sediment and suspended particles',
    ],

    homeScreening: [
      {
        title: 'Visual check',
        detail:
          'Clear water is not necessarily safe, but visible cloudiness, particles, unusual color, or floating material can indicate a problem.',
      },
      {
        title: 'Odor check',
        detail:
          'Unusual chemical, sewage-like, or metallic odors should be investigated.',
      },
      {
        title: 'Use a water test kit',
        detail:
          'Basic kits can screen parameters such as pH, hardness, or certain chemical indicators, but laboratory testing is needed for confirmation.',
      },
    ],

    labTesting:
      'Laboratories can test microbiological quality, pH, total dissolved solids, hardness, heavy metals, nitrate, fluoride, and other chemical parameters.',

    healthImpact:
      'Unsafe water can cause gastrointestinal infections and, depending on contaminants and long-term exposure, other serious health problems.',
  },


  // =====================================================
  // 18. SALT & SEASONINGS
  // =====================================================

  {
    slug: 'salt-spices',
    category: 'Salt & Seasonings',
    image: saltImage,

    summary:
      'Salt and seasoning products may contain excessive insoluble matter, unauthorized colors, or other foreign materials.',

    commonAdulterants: [
      'Sand and grit',
      'Chalky or mineral matter',
      'Excess insoluble material',
      'Unauthorized coloring agents',
      'Foreign matter',
    ],

    homeScreening: [
      {
        title: 'Dissolution test',
        detail:
          'Dissolve a small quantity in clean water and inspect for unusual insoluble sediment.',
      },
      {
        title: 'Visual inspection',
        detail:
          'Look for foreign particles, unusual color, and inconsistent crystal appearance.',
      },
      {
        title: 'Packaging check',
        detail:
          'Prefer sealed products with complete labeling and intact packaging.',
      },
    ],

    labTesting:
      'Labs can measure purity, insoluble matter, moisture, mineral composition, contaminants, and other applicable quality parameters.',

    healthImpact:
      'Foreign matter can cause physical or digestive irritation. Excess sodium intake is also an important dietary health concern.',
  },


  // =====================================================
  // 19. COCONUT OIL
  // =====================================================

  {
    slug: 'coconut-oil',
    category: 'Coconut Oil',
    image: coconutOilImage,

    summary:
      'Coconut oil may be blended with cheaper vegetable oils or other fats while being sold as pure coconut oil.',

    commonAdulterants: [
      'Cheaper vegetable oils',
      'Other edible fats',
      'Mineral oil contamination',
      'Poor-quality or degraded oil',
    ],

    homeScreening: [
      {
        title: 'Label inspection',
        detail:
          'Check ingredients, manufacturer information, batch details, and packaging integrity.',
      },
      {
        title: 'Appearance check',
        detail:
          'Observe unusual odor, color, sediment, or unexpected separation.',
      },
      {
        title: 'Avoid home chemical tests',
        detail:
          'Chemical purity tests should be performed by trained personnel or a food-testing laboratory.',
      },
    ],

    labTesting:
      'Laboratories can determine fatty-acid and sterol profiles and compare the sample against the expected composition of coconut oil.',

    healthImpact:
      'Adulterated oil may have a different nutritional profile and can expose consumers to substances not declared on the label.',
  },


  // =====================================================
  // 20. DRY FRUITS & NUTS
  // =====================================================

  {
    slug: 'dry-fruits',
    category: 'Dry Fruits & Nuts',
    image: dryFruitsImage,

    summary:
      'Dry fruits and nuts may be affected by artificial coloring, excess moisture, foreign matter, or poor storage.',

    commonAdulterants: [
      'Artificial colors',
      'Cheaper nut varieties',
      'Foreign matter',
      'Excess moisture',
      'Poor-quality or rancid material',
    ],

    homeScreening: [
      {
        title: 'Visual check',
        detail:
          'Look for unnatural coloring, excessive shine, mold, insects, or unusual surface deposits.',
      },
      {
        title: 'Smell test',
        detail:
          'A rancid, moldy, or chemical odor is a warning sign of poor quality.',
      },
      {
        title: 'Storage check',
        detail:
          'Store dry fruits in a cool, dry place and discard products showing mold or significant spoilage.',
      },
    ],

    labTesting:
      'Labs can analyze moisture, aflatoxins, pesticide residues, artificial colors, heavy metals, and other contaminants.',

    healthImpact:
      'Mold contamination can produce harmful toxins such as aflatoxins. Rancid products may also have degraded quality.',
  },

];


// Default export
export default adulterationGuides;