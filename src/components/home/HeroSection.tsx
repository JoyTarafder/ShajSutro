import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-warm-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(90,127,160,0.04),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(184,157,126,0.06),transparent_60%)]" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-32 lg:py-0 w-full">
        <div className="grid lg:grid-cols-2 gap-20 items-center min-h-screen">
          <div className="order-2 lg:order-1 space-y-10">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/80 backdrop-blur-sm rounded-full border border-charcoal-100 shadow-soft">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-charcoal-500 tracking-[0.15em] uppercase">
                Spring / Summer 2025
              </span>
            </div>

            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-charcoal-950 leading-[0.95] tracking-[-0.03em]">
              Dress with
              <br />
              <span className="relative inline-block mt-1">
                <span className="relative z-10 text-accent-600">intention.</span>
                <span className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-3 sm:h-4 bg-accent-100/60 -z-0 rounded-full" />
              </span>
            </h1>

            <p className="text-lg text-charcoal-400 max-w-lg leading-relaxed font-light">
              Thoughtfully crafted clothing for the modern wardrobe.
              Minimalist designs, premium materials, enduring style.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/shop" className="btn-primary text-base px-10 py-4">
                Shop Now
              </Link>
              <Link href="/about" className="btn-secondary text-base px-10 py-4">
                Our Story
              </Link>
            </div>

            <div className="flex gap-12 pt-8 border-t border-charcoal-100">
              {[
                { value: "500+", label: "Products" },
                { value: "50K+", label: "Customers" },
                { value: "4.9★", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-semibold text-charcoal-950 tracking-tight">{stat.value}</p>
                  <p className="text-sm text-charcoal-400 mt-0.5 font-light">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 grid grid-cols-2 gap-5 h-[520px] lg:h-[680px]">
            <div className="relative rounded-3xl overflow-hidden mt-10 shadow-soft-lg">
              <Image
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80"
                alt="Woman in minimalist outfit"
                fill
                className="object-cover transition-transform duration-700 ease-premium hover:scale-105"
                priority
                sizes="(max-width: 1024px) 40vw, 25vw"
              />
            </div>
            <div className="space-y-5">
              <div className="relative rounded-3xl overflow-hidden h-[46%] shadow-soft-lg">
                <Image
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80"
                  alt="Man in tailored suit"
                  fill
                  className="object-cover transition-transform duration-700 ease-premium hover:scale-105"
                  sizes="(max-width: 1024px) 40vw, 25vw"
                />
              </div>
              <div className="relative rounded-3xl overflow-hidden h-[50%] shadow-soft-lg">
                <Image
                  src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
                  alt="Premium sneakers"
                  fill
                  className="object-cover transition-transform duration-700 ease-premium hover:scale-105"
                  sizes="(max-width: 1024px) 40vw, 25vw"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-charcoal-300">
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-charcoal-300 to-transparent" />
      </div>
    </section>
  );
}
