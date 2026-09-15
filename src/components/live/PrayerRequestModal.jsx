import React, { useState } from 'react';
import { X, Send, Heart, Check, Sparkles } from 'lucide-react';
import { submitPrayerRequest } from '../../services/supabase';
import Portal from '../common/Portal';
import { useSmoothScroll } from '../../context/SmoothScroll';
import useLockBodyScroll from '../../utils/useLockBodyScroll';

export default function PrayerRequestModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [request, setRequest] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const { lenis } = useSmoothScroll();

  useLockBodyScroll(isOpen, lenis);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || request.trim().length < 5) {
      setErrorMsg('Please enter your name and prayer request (at least 5 characters).');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      await submitPrayerRequest({
        name: name.trim(),
        request: request.trim()
      });
      setStatus('success');
      setName('');
      setRequest('');
    } catch (err) {
      console.error('Prayer request error:', err);
      setStatus('error');
      setErrorMsg('Could not submit your request. Please try again.');
    }
  };

  return (
    <Portal>
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-brand-obsidian border border-brand-accent/30 p-6 sm:p-8 shadow-2xl shadow-brand-primary/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-brand-success/15 border border-brand-success/40 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-brand-success" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-white uppercase">
              Prayer Request Received
            </h3>
            <p className="mt-2 text-xs text-white/70 leading-relaxed">
              Our pastors and intercessory prayer network are standing in agreement with you right now. Expect your miracle!
            </p>
            <button
              onClick={() => {
                setStatus('idle');
                onClose();
              }}
              className="mt-6 px-6 py-2.5 rounded-full bg-brand-accent text-brand-primary font-bold text-xs uppercase tracking-wider"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-brand-accent mb-2">
              <Heart className="w-4 h-4 fill-brand-accent" />
              <span className="text-xs font-bold uppercase tracking-widest">Confidential Prayer</span>
            </div>
            <h3 className="font-cinzel text-xl font-bold text-white uppercase tracking-tight">
              Send Your Prayer Request
            </h3>
            <p className="mt-1 text-xs text-white/60">
              Submit your petition for live prayer agreement.
            </p>

            {errorMsg && (
              <div className="mt-3 p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-200 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-white/80 uppercase tracking-wider mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sister Grace"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-brand-accent"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/80 uppercase tracking-wider mb-1">
                  Prayer Request
                </label>
                <textarea
                  rows={4}
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder="Tell us what you want God to do for you..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-brand-accent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-accent via-amber-400 to-amber-500 text-brand-primary font-bold text-xs uppercase tracking-widest shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {status === 'submitting' ? 'Submitting...' : 'Send to Prayer Team'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
    </Portal>
  );
}
