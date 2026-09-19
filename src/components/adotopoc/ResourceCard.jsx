import React, { useState } from 'react';
import { Download, Eye, Video, Image, CreditCard, Camera, FileText, Check, Share2 } from 'lucide-react';
import { formatBytes } from '../../utils/slugify';
import { trackAdotopocDownload } from '../../services/supabase';
import TiltCard from '../animations/TiltCard';

const CATEGORY_ICONS = {
  video: Video,
  graphic: Image,
  ecard: CreditCard,
  photo: Camera,
  other: FileText,
};

const CATEGORY_COLORS = {
  video: 'bg-purple-900/60 text-purple-300 border-purple-500/40',
  graphic: 'bg-amber-900/60 text-amber-300 border-amber-500/40',
  ecard: 'bg-yellow-900/60 text-yellow-300 border-yellow-500/40',
  photo: 'bg-blue-900/60 text-blue-300 border-blue-500/40',
  other: 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40',
};

export default function ResourceCard({ resource, onView }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const Icon = CATEGORY_ICONS[resource.category] || FileText;
  const categoryBadgeClass = CATEGORY_COLORS[resource.category] || 'bg-white/10 text-white border-white/20';

  const handleShare = async (e) => {
    e.stopPropagation();
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

  const handleDownload = async (e) => {
    e.stopPropagation();
    setDownloading(true);

    try {
      // 1. Record download event in Supabase
      await trackAdotopocDownload(resource.id);

      // 2. Trigger browser download
      const link = document.createElement('a');
      link.href = resource.file_url;
      link.download = resource.title || 'adotopoc-resource';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Download error:', err);
      // Still attempt direct link open as fallback
      window.open(resource.file_url, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <TiltCard maxTilt={5} className="h-full">
      <div
        onClick={() => onView(resource)}
        className="h-full rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-brand-accent/40 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 group cursor-pointer hover:shadow-2xl hover:shadow-brand-primary/30"
      >
        <div>
          {/* Thumbnail preview */}
          <div className="relative rounded-xl overflow-hidden aspect-video bg-black/80 border border-white/10 mb-4 group-hover:border-brand-accent/30 transition-colors">
            {resource.thumbnail_url ? (
              <img
                src={resource.thumbnail_url}
                alt={resource.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-brand-primary/20">
                <Icon className="w-12 h-12 text-brand-accent/50" />
              </div>
            )}

            {/* Category tag */}
            <div className="absolute top-2.5 left-2.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${categoryBadgeClass}`}>
                <Icon className="w-3 h-3" />
                <span>{resource.category}</span>
              </span>
            </div>

            {/* File info badge */}
            {resource.file_size_bytes && (
              <div className="absolute bottom-2.5 right-2.5">
                <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-medium text-white/80 border border-white/10">
                  {formatBytes(resource.file_size_bytes)} &bull; {resource.file_type || 'FILE'}
                </span>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <h3 className="text-base font-bold text-white group-hover:text-brand-accent transition-colors line-clamp-2 leading-snug">
            {resource.title}
          </h3>
          <p className="mt-2 text-xs text-white/60 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* Card Footer with stats and buttons */}
        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[11px] text-white/50">
            <span className="flex items-center gap-1" title="Views">
              <Eye className="w-3.5 h-3.5 text-brand-accent" />
              <span>{(resource.views || 0).toLocaleString()}</span>
            </span>
            <span className="flex items-center gap-1" title="Downloads">
              <Download className="w-3.5 h-3.5 text-brand-success" />
              <span>{(resource.downloads || 0).toLocaleString()}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className={`p-2 rounded-full border transition-colors ${
                copied
                  ? 'bg-brand-success/15 text-brand-success border-brand-success/40'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-brand-accent border-white/10'
              }`}
              title={copied ? 'Link Copied!' : 'Share Resource'}
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                downloadSuccess
                  ? 'bg-brand-success text-black border border-brand-success'
                  : 'bg-brand-accent hover:bg-brand-accent-light text-brand-primary shadow-md hover:shadow-brand-accent/40'
              }`}
              title="Download Resource"
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Done</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloading ? '...' : 'Get'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}
