"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart(true);
    addItem(product, product.sizes[0], product.colors[0]);
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-warm-50 aspect-[3/4] shadow-soft transition-shadow duration-500 group-hover:shadow-soft-lg">
          <Image
            src={isHovered && product.images[1] ? product.images[1] : product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 ease-premium group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {product.badge && (
            <div className="absolute top-4 left-4">
              <span
                className={`px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase rounded-full backdrop-blur-sm ${
                  product.badge === "New"
                    ? "bg-accent-600/90 text-white"
                    : product.badge === "Sale"
                    ? "bg-red-500/90 text-white"
                    : "bg-warm-500/90 text-white"
                }`}
              >
                {product.badge === "Sale" && discount ? `-${discount}%` : product.badge}
              </span>
            </div>
          )}

          <div
            className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-400 ease-premium ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className={`w-full py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                isAddingToCart
                  ? "bg-green-600 text-white"
                  : "bg-white/90 backdrop-blur-md text-charcoal-900 hover:bg-charcoal-950 hover:text-white shadow-soft-md"
              }`}
            >
              {isAddingToCart ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </span>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>

          <button
            className={`absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-soft text-charcoal-300 hover:text-red-500 transition-all duration-300 ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>

        <div className="mt-4 space-y-1.5">
          <h3 className="text-sm font-medium text-charcoal-900 leading-snug group-hover:text-charcoal-600 transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(product.rating)
                      ? "text-warm-500"
                      : "text-charcoal-200"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-charcoal-300">({product.reviews})</span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold text-charcoal-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-charcoal-300 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {product.colors.length > 1 && (
            <div className="flex gap-1.5 pt-1">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color}
                  className="w-3.5 h-3.5 rounded-full border border-charcoal-200 shadow-sm transition-transform duration-200 hover:scale-125"
                  style={{ backgroundColor: colorToHex(color) }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-charcoal-300 self-center">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

function colorToHex(colorName: string): string {
  const map: Record<string, string> = {
    White: "#FFFFFF",
    "Off-White": "#F5F5F0",
    Black: "#111111",
    Beige: "#F5F0E8",
    "Light Blue": "#BFD7ED",
    Blue: "#3B82F6",
    Navy: "#1E3A5F",
    Charcoal: "#36454F",
    Camel: "#C19A6B",
    Khaki: "#C3B091",
    Olive: "#708238",
    Stone: "#928E85",
    Oatmeal: "#E8E0D0",
    "Forest Green": "#228B22",
    "Floral Blue": "#7EB2D6",
    "Floral Rose": "#F4A0B0",
    Champagne: "#F7E7CE",
    "Midnight Blue": "#191970",
    Blush: "#FFB6C1",
    Tan: "#D2B48C",
    Burgundy: "#800020",
    Taupe: "#8B7D7B",
    Ivory: "#FFFFF0",
    "Dusty Rose": "#DCAE96",
    "Dusty Pink": "#E8B4B8",
    Ecru: "#F2EFE4",
    Sand: "#F4E4C1",
    Sage: "#BCB88A",
    Cream: "#FFFDD0",
    Grey: "#808080",
    "Light Gray": "#D3D3D3",
    "Light Wash": "#C8D8E8",
    "Dark Wash": "#2C3E6B",
    "Dark Brown": "#5C4033",
    Natural: "#F5F5DC",
    "Silver/White": "#C0C0C0",
    "Gold/Beige": "#D4AF6A",
    "Black/Black": "#111111",
    Pink: "#F4A0B0",
    Lavender: "#B4A7D6",
  };
  return map[colorName] || "#E5E7EB";
}
