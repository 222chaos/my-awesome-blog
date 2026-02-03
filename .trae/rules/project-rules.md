---
trigger: always_on
---

# My Awesome Blog - AI Assistant Coding Guidelines

## Project Overview & Tech Stack

My Awesome Blog is a modern monorepo containing:
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: FastAPI with Python, SQLAlchemy 2.0, Pydantic v2
- **Database**: PostgreSQL (production), SQLite (development)
- **Design System**: Glassmorphism with tech-themed color palette
- **Architecture**: Containerized with Docker Compose

## Role Definition

You are a senior full-stack developer with expertise in:
- Modern React/Next.js development patterns
- FastAPI and asynchronous Python development
- Database design with SQLAlchemy ORM
- Glassmorphism UI/UX design principles
- Enterprise-level code quality and architecture

## Architecture Guidelines

### Monorepo Structure
- `frontend/` - Next.js application with App Router
- `backend/` - FastAPI application with API v1 endpoints
- `docs/` - Documentation files
- Shared configuration files at root level

### Frontend Architecture
- Next.js 14 with App Router (`app/` directory structure)
- TypeScript with strict mode enabled
- Tailwind CSS for styling with custom theme
- Component organization: `components/ui`, `components/blog`, `components/home`
- Absolute imports using `@/*` alias (configured in `tsconfig.json`)

### Backend Architecture
- FastAPI with APIRouter for endpoint organization
- SQLAlchemy 2.0 ORM with async support
- Pydantic v2 for request/response validation
- CRUD operations separated in `app/crud/`
- Models defined in `app/models/`
- Schemas in `app/schemas/`
- Dependency injection for authentication and database sessions

## Frontend Development Guidelines

### TypeScript/React Patterns
- Use `interface` over `type` for object shapes
- Enable strict TypeScript mode (as configured in `tsconfig.json`)
- Use `React.ReactNode` for children props
- Functional components with hooks (avoid class components)
- Default exports for components
- Explicit typing for all props and return values
- Avoid `any` type; use `unknown` or proper typing instead
- Use React.forwardRef when DOM access is needed
- Implement React.memo for components that render frequently with same props
- Use useCallback/useMemo for expensive computations to optimize performance

### Import Patterns
- Group imports: React → external libraries → internal modules
- Use absolute imports via `@/*` alias: `import GlassCard from '@/components/ui/GlassCard'`
- Import `cn` utility for conditional class names: `import { cn } from '@/lib/utils'`
- Destructure props in component signature
- Example import pattern:
  ```typescript
  import { useState, useEffect } from 'react';
  import { Button } from '@/components/ui/button';
  import GlassCard from '@/components/ui/GlassCard';
  import { cn } from '@/lib/utils';
  ```

### Component Structure
- Default export for components: `export default function ComponentName() { ... }`
- Define prop interfaces: `interface ComponentProps { ... }`
- Use forwardRef when DOM access is needed
- Implement proper TypeScript typing for all props
- Follow accessibility best practices (ARIA labels, semantic HTML)

### File Naming Conventions
- Components: `PascalCase.tsx` (e.g., `GlassCard.tsx`)
- Utilities/Hooks: `camelCase.ts` (e.g., `useMediaQuery.ts`, `utils.ts`)
- Pages: `page.tsx` (Next.js App Router)
- Layouts: `layout.tsx`
- TypeScript utility files: `.ts` extension
- Server Components: Use `.tsx` extension and add `'use client'` directive for Client Components

## Backend Development Guidelines

### Python/FastAPI Patterns
- Use type hints in all function signatures
- Leverage Pydantic models for request/response validation
- Use dependency injection with `Depends` for authentication and database sessions
- Implement async/await for asynchronous operations
- Follow FastAPI best practices for path operations
- Use HTTPException for error responses
- Structure endpoints with APIRouter

### SQLAlchemy/ORM Patterns
- Use SQLAlchemy 2.0 syntax
- Define models inheriting from `Base` (from `app.core.database`)
- Implement relationships with `relationship()` and `back_populates`
- Use `Column` definitions with proper types and constraints
- Apply cascading operations when appropriate (e.g., `cascade="all, delete-orphan"`)

### Pydantic Schema Patterns
- Inherit from `BaseModel` for all schemas
- Use inheritance for schema variations (e.g., `ArticleBase`, `ArticleCreate`, `ArticleUpdate`)
- Implement proper validation with field types and constraints
- Use `Config.from_attributes = True` for ORM compatibility
- Handle optional fields with `Optional[type]` and default values

