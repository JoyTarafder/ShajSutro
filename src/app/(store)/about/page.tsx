import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about ShajSutro's story, values, and the team behind the brand.",
};

const team = [
  {
    name: "Aria Chen",
    role: "Co-Founder & Creative Director",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&q=80",
    bio: "Former RISD graduate with 12 years in luxury fashion. Believes clothing should be both beautiful and built to last.",
  },
  {
    name: "Marcus Elias",
    role: "Co-Founder & CEO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    bio: "Ex-McKinsey consultant turned entrepreneur. Passionate about building brands with purpose and integrity.",
  },
  {
    name: "Lena Park",
    role: "Head of Design",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    bio: "Cut her teeth at C\u00e9line and Acne Studios before joining ShajSutro to lead our seasonal collections.",
  },
  {
    name: "James Okafor",
    role: "Head of Sustainability",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    bio: "Environmental scientist and supply chain expert ensuring every garment meets our strict ethical standards.",
  },
];

const values = [
  {
    icon: "\u2726",
    title: "Quality Over Quantity",
    description:
      "We design fewer pieces, but invest more in each one. Every garment is crafted to outlast trends and improve with age.",
  },
  {
    icon: "\u25C8",
    title: "Radical Transparency",
    description:
      "We share our supply chain, pricing breakdown, and material sourcing openly. No greenwashing, no empty promises.",
  },
  {
    icon: "\u25C9",
    title: "Ethical Production",
    description:
      "All our manufacturing partners are independently audited and pay living wages. We visit every factory we work with.",
  },
  {
    icon: "\u25B3",
    title: "Timeless Design",
    description:
      "We resist the pressure of micro-trends. Our collections are designed to remain relevant and wearable for years.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-[65vh] min-h-[450px] overflow-hidden bg-charcoal-950">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80"
          alt="ShajSutro atelier"
          fill
          className="object-cover opacity-35"
          priority
        />
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-20 w-full">
            <span className="section-label !text-accent-400 !mb-4">Our Story</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight max-w-2xl tracking-tight">
              Clothing with intention, built to last.
            </h1>
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-7">
              <p className="text-lg text-charcoal-500 leading-relaxed font-light">
                ShajSutro was founded in 2019 with a simple frustration: fashion had become too fast, too disposable, too loud. We wanted to build something different &mdash; a clothing brand that respects your intelligence, your wardrobe, and the planet.
              </p>
              <p className="text-charcoal-500 leading-relaxed font-light">
                The name &ldquo;ShajSutro&rdquo; comes from the Bengali word for &ldquo;artful thread&rdquo; &mdash; a nod to our belief that great clothing is about craftsmanship, not logos. We started with a small collection of ten essentials, made in a family-run Portuguese factory we&apos;d been visiting for two years before placing a single order.
              </p>
              <p className="text-charcoal-500 leading-relaxed font-light">
                Today we have over 200 styles and ship to 50 countries, but our founding principles haven&apos;t changed. We still meet every factory partner in person. We still use the same natural fabrics we started with. And we still believe that the best garment is the one you&apos;ll wear for ten years.
              </p>
              <Link href="/shop" className="btn-primary inline-flex mt-2">
                Explore the Collection
              </Link>
            </div>
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-soft-lg">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                alt="ShajSutro store interior"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 bg-warm-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="section-label">What We Stand For</span>
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">The principles that guide every decision we make</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-2xl p-7 border border-charcoal-100 shadow-soft hover:shadow-soft-md transition-all duration-500 ease-premium hover:-translate-y-0.5">
                <span className="text-2xl text-accent-600 block mb-5">{value.icon}</span>
                <h3 className="text-[15px] font-semibold text-charcoal-900 mb-3">{value.title}</h3>
                <p className="text-sm text-charcoal-400 leading-relaxed font-light">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 border-y border-charcoal-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {[
              { value: "2019", label: "Founded" },
              { value: "50K+", label: "Happy Customers" },
              { value: "12", label: "Factory Partners" },
              { value: "50+", label: "Countries Shipped" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-semibold text-charcoal-950 tracking-tight">{stat.value}</p>
                <p className="text-sm text-charcoal-400 mt-2 font-light">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <span className="section-label">Our People</span>
            <h2 className="section-title">Meet the Team</h2>
            <p className="section-subtitle">The people who bring ShajSutro to life every day</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {team.map((member) => (
              <div key={member.name} className="group text-center">
                <div className="relative w-44 h-44 mx-auto rounded-full overflow-hidden mb-6 bg-warm-50 shadow-soft">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
                    sizes="176px"
                  />
                </div>
                <h3 className="text-[15px] font-semibold text-charcoal-900">{member.name}</h3>
                <p className="text-sm text-accent-600 mt-1 mb-3 font-medium">{member.role}</p>
                <p className="text-sm text-charcoal-400 leading-relaxed font-light">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-charcoal-950 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(90,127,160,0.08),transparent_60%)]" />
        <div className="relative max-w-2xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-5 tracking-tight">Join the ShajSutro community</h2>
          <p className="text-charcoal-400 mb-10 font-light leading-relaxed">
            Over 50,000 people have made the switch to slower, more intentional fashion. We&apos;d love for you to be next.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="inline-flex items-center justify-center px-8 py-4 bg-white text-charcoal-950 font-semibold rounded-full hover:bg-warm-50 transition-all duration-300 hover:scale-[1.02]">
              Shop the Collection
            </Link>
            <Link href="/contact" className="btn-secondary !border-charcoal-700 !text-white hover:!bg-charcoal-800">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
