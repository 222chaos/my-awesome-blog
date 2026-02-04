import React from 'react';
import { cn } from '@/lib/utils';

interface NeonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  glow?: boolean;
}

const NeonCard: React.FC<NeonCardProps> = ({ 
  children, 
  className, 
  variant = 'primary',
  glow = false,
  ...props 
}) => {
  const borderColors = {
    primary: 'border-tech-cyan/30 hover:border-tech-cyan/60',
    secondary: 'border-tech-purple/30 hover:border-tech-purple/60',
    accent: 'border-tech-pink/30 hover:border-tech-pink/60',
  };

  const glowEffects = {
    primary: 'shadow-[0_0_15px_rgba(0,217,255,0.15)] hover:shadow-[0_0_25px_rgba(0,217,255,0.3)]',
    secondary: 'shadow-[0_0_15px_rgba(124,58,237,0.15)] hover:shadow-[0_0_25px_rgba(124,58,237,0.3)]',
    accent: 'shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:shadow-[0_0_25px_rgba(244,63,94,0.3)]',
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-xl border bg-black/40 backdrop-blur-md transition-all duration-300",
        borderColors[variant],
        glow && glowEffects[variant],
        className
      )}
      {...props}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] opacity-20" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default NeonCard;
