import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Star, ShoppingCart, Check } from "lucide-react";
import { fetchProducts } from "../features/Shopcart/productSlice";
import { addToCart } from "../features/Shopcart/cartSlice";
import { formatCategory } from "../utils/formatCategory";

const TABS = [
  { key: "editor",   label: "Editor's picks" },
  { key: "new",      label: "Just in" },
  { key: "trending", label: "Trending" },
];

const CARD_SHAPES = [
  // "rounded-arch",
  "rounded-[36px]",
  // "rounded-full aspect-square",
  "rounded-[36px]",
  // "rounded-arch",
  "rounded-[36px]",
  // "rounded-full aspect-square",
  // "rounded-arch",
];

function Featured() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.products);
  const [addedMap, setAddedMap] = useState({});
  const [tab, setTab] = useState("editor");

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [status, dispatch]);

  const list = useMemo(() => {
    if (!items.length) return [];
    const sorted = [...items];
    if (tab === "editor") sorted.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    else if (tab === "new") sorted.sort((a, b) => b.id - a.id);
    else sorted.sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0));
    return sorted.slice(0, 8);
  }, [items, tab]);

  const handleAdd = (product) => {
    dispatch(addToCart(product));
    setAddedMap((m) => ({ ...m, [product.id]: true }));
    setTimeout(() => setAddedMap((m) => ({ ...m, [product.id]: false })), 1200);
  };

  return (
    <section className="bg-ink-50 border-t border-ink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-ink-500 mb-4 flex items-center gap-3">
              <span className="w-6 h-px   " /> On our desk
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-ink-900 leading-[1.05]">
              Pieces we <span className="italic text-accent-500">love</span> right now.
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-medium text-ink-900 border-b border-ink-900 pb-0.5 hover:border-accent-500 hover:text-accent-600 transition w-max"
          >
            View all →
          </Link>
        </div>

        <div className="flex items-center gap-1 border-b border-ink-200 mb-10 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-3 text-sm transition whitespace-nowrap ${
                tab === t.key
                  ? "text-ink-900 font-medium after:absolute after:left-3 after:right-3 after:bottom-0 after:h-0.5 after:bg-ink-900"
                  : "text-ink-500 hover:text-ink-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {status === "loading" && list.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className={`${CARD_SHAPES[i]} h-80 bg-ink-200 animate-pulse`} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-end">
            {list.map((product, i) => {
              const shape = CARD_SHAPES[i % CARD_SHAPES.length];
              const isAdded = addedMap[product.id];
              const isCircle = shape.includes("rounded-full");
              return (
                <article key={product.id} className="group flex flex-col">
                  <Link
                    to={`/product/${product.id}`}
                    className={`relative overflow-hidden bg-ink-100 ${shape} ${isCircle ? "" : "aspect-[4/5]"}`}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-ink-50/90 backdrop-blur text-ink-700 text-[10px] font-medium uppercase tracking-widest px-2 py-1 rounded-full">
                      {formatCategory(product.category)}
                    </span>
                  </Link>
                  <div className="pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-ink-500">
                      <Star className="w-3.5 h-3.5 fill-accent-400 text-accent-400" />
                      <span className="text-ink-800 font-medium">
                        {Number(product.rating?.rate || 0).toFixed(1)}
                      </span>
                      <span className="text-ink-400">· {product.rating?.count || 0} reviews</span>
                    </div>
                    <Link
                      to={`/product/${product.id}`}
                      className="mt-1.5 block font-display italic text-lg text-ink-900 leading-tight line-clamp-2 hover:text-accent-600 transition"
                      title={product.title}
                    >
                      {product.title}
                    </Link>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-ink-900 font-medium">
                        ${Number(product.price).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleAdd(product)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition ${
                          isAdded ? "bg-accent-500 text-ink-50" : "bg-ink-900 hover:bg-ink-700 text-ink-50"
                        }`}
                      >
                        {isAdded ? (<><Check className="w-3.5 h-3.5" /> Added</>) : (<><ShoppingCart className="w-3.5 h-3.5" /> Add</>)}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Featured;
