'use client';

import { useTheme } from '@/context/theme-context';

interface WaveStackProps {
  className?: string;
  waveCount?: number;
}

export default function WaveStack({ className = '', waveCount = 3 }: WaveStackProps) {
  const { resolvedTheme } = useTheme();

  const waveColor = resolvedTheme === 'dark' ? '#0a0a0a' : '#ffffff';

  return (
    <div className={`relative w-full h-[150px] overflow-hidden ${className}`}>
      {Array.from({ length: waveCount }).map((_, index) => (
        <svg
          key={index}
          className="absolute block w-full left-0"
          style={{
            height: `${60 + index * 30}px`,
            bottom: `-${index * 20}px`,
            opacity: 1 - index * 0.15,
            transform: `scaleX(${1 + index * 0.1})`,
            zIndex: waveCount - index,
          }}
          data-name={`Wave ${index + 1}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            style={{ fill: waveColor }}
          />
        </svg>
      ))}
    </div>
  );
}
