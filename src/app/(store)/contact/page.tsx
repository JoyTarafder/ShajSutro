"use client";

import { useState } from "react";

const contactInfo = [
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    ),
    label: "Email",
    value: "hello@shajsutro.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    ),
    label: "Phone",
    value: "+1 (800) 123-4567",
    sub: "Mon\u2013Fri, 9am\u20136pm EST",
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    ),
    label: "Office",
    value: "123 Fashion Ave, Suite 500",
    sub: "New York, NY 10001",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    topic: "general",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-warm-50 border-b border-charcoal-100 py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <span className="section-label">Reach Out</span>
          <h1 className="text-4xl sm:text-5xl font-semibold text-charcoal-950 mb-4 tracking-tight">Get in Touch</h1>
          <p className="text-charcoal-400 max-w-md mx-auto font-light">
            Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="space-y-9">
            <div>
              <h2 className="text-xl font-semibold text-charcoal-950 mb-7">Contact Information</h2>
              <div className="space-y-7">
                {contactInfo.map((info) => (
                  <div key={info.label} className="flex gap-4">
                    <div className="w-11 h-11 rounded-xl bg-warm-50 border border-warm-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {info.icon}
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-[0.15em]">{info.label}</p>
                      <p className="text-sm font-medium text-charcoal-900 mt-1">{info.value}</p>
                      <p className="text-xs text-charcoal-300 mt-0.5 font-light">{info.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-accent-50 rounded-2xl p-6 border border-accent-100">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold text-charcoal-900">Live Chat Available</span>
              </div>
              <p className="text-xs text-charcoal-400 mb-5 font-light">
                Chat with a style expert right now. Average response time: under 2 minutes.
              </p>
              <button className="w-full py-3 text-sm font-medium bg-white text-charcoal-900 rounded-xl border border-charcoal-200 hover:bg-charcoal-50 hover:shadow-soft transition-all duration-300">
                Start Live Chat
              </button>
            </div>

            <div className="bg-charcoal-50 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-charcoal-900 mb-2.5">Looking for quick answers?</h3>
              <p className="text-xs text-charcoal-400 mb-5 font-light">Check our FAQ &mdash; it covers returns, shipping, sizing, and more.</p>
              <a href="/#faq" className="text-sm font-medium text-accent-600 hover:text-accent-700 flex items-center gap-1.5 transition-colors duration-300 group">
                View FAQ
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-charcoal-950 mb-2.5">Message Sent!</h2>
                <p className="text-charcoal-400 max-w-sm font-light">
                  Thank you for reaching out. We&apos;ve received your message and will get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn-secondary mt-7 text-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-semibold text-charcoal-950 mb-7">Send a Message</h2>

                <div>
                  <label className="block text-xs font-medium text-charcoal-600 mb-2.5">Topic</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "general", label: "General" },
                      { value: "order", label: "Order Support" },
                      { value: "returns", label: "Returns" },
                      { value: "sizing", label: "Sizing" },
                      { value: "press", label: "Press / Collab" },
                    ].map((topic) => (
                      <button
                        key={topic.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, topic: topic.value })}
                        className={`px-5 py-2.5 text-sm rounded-full border-2 transition-all duration-200 ${
                          formData.topic === topic.value
                            ? "border-charcoal-950 bg-charcoal-950 text-white"
                            : "border-charcoal-200 text-charcoal-500 hover:border-charcoal-400 hover:text-charcoal-900"
                        }`}
                      >
                        {topic.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-charcoal-600 mb-2">Full Name</label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-charcoal-600 mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal-600 mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-charcoal-600 mb-2">Message</label>
                  <textarea
                    required
                    rows={6}
                    className="input-field resize-none"
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
