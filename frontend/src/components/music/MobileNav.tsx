'use client';

import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <button 
      className="flex flex-col items-center gap-1"
      onClick={onClick}
    >
      <span className={cn(
        'text-2xl transition-colors duration-200',
        active ? 'text-[#fa2d2f]' : 'text-black/60 dark:text-white/60'
      )}>
        {icon}
      </span>
      <span className={cn(
        'font-sf-pro-text text-caption-1 transition-colors duration-200',
        active ? 'text-[#fa2d2f] font-semibold' : 'text-black/60 dark:text-white/60'
      )}>
        {label}
      </span>
    </button>
  );
}

interface MobileNavProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

export default function MobileNav({ activeSection, onSectionChange }: MobileNavProps) {
  const navItems = [
    { id: 'discover', icon: '🎵', label: '发现' },
    { id: 'liked', icon: '❤️', label: '喜欢' },
    { id: 'search', icon: '🔍', label: '搜索' },
    { id: 'profile', icon: '👤', label: '我的' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-14 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-2xl border-t border-black/8 dark:border-white/8">
      <div className="flex items-center justify-around h-full px-4">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeSection === item.id}
            onClick={() => onSectionChange?.(item.id)}
          />
        ))}
      </div>
    </nav>
  );
}
