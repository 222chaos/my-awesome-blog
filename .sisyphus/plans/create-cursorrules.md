# Create Comprehensive .cursorrules File for My Awesome Blog

## Context

### Original Request
Create rule constraints for the entire project combining:
1. Overall project structure (monorepo: frontend + backend)
2. frontend-ui-ux skill principles
3. To improve future code quality

### Interview Summary
**Key Discussions**:
- User wants comprehensive quality rules for AI assistants (specifically Cursor AI)
- Format decided: `.cursorrules` file at project root
- Scope: Comprehensive coverage including frontend, backend, design system, testing, performance, accessibility
- Existing quality tools: ESLint, Prettier, Jest, pytest, Husky pre-commit hooks
- Design style: Glassmorphism with tech theme (tech-darkblue, glass colors, cyan accents)

**Research Findings**:
- `.cursorrules` files are plain text/markdown files used by Cursor AI for project-specific instructions
- They contain actionable coding standards and patterns for AI-generated code
- Often excluded from CI/CD workflows
- Based on examples from awesome-cursorrules repository

**frontend-ui-ux Skill Principles to Incorporate**:
1. Complete what's asked - no scope creep
2. Study before acting - examine existing patterns
3. Blend seamlessly - match existing code patterns
4. Design process: Purpose → Tone → Constraints → Differentiation
5. Aesthetic guidelines: Typography, Color, Motion, Spatial Composition, Visual Details
6. Anti-patterns: Avoid generic fonts, cliched color schemes, predictable layouts

---

## Work Objectives

### Core Objective
Create a comprehensive `.cursorrules` file that provides AI assistants with project-specific guidelines for generating code that matches My Awesome Blog's patterns, design principles, and quality standards.

### Concrete Deliverables
- `.cursorrules` file at project root (`E:\A_Project\my-awesome-blog\.cursorrules`)
- File should cover: frontend, backend, design system, testing, performance, accessibility
- Integrate existing project patterns from codebase analysis
- Incorporate frontend-ui-ux design principles

### Definition of Done
- [ ] `.cursorrules` file created with all required sections
- [ ] All file references verified to exist in codebase
- [ ] Rules are actionable by AI assistants
- [ ] File passes Momus review (if high accuracy mode requested)

### Must Have
- Reference existing ESLint/Prettier configurations
- Include specific import patterns from codebase
- Define component structure conventions for both frontend and backend
- Incorporate glassmorphism design system principles
- Provide clear examples of acceptable patterns

### Must NOT Have (Guardrails)
- No duplication of existing linter rules (reference them instead)
- No generic advice - everything must be project-specific
- No assumptions about business logic without evidence from codebase
- No changes to existing source code (only create new file)

---

## Verification Strategy

### Test Decision
- **Infrastructure exists**: NO (creating new file, not modifying code)
- **User wants tests**: Manual-only (file creation and validation)
- **Framework**: None (manual verification)

### Manual QA Procedures
**For file creation and validation**:
- Check file exists at correct path
- Verify all referenced files actually exist in codebase
- Validate file structure follows planned outline
- Ensure rules are actionable and project-specific
- Confirm glassmorphism design principles are properly integrated

**Evidence Required**:
- File creation timestamp verification
- References verification through `ls` commands
- Content review for completeness and specificity

---

## Task Flow

```
Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6
```

No parallel tasks due to sequential dependency on research findings.

---

## TODOs

> Implementation + Verification = ONE Task. Never separate.

