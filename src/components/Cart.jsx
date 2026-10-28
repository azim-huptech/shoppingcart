import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  updateTempQuantity,
  applyTempUpdate,
  clearCart,
  clearStockWarning,
} from "../features/Shopcart/cartSlice";
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Check, ShieldCheck, Truck, RotateCcw, AlertTriangle,
} from "lucide-react";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { items: cartItems, tempItems, totalPrice, stockWarning } = useSelector((s) => s.cart);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    if (!stockWarning) return;
    const t = setTimeout(() => dispatch(clearStockWarning()), 3500);
    return () => clearTimeout(t);
  }, [stockWarning, dispatch]);

  const handleCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === "SAVE10") { setDiscount(0.1); setCouponError(""); }
    else if (code === "OBJET30") { setDiscount(0.3); setCouponError(""); }
    else { setCouponError("Not a valid code."); setDiscount(0); }
  };

  const shippingCost = totalPrice > 60 || totalPrice === 0 ? 0 : 4.99;
  const discountAmount = Math.round(totalPrice * discount * 100) / 100;
  const finalTotal = Math.max(
    0,
    Math.round((totalPrice - discountAmount + (totalPrice > 0 ? shippingCost : 0)) * 100) / 100
  );

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {stockWarning && (
        <div className="mb-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-700" />
          <span>
            Only <span className="font-semibold">{stockWarning.cap}</span> of <span className="italic">{stockWarning.title}</span> available — quantity capped.
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-10 flex-wrap gap-3 border-b border-ink-200 pb-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.3em] text-ink-500 mb-2">The bag</div>
          <h1 className="font-display text-4xl sm:text-5xl text-ink-900 leading-[1.05]">
            Shopping <span className="italic text-accent-500">bag</span>
          </h1>
          <p className="text-sm text-ink-500 mt-3">
            {cartItems.length} {cartItems.length === 1 ? "piece" : "pieces"}
            {user && <> · signed in as <span className="font-medium text-ink-700">{user.email}</span></>}
          </p>
        </div>
        <button
          onClick={() => navigate("/shop")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-700 hover:text-ink-900 bg-ink-50 border border-ink-200 px-4 py-2 rounded-full transition"
        >
          <ArrowLeft className="w-4 h-4" /> Continue shopping
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-ink-50 rounded-[48px] border border-dashed border-ink-200 p-14 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-ink-100 text-ink-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl text-ink-900">Your bag is empty</h3>
          <p className="text-sm text-ink-500 mt-2 mb-6">Nothing picked up yet.</p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-6 py-3 bg-ink-900 hover:bg-ink-700 text-ink-50 font-medium rounded-full text-sm transition"
          >
            Discover pieces
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-ink-50 rounded-3xl border border-ink-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
                <span className="font-medium text-ink-900 text-sm">Bag items</span>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-xs font-medium text-ink-500 hover:text-red-600 transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              </div>

              <ul className="divide-y divide-ink-100">
                {cartItems.map((item) => {
                  const tempItem = tempItems.find((t) => t.id === item.id);
                  const currentTempQty = tempItem ? tempItem.quantity : item.quantity;
                  const hasPendingChange = currentTempQty !== item.quantity;
                  const stock = Number(item.stock) || 99;
                  const atCap = item.quantity >= stock;

                  return (
                    <li key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition hover:bg-ink-100/50">
                      <Link
                        to={`/product/${item.id}`}
                        className="w-20 h-24 shrink-0 bg-ink-50 rounded-arch border border-ink-200 p-2 flex items-center justify-center overflow-hidden"
                      >
                        <img src={item.image} alt={item.title} className="max-h-full max-w-full object-cover rounded-arch" />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-medium uppercase tracking-widest text-accent-600">
                          {(item.category || "").replace(/[-_]+/g, " ")}
                        </span>
                        <Link
                          to={`/product/${item.id}`}
                          className="block font-display italic text-lg text-ink-900 mt-1 line-clamp-2 hover:text-accent-600 transition"
                          title={item.title}
                        >
                          {item.title}
                        </Link>
                        <div className="text-ink-500 text-xs mt-1">
                          ${Number(item.price).toFixed(2)} each
                          {stock <= 10 && <> · <span className="text-amber-700">Only {stock} in stock</span></>}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-ink-200 rounded-full bg-ink-100 overflow-hidden">
                            <button
                              onClick={() => dispatch(decrementQuantity(item.id))}
                              className="p-2 hover:bg-ink-200 text-ink-700 transition"
                              aria-label="Decrease"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={stock}
                              className="w-12 text-center bg-transparent text-sm font-medium text-ink-900 focus:outline-none"
                              value={currentTempQty}
                              onChange={(e) => {
                                const v = parseInt(e.target.value, 10);
                                if (!isNaN(v)) dispatch(updateTempQuantity({ id: item.id, quantity: v }));
                              }}
                              onBlur={() => dispatch(updateQuantity({ id: item.id, quantity: currentTempQty }))}
                            />
                            <button
                              onClick={() => dispatch(incrementQuantity(item.id))}
                              disabled={atCap}
                              className="p-2 hover:bg-ink-200 text-ink-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                              aria-label="Increase"
                              title={atCap ? "Max stock reached" : "Increase"}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {hasPendingChange && (
                            <button
                              onClick={() => dispatch(applyTempUpdate(item.id))}
                              className="text-xs bg-ink-900 hover:bg-ink-700 text-ink-50 font-medium px-3 py-1.5 rounded-full transition"
                            >
                              Update
                            </button>
                          )}

                          <button
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="p-2 text-ink-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                            aria-label="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-sm font-medium text-ink-900">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-ink-50 p-4 rounded-2xl border border-ink-200 text-xs text-ink-700 flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-accent-500 shrink-0" /> Free shipping over $60
              </div>
              <div className="bg-ink-50 p-4 rounded-2xl border border-ink-200 text-xs text-ink-700 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" /> Secure checkout
              </div>
              <div className="bg-ink-50 p-4 rounded-2xl border border-ink-200 text-xs text-ink-700 flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4 text-ink-600 shrink-0" /> 30-day returns
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-ink-50 rounded-[32px] border border-ink-200 p-6 sticky top-28 space-y-6">
              <h2 className="font-display text-2xl text-ink-900">Order summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-ink-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-ink-900">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? <span className="text-emerald-700 font-medium">Free</span> : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Promo ({Math.round(discount * 100)}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-ink-200 pt-3 flex justify-between font-display text-xl text-ink-900">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <form onSubmit={handleCoupon} className="space-y-2">
                <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider">Discount code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="SAVE10 or OBJET30"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    maxLength={32}
                    className="flex-1 px-4 py-2.5 border border-ink-200 rounded-full text-xs uppercase focus:outline-none focus:border-ink-900 transition"
                  />
                  <button type="submit" className="px-4 py-2.5 bg-ink-100 hover:bg-ink-200 text-ink-800 text-xs font-medium rounded-full transition">
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                {discount > 0 && (
                  <p className="text-xs text-emerald-700 flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" /> Promo applied.
                  </p>
                )}
              </form>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 bg-ink-900 hover:bg-ink-700 text-ink-50 font-medium rounded-full text-sm transition flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                {user ? "Proceed to checkout" : "Login & checkout"}
              </button>
              {!user && (
                <p className="text-xs text-ink-500 text-center -mt-2">
                  You'll be asked to sign in before paying.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
