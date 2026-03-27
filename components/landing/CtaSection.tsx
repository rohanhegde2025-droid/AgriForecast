"use client";
import React, { useEffect, useRef, useState } from 'react';

            const CtaSection: React.FC = () => {
            const sectionRef = useRef<HTMLDivElement>(null);
                const [visible, setVisible] = useState(false);

                useEffect(() => {
                const observer = new IntersectionObserver(
                (entries) => { entries.forEach((e) => { if (e.isIntersecting) setVisible(true); }); },
                { threshold: 0.15 }
                );
                if (sectionRef.current) observer.observe(sectionRef.current);
                return () => observer.disconnect();
                }, []);

                return (
                <section id="get-started" ref={sectionRef} className="relative py-32 overflow-hidden" style={{
                    background: '#04291E' }}>
                    {/* Blueprint grid */}
                    <div className="absolute inset-0 blueprint-grid opacity-70 pointer-events-none" />
                    <div className="noise-overlay" />

                    {/* Beam lines */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            {[20, 50, 80].map((pct, i) => (
                            <line key={i} x1={`${pct}%`} y1="0%" x2={`${pct}%`} y2="100%" stroke="rgba(212,160,23,0.04)"
                                strokeWidth="1" />
                            ))}
                            <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="rgba(212,160,23,0.75)" strokeWidth="1.5"
                                className="svg-beam" />
                        </svg>
                    </div>

                    {/* Radial glow */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(212,160,23,0.06) 0%, transparent 70%)'
                        , }} />

                    <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                        <div className={`section-hidden ${visible ? 'section-visible' : '' }`}>
                            {/* Label */}
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="divider-gold w-8" />
                                <span className="font-mono uppercase" style={{ fontSize: '0.6rem' ,
                                    letterSpacing: '0.3em' , color: 'rgba(212,160,23,0.7)' }}>
                                    Get Started Today
                                </span>
                                <div className="divider-gold w-8" />
                            </div>

                            {/* Headline */}
                            <h2 className="font-sans font-light mb-6" style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' ,
                                color: '#E8F0E4' , letterSpacing: '-0.02em' , lineHeight: 1.1 }}>
                                Start planning your<br />
                                <span style={{ color: '#D4A017' , fontWeight: 600 }}>next harvest.</span>
                            </h2>

                            {/* Supporting text */}
                            <p className="font-sans mb-10 mx-auto max-w-lg" style={{ color: 'rgba(232,240,228,0.85)' ,
                                fontSize: '1rem' , lineHeight: 1.7 }}>
                                Join thousands of farmers who use AgriForecast to make better decisions every season.
                                Set up your farm profile in minutes and get your first forecast today.
                            </p>

                            {/* CTA button */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <a href="/login"
                                    className="btn-gold px-10 py-4 text-sm rounded-sm flex items-center gap-3 shadow-2xl">
                                    <span>Try AgriForecast Now</span>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                                            strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </a>
                                <a href="#features" className="btn-ghost px-6 py-4 text-xs rounded-sm">
                                    <span>Explore Features</span>
                                </a>
                            </div>

                            {/* Trust note */}
                            <p className="font-mono mt-8" style={{ fontSize: '0.6rem' , color: 'rgba(232,240,228,0.6)'
                                , letterSpacing: '0.2em' , textTransform: 'uppercase' }}>
                                No credit card required · Free to start · Cancel anytime
                            </p>
                        </div>
                    </div>
                </section>
                );
                };

                export default CtaSection;