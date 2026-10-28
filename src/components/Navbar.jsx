import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, LogOut, Menu, X, LogIn, UserPlus, LayoutGrid } from "lucide-react";
import { logout } from "../features/auth/authSlice";
import { switchCartOwner } from "../features/Shopcart/cartSlice";
import { LogoMark, LogoWordmark } from "./Logo";
import SearchDropdown from "./SearchDropdown";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const totalQuantity = useSelector((s) => s.cart.totalQuantity || 0);
  const user = useSelector((s) => s.auth.user);

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(switchCartOwner({ userId: null, mergeGuest: false }));
    setUserMenuOpen(false);
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-1 py-1 text-sm font-medium tracking-tight transition whitespace-nowrap ${
      isActive
        ? "text-ink-900 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-px after:bg-ink-900"
        : "text-ink-500 hover:text-ink-900"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-ink-50 border-b border-ink-200 shadow-sm shadow-ink-900/5">
      {/* Announcement bar */}
      <div className="bg-ink-900 text-ink-50 text-[11px] tracking-widest uppercase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-center gap-6 overflow-hidden">
          <span className="font-medium">Complimentary shipping over ₹5,000</span>
          <span className="hidden sm:inline text-ink-400">·</span>
          <span className="hidden sm:inline">New arrivals · Fall '26</span>
          <span className="hidden md:inline text-ink-400">·</span>
          <span className="hidden md:inline">Code <span className="text-accent-200 font-semibold">OBJET30</span></span>
        </div>
      </div>

      {/* Single-row main bar — everything inline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3 lg:gap-5">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <LogoMark className="w-9 h-9" />
          <div className="hidden sm:flex flex-col leading-none">
            <LogoWordmark className="text-lg" />
            <span className="text-[9px] font-sans text-ink-400 tracking-[0.2em] uppercase mt-1">
              Curated goods
            </span>
          </div>
        </Link>

        {/* Nav (desktop) */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 shrink-0 ml-3">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
          <NavLink to="/about" className={navLinkClass}>Journal</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
        </nav>

        {/* Search — flexes to fill the middle */}
        <div className="hidden md:block flex-1 min-w-0 max-w-md mx-auto">
          <SearchDropdown />
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-1.5 shrink-0 ml-auto md:ml-0">
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full text-sm font-medium text-ink-700 hover:bg-ink-100 transition whitespace-nowrap"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <span className="w-8 h-8 rounded-full bg-ink-900 text-ink-50 flex items-center justify-center text-xs font-bold">
                  {user.firstName?.[0]?.toUpperCase()}
                </span>
                <span className="hidden xl:inline">{user.firstName}</span>
              </button>
              {userMenuOpen && (
                <div role="menu" className="absolute right-0 mt-2 w-60 bg-white border border-ink-200 rounded-2xl shadow-xl p-2 z-50">
                  <div className="px-3 py-2.5 border-b border-ink-100 mb-1">
                    <div className="text-[10px] uppercase tracking-widest text-ink-400">Signed in as</div>
                    <div className="text-sm font-semibold text-ink-900 truncate">{user.email}</div>
                  </div>
                  <Link to="/cart" className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-ink-700 hover:bg-ink-100">
                    <ShoppingCart className="w-4 h-4 text-ink-400" /> My cart
                  </Link>
                  <Link to="/shop" className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-ink-700 hover:bg-ink-100">
                    <LayoutGrid className="w-4 h-4 text-ink-400" /> Keep shopping
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1">
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium text-ink-700 hover:bg-ink-100 transition whitespace-nowrap"
                aria-label="Login"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden xl:inline">Login</span>
              </Link>
              <Link
                to="/signup"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-ink-900 text-ink-50 hover:bg-ink-700 transition whitespace-nowrap"
                aria-label="Sign up"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden xl:inline">Sign up</span>
              </Link>
            </div>
          )}

          <Link
            to="/cart"
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-ink-100 text-ink-900 hover:bg-ink-200 transition whitespace-nowrap"
            aria-label="Open cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden xl:inline">Bag</span>
            {totalQuantity > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-semibold rounded-full bg-ink-900 text-ink-50">
                {totalQuantity}
              </span>
            )}
          </Link>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden p-2 rounded-full hover:bg-ink-100"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown (hamburger) */}
      {menuOpen && (
        <div className="lg:hidden border-t border-ink-200 bg-ink-50">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
            <div className="md:hidden">
              <SearchDropdown />
            </div>
            <nav className="flex flex-col gap-1">
              <NavLink to="/" end className="px-3 py-2 rounded-lg text-ink-800 hover:bg-ink-100">Home</NavLink>
              <NavLink to="/shop" className="px-3 py-2 rounded-lg text-ink-800 hover:bg-ink-100">Shop</NavLink>
              <NavLink to="/about" className="px-3 py-2 rounded-lg text-ink-800 hover:bg-ink-100">Journal</NavLink>
              <NavLink to="/contact" className="px-3 py-2 rounded-lg text-ink-800 hover:bg-ink-100">Contact</NavLink>
              {!user && (
                <>
                  <NavLink to="/login" className="px-3 py-2 rounded-lg text-ink-800 hover:bg-ink-100">Login</NavLink>
                  <NavLink to="/signup" className="px-3 py-2 rounded-lg text-ink-800 hover:bg-ink-100">Sign up</NavLink>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Small-screen search strip (shown only when hamburger closed, below md) */}
      {!menuOpen && (
        <div className="md:hidden border-t border-ink-100 bg-ink-50 px-4 py-2">
          <SearchDropdown />
        </div>
      )}
    </header>
  );
}

export default Navbar;
