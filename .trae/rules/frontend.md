---
trigger: always_on
---

# Frontend Development Guidelines - My Awesome Blog

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS with custom glassmorphism theme
- **UI Components**: Radix UI primitives + Custom glass components
- **State Management**: React Context API
- **Animation**: Framer Motion + GSAP
- **Testing**: Jest with React Testing Library
- **Linting**: ESLint + Prettier

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   ├── articles/     # Articles pages
│   │   ├── profile/      # Profile page
│   │   └── login/       # Login page
│   ├── components/
│   │   ├── ui/          # Reusable UI components
│   │   ├── blog/        # Blog-specific components
│   │   ├── home/        # Home page components
│   │   ├── icons/       # Icon components
│   │   ├── layout/      # Layout components
│   │   └── messages/    # Message components
│   ├── lib/             # Utility functions
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React Context providers
│   ├── services/        # API service functions
│   ├── types/           # TypeScript type definitions
│   └── styles/         # Global styles
├── public/             # Static assets
└── config/             # Configuration files
```

## TypeScript/React Patterns

### Component Structure

#### Interface for Props
```typescript
interface ComponentProps {
  title: string;
  count?: number;
  className?: string;
  children?: React.ReactNode;
}
```

#### Default Export Component
```typescript
export default function ComponentName({ title, count = 0, className, children }: ComponentProps) {
  return (
    <div className={cn('base-class', className)}>
      {children}
    </div>
  );
}
```

#### forwardRef Pattern (when DOM access needed)
```typescript
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass';
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border',
          variant === 'glass' && 'bg-glass/30 backdrop-blur-xl border-glass-border',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
export default Card;
```

### Type Guidelines

#### Use interface over type for object shapes
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
```

#### Use type for unions, tuples, and utility types
```typescript
type Theme = 'light' | 'dark';
type Coordinates = [number, number];
type PartialUser = Partial<User>;
```

#### Use React.ReactNode for children
```typescript
interface ContainerProps {
  children: React.ReactNode;
}
```

#### Avoid any type
```typescript
const data: unknown = response;
if (typeof data === 'object' && data !== null) {
  const user = data as User;
}
```

### Performance Optimization

#### React.memo for expensive components
```typescript
const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <div>{/* heavy rendering */}</div>;
});
```

#### useCallback for event handlers
```typescript
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);
```

#### useMemo for expensive computations
```typescript
const filteredItems = useMemo(() => {
  return items.filter(item => item.active);
}, [items]);
```

## Import Patterns

### Grouping Order
```typescript
// 1. React imports
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// 2. External libraries
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 3. Internal modules
import GlassCard from '@/components/ui/GlassCard';
import { useTheme } from '@/contexts/theme-context';
```

### Absolute Imports
Use `@/*` alias as configured in `tsconfig.json`:
```typescript
import GlassCard from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import useAuth from '@/hooks/useAuth';
```

## Tailwind CSS Styling

### Glassmorphism Classes
```tsx
<div className="bg-glass/30 backdrop-blur-xl border border-glass-border rounded-lg">
  Content
</div>
```

### Conditional Classes with cn()
```tsx
const isActive = true;
<div className={cn(
  'px-4 py-2 rounded',
  isActive && 'bg-tech-cyan text-white',
  !isActive && 'bg-white/10 text-gray-300'
)}>
  Button
</div>
```

### Tech Theme Colors
```tsx
<div className="bg-tech-darkblue text-tech-cyan">
  Tech-themed content
</div>
```

### Animation Classes
```tsx
<div className="animate-fade-in-up">
  Fade in from bottom
</div>
```

### Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  Responsive grid
</div>
```

## Component Examples

### Glass Card Component
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  hoverEffect?: boolean;
  className?: string;
}

export default function GlassCard({ children, hoverEffect = false, className }: GlassCardProps) {
  return (
    <div className={cn(
      'bg-glass/30 backdrop-blur-xl border border-glass-border rounded-lg',
      hoverEffect && 'hover:-translate-y-1 hover:shadow-lg transition-all duration-200 cursor-pointer',
      className
    )}>
      {children}
    </div>
  );
}
```

