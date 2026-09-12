import React, { useState, useEffect } from 'react';
import { Radio, Heart, MessageSquare, Sparkles, Share2, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LivePlayer from '../components/live/LivePlayer';
import LiveChat from '../components/live/LiveChat';
import PrayerRequestModal from '../components/live/PrayerRequestModal';
import ViewerTracker from '../components/live/ViewerTracker';
import RevealOnScroll from '../components/animations/RevealOnScroll';

export default function LivePage() {
  const { stream } = useApp();
  const [prayerModalOpen, setPrayerModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleShareLive = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const isLive = Boolean(stream?.status);

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-brand-primary/25 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Live Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {isLive ? (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600/90 text-white font-extrabold text-xs tracking-wider uppercase animate-pulse shadow-lg shadow-red-600/50">
                <Radio className="w-4 h-4" />
                <span>ON AIR NOW</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/70 font-semibold text-xs tracking-wider uppercase border border-white/15">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span>OFFLINE &bull; ARCHIVE MODE</span>
              </div>
            )}

            <ViewerTracker isLive={isLive} />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPrayerModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-brand-accent to-amber-400 text-brand-primary font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Heart className="w-3.5 h-3.5 fill-brand-primary" />
              <span>Send Prayer Request</span>
            </button>

            <button
              onClick={handleShareLive}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-brand-accent text-white/80 hover:text-brand-accent transition-colors"
              title="Share Live Stream"
            >
              {copied ? <Check className="w-4 h-4 text-brand-success" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Main Grid: Player + Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Center: Live Player */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <LivePlayer />

            {/* Stream Info Description */}
            <div className="p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10">
              <h1 className="font-cinzel text-xl sm:text-2xl font-bold text-white uppercase tracking-tight">
                {stream?.heading || "Testimonies of Praise Live Broadcast"}
              </h1>
              <p className="mt-3 text-sm text-white/75 leading-relaxed">
                {stream?.description || "Welcome to the global broadcast of Testimonies of Praise. Stand in faith, declare your miracle, and connect with believers across the nations celebrating the wonder-working power of God."}
              </p>
            </div>
          </div>

          {/* Right: Live Chat */}
          <div className="lg:col-span-1">
            <LiveChat />
          </div>
        </div>
      </div>

      {/* Prayer Request Modal */}
      <PrayerRequestModal
        isOpen={prayerModalOpen}
        onClose={() => setPrayerModalOpen(false)}
      />
    </div>
  );
}
