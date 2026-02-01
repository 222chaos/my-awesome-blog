'use client';

import { ThemeProvider } from '@/context/theme-context';
import { useState, useEffect } from 'react';
import MatrixCodeRain from '@/components/background/MatrixCodeRain';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <MatrixCodeRain />
      {children}
    </ThemeProvider>
  );
}