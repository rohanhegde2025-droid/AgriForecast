"use client";

import React, { useEffect, useRef, useState } from 'react';

interface SoilLayer {
  label: string;
  depth: string;
  color: string;
  barColor: string;
  value: number;
  unit: string;
  detail: string;
}

const SOIL_LAYERS: SoilLayer[] = [
  {
    label: 'Mulch & Organic Matter',
    depth: '0–5 cm',
    color: '#5D4037',
    barColor: '#8D6E63',
    value: 8.4,
    unit: '% OM',
    detail: 'Composted kiwi waste + straw mulch applied post-harvest',
  },
  {
    label: 'Active Root Zone',
    depth: '5–35 cm',
    color: '#2D6A4F',
    barColor: '#40916C',
    value: 94,
    unit: '% coverage',
    detail: 'GPS drip emitters at 0.6 m spacing · 2.1 L/hr per vine',
  },
  {
    label: 'Subsoil Clay Loam',
    depth: '35–80 cm',
    color: '#3E2723',
    barColor: '#6D4C41',
    value: 62,
    unit: '% moisture',
    detail: 'Field capacity maintained 58–65% via tensiometer feedback',
  },
  {
    label: 'Drainage Layer',
    depth: '80–120 cm',
    color: '#1B4332',
    barColor: '#2D6A4F',
    value: 100,
    unit: '% drainage',
    detail: 'Perforated sub-drain at 1.2 m · zero runoff to waterways',
  },
];

const WATER_STATS = [
  { label: 'Irrigation Efficiency', value: '94.2%', note: 'vs. 61% industry avg' },
  { label: 'Water per Tonne Fruit', value: '480 L', note: '−38% since 2019' },
  { label: 'Recycled Runoff', value: '100%', note: 'Closed loop system' },
  { label: 'Sensor Nodes Active', value: '1,240', note: '5 per row average' },
];

const RootSystemSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [barsRevealed, setBarsRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            setTimeout(() => setBarsRevealed(true), 400);
          }
        });
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="operations"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      style={{ background: '#0B1A13' }}
    >
      {/* Blueprint grid */}
      <div className="absolute inset-0 blueprint-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 blueprint-grid-fine opacity-30 pointer-events-none" />

      {/* Noise */}
      <div className="noise-overlay" />

      {/* SVG beam paths */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <path d="M 0 30% Q 20% 50% 0 70%" stroke="rgba(212,160,23,0.08)" strokeWidth="1" fill="none" />
          <path d="M 100% 20% Q 80% 50% 100% 80%" stroke="rgba(212,160,23,0.08)" strokeWidth="1" fill="none" />
          <path d="M 0 30% Q 20% 50% 0 70%" stroke="rgba(212,160,23,0.5)" strokeWidth="1.5" fill="none" className="svg-beam" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div
          className={`mb-16 section-hidden ${visible ? 'section-visible' : ''}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="divider-gold w-8" />
            <span
              className="font-mono uppercase"
              style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(212,160,23,0.7)' }}
            >
              Cross-Section A–A′ · Soil Profile Analysis
            </span>
          </div>
          <h2
            className="font-sans font-light"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#E8F0E4', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            The root system<br />
            <span style={{ color: '#D4A017', fontWeight: 600 }}>runs the numbers.</span>
          </h2>
          <p
            className="mt-4 max-w-xl font-sans"
            style={{ color: 'rgba(232,240,228,0.5)', fontSize: '0.9375rem', lineHeight: 1.7 }}
          >
            Every centimetre of soil is instrumented. Tensiometers, moisture sensors, and
            real-time drip feedback ensure each vine receives exactly what it needs — nothing more.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Soil cross-section diagram */}
          <div
            className={`section-hidden ${visible ? 'section-visible' : ''}`}
            style={{ transitionDelay: '0.2s' }}
          >
            <div
              className="relative rounded-sm overflow-hidden"
              style={{
                border: '1px solid rgba(212,160,23,0.2)',
                background: 'rgba(13,43,31,0.6)',
              }}
            >
              {/* Header bar */}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(212,160,23,0.12)' }}
              >
                <span className="font-mono" style={{ fontSize: '0.6rem', color: 'rgba(212,160,23,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  SOIL PROFILE · BLOCK 7 · HAYWARD VARIETY
                </span>
                <div className="flex gap-1.5">
                  {['#40916C', '#D4A017', '#6D4C41'].map((c, i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ background: c }} />
                  ))}
                </div>
              </div>

              {/* Layers */}
              <div className="p-5 flex flex-col gap-3">
                {SOIL_LAYERS.map((layer, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-sm annotation-dot"
                          style={{ background: layer.color, border: `1px solid ${layer.barColor}` }}
                        />
                        <span className="font-mono" style={{ fontSize: '0.65rem', color: 'rgba(232,240,228,0.7)', letterSpacing: '0.1em' }}>
                          {layer.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono" style={{ fontSize: '0.6rem', color: 'rgba(232,240,228,0.35)', letterSpacing: '0.1em' }}>
                          {layer.depth}
                        </span>
                        <span className="font-mono" style={{ fontSize: '0.7rem', color: '#D4A017', fontWeight: 600 }}>
                          {layer.value}{layer.unit}
                        </span>
                      </div>
                    </div>
                    {/* Bar */}
                    <div
                      className="h-2 rounded-sm overflow-hidden"
                      style={{ background: 'rgba(232,240,228,0.06)' }}
                    >
                      <div
                        className={`h-full rounded-sm soil-bar ${barsRevealed ? 'revealed' : ''}`}
                        style={{
                          width: `${layer.value}%`,
                          background: `linear-gradient(90deg, ${layer.barColor}, ${layer.barColor}cc)`,
                          transitionDelay: `${i * 0.18}s`,
                        }}
                      />
                    </div>
                    <p
                      className="font-mono"
                      style={{ fontSize: '0.58rem', color: 'rgba(232,240,228,0.3)', letterSpacing: '0.08em' }}
                    >
                      // {layer.detail}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div
                className="px-5 py-3 flex items-center gap-4"
                style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}
              >
                <span className="font-mono" style={{ fontSize: '0.55rem', color: 'rgba(232,240,228,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Data sampled 06:15 NZDT · 25 Feb 2026 · Node ID 7-04-A
                </span>
              </div>
            </div>
          </div>

          {/* Right: Water stats */}
          <div
            className={`section-hidden ${visible ? 'section-visible' : ''}`}
            style={{ transitionDelay: '0.4s' }}
          >
            <div className="grid grid-cols-2 gap-3 mb-8">
              {WATER_STATS.map((stat, i) => (
                <div
                  key={i}
                  className="metric-panel px-5 py-4 flex flex-col gap-1"
                  style={{ transitionDelay: `${0.5 + i * 0.1}s` }}
                >
                  <span
                    className="font-mono"
                    style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#D4A017', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}
                  >
                    {stat.value}
                  </span>
                  <span className="metric-label mt-1">{stat.label}</span>
                  <span
                    className="font-mono"
                    style={{ fontSize: '0.58rem', color: '#40916C', letterSpacing: '0.1em' }}
                  >
                    {stat.note}
                  </span>
                </div>
              ))}
            </div>

            {/* Irrigation schematic text */}
            <div
              className="p-5 rounded-sm"
              style={{
                background: 'rgba(27,67,50,0.3)',
                border: '1px solid rgba(212,160,23,0.12)',
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-1.5 h-1.5 rounded-full annotation-dot"
                  style={{ background: '#D4A017' }}
                />
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(212,160,23,0.7)' }}
                >
                  Drip Irrigation System
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {[
                  '248 km of drip tape across all blocks',
                  'Pressure-compensated emitters: ±2% variance',
                  'Fertigation integrated: EC & pH auto-adjusted',
                  'Frost protection: sub-canopy micro-sprinklers',
                  'Zero-discharge: 100% return to holding pond',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-mono mt-0.5" style={{ color: '#D4A017', fontSize: '0.6rem', flexShrink: 0 }}>→</span>
                    <span className="font-mono" style={{ fontSize: '0.7rem', color: 'rgba(232,240,228,0.55)', lineHeight: 1.5 }}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RootSystemSection;
