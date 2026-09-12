import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SocialBubble() {
  const [open, setOpen] = useState(false);
  const { settings } = useApp();

  const kingschatUrl = settings?.socials?.kingschat || "https://kingschat.online/user/testimonies.lmm";
  const xUrl = settings?.socials?.x || "https://x.com/testimonies_lmm";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Expanded Social Icons */}
      <div
        className={`flex flex-col gap-3 transition-all duration-300 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <a
          href={kingschatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform"
          title="Kingschat"
        >
          <img src="/images/Kc.png" alt="Kingschat" className="w-7 h-7 object-contain" />
        </a>
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-transform"
          title="X (Twitter)"
        >
          <img src="/images/X logo.png" alt="X" className="w-7 h-7 object-contain" />
        </a>
      </div>

      {/* Main Trigger Bubble */}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-accent via-amber-400 to-amber-300 text-brand-primary flex items-center justify-center shadow-2xl shadow-brand-accent/40 border-2 border-amber-200/50 hover:scale-105 active:scale-95 transition-transform"
        aria-label="Connect on Social Platforms"
      >
        {open ? <X className="w-6 h-6 stroke-[2.5]" /> : <MessageCircle className="w-7 h-7 stroke-[2.5]" />}
      </button>
    </div>
  );
}
