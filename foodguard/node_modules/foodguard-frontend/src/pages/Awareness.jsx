import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { awarenessTopics } from '../data/content';

const tips = [
  'Always check the expiry or best-before date before buying packaged food.',
  'Wash fruits and vegetables thoroughly under clean running water before eating.',
  'Read the ingredient list instead of relying only on the front of the package.',
  'Avoid food products with damaged, swollen, leaking, or tampered packaging.',
  'Keep raw and cooked foods separate to reduce cross-contamination.',
  'Store perishable foods at the recommended temperature.',
  'Unusual colour, smell, or texture can be a warning sign of poor food quality.',
  'Buy food from clean and reliable sources whenever possible.',
];

const topicIcons = {
  'Eat Right': '🥗',
  'Food Hygiene': '🧼',
  Fortification: '💊',
  'Organic Food': '🌱',
  'Smart Consumer': '🛒',
  'Food Labels': '🏷️',
  'Myth vs Fact': '🧠',
  'Food Safety Basics': '🛡️',
  'Prevent Food Adulteration': '🔬',
  'Safe Food Storage': '📦',
  'Clean Kitchen': '🧽',
  'Cross-Contamination': '⚠️',
  'Safe Cooking': '🍳',
  'Refrigerator Safety': '❄️',
  'Expiry & Best Before': '📅',
  'Food Packaging': '📦',
  'Food Allergens': '🥜',
  'Pesticide Awareness': '🌿',
  'Water Safety': '💧',
  'Street Food Safety': '🌮',
  'Food Poisoning': '🤢',
  'Food Safety for Children': '👨‍👩‍👧',
  'Nutrition Basics': '🍎',
  'Sugar Awareness': '🍬',
  'Salt Awareness': '🧂',
  'Healthy Cooking Oils': '🫒',
  'Food Fraud': '🔎',
  'FSSAI Awareness': '🇮🇳',
  'Report a Food Safety Issue': '🚨',
  'Buying Loose Food Safely': '🛍️',
  'Festival Food Safety': '🎉',
  'Monsoon Food Safety': '🌧️',
  'Summer Food Safety': '☀️',
};

const getIcon = (title) => topicIcons[title] || '💡';

const getCategory = (title) => {
  const categories = {
    'Eat Right': 'Nutrition',
    Fortification: 'Nutrition',
    'Nutrition Basics': 'Nutrition',
    'Sugar Awareness': 'Nutrition',
    'Salt Awareness': 'Nutrition',
    'Healthy Cooking Oils': 'Nutrition',

    'Food Hygiene': 'Hygiene',
    'Clean Kitchen': 'Hygiene',
    'Cross-Contamination': 'Hygiene',
    'Safe Cooking': 'Hygiene',

    'Food Labels': 'Shopping',
    'Smart Consumer': 'Shopping',
    'Food Packaging': 'Shopping',
    'Buying Loose Food Safely': 'Shopping',
    'Expiry & Best Before': 'Shopping',

    'Food Safety Basics': 'Safety',
    'Safe Food Storage': 'Safety',
    'Refrigerator Safety': 'Safety',
    'Food Poisoning': 'Safety',
    'Food Safety for Children': 'Safety',
    'Food Allergens': 'Safety',

    'Prevent Food Adulteration': 'Adulteration',
    'Food Fraud': 'Adulteration',
    'Report a Food Safety Issue': 'Adulteration',

    'Organic Food': 'Awareness',
    'Myth vs Fact': 'Awareness',
    'FSSAI Awareness': 'Awareness',
    'Pesticide Awareness': 'Awareness',
    'Water Safety': 'Awareness',

    'Street Food Safety': 'Lifestyle',
    'Festival Food Safety': 'Lifestyle',
    'Monsoon Food Safety': 'Lifestyle',
    'Summer Food Safety': 'Lifestyle',
  };

  return categories[title] || 'General';
};

