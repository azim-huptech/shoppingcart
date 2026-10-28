import React, { useState } from "react";
import { Mail, Check } from "lucide-react";
import { check, record, policies, formatRetry } from "../utils/rateLimit";

function Newsletter() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (website) {
      // Honeypot tripped — pretend success to confuse bots.
      setSubscribed(true);
      return;
    }
    const limit = check("newsletter", policies.newsletter);
    if (!limit.allowed) {
      setError(`Too many signups from this browser. Try again in ${formatRetry(limit.retryIn)}.`);
      return;
    }
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || trimmed.length > 160) {
      setError("Please enter a valid email.");
      return;
    }
    try {
      const list = JSON.parse(localStorage.getItem("newsletter_signups") || "[]");
      if (!list.includes(trimmed)) list.push(trimmed);
      localStorage.setItem("newsletter_signups", JSON.stringify(list));
    } catch { /* ignore */ }
    record("newsletter", policies.newsletter);
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 6000);
  };

  return (
    <section className="bg-ink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="relative overflow-hidden bg-ink-900 text-ink-50 p-8 sm:p-14 lg:p-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-[48px] rounded-tr-[180px]">
          <div className="absolute inset-y-0 right-0 w-1/2 opacity-30 pointer-events-none hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=1200&q=80"
              alt=""
              className="w-full h-full object-cover img-fade"
            />
          </div>

          <div className="relative">
            <div className="text-[11px] uppercase tracking-[0.3em] text-ink-400 mb-4 flex items-center gap-3">
              <span className="w-6 h-px   " /> The post
            </div>
            <h2 className="font-display text-4xl sm:text-5xl leading-[1.05]">
              A letter, once a month. <span className="italic text-accent-300">Nothing else.</span>
            </h2>
            <p className="mt-5 text-ink-300 text-base max-w-md">
              New drops, maker notes, and the odd field diary. No sales emails, no tracking pixels — we promise.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative w-full max-w-md justify-self-end">
            <div aria-hidden="true" className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden">
              <label htmlFor="nl-website">Leave this field empty</label>
              <input id="nl-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 bg-ink-50 rounded-full p-1.5 shadow-xl shadow-black/20">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-ink-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@address.com"
                  aria-label="Email address"
                  maxLength={160}
                  className="w-full pl-10 pr-3 py-3 bg-transparent text-ink-900 placeholder:text-ink-400 text-sm rounded-full focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-ink-900 text-ink-50 text-sm font-medium hover:bg-ink-700 transition"
              >
                Subscribe
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
            {subscribed && (
              <p className="mt-3 flex items-center gap-2 text-sm text-accent-200">
                <Check className="w-4 h-4" /> Welcome. Your first letter is on its way.
              </p>
            )}
            <p className="mt-3 text-[11px] text-ink-400">
              We'll never share your email. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;
