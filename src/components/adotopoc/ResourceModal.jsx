import React, { useEffect, useState } from 'react';
import { X, Download, Share2, Check, Eye, Calendar, Tag, FileText } from 'lucide-react';
import { formatBytes } from '../../utils/slugify';
import { trackAdotopocView, trackAdotopocDownload } from '../../services/supabase';

export default function ResourceModal({ resource, onClose }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (resource) {
      // Track view in Supabase once per session
      trackAdotopocView(resource.id);
    }
  }, [resource]);

  if (!resource) return null;

  const handleShare = async () => {
    const url = `${window.location.origin}/adotopoc/resource/${resource.id}`;
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
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await trackAdotopocDownload(resource.id);
      const a = document.createElement('a');
      a.href = resource.file_url;
      a.download = resource.title || 'adotopoc-resource';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      window.open(resource.file_url, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const isVideo = resource.category === 'video' || (resource.file_type && resource.file_type.toLowerCase() === 'mp4');
  const isImage = ['graphic', 'ecard', 'photo'].includes(resource.category) || ['png', 'jpg', 'jpeg', 'webp'].includes((resource.file_type || '').toLowerCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-brand-obsidian border border-brand-accent/30 shadow-2xl shadow-black overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-accent text-brand-primary">
              {resource.category}
            </span>
            <span className="text-xs text-white/50 tracking-wider">
              {resource.event_name || 'ADOTOPOC 2026'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Media Player / Viewer */}
          <div className="rounded-2xl overflow-hidden bg-black/90 border border-white/10 flex items-center justify-center aspect-video max-h-[480px]">
            {isVideo ? (
              <video
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
                poster={resource.thumbnail_url || undefined}
              >
                <source src={resource.file_url} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>
            ) : isImage ? (
              <img
                src={resource.file_url || resource.thumbnail_url}
                alt={resource.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="p-12 text-center flex flex-col items-center gap-4 text-white/60">
                <FileText className="w-16 h-16 text-brand-accent/60" />
                <p className="text-sm">Downloadable document / resource asset</p>
              </div>
            )}
          </div>

          {/* Details & Metadata */}
          <div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white uppercase leading-snug">
              {resource.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed">
              {resource.description}
            </p>

            {/* Info Grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
              <div>
                <span className="text-white/40 block uppercase text-[10px] tracking-wider">Event Date</span>
                <span className="font-semibold text-white/90">{resource.event_date || '5 Sept 2026'}</span>
              </div>
              <div>
                <span className="text-white/40 block uppercase text-[10px] tracking-wider">File Size</span>
                <span className="font-semibold text-white/90">{formatBytes(resource.file_size_bytes)}</span>
              </div>
              <div>
                <span className="text-white/40 block uppercase text-[10px] tracking-wider">Total Views</span>
                <span className="font-semibold text-brand-accent">{(resource.views || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-white/40 block uppercase text-[10px] tracking-wider">Downloads</span>
                <span className="font-semibold text-brand-success">{(resource.downloads || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Tags */}
            {resource.tags && resource.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-brand-accent/60" />
                {resource.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-white/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/70 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-white hover:text-brand-accent transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-brand-success" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Share Resource'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-brand-accent via-amber-400 to-amber-500 text-brand-primary font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-accent/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Downloading...' : 'Download Resource'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
