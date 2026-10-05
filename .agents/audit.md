# Next.js Code Audit Specification

## 1. Purpose

This document defines the audit standard for this Next.js codebase.

The objective is to identify:

* dead functions
* dead components
* unused files
* unused exports
* unused imports
* unused dependencies
* duplicate logic
* unreachable code
* incorrect Server/Client Component usage
* unnecessary `"use client"`
* incorrect API routes
* unused Server Actions
* broken or obsolete routes
* incorrect data-fetching patterns
* unnecessary client-side logic
* state management problems
* architecture problems
* security issues
* performance issues
* maintainability issues

The audit must prioritize **evidence, correctness, and minimal changes**.

---

# 2. Critical Rule

## Audit First — Modify Later

During the initial audit, the agent MUST NOT:

* delete files
* delete functions
* delete components
* remove dependencies
* remove exports
* rewrite components
* change routing
* change API behavior
* change Server/Client boundaries
* refactor architecture
* modify business logic

unless explicitly instructed.

The initial phase is **READ-ONLY AUDIT**.

---

# 3. Next.js Scope

The audit must understand the actual Next.js architecture before making conclusions.

Inspect whether the project uses:

* App Router
* Pages Router
* Server Components
* Client Components
* Server Actions
* Route Handlers
* API Routes
* Middleware
* layouts
* loading states
* error boundaries
* dynamic routes
* parallel routes
* intercepting routes
* metadata
* static generation
* dynamic rendering
* caching
* revalidation

Do not assume all `.tsx` files are ordinary React components.

---

# 4. Repository Discovery

First inspect:

```text
package.json
next.config.*
tsconfig.json
eslint.config.*
.eslintrc.*
src/
app/
pages/
components/
lib/
hooks/
services/
actions/
api/
public/
middleware.*
```

Also inspect:

```text
Dockerfile
docker-compose.*
.github/
CI/CD configuration
environment configuration
```

Determine:

```text
Next.js version
React version
TypeScript version
Package manager
App Router or Pages Router
State management library
Data fetching library
UI library
Authentication
Database/API integration
```

---

# 5. Route Audit

Build a route map.

For App Router inspect:

```text
app/
├── page.tsx
├── layout.tsx
├── loading.tsx
├── error.tsx
├── not-found.tsx
├── route.ts
├── [id]/
├── [...slug]/
├── (group)/
└── @slot/
```

For Pages Router inspect:

```text
pages/
├── index.tsx
├── _app.tsx
├── _document.tsx
├── api/
└── [dynamic].tsx
```

Identify:

* active routes
* dynamic routes
* API endpoints
* unreachable routes
* obsolete routes
* duplicate routes
* routes with no apparent consumers

Do NOT classify a route as dead merely because no frontend component references it.

API routes may have external consumers.

---

# 6. Dead Component Audit

Search for components that appear unused.

For each suspected component inspect:

1. imports
2. exports
3. barrel exports
4. dynamic imports
5. route usage
6. framework usage
7. tests
8. Storybook
9. configuration
10. external usage where applicable

Classify:

```text
ACTIVE
CONFIRMED_DEAD
PROBABLY_DEAD
NEEDS_REVIEW
```

Example:

```text
components/UserCard.tsx
```

Do not conclude it is dead simply because:

```text
import UserCard
```

was not found.

Check:

```text
export *
index.ts
dynamic()
lazy()
registry objects
```

---

# 7. Dead Function Audit

Inspect:

* utility functions
* hooks
* helper functions
* service functions
* API client functions
* Server Actions
* event handlers
* callbacks
* exported functions

For every suspected dead function determine:

```text
Direct references
Indirect references
Dynamic references
Framework references
Route references
Server Action references
Test references
External API exposure
```

Never delete based solely on zero static references.

---

# 8. React Component Audit

Inspect components for:

### Unused props

Example:

```tsx
function UserCard({
  name,
  email,
  avatar,
  unusedValue
}) {}
```

Determine whether props are actually required.

### Dead state

Example:

```tsx
const [loading, setLoading] = useState(false);
```

If the state does not affect rendering or behavior, report it.

### Dead effects

Inspect:

```tsx
useEffect()
```

for:

* unnecessary effects
* effects with incorrect dependencies
* effects that can be replaced with derived state
* effects that trigger unnecessary requests
* effects that create loops

### Dead event handlers

Identify handlers that are defined but never attached.

---

# 9. Server vs Client Component Audit

This is a major audit area.

Inspect every:

```tsx
"use client"
```

Determine whether the component actually requires:

* useState
* useEffect
* useContext
* browser APIs
* event handlers
* client-only libraries

If not, report:

```text
Potential unnecessary Client Component
```

Example:

```tsx
"use client"

export default function Dashboard() {
    return <div>Dashboard</div>
}
```

If no client capability is required, recommend evaluating removal of `"use client"`.

However, do not automatically remove it.

---

# 10. Client Boundary Audit

Inspect whether `"use client"` causes unnecessary code to move into the client bundle.

Look for:

```text
Server Component
      ↓
Client Component
      ↓
large dependency
```

Identify cases where a large subtree unnecessarily becomes client-side.

Report:

* boundary location
* dependency impact
* possible restructuring
* risk

---

# 11. Server Actions Audit

Inspect:

```tsx
"use server"
```

and Server Actions.

Check:

* unused actions
* actions imported but never called
* actions with excessive responsibilities
* missing validation
* authentication
* authorization
* unsafe input handling
* unnecessary database calls
* duplicate actions
* actions that could be consolidated

Do not assume a Server Action is dead because it has no normal component import.

---

# 12. API / Route Handler Audit

Inspect:

```text
app/**/route.ts
pages/api/**
```

Check:

* unused endpoints
* duplicate endpoints
* unused HTTP methods
* missing validation
* missing authentication
* missing authorization
* inconsistent response format
* excessive payloads
* unnecessary database calls
* error handling
* timeout handling

Remember:

> API routes may have external consumers.

Therefore unused frontend references are NOT enough to classify an API route as dead.

---

# 13. Data Fetching Audit

Inspect:

```text
fetch()
axios
React Query
SWR
server actions
route handlers
database calls
```

Look for:

* duplicate requests
* unnecessary client fetching
* server fetching that should remain server-side
* client fetching where Server Components would be more appropriate
* duplicate API calls
* waterfall requests
* unnecessary `useEffect` fetching
* missing caching strategy
* incorrect revalidation
* unnecessary `cache: "no-store"`
* unnecessary dynamic rendering

Do not optimize blindly.

Explain the actual impact.

---

# 14. Next.js Caching Audit

Inspect:

```text
fetch
revalidate
cache
unstable_cache
revalidatePath
revalidateTag
```

Look for:

* accidental dynamic rendering
* accidental static rendering
* unnecessary cache invalidation
* duplicated data fetching
* stale data risks

Document the current behavior before recommending changes.

---

# 15. Hooks Audit

Inspect custom hooks:

```text
hooks/
```

Look for:

* unused hooks
* duplicated hooks
* hooks that can be server-side logic
* hooks with excessive responsibilities
* incorrect dependency arrays
* state synchronization problems
* unnecessary effects

---

# 16. State Management Audit

If the project uses:

```text
Zustand
Redux
Context
Jotai
Recoil
React Query
SWR
```

inspect:

* unused stores
* unused selectors
* duplicated state
* server state stored unnecessarily in client state
* derived state stored unnecessarily
* excessive global state
* components subscribing to unnecessarily large state slices

---

# 17. TypeScript Audit

Inspect:

* `any`
* unnecessary type assertions
* duplicated types
* unused types
* unreachable union branches
* inconsistent interfaces
* overly broad types
* unsafe casts
* `@ts-ignore`
* `@ts-expect-error`

Run:

```bash
npx tsc --noEmit
```

if supported by the project.

---

# 18. Dependency Audit

Inspect:

```text
package.json
package-lock.json
```

Use:

```bash
npm ls
npx knip
npm audit
```

where appropriate.

Identify:

* unused packages
* duplicate packages
* packages only used by dead code
* unnecessary dependencies
* outdated packages
* risky packages

Do NOT automatically uninstall packages.

---

# 19. Duplicate Logic Audit

Search for duplicate:

* API calls
* validation
* formatting
* authentication checks
* error handling
* state transformations
* business rules
* utility functions

