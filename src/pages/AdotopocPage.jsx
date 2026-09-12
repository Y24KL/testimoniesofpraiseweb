import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Sparkles, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { fetchAdotopocResources } from '../services/supabase';
import AdotopocHero from '../components/adotopoc/AdotopocHero';
import ResourceCard from '../components/adotopoc/ResourceCard';
import ResourceModal from '../components/adotopoc/ResourceModal';
import RevealOnScroll from '../components/animations/RevealOnScroll';

const CATEGORIES = [
  { id: 'all', label: 'All Resources' },
  { id: 'video', label: 'Videos' },
  { id: 'graphic', label: 'Graphics' },
  { id: 'ecard', label: 'E-Cards' },
  { id: 'photo', label: 'Photos' },
  { id: 'other', label: 'Other Toolkits' },
];

export default function AdotopocPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'downloads' | 'views' | 'title'
  const [activeModalResource, setActiveModalResource] = useState(null);

  const resourceGridRef = useRef(null);

  const loadResources = async () => {
    setLoading(true);
    try {
      const data = await fetchAdotopocResources();
      setResources(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadResources();
  }, []);

  const scrollToGrid = () => {
    if (resourceGridRef.current) {
      resourceGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filter & Sort logic
  const filteredResources = resources
    .filter(res => {
      const matchesCategory = selectedCategory === 'all' || res.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q ||
        (res.title && res.title.toLowerCase().includes(q)) ||
        (res.description && res.description.toLowerCase().includes(q)) ||
        (res.tags && res.tags.some(t => t.toLowerCase().includes(q)));
      return matchesCategory && matchesQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
      if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  const getCategoryCount = (catId) => {
    if (catId === 'all') return resources.length;
    return resources.filter(r => r.category === catId).length;
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* 1. Epic ADOTOPOC Hero */}
      <AdotopocHero onExploreClick={scrollToGrid} />

      {/* 2. Media Hub & Filters Section */}
      <section ref={resourceGridRef} className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="flex flex-col gap-8 mb-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand-accent mb-2 block">
                Official Media Archive
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
                Media <span className="text-gold-gradient">Resource Hub</span>
              </h2>
            </div>

            {/* Search and Sort Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search titles, tags..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/40 text-xs focus:outline-none focus:border-brand-accent transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-white/40" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-brand-accent transition-all"
                >
                  <option value="recent" className="bg-black">Newest First</option>
                  <option value="downloads" className="bg-black">Most Downloaded</option>
                  <option value="views" className="bg-black">Most Viewed</option>
                  <option value="title" className="bg-black">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map(cat => {
              const count = getCategoryCount(cat.id);
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-brand-accent text-brand-primary shadow-lg shadow-brand-accent/25 border-brand-accent'
                      : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/10 text-white/60'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <RefreshCw className="w-8 h-8 text-brand-accent animate-spin mb-4" />
            <p className="text-sm text-white/60">Loading ADOTOPOC media catalog...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="py-24 text-center rounded-2xl bg-white/[0.02] border border-white/10 p-8">
            <p className="text-base text-white/70">
              No resources found matching your current filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-full bg-brand-accent text-brand-primary font-bold text-xs uppercase"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredResources.map((res) => (
              <ResourceCard
                key={res.id}
                resource={res}
                onView={(item) => setActiveModalResource(item)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal Dialog */}
      <ResourceModal
        resource={activeModalResource}
        onClose={() => setActiveModalResource(null)}
      />
    </div>
  );
}
