import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

const DEFAULT_SETTINGS = {
  heroTitle: "TESTIMONIES OF PRAISE",
  heroSubtitle: "Experience high-definition storytelling, unfiltered testimonies, and immersive worship blasted directly to your device.",
  heroVideo: "https://res.cloudinary.com/duw6xrnpn/video/upload/v1777127537/TESTIMONIES_OF_PRAISE_FINAL_OPENING_MONTAGE_lq5wqk.mp4",
  socials: {
    kingschat: "https://kingschat.online/user/testimonies.lmm",
    x: "https://x.com/testimonies_lmm"
  }
};

const DEFAULT_STREAM = {
  status: false,
  streamUrl: "https://vcpout-lw-wdc-01-sp.ceflixcdn.com/lxp/play1/playlist.m3u8",
  youtubeVideoId: "https://www.youtube.com/live/wXjppZbKHIw?si=Y3-KRsrOTxqDAwpD",
  offlineVideoUrl: "",
  poster: "/images/live-poster.jpg",
  heading: "Testimonies of Praise Live",
  description: "Join thousands across the globe as we celebrate the triumphs of faith. Your miracle is next!"
};

export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [stream, setStream] = useState(DEFAULT_STREAM);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      // 1. Settings
      try {
        const sRes = await fetch('/data/settings.json?t=' + Date.now());
        if (sRes.ok) {
          const sJson = await sRes.json();
          setSettings(prev => ({ ...prev, ...sJson }));
        }
      } catch (e) {
        console.warn('Using default settings:', e);
      }

      // 2. Stream
      try {
        const strRes = await fetch('/data/stream.json?t=' + Date.now());
        if (strRes.ok) {
          const strJson = await strRes.json();
          setStream(prev => ({ ...prev, ...strJson }));
        }
      } catch (e) {
        console.warn('Using default stream config:', e);
      }

      // 3. Videos
      try {
        const vRes = await fetch('/data/videos.json?t=' + Date.now());
        if (vRes.ok) {
          const vJson = await vRes.json();
          setVideos(vJson.videos || []);
        }
      } catch (e) {
        console.warn('Using default videos list:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Poll stream status every 30 seconds so live badge updates automatically
    const interval = setInterval(async () => {
      try {
        const strRes = await fetch('/data/stream.json?t=' + Date.now());
        if (strRes.ok) {
          const strJson = await strRes.json();
          setStream(prev => ({ ...prev, ...strJson }));
        }
      } catch {}
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{
      settings,
      stream,
      videos,
      loading,
      refreshData: loadData
    }}>
      {children}
    </AppContext.Provider>
  );
}
