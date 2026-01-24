import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  floatEffect?: boolean;
  glowEffect?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export default function GlassCard({
  children,
  className = '',
  hoverEffect = true,
  floatEffect = false,
  glowEffect = false,
  padding = 'md',
}: GlassCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseClasses = 'glass-card rounded-xl border border-glass-border shadow-lg';
  const hoverClasses = hoverEffect ? 'glass-hover' : '';
  const floatClasses = floatEffect ? 'animate-float' : '';
  const glowClasses = glowEffect ? 'animate-pulse-glow' : '';
  const paddingClass = paddingClasses[padding];

  const combinedClasses = cn(
    baseClasses,
    paddingClass,
    hoverClasses,
    floatClasses,
    glowClasses,
    className
  );

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
}