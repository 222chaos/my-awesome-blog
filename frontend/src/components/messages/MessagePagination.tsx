'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useThemedClasses } from '@/hooks/useThemedClasses';

interface MessagePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showEdgeButtons?: boolean;
  showEllipsis?: boolean;
}

export default function MessagePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showEdgeButtons = true,
  showEllipsis = true
}: MessagePaginationProps) {
  const { getThemeClass } = useThemedClasses();

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    pages.push(totalPages);

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {showEdgeButtons && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            'w-10 h-10 p-0',
            getThemeClass(
              'border-glass-border text-foreground hover:bg-glass/40',
              'border-gray-300 text-gray-700 hover:bg-gray-100'
            )
          )}
        >
          <ChevronsLeft className="w-4 h-4" />
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'w-10 h-10 p-0',
          getThemeClass(
            'border-glass-border text-foreground hover:bg-glass/40',
            'border-gray-300 text-gray-700 hover:bg-gray-100'
          )
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <Button
              key={index}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(page)}
              className={cn(
                'w-10 h-10 p-0 font-medium',
                currentPage === page
                  ? 'bg-tech-cyan text-black'
                  : getThemeClass(
                      'border-glass-border text-foreground hover:bg-glass/40',
                      'border-gray-300 text-gray-700 hover:bg-gray-100'
                    )
              )}
            >
              {page}
            </Button>
          ) : (
            <span
              key={index}
              className={cn(
                'w-10 h-10 flex items-center justify-center text-sm',
                getThemeClass('text-foreground/50', 'text-gray-400')
              )}
            >
              ...
            </span>
          )
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'w-10 h-10 p-0',
          getThemeClass(
            'border-glass-border text-foreground hover:bg-glass/40',
            'border-gray-300 text-gray-700 hover:bg-gray-100'
          )
        )}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {showEdgeButtons && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            'w-10 h-10 p-0',
            getThemeClass(
              'border-glass-border text-foreground hover:bg-glass/40',
              'border-gray-300 text-gray-700 hover:bg-gray-100'
            )
          )}
        >
          <ChevronsRight className="w-4 h-4" />
        </Button>
      )}

      <div
        className={cn(
          'px-4 py-2 rounded-lg text-sm',
          getThemeClass(
            'bg-glass/20 text-foreground/70',
            'bg-gray-100 text-gray-600'
          )
        )}
      >
        第 {currentPage} / {totalPages} 页
      </div>
    </div>
  );
}
