---
trigger: always_on
---

# Design System - My Awesome Blog

## Design Philosophy

My Awesome Blog uses a **Glassmorphism** design language with a **tech-themed color palette**. The design emphasizes:
- Modern, futuristic aesthetics
- Depth through transparency and blur effects
- Smooth, purposeful animations
- High contrast for accessibility
- Responsive, adaptive layouts

## Glassmorphism Implementation

### Core Glass Classes
- Use `bg-glass/30` for semi-transparent backgrounds
- Apply `backdrop-blur-xl` for blur effect
- Use `border border-glass-border` for subtle borders
- Add `text-white` for text contrast on glass backgrounds

### Glass Card Pattern
```tsx
<div className="bg-glass/30 backdrop-blur-xl border border-glass-border rounded-lg">
  <div className="text-white">
    Content
  </div>
</div>
```

### Light Mode Considerations
- Glass cards in light mode: Use `bg-white/80` or higher opacity
- Text contrast in light mode: Use `#0F172A` (slate-900) for primary text
- Muted text in light mode: Use `#475569` (slate-600) minimum
- Border visibility in light mode: Use `border-gray-200`

## Color Palette

### Primary Tech Colors
- `tech-darkblue`: `#0f172a` - Primary dark background
- `tech-deepblue`: `#1e3a8a` - Secondary dark background

### Cyan Accents
- `tech-cyan`: `#06b6d4` - Primary accent
- `tech-lightcyan`: `#22d3ee` - Secondary accent
- `tech-sky`: `#0ea5e9` - Tertiary accent

### Glass Colors
- `glass`: `rgba(15, 23, 42, 0.5)` - Default glass background
- `glass-light`: Lighter glass variant for overlays
- `glass-border`: Subtle border color for glass elements
- `glass-glow`: Glow effect color for interactive elements

### Color Usage Rules
- Avoid generic color schemes (blue/white/gray)
- Stick to defined palette for consistency
- Use tech colors for branding elements
- Use cyan accents for interactive elements and highlights
- Maintain WCAG AA contrast ratios (4.5:1 minimum)

## Typography

### Font Stack
- Primary: Inter (configured in `layout.tsx`)
- Fallback: System fonts for performance

### Typography Scale
Use Tailwind's default scale:
- `text-xs` - Small labels (12px)
- `text-sm` - Body text (14px)
- `text-base` - Default (16px)
- `text-lg` - Large text (18px)
- `text-xl` - Headings (20px)
- `text-2xl` - Section headings (24px)
- `text-3xl` - Page headings (30px)
- `text-4xl` - Hero headings (36px)

### Typography Guidelines
- Maintain good contrast ratios for accessibility
- Use appropriate font weights (font-light, font-normal, font-semibold, font-bold)
- Avoid generic fonts for headings when custom alternatives available
- Use semantic HTML (`h1`-`h6`, `p`, `span`, etc.)

## Motion & Animation

### Available Animations
Predefined keyframes in `tailwind.config.js`:

| Animation | Duration | Usage |
|-----------|----------|-------|
| `fade-in-up` | 0.6s | Content appearing from bottom |
| `slide-in-left` | 0.6s | Elements entering from left |
| `slide-in-right` | 0.6s | Elements entering from right |
| `scale-fade-in` | 0.5s | Smooth entry effects |
| `fade-scale-up` | 0.6s | Combined fade and scale |
| `fade-in` | 0.6s | Simple fade effect |
| `glass-float` | 6s | Subtle floating effect on glass cards |
| `float-improved` | 8s | Enhanced floating animation |
| `pulse-glow` | 2s | Important elements |
| `glow-pulse` | 3s | Enhanced glow effect |
| `ripple` | 0.6s | Interactive feedback |
| `gradient-move` | 8s | Animated gradient backgrounds |
| `vertical-scroll` | 20s | Continuous vertical motion |

### Animation Usage Rules
- Apply `animate-fade-in-up` for entrance animations
- Use `animate-slide-in-left` for side elements
- Apply `animate-glass-float` for floating glass cards
- Use `animate-pulse-glow` for important interactive elements
- Apply animation delays with `delay-100`, `delay-200`, `delay-300` for staggered effects
- Avoid excessive animations that distract from content
- Respect `prefers-reduced-motion` for accessibility

### Animation Delays
- `delay-50`: 50ms
- `delay-100`: 100ms
- `delay-150`: 150ms
- `delay-200`: 200ms
- `delay-250`: 250ms
- `delay-300`: 300ms
- `delay-400`: 400ms
- `delay-500`: 500ms

