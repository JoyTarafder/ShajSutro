"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getApiBase } from "@/lib/apiBase";

interface ApiProduct {
  _id: string;
  name: string;
  description: string;
  images: string[];
}

interface PromoItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  cta: string;
}

function toPromoItem(product: ApiProduct): PromoItem {
  return {
    id: product._id,
    title: product.name,
    subtitle: product.description,
    href: `/product/${product._id}`,
    image: product.images[0] ?? "",
    cta: "Explore Now",
  };
}

function trimText(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trim()}...`;
}

export default function PromoGrid() {
  const [items, setItems] = useState<PromoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${getApiBase()}/api/products?isFeatured=true&limit=3`)
      .then((res) => res.json())
      .then((json) => {
        if (!json.success) return;
        const mapped = (json.data as ApiProduct[])
          .filter((p) => p.images?.length)
          .slice(0, 3)
          .map(toPromoItem);
        setItems(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && items.length === 0) return null;

  const mainItem = items[0];
  const sideItems = items.slice(1);

  return (
    <section className="py-28">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-14">
          <span className="section-label">Featured</span>
          <h2 className="section-title">Curated for You</h2>
          <p className="section-subtitle">Handpicked collections for every occasion</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
            <div className="rounded-3xl bg-charcoal-100 aspect-[4/5] md:aspect-auto md:row-span-2 animate-pulse" />
            <div className="rounded-3xl bg-charcoal-100 aspect-video animate-pulse" />
            <div className="rounded-3xl bg-charcoal-100 aspect-video animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7">
            {mainItem && (
              <Link
                href={mainItem.href}
                className="group relative overflow-hidden rounded-3xl aspect-[4/5] md:aspect-auto md:row-span-2 bg-charcoal-100"
              >
                <Image
                  src={mainItem.image}
                  alt={mainItem.title}
                  fill
                  className="object-cover transition-all duration-700 ease-premium group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-10">
                  <p className="text-sm font-light text-white/60 mb-2">{trimText(mainItem.subtitle, 80)}</p>
                  <h3 className="text-3xl font-semibold text-white mb-5 tracking-tight">{mainItem.title}</h3>
                  <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm text-charcoal-900 text-sm font-semibold rounded-full transition-all duration-300 group-hover:bg-white group-hover:shadow-soft-md">
                    {mainItem.cta}
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            )}

            {sideItems.map((item) => (
              <Link
                key={item.id}
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
                  <p className="text-xs font-light text-white/60 mb-1.5">{trimText(item.subtitle, 58)}</p>
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
        )}
      </div>
    </section>
  );
}
