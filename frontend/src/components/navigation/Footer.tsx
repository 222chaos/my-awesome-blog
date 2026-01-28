'use client';

import GlassCard from '@/components/ui/GlassCard';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background pt-16 pb-8 flex items-center justify-center">
      <div className="container">
        <GlassCard className="glass-card text-center py-6" padding="none">
          <p className="text-muted-foreground text-sm">
            © {currentYear} 我的优秀博客. 保留所有权利。
          </p>
        </GlassCard>
      </div>
    </footer>
  );
}