import React from 'react';
import { Calendar, Sparkles, Flame, ShieldAlert, ArrowDown } from 'lucide-react';
import AnimatedText from '../animations/AnimatedText';

export default function AdotopocHero({ onExploreClick }) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-black text-center">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-brand-primary/25 to-black" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[500px] bg-brand-primary/30 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[250px] bg-brand-accent/15 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Media Hub Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-accent/15 border border-brand-accent/40 text-brand-accent text-xs font-bold uppercase tracking-[0.25em] mb-6 shadow-xl shadow-brand-accent/20">
          <Sparkles className="w-4 h-4 text-brand-accent" />
          <span>Official Media Resource Hub</span>
        </div>

        {/* Acronym with dramatic typography */}
        <h1 className="font-cinzel text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-widest text-white uppercase leading-none drop-shadow-2xl">
          ADOTO<span className="text-gold-gradient">POC</span>
        </h1>

        {/* Full Meaning */}
        <p className="mt-4 font-cinzel text-sm sm:text-lg md:text-xl font-bold tracking-[0.2em] text-amber-200 uppercase max-w-3xl leading-snug">
          A Day of Testimonies of Praise Outreaches &amp; Crusades
        </p>

        {/* Supporting description */}
        <p className="mt-6 text-sm sm:text-base text-white/80 max-w-2xl font-normal leading-relaxed">
          The official media archive and resource center. Access official crusade videos, promotional graphics, shareable e-cards, and outreach documentation from A Day of Testimonies of Praise Outreaches and Crusades.
        </p>

        {/* Quick event highlights / CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExploreClick}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-accent via-amber-400 to-amber-500 text-brand-primary font-bold text-xs sm:text-sm tracking-[0.15em] uppercase shadow-2xl shadow-brand-accent/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
          >
            <span>Explore Media Hub</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
