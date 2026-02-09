'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        glass: 'bg-glass text-tech-cyan border border-glass-border backdrop-blur-md',
        'glass-light': 'bg-glass text-tech-deepblue border border-glass-border backdrop-blur-md',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const rippleRef = React.useRef<HTMLSpanElement | null>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const animationTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const rippleRefMerged = React.useMemo(
      () => ({ current: null }),
      []
    );

    React.useEffect(() => {
      return () => {
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
        }
        if (rippleRef.current) {
          rippleRef.current.remove();
          rippleRef.current = null;
        }
      };
    }, []);

    const handleClick = React.useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e);
      }

      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let ripple = rippleRef.current;
      
      if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'button-ripple';
        rippleRef.current = ripple;
        button.appendChild(ripple);
      }

      ripple.style.setProperty('--ripple-x', `${x}px`);
      ripple.style.setProperty('--ripple-y', `${y}px`);
      
      ripple.style.animation = 'none';
      ripple.offsetHeight;
      ripple.style.animation = 'button-ripple 0.6s ease-out forwards';

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      animationTimeoutRef.current = setTimeout(() => {
        if (rippleRef.current) {
          rippleRef.current.remove();
          rippleRef.current = null;
        }
      }, 600);
    }, [onClick]);

    React.useImperativeHandle(ref, () => buttonRef.current!);

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={asChild ? undefined : buttonRef}
        onClick={handleClick}
        {...(asChild ? {} : { type: 'button' })}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
