import React from "react";

const SHOTS = [
  { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80", caption: "Studio flatlay" },
  { src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=600&q=80", caption: "At the brass bench" },
  { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80", caption: "Monsoon shoot, 05.26" },
  { src: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=600&q=80", caption: "Fresh dye lot" },
  { src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80", caption: "Jewellery drying" },
  { src: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80", caption: "Finished bags" },
  { src: "https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?auto=format&fit=crop&w=600&q=80", caption: "Close-ups" },
  { src: "https://images.unsplash.com/photo-1517620798216-c5a7f71f3c47?auto=format&fit=crop&w=600&q=80", caption: "Field notes" },
];

function Filmstrip() {
  // Duplicate the sequence so the auto-scroll loops seamlessly.
  const row = [...SHOTS, ...SHOTS];

  return (
    <section className="bg-ink-900 text-ink-50 relative overflow-hidden py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end justify-between gap-6 mb-10">
        <div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-ink-400 mb-3 flex items-center gap-3">
            <span className="w-6 h-px   " /> Behind the atelier
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05]">
            A week, <span className="italic text-accent-200">frame by frame</span>.
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] uppercase tracking-widest text-ink-400">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-300 animate-pulse" />
          <span>Rolling · live from the studio</span>
        </div>
      </div>

      {/* Scrolling filmstrip */}
      <div
        className="relative"
        style={{ maskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent)" }}
      >
        <div className="flex gap-5 w-max filmstrip-track pb-1">
          {row.map((shot, i) => (
            <figure
              key={i}
              className={`shrink-0 ${i % 2 === 0 ? "mt-0" : "mt-6"}`}
            >
              <div
                className={`${
                  i % 3 === 0
                    ? "w-56 h-72 rounded-[32px]"
                    : i % 3 === 1
                    ? "w-72 h-56 rounded-[48px]"
                    : "w-60 h-80 rounded-arch"
                } overflow-hidden bg-ink-800 ring-1 ring-ink-800`}
              >
                <img
                  src={shot.src}
                  alt={shot.caption}
                  className="w-full h-full object-cover opacity-95"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-widest text-ink-400">
                <span className="w-4 h-px   " />
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 text-[11px] uppercase tracking-widest text-ink-500 flex justify-between">
        <span>No. 07</span>
        <span>Hover to pause →</span>
      </div>
    </section>
  );
}

export default Filmstrip;
