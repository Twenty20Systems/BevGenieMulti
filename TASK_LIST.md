# BevGenie - Task List & Improvement Plan

Last Updated: November 6, 2024

## Overview
This document tracks improvements needed for BevGenie based on comprehensive codebase analysis. Tasks are prioritized by impact and urgency.

---

## 🔴 CRITICAL PRIORITY (Start Immediately)

### 1. Code Cleanup - Remove Duplicate/Backup Files
**Impact:** High | **Effort:** Low | **Status:** ⬜ Not Started

**Files to Remove:**
```bash
rm app/genie/page.tsx.bak
rm app/genie/page.tsx.old
rm lib/ai/vector-detection.ts.bak
```

**Additional Cleanup:**
- Review and remove `/app/genie/page.tsx` (only redirects to home)
- Archive old code to git history, not in working directory

---

### 2. Consolidate Loading Screens (3 Duplicates)
**Impact:** High | **Effort:** Medium | **Status:** ⬜ Not Started

**Current Duplicates:**
- `components/loading-screen.tsx` - Progress bar variant
- `components/page-loading-screen.tsx` - Creative animated variants
- `components/genie/loading-screen.tsx` - BevGenieVisualLoader

**Action Plan:**
1. Choose ONE loading system (recommend: BevGenieVisualLoader for brand consistency)
2. Create variant props if multiple styles needed:
   ```typescript
   interface LoadingScreenProps {
     variant: 'simple' | 'visual' | 'creative';
     message?: string;
     progress?: number;
   }
   ```
3. Update all imports to use consolidated component
4. Delete redundant files

**Files Affected:**
- `app/page.tsx` (imports simple-loader)
- `components/genie/dynamic-content.tsx`
- Any other loading screen usage

---

### 3. Database Migrations - Add Missing Tables
**Impact:** Critical | **Effort:** High | **Status:** ⬜ Not Started

**Problem:** Code expects 5+ tables, but only 2 migrations exist.

**Required Migrations:**
```sql
-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create user_personas table
CREATE TABLE user_personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL,
  persona_type TEXT,
  pain_points_detected TEXT[],
  sales_focus_score FLOAT DEFAULT 0,
  marketing_focus_score FLOAT DEFAULT 0,
  compliance_focus_score FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create conversation_history table
CREATE TABLE conversation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL,
  user_message TEXT NOT NULL,
  assistant_message TEXT,
  page_generated JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create persona_signals table
CREATE TABLE persona_signals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL,
  signal_type TEXT NOT NULL,
  signal_text TEXT,
  confidence_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create knowledge_base table (if not exists)
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  persona_tags TEXT[],
  pain_point_tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Add Indexes:**
```sql
CREATE INDEX idx_personas_session ON user_personas(session_id);
CREATE INDEX idx_conversation_session ON conversation_history(session_id, created_at DESC);
CREATE INDEX idx_signals_session ON persona_signals(session_id, created_at DESC);
CREATE INDEX idx_kb_embedding ON knowledge_base USING ivfflat (embedding vector_cosine_ops);
```

**Migration Files to Create:**
- `supabase/migrations/20250106000000_enable_pgvector.sql`
- `supabase/migrations/20250106000001_create_core_tables.sql`
- `supabase/migrations/20250106000002_add_indexes.sql`

---

### 4. Authentication System - MISSING ENTIRELY
**Impact:** Critical (Security) | **Effort:** High | **Status:** ⬜ Not Started

**Components Needed:**

**A. Supabase Auth Integration**
```typescript
// lib/auth/supabase-auth.ts
import { createBrowserClient } from '@supabase/ssr'

export const getAuthClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**B. Auth Pages**
- Create `app/login/page.tsx`
- Create `app/signup/page.tsx`
- Create `app/auth/callback/route.ts` (OAuth callback)

**C. Auth Middleware**
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()
  return res
}
```

**D. Protected Routes**
- Add auth check to API routes
- Create `lib/auth/get-session.ts` helper
- Add RLS policies to Supabase tables

**E. User Context**
```typescript
// contexts/auth-context.tsx
'use client'
import { createContext, useContext } from 'react'

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
```

---

### 5. Create Project README
**Impact:** High | **Effort:** Low | **Status:** ⬜ Not Started

**Required Sections:**
```markdown
# BevGenie

AI-powered beverage industry intelligence platform.

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- Supabase account

