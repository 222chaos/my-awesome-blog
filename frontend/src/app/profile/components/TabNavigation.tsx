'use client';

import { motion } from 'framer-motion';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'profile', label: '个人资料', icon: '👤' },
  { id: 'settings', label: '个性化设置', icon: '⚙️' },
  { id: 'activity', label: '活动记录', icon: '📊' }
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="mb-8">
      <div className="relative inline-flex p-1 bg-[var(--card)]/40 backdrop-blur-xl rounded-2xl border border-tech-cyan/20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-medium text-sm sm:text-base
              transition-all duration-300 flex items-center gap-2
              ${activeTab === tab.id
                ? 'text-tech-cyan bg-tech-cyan/10 shadow-lg'
                : 'text-muted-foreground hover:text-foreground hover:bg-tech-cyan/5'
              }
            `}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-tech-cyan/10 rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.icon}</span>
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
