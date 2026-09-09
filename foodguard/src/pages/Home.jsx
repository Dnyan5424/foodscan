import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import Button from '../components/Button'

const OVERVIEW_CARDS = [
  {
    title: 'Expiry Tracker',
    desc: 'Never miss an expiry date.',
    to: '/expiry-tracker',
  },
  {
    title: 'Adulteration Guide',
    desc: 'Learn what may be hiding in everyday foods.',
    to: '/adulteration-guide',
  },
  {
    title: 'Complaint Register',
    desc: 'Document and report unsafe food.',
    to: '/complaints',
  },
  {
    title: 'Awareness Hub',
    desc: 'Build smarter food-safety habits.',
    to: '/awareness',
  },
]

export default function Home() {
  return (
    <div>
      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-20 pt-10 md:grid-cols-2">

        {/* HERO CONTENT */}

        <div>
          <p className="mb-4 text-sm font-semibold tracking-wide text-orange">
            Smart food safety platform
          </p>

          <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl">
            Know your food.
            <br />
            Protect your health.
          </h1>

          <p className="mb-8 max-w-md text-base leading-relaxed text-muted">
            Track food expiry, understand adulteration, report unsafe food,
            and build better food-safety awareness — all in one place.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link to="/adulteration-guide">
              <Button variant="primary">
                Explore food safety
              </Button>
            </Link>

            <Link to="/complaints">
              <Button variant="secondary">
                Report unsafe food
              </Button>
            </Link>
          </div>
        </div>

        {/* =================================================
            HERO IMAGE
        ================================================== */}

        <div className="relative">

          <div className="relative h-80 overflow-hidden rounded-card bg-forest shadow-lift md:h-[400px]">

            <img
              src="/src/assets/hero.jpg"
              alt="Fresh and healthy food"
              className="h-full w-full object-cover"
            />

            {/* IMAGE OVERLAY */}

            <div className="absolute inset-0 bg-gradient-to-t from-forest/45 via-transparent to-transparent" />

          </div>

          {/* =================================================
              EXPIRY ALERT
          ================================================== */}

          <div className="absolute -bottom-6 -left-4 rounded-2xl bg-white px-5 py-3 shadow-lift sm:-left-6">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange/10 text-sm">
                ⏱
              </div>

              <div>
                <p className="text-xs text-muted">
                  Expiry Alert
                </p>

                <p className="text-sm font-semibold">
                  Milk expires in 2 days
                </p>
              </div>

            </div>

          </div>

          {/* =================================================
              FOOD SAFETY SCORE
          ================================================== */}

          <div className="absolute -right-2 -top-6 rounded-2xl bg-white px-5 py-3 shadow-lift sm:-right-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage text-sm">
                ✓
              </div>

              <div>
                <p className="text-xs text-muted">
                  Food Safety
                </p>

                <p className="text-sm font-semibold text-forest">
                  98% Safe
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}

      <section className="bg-sage/50 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 md:grid-cols-4">

          <StatCard
            value={10000}
            suffix="+"
            label="Foods tracked"
          />

          <StatCard
            value={2500}
            suffix="+"
            label="Reports registered"
          />

          <StatCard
            value={500}
            suffix="+"
            label="Safety guides"
          />

          <StatCard
            value={25000}
            suffix="+"
            label="Quiz attempts"
          />

        </div>
      </section>

      {/* =====================================================
          OVERVIEW CARDS
      ====================================================== */}

      <section className="mx-auto max-w-6xl px-6 py-20">

        <h2 className="mb-10 max-w-lg text-3xl font-extrabold">
          One platform. A safer food journey.
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">

          {OVERVIEW_CARDS.map((card) => (

            <Link
              key={card.to}
              to={card.to}
              className="
                group
                rounded-card
                border
                border-black/5
                bg-white
                p-8
                shadow-soft
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-lift
              "
            >

              <div className="mb-5 flex items-center justify-between">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage text-forest">
                  ✦
                </div>

                <span className="text-lg text-muted transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>

              </div>

              <h3 className="mb-2 font-heading text-xl font-bold">
                {card.title}
              </h3>

              <p className="mb-4 text-sm text-muted">
                {card.desc}
              </p>

              <span className="text-sm font-semibold text-forest group-hover:underline">
                Open →
              </span>

            </Link>

          ))}

        </div>

      </section>
    </div>
  )
}