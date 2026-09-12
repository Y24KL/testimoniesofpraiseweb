import React, { useState } from 'react';
import { Send, Check, Heart, Sparkles, RefreshCw } from 'lucide-react';
import { submitTestimonyToSupabase } from '../../services/supabase';
import RevealOnScroll from '../animations/RevealOnScroll';

export default function TestimonyForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    zone: '',
    testimony: ''
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.zone || formData.testimony.length < 10) {
      setErrorMessage('Please fill out all fields with at least 10 characters for your testimony.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      // 1. Dual-write to Formspree
      const formspreePromise = fetch('https://formspree.io/f/meepnpbb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          'Full Name': formData.fullName,
          'Zone': formData.zone,
          'Testimony': formData.testimony
        })
      });

      // 2. Dual-write to Supabase
      const supabasePromise = submitTestimonyToSupabase({
        fullName: formData.fullName,
        zone: formData.zone,
        message: formData.testimony
      });

      await Promise.allSettled([formspreePromise, supabasePromise]);

      setStatus('success');
      setFormData({ fullName: '', zone: '', testimony: '' });
    } catch (err) {
      console.error('Testimony submission failed:', err);
      setStatus('error');
      setErrorMessage('Failed to submit testimony. Please check your connection and try again.');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <section id="testimonies-form" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-brand-obsidian to-black overflow-hidden">
      {/* Glow backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-brand-primary/30 blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        <RevealOnScroll className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/30 text-brand-accent text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebrate The Power of Faith</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase">
            Send In Your <span className="text-gold-gradient">Testimony</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/70 max-w-xl mx-auto">
            "They triumphed over him by the blood of the Lamb and by the word of their testimony." Share your victory with the world.
          </p>
        </RevealOnScroll>

        <div className="relative rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/15 p-6 sm:p-10 shadow-2xl shadow-black/80">
          {status === 'success' ? (
            <div className="py-12 flex flex-col items-center text-center animate-fadeIn">
              <div className="w-20 h-20 rounded-full bg-brand-success/15 border border-brand-success/40 flex items-center justify-center mb-6">
                <Check className="w-10 h-10 text-brand-success" />
              </div>
              <h3 className="font-cinzel text-2xl font-bold text-white uppercase tracking-wider">
                Praise The Lord!
              </h3>
              <p className="mt-3 text-base text-white/80 max-w-md">
                Your testimony has been faithfully received. May your miracle endure forever, inspiring thousands across the globe!
              </p>
              <button
                onClick={handleReset}
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-brand-accent hover:text-brand-primary border border-brand-accent/40 text-brand-accent font-bold text-xs tracking-wider uppercase transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Submit Another Testimony</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={`space-y-6 ${status === 'error' ? 'shake-anim' : ''}`}>
              {status === 'error' && errorMessage && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs sm:text-sm">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-brand-accent tracking-wider uppercase mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Brother Emmanuel David"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-accent tracking-wider uppercase mb-2">
                  Church Zone / City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  placeholder="e.g. Lagos Zone 2 / London, UK"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-accent tracking-wider uppercase mb-2">
                  Your Testimony <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="testimony"
                  rows={5}
                  value={formData.testimony}
                  onChange={handleChange}
                  placeholder="What glorious work has the Lord performed in your life?"
                  required
                  minLength={10}
                  className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-accent via-amber-400 to-amber-500 text-brand-primary font-bold text-sm tracking-widest uppercase shadow-xl shadow-brand-accent/30 hover:shadow-brand-accent/50 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Testimony...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Testimony</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
