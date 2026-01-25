"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

interface NavigationMenuContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const NavigationMenuContext = React.createContext<NavigationMenuContextProps | null>(null);

const NavigationMenu = ({ children, defaultOpen = false, open: controlledOpen, onOpenChange }: { children: React.ReactNode, defaultOpen?: boolean, open?: boolean, onOpenChange?: (open: boolean) => void }) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  
  const open = controlledOpen ?? isOpen;
  const setOpen = onOpenChange ? (newOpen: boolean) => onOpenChange(newOpen) : setIsOpen;
  
  return (
    <NavigationMenuContext.Provider value={{ open, setOpen }}>
      <nav className="relative">
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
};

const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
));
NavigationMenuList.displayName = "NavigationMenuList";

const NavigationMenuItem = ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
  <li {...props}>{children}</li>
);

const NavigationMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof navigationMenuTriggerStyle>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(NavigationMenuContext);
  
  const toggleOpen = () => {
    if (context) {
      context.setOpen(!context.open);
    }
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        navigationMenuTriggerStyle(),
        "group",
        className
      )}
      onClick={toggleOpen}
      {...props}
    >
      {children}
      <ChevronDown
        className="ml-1 h-4 w-4 transition duration-200 group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </button>
  );
});
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(NavigationMenuContext);
  
  if (!context || !context.open) return null;
  
  return (
    <div
      ref={ref}
      className={cn(
        "left-0 top-0 w-full md:w-auto",
        "glass-morphism border border-glass-border bg-glass backdrop-blur-xl text-gray-100 shadow-lg",
        className
      )}
      {...props}
    />
  );
});
NavigationMenuContent.displayName = "NavigationMenuContent";

const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> &
    VariantProps<typeof navigationMenuLinkStyle>
>(({ className, children, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(navigationMenuLinkStyle(), className)}
    {...props}
  >
    {children}
  </a>
));
NavigationMenuLink.displayName = "NavigationMenuLink";

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-glass px-4 py-2 text-sm font-medium text-white transition-colors hover:text-tech-cyan focus:text-tech-cyan focus:outline-none disabled:pointer-events-none disabled:opacity-50 backdrop-blur-lg"
);

const navigationMenuLinkStyle = cva(
  "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-glass hover:text-tech-cyan focus:bg-glass focus:text-tech-cyan data-[active]:bg-glass"
);

export {
  navigationMenuTriggerStyle,
  navigationMenuLinkStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
}