- [ ] 1. Research Current Codebase Patterns

  **What to do**:
  - Analyze frontend import patterns in `frontend/src/` directory
  - Examine component structure conventions in existing components
  - Review backend patterns in `backend/app/` directory
  - Study design system implementation in frontend components
  - Document Tailwind CSS usage patterns and custom theme
  - Note SQLAlchemy/Pydantic patterns in backend

  **Must NOT do**:
  - Modify any existing files
  - Make assumptions without evidence

  **Parallelizable**: NO (depends on no other tasks)

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `frontend/src/components/ui/` - UI component patterns (check for GlassCard, etc.)
  - `frontend/src/lib/utils.ts` - Utility function patterns (cn() function, etc.)
  - `frontend/tailwind.config.js` - Custom theme colors and glassmorphism definitions
  - `backend/app/models/` - SQLAlchemy ORM model patterns
  - `backend/app/schemas/` - Pydantic schema patterns
  - `backend/app/api/v1/` - FastAPI endpoint patterns

  **Config References** (existing configurations):
  - `frontend/eslint.config.js` and `.eslintrc.cjs` - ESLint rules
  - `frontend/.prettierrc.json` - Prettier formatting rules
  - `frontend/package.json` - Scripts and lint-staged configuration
  - `backend/pyproject.toml` - Python tool configurations (if exists)

  **Documentation References** (project documentation):
  - `AGENTS.md` - Existing build commands and code style guidelines
  - `README.md` - Project overview and structure
  - `frontend/README.md` - Frontend-specific documentation

  **WHY Each Reference Matters**:
  - UI components show glassmorphism implementation patterns
  - Utility functions demonstrate TypeScript utility patterns
  - Tailwind config defines the glassmorphism color palette
  - Backend models/schemas show SQLAlchemy/Pydantic conventions
  - Config files define existing quality standards to reference

  **Acceptance Criteria**:

  **Manual Execution Verification**:

  **For Research Task**:
  - [ ] Using bash commands to verify file references:
    - Command: `ls frontend/src/components/ui/ | head -10`
    - Expected: List of UI component files exists
    - Command: `grep -r "tech-darkblue\|glass-" frontend/tailwind.config.js`
    - Expected: Contains custom glassmorphism color definitions
    - Command: `ls backend/app/models/ | head -5`
    - Expected: SQLAlchemy model files exist
    - Command: `ls backend/app/schemas/ | head -5`
    - Expected: Pydantic schema files exist

  **Evidence Required**:
  - [ ] Command output captured showing files exist
  - [ ] Key patterns documented in notes for next task

  **Commit**: NO (research phase)

- [ ] 2. Draft .cursorrules File Structure

  **What to do**:
  - Create initial draft of `.cursorrules` with all planned sections
  - Structure based on research findings:
    1. Project Overview & Tech Stack
    2. Role Definition (Full-stack expert with design sensibilities)
    3. Architecture Guidelines (Monorepo structure)
    4. Frontend Development Guidelines (Next.js/TypeScript/Tailwind)
    5. Backend Development Guidelines (FastAPI/Python/SQLAlchemy)
    6. Design System Principles (Glassmorphism + frontend-ui-ux)
    7. Code Quality & Standards (reference existing linters)
    8. AI Assistant Guidelines
    9. Performance & Accessibility Requirements
    10. References & Key Files
  - Populate each section with placeholders based on research

  **Must NOT do**:
  - Write generic rules - keep placeholders for project-specific details
  - Assume patterns not found in research

  **Parallelizable**: NO (depends on Task 1)

  **References**:

  **Structure References**:
  - `.sisyphus/drafts/code-quality-rules.md` - Planning draft with requirements
  - Awesome-cursorrules repository examples (mental reference)
  - Existing project documentation structure from `README.md`

  **Content References** (from Task 1 findings):
  - Frontend import patterns found
  - Component structure conventions observed
  - Backend patterns documented
  - Design system details noted
  - Existing linting/formatting rules collected

  **WHY Each Reference Matters**:
  - Draft file contains all user requirements and decisions
  - Project structure must align with existing documentation patterns
  - Content must be based on actual codebase findings, not assumptions

  **Acceptance Criteria**:

  **Manual Execution Verification**:

  **For File Creation**:
  - [ ] Using bash commands to create and verify draft:
    - Command: `touch .cursorrules`
    - Expected: File created successfully
    - Command: `wc -l .cursorrules`
    - Expected: File has content (non-zero line count)
    - Command: `head -20 .cursorrules`
    - Expected: Shows structured outline with all planned sections

  **For Content Verification**:
  - [ ] Verify all sections from outline are present:
    - Contains "Project Overview" section
    - Contains "Role Definition" section
    - Contains "Architecture Guidelines" section
    - Contains "Frontend Development Guidelines" section
    - Contains "Backend Development Guidelines" section
    - Contains "Design System Principles" section
    - Contains "Code Quality & Standards" section
    - Contains "AI Assistant Guidelines" section
    - Contains "Performance & Accessibility" section
    - Contains "References" section

  **Evidence Required**:
  - [ ] File creation command output
  - [ ] File content verification outputs
  - [ ] Section presence verification

  **Commit**: NO (draft phase)

