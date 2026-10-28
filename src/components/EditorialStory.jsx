import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const CHAPTERS = [
  {
    numeral: "I.",
    title: "On patience",
    body: "We measure a piece by how long it stays loved, not how fast it ships. If a maker is behind, we wait with them.",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=80",
    shape: "rounded-arch",
  },
  {
    numeral: "II.",
    title: "On honesty",
    body: "Prices are what they are — the maker's cost, the shipping, our modest margin. Nothing hidden, nothing marked up twice to be marked down later.",
    img: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=700&q=80",
    shape: "rounded-full aspect-square",
  },
  {
    numeral: "III.",
    title: "On restraint",
    body: "We stock less, re-stock later, and sometimes don't re-stock at all. The catalog is small on purpose.",
    img: "https://images.pexels.com/photos/13758357/pexels-photo-13758357.jpeg",
    shape: "rounded-[48px]",
  },
];

function EditorialStory() {
  return (
    <section className="bg-ink-50 border-t border-ink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        {/* Oversized typographic lead */}
        <div className="grid grid-cols-12 gap-6 items-end mb-16 lg:mb-24">
          <div className="col-span-12 lg:col-span-7">
            <div className="text-[11px] uppercase tracking-[0.3em] text-ink-500 mb-6 flex items-center gap-3">
              <span className="w-6 h-px   " /> Manifesto
            </div>
            <h2 className="font-display text-5xl sm:text-7xl lg:text-[7.5rem] leading-[0.95] text-ink-900">
              Three <span className="italic text-accent-500">quiet</span>
              <br />
              principles.
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <p className="text-ink-600 text-base leading-relaxed">
              What a small atelier can stand for — printed here as a reminder, mostly to ourselves.
              If a decision breaks one of these three, we reconsider it.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-ink-900 border-b border-ink-900 pb-0.5 hover:border-accent-500 hover:text-accent-600 transition w-max"
            >
              Read the long version
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Three chapters laid out horizontally, each a different shape */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 lg:gap-10 relative">
          {/* Hairline between chapters on desktop */}
          <div className="hidden md:block absolute top-24 left-[33.3333%] -translate-x-1/2 w-px h-32 bg-ink-200" />
          <div className="hidden md:block absolute top-24 left-[66.6666%] -translate-x-1/2 w-px h-32 bg-ink-200" />

          {CHAPTERS.map((ch, i) => (
            <article
              key={ch.numeral}
              className={`flex flex-col ${i === 1 ? "md:translate-y-10" : ""}`}
            >
              <div className="flex items-start gap-4 mb-5">
                <span className="font-display italic text-5xl text-accent-500 leading-none">{ch.numeral}</span>
                <h3 className="font-display text-2xl text-ink-900 pt-2">{ch.title}</h3>
              </div>

              <div className={`${ch.shape} overflow-hidden bg-ink-100 w-full ${i === 1 ? "max-w-[280px] mx-auto" : "aspect-[4/5]"}`}>
                <img
                  src={ch.img}
                  alt={ch.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <p className="mt-6 text-ink-600 text-sm leading-relaxed">
                {ch.body}
              </p>
            </article>
          ))}
        </div>

        {/* Signature line */}
        <div className="mt-20 lg:mt-28 pt-6 border-t border-ink-200 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="font-display italic text-2xl text-ink-900">
            Signed, the atelier.
          </div>
          <div className="text-[11px] uppercase tracking-widest text-ink-500">
            Ahmedabad · Est. 2019
          </div>
        </div>
      </div>
    </section>
  );
}

export default EditorialStory;
