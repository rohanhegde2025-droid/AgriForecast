"use client";
import React, { useEffect, useRef, useState } from 'react';

                const FEATURES = [
                {
                code: 'F-01',
                title: 'Yield Prediction',
                tagline: 'Know your harvest before it happens.',
                description:
                `Enter your farm details and crop variety. AgriForecast estimates your expected yield based on seasonal
                patterns, soil conditions, and historical data — giving you a reliable number to plan around.`,
                benefits: ['Plan storage and logistics early', 'Set realistic buyer expectations', 'Reduce post-harvest surprises'],
                color: '#40916C',
                },
                {
                code: 'F-02',
                title: 'Price Forecasting',
                tagline: 'Understand where prices are heading.',
                description:
                `Track commodity price trends for your crop across key markets. AgriForecast surfaces price movement
                patterns so you can anticipate market conditions and time your sales more effectively.`,
                benefits: ['Monitor price trends by crop', 'Compare regional market rates', 'Spot selling windows early'],
                color: '#D4A017',
                },
                {
                code: 'F-03',
                title: 'Smart Advisory',
                tagline: 'A clear recommendation, not just data.',
                description:
                `AgriForecast combines your yield outlook with current price forecasts to give you a simple, actionable
                recommendation — when to sell, how much to hold, and what to watch for.`,
                benefits: ['Sell-timing guidance per crop', 'Risk-adjusted recommendations', 'Plain language, no jargon'],
                color: '#2D6A4F',
                },
                ];

                const FeaturesSection: React.FC = () => {
                const sectionRef = useRef<HTMLDivElement>(null);
                    const [visible, setVisible] = useState(false);

                    useEffect(() => {
                    const observer = new IntersectionObserver(
                    (entries) => { entries.forEach((e) => { if (e.isIntersecting) setVisible(true); }); },
                    { threshold: 0.1 }
                    );
                    if (sectionRef.current) observer.observe(sectionRef.current);
                    return () => observer.disconnect();
                    }, []);

                    return (
                    <section id="features" ref={sectionRef} className="relative py-24 overflow-hidden" style={{
                        background: '#04291E' }}>
                        {/* Blueprint grid */}
                        <div className="absolute inset-0 blueprint-grid opacity-70 pointer-events-none" />
                        <div className="noise-overlay" />

                        {/* Beam lines */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                {[20, 50, 80].map((pct, i) => (
                                <line key={i} x1={`${pct}%`} y1="0%" x2={`${pct}%`} y2="100%"
                                    stroke="rgba(212,160,23,0.04)" strokeWidth="1" />
                                ))}
                                <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="rgba(212,160,23,0.75)"
                                    strokeWidth="1.5" className="svg-beam svg-beam-2" />
                            </svg>
                        </div>

                        <div className="max-w-7xl mx-auto px-6 relative z-10">
                            {/* Header */}
                            <div className={`mb-16 text-center section-hidden ${visible ? 'section-visible' : '' }`}>
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <div className="divider-gold w-8" />
                                    <span className="font-mono uppercase" style={{ fontSize: '0.6rem' ,
                                        letterSpacing: '0.3em' , color: 'rgba(212,160,23,0.7)' }}>
                                        Platform Features
                                    </span>
                                    <div className="divider-gold w-8" />
                                </div>
                                <h2 className="font-sans font-light" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' ,
                                    color: '#E8F0E4' , letterSpacing: '-0.02em' , lineHeight: 1.1 }}>
                                    Three tools.<br />
                                    <span style={{ color: '#D4A017' , fontWeight: 600 }}>One clearer picture.</span>
                                </h2>
                                <p className="mt-4 mx-auto max-w-lg font-sans" style={{ color: 'rgba(232,240,228,0.85)' ,
                                    fontSize: '0.9375rem' , lineHeight: 1.7 }}>
                                    AgriForecast is built around the decisions farmers actually face — not abstract
                                    analytics.
                                </p>
                            </div>

                            {/* Feature cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {FEATURES.map((feature, i) => (
                                <div key={i} className={`section-hidden ${visible ? 'section-visible' : '' }`} style={{
                                    transitionDelay: `${0.15 + i * 0.15}s` }}>
                                    <div className="rounded-sm overflow-hidden h-full flex flex-col" style={{
                                        border: '1px solid rgba(212,160,23,0.6)' , background: 'rgba(27,67,50,0.6)' }}>
                                        {/* Card header */}
                                        <div className="px-6 py-4" style={{ background: '#1B4332' , borderBottom: `2px
                                            solid ${feature.color}` }}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-mono" style={{ fontSize: '0.58rem' ,
                                                    color: 'rgba(212,160,23,0.6)' , letterSpacing: '0.2em' }}>
                                                    {feature.code}
                                                </span>
                                                <div className="w-2 h-2 rounded-full" style={{ background: feature.color
                                                    }} />
                                            </div>
                                            <h3 className="font-sans font-semibold" style={{ fontSize: '1.125rem' ,
                                                color: '#E8F0E4' , lineHeight: 1.2 }}>
                                                {feature.title}
                                            </h3>
                                            <p className="font-mono mt-1" style={{ fontSize: '0.65rem' ,
                                                color: 'rgba(212,160,23,0.75)' , letterSpacing: '0.05em' }}>
                                                {feature.tagline}
                                            </p>
                                        </div>

                                        {/* Card body */}
                                        <div className="p-6 flex flex-col gap-5 flex-1">
                                            <p className="font-sans" style={{ fontSize: '0.875rem' ,
                                                color: 'rgba(232,240,228,0.6)' , lineHeight: 1.65 }}>
                                                {feature.description}
                                            </p>

                                            <div className="flex flex-col gap-2 mt-auto">
                                                {feature.benefits.map((benefit, j) => (
                                                <div key={j} className="flex items-start gap-2.5">
                                                    <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{
                                                        background: feature.color }} />
                                                    <span className="font-sans" style={{ fontSize: '0.8125rem' ,
                                                        color: 'rgba(232,240,228,0.85)' }}>
                                                        {benefit}
                                                    </span>
                                                </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    );
                    };

                    export default FeaturesSection;