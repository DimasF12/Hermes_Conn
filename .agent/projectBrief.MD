# Hermes Chat UI MVP — Coding & Engineering Brief

## 1. Purpose

Dokumen ini menjadi pedoman implementasi untuk project Hermes Chat UI MVP.

Tujuan utamanya bukan hanya membuat fitur berjalan, tetapi memastikan codebase:

- rapi
- mudah dibaca
- modular
- mudah di-maintain
- memiliki separation of concerns
- tidak memiliki dead function / dead code
- tidak melakukan over-engineering
- mudah dikembangkan ke Phase 2
- memiliki planning sebelum perubahan besar

> Prinsip utama: **simple, modular, explicit, maintainable.**

---

# 2. Engineering Principles

## 2.1 MVP First

Implementasikan hanya kebutuhan yang diperlukan untuk MVP.

Jangan membuat abstraction atau infrastructure hanya karena mungkin diperlukan di masa depan.

Contoh yang dihindari:

```text
❌ Repository pattern untuk satu API call
❌ Service layer berlapis tanpa kebutuhan
❌ Generic AI abstraction
❌ Event bus
❌ State management kompleks
❌ Database sebelum persistence memang diperlukan
```

Gunakan abstraction hanya ketika abstraction tersebut memberikan manfaat nyata.

---

## 2.2 Separation of Concerns

Setiap bagian code harus memiliki tanggung jawab yang jelas.

```text
UI
 ↓
Chat Integration
 ↓
API Route
 ↓
Hermes Client
 ↓
Hermes Agent
```

Contoh:

```text
components/
    UI dan rendering

app/api/
    HTTP boundary

lib/hermes/
    Hermes API integration

types/
    Shared TypeScript types
```

UI component tidak boleh mengetahui detail HTTP request Hermes.

Contoh yang dihindari:

```tsx
// ❌ Jangan
const response = await fetch(
  "http://43.159.49.194:8642/v1/..."
);
```

di dalam component.

Lebih baik:

```tsx
// Component hanya berinteraksi dengan application API
await sendMessage(message);
```

Detail Hermes berada di backend.

---

# 3. Recommended Architecture

```text
┌──────────────────────────────┐
│        Assistant UI          │
│                              │
│  Presentation / Interaction  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      Next.js Chat Layer      │
│                              │
│  Chat transport / protocol   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│       API Route Handler      │
│                              │
│  HTTP boundary               │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        Hermes Client         │
│                              │
│  Hermes API communication    │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│         Hermes Agent         │
└──────────────────────────────┘
```

---

# 4. Recommended Project Structure

```text
hermes-chat/
│
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   │
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── chat/
│   │   ├── chat.tsx
│   │   ├── message.tsx
│   │   └── composer.tsx
│   │
│   └── ui/
│
├── lib/
│   ├── hermes/
│   │   ├── client.ts
│   │   ├── stream.ts
│   │   └── types.ts
│   │
│   └── chat/
│       └── types.ts
│
├── config/
│   └── env.ts
│
├── types/
│   └── index.ts
│
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

The structure can be simplified if the implementation is small enough.

Do not create folders merely to make the project look "enterprise".

---

# 5. Module Responsibilities

## `app/`

Responsible for Next.js application routes and pages.

Should contain:

- pages
- layouts
- API route handlers

Should not contain:

- Hermes API implementation
- complex business logic
- reusable HTTP clients

---

## `components/`

Responsible for UI.

Example:

```text
components/chat/
├── chat.tsx
├── message.tsx
└── composer.tsx
```

Responsibilities:

### `chat.tsx`

Chat composition and Assistant UI integration.

### `message.tsx`

Message presentation.

### `composer.tsx`

User message input.

Components should remain focused on UI behavior.

---

## `lib/hermes/`

Responsible for all Hermes-specific communication.

Example:

```text
lib/hermes/
├── client.ts
├── stream.ts
└── types.ts
```

### `client.ts`

Responsible for creating and configuring Hermes API requests.

### `stream.ts`

Responsible for Hermes streaming/SSE handling.

### `types.ts`

Hermes-specific TypeScript types.

No UI logic should exist here.

---

## `lib/chat/`

Contains application-level chat logic that is not specific to Hermes.

This distinction is useful because future implementations may replace or add another agent backend.

```text
Chat Application
      │
      ├── Hermes
      ├── Other Agent
      └── Mock Agent
