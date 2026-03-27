"use client";

import React, { useEffect, useRef, useState } from 'react';

interface Annotation {
  id: string;
  x: number;
  y: number;
  label: string;
  value: string;
  lineX2: number;
  lineY2: number;
  align: 'left' | 'right';
}

const ANNOTATIONS: Annotation[] = [
  { id: 'a1', x: 28, y: 22, label: 'Trellis Height', value: '1.8 m', lineX2: 8, lineY2: 22, align: 'left' },
  { id: 'a2', x: 72, y: 22, label: 'Canopy Width', value: '4.5 m', lineX2: 92, lineY2: 22, align: 'right' },
  { id: 'a3', x: 50, y: 65, label: 'Drip Emitter', value: '0.6 m spacing', lineX2: 70, lineY2: 75, align: 'right' },
  { id: 'a4', x: 20, y: 75, label: 'Row Spacing', value: '5.0 m GPS', lineX2: 5, lineY2: 85, align: 'left' },
  { id: 'a5', x: 50, y: 40, label: 'Avg Brix', value: '16.2 °Bx', lineX2: 75, lineY2: 30, align: 'right' },
];

const CANOPY_STATS = [
  { label: 'Vine Rows', value: '1,488', unit: 'rows', sub: 'GPS-mapped at 5m spacing' },
  { label: 'Canes per Vine', value: '8–10', unit: 'avg', sub: 'Hayward & Hort16A' },
  { label: 'Fruit per Cane', value: '18–22', unit: 'count', sub: 'Target 3.5 kg/vine' },
  { label: 'Harvest Window', value: '21 days', unit: '±2 days', sub: 'April 15 – May 6 est.' },
];

const CanopyBlueprintSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [drawnLines, setDrawnLines] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            ANNOTATIONS.forEach((ann, i) => {
              setTimeout(() => {
                setDrawnLines((prev) => new Set([...Array.from(prev), ann.id]));
              }, 600 + i * 150);
            });
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
      id="canopy"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      style={{ background: '#0B1A13' }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(27,67,50,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(27,67,50,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`mb-16 section-hidden ${visible ? 'section-visible' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-px"
              style={{ background: 'linear-gradient(90deg, #1B4332, transparent)' }}
            />
            <span
              className="font-mono uppercase"
              style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(27,67,50,0.6)' }}
            >
              Drawing No. ORC-2026-CANOPY-01 · Scale 1:200
            </span>
          </div>
          <h2
            className="font-sans font-light"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#E8F0E4', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Trellis architecture.<br />
            <span style={{ color: '#D4A017', fontWeight: 600 }}>Engineered for yield.</span>
          </h2>
          <p
            className="mt-4 max-w-xl font-sans"
            style={{ color: 'rgba(232,240,228,0.5)', fontSize: '0.9375rem', lineHeight: 1.7 }}
          >
            Every T-bar, wire tension, and cane placement follows a precision protocol developed
            over 14 seasons. The canopy is a solar collector — optimised for photosynthesis,
            not aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Blueprint SVG diagram */}
          <div
            className={`lg:col-span-3 section-hidden ${visible ? 'section-visible' : ''}`}
            style={{ transitionDelay: '0.2s' }}
          >
            <div
              className="relative rounded-sm overflow-hidden"
              style={{
                background: 'rgba(11, 26, 19, 0.4)',
                border: '1px solid rgba(212,160,23,0.2)',
              }}
            >
              {/* Title bar */}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{
                  background: '#1B4332',
                  borderBottom: '2px solid #D4A017',
                }}
              >
                <span className="font-mono" style={{ fontSize: '0.6rem', color: 'rgba(232,240,228,0.8)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  T-Bar Trellis System · Cross-Section B–B′
                </span>
                <span className="font-mono" style={{ fontSize: '0.55rem', color: 'rgba(212,160,23,0.8)', letterSpacing: '0.15em' }}>
                  DWG-ORC-0042
                </span>
              </div>

              {/* SVG Blueprint */}
              <div className="p-4">
                <svg viewBox="0 0 400 220" className="w-full" style={{ height: 'auto' }}>
                  {/* Grid */}
                  {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((x) => (
                    <line key={`gx-${x}`} x1={x} y1={0} x2={x} y2={220} stroke="rgba(27,67,50,0.07)" strokeWidth="1" />
                  ))}
                  {[0, 40, 80, 120, 160, 200].map((y) => (
                    <line key={`gy-${y}`} x1={0} y1={y} x2={400} y2={y} stroke="rgba(27,67,50,0.07)" strokeWidth="1" />
                  ))}

                  {/* Ground line */}
                  <line x1={10} y1={175} x2={390} y2={175} stroke="#3E2723" strokeWidth="2" />
                  <text x={15} y={188} fill="rgba(62,39,35,0.5)" fontSize="7" fontFamily="JetBrains Mono">GROUND LEVEL ±0.00</text>

                  {/* Posts */}
                  {[80, 200, 320].map((x) => (
                    <g key={`post-${x}`}>
                      <rect x={x - 3} y={100} width={6} height={75} fill="#3E2723" rx={1} />
                      {/* T-bar */}
                      <rect x={x - 40} y={98} width={80} height={4} fill="#3E2723" rx={1} />
                      {/* Post base */}
                      <rect x={x - 6} y={168} width={12} height={8} fill="#5D4037" rx={1} />
                    </g>
                  ))}

                  {/* Trellis wires */}
                  {[50, 60, 70].map((y, i) => (
                    <line key={`wire-${i}`} x1={40} y1={y} x2={360} y2={y} stroke="#40916C" strokeWidth="0.8" strokeDasharray="4 2" />
                  ))}

                  {/* Canopy mass */}
                  <ellipse cx={200} cy={60} rx={170} ry={32} fill="rgba(64,145,108,0.15)" stroke="rgba(64,145,108,0.4)" strokeWidth="1" />

                  {/* Vines */}
                  {[80, 140, 200, 260, 320].map((x) => (
                    <g key={`vine-${x}`}>
                      <path d={`M ${x} 175 Q ${x - 10} 130 ${x - 20} 65`} stroke="#2D6A4F" strokeWidth="1" fill="none" />
                      <path d={`M ${x} 175 Q ${x + 10} 130 ${x + 20} 65`} stroke="#2D6A4F" strokeWidth="1" fill="none" />
                      {/* Kiwifruit */}
                      {[-15, 0, 15].map((offset, j) => (
                        <ellipse key={j} cx={x + offset} cy={62 + (j % 2) * 8} rx={5} ry={7} fill="rgba(93,64,55,0.6)" stroke="#6D4C41" strokeWidth="0.8" />
                      ))}
                    </g>
                  ))}

                  {/* Drip tape */}
                  <line x1={40} y1={155} x2={360} y2={155} stroke="#D4A017" strokeWidth="1" strokeDasharray="2 4" />
                  {[80, 140, 200, 260, 320].map((x) => (
                    <circle key={`drip-${x}`} cx={x} cy={155} r={2.5} fill="#D4A017" opacity={0.7} />
                  ))}

                  {/* Annotation lines */}
                  {ANNOTATIONS.map((ann) => {
                    const x1 = (ann.x / 100) * 400;
                    const y1 = (ann.y / 100) * 220;
                    const x2 = (ann.lineX2 / 100) * 400;
                    const y2 = (ann.lineY2 / 100) * 220;
                    const isDrawn = drawnLines.has(ann.id);
                    return (
                      <g key={ann.id}>
                        <line
                          x1={x1} y1={y1} x2={x2} y2={y2}
                          stroke="rgba(212,160,23,0.6)" strokeWidth="0.8"
                          strokeDasharray={isDrawn ? 'none' : '200'}
                          strokeDashoffset={isDrawn ? '0' : '200'}
                          style={{ transition: 'stroke-dashoffset 1s ease' }}
                        />
                        <circle cx={x1} cy={y1} r={2} fill="#D4A017" opacity={isDrawn ? 1 : 0} style={{ transition: 'opacity 0.4s ease 0.6s' }} />
                        <text
                          x={x2 + (ann.align === 'right' ? 4 : -4)}
                          y={y2 - 4}
                          fill={isDrawn ? 'rgba(232,240,228,0.6)' : 'transparent'}
                          fontSize="6"
                          fontFamily="JetBrains Mono"
                          textAnchor={ann.align === 'right' ? 'start' : 'end'}
                          style={{ transition: 'fill 0.4s ease 0.8s' }}
                        >
                          {ann.label}
                        </text>
                        <text
                          x={x2 + (ann.align === 'right' ? 4 : -4)}
                          y={y2 + 6}
                          fill={isDrawn ? '#D4A017' : 'transparent'}
                          fontSize="7"
                          fontFamily="JetBrains Mono"
                          fontWeight="600"
                          textAnchor={ann.align === 'right' ? 'start' : 'end'}
                          style={{ transition: 'fill 0.4s ease 0.8s' }}
                        >
                          {ann.value}
                        </text>
                      </g>
                    );
                  })}

                  {/* Scale bar */}
                  <line x1={330} y1={210} x2={380} y2={210} stroke="#3E2723" strokeWidth="1.5" />
                  <line x1={330} y1={206} x2={330} y2={214} stroke="#3E2723" strokeWidth="1.5" />
                  <line x1={380} y1={206} x2={380} y2={214} stroke="#3E2723" strokeWidth="1.5" />
                  <text x={355} y={208} fill="rgba(62,39,35,0.6)" fontSize="6" fontFamily="JetBrains Mono" textAnchor="middle">5 m</text>
                </svg>
              </div>

              {/* Legend */}
              <div
                className="px-5 py-3 flex flex-wrap gap-4"
                style={{ borderTop: '1px solid rgba(27,67,50,0.1)', background: 'rgba(27,67,50,0.03)' }}
              >
                {[
                  { color: '#3E2723', label: 'T-Bar Structure' },
                  { color: '#40916C', label: 'Trellis Wire' },
                  { color: '#D4A017', label: 'Drip Tape' },
                  { color: 'rgba(64,145,108,0.4)', label: 'Canopy Zone' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-3 h-1 rounded-sm" style={{ background: item.color }} />
                    <span className="font-mono" style={{ fontSize: '0.58rem', color: 'rgba(232,240,228,0.4)', letterSpacing: '0.08em' }}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Stats */}
          <div
            className={`lg:col-span-2 flex flex-col gap-4 section-hidden ${visible ? 'section-visible' : ''}`}
            style={{ transitionDelay: '0.4s' }}
          >
            {CANOPY_STATS.map((stat, i) => (
              <div
                key={i}
                className="stagger-child px-5 py-4 rounded-sm"
                style={{
                  background: 'rgba(27,67,50,0.06)',
                  border: '1px solid rgba(27,67,50,0.12)',
                  transitionDelay: `${0.5 + i * 0.1}s`,
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.7s ease, transform 0.7s ease',
                }}
              >
                <div className="flex items-start justify-between mb-1">
                  <span
                    className="font-sans font-medium"
                    style={{ fontSize: '0.8125rem', color: '#E8F0E4' }}
                  >
                    {stat.label}
                  </span>
                  <span
                    className="font-mono"
                    style={{ fontSize: '0.6rem', color: 'rgba(27,67,50,0.4)', letterSpacing: '0.1em' }}
                  >
                    {stat.unit}
                  </span>
                </div>
                <div
                  className="font-mono font-bold"
                  style={{ fontSize: '1.75rem', color: '#D4A017', lineHeight: 1, letterSpacing: '-0.02em' }}
                >
                  {stat.value}
                </div>
                <div
                  className="font-mono mt-1"
                  style={{ fontSize: '0.65rem', color: 'rgba(232,240,228,0.4)', letterSpacing: '0.05em' }}
                >
                  {stat.sub}
                </div>
              </div>
            ))}

            {/* Marquee strip */}
            <div
              className="overflow-hidden rounded-sm py-3"
              style={{
                background: '#1B4332',
                border: '1px solid rgba(212,160,23,0.15)',
              }}
            >
              <div className="marquee-track flex items-center gap-8 whitespace-nowrap">
                {[
                  'HAYWARD', 'HORT16A', 'ZESPRI GREEN', 'ZESPRI GOLD',
                  'BRIX 16.2°', 'GLOBALGAP', 'ORGANIC CERTIFIED', 'EXPORT GRADE 1',
                  'HAYWARD', 'HORT16A', 'ZESPRI GREEN', 'ZESPRI GOLD',
                  'BRIX 16.2°', 'GLOBALGAP', 'ORGANIC CERTIFIED', 'EXPORT GRADE 1',
                ].map((item, i) => (
                  <span
                    key={i}
                    className="font-mono"
                    style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'rgba(212,160,23,0.6)', flexShrink: 0 }}
                  >
                    {item} ·
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CanopyBlueprintSection;
