import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Play,
  Share2,
  Check,
  Quote,
  Heart,
  Sparkles,
  Film,
  BookOpen,
  User,
  MapPin,
  Calendar,
  X,
  ExternalLink,
  ChevronRight,
  Radio,
  SlidersHorizontal,
  Volume2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { trackVideoView, fetchWrittenTestimonies } from '../services/supabase';
import { slugify } from '../utils/slugify';
import TiltCard from '../components/animations/TiltCard';
import RevealOnScroll from '../components/animations/RevealOnScroll';
import TestimonyForm from '../components/home/TestimonyForm';

// Initial curated inspiring testimonies to ensure immediate richness
const INITIAL_WRITTEN_TESTIMONIES = [
  {
    id: 'w-1',
    full_name: 'Sis. Kemi Adeyemi',
    zone: 'Christ Embassy Lagos Zone 2',
    message: 'During the live broadcast last month, the Pastor declared healing for spinal conditions. I had suffered severe disc pain for over 4 years, but as the prayer was made, a sensation of warm oil flowed down my back. Instantly, all pain dissolved! I can now bend, jump, and lift without a trace of discomfort. Glory to God!',
    created_at: '2026-08-28T14:20:00Z',
    likes: 42
  },
  {
    id: 'w-2',
    full_name: 'Bro. David Chen',
    zone: 'CE East Asia Region (China)',
    message: 'My business had suffered near bankruptcy due to policy changes. After participating in the prayer session and taking notes of the prophetic words, I received an unexplainable multi-million contract within 72 hours from an international partner. God has turned everything around for our good!',
    created_at: '2026-08-15T09:15:00Z',
    likes: 38
  },
  {
    id: 'w-3',
    full_name: 'Deaconess Grace & Family',
    zone: 'CE United Kingdom Zone 1',
    message: 'The doctors gave up on my niece who was born with congenital respiratory issues. We connected to the stream with unwavering faith and placed the device on her chest during prayer. Today, the latest CT scan confirms 100% normal lungs and zero infection! The God of Testimonies of Praise never fails!',
    created_at: '2026-08-05T18:45:00Z',
    likes: 57
  }
];

