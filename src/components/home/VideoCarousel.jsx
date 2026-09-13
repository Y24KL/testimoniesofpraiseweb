import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Share2, Check, Play, Film, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { trackVideoView } from '../../services/supabase';
import { slugify } from '../../utils/slugify';
import TiltCard from '../animations/TiltCard';
import RevealOnScroll from '../animations/RevealOnScroll';

export default function VideoCarousel() {
  const { videos } = useApp();
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [activeHashSlug, setActiveHashSlug] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    // Check if opened with a hash like #testimony-of-bro-blessed
    const hash = window.location.hash.replace('#', '');
    if (hash && videos.length > 0) {
      const matched = videos.find(v => slugify(v.title) === hash);
      if (matched) {
        setActiveHashSlug(hash);
        const cardEl = document.getElementById(`video-${hash}`);
        if (cardEl) {
          setTimeout(() => {
            cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 600);
        }
      }
    }
  }, [videos]);

  const handleShare = async (video) => {
    const slug = slugify(video.title);
    const shareUrl = `${window.location.origin}/#${slug}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }

    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const scrollBy = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="testifiers" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-brand-primary/20 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <RevealOnScroll className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-brand-accent mb-3">
            <Film className="w-4 h-4 text-brand-accent" />
            Unfiltered Testimonies
          </span>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
            Testifiers &amp; <span className="text-gold-gradient">Recaps</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed">
            Real stories. Divine encounters. Miraculous triumphs. Listen to faith-filled testimonies from our global congregations.
          </p>
        </RevealOnScroll>

        {/* Carousel Controls */}
        <div className="flex justify-end items-center gap-2 mb-4">
          <button
            onClick={() => scrollBy('left')}
            className="p-3 rounded-full bg-white/5 hover:bg-brand-accent/20 border border-white/10 hover:border-brand-accent/40 text-white hover:text-brand-accent transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollBy('right')}
            className="p-3 rounded-full bg-white/5 hover:bg-brand-accent/20 border border-white/10 hover:border-brand-accent/40 text-white hover:text-brand-accent transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Video Reel Container */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video, index) => {
            const slug = slugify(video.title || `video-${index + 1}`);
            const isHighlighted = activeHashSlug === slug;
            const isCopied = copiedSlug === slug;

            return (
              <div
                key={slug}
                id={`video-${slug}`}
                className="flex-shrink-0 w-[300px] sm:w-[380px] md:w-[420px] snap-center"
              >
                <TiltCard maxTilt={6} className="h-full">
                  <div
                    className={`h-full rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border backdrop-blur-xl p-4 flex flex-col justify-between transition-all duration-500 group ${
                      isHighlighted
                        ? 'border-brand-accent shadow-[0_0_35px_rgba(245,197,24,0.5)] ring-2 ring-brand-accent'
                        : 'border-white/10 hover:border-brand-accent/40 hover:shadow-2xl hover:shadow-brand-primary/40'
                    }`}
                  >
                    {/* Video Player */}
                    <div className="relative rounded-xl overflow-hidden aspect-video bg-black/80 border border-white/10 group-hover:border-brand-accent/30 transition-colors">
                      <video
                        controls
                        playsInline
                        poster={video.poster || undefined}
                        className="w-full h-full object-cover"
                        onPlay={() => trackVideoView(video.url, video.title)}
                      >
                        <source src={video.url} type="video/mp4" />
                        Your browser does not support HTML5 video.
                      </video>
                    </div>

                    {/* Footer Info & Share */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-white/95 group-hover:text-brand-accent transition-colors line-clamp-2 leading-snug">
                        {video.title}
                      </h3>

                      <button
                        onClick={() => handleShare(video)}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                          isCopied
                            ? 'bg-brand-success text-black border border-brand-success shadow-lg shadow-brand-success/30'
                            : 'bg-white/5 hover:bg-brand-accent hover:text-brand-primary text-brand-accent border border-brand-accent/30'
                        }`}
                        title="Copy shareable link"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

        {/* Explore All Testimonies Button */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/testifiers"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-brand-accent/30 hover:border-brand-accent hover:bg-brand-accent hover:text-brand-primary text-brand-accent text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg"
          >
            <span>Explore All Testimonies &amp; Miracle Archive</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
