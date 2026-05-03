import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import outfitsData from '../data/outfits.json';
import imageMap from '../data/imageMap.json';
import outfitPhotos from '../data/outfitPhotos.json';
import { Layers, X } from 'lucide-react';

const categoriesMap = {
  tops: { label: 'Atasan', icon: '👔' },
  bottoms: { label: 'Bawahan', icon: '👖' },
  outerwears: { label: 'Outerwear', icon: '🧥' },
  shoes: { label: 'Sepatu', icon: '👞' },
  watches: { label: 'Jam Tangan', icon: '⌚' },
};

const isSameItem = (itemA, itemB) => {
  if (!itemA || !itemB) return false;
  return itemA.replace(' (Digulung)', '') === itemB.replace(' (Digulung)', '');
};

export default function DigitalCloset() {
  const [activeCategory, setActiveCategory] = useState('tops');
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOutfit, setModalOutfit] = useState(null);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const items = outfitsData.categories[activeCategory];
  const panelRef = useRef(null);

  useEffect(() => {
    if (selectedItem && panelRef.current) {
      setTimeout(() => {
        panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (modalOutfit) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [modalOutfit]);

  const closeModal = useCallback(() => {
    setIsModalClosing(true);
    setTimeout(() => {
      setModalOutfit(null);
      setIsModalClosing(false);
    }, 280);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && modalOutfit) closeModal();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [modalOutfit, closeModal]);

  const itemOutfitCount = useMemo(() => {
    const counts = {};
    outfitsData.outfits.forEach(outfit => {
      [outfit.top, outfit.bottom, outfit.outerwear, outfit.shoes, outfit.watch].forEach(item => {
        if (item && item !== '-') {
          const baseItem = item.replace(' (Digulung)', '');
          counts[baseItem] = (counts[baseItem] || 0) + 1;
        }
      });
    });
    return counts;
  }, []);

  const relatedOutfits = useMemo(() => {
    if (!selectedItem) return [];
    return outfitsData.outfits.filter(outfit =>
      isSameItem(outfit.top, selectedItem) ||
      isSameItem(outfit.bottom, selectedItem) ||
      isSameItem(outfit.outerwear, selectedItem) ||
      isSameItem(outfit.shoes, selectedItem) ||
      isSameItem(outfit.watch, selectedItem)
    );
  }, [selectedItem]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h2 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Digital <span className="font-serif italic font-normal" style={{ color: 'var(--accent)' }}>Closet</span>
        </h2>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          Jelajahi seluruh koleksi Capsule Wardrobe Anda — klik item untuk melihat outfit terkait
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1">
        {Object.entries(categoriesMap).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => { setActiveCategory(key); setSelectedItem(null); }}
            className={`chip ${activeCategory === key ? 'active' : ''}`}
            style={{ fontSize: '14px', padding: '8px 18px' }}
          >
            <span>{cat.icon}</span>
            {cat.label}
            <span className="ml-1 text-xs font-bold rounded-full w-5 h-5 inline-flex items-center justify-center"
              style={{ background: activeCategory === key ? 'rgba(255,255,255,0.25)' : 'var(--border-light)', color: activeCategory === key ? 'white' : 'var(--text-muted)' }}>
              {outfitsData.categories[key].length}
            </span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="card group cursor-pointer"
            onClick={() => setSelectedItem(selectedItem === item ? null : item)}
            style={selectedItem === item ? { borderColor: 'var(--accent)', boxShadow: '0 0 0 2px var(--accent), var(--shadow-md)', transform: 'translateY(-2px)' } : {}}
          >
            <div className="aspect-[3/4] relative overflow-hidden img-overlay" style={{ background: '#f0ece7' }}>
              {imageMap[item] ? (
                <img src={imageMap[item]} alt={item} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-muted)' }}>
                  <span className="text-4xl">{categoriesMap[activeCategory]?.icon || '👕'}</span>
                </div>
              )}
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>{item}</h3>
              <div className="flex items-center gap-1.5">
                <Layers size={12} style={{ color: 'var(--accent)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Dipakai di <strong style={{ color: 'var(--accent)' }}>{itemOutfitCount[item.replace(' (Digulung)', '')] || 0}</strong> outfit
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Related Outfits Panel */}
      {selectedItem && relatedOutfits.length > 0 && (
        <div ref={panelRef}>
          <div className="animate-slide-down">
            <div className="rounded-2xl p-6 space-y-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {imageMap[selectedItem] && (
                    <img src={imageMap[selectedItem]} alt={selectedItem} className="w-10 h-10 rounded-lg object-cover" />
                  )}
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{selectedItem}</h3>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{relatedOutfits.length} kombinasi outfit — klik untuk detail</p>
                  </div>
                </div>
                <button onClick={() => setSelectedItem(null)} className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95" style={{ background: 'var(--border-light)', color: 'var(--text-muted)' }}>
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
                {relatedOutfits.map(outfit => (
                  <MiniOutfitCard key={outfit.id} outfit={outfit} selectedItem={selectedItem} onClick={() => setModalOutfit(outfit)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======= MODAL via Portal — rendered outside component tree ======= */}
      {modalOutfit && createPortal(
        <div
          className={`fixed inset-0 flex items-center justify-center p-4 ${isModalClosing ? 'modal-backdrop-exit' : 'modal-backdrop-enter'}`}
          style={{ zIndex: 9999 }}
          onClick={closeModal}
        >
          {/* Backdrop */}
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }} />

          {/* Modal Card */}
          <div
            className={`relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl hide-scrollbar ${isModalClosing ? 'modal-content-exit' : 'modal-content-enter'}`}
            style={{ background: 'var(--bg-card)', boxShadow: '0 24px 80px rgba(0,0,0,0.3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <ExpandedOutfitCard outfit={modalOutfit} selectedItem={selectedItem} onClose={closeModal} />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

/* Mini Card */
function MiniOutfitCard({ outfit, selectedItem, onClick }) {
  const outfitItems = [
    { label: 'Top', name: outfit.top },
    ...(outfit.outerwear !== '-' ? [{ label: 'Outer', name: outfit.outerwear }] : []),
    { label: 'Bottom', name: outfit.bottom },
    { label: 'Shoes', name: outfit.shoes },
  ];
  const activities = outfit.activity.split(';').map(a => a.trim());
  const [imgError, setImgError] = React.useState(false);
  const outfitPhoto = outfitPhotos[String(outfit.id)];
  const hasOutfitPhoto = !!outfitPhoto && !imgError;

  return (
    <div
      onClick={onClick}
      className="rounded-xl p-4 space-y-3 cursor-pointer"
      style={{ border: '1px solid var(--border-light)', background: 'var(--bg-primary)', transition: 'all 0.4s var(--ease-out-expo)' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
    >
      {hasOutfitPhoto ? (
        <div className="flex gap-1 rounded-lg overflow-hidden h-32">
          <div className="w-[45%] relative">
            <img src={outfitPhoto} onError={() => setImgError(true)} alt={`Outfit #${outfit.id}`} className="w-full h-full object-cover object-top" loading="lazy" />
          </div>
          <div className="w-[55%] grid grid-cols-2 gap-[2px] p-[2px]" style={{ background: 'var(--border-light)' }}>
            {outfitItems.slice(0, 4).map((item, idx) => (
              imageMap[item.name] ? (
                <div key={idx} className="relative overflow-hidden aspect-square">
                  <img src={imageMap[item.name]} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                  {isSameItem(item.name, selectedItem) && <div className="absolute inset-0" style={{ border: '2px solid var(--accent)' }} />}
                </div>
              ) : null
            ))}
          </div>
        </div>
      ) : (
        <div className="flex gap-1 rounded-lg overflow-hidden">
          {outfitItems.map((item, idx) => (
            imageMap[item.name] ? (
              <div key={idx} className="flex-1 aspect-square overflow-hidden relative">
                <img src={imageMap[item.name]} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                {isSameItem(item.name, selectedItem) && <div className="absolute inset-0" style={{ border: '2px solid var(--accent)' }} />}
              </div>
            ) : null
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="badge badge-muted">#{outfit.id}</span>
        <span className="badge badge-gold font-serif italic text-[11px]">{outfit.style}</span>
      </div>
      <div className="space-y-1">
        {outfitItems.map((item, idx) => (
          <div key={idx} className="flex items-baseline gap-2">
            <span className="text-[10px] uppercase tracking-[0.1em] font-semibold w-12 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
            <span className="text-xs" style={{ color: isSameItem(item.name, selectedItem) ? 'var(--accent)' : 'var(--text-primary)', fontWeight: isSameItem(item.name, selectedItem) ? '700' : '500' }}>{item.name}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {activities.map((act, idx) => <span key={idx} className="badge badge-gold text-[10px]">{act}</span>)}
      </div>
    </div>
  );
}

/* Expanded Card (Modal) */
function ExpandedOutfitCard({ outfit, selectedItem, onClose }) {
  const outfitItems = [
    { label: 'Top', name: outfit.top },
    ...(outfit.outerwear !== '-' ? [{ label: 'Outer', name: outfit.outerwear }] : []),
    { label: 'Bottom', name: outfit.bottom },
    { label: 'Shoes', name: outfit.shoes },
  ];
  const activities = outfit.activity.split(';').map(a => a.trim());
  const [imgError, setImgError] = React.useState(false);
  const outfitPhoto = outfitPhotos[String(outfit.id)];
  const hasOutfitPhoto = !!outfitPhoto && !imgError;

  return (
    <>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.85)', color: 'var(--text-secondary)', transition: 'all 0.3s var(--ease-out-expo)', backdropFilter: 'blur(8px)' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.15) rotate(90deg)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1) rotate(0deg)'; }}
      >
        <X size={18} />
      </button>

      {hasOutfitPhoto ? (
        <div className="flex rounded-t-3xl overflow-hidden" style={{ minHeight: '380px' }}>
          <div className="w-[55%] relative group/photo">
            <img src={outfitPhoto} onError={() => setImgError(true)} alt={`Outfit #${outfit.id}`} className="w-full h-full object-cover object-top" loading="lazy"
              style={{ transition: 'transform 0.6s var(--ease-out-expo)' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            />
          </div>
          <div className="w-[45%] flex flex-col gap-[2px] p-[2px]" style={{ background: 'linear-gradient(145deg, #f5f3ef 0%, #eae7e1 100%)' }}>
            {outfitItems.map((item, idx) => (
              imageMap[item.name] ? (
                <div key={idx} className="flex-1 relative overflow-hidden group/item min-h-0">
                  <img src={imageMap[item.name]} alt={item.name} className="w-full h-full object-cover" loading="lazy"
                    style={{ transition: 'transform 0.5s var(--ease-out-expo)' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  <div className="absolute bottom-0 left-0 right-0 px-2 py-1 text-[10px] font-medium text-white opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                    {item.label}: {item.name}
                  </div>
                  {isSameItem(item.name, selectedItem) && <div className="absolute inset-0" style={{ border: '3px solid var(--accent)' }} />}
                </div>
              ) : null
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1 p-2 rounded-t-3xl overflow-hidden" style={{ background: 'linear-gradient(145deg, #f5f3ef 0%, #eae7e1 100%)' }}>
          {outfitItems.slice(0, 4).map((item, idx) => (
            imageMap[item.name] ? (
              <div key={idx} className="relative overflow-hidden rounded-xl group/item" style={{ aspectRatio: '3/4' }}>
                <img src={imageMap[item.name]} alt={item.name} className="w-full h-full object-cover" loading="lazy"
                  style={{ transition: 'transform 0.6s var(--ease-out-expo)' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div className="absolute bottom-0 left-0 right-0 px-3 py-2 text-xs font-medium text-white opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.6))' }}>
                  {item.label}: {item.name}
                </div>
                {isSameItem(item.name, selectedItem) && (
                  <div className="absolute inset-0 rounded-xl" style={{ border: '3px solid var(--accent)', boxShadow: 'inset 0 0 20px rgba(184,134,11,0.15)' }} />
                )}
              </div>
            ) : null
          ))}
          {outfitItems.filter(i => imageMap[i.name]).length < 4 && outfit.watch !== '-' && imageMap[outfit.watch] && (
            <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '3/4' }}>
              <img src={imageMap[outfit.watch]} alt={outfit.watch} className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}
        </div>
      )}

      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <span className="badge badge-muted text-sm">#{outfit.id}</span>
          <span className="badge badge-gold font-serif italic text-sm">{outfit.style}</span>
        </div>
        <div className="space-y-2.5">
          {outfitItems.map((item, idx) => (
            <div key={idx} className="flex items-baseline gap-3">
              <span className="text-[11px] uppercase tracking-[0.12em] font-semibold w-14 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
              <span className="text-sm font-medium" style={{ color: isSameItem(item.name, selectedItem) ? 'var(--accent)' : 'var(--text-primary)', fontWeight: isSameItem(item.name, selectedItem) ? '700' : '500' }}>{item.name}</span>
            </div>
          ))}
          {outfit.watch !== '-' && (
            <div className="flex items-baseline gap-3">
              <span className="text-[11px] uppercase tracking-[0.12em] font-semibold w-14 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>Watch</span>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{outfit.watch}</span>
            </div>
          )}
        </div>
        <div className="pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
          <p className="text-[10px] uppercase tracking-[0.12em] font-semibold mb-2.5" style={{ color: 'var(--text-muted)' }}>Cocok untuk</p>
          <div className="flex flex-wrap gap-2">
            {activities.map((act, idx) => <span key={idx} className="badge badge-gold text-xs">{act}</span>)}
          </div>
        </div>
      </div>
    </>
  );
}
