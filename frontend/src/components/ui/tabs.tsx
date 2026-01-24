"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{ value: string, onChange: (value: string) => void } | null>(null);

const Tabs = ({ className, defaultValue, value, onValueChange, ...props }: React.HTMLAttributes<HTMLDivElement> & { defaultValue?: string, value?: string, onValueChange?: (value: string) => void }) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || '');
  
  const currentValue = value !== undefined ? value : internalValue;
  
  const handleChange = (val: string) => {
    if (onValueChange) {
      onValueChange(val);
    } else {
      setInternalValue(val);
    }
  };
  
  return (
    <TabsContext.Provider value={{ value: currentValue, onChange: handleChange }}>
      <div className={cn("relative", className)} {...props}>
        {props.children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-glass/30 p-1 text-gray-300 backdrop-blur-lg",
        className
      )}
      {...props}
    />
  );
});
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        context?.value === value
          ? "bg-tech-cyan/20 text-tech-cyan shadow-lg shadow-tech-cyan/10"
          : "",
        className
      )}
      onClick={() => context?.onChange(value)}
      {...props}
    >
      {children}
    </button>
  );
});

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  
  if (context?.value !== value) {
    return null;
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent }