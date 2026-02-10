'use client';

import { motion } from 'framer-motion';
import { Search, Mail, MessageSquare, Github, Twitter, User, MapPin, Calendar } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative w-full mb-10">
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="relative z-10 px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/90 dark:bg-black/90 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="relative"
                >
                  <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                    <User className="w-12 h-12" />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                    className="absolute top-4 right-16 w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-black"
                  />
                </motion.div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  我的名字
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  全栈开发者 & 技术顾问
                </p>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                    在线
                  </span>
                </div>

                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>中国 · 上海</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>UTC+8</span>
                  </div>
                </div>

                <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="mailto:contact@example.com" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/90 dark:bg-black/90 backdrop-blur-2xl rounded-2xl p-8 md:p-12 shadow-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  联系我
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                  很高兴与你交流。无论是技术咨询、商务合作，还是单纯聊聊天，欢迎随时联系我。
                </p>
                
                <div className="relative max-w-md mb-6">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="搜索常见问题..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400"
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                    <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">⌘</kbd>
                    <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">K</kbd>
                    <span>聚焦搜索</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                    <kbd className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono">Esc</kbd>
                    <span>清除搜索</span>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="mailto:contact@example.com"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <Mail className="w-5 h-5" />
                    邮件联系
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#contact-form"
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <MessageSquare className="w-5 h-5" />
                    在线咨询
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="#faq"
                    className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-medium border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <Search className="w-5 h-5" />
                    查看FAQ
                  </motion.a>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
