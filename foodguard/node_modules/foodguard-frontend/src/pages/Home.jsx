import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard'
import Button from '../components/Button'
import heroImage from '../assets/hero.jpg'
import scanLabelImage from '../assets/scan-label.jpg'
import checkIngredientsImage from '../assets/check-ingredients.jpg'
import staySafeImage from '../assets/stay-safe.jpg'
import ctaBackgroundImage from '../assets/cta-background.jpg'

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
              src={heroImage}
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
            {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-10 max-w-lg text-3xl font-extrabold">
          Scan, check, and stay safe — in three steps.
        </h2>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-card border border-black/5 bg-white p-6 shadow-soft">
            <div className="mb-4 h-40 overflow-hidden rounded-xl bg-sage">
              <img src={scanLabelImage} alt="Scanning a food label" className="h-full w-full object-cover" />
            </div>
            <p className="mb-1 text-xs font-semibold text-orange">STEP 1</p>
            <h3 className="mb-2 font-heading text-lg font-bold">Scan</h3>
            <p className="text-sm text-muted">Scan a barcode or take a photo of the label with GuardScan.</p>
          </div>

          <div className="rounded-card border border-black/5 bg-white p-6 shadow-soft">
            <div className="mb-4 h-40 overflow-hidden rounded-xl bg-sage">
              <img src={checkIngredientsImage} alt="Checking ingredients" className="h-full w-full object-cover" />
            </div>
            <p className="mb-1 text-xs font-semibold text-orange">STEP 2</p>
            <h3 className="mb-2 font-heading text-lg font-bold">Check</h3>
            <p className="text-sm text-muted">See ingredients, nutrition, expiry, and any local safety reports.</p>
          </div>

          <div className="rounded-card border border-black/5 bg-white p-6 shadow-soft">
            <div className="mb-4 h-40 overflow-hidden rounded-xl bg-sage">
              <img src={staySafeImage} alt="Family eating safely" className="h-full w-full object-cover" />
            </div>
            <p className="mb-1 text-xs font-semibold text-orange">STEP 3</p>
            <h3 className="mb-2 font-heading text-lg font-bold">Stay safe</h3>
            <p className="text-sm text-muted">Track expiry, avoid adulterated products, and report issues if you find them.</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          EXPLORE MORE — links to pages not covered above
      ====================================================== */}

      <section className="bg-sage/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-10 max-w-lg text-3xl font-extrabold">
            Explore more of FoodGuard.
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/guardscan" className="group rounded-card border border-black/5 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <h3 className="mb-1 font-heading text-base font-bold">GuardScan</h3>
              <p className="mb-3 text-xs text-muted">Scan a label or barcode.</p>
              <span className="text-xs font-semibold text-forest group-hover:underline">Open →</span>
            </Link>

            <Link to="/assistant" className="group rounded-card border border-black/5 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <h3 className="mb-1 font-heading text-base font-bold">AI Assistant</h3>
              <p className="mb-3 text-xs text-muted">Ask about labels and safety.</p>
              <span className="text-xs font-semibold text-forest group-hover:underline">Open →</span>
            </Link>

            <Link to="/community" className="group rounded-card border border-black/5 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <h3 className="mb-1 font-heading text-base font-bold">Community Insights</h3>
              <p className="mb-3 text-xs text-muted">See reported issues near you.</p>
              <span className="text-xs font-semibold text-forest group-hover:underline">Open →</span>
            </Link>

            <Link to="/resources" className="group rounded-card border border-black/5 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <h3 className="mb-1 font-heading text-base font-bold">Government Resources</h3>
              <p className="mb-3 text-xs text-muted">Official food safety links.</p>
              <span className="text-xs font-semibold text-forest group-hover:underline">Open →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA BANNER
      ====================================================== */}

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="relative overflow-hidden rounded-card bg-forest px-8 py-14 text-center shadow-lift sm:px-16">
          <img
            src={ctaBackgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative">
            <h2 className="mb-4 text-3xl font-extrabold text-white">Ready to check your next purchase?</h2>
            <p className="mb-8 text-sm text-white/80">Scan a product before you buy it — it only takes a few seconds.</p>
            <Link to="/guardscan">
              <Button variant="secondary" className="!border-white !text-white hover:!bg-white hover:!text-forest">
                Open GuardScan
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}