export default function Awareness() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [tip, setTip] = useState(tips[0]);
  const [learned, setLearned] = useState([]);

  const categories = [
    'All',
    'Nutrition',
    'Hygiene',
    'Shopping',
    'Safety',
    'Adulteration',
    'Awareness',
    'Lifestyle',
  ];

  const filteredTopics = useMemo(() => {
    return awarenessTopics.filter((topic) => {
      const matchesSearch =
        topic.title.toLowerCase().includes(search.toLowerCase()) ||
        topic.summary.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === 'All' ||
        getCategory(topic.title) === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const changeTip = () => {
    let next = tip;

    while (next === tip) {
      next = tips[Math.floor(Math.random() * tips.length)];
    }

    setTip(next);
  };

  const markLearned = (slug) => {
    setLearned((prev) =>
      prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : [...prev, slug]
    );
  };

  const progress =
    awarenessTopics.length === 0
      ? 0
      : Math.round((learned.length / awarenessTopics.length) * 100);

  return (
    <main className="min-h-screen bg-[#faf9f6]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden">

        {/* Background decorations */}

        <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-orange/10 blur-3xl" />

        <div className="absolute top-40 -left-32 h-80 w-80 rounded-full bg-yellow-200/20 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 pt-14 pb-10">

          <div className="grid lg:grid-cols-[1.3fr_.7fr] gap-12 items-center">

            {/* Hero content */}

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/80 backdrop-blur-xl px-4 py-2 shadow-sm mb-6">

                <span className="text-lg">
                  🧠
                </span>

                <span className="text-xs font-bold tracking-wide">
                  FOODGUARD AWARENESS HUB
                </span>

              </div>

              <p className="text-orange font-bold text-sm uppercase tracking-widest mb-3">
                Learn • Check • Protect
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-charcoal">
                Small knowledge.
                <span className="block text-orange">
                  Big impact.
                </span>
              </h1>

              <p className="text-muted max-w-2xl mt-6 text-base md:text-lg leading-relaxed">
                Explore practical food-safety knowledge that helps you
                shop smarter, handle food safely, understand labels,
                and protect yourself from common food risks.
              </p>

              {/* Buttons */}

              <div className="flex flex-wrap gap-3 mt-8">

                <Link
                  to="/awareness/myth-vs-fact"
                  className="rounded-full bg-charcoal text-white px-6 py-3 text-sm font-bold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
                >
                  🧠 Myth vs Fact
                </Link>

                <Link
                  to="/awareness/quiz"
                  className="rounded-full bg-orange text-white px-6 py-3 text-sm font-bold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all"
                >
                  🏆 Test Your Knowledge
                </Link>

              </div>

            </div>


            {/* Hero visual */}

            <div className="hidden lg:flex justify-center">

              <div className="relative w-72 h-72">

                <div className="absolute inset-0 rounded-full border border-orange/20" />

                <div className="absolute inset-7 rounded-full border border-orange/20" />

                <div className="absolute inset-14 rounded-full bg-white/90 backdrop-blur-xl border border-black/5 shadow-2xl flex flex-col items-center justify-center">

                  <div className="text-6xl mb-3">
                    🛡️
                  </div>

                  <p className="font-extrabold text-xl">
                    FoodGuard
                  </p>

                  <p className="text-xs text-muted mt-1">
                    Knowledge protects.
                  </p>

                </div>

                <div className="absolute top-2 right-0 bg-white rounded-2xl shadow-lg px-4 py-3 rotate-3">
                  <span className="text-xl">
                    🔍
                  </span>
                  <p className="text-[10px] font-bold">
                    Check
                  </p>
                </div>

                <div className="absolute bottom-3 left-0 bg-white rounded-2xl shadow-lg px-4 py-3 -rotate-3">
                  <span className="text-xl">
                    🥗
                  </span>
                  <p className="text-[10px] font-bold">
                    Eat Smart
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-6 mb-10">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="rounded-3xl bg-white border border-black/5 shadow-soft p-5">
            <div className="text-2xl mb-2">
              📚
            </div>

            <p className="text-2xl font-extrabold">
              {awarenessTopics.length}
            </p>

            <p className="text-xs text-muted mt-1">
              Awareness topics
            </p>
          </div>


          <div className="rounded-3xl bg-white border border-black/5 shadow-soft p-5">
            <div className="text-2xl mb-2">
              🧠
            </div>

            <p className="text-2xl font-extrabold">
              7
            </p>

            <p className="text-xs text-muted mt-1">
              Learning categories
            </p>
          </div>


          <div className="rounded-3xl bg-white border border-black/5 shadow-soft p-5">
            <div className="text-2xl mb-2">
              🏆
            </div>

            <p className="text-2xl font-extrabold">
              {learned.length}
            </p>

            <p className="text-xs text-muted mt-1">
              Topics explored
            </p>
          </div>


          <div className="rounded-3xl bg-white border border-black/5 shadow-soft p-5">

            <div className="text-2xl mb-2">
              🎯
            </div>

            <p className="text-2xl font-extrabold">
              {progress}%
            </p>

            <p className="text-xs text-muted mt-1">
              Learning progress
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          TIP
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-6 mb-12">

        <div className="relative overflow-hidden rounded-3xl bg-charcoal text-white p-7">

          <div className="absolute -right-20 -top-20 w-60 h-60 bg-orange/20 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div className="flex gap-4">

              <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                💡
              </div>

              <div>

                <p className="text-orange text-xs font-bold uppercase tracking-widest mb-2">
                  Quick Food Safety Tip
                </p>

                <p className="text-sm md:text-base text-white/85 max-w-3xl">
                  {tip}
                </p>

              </div>

            </div>

            <button
              onClick={changeTip}
              className="rounded-full bg-white text-charcoal px-5 py-2.5 text-sm font-bold hover:bg-orange hover:text-white transition-colors"
            >
              Another tip →
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-6 mb-8">

        <div className="flex flex-col md:flex-row gap-4">

          {/* Search */}

          <div className="relative flex-1">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food safety topics..."
              className="w-full bg-white border border-black/5 shadow-sm rounded-2xl pl-12 pr-5 py-4 text-sm outline-none focus:ring-2 focus:ring-orange/30"
            />

          </div>

        </div>


        {/* Categories */}

        <div className="flex gap-2 overflow-x-auto pb-2 mt-4">

          {categories.map((category) => (

            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-all ${
                activeCategory === category
                  ? 'bg-orange text-white shadow-md'
                  : 'bg-white text-charcoal border border-black/5 hover:border-orange/30'
              }`}
            >
              {category}
            </button>

          ))}

        </div>

      </section>


      {/* =====================================================
          TOPIC SECTION
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-6 pb-20">

        <div className="flex items-end justify-between mb-6">

          <div>

            <p className="text-orange text-xs font-bold uppercase tracking-widest mb-2">
              Explore Topics
            </p>

            <h2 className="text-2xl md:text-3xl font-extrabold">
              Learn something useful today.
            </h2>

          </div>

          <p className="hidden md:block text-xs text-muted">
            {filteredTopics.length} topics
          </p>

        </div>


        {filteredTopics.length === 0 ? (

          <div className="bg-white rounded-3xl border border-black/5 p-12 text-center">

            <div className="text-5xl mb-4">
              🔎
            </div>

            <h3 className="font-extrabold text-lg">
              No topics found
            </h3>

            <p className="text-sm text-muted mt-2">
              Try another search or category.
            </p>

          </div>

        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {filteredTopics.map((topic, index) => {

              const isSelected = selectedTopic === topic.slug;
              const isLearned = learned.includes(topic.slug);

              return (

                <article
                  key={topic.slug}
                  className={`group relative overflow-hidden rounded-3xl bg-white border shadow-soft transition-all duration-300 ${
                    isSelected
                      ? 'border-orange/40 shadow-xl'
                      : 'border-black/5 hover:-translate-y-1 hover:shadow-xl'
                  }`}
                >

                  {/* Top gradient area */}

                  <div className="relative h-24 bg-gradient-to-br from-orange/10 via-orange/5 to-transparent">

                    <div className="absolute top-4 left-5 text-4xl group-hover:scale-110 transition-transform">
                      {getIcon(topic.title)}
                    </div>

                    <span className="absolute top-4 right-4 text-[10px] font-bold text-black/30">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                  </div>


                  <div className="p-6">

                    {/* Category */}

                    <div className="mb-3">

                      <span className="inline-flex rounded-full bg-orange/10 text-orange px-2.5 py-1 text-[10px] font-bold">
                        {getCategory(topic.title)}
                      </span>

                    </div>


                    {/* Title */}

                    <h3 className="font-extrabold text-base leading-snug group-hover:text-orange transition-colors">
                      {topic.title}
                    </h3>


                    {/* Summary */}

                    <p className="text-sm text-muted leading-relaxed mt-2">
                      {topic.summary}
                    </p>


                    {/* Expanded section */}

                    {isSelected && (

                      <div className="mt-5 pt-5 border-t border-black/5">

                        <p className="text-xs font-bold text-charcoal mb-2">
                          Why it matters
                        </p>

                        <p className="text-xs text-muted leading-relaxed">
                          Understanding this topic can help you make more
                          informed food choices and recognize potential
                          food-safety risks in everyday situations.
                        </p>

                      </div>

                    )}


                    {/* Actions */}

                    <div className="flex items-center justify-between gap-2 mt-5">

                      <button
                        onClick={() =>
                          setSelectedTopic(
                            isSelected ? null : topic.slug
                          )
                        }
                        className="text-xs font-bold text-orange hover:underline"
                      >
                        {isSelected ? 'Show less ↑' : 'Learn more →'}
                      </button>


                      <button
                        onClick={() => markLearned(topic.slug)}
                        className={`text-xs font-bold rounded-full px-3 py-1.5 transition-colors ${
                          isLearned
                            ? 'bg-green-100 text-green-700'
                            : 'bg-black/5 text-charcoal hover:bg-orange/10 hover:text-orange'
                        }`}
                      >
                        {isLearned ? '✓ Learned' : 'Mark learned'}
                      </button>

                    </div>

                  </div>

                </article>

              );

            })}

          </div>

        )}

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="max-w-6xl mx-auto px-6 pb-20">

        <div className="relative overflow-hidden rounded-3xl bg-orange p-8 md:p-12">

          <div className="absolute -right-24 -bottom-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8">

            <div className="max-w-2xl">

              <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">
                Keep learning
              </p>

              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Think you know food safety?
              </h2>

              <p className="text-white/80 text-sm mt-3 leading-relaxed">
                Challenge yourself with FoodGuard's quiz or separate facts
                from myths that you may have heard about food.
              </p>

            </div>


            <div className="flex flex-wrap gap-3">

              <Link
                to="/awareness/myth-vs-fact"
                className="rounded-full bg-charcoal text-white px-6 py-3 text-sm font-bold hover:scale-105 transition-transform"
              >
                Myth vs Fact
              </Link>

              <Link
                to="/awareness/quiz"
                className="rounded-full bg-white text-charcoal px-6 py-3 text-sm font-bold hover:scale-105 transition-transform"
              >
                Start Quiz →
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}