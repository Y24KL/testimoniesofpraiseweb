import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { useSmoothScroll } from '../../context/SmoothScroll';

export default function Footer() {
  const { scrollTo } = useSmoothScroll();

  return (
    <footer className="relative bg-gradient-to-b from-black via-brand-obsidian to-black border-t border-brand-accent/15 pt-16 pb-12 overflow-hidden text-white/80">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-48 bg-brand-primary/25 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="md:col-span-2 flex flex-col items-start gap-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/Testimonies of Praise.png"
                alt="Testimonies of Praise"
                className="h-12 w-auto object-contain"
              />
              <div>
                <h3 className="font-cinzel text-base font-bold tracking-[0.2em] text-brand-accent uppercase">
                  Testimonies of Praise
                </h3>
                <p className="text-xs text-white/50 tracking-wider">
                  POWERED BY MEDIABLAST NETWORK
                </p>
              </div>
            </Link>
            <p className="text-sm text-white/70 max-w-md leading-relaxed mt-2">
              Spreading the Gospel through Personal Triumphs. Unfiltered miraculous encounters, supernatural breakthroughs, and testimonies of God's transformative love across every nation.
            </p>
            <div className="flex items-center gap-3 mt-3">
              <a
                href="https://kingschat.online/user/testimonies.lmm"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/5 border border-brand-accent/20 hover:border-brand-accent hover:bg-brand-accent/10 transition-all group"
                title="Follow on Kingschat"
              >
                <img src="/images/Kc.png" alt="Kingschat" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://x.com/testimonies_lmm"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/5 border border-brand-accent/20 hover:border-brand-accent hover:bg-brand-accent/10 transition-all group"
                title="Follow on X"
              >
                <img src="/images/X logo.png" alt="X (Twitter)" className="w-5 h-5 object-contain group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="flex flex-col gap-3">
            <h4 className="font-cinzel text-xs font-bold tracking-[0.2em] text-brand-accent uppercase mb-2">
              Platform
            </h4>
            <Link to="/" className="text-sm text-white/70 hover:text-brand-accent transition-colors">
              Home
            </Link>
            <button
              onClick={() => scrollTo('#testifiers', { offset: -80 })}
              className="text-left text-sm text-white/70 hover:text-brand-accent transition-colors"
            >
              Testifiers &amp; Recaps
            </button>
            <Link to="/live" className="text-sm text-white/70 hover:text-brand-accent transition-colors">
              Live Broadcast
            </Link>
            <button
              onClick={() => scrollTo('#testimonies-form', { offset: -80 })}
              className="text-left text-sm text-white/70 hover:text-brand-accent transition-colors"
            >
              Submit Testimony
            </button>
          </div>

          {/* Col 3: ADOTOPOC & Admin */}
          <div className="flex flex-col gap-3">
            <h4 className="font-cinzel text-xs font-bold tracking-[0.2em] text-brand-accent uppercase mb-2">
              Crusades &amp; Resources
            </h4>
            <Link
              to="/adotopoc"
              className="group flex items-center gap-1.5 text-sm text-amber-300 font-semibold hover:text-brand-accent transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
              <span>ADOTOPOC Media Hub</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <p className="text-xs text-white/50">
              A Day of Testimonies of Praise Outreaches &amp; Crusades Media Center
            </p>

            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
              <a
                href="/admin/"
                className="text-xs text-white/50 hover:text-brand-accent flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-brand-accent/70" />
                <span>Content Manager (CMS)</span>
              </a>
              <a
                href="/admin/analytics.html"
                className="text-xs text-white/50 hover:text-brand-accent flex items-center gap-1.5 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent"></span>
                <span>Admin Analytics &amp; Reports</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© 2026 Testimonies of Praise. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Crafted for God's Glory with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>&amp; Miracles</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
