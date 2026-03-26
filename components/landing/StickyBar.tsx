"use client";

import React, { useEffect, useState } from 'react';

const StickyBar: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero');
      if (!hero) return;
      const heroBottom = hero.getBoundingClientRect().bottom;
      setVisible(heroBottom < 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`sticky-bar fixed bottom-0 left-0 right-0 z-40 ${visible ? 'visible' : ''}`}
      style={{
        background: 'rgba(11, 26, 19, 0.96)',
        borderTop: '1px solid rgba(212,160,23,0.3)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div
            className="w-1.5 h-1.5 rounded-full gold-pulse"
            style={{ background: '#D4A017', flexShrink: 0 }}
          />
          <span
            className="font-mono"
            style={{ fontSize: '0.65rem', color: 'rgba(232,240,228,0.6)', letterSpacing: '0.15em', textTransform: 'uppercase' }}
          >
            2026 Season Contracts Now Open · Limited Export Allocation Remaining
          </span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="#spec-sheet"
            className="btn-ghost px-4 py-2 text-xs rounded-sm"
            style={{ fontSize: '0.65rem' }}
          >
            <span>Spec Sheet</span>
          </a>
          <a
            href="/dashboard"
            className="btn-gold px-5 py-2 text-xs rounded-sm shadow-xl"
            style={{ fontSize: '0.65rem' }}
          >
            <span>Launch Dashboard</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default StickyBar;