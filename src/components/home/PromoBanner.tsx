import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="bg-charcoal-950 py-16 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(90,127,160,0.1),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(184,157,126,0.08),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="text-center sm:text-left">
            <p className="text-[11px] font-semibold text-accent-400 uppercase tracking-[0.2em] mb-3">
              Limited Time Offer
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Up to <span className="text-accent-400">40% off</span>
            </h2>
            <p className="text-charcoal-400 mt-3 text-sm font-light">
              On selected styles. Use code{" "}
              <span className="font-mono font-semibold text-white bg-white/10 px-3 py-1 rounded-lg">
                SPRING25
              </span>{" "}
              at checkout.
            </p>
          </div>

          <Link
            href="/shop?badge=Sale"
            className="inline-flex items-center gap-2.5 px-10 py-4 bg-white text-charcoal-950 font-semibold rounded-full hover:bg-warm-50 transition-all duration-300 hover:scale-[1.03] hover:shadow-soft-lg flex-shrink-0 group"
          >
            Shop the Sale
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[120px] font-black text-white/[0.03] pointer-events-none select-none leading-none hidden lg:block tracking-tighter">
            SALE
          </div>
        </div>
      </div>
    </section>
  );
}
