"use client";

import React, { useEffect, useRef, useState } from 'react';

interface CertItem {
  code: string;
  name: string;
  status: string;
  issued: string;
  expires: string;
  body: string;
  color: string;
}

const CERTS: CertItem[] = [
  {
    code: 'GGN-4050373',
    name: 'GlobalG.A.P.',
    status: 'CERTIFIED',
    issued: '2025-04-01',
    expires: '2026-03-31',
    body: 'Bureau Veritas NZ',
    color: '#40916C',
  },
  {
    code: 'ORG-BOP-0847',
    name: 'Organic NZ',
    status: 'CERTIFIED',
    issued: '2025-05-15',
    expires: '2026-05-14',
    body: 'AsureQuality Ltd',
    color: '#D4A017',
  },
  {
    code: 'HZP-NZ-2208',
    name: 'Hazard Analysis (HACCP)',
    status: 'COMPLIANT',
    issued: '2024-11-01',
    expires: '2026-10-31',
    body: 'MPI New Zealand',
    color: '#2D6A4F',
  },
  {
    code: 'CARBON-SEQ-112',
    name: 'Carbon Sequestration',
    status: 'REGISTERED',
    issued: '2025-01-10',
    expires: 'ONGOING',
    body: 'Toitū Envirocare',
    color: '#8D6E63',
  },
];

const AUDIT_TRAIL = [
  { date: 'Feb 20, 2026', event: 'Spray diary audit — Block 12–18', status: 'PASS', auditor: 'A. Patel' },
  { date: 'Jan 15, 2026', event: 'Irrigation system inspection', status: 'PASS', auditor: 'K. Tūhoe' },
  { date: 'Dec 03, 2025', event: 'Harvest Brix sampling — 480 samples', status: 'PASS', auditor: 'M. Chen' },
  { date: 'Oct 28, 2025', event: 'Soil health profiling — All blocks', status: 'PASS', auditor: 'R. Ngāti' },
  { date: 'Sep 11, 2025', event: 'Water usage & discharge audit', status: 'PASS', auditor: 'J. Williams' },
];

const BIODIVERSITY = [
  { label: 'Native Corridor Ha', value: '18.4', trend: '+2.1 ha since 2023' },
  { label: 'Pollinator Species', value: '34', trend: 'Monitored annually' },
  { label: 'Carbon Sequestered', value: '412 t', trend: 'CO₂-eq per annum' },
  { label: 'Waterway Setback', value: '20 m', trend: 'Exceeds 10m minimum' },
];

const CertificationSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setVisible(true);
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="certification"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      style={{ background: '#0B1A13' }}
    >
      {/* Grid */}
      <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />
      <div className="noise-overlay" />

      {/* SVG beam */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(212,160,23,0.05)" strokeWidth="1" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(212,160,23,0.4)" strokeWidth="1.5" className="svg-beam svg-beam-2" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`mb-16 section-hidden ${visible ? 'section-visible' : ''}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="divider-gold w-8" />
            <span
              className="font-mono uppercase"
              style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(212,160,23,0.7)' }}
            >
              Compliance Registry · All Certifications Current
            </span>
          </div>
          <h2
            className="font-sans font-light"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#E8F0E4', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Every spray diary.<br />
            <span style={{ color: '#D4A017', fontWeight: 600 }}>Every audit. Passed.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Certifications */}
          <div className={`section-hidden ${visible ? 'section-visible' : ''}`} style={{ transitionDelay: '0.2s' }}>
            <div className="flex flex-col gap-3">
              {CERTS.map((cert, i) => (
                <div
                  key={i}
                  className="cert-badge px-5 py-4 rounded-sm flex items-start justify-between gap-4"
                  style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full annotation-dot"
                        style={{ background: cert.color }}
                      />
                      <span
                        className="font-sans font-semibold"
                        style={{ fontSize: '0.875rem', color: '#E8F0E4' }}
                      >
                        {cert.name}
                      </span>
                    </div>
                    <span
                      className="font-mono"
                      style={{ fontSize: '0.6rem', color: 'rgba(232,240,228,0.4)', letterSpacing: '0.1em' }}
                    >
                      {cert.code} · {cert.body}
                    </span>
                    <span
                      className="font-mono"
                      style={{ fontSize: '0.6rem', color: 'rgba(232,240,228,0.3)', letterSpacing: '0.08em' }}
                    >
                      Issued {cert.issued} · Expires {cert.expires}
                    </span>
                  </div>
                  <div
                    className="flex-shrink-0 px-3 py-1 rounded-sm font-mono"
                    style={{
                      fontSize: '0.55rem',
                      letterSpacing: '0.2em',
                      color: cert.color,
                      border: `1px solid ${cert.color}40`,
                      background: `${cert.color}15`,
                    }}
                  >
                    {cert.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Audit trail + biodiversity */}
          <div className={`flex flex-col gap-6 section-hidden ${visible ? 'section-visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
            {/* Audit trail */}
            <div
              className="rounded-sm overflow-hidden"
              style={{ border: '1px solid rgba(212,160,23,0.15)', background: 'rgba(13,43,31,0.5)' }}
            >
              <div
                className="px-5 py-3 flex items-center gap-2"
                style={{ borderBottom: '1px solid rgba(212,160,23,0.1)' }}
              >
                <div className="vertical-beam" />
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(212,160,23,0.7)' }}
                >
                  Audit Log · 2025–2026
                </span>
              </div>
              <div className="flex flex-col">
                {AUDIT_TRAIL.map((entry, i) => (
                  <div
                    key={i}
                    className="px-5 py-3 flex items-start gap-4"
                    style={{
                      borderBottom: i < AUDIT_TRAIL.length - 1 ? '1px solid rgba(212,160,23,0.06)' : 'none',
                    }}
                  >
                    <div className="flex flex-col gap-0.5 flex-shrink-0" style={{ minWidth: 80 }}>
                      <span className="font-mono" style={{ fontSize: '0.58rem', color: 'rgba(232,240,228,0.35)', letterSpacing: '0.05em' }}>
                        {entry.date}
                      </span>
                    </div>
                    <div className="flex-1">
                      <span className="font-sans" style={{ fontSize: '0.75rem', color: 'rgba(232,240,228,0.7)' }}>
                        {entry.event}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono" style={{ fontSize: '0.58rem', color: 'rgba(232,240,228,0.3)' }}>
                          Auditor: {entry.auditor}
                        </span>
                      </div>
                    </div>
                    <div
                      className="flex-shrink-0 font-mono px-2 py-0.5 rounded-sm"
                      style={{
                        fontSize: '0.55rem',
                        letterSpacing: '0.15em',
                        color: '#40916C',
                        border: '1px solid rgba(64,145,108,0.3)',
                        background: 'rgba(64,145,108,0.08)',
                      }}
                    >
                      {entry.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Biodiversity */}
            <div className="grid grid-cols-2 gap-3">
              {BIODIVERSITY.map((item, i) => (
                <div
                  key={i}
                  className="metric-panel px-4 py-3 flex flex-col gap-1"
                >
                  <span
                    className="font-mono font-bold"
                    style={{ fontSize: '1.5rem', color: '#D4A017', lineHeight: 1, letterSpacing: '-0.02em' }}
                  >
                    {item.value}
                  </span>
                  <span className="metric-label">{item.label}</span>
                  <span
                    className="font-mono"
                    style={{ fontSize: '0.58rem', color: '#40916C', letterSpacing: '0.06em' }}
                  >
                    {item.trend}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;
