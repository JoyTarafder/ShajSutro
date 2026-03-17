import BestSellerSection from "@/components/home/BestSellerSection";
import CategorySection from "@/components/home/CategorySection";
import HeroSection from "@/components/home/HeroSection";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import PromoBanner from "@/components/home/PromoBanner";
import PromoGrid from "@/components/home/PromoGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ShajSutro — Modern Minimalist Clothing",
  description:
    "Thoughtfully crafted clothing for the modern wardrobe. Minimalist designs, premium materials, enduring style.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <NewArrivalsSection />

      <CategorySection />
      <PromoGrid />
      <PromoBanner />
      <BestSellerSection />

      <section className="py-16 border-y border-charcoal-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                ),
                title: "Free Shipping",
                desc: "On orders over ৳1200",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                ),
                title: "Free Returns",
                desc: "30-day hassle-free returns",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                ),
                title: "Secure Payments",
                desc: "SSL encrypted checkout",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                  />
                ),
                title: "Sustainable",
                desc: "Ethically produced clothes",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-warm-50 border border-warm-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-accent-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {item.icon}
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-charcoal-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-charcoal-400 mt-0.5 font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  );
}