### Button Component
```typescript
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'glass' | 'ghost';
  children: React.ReactNode;
}

export default function Button({ variant = 'default', children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-6 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer',
        variant === 'default' && 'bg-tech-cyan text-white hover:bg-tech-lightcyan',
        variant === 'glass' && 'bg-glass/30 backdrop-blur-xl border border-glass-border text-white hover:bg-glass/50',
        variant === 'ghost' && 'bg-transparent text-tech-cyan hover:bg-glass/30',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

## File Naming Conventions

### Component Files
- PascalCase.tsx for components: `GlassCard.tsx`, `UserProfile.tsx`
- camelCase.ts for utilities: `utils.ts`, `useMediaQuery.ts`

### Page Files
- `page.tsx` for route pages
- `layout.tsx` for layouts
- `loading.tsx` for loading states
- `error.tsx` for error boundaries

### Type Files
- `*.types.ts` or `index.ts` for type definitions
- `*.d.ts` for type declarations

## Client vs Server Components

### Server Components (default)
```typescript
// No 'use client' directive needed
export default async function ServerComponent() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

### Client Components
```typescript
'use client';

import { useState } from 'react';

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### When to use 'use client'
- When using hooks (useState, useEffect, etc.)
- When handling user events (onClick, onSubmit, etc.)
- When using browser APIs (window, document, etc.)
- When using context providers

## Error Handling

### Error Boundaries
```typescript
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```

### Try-Catch in async functions
```typescript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
```

## API Integration

### Service Function Pattern
```typescript
import type { Article } from '@/types';

export async function getArticles(): Promise<Article[]> {
  const response = await fetch('/api/v1/articles/');
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  return response.json();
}

export async function getArticle(id: string): Promise<Article> {
  const response = await fetch(`/api/v1/articles/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch article');
  }
  return response.json();
}
```

### Custom Hook for API
```typescript
import { useState, useEffect } from 'react';
import type { Article } from '@/types';

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadArticles() {
      try {
        const response = await fetch('/api/v1/articles/');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, []);

  return { articles, loading, error };
}
```

## Testing

### Component Test Example
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import GlassCard from '@/components/ui/GlassCard';

describe('GlassCard', () => {
  it('renders children correctly', () => {
    render(<GlassCard><div>Test content</div></GlassCard>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies hover effect when enabled', () => {
    render(<GlassCard hoverEffect={true}>Test</GlassCard>);
    const card = screen.getByText('Test');
    expect(card).toHaveClass('hover:-translate-y-1');
  });

  it('applies custom className', () => {
    render(<GlassCard className="custom-class">Test</GlassCard>);
    const card = screen.getByText('Test');
    expect(card).toHaveClass('custom-class');
  });
});
```

### Hook Test Example
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '@/hooks/useCounter';

describe('useCounter', () => {
  it('increments count', () => {
    const { result } = renderHook(() => useCounter());
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
  });
});
```

## ESLint & Prettier

### ESLint Configuration
Located in `eslint.config.js`:
- `no-console`: warn
- `no-debugger`: error
- `prefer-const`: error
- `no-var`: error
- `eqeqeq`: error (use strict equality)
- `camelcase`: error for variables (never for properties)
- `react/react-in-jsx-scope`: off (Next.js auto-imports React)
- `react/prop-types`: off (TypeScript provides type checking)

### Prettier Configuration
Located in `.prettierrc.json`:
- Single quotes for strings
- No semicolons
- 2 space indentation
- Trailing commas where valid in ES5

## Best Practices

### Performance
- Use dynamic imports for code splitting: `const Component = dynamic(() => import('./Component'))`
- Lazy load images with Next.js Image component
- Use React.memo for expensive re-renders
- Implement virtual scrolling for long lists
- Optimize images and assets

### Accessibility
- Use semantic HTML elements
- Add ARIA labels to interactive elements
- Ensure keyboard navigability
- Provide alt text for images
- Maintain proper color contrast
- Support screen readers

### Security
- Validate all user inputs
- Sanitize user-generated content
- Use HTTPS in production
- Implement proper authentication
- Protect against XSS attacks

### Code Quality
- Keep components small and focused
- Use descriptive variable and function names
- Write self-documenting code
- Add comments only when necessary
- Follow consistent patterns
- Test critical functionality
