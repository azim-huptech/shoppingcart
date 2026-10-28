import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Star, ShoppingCart, Check, Minus, Plus, ArrowLeft, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { fetchProducts, normalizeProduct } from "../features/Shopcart/productSlice";
import { addToCart } from "../features/Shopcart/cartSlice";
import { formatCategory } from "../utils/formatCategory";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.products);

  const [fallback, setFallback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const product = useMemo(
    () => items.find((p) => String(p.id) === String(id)) || fallback,
    [items, id, fallback]
  );

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [status, dispatch]);

  useEffect(() => {
    if (!product && status !== "loading") {
      let cancelled = false;
      setLoading(true);
      setError(null);
      axios
        .get(`https://dummyjson.com/products/${id}`)
        .then((res) => { if (!cancelled) setFallback(normalizeProduct(res.data)); })
        .catch(() => { if (!cancelled) setError("Product not found."); })
        .finally(() => { if (!cancelled) setLoading(false); });
      return () => { cancelled = true; };
    }
  }, [id, product, status]);

  useEffect(() => { setActiveImage(0); setQty(1); }, [product?.id]);

  const stock = Number(product?.stock) || 99;
  const atCap = qty >= stock;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) dispatch(addToCart(product));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  if (loading || status === "loading") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-block w-8 h-8 border-4 border-ink-200 border-t-ink-900 rounded-full animate-spin mb-3"></div>
        <p className="text-ink-500 text-sm font-medium">Loading piece...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-3xl text-ink-900">Not found</h2>
        <p className="text-sm text-ink-500 mt-2">{error || "That piece may have been archived."}</p>
        <Link to="/shop" className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-ink-900 text-ink-50 rounded-full text-sm font-medium hover:bg-ink-700">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length ? product.images : [product.image];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7">
          {/* Big arch main image */}
          <div className="rounded-arch overflow-hidden bg-ink-100 aspect-[4/5]">
            <img src={images[activeImage]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {images.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-full overflow-hidden bg-ink-100 border-2 transition ${
                    i === activeImage ? "border-ink-900" : "border-transparent hover:border-ink-300"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent-600 mb-3">
            {formatCategory(product.category)}
            {product.brand && <> · {product.brand}</>}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-ink-900 leading-[1.05]">
            {product.title}
          </h1>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent-400 text-accent-400" />
              <span className="font-medium text-ink-900">
                {Number(product.rating?.rate || 0).toFixed(1)}
              </span>
            </div>
            <span className="text-ink-400">·</span>
            <span className="text-ink-500">{product.rating?.count || 0} reviews</span>
            <span className="text-ink-400">·</span>
            <span className={`text-xs ${stock > 10 ? "text-emerald-700" : "text-amber-700"}`}>
              {stock > 10 ? "In stock" : `Only ${stock} left`}
            </span>
          </div>

          <div className="mt-6">
            <span className="font-display text-4xl text-ink-900">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          <p className="mt-6 text-ink-600 text-base leading-relaxed">{product.description}</p>

          {product.tags && product.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {product.tags.map((t) => (
                <span key={t} className="text-[11px] uppercase tracking-widest text-ink-500 bg-ink-100 px-2.5 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center border border-ink-200 rounded-full bg-ink-100 overflow-hidden">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2.5 hover:bg-ink-200 text-ink-700 transition" aria-label="Decrease">
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                max={stock}
                value={qty}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (isNaN(v) || v < 1) setQty(1);
                  else setQty(Math.min(v, stock));
                }}
                className="w-12 text-center bg-transparent text-sm font-medium text-ink-900 focus:outline-none"
              />
              <button
                onClick={() => setQty((q) => Math.min(stock, q + 1))}
                disabled={atCap}
                className="p-2.5 hover:bg-ink-200 text-ink-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Increase"
                title={atCap ? "Max stock reached" : "Increase"}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition ${
                justAdded ? "bg-accent-500 text-ink-50" : "bg-ink-900 hover:bg-ink-700 text-ink-50"
              }`}
            >
              {justAdded ? (<><Check className="w-4 h-4" /> Added</>) : (<><ShoppingCart className="w-4 h-4" /> Add to bag</>)}
            </button>
          </div>
          {atCap && <p className="mt-2 text-xs text-amber-700">That's the full stock available for this piece.</p>}

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="flex items-center gap-2 p-3 bg-ink-100 border border-ink-200 rounded-full">
              <Truck className="w-4 h-4 text-accent-500" /> Shipping $60+
            </div>
            <div className="flex items-center gap-2 p-3 bg-ink-100 border border-ink-200 rounded-full">
              <ShieldCheck className="w-4 h-4 text-emerald-700" /> Secure checkout
            </div>
            <div className="flex items-center gap-2 p-3 bg-ink-100 border border-ink-200 rounded-full">
              <RotateCcw className="w-4 h-4 text-ink-600" /> 30-day returns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
