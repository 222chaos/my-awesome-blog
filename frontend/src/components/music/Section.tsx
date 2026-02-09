'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SectionProps {
  title: string;
  titleClassName?: string;
  children: React.ReactNode;
  moreLink?: string;
  moreText?: string;
}

export default function Section({ title, titleClassName, children, moreLink, moreText = '查看全部' }: SectionProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={cn('font-sf-pro-display text-title-2 text-black dark:text-white', titleClassName)}>
          {title}
        </h2>
        {moreLink && (
          <Link 
            href={moreLink}
            className="font-sf-pro-text text-body text-[#fa2d2f] hover:text-[#ff3b30] transition-colors duration-200"
          >
            {moreText}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
