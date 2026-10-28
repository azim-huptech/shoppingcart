import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { Check, ShoppingBag, MapPin, CreditCard, Smartphone, Wallet } from "lucide-react";

function paymentLine(payment) {
  if (!payment) return "—";
  if (payment.method === "card") return `Card · •••• ${payment.cardLast4}`;
  if (payment.method === "upi") return `UPI · ${payment.upiId}`;
  if (payment.method === "cod") return `Cash on delivery (+ $${(payment.codFee || 0).toFixed(2)} fee)`;
  return "—";
}

function PaymentIcon({ method }) {
  if (method === "card") return <CreditCard className="w-4 h-4 text-accent-500 shrink-0" />;
  if (method === "upi") return <Smartphone className="w-4 h-4 text-accent-500 shrink-0" />;
  if (method === "cod") return <Wallet className="w-4 h-4 text-accent-500 shrink-0" />;
  return null;
}

function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) return <Navigate to="/" replace />;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-ink-50 rounded-[48px] rounded-tr-[120px] border border-ink-200 p-8 sm:p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8" />
        </div>
        <h1 className="font-display text-3xl text-ink-900">Thank you for your order!</h1>
        <p className="text-ink-500 text-sm mt-2">
          Order <span className="font-medium text-ink-700">{order.id}</span> has been placed.
          A confirmation has been sent to{" "}
          <span className="font-medium text-ink-700">{order.shipping.email}</span>.
        </p>

        <div className="mt-8 text-left bg-ink-100 border border-ink-200 rounded-3xl p-5 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-accent-500 mt-1 shrink-0" />
            <div className="text-sm">
              <div className="font-medium text-ink-900">Shipping to</div>
              <div className="text-ink-600">
                {order.shipping.fullName}<br />
                {order.shipping.address}, {order.shipping.city}<br />
                {order.shipping.state} {order.shipping.zip}, {order.shipping.country}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-4 border-t border-ink-200">
            <PaymentIcon method={order.payment?.method} />
            <div className="text-sm">
              <div className="font-medium text-ink-900">Payment</div>
              <div className="text-ink-600">{paymentLine(order.payment)}</div>
            </div>
          </div>

          <div className="pt-4 border-t border-ink-200">
            <div className="font-medium text-ink-900 text-sm mb-2">Items</div>
            <ul className="space-y-2 text-sm">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between text-ink-600">
                  <span className="truncate pr-2">{item.title} × {item.quantity}</span>
                  <span className="font-medium text-ink-900 whitespace-nowrap">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-ink-200 flex justify-between font-display text-xl text-ink-900">
            <span>Total paid</span>
            <span>${order.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-ink-900 hover:bg-ink-700 text-ink-50 font-medium rounded-full text-sm transition"
        >
          <ShoppingBag className="w-4 h-4" />
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;
