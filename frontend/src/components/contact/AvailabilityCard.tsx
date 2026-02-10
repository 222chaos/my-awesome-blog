'use client';

import { motion } from 'framer-motion';
import { Clock, Globe, Calendar, MessageSquare, CheckCircle2, XCircle } from 'lucide-react';

interface AvailabilityStatus {
  isOnline: boolean;
  timezone: string;
  responseTime: string;
  workingHours: string;
  availability: 'available' | 'busy' | 'away';
}

export default function AvailabilityCard() {
  const status: AvailabilityStatus = {
    isOnline: true,
    timezone: 'Asia/Shanghai (UTC+8)',
    responseTime: '24小时内',
    workingHours: '周一至周五 9:00 - 18:00',
    availability: 'available',
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 px-1">
        联系状态
      </h2>

      <div className="bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl"
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0",
                status.isOnline ? "bg-green-500" : "bg-gray-400"
              )}>
                {status.isOnline ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  当前状态
                </h3>
                <p className={cn(
                  "text-sm",
                  status.isOnline ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"
                )}>
                  {status.isOnline ? '在线 - 随时可以联系' : '离线 - 请留言'}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  时区
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {status.timezone}
                </p>
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl"
            >
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  响应时间
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {status.responseTime}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  工作日通常更快
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex items-start gap-4 p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl"
            >
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  工作时间
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {status.workingHours}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 rounded-xl border border-blue-200/50 dark:border-blue-800/50"
        >
          <div className="flex items-start gap-3">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                如果您需要紧急联系，可以直接使用上方的<span className="font-semibold text-blue-600 dark:text-blue-400">快速咨询</span>功能，或者通过社交媒体私信我。
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
