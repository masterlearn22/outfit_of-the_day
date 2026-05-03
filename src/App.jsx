import React, { useState } from 'react';
import DigitalCloset from './components/DigitalCloset';
import Lookbook from './components/Lookbook';
import outfitsData from './data/outfits.json';
import { Shirt, BookOpen, Sparkles } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('lookbook');

  // Stats
  const totalOutfits = outfitsData.outfits.length;
  const totalItems = Object.values(outfitsData.categories).flat().length;
  const totalStyles = new Set(outfitsData.outfits.map(o => o.style)).size;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[var(--border-light)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Top Row */}
          <div className="h-[72px] flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                  Surya's <span className="font-serif italic font-normal" style={{ color: 'var(--accent)' }}>Wardrobe</span>
                </h1>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('lookbook')}
                className="relative px-5 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2 rounded-full"
                style={{
                  background: activeTab === 'lookbook' ? 'var(--accent)' : 'transparent',
                  color: activeTab === 'lookbook' ? 'white' : 'var(--text-secondary)',
                  boxShadow: activeTab === 'lookbook' ? '0 2px 10px rgba(184,134,11,0.25)' : 'none',
                }}
              >
                <BookOpen size={16} /> Lookbook
              </button>
              <button
                onClick={() => setActiveTab('closet')}
                className="relative px-5 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2 rounded-full"
                style={{
                  background: activeTab === 'closet' ? 'var(--accent)' : 'transparent',
                  color: activeTab === 'closet' ? 'white' : 'var(--text-secondary)',
                  boxShadow: activeTab === 'closet' ? '0 2px 10px rgba(184,134,11,0.25)' : 'none',
                }}
              >
                <Shirt size={16} /> Closet
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="border-b border-[var(--border-light)] bg-white/50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-center gap-8 text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
          <span><strong className="text-base font-bold mr-1" style={{ color: 'var(--accent)' }}>{totalOutfits}</strong>Outfits</span>
          <span className="w-px h-4 bg-[var(--border)]"></span>
          <span><strong className="text-base font-bold mr-1" style={{ color: 'var(--accent)' }}>{totalItems}</strong>Items</span>
          <span className="w-px h-4 bg-[var(--border)]"></span>
          <span><strong className="text-base font-bold mr-1" style={{ color: 'var(--accent)' }}>{totalStyles}</strong>Styles</span>
        </div>
      </div>

      {/* Main Content */}
      <main key={activeTab} className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 py-10 animate-content-swap">
        {activeTab === 'lookbook' ? <Lookbook /> : <DigitalCloset />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-light)] py-6">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>Capsule Wardrobe V3</span>
          <span>Curated by <strong style={{ color: 'var(--accent)' }}>Surya</strong></span>
        </div>
      </footer>
    </div>
  );
}

export default App;
