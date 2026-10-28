import React from "react";

const WORDS = [
  "Handpicked",
  "Patient craftsmanship",
  "Honest materials",
  "Fewer, better things",
  "Shipped from the atelier",
  "Signed by the maker",
  "No fast trends",
  "Built to be kept",
];

function Marquee() {
  // Duplicate the sequence so the animation loops seamlessly.
  const row = [...WORDS, ...WORDS];
  return (
    <section className="bg-ink-900 text-ink-50 border-y border-ink-800 overflow-hidden">
      <div className="relative py-5">
        <div className="flex gap-10 whitespace-nowrap marquee-track w-max">
          {row.map((w, i) => (
            <span key={i} className="flex items-center gap-10 font-display italic text-2xl sm:text-3xl text-ink-100">
              {w}
              <span className="text-accent-300 not-italic">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Marquee;