- [ ] 3. Populate with Project-Specific Rules

  **What to do**:
  - Fill in each section with concrete, actionable rules based on research
  - **Project Overview**: Describe tech stack, monorepo structure
  - **Role Definition**: Define AI assistant as full-stack expert with design focus
  - **Architecture Guidelines**: Specify frontend/backend separation, Docker setup
  - **Frontend Guidelines**: 
    - TypeScript patterns (interfaces over types, strict mode)
    - React patterns (functional components, hooks, Server Components)
    - Tailwind patterns (glassmorphism classes, custom theme usage)
    - Import patterns (absolute imports with `@/`, grouping)
    - Component structure (default exports, prop interfaces)
  - **Backend Guidelines**:
    - Python patterns (type hints, async/await)
    - FastAPI patterns (dependency injection, routers)
    - SQLAlchemy patterns (declarative base, relationships)
    - Pydantic patterns (schemas for requests/responses)
    - Error handling (HTTPException, logging)
  - **Design System Principles**:
    - Glassmorphism implementation (backdrop-filter, opacity)
    - Color palette (tech-darkblue, glass colors, cyan accents)
    - Typography (avoid generic fonts like Inter/Roboto)
    - Motion and spacing principles
    - frontend-ui-ux anti-patterns to avoid
  - **Code Quality**: Reference existing ESLint/Prettier rules, commit conventions
  - **AI Assistant Guidelines**: How to approach tasks (study first, match patterns)
  - **Performance**: Bundle optimization, lazy loading, image optimization
  - **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
  - **References**: List key files (AGENTS.md, config files, etc.)

  **Must NOT do**:
  - Include rules that contradict existing codebase patterns
  - Add generic advice without project-specific examples
  - Modify referenced files (only reference them)

  **Parallelizable**: NO (depends on Task 2)

  **References**:

  **Concrete Pattern References** (from Task 1):
  - Actual import statements from frontend files
  - Real component examples from `frontend/src/components/`
  - Actual model/schema code from backend
  - Real Tailwind class usage from components
  - Existing ESLint/Prettier rules verbatim

  **Documentation References**:
  - `AGENTS.md` for exact build commands and existing guidelines
  - `README.md` for project structure description
  - Package.json scripts for frontend commands
  - Docker/docker-compose files for architecture details

  **WHY Each Reference Matters**:
  - Rules must be based on actual code, not theoretical best practices
  - AI assistants need concrete examples to follow
  - References provide verifiable evidence for each rule

  **Acceptance Criteria**:

  **Manual Execution Verification**:

  **For Rule Verification**:
  - [ ] Verify rules reference actual code patterns:
    - Command: `grep -n "import.*from" frontend/src/components/ui/Button.tsx 2>/dev/null || echo "Check different component"`
    - Expected: Import pattern exists and matches rule description
    - Command: `grep -n "export default function" frontend/src/components/ui/*.tsx | head -5`
    - Expected: Shows component export patterns
    - Command: `grep -n "class.*Base" backend/app/models/*.py 2>/dev/null | head -3`
    - Expected: SQLAlchemy base class pattern
    - Command: `grep -n "tech-darkblue\|bg-glass" frontend/src/**/*.tsx | head -5`
    - Expected: Shows glassmorphism class usage

  **For Content Completeness**:
  - [ ] Verify each section has concrete rules:
    - Frontend section has TypeScript, React, Tailwind subsections
    - Backend section has Python, FastAPI, SQLAlchemy subsections
    - Design system section has glassmorphism color references
    - Code quality section references ESLint/Prettier configs
    - References section lists actual file paths

  **Evidence Required**:
  - [ ] Grep command outputs showing patterns exist
  - [ ] Content verification showing all sections populated
  - [ ] Rule examples are project-specific, not generic

  **Commit**: YES (after verification)
  - Message: `docs: add comprehensive .cursorrules file for AI assistants`
  - Files: `.cursorrules`
  - Pre-commit: `ls -la .cursorrules` (verify file exists)

