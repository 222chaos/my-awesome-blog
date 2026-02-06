'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import { useThemedClasses } from '@/hooks/useThemedClasses';

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
  messageAuthor?: string;
  messageContent?: string;
}

const reportReasons = [
  { id: 'spam', label: '垃圾信息', icon: '🚫' },
  { id: 'harassment', label: '骚扰/辱骂', icon: '😡' },
  { id: 'inappropriate', label: '不当内容', icon: '⚠️' },
  { id: 'misleading', label: '误导信息', icon: '🤥' },
  { id: 'other', label: '其他原因', icon: '📝' },
];

export default function ReportDialog({
  isOpen,
  onClose,
  onSubmit,
  messageAuthor,
  messageContent
}: ReportDialogProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { themedClasses, getThemeClass } = useThemedClasses();

  const textClass = themedClasses.textClass;
  const mutedTextClass = themedClasses.mutedTextClass;
  const cardBgClass = themedClasses.cardBgClass;

  const handleSubmit = async () => {
    if (!selectedReason) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onSubmit(selectedReason, details);
      handleClose();
    } catch (error) {
      console.error('举报失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedReason('');
    setDetails('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn('w-full max-w-md', getThemeClass('bg-[#1a1a2e]', 'bg-white'))}
            onClick={(e) => e.stopPropagation()}
          >
            <GlassCard className="p-6 border border-tech-pink/30">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-tech-pink/20">
                    <Flag className="w-5 h-5 text-tech-pink" />
                  </div>
                  <h3 className={`text-xl font-bold ${textClass}`}>举报内容</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className={cn(
                    'text-white/50 hover:text-white',
                    getThemeClass('', 'text-gray-500 hover:text-gray-700')
                  )}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="mb-6 p-4 rounded-lg bg-tech-pink/5 border border-tech-pink/20">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-tech-pink mt-0.5 flex-shrink-0" />
                  <div className={`text-sm font-medium ${textClass}`}>被举报的内容</div>
                </div>
                {messageAuthor && (
                  <div className={`text-sm ${mutedTextClass} mb-1`}>
                    作者: @{messageAuthor}
                  </div>
                )}
                {messageContent && (
                  <div className={`text-sm ${mutedTextClass} line-clamp-2`}>
                    {messageContent}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className={`block text-sm font-medium mb-3 ${textClass}`}>
                  请选择举报原因
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {reportReasons.map((reason) => (
                    <button
                      key={reason.id}
                      onClick={() => setSelectedReason(reason.id)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-3 rounded-lg border transition-all text-left',
                        selectedReason === reason.id
                          ? 'bg-tech-pink/20 border-tech-pink text-tech-pink'
                          : getThemeClass(
                              'bg-glass/20 border-glass-border text-foreground/70 hover:border-tech-pink/50',
                              'bg-gray-100 border-gray-200 text-gray-600 hover:border-pink-300'
                            )
                      )}
                    >
                      <span className="text-lg">{reason.icon}</span>
                      <span className="text-sm font-medium">{reason.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${textClass}`}>
                  详细说明 (可选)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="请提供更多详细信息，帮助我们更好地处理..."
                  rows={4}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border resize-none',
                    getThemeClass(
                      'bg-glass/20 border-glass-border text-foreground placeholder:text-foreground/50',
                      'bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400'
                    ),
                    'focus:outline-none focus:ring-2 focus:ring-tech-pink focus:border-transparent'
                  )}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  取消
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedReason || isSubmitting}
                  className="flex-1 bg-tech-pink hover:bg-pink-600 text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      提交中...
                    </div>
                  ) : (
                    '提交举报'
                  )}
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
