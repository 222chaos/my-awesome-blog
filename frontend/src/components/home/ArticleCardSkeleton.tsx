'use client';

export function ArticleCardSkeleton() {
  return (
    <div className="rounded-lg border border-glass-border bg-glass p-4 sm:p-6 space-y-3 sm:space-y-4">
      {/* 标题骨架 */}
      <div className="h-5 sm:h-6 w-3/4 bg-gradient-to-r from-tech-cyan/20 to-tech-cyan/10 rounded animate-pulse" />

      {/* 摘要骨架 */}
      <div className="space-y-2">
        <div className="h-3 sm:h-4 w-full bg-gradient-to-r from-tech-cyan/10 to-transparent rounded animate-pulse" />
        <div className="h-3 sm:h-4 w-2/3 bg-gradient-to-r from-tech-cyan/10 to-transparent rounded animate-pulse" />
      </div>

      {/* 元信息骨架 */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="h-3 sm:h-4 w-14 sm:w-16 bg-gradient-to-r from-tech-cyan/10 to-transparent rounded animate-pulse" />
        <div className="h-3 sm:h-4 w-10 sm:w-12 bg-gradient-to-r from-tech-cyan/10 to-transparent rounded animate-pulse" />
        <div className="h-3 sm:h-4 w-10 sm:w-12 bg-gradient-to-r from-tech-cyan/10 to-transparent rounded animate-pulse" />
      </div>
    </div>
  );
}

