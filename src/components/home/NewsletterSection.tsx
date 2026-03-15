"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="py-28 bg-charcoal-950 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(90,127,160,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(184,157,126,0.06),transparent_60%)]" />

      <div className="relative max-w-2xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/10 mb-8">
          <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>

        <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-5 tracking-tight">
          Stay in the loop
        </h2>
        <p className="text-charcoal-400 mb-10 text-base leading-relaxed font-light max-w-md mx-auto">
          Subscribe to our newsletter for early access to new arrivals, exclusive offers, and style inspiration.
        </p>

        {status === "success" ? (
          <div className="flex items-center justify-center gap-3 bg-white/[0.06] border border-white/10 rounded-2xl px-7 py-5">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-white font-medium">You&apos;re subscribed! Welcome to the club.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-4 bg-white/[0.06] border border-white/10 rounded-full text-white placeholder-charcoal-500 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/40 focus:border-accent-500/40 transition-all duration-300"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-4 bg-white text-charcoal-950 text-sm font-semibold rounded-full hover:bg-warm-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-soft-lg disabled:opacity-70 flex-shrink-0"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        <p className="mt-5 text-xs text-charcoal-600">
          By subscribing, you agree to our{" "}
          <a href="#" className="text-charcoal-400 hover:text-white transition-colors duration-300">
            Privacy Policy
          </a>
          . Unsubscribe at any time.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-charcoal-500">
          {[
            "Early access to drops",
            "Exclusive subscriber discounts",
            "Style tips & guides",
          ].map((benefit) => (
            <div key={benefit} className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-accent-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-light">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