### Environment Variables
\`\`\`bash
cp .env.example .env.local
\`\`\`

Required variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- ANTHROPIC_API_KEY
- OPENAI_API_KEY

### Installation
\`\`\`bash
pnpm install
pnpm run dev
\`\`\`

## Architecture
- Next.js 16 with App Router
- Supabase (PostgreSQL + pgvector)
- Claude Sonnet 4.5 for page generation
- OpenAI GPT-4o for chat responses

## Project Structure
\`\`\`
app/                    # Next.js app router
├── api/               # API routes
├── genie/            # Chat interface
components/            # React components
lib/                   # Core logic
├── ai/               # AI integrations
├── session/          # Session management
├── supabase/         # Database
\`\`\`

## Key Features
- Dynamic page generation based on user intent
- Persona detection (sales/marketing/compliance focus)
- Real-time chat with SSE streaming
- Knowledge base with vector search

## Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup.

## Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.
```

**Also Create:**
- `.env.example` with all required variables (dummy values)
- `DEPLOYMENT.md` with Vercel deployment guide

---

## 🟠 HIGH PRIORITY (Within 2 Weeks)

### 6. Global Error Handling
**Impact:** High | **Effort:** Medium | **Status:** ⬜ Not Started

**Tasks:**

**A. Error Boundary Component**
```typescript
// components/error-boundary.tsx
'use client'
import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
    // TODO: Send to error tracking service
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2>Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </div>
    </div>
  )
}
```

**B. Error Page**
- Create `app/error.tsx` (global error handler)
- Create `app/not-found.tsx` (404 page)

**C. Standardized Error Responses**
```typescript
// lib/errors/api-error.ts
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
  }
}

export function handleAPIError(error: unknown) {
  if (error instanceof APIError) {
    return new Response(JSON.stringify({
      error: error.message,
      code: error.code,
    }), { status: error.statusCode })
  }
  // Log unknown errors
  console.error('Unknown error:', error)
  return new Response('Internal server error', { status: 500 })
}
```

**D. Error Logging Service**
- Add Sentry integration: `npm install @sentry/nextjs`
- Create `sentry.client.config.ts`
- Create `sentry.server.config.ts`

---

### 7. API Input Validation with Zod
**Impact:** High | **Effort:** Medium | **Status:** ⬜ Not Started

**Zod is already installed but unused!**

**Create Schemas:**
```typescript
// lib/validation/chat-schemas.ts
import { z } from 'zod'

export const chatMessageSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().uuid().optional(),
})

export const streamRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  pageType: z.enum(['solution_brief', 'case_study', 'pricing']),
  personaOverride: z.object({
    pain_points_detected: z.array(z.string()).optional(),
    sales_focus_score: z.number().min(0).max(1).optional(),
  }).optional(),
})
```

**Validation Middleware:**
```typescript
// lib/validation/validate-request.ts
import { z } from 'zod'
import { NextRequest } from 'next/server'

export async function validateRequest<T extends z.ZodType>(
  req: NextRequest,
  schema: T
): Promise<z.infer<T>> {
  const body = await req.json()
  return schema.parse(body) // Throws ZodError if invalid
}
```

**Update API Routes:**
- `app/api/chat/route.ts` - Add validation
- `app/api/chat/stream/route.ts` - Add validation
- Return 400 with Zod error details on validation failure

---

### 8. Testing Infrastructure
**Impact:** High | **Effort:** High | **Status:** ⬜ Not Started

**Install Dependencies:**
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Configuration:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

**Setup File:**
```typescript
// vitest.setup.ts
import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
```

**Priority Test Files to Create:**

1. **API Route Tests:**
```typescript
// app/api/chat/stream/route.test.ts
import { POST } from './route'
import { NextRequest } from 'next/server'

describe('/api/chat/stream', () => {
  it('should return 400 for invalid request', async () => {
    const req = new NextRequest('http://localhost/api/chat/stream', {
      method: 'POST',
      body: JSON.stringify({ invalid: 'data' }),
    })
    const response = await POST(req)
    expect(response.status).toBe(400)
  })

  it('should stream response for valid request', async () => {
    // Test SSE streaming
  })
})
```

2. **Component Tests:**
```typescript
// components/genie/chat-bubble.test.tsx
import { render, screen } from '@testing-library/react'
import { ChatBubble } from './chat-bubble'

describe('ChatBubble', () => {
  it('renders user message correctly', () => {
    render(<ChatBubble role="user" content="Hello" />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

3. **Utility Tests:**
```typescript
// lib/session/session.test.ts
import { getOrCreateSession } from './session'

