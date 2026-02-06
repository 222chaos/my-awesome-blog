'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useThemedClasses } from '@/hooks/useThemedClasses';

export type ConfirmDialogType = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmDialogType;
  showIcon?: boolean;
  isLoading?: boolean;
}

const typeConfig = {
  danger: {
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-500/10',
    confirmColor: 'bg-red-500 hover:bg-red-600',
    borderColor: 'border-red-500/30',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    iconBg: 'bg-yellow-500/10',
    confirmColor: 'bg-yellow-500 hover:bg-yellow-600',
    borderColor: 'border-yellow-500/30',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-500/10',
    confirmColor: 'bg-blue-500 hover:bg-blue-600',
    borderColor: 'border-blue-500/30',
  },
  success: {
    icon: CheckCircle,
    iconColor: 'text-green-500',
    iconBg: 'bg-green-500/10',
    confirmColor: 'bg-green-500 hover:bg-green-600',
    borderColor: 'border-green-500/30',
  },
};

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消',
  type = 'danger',
  showIcon = true,
  isLoading = false,
}: ConfirmDialogProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const { getThemeClass } = useThemedClasses();

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className={cn(
                'w-full max-w-md rounded-xl border shadow-2xl pointer-events-auto',
                getThemeClass('bg-[#1a1a2e]', 'bg-white'),
                config.borderColor
              )}
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {showIcon && (
                    <div className={cn('p-3 rounded-full', config.iconBg)}>
                      <Icon className={cn('w-6 h-6', config.iconColor)} />
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {title}
                    </h3>
                    {description && (
                      <p className="text-sm text-foreground/70">
                        {description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={onClose}
                    className="text-foreground/50 hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {cancelText}
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className={cn('flex-1', config.confirmColor)}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        处理中...
                      </div>
                    ) : (
                      confirmText
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
