import React, { useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShieldCheck, CreditCard, MapPin, User, Lock, AlertCircle, ArrowLeft, Smartphone, Wallet } from "lucide-react";
import { clearCart } from "../features/Shopcart/cartSlice";
import { check, record, policies, formatRetry } from "../utils/rateLimit";
import { Honeypot } from "./MathCaptcha";

const addressSchema = {
  fullName: Yup.string().trim().min(2).max(60).required("Full name is required"),
  email: Yup.string().trim().max(160).email("Enter a valid email").required("Email is required"),
  phone: Yup.string().trim().matches(/^[0-9+\-\s()]{7,20}$/, "Enter a valid phone").required("Phone is required"),
  address: Yup.string().trim().min(5).max(200).required("Address is required"),
  city: Yup.string().trim().min(2).max(60).required("City is required"),
  state: Yup.string().trim().min(2).max(60).required("State is required"),
  zip: Yup.string().trim().matches(/^[A-Za-z0-9\- ]{3,12}$/, "Enter a valid ZIP / postal code").required("ZIP is required"),
  country: Yup.string().trim().required("Country is required"),
  paymentMethod: Yup.string().oneOf(["card", "upi", "cod"]).required(),
};

const schema = Yup.object().shape({
  ...addressSchema,
  cardName: Yup.string().when("paymentMethod", {
    is: "card",
    then: (s) => s.trim().min(2).max(60).required("Name on card is required"),
    otherwise: (s) => s.strip(),
  }),
  cardNumber: Yup.string().when("paymentMethod", {
    is: "card",
    then: (s) => s.trim().matches(/^(\d\s?){13,19}$/, "Enter a valid card number").required("Card number is required"),
    otherwise: (s) => s.strip(),
  }),
  cardExpiry: Yup.string().when("paymentMethod", {
    is: "card",
    then: (s) => s.trim().matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format: MM/YY").required("Expiry is required"),
    otherwise: (s) => s.strip(),
  }),
  cardCvv: Yup.string().when("paymentMethod", {
    is: "card",
    then: (s) => s.trim().matches(/^\d{3,4}$/, "3-4 digits").required("CVV is required"),
    otherwise: (s) => s.strip(),
  }),
  upiId: Yup.string().when("paymentMethod", {
    is: "upi",
    then: (s) => s.trim().matches(/^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$/, "Enter a valid UPI ID (e.g. name@bank)").required("UPI ID is required"),
    otherwise: (s) => s.strip(),
  }),
});

const PAYMENT_OPTIONS = [
  { key: "card", label: "Card",            icon: CreditCard, note: "Visa, Mastercard, Rupay" },
  { key: "upi",  label: "UPI",             icon: Smartphone, note: "GPay, PhonePe, Paytm" },
  { key: "cod",  label: "Cash on delivery", icon: Wallet,     note: "Pay when it arrives" },
];

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { items: cartItems, totalPrice } = useSelector((s) => s.cart);
  const [serverError, setServerError] = useState(null);

  const shipping = totalPrice > 60 || totalPrice === 0 ? 0 : 4.99;
  const codFee = 2.0;

  const initialValues = {
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
    paymentMethod: "card",
    cardName: user ? `${user.firstName} ${user.lastName}` : "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    upiId: "",
    website: "",
  };

  const inputClass = (hasError) =>
    `w-full px-3.5 py-2.5 rounded-2xl border text-sm text-ink-900 placeholder:text-ink-400 bg-white focus:outline-none transition ${
      hasError ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-ink-200 focus:border-ink-900 focus:ring-2 focus:ring-ink-100"
    }`;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-3xl text-ink-900">Your bag is empty</h2>
        <p className="text-sm text-ink-500 mt-2">Add some pieces before checking out.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-ink-900 text-ink-50 rounded-full text-sm font-medium hover:bg-ink-700">
          Browse pieces
        </Link>
      </div>
    );
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError(null);

    if (values.website) {
      setServerError("Request rejected.");
      setSubmitting(false);
      return;
    }

    const limit = check("checkout", policies.checkout);
    if (!limit.allowed) {
      setServerError(`Too many orders from this browser. Try again in ${formatRetry(limit.retryIn)}.`);
      setSubmitting(false);
      return;
    }

    try {
      await new Promise((res) => setTimeout(res, 900));
      const method = values.paymentMethod;
      const grandTotal = Math.round((totalPrice + shipping + (method === "cod" ? codFee : 0)) * 100) / 100;
      const orderId = `ORD-${Date.now()}`;
      const payment = method === "card"
        ? { method: "card", cardName: values.cardName, cardLast4: values.cardNumber.replace(/\s/g, "").slice(-4) }
        : method === "upi"
          ? { method: "upi", upiId: values.upiId }
          : { method: "cod", codFee };
      const order = {
        id: orderId,
        userId: user?.id,
        items: cartItems,
        shipping: {
          fullName: values.fullName, email: values.email, phone: values.phone,
          address: values.address, city: values.city, state: values.state, zip: values.zip, country: values.country,
        },
        payment,
        totalPrice,
        shippingCost: shipping,
        codFee: method === "cod" ? codFee : 0,
        grandTotal,
        placedAt: new Date().toISOString(),
      };
      const key = `orders_${user?.id || "guest"}`;
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      existing.push(order);
      localStorage.setItem(key, JSON.stringify(existing));
      record("checkout", policies.checkout);
      dispatch(clearCart());
      navigate("/order-success", { state: { order }, replace: true });
    } catch {
      setServerError("Something went wrong processing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate("/cart")}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to bag
      </button>

      <h1 className="font-display text-4xl sm:text-5xl text-ink-900 leading-[1.05]">
        Checkout
      </h1>
      <p className="text-sm text-ink-500 mt-2">Review and complete your order.</p>

      {serverError && (
        <div className="mt-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit}>
        {({ isSubmitting, errors, touched, values, setFieldValue }) => {
          const grandTotal = useMemo(
            () => Math.round((totalPrice + shipping + (values.paymentMethod === "cod" ? codFee : 0)) * 100) / 100,
            [values.paymentMethod]
          );
          return (
            <Form className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <Honeypot name="website" />

              <div className="lg:col-span-8 space-y-6">
                {/* Contact */}
                <section className="bg-ink-50 border border-ink-200 rounded-[32px] rounded-tr-[80px] p-6 sm:p-8">
                  <div className="flex items-center gap-2.5 mb-5">
                    <User className="w-5 h-5 text-accent-500" />
                    <h2 className="font-display text-xl text-ink-900">Contact details</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">Full name</label>
                      <Field name="fullName" maxLength={60} className={inputClass(errors.fullName && touched.fullName)} />
                      <ErrorMessage name="fullName" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">Email</label>
                      <Field name="email" type="email" maxLength={160} className={inputClass(errors.email && touched.email)} />
                      <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">Phone</label>
                      <Field name="phone" maxLength={20} className={inputClass(errors.phone && touched.phone)} />
                      <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                </section>

                {/* Shipping */}
                <section className="bg-ink-50 border border-ink-200 rounded-[32px] p-6 sm:p-8">
                  <div className="flex items-center gap-2.5 mb-5">
                    <MapPin className="w-5 h-5 text-accent-500" />
                    <h2 className="font-display text-xl text-ink-900">Shipping address</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">Street address</label>
                      <Field name="address" maxLength={200} className={inputClass(errors.address && touched.address)} />
                      <ErrorMessage name="address" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">City</label>
                      <Field name="city" maxLength={60} className={inputClass(errors.city && touched.city)} />
                      <ErrorMessage name="city" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">State</label>
                      <Field name="state" maxLength={60} className={inputClass(errors.state && touched.state)} />
                      <ErrorMessage name="state" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">ZIP</label>
                      <Field name="zip" maxLength={12} className={inputClass(errors.zip && touched.zip)} />
                      <ErrorMessage name="zip" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">Country</label>
                      <Field as="select" name="country" className={inputClass(errors.country && touched.country)}>
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Other">Other</option>
                      </Field>
                      <ErrorMessage name="country" component="div" className="text-red-500 text-xs mt-1" />
                    </div>
                  </div>
                </section>

                {/* Payment */}
                <section className="bg-ink-50 border border-ink-200 rounded-[32px] rounded-bl-[80px] p-6 sm:p-8">
                  <div className="flex items-center gap-2.5 mb-5">
                    <CreditCard className="w-5 h-5 text-accent-500" />
                    <h2 className="font-display text-xl text-ink-900">Payment</h2>
                    <span className="ml-auto flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" /> Secure
                    </span>
                  </div>

                  {/* Payment method picker */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {PAYMENT_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const selected = values.paymentMethod === opt.key;
                      return (
                        <button
                          type="button"
                          key={opt.key}
                          onClick={() => setFieldValue("paymentMethod", opt.key)}
                          className={`text-left p-4 rounded-2xl border transition ${
                            selected
                              ? "border-ink-900 bg-ink-900 text-ink-50"
                              : "border-ink-200 bg-white hover:border-ink-400 text-ink-900"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            <span className="font-medium text-sm">{opt.label}</span>
                          </div>
                          <div className={`text-[11px] mt-1 ${selected ? "text-ink-300" : "text-ink-500"}`}>
                            {opt.note}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {values.paymentMethod === "card" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">Name on card</label>
                        <Field name="cardName" maxLength={60} className={inputClass(errors.cardName && touched.cardName)} />
                        <ErrorMessage name="cardName" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">Card number</label>
                        <Field name="cardNumber" placeholder="4242 4242 4242 4242" maxLength={23} className={inputClass(errors.cardNumber && touched.cardNumber)} />
                        <ErrorMessage name="cardNumber" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">Expiry (MM/YY)</label>
                        <Field name="cardExpiry" placeholder="12/28" maxLength={5} className={inputClass(errors.cardExpiry && touched.cardExpiry)} />
                        <ErrorMessage name="cardExpiry" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">CVV</label>
                        <Field name="cardCvv" type="password" placeholder="123" maxLength={4} className={inputClass(errors.cardCvv && touched.cardCvv)} />
                        <ErrorMessage name="cardCvv" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                      <p className="sm:col-span-2 text-xs text-ink-400">
                        Demo app — no real payment is taken. Only the last 4 digits are stored.
                      </p>
                    </div>
                  )}

                  {values.paymentMethod === "upi" && (
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-5 items-center">
                      <div className="sm:col-span-3">
                        <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wider mb-1.5">UPI ID</label>
                        <Field name="upiId" placeholder="yourname@okaxis" maxLength={60} className={inputClass(errors.upiId && touched.upiId)} />
                        <ErrorMessage name="upiId" component="div" className="text-red-500 text-xs mt-1" />
                        <p className="text-[11px] text-ink-400 mt-2">
                          You'll be prompted to approve the payment in your UPI app.
                        </p>
                        {values.upiId && !errors.upiId && (
                          <a
                            href={`upi://pay?pa=${encodeURIComponent("merchant@okaxis")}&pn=${encodeURIComponent("Objet Atelier")}&am=${grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent("Order payment")}`}
                            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent-600 underline"
                          >
                            Open UPI app on mobile →
                          </a>
                        )}
                      </div>
                      <div className="sm:col-span-2 flex items-center justify-center">
                        <div className="w-32 h-32 bg-white border border-ink-200 rounded-2xl p-3 flex items-center justify-center">
                          {/* Decorative QR-ish grid; real QR would be generated server-side */}
                          <div className="w-full h-full grid grid-cols-10 grid-rows-10 gap-[2px]">
                            {Array.from({ length: 100 }).map((_, i) => {
                              const corner = (i < 30 && (i % 10) < 3) || (i < 30 && (i % 10) > 6) || (i > 69 && (i % 10) < 3);
                              const dark = corner || (i * 7 + 3) % 5 < 2;
                              return <div key={i} className={dark ? "bg-ink-900" : "bg-ink-50"} />;
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {values.paymentMethod === "cod" && (
                    <div className="rounded-2xl bg-ink-100 border border-ink-200 p-5 text-sm text-ink-700">
                      <p>
                        Pay in cash when your order is delivered. A small <span className="font-medium">${codFee.toFixed(2)}</span> COD handling fee applies.
                      </p>
                      <p className="text-xs text-ink-500 mt-2">
                        Available for addresses in India. Our courier will call before delivery.
                      </p>
                    </div>
                  )}
                </section>
              </div>

              {/* Summary */}
              <aside className="lg:col-span-4">
                <div className="bg-ink-50 border border-ink-200 rounded-[32px] p-6 sticky top-28 space-y-5">
                  <h2 className="font-display text-2xl text-ink-900">Order summary</h2>
                  <ul className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-14 shrink-0 bg-white rounded-arch border border-ink-200 p-1 flex items-center justify-center overflow-hidden">
                          <img src={item.image} alt={item.title} className="max-h-full max-w-full object-cover rounded-arch" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium text-ink-900 truncate" title={item.title}>{item.title}</div>
                          <div className="text-xs text-ink-500">Qty {item.quantity}</div>
                        </div>
                        <div className="text-xs font-medium text-ink-900">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-ink-200 space-y-2 text-sm">
                    <div className="flex justify-between text-ink-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-ink-900">${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-ink-600">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? <span className="text-emerald-700 font-medium">Free</span> : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {values.paymentMethod === "cod" && (
                      <div className="flex justify-between text-ink-600">
                        <span>COD fee</span>
                        <span>${codFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-ink-100 flex justify-between font-display text-xl text-ink-900">
                      <span>Total</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 bg-ink-900 hover:bg-ink-700 disabled:   text-ink-50 font-medium rounded-full text-sm transition flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Processing..." : (<><ShieldCheck className="w-4 h-4" /> Place order · ${grandTotal.toFixed(2)}</>)}
                  </button>
                  <p className="text-[11px] text-ink-400 text-center">
                    Your details are stored locally in this browser.
                  </p>
                </div>
              </aside>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default Checkout;