describe('Session Management', () => {
  it('creates new session if not exists', async () => {
    const session = await getOrCreateSession('test-id')
    expect(session.sessionId).toBeDefined()
  })
})
```

**Add to package.json:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

---

### 9. Database Query Optimization
**Impact:** High | **Effort:** Medium | **Status:** ⬜ Not Started

**A. Add Query Result Caching**
```typescript
// lib/cache/query-cache.ts
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export function getCached<T>(key: string): T | null {
  const cached = cache.get(key)
  if (!cached) return null
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return cached.data as T
}

export function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}
```

**B. Implement Pagination**
```typescript
// lib/session/session.ts - Line 358-362
// BEFORE: Loading all history
const history = await supabaseAdmin
  .from('conversation_history')
  .select('*')
  .eq('session_id', sessionId)
  .order('created_at', { ascending: true })

// AFTER: Paginated
export async function getConversationHistory(
  sessionId: string,
  page: number = 1,
  limit: number = 50
) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  return supabaseAdmin
    .from('conversation_history')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .range(from, to)
}
```

**C. Connection Pooling**
```typescript
// lib/supabase/client.ts
// Add connection pool configuration
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: {
      pooler: {
        enabled: true,
        mode: 'transaction', // or 'session'
      },
    },
  }
)
```

**D. Optimize Embedding Searches**
- Current: Every search hits database
- Add: In-memory cache for frequent queries
- Add: Pre-compute common embeddings

---

### 10. Consolidate Query Files
**Impact:** Medium | **Effort:** Medium | **Status:** ⬜ Not Started

**Problem:** 3 separate query files with overlapping functionality
- `lib/supabase/queries.ts`
- `lib/supabase/queries-dal.ts`
- `lib/supabase/page-queries.ts`

**Action Plan:**

1. **Merge into Repository Pattern:**
```
lib/repositories/
├── base.repository.ts          # Already exists
├── conversation.repository.ts  # NEW - from queries.ts
├── persona.repository.ts       # NEW - from queries-dal.ts
├── knowledge.repository.ts     # Already exists
└── page.repository.ts         # Already exists
```

2. **Create Unified Interface:**
```typescript
// lib/repositories/index.ts
export { ConversationRepository } from './conversation.repository'
export { PersonaRepository } from './persona.repository'
export { KnowledgeRepository } from './knowledge.repository'
export { PageRepository } from './page.repository'

// Factory for easy instantiation
export function createRepositories() {
  return {
    conversations: new ConversationRepository(),
    personas: new PersonaRepository(),
    knowledge: new KnowledgeRepository(),
    pages: new PageRepository(),
  }
}
```

3. **Update API Routes:**
- Replace direct Supabase calls with repository calls
- Consistent error handling through repositories

4. **Delete Old Files:**
- Remove `queries.ts`
- Remove `queries-dal.ts`
- Keep `page-queries.ts` only if still needed

---

## 🟡 MEDIUM PRIORITY (Within 1 Month)

### 11. Type Safety Improvements
**Impact:** Medium | **Effort:** High | **Status:** ⬜ Not Started

**A. Replace `any` Types (50+ instances)**

**Priority Areas:**
1. `lib/ai/page-generator.ts` - AI response types
2. `components/templates/page-components.tsx` - Component props
3. API route handlers - Request/response types

**Example Fix:**
```typescript
// BEFORE
function processResponse(data: any) {
  return data.content
}

// AFTER
interface AIResponse {
  content: string;
  metadata?: {
    tokens: number;
    model: string;
  };
}

function processResponse(data: AIResponse) {
  return data.content
}
```

**B. Create Zod Schemas for Data Models**
```typescript
// lib/validation/models.ts
import { z } from 'zod'

export const PersonaScoresSchema = z.object({
  pain_points_detected: z.array(z.string()),
  sales_focus_score: z.number().min(0).max(1),
  marketing_focus_score: z.number().min(0).max(1),
  compliance_focus_score: z.number().min(0).max(1),
})

export const BevGeniePageSchema = z.object({
  type: z.string(),
  title: z.string(),
  description: z.string(),
  sections: z.array(z.any()), // Define section schema
})

// Derive TypeScript types from schemas
export type PersonaScores = z.infer<typeof PersonaScoresSchema>
export type BevGeniePage = z.infer<typeof BevGeniePageSchema>
```

**C. Stricter TypeScript Config**
```json
// tsconfig.json - Add these
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
  }
}
```

---

### 12. Component Organization
**Impact:** Medium | **Effort:** Medium | **Status:** ⬜ Not Started

**A. Add Barrel Exports**
```typescript
// components/genie/index.ts
export { ChatBubble } from './chat-bubble'
export { DynamicContent } from './dynamic-content'
export { SimpleLoader } from './simple-loader'

