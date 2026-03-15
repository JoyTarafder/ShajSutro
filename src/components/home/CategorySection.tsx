import Link from "next/link";
import Image from "next/image";
import { categories } from "@/data/products";

export default function CategorySection() {
  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="section-label">Collections</span>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you&apos;re looking for</p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-charcoal-500 hover:text-charcoal-950 transition-colors duration-300 group"
          >
            View all
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative overflow-hidden rounded-3xl aspect-[3/4] bg-charcoal-100"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-all duration-700 ease-premium group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-semibold text-white tracking-tight">{category.name}</h3>
                <p className="text-sm text-white/60 mt-1 font-light">{category.count} items</p>
                <div className="flex items-center gap-1.5 mt-4 text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-400 ease-premium translate-y-2 group-hover:translate-y-0">
                  Shop now
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <span className="text-xs font-semibold text-white/80">0{index + 1}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
