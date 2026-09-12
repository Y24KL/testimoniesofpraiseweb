import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Share2, Check, Eye, Tag, FileText, Calendar } from 'lucide-react';
import { fetchAdotopocResources, trackAdotopocView, trackAdotopocDownload } from '../services/supabase';
import { formatBytes } from '../utils/slugify';

export default function ResourceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadItem = async () => {
      setLoading(true);
      try {
        const list = await fetchAdotopocResources();
        const found = list.find(r => String(r.id) === String(id));
        if (found) {
          setResource(found);
          trackAdotopocView(found.id);
        }
      } finally {
        setLoading(false);
      }
    };
    loadItem();
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDownload = async () => {
    if (!resource) return;
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
      window.open(resource.file_url, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white/60">
        Loading resource...
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
        <h2 className="font-cinzel text-2xl font-bold mb-4">Resource Not Found</h2>
        <Link to="/adotopoc" className="px-6 py-2.5 rounded-full bg-brand-accent text-brand-primary font-bold text-xs uppercase">
          Return to ADOTOPOC Hub
        </Link>
      </div>
    );
  }

  const isVideo = resource.category === 'video' || (resource.file_type && resource.file_type.toLowerCase() === 'mp4');
  const isImage = ['graphic', 'ecard', 'photo'].includes(resource.category);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/adotopoc')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 hover:text-brand-accent mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to ADOTOPOC Archive</span>
        </button>

        <div className="rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 sm:p-10 shadow-2xl">
          {/* Media Player */}
          <div className="rounded-2xl overflow-hidden bg-black/90 border border-white/10 flex items-center justify-center aspect-video max-h-[540px] mb-8">
            {isVideo ? (
              <video
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
                poster={resource.thumbnail_url || undefined}
              >
                <source src={resource.file_url} type="video/mp4" />
              </video>
            ) : isImage ? (
              <img
                src={resource.file_url || resource.thumbnail_url}
                alt={resource.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="p-16 text-center text-white/60 flex flex-col items-center gap-4">
                <FileText className="w-16 h-16 text-brand-accent" />
                <p>Document File</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-accent text-brand-primary">
                {resource.category}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-white"
                >
                  {copied ? <Check className="w-4 h-4 text-brand-success" /> : <Share2 className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Share'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-brand-accent text-brand-primary font-bold text-xs uppercase"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloading ? 'Downloading...' : 'Download'}</span>
                </button>
              </div>
            </div>

            <h1 className="font-cinzel text-2xl sm:text-4xl font-bold text-white uppercase mt-2">
              {resource.title}
            </h1>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed mt-2">
              {resource.description}
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
              <div>
                <span className="text-white/40 block uppercase text-[10px]">Event</span>
                <span className="font-semibold text-white/90">{resource.event_name}</span>
              </div>
              <div>
                <span className="text-white/40 block uppercase text-[10px]">Date</span>
                <span className="font-semibold text-white/90">{resource.event_date}</span>
              </div>
              <div>
                <span className="text-white/40 block uppercase text-[10px]">Views</span>
                <span className="font-semibold text-brand-accent">{(resource.views || 0).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-white/40 block uppercase text-[10px]">Downloads</span>
                <span className="font-semibold text-brand-success">{(resource.downloads || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
