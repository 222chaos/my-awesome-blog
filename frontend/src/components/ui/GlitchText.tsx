import React from 'react';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p';
}

const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  className,
  size = 'md',
  as: Component = 'h1' 
}) => {
  const sizeStyles = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
    xl: 'text-8xl'
  };

  return (
    <Component className={cn("relative inline-block font-syne font-bold uppercase tracking-wider text-white", sizeStyles[size], className)}>
      <span className="relative z-10">{text}</span>
      <span 
        className="absolute top-0 left-0 -z-10 w-full h-full text-tech-cyan opacity-70 animate-glitch-1"
        aria-hidden="true"
      >
        {text}
      </span>
      <span 
        className="absolute top-0 left-0 -z-10 w-full h-full text-tech-pink opacity-70 animate-glitch-2"
        aria-hidden="true"
      >
        {text}
      </span>
    </Component>
  );
};

export default GlitchText;