// components/ui/index.ts
export * from './button'
export * from './card'
export * from './dialog'
// ... etc
```

**Usage:**
```typescript
// BEFORE
import { ChatBubble } from '@/components/genie/chat-bubble'
import { DynamicContent } from '@/components/genie/dynamic-content'

// AFTER
import { ChatBubble, DynamicContent } from '@/components/genie'
```

**B. Remove Unused Components**

**Audit These:**
- `components/full-screen-page-view.tsx` - No references found
- `components/page-with-chat-sidebar.tsx` - Unclear usage
- Duplicate chat bubbles after consolidation

**Process:**
1. Search codebase for imports: `grep -r "import.*full-screen-page-view"`
2. If no results, safely delete
3. Commit with clear message for easy rollback

**C. Standardize Naming Convention**

**Current Issues:**
- Some files: `chat-bubble.tsx` (kebab-case)
- Some files: `ChatBubble.tsx` (PascalCase)
- Inconsistent component export styles

**Standard to Adopt:**
```
✅ Filename: kebab-case (chat-bubble.tsx)
✅ Component: PascalCase (ChatBubble)
✅ Export: Named export (export function ChatBubble)
```

---

### 13. Performance Optimization
**Impact:** Medium | **Effort:** High | **Status:** ⬜ Not Started

**A. Add Request Timeout Handling**
```typescript
// lib/utils/timeout.ts
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage = 'Request timeout'
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
  )
  return Promise.race([promise, timeout])
}

// Usage in API routes
const response = await withTimeout(
  generatePageSpec(...),
  30000, // 30 second timeout
  'Page generation timed out'
)
```

**B. Implement Rate Limiting**
```typescript
// lib/rate-limit/limiter.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
})

// Middleware usage
export async function withRateLimit(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1'
  const { success } = await ratelimit.limit(ip)
  if (!success) {
    return new Response('Too many requests', { status: 429 })
  }
}
```

**Note:** Requires Upstash Redis (free tier available) or implement in-memory version

**C. Add AI Prompt Caching**
```typescript
// lib/ai/prompt-cache.ts
const promptCache = new Map<string, { response: any; timestamp: number }>()

export async function cachedGenerate(
  prompt: string,
  generator: () => Promise<any>,
  ttlMs: number = 60000
) {
  const hash = hashString(prompt)
  const cached = promptCache.get(hash)

  if (cached && Date.now() - cached.timestamp < ttlMs) {
    console.log('[CACHE HIT] Prompt cache - saved AI call!')
    return cached.response
  }

  const response = await generator()
  promptCache.set(hash, { response, timestamp: Date.now() })
  return response
}
```

**D. Bundle Optimization**
```typescript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['@radix-ui/react-*'],
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        default: false,
        vendors: false,
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      },
    }
    return config
  },
}
```

---

### 14. API Documentation
**Impact:** Medium | **Effort:** Medium | **Status:** ⬜ Not Started

**Use OpenAPI/Swagger:**

**Install:**
```bash
pnpm add swagger-jsdoc swagger-ui-react
```

**Create Spec:**
```typescript
// lib/docs/api-spec.ts
export const apiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'BevGenie API',
    version: '1.0.0',
    description: 'AI-powered beverage industry intelligence API',
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Development' },
    { url: 'https://bevgenie.vercel.app', description: 'Production' },
  ],
  paths: {
    '/api/chat/stream': {
      post: {
        summary: 'Stream AI-generated page',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  pageType: { type: 'string', enum: ['solution_brief', 'case_study'] },
                },
                required: ['message'],
              },
            },
          },
        },
        responses: {
          200: { description: 'SSE stream of generated page' },
          400: { description: 'Invalid request' },
        },
      },
    },
  },
}
```

**Documentation Page:**
```typescript
// app/api/docs/page.tsx
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'
import { apiSpec } from '@/lib/docs/api-spec'

export default function APIDocsPage() {
  return <SwaggerUI spec={apiSpec} />
}
```

---

### 15. Accessibility Audit
**Impact:** Medium | **Effort:** Medium | **Status:** ⬜ Not Started

**A. Add Focus Management**
```typescript
// hooks/use-focus-trap.ts
import { useEffect, useRef } from 'react'

