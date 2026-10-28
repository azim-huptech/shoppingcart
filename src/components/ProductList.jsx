import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { fetchProducts } from "../features/Shopcart/productSlice";
import { addToCart } from "../features/Shopcart/cartSlice";
import { formatCategory } from "../utils/formatCategory";
import {
  Star,
  ShoppingCart,
  Check,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  PackageX,
} from "lucide-react";

function ProductList() {
  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();
  const { items: products, status, error } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items || []);

  const searchQuery = params.get("q") || "";
  const selectedCategory = params.get("category") || "all";
  const sortBy = params.get("sort") || "default";

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [addedMap, setAddedMap] = useState({});

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [status, dispatch]);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [products]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy, itemsPerPage]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const hay = `${product.title} ${product.description} ${product.brand || ""} ${product.category}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return Number(a.price) - Number(b.price);
        if (sortBy === "price-high") return Number(b.price) - Number(a.price);
        if (sortBy === "rating-high") return (b.rating?.rate || 0) - (a.rating?.rate || 0);
        if (sortBy === "title-asc") return a.title.localeCompare(b.title);
        return 0;
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedMap((prev) => ({ ...prev, [product.id]: false })), 1200);
  };

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || value === "default") next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const handleResetFilters = () => setParams({}, { replace: true });

  const isFiltered = searchQuery || selectedCategory !== "all" || sortBy !== "default";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-10 pb-6 border-b border-ink-200">
        <div className="text-[11px] uppercase tracking-[0.3em] text-ink-500 mb-3">
          {selectedCategory === "all" ? "The catalog" : "Collection"}
        </div>
        <h1 className="font-display text-5xl sm:text-6xl text-ink-900 leading-[1.05]">
          {searchQuery ? (
            <>Results for <span className="italic text-accent-500">"{searchQuery}"</span></>
          ) : selectedCategory !== "all" ? (
            <>{formatCategory(selectedCategory)}</>
          ) : (
            <>Shop the <span className="italic text-accent-500">whole</span> atelier.</>
          )}
        </h1>
        <p className="text-ink-500 text-sm mt-3">
          {totalItems} {totalItems === 1 ? "piece" : "pieces"} available
        </p>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1 min-w-0">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setParam("category", cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-ink-900 text-ink-50"
                    : "bg-ink-50 border border-ink-200 hover:border-ink-400 text-ink-700"
                }`}
              >
                {cat === "all" ? "All" : formatCategory(cat)}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-ink-50 border border-ink-200 px-3 py-1.5 rounded-full text-xs">
            <span className="text-ink-400">Sort</span>
            <select
              value={sortBy}
              onChange={(e) => setParam("sort", e.target.value)}
              className="bg-transparent font-medium text-ink-900 focus:outline-none cursor-pointer"
            >
              <option value="default">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating-high">Highest Rated</option>
              <option value="title-asc">A — Z</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 bg-ink-50 border border-ink-200 px-3 py-1.5 rounded-full text-xs">
            <span className="text-ink-400">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-transparent font-medium text-ink-900 focus:outline-none cursor-pointer"
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-xs text-accent-600 hover:text-accent-500 font-medium bg-ink-50 border border-ink-200 px-3 py-1.5 rounded-full"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      {status === "loading" && (
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-4 border-ink-200 border-t-ink-900 rounded-full animate-spin mb-3"></div>
          <p className="text-ink-500 text-sm font-medium">Loading the catalog...</p>
        </div>
      )}

      {status === "failed" && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-md mx-auto my-12">
          <p className="text-red-700 font-semibold mb-2">Unable to load products</p>
          <p className="text-red-500 text-xs mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchProducts())}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-ink-50 rounded-full text-xs font-medium transition"
          >
            Retry
          </button>
        </div>
      )}

      {status === "succeeded" && (
        <>
          {paginatedProducts.length === 0 ? (
            <div className="bg-ink-50 rounded-3xl border border-dashed border-ink-200 p-12 text-center max-w-md mx-auto my-8">
              <div className="w-14 h-14 bg-ink-100 text-ink-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <PackageX className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-ink-900">Nothing matches</h3>
              <p className="text-xs text-ink-500 mt-1 mb-5">
                Try different keywords or clear the filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-ink-900 hover:bg-ink-700 text-ink-50 font-medium rounded-full text-xs transition"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {paginatedProducts.map((product) => {
                const cartItem = cartItems.find((i) => i.id === product.id);
                const inCartQty = cartItem ? cartItem.quantity : 0;
                const isJustAdded = addedMap[product.id];

                return (
                  <article key={product.id} className="group flex flex-col">
                    <Link
                      to={`/product/${product.id}`}
                      className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-ink-100"
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
                      {inCartQty > 0 && (
                        <span className="absolute top-3 right-3 bg-accent-500 text-ink-50 text-[10px] font-semibold px-2 py-1 rounded-full">
                          {inCartQty} in bag
                        </span>
                      )}
                    </Link>
                    <div className="pt-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-1.5 text-xs text-ink-500">
                        <Star className="w-3.5 h-3.5 fill-accent-400 text-accent-400" />
                        <span className="text-ink-800 font-medium">
                          {Number(product.rating?.rate || 0).toFixed(1)}
                        </span>
                        <span className="text-ink-400">· {product.rating?.count || 0}</span>
                      </div>
                      <Link
                        to={`/product/${product.id}`}
                        className="mt-1.5 font-display italic text-lg text-ink-900 leading-tight line-clamp-2 hover:text-accent-600 transition"
                        title={product.title}
                      >
                        {product.title}
                      </Link>
                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <span className="font-medium text-ink-900">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition ${
                            isJustAdded
                              ? "bg-accent-500 text-ink-50"
                              : "bg-ink-900 hover:bg-ink-700 text-ink-50"
                          }`}
                        >
                          {isJustAdded ? (
                            <><Check className="w-3.5 h-3.5" /> Added</>
                          ) : (
                            <><ShoppingCart className="w-3.5 h-3.5" /> Add</>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 pt-6 border-t border-ink-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-ink-500">
                Showing <span className="font-semibold text-ink-800">{startIndex + 1}</span> –{" "}
                <span className="font-semibold text-ink-800">
                  {Math.min(startIndex + itemsPerPage, totalItems)}
                </span>{" "}
                of <span className="font-semibold text-ink-800">{totalItems}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-full border border-ink-200 bg-ink-50 text-ink-700 hover:bg-ink-100 disabled:opacity-40 disabled:pointer-events-none transition"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((n) => n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1)
                  .reduce((acc, n, i, arr) => {
                    if (i > 0 && n - arr[i - 1] > 1) acc.push("…");
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((pageNum, idx) => (
                    pageNum === "…" ? (
                      <span key={`sep-${idx}`} className="w-9 h-9 flex items-center justify-center text-ink-400">…</span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-full text-xs font-semibold transition ${
                          pageNum === currentPage
                            ? "bg-ink-900 text-ink-50"
                            : "bg-ink-50 border border-ink-200 text-ink-700 hover:bg-ink-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-full border border-ink-200 bg-ink-50 text-ink-700 hover:bg-ink-100 disabled:opacity-40 disabled:pointer-events-none transition"
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ProductList;
