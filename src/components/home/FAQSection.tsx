"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is your return policy?",
    answer:
      "We offer free returns within 30 days of delivery for all items in original condition with tags attached. Simply initiate a return from your account dashboard and we'll arrange a free collection.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 3–5 business days. Express shipping (1–2 days) is available at checkout. Orders over $150 qualify for free standard shipping. You'll receive tracking information once your order is dispatched.",
  },
  {
    question: "Are your products sustainably made?",
    answer:
      "Sustainability is central to how we operate. We partner with certified factories that meet strict ethical and environmental standards, use natural and recycled materials wherever possible, and offset our carbon footprint through verified programs.",
  },
  {
    question: "How do I find my size?",
    answer:
      "Each product page features a detailed size guide with measurements in both cm and inches. If you're between sizes, we generally recommend sizing up for a relaxed fit or sizing down for a more fitted look. Our team is always happy to help via live chat.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "You can modify or cancel your order within 1 hour of placing it by contacting our support team. After this window, orders enter our fulfillment process and can no longer be changed, but you can still return the items once received.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes! We ship to over 50 countries worldwide. International shipping typically takes 7–14 business days depending on the destination. Duties and taxes may apply and are the responsibility of the recipient.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-28">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <span className="section-label">Support</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle mt-3">
            Everything you need to know. Can&apos;t find the answer?{" "}
            <a href="/contact" className="text-accent-600 hover:text-accent-700 transition-colors font-medium">
              Contact us
            </a>
            .
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-2xl overflow-hidden transition-all duration-400 ease-premium ${
                openIndex === index
                  ? "border-charcoal-200 shadow-soft bg-white"
                  : "border-charcoal-100 hover:border-charcoal-200"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-7 py-6 text-left transition-colors duration-300"
                aria-expanded={openIndex === index}
              >
                <span className="text-[15px] font-medium text-charcoal-900 pr-6">{faq.question}</span>
                <span
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-400 ease-premium ${
                    openIndex === index
                      ? "bg-charcoal-950 rotate-45"
                      : "bg-charcoal-50"
                  }`}
                >
                  <svg
                    className={`w-3.5 h-3.5 transition-colors duration-300 ${
                      openIndex === index ? "text-white" : "text-charcoal-400"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-400 ease-premium ${
                  openIndex === index ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-7 pb-6 text-sm text-charcoal-400 leading-relaxed font-light">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
