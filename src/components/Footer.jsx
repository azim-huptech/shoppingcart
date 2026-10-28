import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone} from "lucide-react";
import { LogoMark, LogoWordmark } from "./Logo";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink-900 text-ink-300 mt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-3">
            <LogoMark className="w-11 h-11" />
            <div className="flex flex-col leading-none">
              <LogoWordmark className="text-xl text-ink-50" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-ink-400 mt-1.5">
                Patiently made
              </span>
            </div>
          </div>
          <p className="text-sm text-ink-400 mt-5 leading-relaxed max-w-sm">
            Objet is a small atelier of apparel, accessories and objects for everyday use —
            sourced one by one, built to be kept.
          </p>
          <div className="flex items-center gap-2.5 mt-6">
            {[Mail, Mail, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 rounded-full bg-ink-800 hover:bg-ink-700 flex items-center justify-center transition"
                aria-label="Social link"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold text-ink-50 uppercase tracking-[0.25em] mb-5">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/shop" className="hover:text-ink-50 transition">All pieces</Link></li>
            <li><Link to="/shop?category=womens-dresses" className="hover:text-ink-50 transition">Dresses</Link></li>
            <li><Link to="/shop?category=mens-shirts" className="hover:text-ink-50 transition">Shirting</Link></li>
            <li><Link to="/shop?category=fragrances" className="hover:text-ink-50 transition">Fragrances</Link></li>
            <li><Link to="/shop?category=womens-jewellery" className="hover:text-ink-50 transition">Jewellery</Link></li>
            <li><Link to="/shop?category=home-decoration" className="hover:text-ink-50 transition">Home</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold text-ink-50 uppercase tracking-[0.25em] mb-5">Atelier</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-ink-50 transition">Our story</Link></li>
            <li><a href="#" className="hover:text-ink-50 transition">Makers</a></li>
            <li><a href="#" className="hover:text-ink-50 transition">Sustainability</a></li>
            <li><a href="#" className="hover:text-ink-50 transition">Press</a></li>
            <li><Link to="/contact" className="hover:text-ink-50 transition">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[11px] font-semibold text-ink-50 uppercase tracking-[0.25em] mb-5">Service</h4>
          <ul className="space-y-3 text-sm text-ink-400">
            <li className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 mt-0.5 text-accent-300 shrink-0" />
              <span>hello@objet.studio</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 mt-0.5 text-accent-300 shrink-0" />
              <span>+91 00000 00000</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 mt-0.5 text-accent-300 shrink-0" />
              <span>Ahmedabad, Gujarat</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-widest text-ink-500">
          <p>© {year} Objet Atelier. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-ink-200 transition">Terms</a>
            <a href="#" className="hover:text-ink-200 transition">Privacy</a>
            <a href="#" className="hover:text-ink-200 transition">Shipping</a>
            <a href="#" className="hover:text-ink-200 transition">Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
