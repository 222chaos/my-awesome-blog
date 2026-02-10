'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, MessageSquare, HelpCircle, Briefcase, Code, Users, Star } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon?: React.ReactNode;
  category: 'general' | 'collaboration' | 'technical' | 'social';
}

interface FAQAccordionProps {
  faqs: FAQItem[];
}

const categories = [
  { id: 'all', label: '全部', icon: HelpCircle },
  { id: 'general', label: '通用', icon: MessageSquare },
  { id: 'collaboration', label: '合作', icon: Briefcase },
  { id: 'technical', label: '技术', icon: Code },
  { id: 'social', label: '社交', icon: Users },
];

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (id: string) => {
    setOpenItem(openItem === id ? null : id);
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <section className="mb-12" id="faq">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 px-1">
        常见问题
      </h2>

      <div className="mb-6 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedCategory(category.id);
                setOpenItem(null);
              }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer',
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white/50 dark:bg-black/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-black/80 border border-gray-200 dark:border-gray-700'
              )}
            >
              <category.icon className="w-4 h-4" />
              {category.label}
              {selectedCategory === category.id && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-1 w-2 h-2 bg-white rounded-full"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {filteredFAQs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                该分类下暂无问题
              </p>
            </motion.div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-expanded={openItem === faq.id}
                  aria-controls={`faq-content-${faq.id}`}
                >
                  <div className="flex items-center gap-3">
                    {faq.icon || <HelpCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
                    <span className="font-medium text-gray-900 dark:text-white text-lg">
                      {faq.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: openItem === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-500 dark:text-gray-400"
                  >
                    {openItem === faq.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </motion.div>
                </button>

                <AnimatePresence mode="wait">
                  {openItem === faq.id && (
                    <motion.div
                      id={`faq-content-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 pt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