```

However, do not build a generic multi-agent abstraction until it is actually needed.

---

## `config/`

Contains application configuration.

Example:

```text
config/env.ts
```

Responsible for reading environment variables and exposing configuration in a consistent way.

---

# 6. Environment Variables

Use:

```env
HERMES_API_URL=http://43.159.49.194:<PORT>/v1
```

Do not hardcode the Hermes endpoint inside components or business logic.

Bad:

```ts
fetch("http://43.159.49.194:8642/v1/...")
```

Good:

```ts
fetch(`${env.HERMES_API_URL}/...`)
```

For the current MVP, no authentication/token validation is required.

---

# 7. TypeScript Rules

Use TypeScript strictly.

Avoid:

```ts
any
```

unless there is a specific technical reason.

Prefer:

```ts
type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
```

instead of:

```ts
type ChatMessage = any;
```

If an external API has uncertain data, model the uncertainty explicitly.

---

# 8. Naming Conventions

Use clear and predictable names.

### Files

Prefer:

```text
hermes-client.ts
chat-message.tsx
```

or follow the project's established Next.js conventions consistently.

### Functions

Use verbs:

```ts
sendMessage()
createHermesClient()
streamHermesResponse()
parseHermesEvent()
```

Avoid vague names:

```ts
process()
handle()
doThing()
data()
```

unless the context makes them unambiguous.

---

# 9. Function Design

Functions should generally have one clear responsibility.

Bad:

```ts
async function handleChat() {
  // validate request
  // construct Hermes payload
  // call Hermes
  // parse SSE
  // transform messages
  // save database
  // log analytics
  // return response
}
```

Better:

```text
route.ts
   │
   ├── parse request
   │
   └── send to chat service
             │
             ▼
       Hermes client
             │
             ▼
       stream parser
```

Each function should be understandable without reading the entire project.

---

# 10. Dead Code Policy

Dead code should not remain in the repository.

This includes:

- unused functions
- unused imports
- unused variables
- unused components
- unused types
- commented-out implementations
- abandoned experimental code
- duplicate utility functions
- unused dependencies

Avoid code like:

```ts
// Maybe we will need this later
function oldHermesRequest() {
}
```

If it is not currently required, remove it.

Git already provides history.

---

# 11. Avoid Premature Abstraction

Do not create abstractions before a real pattern exists.

For example, do not immediately create:

```text
IAgent
BaseAgent
AgentFactory
AgentProvider
AgentRegistry
```

if the application only has:

```text
Hermes Agent
```

Start with:

```text
HermesClient
```

When a second implementation actually appears, refactor based on the real requirements.

---

# 12. Dependency Policy

Every dependency must have a reason.

Before installing a package, ask:

1. Is this actually required?
2. Does Next.js or Assistant UI already provide this capability?
3. Can the functionality reasonably be implemented with existing APIs?
4. Does the dependency introduce unnecessary complexity?

Avoid adding libraries simply because they are popular.

---

# 13. Error Handling

Errors should be handled at the appropriate boundary.

Example:

```text
Hermes API
    │
    ├── 200 → stream response
    │
    ├── 4xx → request error
    │
    ├── 5xx → Hermes error
    │
    └── timeout → connection error
```

The UI should receive a useful application-level error.

Do not expose raw internal errors unnecessarily.

Bad:

```text
ECONNREFUSED 43.159.49.194:8642 ...
```

User-facing:

```text
Unable to connect to Hermes Agent.
Please try again.
```

Internal logs can retain the technical error for debugging.

---

# 14. Logging

During MVP development, logging should be useful but minimal.

Good:

```text
[Hermes] Request started
[Hermes] Stream connected
[Hermes] Stream completed
[Hermes] Request failed
```

Avoid logging:

- full sensitive payloads
- unnecessary repeated messages
- entire streaming content
- secrets
- environment variables

Do not create a logging framework unless the project actually needs one.

---

# 15. Streaming Implementation

Streaming is a core MVP requirement.

The implementation should follow:

```text
Assistant UI
     │
     ▼
