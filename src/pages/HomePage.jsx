import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Calendar } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import VideoCarousel from '../components/home/VideoCarousel';
import TestimonyForm from '../components/home/TestimonyForm';
import RevealOnScroll from '../components/animations/RevealOnScroll';

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* 1. Cinematic Hero */}
      <HeroSection />

      {/* 2. ADOTOPOC 2026 Spotlight Banner */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-brand-primary-dark via-brand-surface to-black border-y border-brand-accent/20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(245,197,24,0.12),_transparent_70%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex flex-col items-start gap-2 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/20 border border-brand-accent/40 text-brand-accent text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Media Resource Hub</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
              ADOTOPOC <span className="text-gold-gradient">Media Resource Hub</span>
            </h2>
            <p className="text-sm text-white/75 leading-relaxed">
              A Day of Testimonies of Praise Outreaches and Crusades. Download official crusade flyers, promotional anthem videos, social e-cards, and evangelism toolkits.
            </p>
          </div>

          <Link
            to="/adotopoc"
            className="flex-shrink-0 inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-gradient-to-r from-brand-accent via-amber-400 to-amber-500 text-brand-primary font-bold text-xs uppercase tracking-widest shadow-xl shadow-brand-accent/20 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Access Media Hub</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. Testifiers & Recaps Reel */}
      <VideoCarousel />

      {/* 4. Send In Your Testimony Form */}
      <TestimonyForm />
    </div>
  );
}
