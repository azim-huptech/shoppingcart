import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingBag, ShoppingCart, User, LogOut, Check } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items || []);
  const totalQuantity = useSelector((state) => 
    state.cart.totalQuantity !== undefined 
      ? state.cart.totalQuantity 
      : cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)
  );

  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      try {
        const stored = localStorage.getItem('current_user');
        setUser(stored ? JSON.parse(stored) : null);
      } catch (e) {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    window.addEventListener('authChange', checkUser);

    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('authChange', checkUser);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-slate-800 transition">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
              MINI<span className="text-indigo-600">STORE</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
              Curated Essentials
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              location.pathname === '/'
                ? 'text-slate-900 bg-slate-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Catalog
          </Link>

          {/* User Sign Up / Profile Link */}
          <Link
            to="/signup"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              location.pathname === '/signup'
                ? 'text-slate-900 bg-slate-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">
              {user ? `Hi, ${user.firstName}` : 'Sign Up'}
            </span>
            {user && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5"></span>
            )}
          </Link>

          {/* Cart Button */}
          <Link
            to="/cart"
            className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition ${
              location.pathname === '/cart'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {totalQuantity > 0 && (
              <span
                className={`flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-semibold rounded-full transition-transform ${
                  location.pathname === '/cart'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-slate-900 text-white'
                }`}
              >
                {totalQuantity}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
