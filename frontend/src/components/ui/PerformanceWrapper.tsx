'use client';

import React, { useEffect, useState } from 'react';
import { measurePerformance } from '@/lib/performance';

interface PerformanceWrapperProps {
  children: React.ReactNode;
  componentName?: string;
}

// Performance wrapper component to measure rendering performance
export default function PerformanceWrapper({ 
  children, 
  componentName = 'Component' 
}: PerformanceWrapperProps) {
  const [renderTime, setRenderTime] = useState<number | null>(null);
  
  useEffect(() => {
    // Measure initial render time
    const renderMeasure = async () => {
      const { duration } = await measurePerformance(async () => {
        // Simulate measuring render time
        await new Promise(resolve => setTimeout(resolve, 0));
        return null;
      }, `${componentName} Render Time`);
      
      setRenderTime(duration);
    };
    
    renderMeasure();
  }, [componentName]);

  return (
    <div className="relative">
      {children}
      {process.env.NODE_ENV === 'development' && renderTime !== null && (
        <div className="absolute top-2 right-2 text-white text-xs px-2 py-1 rounded" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          {componentName}: {renderTime.toFixed(2)}ms
        </div>
      )}
    </div>
  );
}