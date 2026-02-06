'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HoloCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'pink' | 'blue' | 'green';
  tiltStrength?: number;
  glowIntensity?: number;
  scanline?: boolean;
}

const HoloCard = ({
  children,
  variant = 'cyan',
  tiltStrength = 10,
  glowIntensity = 0.3,
  scanline = true,
  className,
  ...props
}: HoloCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useTransform([rotateX, rotateY], (x, y) => isHovered ? 1.02 : 1);

  const springConfig = { damping: 25, stiffness: 300 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const variantColors = {
    cyan: {
      border: 'border-tech-cyan/30 hover:border-tech-cyan/60',
      glow: 'shadow-tech-cyan/20 hover:shadow-tech-cyan/40',
      bg: 'bg-tech-cyan/5'
    },
    purple: {
      border: 'border-tech-purple/30 hover:border-tech-purple/60',
      glow: 'shadow-tech-purple/20 hover:shadow-tech-purple/40',
      bg: 'bg-tech-purple/5'
    },
    pink: {
      border: 'border-tech-pink/30 hover:border-tech-pink/60',
      glow: 'shadow-tech-pink/20 hover:shadow-tech-pink/40',
      bg: 'bg-tech-pink/5'
    },
    blue: {
      border: 'border-blue-500/30 hover:border-blue-500/60',
      glow: 'shadow-blue-500/20 hover:shadow-blue-500/40',
      bg: 'bg-blue-500/5'
    },
    green: {
      border: 'border-green-500/30 hover:border-green-500/60',
      glow: 'shadow-green-500/20 hover:shadow-green-500/40',
      bg: 'bg-green-500/5'
    }
  };

  const colors = variantColors[variant];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXVal = ((y - centerY) / centerY) * -tiltStrength;
    const rotateYVal = ((x - centerX) / centerX) * tiltStrength;

    rotateX.set(rotateXVal);
    rotateY.set(rotateYVal);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300",
        colors.border,
        colors.bg,
        colors.glow,
        className
      )}
      style={{
        rotateX: springRotateX,
        rotateY: springRotateY,
        scale,
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {scanline && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[200%] animate-scanline" />
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-tech-cyan/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-tech-cyan/50 to-transparent" />
        <div className="absolute top-0 left-0 h-full w-px bg-gradient-to-b from-transparent via-tech-cyan/50 to-transparent" />
        <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-transparent via-tech-cyan/50 to-transparent" />
      </div>

      <div className="relative z-10 h-full">
        {children}
      </div>

      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: glowIntensity }}
          exit={{ opacity: 0 }}
          style={{
            background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1) 0%, transparent 70%)`
          }}
        />
      )}
    </motion.div>
  );
};

export default HoloCard;
