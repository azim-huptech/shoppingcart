import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/Shopcart/productSlice";
import { formatCategory } from "../utils/formatCategory";

const IMAGES = {
  "mens-shirts":       "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
  "mens-shoes":        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  "mens-watches":      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
  "womens-dresses":    "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
  "womens-shoes":      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
  "womens-bags":       "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
  "womens-jewellery":  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
  "womens-watches":    "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=800&q=80",
  "fragrances":        "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
  "beauty":            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
  "skin-care":         "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
  "furniture":         "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
  "home-decoration":   "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
  "kitchen-accessories":"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80",
  "laptops":           "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  "smartphones":       "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
  "sunglasses":        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
  "tablets":           "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
  "sports-accessories":"https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80",
  "mobile-accessories":"https://images.unsplash.com/photo-1512499617640-c2f99912e5fe?auto=format&fit=crop&w=800&q=80",
};

const PICKED_ORDER = [
  "womens-dresses",
  "mens-shirts",
  "fragrances",
  "womens-jewellery",
  "smartphones",
  "home-decoration",
];

// Varied shape per cell position — no two neighbours share a shape.
const SHAPES = [
  "rounded-arch aspect-[4/5]",
  "rounded-full aspect-square",
  "rounded-[48px] aspect-[4/5]",
  "rounded-[48px] aspect-[4/5]",
  "rounded-arch aspect-square",
  "rounded-full aspect-square",
];

function Categories() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.products);

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [status, dispatch]);

  const categories = useMemo(() => {
    const map = new Map();
    for (const p of items) {
      if (!map.has(p.category)) map.set(p.category, { name: p.category, count: 0, sample: p.image });
      map.get(p.category).count += 1;
    }
    const picked = PICKED_ORDER.map((k) => map.get(k)).filter(Boolean);
    const extras = Array.from(map.values()).filter((c) => !PICKED_ORDER.includes(c.name));
    return [...picked, ...extras].slice(0, 6);
  }, [items]);

  return (
    <section className="bg-ink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex items-end justify-between gap-6 mb-14 flex-wrap">
          <div className="max-w-xl">
            <div className="text-[11px] uppercase tracking-[0.3em] text-ink-500 mb-4 flex items-center gap-3">
              <span className="w-6 h-px   " /> Edits
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-ink-900 leading-[1.05]">
              Collections, by <span className="italic text-accent-500">feel</span>.
            </h2>
            <p className="text-ink-600 text-base mt-4">
              Not aisles — moods. Pick where to wander and we'll do the rest.
            </p>
          </div>
          <Link
            to="/shop"
            className="text-sm font-medium text-ink-900 border-b border-ink-900 pb-0.5 hover:border-accent-500 hover:text-accent-600 transition"
          >
            Open the full catalog →
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`${SHAPES[i]} bg-ink-200 animate-pulse`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-end">
            {categories.map((cat, i) => {
              const img = IMAGES[cat.name] || cat.sample;
              const shape = SHAPES[i % SHAPES.length];
              return (
                <Link
                  key={cat.name}
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className={`group relative overflow-hidden bg-ink-200 shadow-sm hover:shadow-xl transition-all duration-500 ${shape} ${i === 1 ? "lg:translate-y-10" : ""} ${i === 4 ? "lg:translate-y-6" : ""}`}
                >
                  <img
                    src={img}
                    alt={formatCategory(cat.name)}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-900/75 via-ink-900/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-ink-50 text-center">
                    <div className="text-[10px] uppercase tracking-widest opacity-80">
                      {cat.count} pieces
                    </div>
                    <div className="font-display text-xl sm:text-2xl italic mt-0.5 leading-tight">
                      {formatCategory(cat.name)}
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 text-[11px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition">
                      Explore <span>→</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;
