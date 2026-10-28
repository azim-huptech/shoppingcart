import React from "react";

const POSTS = [
  {
    tag: "",
    title: "A week with the slow-stitch wool",
    excerpt: "Four days by the Rann, one sweater — a short diary on how a piece becomes a habit.",
    image: "https://images.pexels.com/photos/7679685/pexels-photo-7679685.jpeg?auto=format&fit=crop&w=800&q=80",
    read: "4 min read",
    shape: "rounded-arch",
  },
  {
    tag: "Lookbook",
    title: "Monsoon editorial: Objects at rest",
    excerpt: "This season's edit, photographed on a quiet morning in Ahmedabad.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    read: "2 min read",
    shape: "rounded-[48px]",
  },
  {
    tag: "Interview",
    title: "The maker: Vikram, on patience",
    excerpt: "A conversation with the brass-work artisan behind our latest tableware.",
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80",
    read: "6 min read",
    shape: "rounded-[32px] rounded-tr-[120px]",
  },
];

function Journal() {
  return (
    <section className="bg-ink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex items-end justify-between gap-6 mb-14 flex-wrap">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-ink-500 mb-4 flex items-center gap-3">
              <span className="w-6 h-px   " /> Journal
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-ink-900 leading-[1.05]">
              Stories, slowly <span className="italic text-accent-500">told</span>.
            </h2>
          </div>
          <a href="#" className="text-sm font-medium text-ink-900 border-b border-ink-900 pb-0.5 hover:border-accent-500 hover:text-accent-600 transition">
            All entries →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-start">
          {POSTS.map((post, i) => (
            <article key={post.title} className={`group ${i === 1 ? "md:translate-y-10" : ""}`}>
              <div className={`relative aspect-[4/5] overflow-hidden bg-ink-200 ${post.shape}`}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 bg-ink-50/90 backdrop-blur text-ink-700 text-[10px] uppercase tracking-widest font-medium px-2.5 py-1 rounded-full">
                  {post.tag}
                </span>
              </div>
              <h3 className="mt-5 font-display text-2xl text-ink-900 leading-snug group-hover:text-accent-600 transition">
                {post.title}
              </h3>
              <p className="mt-2 text-ink-600 text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
              <div className="mt-3 text-[11px] uppercase tracking-widest text-ink-400">
                {post.read}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Journal;
