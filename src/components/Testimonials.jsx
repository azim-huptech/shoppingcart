import React from "react";

const QUOTES = [
  {
    quote: "Objet feels like getting a letter in the post. Everything is wrapped like a gift and the quality is honest. The sweater has become my daily uniform.",
    name: "Priya S.",
    role: "Illustrator",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote: "I don't buy from most online stores anymore. These folks are different — slow in all the right ways, and the pieces last.",
    name: "Ravi K.",
    role: "Architect",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote: "Beautiful imagery, but it's the smell of the box when you open it that gets me. Little details, taken seriously.",
    name: "Léa M.",
    role: "Photographer",
    avatar: "https://images.unsplash.com/photo-1544005316-04ce1f2bcbd9?auto=format&fit=crop&w=200&q=80",
  },
];

const SHAPES = ["rounded-[32px] rounded-tr-[80px]", "rounded-[32px] rounded-bl-[80px]", "rounded-[32px] rounded-tl-[80px]"];

function Testimonials() {
  return (
    <section className="bg-ink-100 border-y border-ink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-xl">
          <div className="text-[11px] uppercase tracking-[0.3em] text-ink-500 mb-4 flex items-center gap-3">
            <span className="w-6 h-px   " /> Letters
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-ink-900 leading-[1.05]">
            Notes from the people who <span className="italic text-accent-500">keep</span> our pieces.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {QUOTES.map((q, i) => (
            <figure
              key={q.name}
              className={`relative bg-ink-50 p-8 border border-ink-200 shadow-sm hover:shadow-md transition ${SHAPES[i]} ${i === 1 ? "md:translate-y-6" : ""}`}
            >
              <span className="font-display text-6xl leading-none text-accent-400 absolute top-6 left-7 select-none">
                "
              </span>
              <blockquote className="relative text-ink-800 text-[15px] leading-relaxed pt-8">
                {q.quote}
              </blockquote>
              <figcaption className="mt-6 pt-5 border-t border-ink-200 flex items-center gap-3">
                <img src={q.avatar} alt="" className="w-11 h-11 rounded-full object-cover border border-ink-200" />
                <div>
                  <div className="text-sm font-medium text-ink-900">{q.name}</div>
                  <div className="text-[11px] uppercase tracking-widest text-ink-500">{q.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
