'use client';

import { ThemeProvider } from '@/context/theme-context';
import { useState, useEffect } from 'react';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}