import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowUpRight } from "lucide-react";
import { fetchProducts } from "../features/Shopcart/productSlice";
import { formatCategory } from "../utils/formatCategory";

function InFocus() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.products);

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [status, dispatch]);

  const product = useMemo(() => {
    const pool = items.filter((p) => p.price > 50);
    return (pool.length ? pool : items).slice().sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))[0];
  }, [items]);

  if (!product) return <section className="bg-ink-900 h-96 w-full animate-pulse" aria-hidden="true" />;

  return (
    <section className="bg-ink-900 text-ink-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6">
          <div className="text-[11px] uppercase tracking-[0.3em] text-ink-400 mb-5 flex items-center gap-3">
            <span className="w-6 h-px   " /> In focus · This week
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink-50 leading-[1.05]">
            {product.title}
          </h2>
          <p className="mt-6 text-ink-300 text-base max-w-lg leading-relaxed">{product.description}</p>

          <div className="mt-8 grid grid-cols-3 gap-6 max-w-md border-t border-ink-700 pt-6">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-ink-400">Price</div>
              <div className="font-display text-2xl mt-1">${Number(product.price).toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-ink-400">Rating</div>
              <div className="font-display text-2xl mt-1">
                {Number(product.rating?.rate || 0).toFixed(1)}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-ink-400">Category</div>
              <div className="font-display text-xl mt-1 italic text-accent-300">
                {formatCategory(product.category)}
              </div>
            </div>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="group inline-flex items-center gap-2 mt-10 px-7 py-3.5 rounded-full bg-ink-50 text-ink-900 hover:bg-accent-200 transition text-sm font-medium"
          >
            See the piece
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="lg:col-span-6 relative">
          {/* Big tall arch, with a circle overlay */}
          <div className="relative mx-auto max-w-md">
            <div className="rounded-arch overflow-hidden bg-ink-800 aspect-[3/4]">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-accent-500 text-ink-50 flex flex-col items-center justify-center text-center p-4 shadow-xl">
              <span className="font-display italic text-3xl leading-none">01</span>
              <span className="text-[10px] uppercase tracking-widest mt-2 leading-tight">
                Signed by<br />the atelier
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default InFocus;
