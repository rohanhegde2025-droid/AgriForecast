"use client";

import React, { useEffect, useRef, useState } from 'react';

type ContactMethod = 'email' | 'phone';

interface FormState {
  company: string;
  volume: string;
  market: string;
  contactMethod: ContactMethod;
  email: string;
  phone: string;
  submitted: boolean;
  submitting: boolean;
}

interface SpecFormState {
  email: string;
  submitted: boolean;
  submitting: boolean;
}

const ProcurementSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  const [form, setForm] = useState<FormState>({
    company: '',
    volume: '',
    market: '',
    contactMethod: 'email',
    email: '',
    phone: '',
    submitted: false,
    submitting: false,
  });

  const [specForm, setSpecForm] = useState<SpecFormState>({
    email: '',
    submitted: false,
    submitting: false,
  });

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForm((prev) => ({ ...prev, submitting: true }));
    // Mock submit — connect to backend here
    setTimeout(() => {
      setForm((prev) => ({ ...prev, submitting: false, submitted: true }));
    }, 1400);
  };

  const handleSpecSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSpecForm((prev) => ({ ...prev, submitting: true }));
    // Mock submit — connect to backend here
    setTimeout(() => {
      setSpecForm((prev) => ({ ...prev, submitting: false, submitted: true }));
    }, 1200);
  };

  const inputStyle = {
    padding: '12px 16px',
    borderRadius: '2px',
    width: '100%',
    fontSize: '0.8125rem',
  };

  return (
    <section
      id="procurement"
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      style={{ background: '#0B1A13' }}
    >
      {/* Grid */}
      <div className="absolute inset-0 blueprint-grid opacity-40 pointer-events-none" />
      <div className="noise-overlay" />

      {/* Beams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {[20, 50, 80].map((pct, i) => (
            <line
              key={i}
              x1={`${pct}%`} y1="0%" x2={`${pct}%`} y2="100%"
              stroke="rgba(212,160,23,0.04)" strokeWidth="1"
            />
          ))}
          <line x1="20%" y1="0%" x2="20%" y2="100%" stroke="rgba(212,160,23,0.4)" strokeWidth="1.5" className="svg-beam svg-beam-3" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`mb-16 text-center section-hidden ${visible ? 'section-visible' : ''}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="divider-gold w-8" />
            <span
              className="font-mono uppercase"
              style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: 'rgba(212,160,23,0.7)' }}
            >
              2026 Season · Procurement Enquiries Open
            </span>
            <div className="divider-gold w-8" />
          </div>
          <h2
            className="font-sans font-light"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#E8F0E4', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Two paths into<br />
            <span style={{ color: '#D4A017', fontWeight: 600 }}>the orchard.</span>
          </h2>
          <p
            className="mt-4 mx-auto max-w-lg font-sans"
            style={{ color: 'rgba(232,240,228,0.5)', fontSize: '0.9375rem', lineHeight: 1.7 }}
          >
            Ready to discuss volumes? Request the full harvest forecast.
            Not quite there? Download the spec sheet first.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Primary: Harvest Forecast Form ── */}
          <div
            className={`section-hidden ${visible ? 'section-visible' : ''}`}
            style={{ transitionDelay: '0.2s' }}
          >
            <div
              className="rounded-sm overflow-hidden h-full"
              style={{ border: '1px solid rgba(212,160,23,0.2)', background: 'rgba(27,67,50,0.35)' }}
            >
              {/* Header */}
              <div
                className="px-6 py-4"
                style={{ background: '#1B4332', borderBottom: '2px solid #D4A017' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full gold-pulse"
                    style={{ background: '#D4A017', flexShrink: 0 }}
                  />
                  <h3
                    className="font-mono uppercase"
                    style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#E8F0E4' }}
                  >
                    Request Our Harvest Forecast
                  </h3>
                </div>
                <p
                  className="mt-2 font-sans"
                  style={{ fontSize: '0.8125rem', color: 'rgba(232,240,228,0.55)', lineHeight: 1.5 }}
                >
                  Receive variety-specific tonnage projections, Brix forecasts, and
                  seasonal availability windows for the 2026 harvest.
                </p>
              </div>

              <div className="p-6">
                {form.submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(64,145,108,0.15)', border: '1px solid rgba(64,145,108,0.4)' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M4 10l4 4 8-8" stroke="#40916C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="font-mono uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: '#40916C' }}>
                        Request Received
                      </p>
                      <p className="font-sans mt-2" style={{ fontSize: '0.8125rem', color: 'rgba(232,240,228,0.55)' }}>
                        Our procurement team will contact you within 24 hours with your personalised harvest forecast.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                    {/* Company */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-mono"
                        style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(212,160,23,0.7)', textTransform: 'uppercase' }}
                      >
                        Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Freshmax Pacific Ltd"
                        className="field-input"
                        style={inputStyle}
                        value={form.company}
                        onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
                      />
                    </div>

                    {/* Volume */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-mono"
                        style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(212,160,23,0.7)', textTransform: 'uppercase' }}
                      >
                        Procurement Volume Range *
                      </label>
                      <select
                        required
                        className="field-select"
                        style={inputStyle}
                        value={form.volume}
                        onChange={(e) => setForm((p) => ({ ...p, volume: e.target.value }))}
                      >
                        <option value="" disabled>Select volume range</option>
                        <option value="50-500t">50 – 500 tonnes</option>
                        <option value="500-2000t">500 – 2,000 tonnes</option>
                        <option value="2000t+">2,000+ tonnes</option>
                      </select>
                    </div>

                    {/* Market */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-mono"
                        style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(212,160,23,0.7)', textTransform: 'uppercase' }}
                      >
                        Target Market *
                      </label>
                      <select
                        required
                        className="field-select"
                        style={inputStyle}
                        value={form.market}
                        onChange={(e) => setForm((p) => ({ ...p, market: e.target.value }))}
                      >
                        <option value="" disabled>Select target market</option>
                        <option value="domestic">Domestic (NZ)</option>
                        <option value="export">Export</option>
                        <option value="both">Both</option>
                      </select>
                    </div>

                    {/* Contact method toggle */}
                    <div className="flex flex-col gap-2">
                      <label
                        className="font-mono"
                        style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(212,160,23,0.7)', textTransform: 'uppercase' }}
                      >
                        Preferred Contact Method
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, contactMethod: 'email' }))}
                          className="flex items-center gap-2 px-4 py-2 rounded-sm font-mono transition-all duration-200"
                          style={{
                            fontSize: '0.65rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            background: form.contactMethod === 'email' ? 'rgba(212,160,23,0.12)' : 'transparent',
                            border: `1px solid ${form.contactMethod === 'email' ? 'rgba(212,160,23,0.5)' : 'rgba(232,240,228,0.1)'}`,
                            color: form.contactMethod === 'email' ? '#D4A017' : 'rgba(232,240,228,0.4)',
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <rect x="1" y="2" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1" />
                            <path d="M1 4l5 3 5-3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                          </svg>
                          Email
                        </button>
                        <button
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, contactMethod: 'phone' }))}
                          className="flex items-center gap-2 px-4 py-2 rounded-sm font-mono transition-all duration-200"
                          style={{
                            fontSize: '0.65rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            background: form.contactMethod === 'phone' ? 'rgba(212,160,23,0.12)' : 'transparent',
                            border: `1px solid ${form.contactMethod === 'phone' ? 'rgba(212,160,23,0.5)' : 'rgba(232,240,228,0.1)'}`,
                            color: form.contactMethod === 'phone' ? '#D4A017' : 'rgba(232,240,228,0.4)',
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 2h3l1 3-2 1c.5 1.5 2 3 3.5 3.5l1-2 3 1v3c-4 .5-9-3-9.5-9.5z" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Phone
                        </button>
                      </div>
                    </div>

                    {/* Contact field */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-mono"
                        style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(212,160,23,0.7)', textTransform: 'uppercase' }}
                      >
                        {form.contactMethod === 'email' ? 'Email Address *' : 'Phone Number *'}
                      </label>
                      {form.contactMethod === 'email' ? (
                        <input
                          type="email"
                          required
                          placeholder="procurement@freshmax.co.nz"
                          className="field-input"
                          style={inputStyle}
                          value={form.email}
                          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        />
                      ) : (
                        <input
                          type="tel"
                          required
                          placeholder="+64 9 555 0123"
                          className="field-input"
                          style={inputStyle}
                          value={form.phone}
                          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                        />
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={form.submitting}
                      className="btn-gold px-6 py-4 text-sm rounded-sm flex items-center justify-center gap-3 mt-2"
                      style={{ opacity: form.submitting ? 0.7 : 1 }}
                    >
                      <span>
                        {form.submitting ? 'Sending Request...' : 'Request Our Harvest Forecast'}
                      </span>
                      {!form.submitting && (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>

                    <p
                      className="font-mono text-center"
                      style={{ fontSize: '0.58rem', color: 'rgba(232,240,228,0.25)', letterSpacing: '0.1em' }}
                    >
                      Your data is used solely for procurement correspondence. Never shared.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* ── Secondary: Spec Sheet Download ── */}
          <div
            id="spec-sheet"
            className={`flex flex-col gap-6 section-hidden ${visible ? 'section-visible' : ''}`}
            style={{ transitionDelay: '0.4s' }}
          >
            {/* Spec card */}
            <div
              className="spec-card rounded-sm overflow-hidden"
            >
              {/* Preview */}
              <div
                className="relative px-6 py-8 flex flex-col gap-2"
                style={{ background: 'linear-gradient(135deg, rgba(27,67,50,0.8), rgba(13,43,31,0.95))' }}
              >
                <div className="absolute inset-0 blueprint-grid opacity-40" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <svg width="32" height="40" viewBox="0 0 32 40" fill="none">
                      <rect x="1" y="1" width="30" height="38" rx="2" stroke="rgba(212,160,23,0.5)" strokeWidth="1" fill="rgba(13,43,31,0.8)" />
                      <line x1="6" y1="10" x2="26" y2="10" stroke="rgba(212,160,23,0.3)" strokeWidth="1" />
                      <line x1="6" y1="15" x2="22" y2="15" stroke="rgba(232,240,228,0.2)" strokeWidth="1" />
                      <line x1="6" y1="19" x2="24" y2="19" stroke="rgba(232,240,228,0.2)" strokeWidth="1" />
                      <line x1="6" y1="23" x2="20" y2="23" stroke="rgba(232,240,228,0.2)" strokeWidth="1" />
                      <line x1="6" y1="27" x2="23" y2="27" stroke="rgba(232,240,228,0.2)" strokeWidth="1" />
                      <rect x="6" y="30" width="8" height="5" rx="1" fill="rgba(212,160,23,0.4)" />
                    </svg>
                    <div>
                      <p
                        className="font-mono uppercase"
                        style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(212,160,23,0.8)' }}
                      >
                        PDF Document
                      </p>
                      <p
                        className="font-sans font-semibold"
                        style={{ fontSize: '0.9375rem', color: '#E8F0E4' }}
                      >
                        Orchard Spec Sheet 2026
                      </p>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-2">
                    {[
                      'Full variety breakdown: Hayward & Hort16A',
                      'Block-by-block Brix data (3-year average)',
                      'Export grade distribution & pack-out rates',
                      'Irrigation & soil health summary',
                      'Certification register & audit history',
                      'Indicative FOB pricing structure',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          className="font-mono mt-0.5"
                          style={{ color: '#D4A017', fontSize: '0.6rem', flexShrink: 0 }}
                        >
                          ✓
                        </span>
                        <span
                          className="font-sans"
                          style={{ fontSize: '0.7875rem', color: 'rgba(232,240,228,0.65)', lineHeight: 1.5 }}
                        >
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Email gate */}
              <div
                className="px-6 py-5"
                style={{ background: 'rgba(13,43,31,0.7)', borderTop: '1px solid rgba(212,160,23,0.12)' }}
              >
                {specForm.submitted ? (
                  <div className="flex items-center gap-3 py-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(64,145,108,0.15)', border: '1px solid rgba(64,145,108,0.4)' }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7l3 3 6-6" stroke="#40916C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-mono uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#40916C' }}>
                        Check your inbox
                      </p>
                      <p className="font-sans" style={{ fontSize: '0.75rem', color: 'rgba(232,240,228,0.5)' }}>
                        The spec sheet has been sent to {specForm.email}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSpecSubmit} className="flex flex-col gap-3">
                    <label
                      className="font-mono"
                      style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(212,160,23,0.7)', textTransform: 'uppercase' }}
                    >
                      Enter your email to download
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder="you@company.com"
                        className="field-input flex-1"
                        style={{ padding: '10px 14px', borderRadius: '2px', fontSize: '0.8125rem' }}
                        value={specForm.email}
                        onChange={(e) => setSpecForm((p) => ({ ...p, email: e.target.value }))}
                      />
                      <button
                        type="submit"
                        disabled={specForm.submitting}
                        className="btn-ghost px-5 py-2 text-xs rounded-sm flex items-center gap-2 flex-shrink-0"
                        style={{ opacity: specForm.submitting ? 0.7 : 1 }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>{specForm.submitting ? '...' : 'Get PDF'}</span>
                      </button>
                    </div>
                    <p
                      className="font-mono"
                      style={{ fontSize: '0.55rem', color: 'rgba(232,240,228,0.2)', letterSpacing: '0.1em' }}
                    >
                      No spam. One email with your document. Unsubscribe anytime.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Contact direct */}
            <div
              className="p-5 rounded-sm flex flex-col gap-3"
              style={{ background: 'rgba(27,67,50,0.25)', border: '1px solid rgba(212,160,23,0.1)' }}
            >
              <span
                className="font-mono uppercase"
                style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(212,160,23,0.6)' }}
              >
                Direct Contact
              </span>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Export Sales', value: 'export@orchardnz.co.nz', icon: 'email' },
                  { label: 'Procurement', value: '+64 7 555 0842', icon: 'phone' },
                  { label: 'Certification', value: 'compliance@orchardnz.co.nz', icon: 'email' },
                ].map((contact, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span
                      className="font-mono"
                      style={{ fontSize: '0.65rem', color: 'rgba(232,240,228,0.35)', letterSpacing: '0.1em' }}
                    >
                      {contact.label}
                    </span>
                    <span
                      className="font-mono"
                      style={{ fontSize: '0.7rem', color: 'rgba(232,240,228,0.7)' }}
                    >
                      {contact.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcurementSection;