- [ ] 4. Validate File References and Completeness

  **What to do**:
  - Verify EVERY file referenced in `.cursorrules` actually exists
  - Check that all rules are actionable (not vague suggestions)
  - Ensure no broken references or assumptions
  - Validate glassmorphism design principles are correctly described
  - Confirm frontend-ui-ux principles are properly integrated
  - Test that an AI assistant could understand and apply the rules

  **Must NOT do**:
  - Assume files exist without verification
  - Leave vague rules that could be misinterpreted

  **Parallelizable**: NO (depends on Task 3)

  **References**:

  **Verification References**:
  - The `.cursorrules` file itself (for checking references)
  - Actual file system paths referenced in the file
  - Code patterns cited as examples

  **Validation Criteria**:
  - Every `frontend/src/...` path exists
  - Every `backend/app/...` path exists
  - Every config file referenced exists
  - Every pattern example can be verified in actual code

  **WHY Each Reference Matters**:
  - Broken references make rules unusable
  - AI assistants need accurate file paths to learn patterns
  - Verification ensures the file provides real value

  **Acceptance Criteria**:

  **Manual Execution Verification**:

  **For File Reference Validation**:
  - [ ] Extract all file paths from `.cursorrules` and verify:
    - Command: `grep -o "frontend/src/[^ ]*" .cursorrules | sort -u | while read f; do ls "$f" 2>/dev/null || echo "MISSING: $f"; done`
    - Expected: No "MISSING" output (all files exist)
    - Command: `grep -o "backend/app/[^ ]*" .cursorrules | sort -u | while read f; do ls "$f" 2>/dev/null || echo "MISSING: $f"; done`
    - Expected: No "MISSING" output (all files exist)
    - Command: `grep -o "AGENTS.md\|README.md\|package.json\|tailwind.config.js" .cursorrules | sort -u | while read f; do ls "$f" 2>/dev/null || echo "MISSING: $f"; done`
    - Expected: No "MISSING" output (all config files exist)

  **For Rule Actionability Validation**:
  - [ ] Check rules are specific, not vague:
    - Command: `grep -i "should\|avoid\|recommend" .cursorrules | head -10`
    - Expected: Shows concrete rules with project-specific context
    - Command: `grep -c "example\|Example" .cursorrules`
    - Expected: At least 5 examples in file
    - Command: `grep -c "frontend-ui-ux\|glassmorphism\|tech-darkblue" .cursorrules`
    - Expected: At least 3 references to design principles

  **Evidence Required**:
  - [ ] File verification output (no missing files)
  - [ ] Rule analysis showing concrete, actionable content
  - [ ] Design principle integration verification

  **Commit**: NO (validation only)

- [ ] 5. Final Review and Cleanup

  **What to do**:
  - Read through entire `.cursorrules` file for coherence
  - Fix any formatting issues, typos, or inconsistencies
  - Ensure consistent tone and language throughout
  - Verify the file serves its purpose: guiding AI assistants
  - Check that it complements rather than duplicates existing docs
  - Prepare for Momus review (if high accuracy requested)

  **Must NOT do**:
  - Make substantial content changes without reverification
  - Add new requirements not in original scope

  **Parallelizable**: NO (depends on Task 4)

  **References**:

  **Review References**:
  - Original requirements from draft file
  - frontend-ui-ux skill principles checklist
  - Project goals for code quality improvement

  **Quality Criteria**:
  - File is readable and well-organized
  - Rules are consistently formatted
  - No contradictory advice
  - Supports the monorepo structure appropriately

  **WHY Each Reference Matters**:
  - Final review ensures quality before handoff
  - Consistency makes file more usable for AI assistants
  - Alignment with original goals ensures value delivery

  **Acceptance Criteria**:

  **Manual Execution Verification**:

  **For Final Review**:
  - [ ] Check file readability and organization:
    - Command: `head -50 .cursorrules`
    - Expected: Clear structure with sections and subsections
    - Command: `wc -l .cursorrules`
    - Expected: File has substantial content (100+ lines reasonable)
    - Command: `file .cursorrules`
    - Expected: ASCII text or UTF-8 Unicode text

  **For Consistency Check**:
  - [ ] Verify consistent formatting:
    - Command: `grep -n "^- " .cursorrules | head -5`
    - Expected: Consistent bullet point formatting
    - Command: `grep -n "^#\|^##\|^###" .cursorrules`
    - Expected: Consistent heading hierarchy

  **Evidence Required**:
  - [ ] File structure verification output
  - [ ] Formatting consistency check
  - [ ] Final file ready for use

  **Commit**: YES (final version)
  - Message: `docs: finalize .cursorrules file with comprehensive guidelines`
  - Files: `.cursorrules`
  - Pre-commit: `ls -la .cursorrules && head -10 .cursorrules`

