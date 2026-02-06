'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, TrendingUp, Activity, Zap, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItem {
  label: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

export default function RealTimeStats() {
  const [onlineUsers, setOnlineUsers] = useState(10);
  const [totalMessages, setTotalMessages] = useState(0);
  const [messageRate, setMessageRate] = useState(0);
  const [activeUsers, setActiveUsers] = useState(5);

  const [stats, setStats] = useState<StatItem[]>([]);

  useEffect(() => {
    setOnlineUsers(Math.floor(Math.random() * 50) + 10);
    setActiveUsers(Math.floor(Math.random() * 20) + 5);

    setStats([
      {
        label: '在线用户',
        value: onlineUsers,
        change: Math.floor(Math.random() * 5) - 2,
        icon: <Users className="w-4 h-4" />,
        color: 'tech-cyan'
      },
      {
        label: '今日留言',
        value: totalMessages,
        change: Math.floor(Math.random() * 10) + 1,
        icon: <MessageSquare className="w-4 h-4" />,
        color: 'tech-purple'
      },
      {
        label: '活跃度',
        value: `${messageRate}/min`,
        change: Math.floor(Math.random() * 3) - 1,
        icon: <Activity className="w-4 h-4" />,
        color: 'tech-pink'
      },
      {
        label: '新用户',
        value: activeUsers,
        change: Math.floor(Math.random() * 2),
        icon: <TrendingUp className="w-4 h-4" />,
        color: 'green-500'
      }
    ]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(5, prev + change);
      });

      setTotalMessages(prev => prev + Math.floor(Math.random() * 2));

      setMessageRate(prev => {
        const newRate = Math.floor(Math.random() * 10) + 1;
        return newRate;
      });

      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 2);
        return Math.max(0, prev + change);
      });

      setStats(prevStats => prevStats.map(stat => ({
        ...stat,
        change: Math.floor(Math.random() * 5) - 2,
        value: stat.label === '活跃度' ? `${Math.floor(Math.random() * 10) + 1}/min` : stat.value
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ stat, index }: { stat: StatItem; index: number }) => (
    <motion.div
      className="relative overflow-hidden rounded-xl border backdrop-blur-xl p-4"
      style={{
        borderColor: `rgba(${stat.color === 'tech-cyan' ? '0,217,255' : stat.color === 'tech-purple' ? '124,58,237' : stat.color === 'tech-pink' ? '244,63,94' : '34,197,94'}, 0.2)`,
        background: `rgba(${stat.color === 'tech-cyan' ? '0,217,255' : stat.color === 'tech-purple' ? '124,58,237' : stat.color === 'tech-pink' ? '244,63,94' : '34,197,94'}, 0.05)`
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, borderColor: `rgba(${stat.color === 'tech-cyan' ? '0,217,255' : stat.color === 'tech-purple' ? '124,58,237' : stat.color === 'tech-pink' ? '244,63,94' : '34,197,94'}, 0.4)` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`text-${stat.color} bg-${stat.color}/10 p-2 rounded-lg`}>
          {stat.icon}
        </div>
        {stat.change !== undefined && (
          <motion.span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              stat.change > 0
                ? "bg-green-500/20 text-green-400"
                : stat.change < 0
                ? "bg-red-500/20 text-red-400"
                : "bg-gray-500/20 text-gray-400"
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {stat.change > 0 ? '+' : ''}{stat.change}
          </motion.span>
        )}
      </div>

      <motion.div
        className="text-2xl font-bold text-white"
        key={stat.value}
        initial={{ opacity: 0.5, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {stat.value}
      </motion.div>

      <div className="text-xs text-white/50 mt-1">{stat.label}</div>

      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${stat.color} 50%, transparent 100%)`
        }}
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
      />
    </motion.div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
          <Zap className="w-5 h-5 text-tech-cyan animate-pulse" />
          实时数据
        </h3>
        <motion.div
          className="flex items-center gap-2 text-xs text-white/50"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          实时更新
        </motion.div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>

      <motion.div
        className="relative h-24 rounded-xl border backdrop-blur-xl overflow-hidden"
        style={{
          borderColor: 'rgba(0,217,255,0.2)',
          background: 'rgba(0,217,255,0.03)'
        }}
      >
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            background: 'linear-gradient(rgba(18,16,16,0) 50%,rgba(0,0,0,0.25) 50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))',
            backgroundSize: '100% 2px, 3px 100%'
          }}
        />

        <div className="relative z-10 h-full flex items-center justify-between px-4">
          <div>
            <div className="text-xs text-white/50 mb-1">24小时活跃趋势</div>
            <div className="flex items-end gap-1 h-16">
              {Array.from({ length: 24 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-tech-cyan/30 rounded-t-sm relative group"
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.random() * 60 + 20}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                >
                  <motion.div
                    className="absolute inset-x-0 bottom-0 h-full bg-tech-cyan/0 group-hover:bg-tech-cyan/50 transition-colors rounded-t-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 + 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-right">
            <Globe className="w-8 h-8 text-tech-cyan/50 mb-2" />
            <div className="text-2xl font-bold text-tech-cyan">
              {onlineUsers}
            </div>
            <div className="text-xs text-white/50">全球连接</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
