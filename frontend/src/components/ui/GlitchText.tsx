'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function GlitchText({ text, className, size = 'lg' }: GlitchTextProps) {
  const sizeClasses = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-4xl md:text-5xl',
    lg: 'text-6xl md:text-7xl',
    xl: 'text-7xl md:text-9xl',
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <span className={cn("font-bold text-white relative z-10", sizeClasses[size])}>
        {text}
      </span>
      <span 
        className={cn(
          "font-bold text-tech-cyan absolute top-0 left-0 -z-10 opacity-70 animate-pulse", 
          sizeClasses[size]
        )}
        style={{ 
          transform: 'translate(-2px, 2px)',
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
          animation: 'glitch-anim-1 2.5s infinite linear alternate-reverse'
        }}
      >
        {text}
      </span>
      <span 
        className={cn(
          "font-bold text-tech-deepblue absolute top-0 left-0 -z-10 opacity-70 animate-pulse", 
          sizeClasses[size]
        )}
        style={{ 
          transform: 'translate(2px, -2px)',
          clipPath: 'polygon(0 80%, 100% 20%, 100% 100%, 0 100%)',
          animation: 'glitch-anim-2 3s infinite linear alternate-reverse'
        }}
      >
        {text}
      </span>
      
      <style jsx>{`
        @keyframes glitch-anim-1 {
          0% { clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%); }
          20% { clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%); }
          40% { clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%); }
          60% { clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%); }
          80% { clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%); }
          100% { clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: polygon(0 25%, 100% 25%, 100% 30%, 0 30%); }
          15% { clip-path: polygon(0 3%, 100% 3%, 100% 3%, 0 3%); }
          22% { clip-path: polygon(0 5%, 100% 5%, 100% 20%, 0 20%); }
          40% { clip-path: polygon(0 20%, 100% 20%, 100% 20%, 0 20%); }
          60% { clip-path: polygon(0 40%, 100% 40%, 100% 40%, 0 40%); }
          80% { clip-path: polygon(0 50%, 100% 50%, 100% 50%, 0 50%); }
          100% { clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%); }
        }
      `}</style>
    </div>
  );
}