Classify:

```text
EXACT_DUPLICATE
NEAR_DUPLICATE
INTENTIONAL_VARIATION
ABSTRACTION_CANDIDATE
```

Do not create abstractions solely to reduce line count.

---

# 20. Performance Audit

Inspect:

* unnecessary client components
* unnecessary re-renders
* large client bundles
* excessive dependencies
* unoptimized images
* unnecessary JavaScript
* waterfall requests
* duplicate requests
* expensive calculations
* missing memoization where actually justified

Do NOT blindly add:

```text
useMemo
useCallback
React.memo
```

Only recommend them when there is evidence of a meaningful problem.

---

# 21. Security Audit

Inspect:

* hardcoded API keys
* tokens
* passwords
* secrets
* exposed environment variables
* unsafe API endpoints
* missing authorization
* client exposure of secrets
* unsafe redirects
* XSS
* injection
* SSRF
* unsafe file uploads
* insecure Server Actions
* unsafe query construction

Check:

```text
NEXT_PUBLIC_*
```

carefully.

Anything exposed through `NEXT_PUBLIC_*` should be considered client-visible.

Never include actual secrets in the audit report.

Mask them.

---

# 22. Environment Variable Audit

Identify:

* environment variables used in code
* variables defined but never used
* variables referenced but missing
* variables incorrectly exposed to the client
* obsolete variables

Classify each variable:

```text
SERVER_ONLY
CLIENT_EXPOSED
UNUSED
MISSING
UNKNOWN
```

---

# 23. Build Audit

Run:

```bash
npm run lint
npm run build
```

if those scripts exist.

Also run:

```bash
npx tsc --noEmit
```

if applicable.

Record:

```text
Command
Result
Errors
Warnings
Impact
```

Do not hide build failures.

---

# 24. Required Finding Format

Every finding must contain:

```text
ID:
Severity:
Confidence:
Category:
Location:
Evidence:
Problem:
Impact:
Recommendation:
Safe to Auto-Fix:
```

Example:

```text
ID: NEXT-DEAD-001
Severity: MEDIUM
Confidence: HIGH

Category:
Dead Component

Location:
src/components/LegacyChart.tsx

Evidence:
- No imports found.
- No dynamic imports found.
- No barrel export usage found.
- No route references found.
- No Storybook references found.
- No test references found.

Problem:
Component appears to have no active consumer.

Impact:
Unnecessary maintenance surface.

Recommendation:
Confirm external usage before deletion.

Safe to Auto-Fix:
NO
```

---

# 25. Final Audit Report

Create:

```text
docs/CODE_AUDIT_REPORT.md
```

Required sections:

```text
# Next.js Code Audit Report

## Executive Summary

## Application Architecture

## Route Map

## Dead Components

## Dead Functions

## Dead Files

## Unused Dependencies

## Unused Environment Variables

## Server / Client Boundary Issues

## Server Actions

## API / Route Handlers

## Data Fetching

## Caching

## Hooks

## State Management

## TypeScript

## Performance

## Security

## Build & Validation

## Recommended Fix Plan

## Needs Human Review
```

---

# 26. Fix Strategy

After the audit, create a plan.

Priority:

```text
P0 — Security / Production Breaking
P1 — Correctness
P2 — Confirmed Dead Code
P3 — Architecture
P4 — Performance
P5 — Maintainability
P6 — Cosmetic
```

Do not mix unrelated fixes.

---

# 27. Re-Audit

After approved fixes:

```text
Fix
 ↓
Lint
 ↓
Type Check
 ↓
Build
 ↓
Test
 ↓
Static Analysis
 ↓
Re-Audit
```

Confirm that:

* no new dead code was introduced
* no routes were broken
* no Server/Client boundary was broken
* no API behavior changed unintentionally
* build still succeeds

---

# 28. Final Principle

The purpose of this audit is not to make the repository "look cleaner."

The purpose is to determine:

> **What is actually used, what is genuinely dead, what is unnecessarily complex, and what can safely be improved.**

Evidence is mandatory.

When uncertain:

```text
DO NOT DELETE
→ mark NEEDS_REVIEW
```

A smaller number of high-confidence findings is preferable to a large number of speculative findings.
