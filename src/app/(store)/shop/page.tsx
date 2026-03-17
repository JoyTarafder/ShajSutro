"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import { Product, SortOption } from "@/types";
import ProductCard from "@/components/product/ProductCard";

const CATEGORIES = ["men", "women", "shoes", "accessories"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rated" },
  { value: "popular", label: "Most Popular" },
];

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-charcoal-200 border-t-charcoal-900 rounded-full animate-spin" /></div>}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? "";
  const initialBadge = searchParams.get("badge") ?? "";

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setSelectedCategories(initialCategory ? [initialCategory] : []);
    setSelectedSizes([]);
    setPriceRange([0, 500]);
    setSortBy("newest");
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    let filtered: Product[] = [...products];

    if (initialBadge) {
      filtered = filtered.filter((p) => p.badge === initialBadge);
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s))
      );
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }

    return filtered;
  }, [selectedCategories, selectedSizes, priceRange, sortBy, initialBadge]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setPriceRange([0, 500]);
    setSortBy("newest");
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedSizes.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 500;

  const FiltersPanel = () => (
    <div className="space-y-9">
      <div>
        <h3 className="text-[13px] font-semibold text-charcoal-900 mb-4 tracking-wide">Category</h3>
        <div className="space-y-2.5">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  selectedCategories.includes(cat)
                    ? "bg-charcoal-950 border-charcoal-950"
                    : "border-charcoal-300 group-hover:border-charcoal-400"
                }`}
                onClick={() => toggleCategory(cat)}
              >
                {selectedCategories.includes(cat) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span
                onClick={() => toggleCategory(cat)}
                className="text-sm text-charcoal-500 capitalize group-hover:text-charcoal-900 transition-colors duration-200 font-light"
              >
                {cat}
              </span>
              <span className="ml-auto text-xs text-charcoal-300">
                {products.filter((p) => p.category === cat).length}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-semibold text-charcoal-900 mb-4 tracking-wide">
          Price Range
          <span className="ml-2 text-xs font-normal text-charcoal-400">
            ৳{priceRange[0]} – ৳{priceRange[1]}
          </span>
        </h3>
        <input
          type="range"
          min={0}
          max={500}
          step={10}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-charcoal-900 h-1.5 rounded-full"
        />
        <div className="flex justify-between text-xs text-charcoal-300 mt-1.5 font-light">
          <span>৳0</span>
          <span>৳500</span>
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-semibold text-charcoal-900 mb-4 tracking-wide">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                selectedSizes.includes(size)
                  ? "bg-charcoal-950 text-white border-charcoal-950"
                  : "border-charcoal-200 text-charcoal-500 hover:border-charcoal-400 hover:text-charcoal-900"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full text-sm text-charcoal-500 hover:text-charcoal-900 font-medium py-2.5 border border-charcoal-200 rounded-xl hover:bg-charcoal-50 transition-all duration-300"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-warm-50 border-b border-charcoal-100 py-14">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <h1 className="text-4xl font-semibold text-charcoal-950 tracking-tight">
            {initialBadge ? initialBadge : initialCategory ? initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1) : "All Products"}
          </h1>
          <p className="text-charcoal-400 mt-2 text-sm font-light">{filteredProducts.length} products</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="flex gap-12">
          <aside className="hidden lg:block w-60 flex-shrink-0">
            <div className="sticky top-28">
              <FiltersPanel />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-10">
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="flex lg:hidden items-center gap-2 text-sm font-medium text-charcoal-600 border border-charcoal-200 px-5 py-2.5 rounded-full hover:bg-charcoal-50 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                Filters
                {hasActiveFilters && (
                  <span className="w-4 h-4 rounded-full bg-charcoal-950 text-white text-[10px] flex items-center justify-center">
                    !
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3 ml-auto">
                <label className="text-sm text-charcoal-400 hidden sm:block font-light">Sort:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="text-sm border border-charcoal-200 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-400/40 bg-white text-charcoal-600"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-charcoal-950 text-white text-xs font-medium rounded-full transition-all duration-200 hover:bg-charcoal-800"
                  >
                    <span className="capitalize">{cat}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
                {selectedSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-charcoal-950 text-white text-xs font-medium rounded-full transition-all duration-200 hover:bg-charcoal-800"
                  >
                    {size}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-28 text-center">
                <div className="w-16 h-16 rounded-full bg-charcoal-50 flex items-center justify-center mb-5">
                  <svg className="w-7 h-7 text-charcoal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-charcoal-900">No products found</h3>
                <p className="text-charcoal-400 mt-1.5 text-sm font-light">Try adjusting your filters.</p>
                <button onClick={clearFilters} className="btn-primary mt-7 text-sm">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-10 sm:gap-x-7">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-charcoal-950/20 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white flex flex-col shadow-soft-xl">
            <div className="flex items-center justify-between px-7 py-6 border-b border-charcoal-100">
              <h2 className="text-base font-semibold text-charcoal-950">Filters</h2>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 text-charcoal-400 hover:text-charcoal-900 rounded-full transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 py-7">
              <FiltersPanel />
            </div>
            <div className="px-7 py-5 border-t border-charcoal-100">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="btn-primary w-full"
              >
                View {filteredProducts.length} Products
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
