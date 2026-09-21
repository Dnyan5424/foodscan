
import { Link } from 'react-router-dom'
import {
  ScanLine,
  Barcode,
  Camera,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'

export default function GuardScan() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16">

      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-full bg-orange/10 text-orange text-xs font-semibold">
          <Sparkles size={14} />
          GuardScan
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Scan. Check. <span className="text-orange">Stay Safe.</span>
        </h1>

        <p className="text-muted text-sm sm:text-base leading-relaxed">
          Quickly scan your food product to check expiry details, ingredients,
          nutrition information, and safety data.
        </p>
      </div>

      {/* Scan Options */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Label Scan */}
        <Link
          to="/expiry-tracker/scan"
          className="group relative overflow-hidden bg-white rounded-3xl border border-black/5 shadow-soft p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
        >
          {/* Background decoration */}
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-orange/5 transition-transform duration-500 group-hover:scale-150" />

          <div className="relative">

            <div className="flex items-start justify-between mb-7">
              <div className="w-14 h-14 rounded-2xl bg-orange/10 text-orange flex items-center justify-center">
                <ScanLine size={28} strokeWidth={2} />
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange/10 text-orange">
                OCR
              </span>
            </div>

            <h2 className="font-heading font-bold text-2xl mb-2">
              Scan Label
            </h2>

            <p className="text-muted text-sm leading-relaxed mb-6">
              Take or upload a photo of the package label and let OCR extract
              important product information automatically.
            </p>

            <div className="space-y-2 mb-7">
              <Feature text="Expiry date detection" />
              <Feature text="Batch number extraction" />
              <Feature text="Product name recognition" />
            </div>

            <div className="flex items-center gap-2 text-forest font-semibold text-sm">
              Start scanning
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </div>
        </Link>

        {/* Barcode Scan */}
        <Link
          to="/expiry-tracker/scan-barcode"
          className="group relative overflow-hidden bg-white rounded-3xl border border-black/5 shadow-soft p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
        >
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-forest/5 transition-transform duration-500 group-hover:scale-150" />

          <div className="relative">

            <div className="flex items-start justify-between mb-7">
              <div className="w-14 h-14 rounded-2xl bg-forest/10 text-forest flex items-center justify-center">
                <Barcode size={28} strokeWidth={2} />
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-forest/10 text-forest">
                FAST
              </span>
            </div>

            <h2 className="font-heading font-bold text-2xl mb-2">
              Scan Barcode
            </h2>

            <p className="text-muted text-sm leading-relaxed mb-6">
              Scan or enter the barcode number to retrieve structured product
              information from Open Food Facts.
            </p>

            <div className="space-y-2 mb-7">
              <Feature text="Ingredients information" />
              <Feature text="Nutrition facts" />
              <Feature text="Food safety information" />
            </div>

            <div className="flex items-center gap-2 text-forest font-semibold text-sm">
              Scan barcode
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </div>
          </div>
        </Link>
      </div>

      {/* How it works */}
      <div className="mt-14">
        <div className="text-center mb-7">
          <h2 className="font-heading text-xl font-bold mb-2">
            How GuardScan works
          </h2>
          <p className="text-muted text-sm">
            Get useful product information in just a few steps.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">

          <Step
            number="01"
            icon={<Camera size={19} />}
            title="Scan"
            text="Capture the label or barcode."
          />

          <Step
            number="02"
            icon={<ScanLine size={19} />}
            title="Analyze"
            text="GuardScan processes the product data."
          />

          <Step
            number="03"
            icon={<ShieldCheck size={19} />}
            title="Check"
            text="Review expiry and safety information."
          />

        </div>
      </div>

      {/* Privacy / trust */}
      <div className="mt-8 flex items-center justify-center gap-2 text-muted text-xs">
        <ShieldCheck size={15} className="text-forest" />
        Your scan is processed securely
      </div>

    </div>
  )
}


/* Feature Item */
function Feature({ text }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <CheckCircle2
        size={16}
        className="text-forest shrink-0"
      />
      <span className="text-gray-600">{text}</span>
    </div>
  )
}


/* Step */
function Step({ number, icon, title, text }) {
  return (
    <div className="bg-white border border-black/5 rounded-2xl p-5 shadow-soft">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-bold text-orange">
          {number}
        </span>

        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-forest">
          {icon}
        </div>
      </div>

      <h3 className="font-heading font-bold text-sm mb-1">
        {title}
      </h3>

      <p className="text-muted text-xs leading-relaxed">
        {text}
      </p>
    </div>
  )
}

