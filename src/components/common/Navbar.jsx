import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Radio, Menu, X, Sparkles, HeartHandshake } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useSmoothScroll } from '../../context/SmoothScroll';

export default function Navbar() {
  const { stream } = useApp();
  const { scrollTo } = useSmoothScroll();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleShareClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      scrollTo('#testimonies-form', { offset: -80 });
    }
  };

  const navLinks = [
    { label: 'HOME', to: '/' },
    { label: 'TESTIFIERS', to: '/#testifiers', isAnchor: true },
    { label: 'WATCH LIVE', to: '/live', badge: stream?.status ? 'LIVE' : null },
    { label: 'ADOTOPOC', to: '/adotopoc', highlight: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-2.5 bg-black/85 backdrop-blur-xl border-b border-brand-accent/20 shadow-2xl shadow-black/80'
          : 'py-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <img
              src="/images/Testimonies of Praise.png"
              alt="Testimonies of Praise"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-brand-accent/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="font-cinzel text-xs sm:text-sm font-bold tracking-[0.2em] text-brand-accent uppercase drop-shadow">
              Testimonies of Praise
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            if (link.isAnchor && location.pathname === '/') {
              return (
                <button
                  key={link.label}
                  onClick={() => scrollTo('#testifiers', { offset: -90 })}
                  className="text-xs font-semibold tracking-[0.15em] text-white/80 hover:text-brand-accent transition-colors uppercase"
                >
                  {link.label}
                </button>
              );
            }
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`relative text-xs font-semibold tracking-[0.15em] transition-all duration-300 uppercase py-1 ${
                  location.pathname === link.to
                    ? 'text-brand-accent font-bold'
                    : 'text-white/80 hover:text-brand-accent'
                } ${link.highlight ? 'text-amber-300 font-bold hover:text-brand-accent-light' : ''}`}
              >
                <span className="flex items-center gap-1.5">
                  {link.highlight && <Sparkles className="w-3.5 h-3.5 text-brand-accent" />}
                  {link.label}
                  {link.badge && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-red-600/90 text-white animate-pulse shadow-lg shadow-red-600/50">
                      <span className="w-1.5 h-1.5 mr-1 bg-white rounded-full"></span>
                      {link.badge}
                    </span>
                  )}
                </span>
                {location.pathname === link.to && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            to={location.pathname === '/' ? '#testimonies-form' : '/#testimonies-form'}
            onClick={handleShareClick}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-accent via-amber-400 to-brand-accent text-brand-primary font-bold text-xs tracking-wider uppercase shadow-lg shadow-brand-accent/20 hover:shadow-brand-accent/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
          >
            <HeartHandshake className="w-4 h-4 text-brand-primary" />
            <span>Share Testimony</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {stream?.status && (
            <Link
              to="/live"
              className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-extrabold bg-red-600 text-white animate-pulse mr-1"
            >
              <Radio className="w-3 h-3 mr-1" />
              LIVE
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white hover:text-brand-accent rounded-lg focus:outline-none transition-colors"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-brand-accent" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`md:hidden fixed inset-0 top-[60px] bg-black/95 backdrop-blur-2xl transition-all duration-500 flex flex-col justify-between p-6 z-40 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-8'
        }`}
      >
        <div className="flex flex-col gap-6 mt-4">
          {navLinks.map((link) => {
            if (link.isAnchor && location.pathname === '/') {
              return (
                <button
                  key={link.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollTo('#testifiers', { offset: -80 });
                  }}
                  className="text-left text-lg font-cinzel font-semibold tracking-wider text-white/90 hover:text-brand-accent transition-colors"
                >
                  {link.label}
                </button>
              );
            }
            return (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-lg font-cinzel font-semibold tracking-wider text-white/90 hover:text-brand-accent transition-colors"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-600 text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
          <Link
            to={location.pathname === '/' ? '#testimonies-form' : '/#testimonies-form'}
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleShareClick(e);
            }}
            className="w-full text-center py-3.5 rounded-xl bg-brand-accent text-brand-primary font-bold text-sm tracking-wider uppercase shadow-xl"
          >
            Share Your Testimony
          </Link>
          <div className="flex justify-center gap-6 pt-2 text-white/50 text-xs">
            <a href="https://kingschat.online/user/testimonies.lmm" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent">
              Kingschat
            </a>
            <span>•</span>
            <a href="https://x.com/testimonies_lmm" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent">
              X (Twitter)
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
