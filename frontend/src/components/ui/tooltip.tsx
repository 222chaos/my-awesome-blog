"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// 简化的Tooltip组件，避免使用radix-ui以解决安装问题
const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const Tooltip = ({ children, open, defaultOpen, onOpenChange }: { 
  children: React.ReactNode, 
  open?: boolean, 
  defaultOpen?: boolean, 
  onOpenChange?: (open: boolean) => void 
}) => {
  return <>{children}</>
}

const TooltipTrigger = ({ children, ...props }: { children: React.ReactNode } & React.HTMLAttributes<HTMLButtonElement>) => {
  return <span {...props}>{children}</span>
}

const TooltipContent = ({ children, ...props }: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={cn(
        "absolute z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground",
        props.className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }