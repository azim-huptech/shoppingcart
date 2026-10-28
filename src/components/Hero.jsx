import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1920&q=80";

function Hero() {
  return (
    <section className="relative bg-ink-900 text-ink-50 overflow-hidden">
      {/* Full-bleed background */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover opacity-70"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/85 via-ink-900/55 to-ink-900/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/10 to-transparent" />
      </div>

      {/* Content — sized to fit beneath the ~124px header without scrolling */}
      <div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-6 lg:py-8"
        style={{ minHeight: "calc(100vh - 124px)" }}
      >
        {/* Top: editorial meta row */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-[0.25em] text-ink-200 border-b border-ink-50/15 pb-3">
          <span>Issue 07 — Fall / Winter 2026</span>
          <span className="hidden md:inline">A quiet rebellion against noise</span>
          <span className="font-medium text-ink-50">Objet · Atelier</span>
        </div>

        {/* Middle: headline block, vertically centered */}
        <div className="flex-1 flex items-center">
          <div className="max-w-3xl">
            <h1
              className="font-display font-light text-ink-50 tracking-[-0.02em] leading-[0.95]"
              style={{ fontSize: "clamp(2.25rem, 6vw, 5rem)" }}
            >
              <span className="block">
                Fewer <span className="italic font-normal text-accent-200">things,</span>
              </span>
              <span className="block">
                patiently <span className="italic font-normal">chosen</span>.
              </span>
            </h1>

            <p className="mt-5 max-w-lg text-ink-200 text-base leading-relaxed">
              A small atelier for apparel, accessories and objects of everyday use —
              sourced one by one, built to be kept.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink-50 text-ink-900 hover:bg-accent-200 transition text-sm font-medium"
              >
                Browse the collection
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-ink-50/40 text-ink-50 hover:bg-ink-50/10 transition text-sm font-medium"
              >
                Read our story
              </Link>
              <div className="hidden sm:flex items-center gap-2 ml-3 text-xs text-ink-200">
                <span className="w-7 h-7 rounded-full bg-accent-300 text-ink-900 flex items-center justify-center font-display italic text-sm">★</span>
                <span><span className="font-medium text-ink-50">4.9 / 5</span> · 2,041 keepers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: stats strip */}
        <div className="relative border-t border-ink-50/15 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { k: "Est.", v: "2019" },
            { k: "Pieces in stock", v: "100+" },
            { k: "Countries shipped", v: "32" },
            { k: "Returns window", v: "30 days" },
          ].map((s) => (
            <div key={s.k}>
              <div className="text-[9px] uppercase tracking-widest text-ink-300">{s.k}</div>
              <div className="font-display text-xl mt-0.5 text-ink-50">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
