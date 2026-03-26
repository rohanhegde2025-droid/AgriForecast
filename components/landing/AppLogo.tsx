"use client";
import React from 'react';
import { Leaf } from 'lucide-react';

interface AppLogoProps {
  text?: string;
  size?: number;
  className?: string;
}

function AppLogo({
  text,
  size = 40,
  className = '',
}: AppLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className="rounded-sm flex items-center justify-center flex-shrink-0"
        style={{ 
          width: size, 
          height: size, 
          background: 'rgba(212, 160, 23, 0.1)',
          border: '1px solid rgba(212, 160, 23, 0.6)'
        }}
      >
        <Leaf className="w-5 h-5 text-gold" style={{ color: '#D4A017' }} />
      </div>
      {text && (
        <span 
          className="font-sans font-bold text-xl tracking-tight"
          style={{ color: 'inherit' }}
        >
          {text}
        </span>
      )}
    </div>
  );
}

export default AppLogo;