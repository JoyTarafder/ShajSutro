import Link from "next/link";
import Image from "next/image";

const promoItems = [
  {
    title: "Summer Linens",
    subtitle: "Breathable fabrics for warm days",
    href: "/shop?category=men&tag=linen",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80",
    size: "large",
    cta: "Shop Men",
  },
  {
    title: "New Arrivals",
    subtitle: "Fresh styles just landed",
    href: "/shop?badge=New",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
    size: "small",
    cta: "Explore Now",
  },
  {
    title: "Elevated Footwear",
    subtitle: "From casual to dressed up",
    href: "/shop?category=shoes",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
    size: "small",
    cta: "Shop Shoes",
  },
];

export default function PromoGrid() {
  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-14">
          <span className="section-label">Featured</span>
          <h2 className="section-title">Curated for You</h2>
          <p className="section-subtitle">Handpicked collections for every occasion</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
          <Link
            href={promoItems[0].href}
            className="group relative overflow-hidden rounded-3xl aspect-[4/5] md:aspect-auto md:row-span-2 bg-charcoal-100"
          >
            <Image
              src={promoItems[0].image}
              alt={promoItems[0].title}
              fill
              className="object-cover transition-all duration-700 ease-premium group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <p className="text-sm font-light text-white/60 mb-2">{promoItems[0].subtitle}</p>
              <h3 className="text-3xl font-semibold text-white mb-5 tracking-tight">{promoItems[0].title}</h3>
              <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm text-charcoal-900 text-sm font-semibold rounded-full transition-all duration-300 group-hover:bg-white group-hover:shadow-soft-md">
                {promoItems[0].cta}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>

          {promoItems.slice(1).map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative overflow-hidden rounded-3xl aspect-video bg-charcoal-100"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-all duration-700 ease-premium group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="text-xs font-light text-white/60 mb-1.5">{item.subtitle}</p>
                <h3 className="text-xl font-semibold text-white mb-4 tracking-tight">{item.title}</h3>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-white/90 group-hover:gap-3 transition-all duration-300">
                  {item.cta}
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
