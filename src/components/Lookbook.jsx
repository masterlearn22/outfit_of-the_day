import React, { useState, useMemo, useCallback } from 'react';
import outfitsData from '../data/outfits.json';
import imageMap from '../data/imageMap.json';
import outfitPhotos from '../data/outfitPhotos.json';
import { Search, X, Shuffle, SlidersHorizontal, ChevronDown, Tag, MapPin, Shirt } from 'lucide-react';

const allActivities = [...new Set(
  outfitsData.outfits.flatMap(o => o.activity.split(';').map(a => a.trim()))
)].sort();

const allStyles = [...new Set(outfitsData.outfits.map(o => o.style))].sort();
const allTops = [...new Set(outfitsData.outfits.map(o => o.top))].sort();
const allBottoms = [...new Set(outfitsData.outfits.map(o => o.bottom))].sort();

export default function Lookbook() {
  const [search, setSearch] = useState('');
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [randomOutfit, setRandomOutfit] = useState(null);

  const toggleStyle = useCallback((style) => {
    setSelectedStyles(prev => prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]);
    setRandomOutfit(null);
  }, []);

  const toggleActivity = useCallback((activity) => {
    setSelectedActivities(prev => prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]);
    setRandomOutfit(null);
  }, []);

  const clearAll = useCallback(() => {
    setSearch(''); setSelectedStyles([]); setSelectedActivities([]); setSelectedItem(''); setRandomOutfit(null);
  }, []);

  const hasActiveFilters = search || selectedStyles.length > 0 || selectedActivities.length > 0 || selectedItem;

  const filteredOutfits = useMemo(() => {
    if (randomOutfit) return [randomOutfit];
    return outfitsData.outfits.filter(outfit => {
      const matchSearch = !search ||
        outfit.activity.toLowerCase().includes(search.toLowerCase()) ||
        outfit.top.toLowerCase().includes(search.toLowerCase()) ||
        outfit.bottom.toLowerCase().includes(search.toLowerCase()) ||
        outfit.shoes.toLowerCase().includes(search.toLowerCase()) ||
        outfit.style.toLowerCase().includes(search.toLowerCase());
      const matchStyle = selectedStyles.length === 0 || selectedStyles.includes(outfit.style);
      const outfitActivities = outfit.activity.split(';').map(a => a.trim());
      const matchActivity = selectedActivities.length === 0 || selectedActivities.some(a => outfitActivities.includes(a));
      const matchItem = !selectedItem || outfit.top === selectedItem || outfit.bottom === selectedItem || outfit.shoes === selectedItem || outfit.outerwear === selectedItem;
      return matchSearch && matchStyle && matchActivity && matchItem;
    });
  }, [search, selectedStyles, selectedActivities, selectedItem, randomOutfit]);

  const shuffleOutfit = useCallback(() => {
    const pool = outfitsData.outfits;
    setRandomOutfit(pool[Math.floor(Math.random() * pool.length)]);
    setSearch(''); setSelectedStyles([]); setSelectedActivities([]); setSelectedItem('');
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Outfit <span className="font-serif italic font-normal" style={{ color: 'var(--accent)' }}>Lookbook</span>
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            Kombinasi pakaian pilihan untuk setiap momen dan kesempatan
          </p>
        </div>
        <button onClick={shuffleOutfit} className="btn-accent">
          <Shuffle size={16} /> Outfit of The Day
        </button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Cari kegiatan, item, atau gaya..." value={search}
              onChange={(e) => { setSearch(e.target.value); setRandomOutfit(null); }}
              className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm transition-all duration-300 focus:outline-none"
              style={{ border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
          <button onClick={() => setShowFilters(!showFilters)} className={showFilters ? 'btn-accent' : 'btn-ghost'}>
            <SlidersHorizontal size={16} /> Filter
            {hasActiveFilters && <span className="ml-1 w-2 h-2 rounded-full bg-red-400 inline-block"></span>}
          </button>
          {hasActiveFilters && (
            <button onClick={clearAll} className="btn-ghost" style={{ color: '#e74c3c', borderColor: '#e74c3c33' }}>
              <X size={14} /> Reset
            </button>
          )}
        </div>

        {showFilters && (
          <div className="animate-slide-down space-y-5 p-5 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)' }}>
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                <Tag size={12} /> Gaya / Style
              </label>
              <div className="flex flex-wrap gap-2">
                {allStyles.map(style => (
                  <button key={style} onClick={() => toggleStyle(style)} className={`chip ${selectedStyles.includes(style) ? 'active' : ''}`}>{style}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                <MapPin size={12} /> Kegiatan
              </label>
              <div className="flex flex-wrap gap-2">
                {allActivities.map(activity => (
                  <button key={activity} onClick={() => toggleActivity(activity)} className={`chip ${selectedActivities.includes(activity) ? 'active' : ''}`}>{activity}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                <Shirt size={12} /> Item Spesifik
              </label>
              <div className="relative inline-block">
                <select value={selectedItem} onChange={(e) => { setSelectedItem(e.target.value); setRandomOutfit(null); }}
                  className="pl-4 pr-10 py-2.5 appearance-none rounded-xl text-sm cursor-pointer focus:outline-none"
                  style={{ border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                  <option value="">Semua Item</option>
                  <optgroup label="Atasan">{allTops.map(t => <option key={t} value={t}>{t}</option>)}</optgroup>
                  <optgroup label="Bawahan">{allBottoms.map(b => <option key={b} value={b}>{b}</option>)}</optgroup>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          {randomOutfit ? (
            <span>🎲 Outfit of The Day — <strong style={{ color: 'var(--accent)' }}>#{randomOutfit.id}</strong></span>
          ) : (
            <>Menampilkan <strong style={{ color: 'var(--accent)' }}>{filteredOutfits.length}</strong> dari {outfitsData.outfits.length} outfit</>
          )}
        </p>
        {randomOutfit && (
          <button onClick={() => setRandomOutfit(null)} className="btn-ghost text-xs">Tampilkan Semua</button>
        )}
      </div>

      {/* Outfit Cards - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger-children">
        {filteredOutfits.map((outfit) => (
          <OutfitCard key={outfit.id} outfit={outfit} isHighlighted={randomOutfit?.id === outfit.id} />
        ))}
        {filteredOutfits.length === 0 && (
          <div className="col-span-full py-16 text-center animate-fade-in">
            <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>Tidak ada outfit yang cocok</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Coba ubah filter atau kata kunci pencarian Anda</p>
            <button onClick={clearAll} className="btn-accent mt-4">Reset Filter</button>
          </div>
        )}
      </div>
    </div>
  );
}

function OutfitCard({ outfit, isHighlighted }) {
  const items = [
    { label: 'Top', name: outfit.top },
    ...(outfit.outerwear !== '-' ? [{ label: 'Outer', name: outfit.outerwear }] : []),
    { label: 'Bottom', name: outfit.bottom },
    { label: 'Shoes', name: outfit.shoes },
  ];
  const activities = outfit.activity.split(';').map(a => a.trim());
  const outfitPhoto = outfitPhotos[String(outfit.id)];
  const [imgError, setImgError] = React.useState(false);
  const hasOutfitPhoto = !!outfitPhoto && !imgError;

  return (
    <div
      className="card"
      style={isHighlighted ? { borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent), var(--shadow-lg)' } : {}}
    >
      {hasOutfitPhoto ? (
        /* ====== LAYOUT: Outfit photo + item strip ====== */
        <div className="flex flex-col">
          {/* Main outfit photo + items side by side */}
          <div className="flex" style={{ minHeight: '320px' }}>
            {/* Left: Outfit photo */}
            <div className="w-[55%] relative overflow-hidden group/photo">
              <img
                src={`${import.meta.env.BASE_URL}${outfitPhoto}`}
                alt={`Outfit #${outfit.id}`}
                className="w-full h-full object-cover object-top"
                loading="lazy"
                style={{ transition: 'transform 0.6s var(--ease-out-expo)' }}
                onError={() => setImgError(true)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              />
            </div>

            {/* Right: Item thumbnails vertical strip */}
            <div className="w-[45%] flex flex-col gap-[2px] p-[2px]" style={{ background: 'linear-gradient(145deg, #f5f3ef 0%, #eae7e1 100%)' }}>
              {items.map((item, idx) => (
                imageMap[item.name] ? (
                  <div key={idx} className="flex-1 relative overflow-hidden group/item min-h-0">
                    <img src={`${import.meta.env.BASE_URL}${imageMap[item.name]}`} alt={item.name} className="w-full h-full object-cover" loading="lazy"
                      style={{ transition: 'transform 0.5s var(--ease-out-expo)' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-2 py-1 text-[9px] font-medium text-white opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.65))' }}>
                      {item.name}
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          </div>

          {/* Info below */}
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="badge badge-muted">#{outfit.id}</span>
              <span className="badge badge-gold font-serif italic">{outfit.style}</span>
            </div>
            <div className="space-y-1.5">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-baseline gap-2">
                  <span className="text-[10px] uppercase tracking-[0.1em] font-semibold w-12 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                </div>
              ))}
              {outfit.watch !== '-' && (
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] uppercase tracking-[0.1em] font-semibold w-12 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Watch</span>
                  <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{outfit.watch}</span>
                </div>
              )}
            </div>
            <div className="pt-2" style={{ borderTop: '1px solid var(--border-light)' }}>
              <div className="flex flex-wrap gap-1.5">
                {activities.map((act, idx) => <span key={idx} className="badge badge-gold text-[10px]">{act}</span>)}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ====== FALLBACK: 2x2 flat-lay (no outfit photo) ====== */
        <div>
          <div className="grid grid-cols-2 gap-1 p-2" style={{ background: 'linear-gradient(145deg, #f5f3ef 0%, #eae7e1 100%)' }}>
            {items.slice(0, 4).map((item, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-lg group/item" style={{ aspectRatio: '3/4' }}>
                {imageMap[item.name] ? (
                  <>
                    <img src={`${import.meta.env.BASE_URL}${imageMap[item.name]}`} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105" loading="lazy" />
                    <div className="absolute bottom-0 left-0 right-0 px-2 py-1 text-[10px] font-medium text-white opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                      style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                      {item.label}: {item.name}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: '#eae7e1', color: 'var(--text-muted)' }}>
                    <span className="text-xs">{item.name}</span>
                  </div>
                )}
              </div>
            ))}
            {items.filter(i => imageMap[i.name]).length < 4 && outfit.watch !== '-' && imageMap[outfit.watch] && (
              <div className="relative overflow-hidden rounded-lg group/item" style={{ aspectRatio: '3/4' }}>
                <img src={`${import.meta.env.BASE_URL}${imageMap[outfit.watch]}`} alt={outfit.watch} className="w-full h-full object-cover transition-transform duration-500 group-hover/item:scale-105" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1 text-[10px] font-medium text-white opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                  Watch: {outfit.watch}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="badge badge-muted">#{outfit.id}</span>
              <span className="badge badge-gold font-serif italic">{outfit.style}</span>
            </div>
            <div className="space-y-1.5">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-baseline gap-2">
                  <span className="text-[10px] uppercase tracking-[0.1em] font-semibold w-12 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                </div>
              ))}
              {outfit.watch !== '-' && (
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] uppercase tracking-[0.1em] font-semibold w-12 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Watch</span>
                  <span className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{outfit.watch}</span>
                </div>
              )}
            </div>
            <div className="pt-2" style={{ borderTop: '1px solid var(--border-light)' }}>
              <div className="flex flex-wrap gap-1.5">
                {activities.map((act, idx) => <span key={idx} className="badge badge-gold text-[10px]">{act}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
