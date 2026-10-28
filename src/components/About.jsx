import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, Leaf, Users, ArrowRight } from "lucide-react";

function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide">
          OUR STORY
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Fewer, better things.
        </h1>
        <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
          MiniStore started with a simple idea — in a world full of noise, we'd rather sell a
          handful of thoughtfully chosen products than a sea of forgettable ones.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { Icon: Sparkles, title: "Curated edit", text: "Every product is handpicked by our team." },
          { Icon: ShieldCheck, title: "Honest quality", text: "No hype, just things that last." },
          { Icon: Leaf, title: "Thoughtfully sourced", text: "Partners who share our values." },
          { Icon: Users, title: "Customer first", text: "Real humans, fast replies, easy returns." },
        ].map(({ Icon, title, text }) => (
          <div key={title} className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="mt-4 font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-3xl bg-slate-900 text-white p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Ready to browse?</h3>
          <p className="text-slate-300 text-sm mt-1">Jump into the catalog and find your next favorite.</p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition"
        >
          Shop now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default About;
