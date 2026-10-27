import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/Shopcart/productSlice";
import { addToCart } from "../features/Shopcart/cartSlice";
import Navbar from "./Navbar";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Star, 
  ShoppingCart, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  RotateCcw,
  PackageX
} from "lucide-react";

function ProductList() {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items || []);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all"); // 'all' | 'under25' | '25to50' | '50to100' | 'over100'
  const [minRating, setMinRating] = useState(0); // 0, 3, 4
  const [sortBy, setSortBy] = useState("default"); // 'default' | 'price-low' | 'price-high' | 'rating-high' | 'title-asc'
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Added to cart feedback state map: { [productId]: boolean }
  const [addedMap, setAddedMap] = useState({});

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [products]);

  // Reset pagination to page 1 whenever search or filter values change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceRange, minRating, sortBy, itemsPerPage]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesTitle = product.title?.toLowerCase().includes(q);
          const matchesDesc = product.description?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc) return false;
        }

        // Category filter
        if (selectedCategory !== "all" && product.category !== selectedCategory) {
          return false;
        }

        // Price range filter
        const price = Number(product.price);
        if (priceRange === "under25" && price >= 25) return false;
        if (priceRange === "25to50" && (price < 25 || price > 50)) return false;
        if (priceRange === "50to100" && (price < 50 || price > 100)) return false;
        if (priceRange === "over100" && price <= 100) return false;

        // Rating filter
        const rate = product.rating?.rate || 0;
        if (minRating > 0 && rate < minRating) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return Number(a.price) - Number(b.price);
        if (sortBy === "price-high") return Number(b.price) - Number(a.price);
        if (sortBy === "rating-high") return (b.rating?.rate || 0) - (a.rating?.rate || 0);
        if (sortBy === "title-asc") return a.title.localeCompare(b.title);
        return 0; // default order
      });
  }, [products, searchQuery, selectedCategory, priceRange, minRating, sortBy]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setPriceRange("all");
    setMinRating(0);
    setSortBy("default");
  };

  const isFiltered = searchQuery || selectedCategory !== "all" || priceRange !== "all" || minRating > 0 || sortBy !== "default";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Hero Banner / Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Modern Collection
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Explore handpicked quality lifestyle, fashion, electronics, and accessories.
              </p>
            </div>

            {/* Quick stats & Items per page selector */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                {totalItems} {totalItems === 1 ? 'product' : 'products'} available
              </span>

              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-xl shadow-xs text-xs">
                <span className="text-slate-400">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value={6}>6</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Bar & Filter Controls Container */}
          <div className="mt-6 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
            {/* Top row: Search input & Sort selector */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Field */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products by title or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="sm:w-56">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100 transition cursor-pointer font-medium"
                >
                  <option value="default">Featured / Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating-high">Highest Rated</option>
                  <option value="title-asc">Alphabetical (A - Z)</option>
                </select>
              </div>
            </div>

            {/* Middle row: Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Category:
              </span>
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Bottom row: Secondary filters (Price Range, Rating) & Reset button */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                {/* Price Range Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Price:</span>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Prices</option>
                    <option value="under25">Under $25</option>
                    <option value="25to50">$25 - $50</option>
                    <option value="50to100">$50 - $100</option>
                    <option value="over100">$100 & Above</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Min Rating:</span>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-medium focus:outline-none cursor-pointer"
                  >
                    <option value={0}>All Ratings</option>
                    <option value={4}>4★ and above</option>
                    <option value={3}>3★ and above</option>
                  </select>
                </div>
              </div>

              {/* Reset button when any filter is active */}
              {isFiltered && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {status === "loading" && (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-slate-300 border-t-slate-900 rounded-full animate-spin mb-3"></div>
            <p className="text-slate-500 text-sm font-medium">Loading catalog products...</p>
          </div>
        )}

        {status === "failed" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto my-12">
            <p className="text-red-700 font-semibold mb-2">Unable to load products</p>
            <p className="text-red-500 text-xs mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchProducts())}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-medium transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Product Grid or Empty State */}
        {status === "succeeded" && (
          <>
            {paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center max-w-md mx-auto my-8">
                <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <PackageX className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No matching products found</h3>
                <p className="text-xs text-slate-500 mt-1 mb-5">
                  Try tweaking your search keywords or relaxing some of the active filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-xs transition shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => {
                  const cartItem = cartItems.find((i) => i.id === product.id);
                  const inCartQty = cartItem ? cartItem.quantity : 0;
                  const isJustAdded = addedMap[product.id];

                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group"
                    >
                      {/* Product Image Frame */}
                      <div className="relative aspect-square p-6 bg-white flex items-center justify-center overflow-hidden border-b border-slate-100">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <span className="absolute top-3 left-3 bg-slate-100/90 backdrop-blur-xs text-slate-600 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          {product.category}
                        </span>
                        {inCartQty > 0 && (
                          <span className="absolute top-3 right-3 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                            {inCartQty} in cart
                          </span>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Rating display */}
                          <div className="flex items-center gap-1 mb-1.5 text-xs text-slate-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-slate-800">
                              {product.rating?.rate || "4.5"}
                            </span>
                            <span className="text-slate-400 text-[11px]">
                              ({product.rating?.count || 0})
                            </span>
                          </div>

                          {/* Title */}
                          <h2
                            className="font-semibold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-indigo-600 transition"
                            title={product.title}
                          >
                            {product.title}
                          </h2>
                        </div>

                        {/* Price & Action Button */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-xs text-slate-400 block leading-none">Price</span>
                            <span className="text-lg font-bold text-slate-900 leading-tight">
                              ${Number(product.price).toFixed(2)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleAddToCart(product)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition shadow-xs cursor-pointer ${
                              isJustAdded
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-900 hover:bg-slate-800 text-white"
                            }`}
                          >
                            {isJustAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-3.5 h-3.5" />
                                <span>Add to Cart</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  Showing <span className="font-semibold text-slate-800">{startIndex + 1}</span> to{" "}
                  <span className="font-semibold text-slate-800">
                    {Math.min(startIndex + itemsPerPage, totalItems)}
                  </span>{" "}
                  of <span className="font-semibold text-slate-800">{totalItems}</span> products
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Prev Button */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition shadow-xs"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-xl text-xs font-semibold transition cursor-pointer ${
                          isActive
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition shadow-xs"
                    title="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default ProductList;
