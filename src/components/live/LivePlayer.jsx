import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Radio, Volume2, VolumeX, AlertCircle, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LivePlayer() {
  const { stream } = useApp();
  const videoRef = useRef(null);
  const offlineVideoRef = useRef(null);
  const [offlineMuted, setOfflineMuted] = useState(true);

  // Extract YouTube ID from full URL or bare ID
  const getYouTubeEmbedUrl = (input) => {
    if (!input) return null;
    let videoId = input;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/live\/)([^#&?]*).*/;
    const match = input.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  };

  const isLive = Boolean(stream?.status);
  const youtubeUrl = getYouTubeEmbedUrl(stream?.youtubeVideoId);
  const cdnStreamUrl = stream?.streamUrl;
  const offlineVideo = stream?.offlineVideoUrl || "https://res.cloudinary.com/duw6xrnpn/video/upload/v1777127537/TESTIMONIES_OF_PRAISE_FINAL_OPENING_MONTAGE_lq5wqk.mp4";

  // Setup HLS player when no YouTube ID is provided and isLive is true
  useEffect(() => {
    if (!isLive || youtubeUrl || !cdnStreamUrl || !videoRef.current) return;

    let hls;
    const video = videoRef.current;

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(cdnStreamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = cdnStreamUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => {});
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [isLive, youtubeUrl, cdnStreamUrl]);

  const toggleOfflineSound = () => {
    if (offlineVideoRef.current) {
      offlineVideoRef.current.muted = !offlineVideoRef.current.muted;
      setOfflineMuted(offlineVideoRef.current.muted);
    }
  };

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-brand-accent/20 shadow-2xl shadow-brand-primary/20">
      {isLive ? (
        // LIVE BROADCAST
        youtubeUrl ? (
          <iframe
            src={youtubeUrl}
            title="Testimonies of Praise Live Stream"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <video
            ref={videoRef}
            controls
            playsInline
            className="w-full h-full object-contain bg-black"
          />
        )
      ) : (
        // OFFLINE STATE
        <div className="relative w-full h-full flex items-center justify-center">
          {offlineVideo && (
            <video
              ref={offlineVideoRef}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover brightness-50"
            >
              <source src={offlineVideo} type="video/mp4" />
            </video>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />

          {/* Offline Message Card */}
          <div className="relative z-10 text-center px-4 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-wider mb-4">
              <Clock className="w-4 h-4 text-brand-accent" />
              <span>Broadcast Currently Offline</span>
            </div>

            <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
              Testimonies of Praise Live
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-white/70 leading-relaxed">
              {stream?.description || "We are preparing for our next live miracle service. Stay tuned or explore our recorded testimonies below!"}
            </p>

            {offlineVideo && (
              <button
                onClick={toggleOfflineSound}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/20 text-xs font-semibold text-brand-accent hover:border-brand-accent transition-all"
              >
                {offlineMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{offlineMuted ? "Tap for Audio" : "Mute Background"}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
