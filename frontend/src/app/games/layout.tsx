import type { ReactNode } from 'react';

export default function GamesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] transition-colors duration-300">
      {children}
    </div>
  );
}
