"use client";
import React from 'react';
import AppLogo from './AppLogo';

                                                                const Footer: React.FC = () => {
                                                                return (
                                                                <footer className="py-8 px-6" style={{
                                                                    borderTop: '1px solid rgba(212,160,23,0.6)' ,
                                                                    background: 'var(--color-canopy-dark)' , }}>
                                                                    <div
                                                                        className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                                                                        {/* Logo + copyright */}
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-1.5 h-1.5 rounded-full"
                                                                                style={{ background: '#D4A017' }} />
                                                                            <AppLogo text="AgriForecast" size={22}
                                                                                className="text-mist" />
                                                                            <span className="font-mono ml-4" style={{
                                                                                fontSize: '0.65rem' ,
                                                                                color: 'rgba(232,240,228,0.6)' ,
                                                                                letterSpacing: '0.15em' }}>
                                                                                © 2026 AgriForecast
                                                                            </span>
                                                                        </div>

                                                                        {/* Links */}
                                                                        <nav className="flex items-center gap-8">
                                                                            {[
                                                                            { label: 'Privacy', href: '#' },
                                                                            { label: 'Terms', href: '#' },
                                                                            { label: 'Contact', href: '#' },
                                                                            ].map((link) => (
                                                                            <a key={link.label} href={link.href}
                                                                                className="font-mono transition-colors duration-200"
                                                                                style={{ fontSize: '0.65rem' ,
                                                                                color: 'rgba(232,240,228,0.6)' ,
                                                                                letterSpacing: '0.15em' ,
                                                                                textTransform: 'uppercase' }}
                                                                                onMouseEnter={(e)=> { (e.target as
                                                                                HTMLElement).style.color = '#D4A017'; }}
                                                                                onMouseLeave={(e) => { (e.target as
                                                                                HTMLElement).style.color =
                                                                                'rgba(232,240,228,0.6)'; }}
                                                                                >
                                                                                {link.label}
                                                                            </a>
                                                                            ))}
                                                                        </nav>

                                                                        {/* Tagline */}
                                                                        <div className="font-mono text-center md:text-right"
                                                                            style={{ fontSize: '0.6rem' ,
                                                                            color: 'rgba(212,160,23,0.6)' ,
                                                                            letterSpacing: '0.15em' }}>
                                                                            SMARTER DECISIONS · EVERY HARVEST
                                                                        </div>
                                                                    </div>
                                                                </footer>
                                                                );
                                                                };

                                                                export default Footer;