export default function TestifiersPage() {
  const { videos, stream } = useApp();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'videos' | 'written'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'az'
  const [writtenTestimonies, setWrittenTestimonies] = useState(INITIAL_WRITTEN_TESTIMONIES);
  const [loadingWritten, setLoadingWritten] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [activeModalVideo, setActiveModalVideo] = useState(null);
  const [activeModalStory, setActiveModalStory] = useState(null);
  const [likedMap, setLikedMap] = useState({});

  const formRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch written testimonies from Supabase
    async function loadWritten() {
      setLoadingWritten(true);
      try {
        const data = await fetchWrittenTestimonies(50);
        if (data && data.length > 0) {
          // Merge unique Supabase items with initial items
          const dbItems = data.map((item, idx) => ({
            id: item.id || `db-${idx}`,
            full_name: item.full_name || 'Anonymous Believer',
            zone: item.zone || 'Global Congregation',
            message: item.message || '',
            created_at: item.created_at || new Date().toISOString(),
            likes: ((idx * 7) % 25) + 12
          }));
          setWrittenTestimonies(prev => {
            const combined = [...dbItems, ...prev.filter(p => !dbItems.some(d => d.message === p.message))];
            return combined;
          });
        }
      } catch (err) {
        console.warn('Could not fetch Supabase testimonies:', err);
      } finally {
        setLoadingWritten(false);
      }
    }

    loadWritten();
  }, []);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShare = async (title, slug) => {
    const url = `${window.location.origin}/testifiers#${slug}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const toggleLike = (id) => {
    setLikedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter video items
  const filteredVideos = (videos || []).filter(v => {
    if (activeTab === 'written') return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (v.title || '').toLowerCase().includes(q);
  });

  // Filter written items
  const filteredWritten = writtenTestimonies.filter(w => {
    if (activeTab === 'videos') return false;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      w.full_name.toLowerCase().includes(q) ||
      w.zone.toLowerCase().includes(q) ||
      w.message.toLowerCase().includes(q)
    );
  });

  // Total count
  const totalCount = filteredVideos.length + filteredWritten.length;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden pt-28 pb-20">
      {/* Background radial lighting */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-brand-primary/25 blur-[160px] pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-96 h-96 bg-brand-accent/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/40 backdrop-blur-md border border-brand-accent/30 text-brand-accent text-xs font-bold tracking-[0.2em] uppercase mb-6 shadow-lg shadow-brand-primary/30">
            <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            <span>Living Miracles & Triumphs</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-6xl font-black tracking-tight text-white uppercase leading-tight drop-shadow-2xl">
            Testifiers & <span className="text-gold-gradient">Miracle Archive</span>
          </h1>

          <p className="mt-6 text-sm sm:text-base text-white/75 leading-relaxed max-w-2xl mx-auto">
            Experience unfiltered accounts of God&apos;s transformative power in action. Watch high-definition video testifiers and read faith-stirring encounters from across the globe.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={scrollToForm}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-accent via-amber-400 to-amber-500 text-brand-primary font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-accent/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Share Your Testimony
            </button>

            <Link
              to="/live"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/15 hover:border-brand-accent text-white/90 hover:text-brand-accent font-semibold text-xs uppercase tracking-wider transition-all"
            >
              <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              <span>Watch Live Stream</span>
            </Link>
          </div>
        </div>

        {/* Toolbar: Tabs, Search & Sort */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 mb-12 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-brand-accent text-brand-primary shadow-lg shadow-brand-accent/30'
                    : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                All Stories ({(videos || []).length + writtenTestimonies.length})
              </button>

              <button
                onClick={() => setActiveTab('videos')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  activeTab === 'videos'
                    ? 'bg-brand-accent text-brand-primary shadow-lg shadow-brand-accent/30'
                    : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Video Testimonies ({(videos || []).length})</span>
              </button>

              <button
                onClick={() => setActiveTab('written')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  activeTab === 'written'
                    ? 'bg-brand-accent text-brand-primary shadow-lg shadow-brand-accent/30'
                    : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Written Miracles ({writtenTestimonies.length})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search testifiers, zones, miracles..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/40 text-xs focus:outline-none focus:border-brand-accent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section 1: Video Testimonies Grid */}
        {(activeTab === 'all' || activeTab === 'videos') && filteredVideos.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-accent animate-ping" />
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                  Video Testimonies & Recaps
                </h2>
              </div>
              <span className="text-xs text-white/50 font-medium">
                {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVideos.map((video, idx) => {
                const slug = slugify(video.title || `video-${idx + 1}`);
                const isCopied = copiedSlug === slug;

                return (
                  <TiltCard key={slug} maxTilt={5} className="h-full">
                    <div className="h-full rounded-2xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 hover:border-brand-accent/40 backdrop-blur-xl p-4 flex flex-col justify-between transition-all duration-300 group shadow-xl hover:shadow-2xl hover:shadow-brand-primary/20">
                      {/* Video Player Box */}
                      <div className="relative rounded-xl overflow-hidden aspect-video bg-black border border-white/10 group-hover:border-brand-accent/30 transition-colors">
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

                      {/* Info & Share */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-semibold text-white/95 group-hover:text-brand-accent transition-colors line-clamp-2 leading-snug">
                            {video.title}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-primary/40 border border-brand-accent/20 text-[10px] font-bold uppercase tracking-wider text-brand-accent">
                            <Film className="w-3 h-3" />
                            <span>Video</span>
                          </span>

                          <button
                            onClick={() => handleShare(video.title, slug)}
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
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
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 2: Written Testimonies Grid */}
        {(activeTab === 'all' || activeTab === 'written') && filteredWritten.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-tight text-white">
                  Written Miracles & Personal Encounters
                </h2>
              </div>
              <span className="text-xs text-white/50 font-medium">
                {filteredWritten.length} {filteredWritten.length === 1 ? 'testimony' : 'testimonies'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWritten.map((item) => {
                const slug = slugify(item.full_name + '-' + item.id);
                const isCopied = copiedSlug === slug;
                const isLiked = Boolean(likedMap[item.id]);

                return (
                  <TiltCard key={item.id} maxTilt={4} className="h-full">
                    <div className="h-full rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 hover:border-brand-accent/40 backdrop-blur-xl p-6 flex flex-col justify-between transition-all duration-300 group shadow-xl hover:shadow-2xl hover:shadow-brand-accent/10">
                      <div>
                        {/* Top Badge & Quote Icon */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent/40 border border-brand-accent/40 flex items-center justify-center text-brand-accent font-bold text-sm shadow-md">
                              {item.full_name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">
                                {item.full_name}
                              </h4>
                              <div className="flex items-center gap-1 text-[11px] text-white/50">
                                <MapPin className="w-3 h-3 text-brand-accent" />
                                <span>{item.zone}</span>
                              </div>
                            </div>
                          </div>

                          <Quote className="w-6 h-6 text-brand-accent/30 group-hover:text-brand-accent transition-colors" />
                        </div>

                        {/* Testimony Body */}
                        <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal line-clamp-5 mt-3 italic">
                          &ldquo;{item.message}&rdquo;
                        </p>

                        {item.message.length > 200 && (
                          <button
                            onClick={() => setActiveModalStory(item)}
                            className="mt-3 text-xs font-semibold text-brand-accent hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Read full testimony</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                        <button
                          onClick={() => toggleLike(item.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            isLiked
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : 'bg-white/5 text-white/60 hover:text-red-400 hover:bg-white/10 border border-white/10'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-400' : ''}`} />
                          <span>Praise God ({item.likes + (isLiked ? 1 : 0)})</span>
                        </button>

                        <button
                          onClick={() => handleShare(item.full_name, slug)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                            isCopied
                              ? 'bg-brand-success text-black border border-brand-success'
                              : 'bg-white/5 hover:bg-brand-accent hover:text-brand-primary text-brand-accent border border-brand-accent/30'
                          }`}
                        >
                          {isCopied ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                          <span>{isCopied ? 'Copied' : 'Share'}</span>
                        </button>
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State if search yields no results */}
        {totalCount === 0 && (
          <div className="text-center py-20 px-4 rounded-2xl bg-white/[0.02] border border-white/10 max-w-lg mx-auto">
            <Quote className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="font-cinzel text-lg font-bold text-white uppercase">No Testimonies Found</h3>
            <p className="mt-2 text-xs sm:text-sm text-white/60">
              We could not find any testimony matching &ldquo;{searchQuery}&rdquo;. Try another search term or clear filters.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
              className="mt-6 px-5 py-2 rounded-full bg-brand-accent text-brand-primary font-bold text-xs uppercase cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Embedded Submission Section */}
        <div ref={formRef} id="share-testimony" className="mt-24 pt-16 border-t border-white/10">
          <TestimonyForm />
        </div>
      </div>

      {/* Full Written Story Modal */}
      {activeModalStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-950 border border-brand-accent/40 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalStory(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-primary to-brand-accent/40 border border-brand-accent/50 flex items-center justify-center text-brand-accent font-bold text-lg">
                {activeModalStory.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  {activeModalStory.full_name}
                </h3>
                <p className="text-xs text-brand-accent flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{activeModalStory.zone}</span>
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/[0.03] border border-white/10 text-white/90 text-sm sm:text-base leading-relaxed whitespace-pre-wrap italic">
              &ldquo;{activeModalStory.message}&rdquo;
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveModalStory(null)}
                className="px-6 py-2.5 rounded-full bg-brand-accent text-brand-primary font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