Next.js /api/chat
     │
     ▼
Hermes API
     │
     ▼
SSE stream
     │
     ▼
Next.js
     │
     ▼
Assistant UI
```

Keep streaming parsing isolated.

For example:

```text
lib/hermes/
└── stream.ts
```

The stream parser should not know anything about React components.

---

# 16. API Route Responsibility

`app/api/chat/route.ts` should remain thin.

Conceptually:

```ts
export async function POST(request: Request) {
  const body = await request.json();

  return streamChat(body);
}
```

The route handler should not become a 300-line implementation.

Avoid putting:

- complex parsing
- Hermes protocol implementation
- UI transformation
- unrelated utilities

inside the route.

---

# 17. Frontend Responsibility

Assistant UI should be responsible for:

- displaying messages
- collecting user input
- rendering streaming output
- loading states
- error presentation
- conversation UI

The frontend should not:

- call the Hermes server directly
- contain Hermes credentials
- implement Hermes SSE parsing
- contain agent logic

---

# 18. Backend Responsibility

Next.js backend should be responsible for:

- receiving chat requests
- communicating with Hermes
- forwarding streaming responses
- handling backend errors
- managing application-level conversation identifiers if needed

It should not:

- implement LLM reasoning
- duplicate Hermes agent logic
- become another AI agent framework

Hermes remains the AI backend.

---

# 19. Conversation State

For MVP, do not introduce a database.

First determine whether Hermes conversation state is sufficient for the required multi-turn behavior.

Architecture:

```text
Assistant UI
      │
      ▼
Next.js
      │
      ▼
Hermes
      │
      └── Conversation state
```

If future requirements require application-owned persistence:

```text
Next.js
   │
   ├── Database
   │     └── Conversations
   │
   └── Hermes
```

That should be introduced as a separate feature, not mixed into the first MVP implementation.

---

# 20. Testing Strategy

The MVP should have at least three levels of testing.

## Level 1 — Connectivity

Verify:

```text
Next.js → Hermes
```

Example:

```text
Hermes reachable
Hermes API responds
```

---

## Level 2 — Basic Chat

Test:

```text
User message
      ↓
Hermes
      ↓
Assistant response
```

---

## Level 3 — Streaming

Verify:

```text
Hermes
  ↓
SSE chunks
  ↓
Next.js
  ↓
Assistant UI
```

The UI should not wait for the entire response.

---

# 21. Large Change Planning Rule

Before executing a large change, create a short implementation plan.

A change is considered "large" when it involves one or more of:

- multiple modules
- architecture changes
- new infrastructure
- new external dependency
- database introduction
- authentication
- persistence
- major refactoring
- changing the streaming protocol
- changing the agent integration
- deployment changes

The plan should contain:

```text
1. Objective
2. Current state
3. Proposed change
4. Files/modules affected
5. Implementation steps
6. Risks
7. Validation
8. Rollback/revert consideration
```

Example:

```text
## Plan — Add Persistent Conversations

Objective:
Store application-level conversation history.

Current:
Conversation exists only in runtime/Hermes state.

Changes:
1. Add database
2. Create conversation schema
3. Add repository
4. Add persistence service
5. Connect chat route
6. Add sidebar UI
7. Add tests

Validation:
- Create conversation
- Send message
- Refresh page
- Conversation remains available
```

Do not start a large implementation before the plan is clear.

---

# 22. Small Change Rule

Small changes can be implemented directly without a formal planning document.

Examples:

```text
- Change button text
- Fix spacing
- Rename a variable
- Fix a TypeScript error
- Adjust component styling
- Fix a small parsing bug
```

However, even small changes should preserve the architecture and avoid introducing dead code.

---

# 23. Refactoring Rule

Do not refactor unrelated code while implementing a feature.

Avoid:

```text
Feature request
   ↓
