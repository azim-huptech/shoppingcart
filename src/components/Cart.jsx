import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { 
  removeFromCart, 
  updateQuantity, 
  incrementQuantity, 
  decrementQuantity,
  updateTempQuantity,
  applyTempUpdate,
  applyAllTempUpdates,
  clearCart
} from "../features/Shopcart/cartSlice";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw 
} from "lucide-react";
import Navbar from "./Navbar";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: cartItems, tempItems, totalPrice } = useSelector((state) => state.cart);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleTempChange = (id, value) => {
    const qty = parseInt(value, 10);
    if (!isNaN(qty)) {
      dispatch(updateTempQuantity({ id, quantity: qty }));
    }
  };

  const handleApplySingleUpdate = (id) => {
    dispatch(applyTempUpdate(id));
  };

  const handleDirectQuantityChange = (id, quantity) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "SAVE10") {
      setDiscount(0.1); // 10% discount
      setCouponError("");
    } else {
      setCouponError("Invalid promo code. Try SAVE10");
      setDiscount(0);
    }
  };

  const shippingCost = totalPrice > 50 || totalPrice === 0 ? 0 : 4.99;
  const discountAmount = Math.round(totalPrice * discount * 100) / 100;
  const finalTotal = Math.max(0, Math.round((totalPrice - discountAmount + (totalPrice > 0 ? shippingCost : 0)) * 100) / 100);

  const handleCheckout = () => {
    setCheckoutComplete(true);
    dispatch(clearCart());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Shopping Cart</h1>
            <p className="text-sm text-slate-500 mt-1">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your bag
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {checkoutComplete ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm animate-fade-in">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Thank you for your order!</h2>
            <p className="text-slate-500 text-sm mt-2">
              Your order has been placed successfully. A confirmation email has been dispatched to your registered address.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setCheckoutComplete(false);
                  navigate("/");
                }}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Your cart is empty</h3>
            <p className="text-sm text-slate-500 mt-1 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition shadow-sm"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-800 text-sm">Cart Items</span>
                  <button
                    onClick={() => dispatch(clearCart())}
                    className="text-xs font-medium text-slate-500 hover:text-red-600 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Cart</span>
                  </button>
                </div>

                <ul className="divide-y divide-slate-100">
                  {cartItems.map((item) => {
                    const tempItem = tempItems.find((t) => t.id === item.id);
                    const currentTempQty = tempItem ? tempItem.quantity : item.quantity;
                    const hasPendingChange = currentTempQty !== item.quantity;

                    return (
                      <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition hover:bg-slate-50/50">
                        {/* Thumbnail */}
                        <div className="w-20 h-20 shrink-0 bg-white rounded-xl border border-slate-200/80 p-2 flex items-center justify-center overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Title & Info */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-medium uppercase tracking-wider text-indigo-600">
                            {item.category}
                          </span>
                          <h3 className="font-semibold text-slate-900 text-sm truncate mt-0.5" title={item.title}>
                            {item.title}
                          </h3>
                          <div className="text-slate-500 text-xs mt-1">
                            ${Number(item.price).toFixed(2)} each
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden shadow-inner">
                              <button
                                onClick={() => dispatch(decrementQuantity(item.id))}
                                className="p-1.5 hover:bg-slate-200 text-slate-600 transition"
                                title="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <input
                                type="number"
                                min="1"
                                className="w-12 text-center bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
                                value={currentTempQty}
                                onChange={(e) => handleTempChange(item.id, e.target.value)}
                                onBlur={() => handleDirectQuantityChange(item.id, currentTempQty)}
                              />
                              <button
                                onClick={() => dispatch(incrementQuantity(item.id))}
                                className="p-1.5 hover:bg-slate-200 text-slate-600 transition"
                                title="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Optional explicit update button when temp quantity differs */}
                            {hasPendingChange && (
                              <button
                                onClick={() => handleApplySingleUpdate(item.id)}
                                className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-2.5 py-1.5 rounded-lg transition border border-indigo-200"
                              >
                                Update
                              </button>
                            )}

                            {/* Remove button */}
                            <button
                              onClick={() => handleRemove(item.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Line item subtotal */}
                          <div className="text-sm font-bold text-slate-900">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Shopping Assurance Perks */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Encrypted 256-bit secure checkout</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>30-day hassle-free returns</span>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-24 space-y-6">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Order Summary</h2>

                {/* Subtotals */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-900">${totalPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-emerald-600 font-medium">Free</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Promo Discount (10%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-3 flex justify-between text-base font-bold text-slate-900">
                    <span>Total</span>
                    <span className="text-lg">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Promo Code Form */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Discount Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. SAVE10"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs uppercase focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                  {discount > 0 && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                      <Check className="w-3.5 h-3.5" /> Coupon SAVE10 applied!
                    </p>
                  )}
                </form>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Proceed to Checkout</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;
