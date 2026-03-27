"use client";
import React, { useEffect, useRef, useState } from 'react';

const HeroSection: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 300);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 2,
                y: (e.clientY / window.innerHeight - 0.5) * 2,
            });
        };
        window.addEventListener('mousemove', handleMouse, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouse);
    }, []);

    return (
        <section 
            ref={sectionRef} 
            id="hero"
            className="relative min-h-screen flex flex-col justify-end overflow-hidden" 
            style={{ background: '#04291E' }}
        >
            {/* Background gradient layer */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div 
                    className="w-full h-full" 
                    style={{ 
                        transform: `scale(1.04) translate(${mousePos.x * -6}px, ${mousePos.y * -4}px)`,
                        transition: 'transform 2s cubic-bezier(0.16, 1, 0.3, 1)',
                        background: 'radial-gradient(ellipse 120% 80% at 60% 30%, rgba(27,67,50,0.8) 0%, rgba(4,41,30,1) 70%)'
                    }} 
                />

                {/* Warm field glow */}
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse 70% 50% at 65% 25%, rgba(212,160,23,0.05) 0%, transparent 65%)'
                }} />

                {/* Blueprint grid overlay */}
                <div className="absolute inset-0 blueprint-grid opacity-60" />

                {/* Mist layer */}
                <div className="mist-layer absolute inset-0" style={{
                    background: 'radial-gradient(ellipse 80% 40% at 50% 20%, rgba(232,240,228,0.03) 0%, transparent 70%)'
                }} />
            </div>

            {/* Noise overlay moved to global or kept here? styles.css has it fixed. */}
            
            {/* GPS row lines */}
            <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                    {[15, 25, 35, 45, 55, 65, 75, 85].map((pct, i) => (
                        <line key={i} x1={`${pct}%`} y1="0%" x2={`${pct - 5}%`} y2="100%"
                            stroke="rgba(212,160,23,0.03)" strokeWidth="1" />
                    ))}
                    {[25, 55, 75].map((pct, i) => (
                        <line key={`beam-${i}`} x1={`${pct}%`} y1="0%" x2={`${pct - 5}%`} y2="100%"
                            stroke="rgba(212,160,23,0.4)" strokeWidth="2" className={`svg-beam svg-beam-${i + 1}`} />
                    ))}
                </svg>
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-20 pt-36">
                {/* Badge */}
                <div className={`inline-flex items-center gap-2.5 px-4 py-2 mb-8 rounded-sm
                    section-hidden ${visible ? 'section-visible' : ''}`} style={{
                    background: 'rgba(11, 26, 19, 0.7)', 
                    border: '1px solid rgba(212,160,23,0.45)',
                    backdropFilter: 'blur(8px)', 
                }}>
                    <span className="w-1.5 h-1.5 rounded-full gold-pulse" style={{ background: '#D4A017', display: 'inline-block' }} />
                    <span className="font-mono uppercase" style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'rgba(212,160,23,1)' }}>
                        Decision Support for Farmers · Harvest Season 2026
                    </span>
                </div>

                {/* Headline */}
                <h1 className={`font-sans font-light mb-6 section-hidden ${visible ? 'section-visible' : ''}`} 
                    style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: 1.0, color: '#E8F0E4', letterSpacing: '-0.03em', maxWidth: '16ch', transitionDelay: '0.1s' }}>
                    Smarter decisions<br />
                    <span style={{ color: '#D4A017', fontWeight: 600 }}>
                        for every harvest.
                    </span>
                    <br />
                    <span style={{ color: 'rgba(232,240,228,0.6)', fontWeight: 300, fontSize: '0.6em' }}>
                        Plan with confidence. Sell at the right time.
                    </span>
                </h1>

                {/* Sub */}
                <p className={`font-sans mb-12 max-w-xl section-hidden ${visible ? 'section-visible' : ''}`} 
                    style={{ color: 'rgba(232,240,228,0.7)', fontSize: '1.05rem', lineHeight: 1.7, transitionDelay: '0.2s' }}>
                    AgriForecast helps farmers predict crop yield, understand price trends, and
                    choose the right time to sell — so every harvest decision is backed by data, not
                    guesswork.
                </p>

                {/* Stat panels */}
                <div className={`grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10 section-hidden ${visible ? 'section-visible' : ''}`} style={{ transitionDelay: '0.3s' }}>
                    {[
                        { value: '94%', label: 'Yield Forecast Accuracy', unit: 'AVG' },
                        { value: '3×', label: 'Faster Selling Decisions', unit: 'SPEED' },
                        { value: '18%', label: 'Average Revenue Uplift', unit: 'ROI' },
                        { value: '12K+', label: 'Farms Using AgriForecast', unit: 'USERS' },
                    ].map((stat, i) => (
                        <div key={i} className="metric-panel px-6 py-5 flex flex-col gap-2 relative">
                            <div className="flex items-end gap-2">
                                <span className="metric-value font-bold" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
                                    {stat.value}
                                </span>
                                <span className="font-mono text-[0.6rem] text-gold/60 pb-1.5">{stat.unit}</span>
                            </div>
                            <span className="metric-label">{stat.label}</span>
                            <div className="absolute bottom-0 left-0 right-0 h-px" style={{
                                background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.35), transparent)'
                            }} />
                        </div>
                    ))}
                </div>

                {/* CTA row */}
                <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-5 section-hidden ${visible ? 'section-visible' : ''}`} style={{ transitionDelay: '0.4s' }}>
                    <a href="/login" className="btn-gold px-9 py-4 text-xs uppercase tracking-widest font-bold rounded-sm flex items-center gap-3 shadow-2xl">
                        <span>Get Started Now</span>
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                    <a href="#features" className="btn-ghost px-7 py-4 text-xs uppercase tracking-widest rounded-sm flex items-center gap-2">
                        <span>Explore Features</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;