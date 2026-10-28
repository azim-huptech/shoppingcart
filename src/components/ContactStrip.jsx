import React from "react";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";

function ContactStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Questions? We're happy to help.
            </h3>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Chat with our team about products, orders, or returns — we usually reply within a few hours.
            </p>
          </div>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition"
        >
          Get in touch
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

export default ContactStrip;
