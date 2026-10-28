import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, CornerDownLeft } from "lucide-react";
import useDebounce from "../utils/useDebounce";
import { fetchProducts } from "../features/Shopcart/productSlice";
import { formatCategory } from "../utils/formatCategory";

const MAX_RESULTS = 7;

function SearchDropdown() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((s) => s.products);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [recent, setRecent] = useState([]);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const debouncedQuery = useDebounce(query, 180);
  const activeQuery = debouncedQuery.trim().toLowerCase();

  useEffect(() => {
    if (status === "idle") dispatch(fetchProducts());
  }, [status, dispatch]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("recent_searches") || "[]");
      if (Array.isArray(saved)) setRecent(saved.slice(0, 5));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const results = useMemo(() => {
    if (!activeQuery) return [];
    return products
      .filter((p) => {
        const hay = `${p.title} ${p.category} ${p.brand || ""} ${p.description}`.toLowerCase();
        return hay.includes(activeQuery);
      })
      .slice(0, MAX_RESULTS);
  }, [products, activeQuery]);

  useEffect(() => { setHighlight(0); }, [activeQuery]);

  const persistRecent = (q) => {
    try {
      const next = [q, ...recent.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 5);
      setRecent(next);
      localStorage.setItem("recent_searches", JSON.stringify(next));
    } catch { /* ignore */ }
  };

  const goToResults = (q) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    persistRecent(trimmed);
    setOpen(false);
    inputRef.current?.blur();
    navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  const goToProduct = (p) => {
    persistRecent(query.trim() || p.title);
    setOpen(false);
    inputRef.current?.blur();
    navigate(`/product/${p.id}`);
  };

  const handleKeyDown = (e) => {
    if (!open) setOpen(true);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, Math.max(0, results.length - 1)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeQuery && results[highlight]) {
        goToProduct(results[highlight]);
      } else {
        goToResults(query);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showRecent = open && !activeQuery && recent.length > 0;
  const showResults = open && activeQuery.length > 0;

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xl w-80">
      <div className="relative">
        <Search className="w-4  h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for shirts, phones, perfumes..."
          aria-label="Search products"
          className="w-full pl-10 pr-9 py-2 rounded-full border border-ink-200 bg-white/80 backdrop-blur text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-ink-900 focus:bg-white transition"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setOpen(true); inputRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {(showRecent || showResults) && (
        <div
          role="listbox"
          className="absolute left-0 right-0 mt-2 bg-white border border-ink-200 rounded-2xl shadow-2xl shadow-ink-900/5 overflow-hidden z-50"
        >
          {showRecent && (
            <div className="p-2">
              <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink-400">Recent</div>
              {recent.map((r) => (
                <button 
                  key={r}
                  onClick={() => { setQuery(r); goToResults(r); }}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-ink-50 flex items-center gap-2 text-ink-800"
                >
                  <Search className="w-3.5 h-3.5 text-ink-400" />
                  <span>{r}</span>
                </button>
              ))}
            </div>
          )}

          {showResults && (
            <>
              {results.length === 0 ? (
                <div className="px-4 py-6 text-sm text-ink-500 text-center">
                  No products match <span className="font-medium text-ink-800">"{query}"</span>.
                </div>
              ) : (
                <ul className="py-1">
                  {results.map((p, i) => (
                    <li key={p.id}>
                      <button
                        onMouseEnter={() => setHighlight(i)}
                        onClick={() => goToProduct(p)}
                        className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition ${
                          i === highlight ? "bg-ink-50" : "hover:bg-ink-50/60"
                        }`}
                      >
                        <div className="w-11 h-11 shrink-0 rounded-lg bg-ink-50 border border-ink-100 p-1 flex items-center justify-center overflow-hidden">
                          <img src={p.image} alt="" className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-ink-900 truncate">{p.title}</div>
                          <div className="text-xs text-ink-500">
                            {formatCategory(p.category)} · ${Number(p.price).toFixed(2)}
                          </div>
                        </div>
                        {i === highlight && <CornerDownLeft className="w-3.5 h-3.5 text-ink-400" />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => goToResults(query)}
                className="w-full border-t border-ink-100 px-4 py-2.5 text-xs font-semibold text-ink-700 hover:bg-ink-50 flex items-center justify-between"
              >
                <span>See all results for "{query}"</span>
                <span className="text-ink-400">↵</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchDropdown;
