"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
  }
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role={decorative ? "separator" : undefined}
        aria-orientation={orientation}
        className={cn(
          "shrink-0 bg-gradient-to-r from-tech-cyan/20 via-tech-cyan/50 to-tech-cyan/20",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )}
        {...props}
      />
    );
  }
);
Separator.displayName = "Separator";

export { Separator }
