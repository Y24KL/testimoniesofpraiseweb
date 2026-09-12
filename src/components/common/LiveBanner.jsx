import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LiveBanner() {
  const { stream } = useApp();

  if (!stream?.status) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 animate-bounce">
      <Link
        to="/live"
        className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-semibold text-xs tracking-wider uppercase shadow-2xl shadow-red-600/50 border border-red-400/40 hover:scale-105 active:scale-95 transition-transform"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <span className="flex items-center gap-1.5">
          <Radio className="w-4 h-4" />
          <span>BROADCASTING LIVE NOW</span>
        </span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