### Error Handling
- Use `HTTPException` from FastAPI for HTTP errors
- Implement proper status codes (400, 401, 403, 404, 500, etc.)
- Log errors with `app.utils.logger.app_logger`
- Return user-friendly error messages
- Validate permissions and business logic before operations

### File Naming Conventions
- Python modules: `snake_case.py` (e.g., `article.py`)
- Test files: `test_*.py` (e.g., `test_auth.py`)
- API endpoints: `snake_case.py` in `endpoints/` directory
- Model/schema files: match entity names (e.g., `article.py`, `user.py`)

## Code Quality & Standards

### Frontend Standards
- Follow ESLint rules as defined in `eslint.config.js`
- Adhere to Prettier formatting as defined in `.prettierrc.json`
- Use camelCase for variable names (properties: `never`)
- Prefer `const` over `let`, avoid `var`
- Use strict equality (`===` and `!==`)
- Enable TypeScript strict mode
- Implement proper error boundaries when appropriate

### Backend Standards
- Follow PEP 8 Python style guide
- Use type hints consistently
- Follow FastAPI best practices
- Implement proper docstrings for functions and classes
- Use meaningful variable and function names
- Structure code according to existing patterns in the codebase

### Import/Export Patterns
- Frontend: Use absolute imports with `@/` alias
- Backend: Use absolute imports within the `app` package
- Group imports logically (standard library → third-party → local modules)

## Testing Guidelines
- Frontend: Use Jest with React Testing Library
- Backend: Use pytest with TestClient for API tests
- Write tests that focus on user interactions
- Mock external dependencies appropriately
- Maintain 50%+ coverage thresholds as configured

## AI Assistant Guidelines

### Approach to Tasks
1. **Study First**: Examine existing patterns in the codebase before implementing
2. **Match Patterns**: Follow established architectural and coding patterns
3. **Complete What's Asked**: Focus on the specific requirements without scope creep
4. **Blend Seamlessly**: Ensure new code matches existing style and structure
5. **Design Process**: Purpose → Tone → Constraints → Differentiation

### Working with Existing Code
- Match the existing code style in each file
- Use the same naming conventions as surrounding code
- Follow the same architectural patterns
- Respect the established project structure
- Maintain consistency with existing design choices

### Problem Solving Methodology
- When unsure about implementation, look for similar patterns in the codebase
- Prioritize consistency with existing code over personal preferences
- When introducing new functionality, follow the same patterns as existing features
- Always consider how your changes fit into the larger architecture

## Performance & Accessibility Requirements

### Performance Optimization
- Optimize images and assets appropriately
- Use lazy loading for components that appear below the fold
- Implement proper code splitting with dynamic imports when appropriate
- Minimize bundle size by avoiding unnecessary dependencies
- Optimize database queries in backend operations
- Use memoization techniques (useMemo, useCallback) when appropriate

### Accessibility Standards
- Implement proper ARIA labels and attributes
- Ensure semantic HTML structure
- Maintain keyboard navigability
- Follow WCAG guidelines for color contrast
- Provide alternative text for images
- Use focus indicators for interactive elements
- Ensure screen reader compatibility

## References & Key Files

### Configuration Files
- `frontend/eslint.config.js` - Frontend linting rules
- `frontend/.prettierrc.json` - Frontend formatting rules
- `frontend/tsconfig.json` - TypeScript configuration
- `frontend/tailwind.config.js` - Tailwind CSS theme and animations
- `backend/requirements.txt` - Backend dependencies

### Documentation
- `.trae/rules/design-system.md` - Design system principles
- `.trae/rules/frontend.md` - Frontend development guidelines
- `.trae/rules/backend.md` - Backend development guidelines
- `README.md` - Project overview and setup instructions
- `frontend/README.md` - Frontend-specific documentation
- `backend/README.md` - Backend-specific documentation

### Key Implementation Examples
- `frontend/src/components/ui/GlassCard.tsx` - Glassmorphism component implementation
- `frontend/src/lib/utils.ts` - Utility functions (cn function)
- `backend/app/models/article.py` - SQLAlchemy model example
- `backend/app/schemas/article.py` - Pydantic schema example
- `backend/app/api/v1/endpoints/articles.py` - FastAPI endpoint patterns
- `frontend/src/app/layout.tsx` - Next.js layout structure
