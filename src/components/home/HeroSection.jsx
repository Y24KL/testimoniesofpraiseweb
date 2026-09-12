import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, Radio, ChevronDown, HeartHandshake, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useSmoothScroll } from '../../context/SmoothScroll';
import AnimatedText from '../animations/AnimatedText';

export default function HeroSection() {
  const { settings, stream } = useApp();
  const { scrollTo } = useSmoothScroll();
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const heroVideo = settings?.heroVideo || "https://res.cloudinary.com/duw6xrnpn/video/upload/v1777127537/TESTIMONIES_OF_PRAISE_FINAL_OPENING_MONTAGE_lq5wqk.mp4";
  const heroSubtitle = settings?.heroSubtitle || "Experience high-definition storytelling, unfiltered testimonies, and immersive worship blasted directly to your device.";

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black text-center pt-24 pb-16">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center brightness-75 scale-105"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        {/* Layered cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.85)_100%)]" />
        <div className="absolute inset-0 bg-brand-primary/20 mix-blend-overlay" />
      </div>

      {/* Sound Toggle Floating Button */}
      <button
        onClick={toggleSound}
        className="absolute bottom-10 right-6 sm:right-10 z-20 flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-semibold hover:border-brand-accent transition-all duration-300"
        aria-label={isMuted ? "Unmute background video" : "Mute background video"}
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-brand-accent" /> : <Volume2 className="w-4 h-4 text-brand-accent" />}
        <span className="hidden sm:inline">{isMuted ? "Unmute" : "Mute"}</span>
      </button>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/40 backdrop-blur-md border border-brand-accent/30 text-brand-accent text-xs font-bold tracking-[0.2em] uppercase mb-6 shadow-lg shadow-brand-primary/30">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
          <span>Every Testimony Has A Story</span>
        </div>

        {/* Main Title */}
        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] text-white uppercase drop-shadow-2xl">
          Testimonies of <br />
          <span className="text-gold-gradient inline-block font-extrabold">Praise</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-white/80 max-w-2xl font-normal leading-relaxed">
          {heroSubtitle}
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full max-w-md">
          <Link
            to="/live"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-brand-accent via-amber-400 to-amber-500 text-brand-primary font-bold text-xs sm:text-sm tracking-[0.15em] uppercase shadow-2xl shadow-brand-accent/40 hover:shadow-brand-accent/60 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {stream?.status ? (
              <>
                <Radio className="w-4 h-4 text-red-600 animate-pulse" />
                <span>WATCH LIVE STREAM</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-brand-primary" />
                <span>WATCH BROADCAST</span>
              </>
            )}
          </Link>

          <button
            onClick={() => scrollTo('#testimonies-form', { offset: -80 })}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-black/40 backdrop-blur-md border border-brand-accent/50 text-brand-accent hover:bg-brand-accent/15 font-bold text-xs sm:text-sm tracking-[0.15em] uppercase shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>SHARE YOUR TESTIMONY</span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div
          onClick={() => scrollTo('#testifiers', { offset: -80 })}
          className="mt-16 sm:mt-24 cursor-pointer flex flex-col items-center gap-2 group text-white/50 hover:text-brand-accent transition-colors"
        >
          <span className="text-[10px] uppercase font-bold tracking-[0.3em]">
            Explore Testimonies
          </span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 group-hover:border-brand-accent flex items-start justify-center p-1 transition-colors">
            <div className="w-1.5 h-2.5 bg-brand-accent rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
