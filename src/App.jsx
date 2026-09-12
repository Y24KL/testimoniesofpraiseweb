import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { SmoothScrollProvider } from './context/SmoothScroll';
import ParticleScene from './components/three/ParticleScene';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LiveBanner from './components/common/LiveBanner';
import SocialBubble from './components/common/SocialBubble';

import HomePage from './pages/HomePage';
import LivePage from './pages/LivePage';
import AdotopocPage from './pages/AdotopocPage';
import ResourceDetailPage from './pages/ResourceDetailPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <AppProvider>
      <SmoothScrollProvider>
        <div className="relative min-h-screen bg-black text-white flex flex-col justify-between selection:bg-brand-accent selection:text-brand-primary">
          {/* Ambient 3D Three.js Particles */}
          <ParticleScene />

          {/* Floating Navigation */}
          <Navbar />

          {/* Main Routing View */}
          <main className="relative z-10 flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/live" element={<LivePage />} />
              <Route path="/adotopoc" element={<AdotopocPage />} />
              <Route path="/adotopoc/resource/:id" element={<ResourceDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Floating UI Elements */}
          <LiveBanner />
          <SocialBubble />

          {/* Footer */}
          <Footer />
        </div>
      </SmoothScrollProvider>
    </AppProvider>
  );
}