export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isActive) return

    const container = containerRef.current
    if (!container) return

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    firstElement?.focus()

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    container.addEventListener('keydown', handleTab)
    return () => container.removeEventListener('keydown', handleTab)
  }, [isActive])

  return containerRef
}
```

**B. Run Lighthouse Audit**
```bash
# Install
pnpm add -D @lhci/cli

# Run audit
npx lhci autorun --config=lighthouserc.js
```

**Configuration:**
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:performance': ['warn', { minScore: 0.8 }],
      },
    },
  },
}
```

**C. Add ARIA Labels**

**Priority Areas:**
- Chat input (line in chat-bubble.tsx)
- Loading indicators
- Dynamic content sections
- Navigation elements

**Example Fixes:**
```typescript
// BEFORE
<input type="text" placeholder="Type message..." />

// AFTER
<input
  type="text"
  placeholder="Type message..."
  aria-label="Chat message input"
  aria-describedby="chat-help-text"
/>
<span id="chat-help-text" className="sr-only">
  Enter your question about beverage industry insights
</span>
```

---

## 🟢 LOW PRIORITY (Nice to Have)

### 16. Monitoring & Observability
**Impact:** Low | **Effort:** High | **Status:** ⬜ Not Started

**A. Error Tracking (Sentry)**
```bash
pnpm add @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

**B. Analytics (PostHog)**
```bash
pnpm add posthog-js
```

```typescript
// lib/analytics/posthog.ts
import posthog from 'posthog-js'

export function initAnalytics() {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: 'https://app.posthog.com',
    })
  }
}

export function trackEvent(event: string, properties?: Record<string, any>) {
  posthog.capture(event, properties)
}
```

**C. Structured Logging**
```typescript
// lib/logger/index.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
})

// Replace console.log with logger
logger.info({ userId, action: 'page_generated' }, 'Page generated successfully')
```

---

### 17. Developer Experience
**Impact:** Low | **Effort:** Medium | **Status:** ⬜ Not Started

**A. Pre-commit Hooks**
```bash
pnpm add -D husky lint-staged
npx husky init
```

```javascript
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"
pnpm lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

**B. Commit Message Linting**
```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'],
    ],
  },
}
```

**C. VSCode Workspace Settings**
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.exclude": {
    "**/.next": true,
    "**/node_modules": true
  }
}
```

---

### 18. Advanced Features
**Impact:** Low | **Effort:** High | **Status:** ⬜ Not Started

**A. Retry Logic with Exponential Backoff**
```typescript
// lib/utils/retry.ts
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * Math.pow(2, i)))
      }
    }
  }

  throw lastError
}
```

**B. Feature Flags**
```typescript
// lib/features/flags.ts
const flags = {
  enableNewTemplate: process.env.FEATURE_NEW_TEMPLATE === 'true',
  enableVoiceInput: process.env.FEATURE_VOICE === 'true',
}

export function isFeatureEnabled(flag: keyof typeof flags): boolean {
  return flags[flag] ?? false
}
```

**C. A/B Testing Framework**
```typescript
// lib/experiments/ab-test.ts
export function getVariant(userId: string, experimentName: string): 'A' | 'B' {
  const hash = hashString(userId + experimentName)
  return hash % 2 === 0 ? 'A' : 'B'
}
```

---

## 📊 Progress Tracking

### Summary
- **Total Tasks:** 18
- **Critical:** 5 (🔴)
- **High Priority:** 5 (🟠)
- **Medium Priority:** 5 (🟡)
- **Low Priority:** 3 (🟢)

### Status Legend
- ⬜ Not Started
- 🟨 In Progress
- ✅ Completed
- ⏸️ Blocked
- ❌ Cancelled

### Estimated Timeline
- **Week 1:** Tasks 1-5 (Critical)
- **Weeks 2-3:** Tasks 6-10 (High Priority)
- **Month 2:** Tasks 11-15 (Medium Priority)
- **Ongoing:** Tasks 16-18 (Low Priority)

---

## 🔗 Related Documents
- [SYNC_GUIDE.md](../management_system/SYNC_GUIDE.md) - Keep in sync with Management System
- [Visual Documentation](./VISUAL_DOCS_*.md) - Architecture diagrams
- [JIRA Tickets](./JIRA_TICKETS_FINAL.md) - Original requirements

---

**Last Updated:** November 6, 2024
**Reviewed By:** Claude Code Analysis
**Next Review:** Weekly (update status and add new findings)
