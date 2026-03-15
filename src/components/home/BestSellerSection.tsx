import Link from "next/link";
import { getBestSellers } from "@/data/products";
import ProductGrid from "@/components/product/ProductGrid";

export default function BestSellerSection() {
  const bestSellers = getBestSellers();

  return (
    <section className="py-28 bg-warm-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-end justify-between mb-14">
          <div>
            <span className="section-label">Most Loved</span>
            <h2 className="section-title">Best Sellers</h2>
            <p className="section-subtitle">Our customers&apos; most-loved pieces</p>
          </div>
          <Link
            href="/shop?badge=Best+Seller"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-charcoal-500 hover:text-charcoal-950 transition-colors duration-300 group"
          >
            See all
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <ProductGrid products={bestSellers} columns={4} />

        <div className="mt-12 text-center sm:hidden">
          <Link href="/shop?badge=Best+Seller" className="btn-secondary">
            See All Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}
