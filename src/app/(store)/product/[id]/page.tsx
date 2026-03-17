"use client";

import ProductGrid from "@/components/product/ProductGrid";
import { useCart } from "@/context/CartContext";
import { getApiBase } from "@/lib/apiBase";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: { _id: string; name: string; slug: string } | string;
  images: string[];
  sizes: string[];
  colors: string[];
  badge?: "New" | "Sale" | "Best Seller";
  description: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stock?: number;
  totalOrdered?: number;
  tags?: string[];
}

function mapProduct(p: ApiProduct): Product {
  const catSlug = typeof p.category === "object" ? p.category.slug : p.category;
  return {
    id: p._id,
    name: p.name,
    price: p.price,
    originalPrice: p.originalPrice,
    category: catSlug,
    images: p.images,
    sizes: p.sizes,
    colors: p.colors,
    badge: p.badge,
    description: p.description,
    rating: p.rating,
    reviews: p.reviews,
    inStock: p.inStock,
    stock: p.stock,
    totalOrdered: p.totalOrdered,
    tags: p.tags,
  };
}

const colorToHex: Record<string, string> = {
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
  Champagne: "#F7E7CE",
  "Midnight Blue": "#191970",
  Blush: "#FFB6C1",
  Tan: "#D2B48C",
  Burgundy: "#800020",
  Taupe: "#8B7D7B",
  Ivory: "#FFFFF0",
  "Dusty Rose": "#DCAE96",
  Ecru: "#F2EFE4",
  Sand: "#F4E4C1",
  Sage: "#BCB88A",
  Cream: "#FFFDD0",
  Grey: "#808080",
  "Light Gray": "#D3D3D3",
  Pink: "#F4A0B0",
  Lavender: "#B4A7D6",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // Fetch product
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${getApiBase()}/api/products/${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (!j.success) {
          setNotFound(true);
          return;
        }
        const p = mapProduct(j.data as ApiProduct);
        setProduct(p);
        setSelectedSize(p.sizes[0] ?? "");
        setSelectedColor(p.colors[0] ?? "");
        // Fetch related
        return fetch(
          `${getApiBase()}/api/products?category=${p.category}&limit=4`,
        )
          .then((r) => r.json())
          .then((rj) => {
            if (rj.success) {
              setRelated(
                (rj.data as ApiProduct[])
                  .map(mapProduct)
                  .filter((rp) => rp.id !== p.id)
                  .slice(0, 4),
              );
            }
          });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    setAdding(true);
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => {
      setAdding(false);
      setAdded(false);
    }, 1500);
  };

  const discount = product?.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : null;

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-3xl bg-charcoal-100 animate-pulse" />
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl bg-charcoal-100 animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-5 pt-4">
              <div className="h-8 bg-charcoal-100 rounded animate-pulse w-3/4" />
              <div className="h-5 bg-charcoal-100 rounded animate-pulse w-1/3" />
              <div className="h-10 bg-charcoal-100 rounded animate-pulse w-1/4" />
              <div className="h-32 bg-charcoal-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Not found ──
  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-5">
        <h1 className="text-2xl font-semibold text-charcoal-900">
          Product Not Found
        </h1>
        <p className="text-charcoal-400 text-sm">
          This product may have been removed or does not exist.
        </p>
        <button onClick={() => router.push("/shop")} className="btn-primary">
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-charcoal-100 bg-warm-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <nav className="flex items-center gap-2 text-sm text-charcoal-400">
            <Link
              href="/"
              className="hover:text-charcoal-900 transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              href="/shop"
              className="hover:text-charcoal-900 transition-colors"
            >
              Shop
            </Link>
            <span>/</span>
            <Link
              href={`/shop?category=${product.category}`}
              className="hover:text-charcoal-900 transition-colors capitalize"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-charcoal-700 font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* ── Left: Images ── */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-warm-50 shadow-soft">
              {product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-charcoal-300">
                  <svg
                    className="w-16 h-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                </div>
              )}

              {product.badge && (
                <div className="absolute top-5 left-5">
                  <span
                    className={`px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full ${
                      product.badge === "New"
                        ? "bg-accent-600/90 text-white"
                        : product.badge === "Sale"
                          ? "bg-red-500/90 text-white"
                          : "bg-warm-500/90 text-white"
                    }`}
                  >
                    {product.badge === "Sale" && discount
                      ? `-${discount}%`
                      : product.badge}
                  </span>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === i
                        ? "border-charcoal-900 shadow-soft"
                        : "border-transparent hover:border-charcoal-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col gap-6 pt-2">
            {/* Name + rating */}
            <div>
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-charcoal-400 mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl lg:text-4xl font-semibold text-charcoal-950 tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${star <= Math.round(product.rating) ? "text-warm-500" : "text-charcoal-200"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-charcoal-400">
                  {product.rating.toFixed(1)} ({product.reviews} reviews)
                </span>
                {product.totalOrdered !== undefined &&
                  product.totalOrdered > 0 && (
                    <span className="text-sm text-charcoal-400">
                      ·{" "}
                      {product.totalOrdered >= 1000
                        ? `${(product.totalOrdered / 1000).toFixed(1)}k`
                        : product.totalOrdered}
                      + ordered
                    </span>
                  )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold text-charcoal-950">
                ৳{product.price}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-charcoal-300 line-through">
                    ৳{product.originalPrice}
                  </span>
                  {discount && (
                    <span className="px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 rounded-lg">
                      {discount}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Stock */}
            <div>
              {!product.inStock ? (
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Out of stock
                </span>
              ) : product.stock !== undefined &&
                product.stock <= 3 &&
                product.stock > 0 ? (
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Only {product.stock} left in stock
                </span>
              ) : product.stock !== undefined && product.stock <= 10 ? (
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {product.stock} in stock — order soon
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  In stock
                </span>
              )}
            </div>

            <hr className="border-charcoal-100" />

            {/* Size selector */}
            {product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-charcoal-900">
                    Size
                  </h3>
                  {selectedSize && (
                    <span className="text-sm text-charcoal-500">
                      {selectedSize}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[48px] px-4 py-2.5 text-sm font-medium rounded-xl border-2 transition-all duration-200 ${
                        selectedSize === size
                          ? "bg-charcoal-950 text-white border-charcoal-950"
                          : "border-charcoal-200 text-charcoal-500 hover:border-charcoal-400 hover:text-charcoal-900"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-charcoal-900">
                    Color
                  </h3>
                  {selectedColor && (
                    <span className="text-sm text-charcoal-500">
                      {selectedColor}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`w-9 h-9 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                        selectedColor === color
                          ? "border-charcoal-900 scale-110 shadow-md"
                          : "border-charcoal-200"
                      }`}
                      style={{
                        backgroundColor: colorToHex[color] ?? "#E5E7EB",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || adding}
              className={`w-full py-4 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                !product.inStock
                  ? "bg-charcoal-100 text-charcoal-400 cursor-not-allowed"
                  : added
                    ? "bg-green-600 text-white"
                    : "bg-charcoal-950 text-white hover:bg-charcoal-800 active:scale-[0.98]"
              }`}
            >
              {added ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Added to Cart
                </span>
              ) : !product.inStock ? (
                "Out of Stock"
              ) : (
                "Add to Cart"
              )}
            </button>

            {/* Description */}
            {product.description && (
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-charcoal-900 mb-2">
                  Description
                </h3>
                <p className="text-sm text-charcoal-500 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs font-medium text-charcoal-500 bg-charcoal-50 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-24 pt-12 border-t border-charcoal-100">
            <div className="mb-12">
              <span className="section-label">You May Also Like</span>
              <h2 className="section-title">Related Products</h2>
            </div>
            <ProductGrid products={related} columns={4} />
          </div>
        )}
      </div>
    </div>
  );
}
