## Fix Nested Link Hydration Error

### Problem
The `Navbar` component wraps `AnimatedLogo` in a `<Link>` component, but `AnimatedLogo` itself also renders a `<Link>`, creating nested `<a>` tags that cause a hydration error.

### Solution
1. **Remove outer Link wrapper** from `Navbar.tsx` (lines 144-146)
   - Replace the `<Link href="/">` with a `<div>` 
   - Keep the hover effect (`group` class) for animation
2. **Preserve functionality**
   - `AnimatedLogo` already has its own link, so navigation will still work
   - The hover animation (`scale-110`) will still trigger via the parent div's `group-hover:` class

### Changes Required
- **File**: `frontend/src/components/navigation/Navbar.tsx`
- **Change**: Replace `<Link href="/" className="flex items-center group">` with `<div className="flex items-center group">` and remove the closing `</Link>`