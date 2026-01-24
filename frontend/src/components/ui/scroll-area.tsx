"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// 简化的ScrollArea组件，避免使用radix-ui以解决安装问题
const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: 'vertical' | 'horizontal' }
>(({ className, children, orientation = 'vertical', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative overflow-auto",
      orientation === 'horizontal' && 'overflow-x-auto overflow-y-hidden',
      orientation === 'vertical' && 'overflow-y-auto overflow-x-hidden',
      className
    )}
    {...props}
  >
    {children}
  </div>
))
ScrollArea.displayName = "ScrollArea"

const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute bottom-0 right-0 top-0 w-2.5 bg-glass/20 hover:bg-glass/40 transition-colors",
      "data-[orientation=horizontal]:bottom-0 data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:w-full",
      className
    )}
    {...props}
  />
))
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
