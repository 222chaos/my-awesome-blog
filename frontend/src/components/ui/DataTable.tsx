'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, Filter, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemedClasses } from '@/hooks/useThemedClasses';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
  onRowClick?: (row: T) => void;
  sortable?: boolean;
  searchable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  className?: string;
}

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  selectable = false,
  onSelectionChange,
  onRowClick,
  sortable: globalSortable = true,
  searchable: globalSearchable = true,
  pagination = true,
  pageSize = 10,
  className
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { getThemeClass } = useThemedClasses();

  const filteredData = data.filter(row => {
    if (!globalSearchable || !searchQuery) return true;
    return columns.some(col => {
      if (!col.searchable && !globalSearchable) return false;
      const value = row[col.key as keyof T];
      return String(value).toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;

    const aValue = a[sortConfig.key as keyof T];
    const bValue = b[sortConfig.key as keyof T];

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key: string) => {
    if (!globalSortable) return;

    setSortConfig(prev => {
      if (prev?.key === key) {
        if (prev.direction === 'asc') {
          return { key, direction: 'desc' };
        }
        return null;
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(paginatedData.map((_, index) => index));
      setSelectedRows(newSelected);
      onSelectionChange?.(paginatedData);
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (index: number, checked: boolean, row: T) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedRows(newSelected);
    onSelectionChange?.(paginatedData.filter((_, i) => newSelected.has(i)));
  };

  const allSelected = paginatedData.length > 0 && selectedRows.size === paginatedData.length;
  const someSelected = selectedRows.size > 0 && selectedRows.size < paginatedData.length;

  return (
    <div className={cn('space-y-4', className)}>
      {globalSearchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="搜索..."
            className={cn(
              'w-full pl-10 pr-4 py-2 rounded-lg border transition-all',
              getThemeClass(
                'bg-glass/20 border-glass-border text-foreground placeholder:text-foreground/50',
                'bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-400'
              ),
              'focus:outline-none focus:ring-2 focus:ring-tech-cyan/20 focus:border-tech-cyan'
            )}
          />
        </div>
      )}

      <div className={cn(
        'overflow-hidden rounded-lg border transition-all',
        getThemeClass('border-glass-border', 'border-gray-200')
      )}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn(
                'border-b transition-colors',
                getThemeClass('border-glass-border bg-glass/30', 'border-gray-200 bg-gray-50')
              )}>
                {selectable && (
                  <th className="px-4 py-3 text-left w-12">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={someSelected ? (input) => { if(input) input.indeterminate = true; } : undefined}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 rounded border-glass-border accent-tech-cyan"
                    />
                  </th>
                )}
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className={cn(
                      'px-4 py-3 text-left text-sm font-medium',
                      col.className,
                      col.sortable && globalSortable && 'cursor-pointer hover:text-tech-cyan transition-colors'
                    )}
                    onClick={() => col.sortable && globalSortable && handleSort(String(col.key))}
                  >
                    <div className="flex items-center gap-2">
                      {col.title}
                      {col.sortable && globalSortable && (
                        <ArrowUpDown className="w-4 h-4" />
                      )}
                      {sortConfig?.key === col.key && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {sortConfig.direction === 'asc' ? (
                            <ChevronUp className="w-4 h-4 text-tech-cyan" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-tech-cyan" />
                          )}
                        </motion.div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {paginatedData.map((row, rowIndex) => (
                  <motion.tr
                    key={rowIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: rowIndex * 0.02 }}
                    className={cn(
                      'border-b transition-colors',
                      getThemeClass('border-glass-border hover:bg-glass/20', 'border-gray-200 hover:bg-gray-50'),
                      onRowClick && 'cursor-pointer',
                      selectedRows.has(rowIndex) && 'bg-tech-cyan/10'
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(rowIndex)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleSelectRow(rowIndex, e.target.checked, row);
                          }}
                          className="w-4 h-4 rounded border-glass-border accent-tech-cyan"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td
                        key={String(col.key)}
                        className={cn('px-4 py-3 text-sm', col.className)}
                      >
                        {col.render ? col.render(row[col.key as keyof T], row, rowIndex) : String(row[col.key as keyof T])}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>

              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-4 py-12 text-center text-sm text-muted-foreground"
                  >
                    {searchQuery ? '未找到匹配的数据' : '暂无数据'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            显示 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredData.length)} 共 {filteredData.length} 条
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={cn(
                'px-3 py-2 rounded-lg text-sm transition-colors',
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-glass/20'
              )}
            >
              首页
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={cn(
                'px-3 py-2 rounded-lg text-sm transition-colors',
                currentPage === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-glass/20'
              )}
            >
              上一页
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm transition-colors',
                      currentPage === pageNum
                        ? 'bg-tech-cyan text-black'
                        : 'hover:bg-glass/20'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                'px-3 py-2 rounded-lg text-sm transition-colors',
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-glass/20'
              )}
            >
              下一页
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={cn(
                'px-3 py-2 rounded-lg text-sm transition-colors',
                currentPage === totalPages
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-glass/20'
              )}
            >
              末页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