- [ ] 6. Momus Review (If High Accuracy Requested)

  **What to do**:
  - Submit `.cursorrules` to Momus for rigorous review
  - Address ALL feedback from Momus (not just some)
  - Fix issues, regenerate file, resubmit until "OKAY" verdict
  - No maximum retry limit - continue until approved or user cancels

  **Must NOT do**:
  - Skip Momus review if user requested high accuracy
  - Ignore any Momus feedback
  - Consider file "good enough" without Momus approval

  **Parallelizable**: NO (depends on Task 5)

  **References**:

  **Momus Review Criteria**:
  - 100% of file references verified
  - Zero critically failed file verifications
  - ≥80% of tasks have clear reference sources
  - ≥90% of tasks have concrete acceptance criteria
  - Zero tasks require assumptions about business logic
  - Clear big picture and workflow understanding
  - Zero critical red flags

  **WHY This Matters**:
  - User may request high accuracy guarantee
  - Momus ensures file is bulletproof for AI assistants
  - Quality is non-negotiable when high accuracy requested

  **Acceptance Criteria**:

  **Manual Execution Verification**:

  **For Momus Loop**:
  - [ ] Submit to Momus and await verdict:
    - Process: Invoke Momus with `.cursorrules` file path
    - Expected: Momus provides detailed feedback
    - Action: Address ALL feedback items
    - Loop: Resubmit until "OKAY" verdict
    - Exit: When Momus says "OKAY" or user explicitly cancels

  **Evidence Required**:
  - [ ] Momus initial feedback captured
  - [ ] Each iteration's fixes documented
  - [ ] Final "OKAY" verdict from Momus

  **Commit**: YES (after Momus approval)
  - Message: `docs: .cursorrules file passes Momus high-accuracy review`
  - Files: `.cursorrules`
  - Pre-commit: Momus approval verification

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 3 | `docs: add comprehensive .cursorrules file for AI assistants` | `.cursorrules` | `ls -la .cursorrules` |
| 5 | `docs: finalize .cursorrules file with comprehensive guidelines` | `.cursorrules` | `ls -la .cursorrules && head -10 .cursorrules` |
| 6 (if applicable) | `docs: .cursorrules file passes Momus high-accuracy review` | `.cursorrules` | Momus approval |

---

## Success Criteria

### Verification Commands
```bash
# Verify file exists and has content
ls -la .cursorrules
wc -l .cursorrules

# Verify key sections present
grep -c "Frontend Development Guidelines" .cursorrules
grep -c "Backend Development Guidelines" .cursorrules
grep -c "Design System Principles" .cursorrules
grep -c "glassmorphism\|tech-darkblue" .cursorrules

# Verify no broken references
grep -o "frontend/src/[^ ]*" .cursorrules | sort -u | while read f; do ls "$f" 2>/dev/null || echo "BROKEN: $f"; done | grep -c "BROKEN"  # Should output 0
```

### Final Checklist
- [ ] `.cursorrules` file exists at project root
- [ ] All planned sections are present and populated
- [ ] All file references exist in codebase
- [ ] Rules are project-specific and actionable
- [ ] frontend-ui-ux principles are integrated
- [ ] Glassmorphism design system is correctly described
- [ ] File passes Momus review (if high accuracy requested)