## Spacing & Composition

### Spacing Scale
Follow Tailwind's spacing scale:
- `p-4`, `px-4`, `py-4` - Base padding (16px)
- `p-6`, `px-6`, `py-6` - Medium padding (24px)
- `p-8`, `px-8`, `py-8` - Large padding (32px)
- `gap-4`, `gap-x-4`, `gap-y-4` - Base gap (16px)
- `gap-6`, `gap-x-6`, `gap-y-6` - Medium gap (24px)
- `gap-8`, `gap-x-8`, `gap-y-8` - Large gap (32px)

### Layout Patterns
- Use flexbox for one-dimensional layouts: `flex`, `justify-center`, `items-center`
- Use grid for two-dimensional layouts: `grid`, `grid-cols-1`, `md:grid-cols-2`, `lg:grid-cols-3`
- Maintain visual hierarchy with appropriate sizing
- Use glass cards for content containers
- Balance transparency and opacity for visual clarity
- Implement consistent gutter spacing with `gap-x-*` and `gap-y-*`

### Responsive Breakpoints
- `xs`: 475px - Extra small devices
- `sm`: 640px - Small tablets
- `md`: 768px - Tablets
- `tab`: 834px - iPad portrait
- `lg`: 1024px - Small laptops
- `xl`: 1280px - Laptops
- `2xl`: 1536px - Large screens

## Anti-Patterns to Avoid

### Visual Anti-Patterns
- Generic font stacks (avoid default Inter/Roboto without customization)
- Clichéd color schemes (avoid common palettes like blue/white/gray)
- Predictable layouts (avoid standard card grids without glass treatment)
- Heavy solid backgrounds (avoid when glassmorphism is appropriate)
- Static content without subtle motion (use animations sparingly but effectively)

### Interaction Anti-Patterns
- No visual feedback on hover
- Excessive animations that distract
- Inconsistent hover effects
- Missing cursor states on interactive elements
- Layout shifts on hover

### Accessibility Anti-Patterns
- Insufficient color contrast
- Missing alt text on images
- No focus indicators
- Inaccessible to keyboard navigation
- No `prefers-reduced-motion` support

## Icon Guidelines

### Icon Usage
- Use SVG icons (Heroicons, Lucide, Simple Icons)
- Never use emojis as UI icons (🎨, 🚀, ⚙️)
- Use consistent icon sizing (24x24 viewBox with w-6 h-6)
- Verify brand logos from Simple Icons

### Icon Styling
- Apply `text-white` or `text-tech-cyan` for visibility
- Use `w-6 h-6` for standard icon size
- Apply hover effects with `transition-colors duration-200`
- Use proper ARIA labels for accessibility

## Common UI Patterns

### Floating Navbar
```tsx
<nav className="fixed top-4 left-4 right-4 z-50 bg-glass/30 backdrop-blur-xl border border-glass-border rounded-lg">
  <div className="text-white">
    Content
  </div>
</nav>
```

### Glass Card with Hover
```tsx
<div className="bg-glass/30 backdrop-blur-xl border border-glass-border rounded-lg hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
  <div className="text-white">
    Content
  </div>
</div>
```

### Hero Section with Gradient
```tsx
<section className="relative overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-r from-tech-darkblue via-tech-deepblue to-tech-darkblue animate-gradient-move"></div>
  <div className="relative z-10">
    <div className="text-white animate-fade-in-up">
      Hero Content
    </div>
  </div>
</section>
```

### Button with Glow
```tsx
<button className="bg-tech-cyan text-white px-6 py-3 rounded-lg hover:bg-tech-lightcyan transition-colors duration-200 animate-pulse-glow cursor-pointer">
  Button Text
</button>
```

## Pre-Delivery Checklist

### Visual Quality
- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] Brand logos are correct (verified from Simple Icons)
- [ ] Hover states don't cause layout shift
- [ ] Use theme colors directly (bg-primary) not var() wrapper

### Interaction
- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states provide clear visual feedback
- [ ] Transitions are smooth (150-300ms)
- [ ] Focus states visible for keyboard navigation

### Light/Dark Mode
- [ ] Light mode text has sufficient contrast (4.5:1 minimum)
- [ ] Glass/transparent elements visible in light mode
- [ ] Borders visible in both modes
- [ ] Test both modes before delivery

### Layout
- [ ] Floating elements have proper spacing from edges
- [ ] No content hidden behind fixed navbars
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile

### Accessibility
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color is not the only indicator
- [ ] `prefers-reduced-motion` respected
