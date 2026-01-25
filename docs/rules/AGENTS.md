# AGENTS.md - My Awesome Blog Codebase Guide

This document provides essential information for AI agents working in the My Awesome Blog repository. It covers build commands, code style guidelines, and project patterns.

## Project Overview

- **Monorepo structure**: `frontend/` (Next.js 14 + TypeScript) and `backend/` (FastAPI + PostgreSQL)
- **Frontend**: Next.js 14 App Router, Tailwind CSS, Jest, ESLint, Prettier
- **Backend**: FastAPI, SQLAlchemy 2.0, Pydantic v2, Alembic, pytest
- **Database**: PostgreSQL (production), SQLite (development)
- **Containerization**: Docker Compose for local development

## Build Commands

### Frontend (from `frontend/` directory)

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npm run format` | Format code with Prettier |
| `npm run test` | Run Jest tests once |
| `npm run test:watch` | Run Jest in watch mode |

**Single test execution**: `npm test -- --testPathPattern=filename` or use Jest CLI.

### Backend (from `backend/` directory)

| Command | Purpose |
|---------|---------|
| `uvicorn app.main:app --reload --port 8000` | Start development server (localhost:8000) |
| `alembic upgrade head` | Apply database migrations |
| `alembic revision --autogenerate -m "message"` | Create new migration |
| `pytest` | Run all tests |
| `pytest app/tests/test_auth.py` | Run specific test file |
| `pytest -v -k "test_login"` | Run tests matching pattern |
| `pytest --cov=app --cov-report=html` | Generate coverage report |

**Note**: Backend uses `pytest.ini` configuration with `asyncio_mode = auto`.

## Linting & Formatting

### Frontend
- **ESLint**: Configuration in `eslint.config.js` and `.eslintrc.cjs`. Rules enforce:
  - No `console` (warn), no `debugger` (error)
  - Prefer `const` over `let`, no `var`
  - Strict equality (`eqeqeq`)
  - CamelCase for variables (properties: `never`)
  - TypeScript: `no-explicit-any` (warn), `no-unused-vars` (error)
- **Prettier**: `.prettierrc.json` with 80 print width, single quotes, trailing commas ES5.
- **EditorConfig**: `.editorconfig` with 2-space indents, LF line endings.
- **Git hooks**: Husky + lint-staged run ESLint and Prettier on pre‑commit.

### Backend
- No formal linter configuration found; follow PEP 8 and FastAPI best practices.
- Consider using Black (`black .`) and isort (`isort .`) if installed.
- Type hints are encouraged (Pydantic schemas, SQLAlchemy models).

## Testing

### Frontend
- **Framework**: Jest with `jest-environment-jsdom`, `ts-jest` preset.
- **Utilities**: React Testing Library, `@testing-library/user-event`.
- **Test location**: `__tests__/` directories mirror source structure.
- **Patterns**: Mock external dependencies, use `screen` queries, focus on user interactions.
- **Coverage**: 50% thresholds (branches, functions, lines, statements) configured in `jest.config.js`.
- **Run single test**: `npm test -- --testPathPattern=home.test.tsx`

### Backend
- **Framework**: pytest with FastAPI `TestClient`.
- **Fixtures**: Defined in `conftest.py` (not yet examined).
- **Test location**: `app/tests/` with `test_*.py` files.
- **Patterns**: Use `client` fixture for HTTP requests, database session isolation.
- **Markers**: Use `@pytest.mark.asyncio` for async tests (asyncio mode auto).
- **Run single test**: `pytest app/tests/test_auth.py::test_login_user`

## Code Style Guidelines

### TypeScript / React

**Imports**:
- Group: React imports first, then external libraries, then internal modules (`@/` aliases).
- Use absolute imports via `@/*` aliases defined in `tsconfig.json`.
- Example:
  ```typescript
  import { useState, useEffect } from 'react';
  import { cn } from '@/lib/utils';
  import GlassCard from '@/components/ui/GlassCard';
  ```

**Theme Colors**:
- Light theme: White-blue color palette
  - `--tech-darkblue: #0f172a` (Deep blue)
  - `--tech-deepblue: #1e3a8a` (Blue)
  - `--tech-cyan: #0ea5e9` (Sky blue)
  - `--tech-lightcyan: #7dd3fc` (Light sky blue)
  - `--tech-sky: #38bdf8` (Bright blue)
- Dark theme: Black-green color palette
  - `--tech-darkblue: #0a0a0a` (Near black)
  - `--tech-deepblue: #0c4a6e` (Deep green-blue)
  - `--tech-cyan: #06b6d4` (Cyan)
  - `--tech-lightcyan: #10b981` (Emerald green)
  - `--tech-sky: #059669` (Deep emerald)
- Use CSS variables for consistent theming across components.

**Components**:
- Use default export for components: `export default function ComponentName() { ... }`
- Props typing: Define `interface ComponentProps` with explicit types.
- Use `React.ReactNode` for children.
- Destructure props in function signature.

**Styling**:
- Tailwind CSS utility classes exclusively.
- Custom colors defined in `tailwind.config.js` (tech, glass, etc.).
- Use `cn()` utility from `@/lib/utils` for conditional classes.
- Avoid inline styles unless dynamic values.

**State Management**:
- Local state with `useState`, `useEffect` for side effects.
- No global state library observed; consider context if needed.
- Fetch data in `useEffect` or via Server Components (Next.js 14).

**TypeScript**:
- `strict: true` in tsconfig.
- Prefer `interface` over `type` for object shapes.
- Avoid `any`; use `unknown` or proper typing.
- Use generic types for reusable utilities.

**Error Handling**:
- Try/catch for async operations, display user‑friendly messages.
- No centralized error boundary observed; consider adding.

**File Naming**:
- Components: `PascalCase.tsx`
- Utilities / hooks: `camelCase.ts`
- Pages: `page.tsx` (App Router), `layout.tsx`

### Python / FastAPI

**Imports**:
- Standard library first, then third‑party, then local modules.
- Use absolute imports within the `app` package.
- Example:
  ```python
  from typing import List
  from fastapi import FastAPI, Depends
  from app.core.database import SessionLocal
  ```

**Module Structure**:
- `app/main.py`: FastAPI app creation, middleware, routing.
- `app/api/v1/`: API routers, endpoints.
- `app/core/`: Configuration, database, security, dependencies.
- `app/models/`: SQLAlchemy ORM models.
- `app/schemas/`: Pydantic schemas for request/response validation.
- `app/crud/`: Database operations.

**Type Hints**:
- Use Pydantic `BaseModel` for all schemas.
- SQLAlchemy models with type annotations (column definitions).
- Function signatures should include return type hints.

**Error Handling**:
- Use `HTTPException` from `fastapi` for HTTP errors.
- Log exceptions with `app_logger` (Loguru).
- Database errors should be caught and re‑raised as appropriate HTTP status.

**Logging**:
- Use `app.utils.logger.app_logger` for structured logging.
- Log request details via `RequestLoggingMiddleware`.

**Database**:
- SQLAlchemy 2.0 declarative base `Base`.
- Relationships defined with `relationship()` and `back_populates`.
- Migrations via Alembic; generate after model changes.

**API Endpoints**:
- Use dependency injection (`Depends`) for authentication, database sessions.
- Path operations decorated with `@router.get/post/put/delete`.
- Response models should be Pydantic schemas.

**File Naming**:
- `snake_case.py` for all Python files.
- Test files: `test_snake_case.py`.

## Git & Version Control

- **Commit convention**: Conventional Commits (see `commitlint.config.js`).
- **Husky**: Pre‑commit hooks run lint‑staged.
- **Branch strategy**: Main branch, feature branches, pull requests.
- **CI**: GitHub Actions run lint, test, build on push/PR.

## Environment Variables

### Frontend
- `.env.example` template; copy to `.env.local` for local overrides.
- Prefix `NEXT_PUBLIC_` for browser‑accessible variables.

### Backend
- `.env.example` template; copy to `.env`.
- Key variables: `DATABASE_URL`, `SECRET_KEY`, `DEBUG`, `BACKEND_CORS_ORIGINS`.
- Loaded via `pydantic_settings.BaseSettings`.

## Docker Commands

- `docker-compose up` starts PostgreSQL and backend.
- Backend Dockerfile: `./backend/Dockerfile`.
- Frontend Dockerfile: `./frontend/Dockerfile` (optional).
- Frontend uses `output: 'standalone'` in Next.js config for Docker optimization.

## Additional Notes

- No Cursor rules (`.cursor/rules/`) or Copilot instructions (`.github/copilot-instructions.md`) found.
- Project is relatively disciplined; follow existing patterns.
- Backend lacks formal linting; recommend adding Black/isort/mypy.
- Frontend uses Chinese comments in some places; keep consistency.

## Quick Reference

| Task | Command |
|------|---------|
| Start frontend | `cd frontend && npm run dev` |
| Start backend | `cd backend && uvicorn app.main:app --reload --port 8000` |
| Run all tests | `cd frontend && npm test` / `cd backend && pytest` |
| Lint frontend | `cd frontend && npm run lint` |
| Format frontend | `cd frontend && npm run format` |
| DB migrations | `cd backend && alembic upgrade head` |
| Docker stack | `docker-compose up` |

---

*This file is maintained for AI agents working in the repository. Update when patterns change.*