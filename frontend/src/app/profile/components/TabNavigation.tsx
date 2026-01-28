'use client';

import { motion } from 'framer-motion';
import { User, Settings, Activity } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TabNavigation({ activeTab, setActiveTab }: TabNavigationProps) {
  const tabs = [
    { id: 'profile', label: '个人信息', icon: User },
    { id: 'settings', label: '设置', icon: Settings },
    { id: 'activity', label: '活动', icon: Activity },
  ];

  return (
    <div className="flex border-b border-glass-border mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-medium relative transition-colors duration-200 ${
              activeTab === tab.id
                ? 'text-tech-cyan'
                : 'text-foreground/70 hover:text-foreground'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-tech-cyan"
                layoutId="tabIndicator"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}