Change feature
   ↓
Rewrite entire project
```

Prefer:

```text
Feature request
   ↓
Minimal required change
   ↓
Validation
   ↓
Optional separate refactor
```

This keeps changes reviewable and reduces regression risk.

---

# 24. Definition of Done

A feature is not considered complete merely because it works locally.

Before considering a change complete:

### Code

- [ ] No unused imports
- [ ] No unused variables
- [ ] No dead functions
- [ ] No unnecessary dependencies
- [ ] No duplicated logic where a real abstraction exists
- [ ] Types are explicit
- [ ] Naming is clear

### Architecture

- [ ] Responsibility is in the correct module
- [ ] UI does not contain backend logic
- [ ] Hermes logic is isolated
- [ ] API route remains understandable
- [ ] No unnecessary abstraction was introduced

### Functionality

- [ ] Feature works
- [ ] Error case works
- [ ] Streaming still works
- [ ] Existing functionality still works

### Maintenance

- [ ] New code is easy to locate
- [ ] Functions have clear responsibilities
- [ ] No temporary code remains
- [ ] No commented-out abandoned implementation remains

---

# 25. AI Coding Agent Instructions

When an AI coding agent is used to implement this project, it should follow these rules.

## Before coding

For a small change:

```text
Understand → Implement → Validate
```

For a large change:

```text
Understand
   ↓
Inspect current code
   ↓
Create implementation plan
   ↓
Wait for/confirm execution direction when appropriate
   ↓
Implement
   ↓
Validate
   ↓
Clean up
```

---

## Before modifying existing code

The coding agent should inspect:

- existing project structure
- relevant files
- package dependencies
- existing abstractions
- current API flow
- current Assistant UI integration

Do not assume the structure.

---

## During implementation

The coding agent should:

1. Prefer existing project patterns.
2. Reuse existing utilities when appropriate.
3. Keep functions focused.
4. Avoid unnecessary abstractions.
5. Avoid adding dependencies without justification.
6. Keep Hermes integration isolated.
7. Preserve streaming behavior.
8. Avoid changing unrelated files.

---

## After implementation

The coding agent should:

1. Check TypeScript errors.
2. Check lint errors.
3. Check unused imports/functions.
4. Check for accidental dead code.
5. Validate the changed flow.
6. Review the final diff conceptually.
7. Remove temporary debugging code.

---

# 26. Planning Template

For large implementation tasks, use this format:

```md
# Implementation Plan

## Objective

What are we trying to achieve?

## Current State

How does the current implementation work?

## Proposed Architecture

What will change?

## Files / Modules Affected

- `...`
- `...`
- `...`

## Implementation Steps

1. ...
2. ...
3. ...

## Dependencies

- Existing:
- New:

## Risks

- ...

## Validation

- [ ] ...
- [ ] ...
- [ ] ...

## Cleanup

- [ ] Remove temporary code
- [ ] Remove unused imports
- [ ] Remove unused dependencies
- [ ] Verify no dead functions
```

---

# 27. Decision-Making Rule

When multiple implementations are possible, prefer the solution that has:

1. The smallest required surface area.
2. The fewest dependencies.
3. The clearest responsibility boundaries.
4. The easiest testing path.
5. The easiest future replacement/refactoring path.

Do not choose an architecture because it looks more "enterprise".

Choose it because the current requirements justify it.

---

# 28. Current MVP Engineering Target

The desired code flow is:

```text
Assistant UI
     │
     ▼
Chat Transport
     │
     ▼
POST /api/chat
     │
     ▼
Hermes Client
     │
     ▼
Hermes API
     │
     ▼
SSE Stream
     │
     ▼
Assistant UI
```

The implementation should remain small enough that a developer can understand the complete request flow without navigating through many abstraction layers.

---

# 29. Core Engineering Principle

> **Build only what is needed, isolate responsibilities, remove what is unused, and plan before making architectural changes.**

The MVP should prioritize a clean and understandable foundation over feature quantity.
