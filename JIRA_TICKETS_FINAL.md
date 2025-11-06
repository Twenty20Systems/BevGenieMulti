# BevGenie - Jira Ticket Structure (True Chronological Order)

## Document Overview
This document provides tickets in **TRUE CHRONOLOGICAL ORDER** based on actual development history. Each ticket can be completed sequentially from scratch, with all dependencies properly separated.

**Critical**: Follow tickets in exact order (BEV-001 → BEV-002 → BEV-003...) for successful implementation.

---

## EPIC 1: Project Initialization
**Epic Key:** BEV-EPIC-001
**Epic Name:** Project Initialization & Environment Setup
**Description:** Initialize the project repository, set up Next.js with TypeScript, and configure the development environment.

---

### Story 1.1: Initial Project Setup
**Story Key:** BEV-001
**Story Name:** Initialize Next.js Project with TypeScript
**Story Points:** 3
**Priority:** Highest
**Dependencies:** None

**Description:**
Create initial Next.js 16 project with TypeScript configuration and basic project structure.

**Acceptance Criteria:**
- [ ] Next.js 16.0.0 project initialized
- [ ] TypeScript configured
- [ ] Basic folder structure created
- [ ] Git repository initialized
- [ ] .gitignore configured
- [ ] Development server runs
- [ ] Initial commit created

**Technical Notes:**
- Use: `npx create-next-app@latest`
- Enable: TypeScript, Tailwind CSS, App Router
- Files created: `package.json`, `tsconfig.json`, `next.config.js`

**Subtasks:**
- **BEV-001-1:** Run create-next-app with TypeScript
- **BEV-001-2:** Configure project settings
- **BEV-001-3:** Create folder structure (app/, components/, lib/)
- **BEV-001-4:** Initialize git repository
- **BEV-001-5:** Create initial commit

---

### Story 1.2: Install Core Dependencies
**Story Key:** BEV-002
**Story Name:** Install and Configure Core Dependencies
**Story Points:** 2
**Priority:** Highest
**Dependencies:** BEV-001

**Description:**
Install all required npm packages including UI components, AI SDKs, and utility libraries.

**Acceptance Criteria:**
- [ ] Tailwind CSS 4.x installed and configured
- [ ] All Radix UI components installed
- [ ] OpenAI SDK installed
- [ ] Anthropic SDK installed
- [ ] Supabase client installed
- [ ] Iron-session installed
- [ ] pptxgenjs installed
- [ ] All dependencies in package.json
- [ ] Project builds successfully

**Core Dependencies:**
- @anthropic-ai/sdk
- @supabase/supabase-js
- openai
- iron-session
- pptxgenjs
- 40+ @radix-ui components
- tailwindcss, lucide-react, class-variance-authority

**Technical Notes:**
- File: `package.json`
- Run: `npm install` after adding all dependencies
- Verify: `npm run build` succeeds

**Subtasks:**
- **BEV-002-1:** Install Tailwind CSS v4
- **BEV-002-2:** Install all Radix UI components
- **BEV-002-3:** Install AI SDKs (OpenAI, Anthropic)
- **BEV-002-4:** Install Supabase client
- **BEV-002-5:** Install session and utility libraries
- **BEV-002-6:** Verify build succeeds

---

### Story 1.3: Configure Tailwind CSS and Design Tokens
**Story Key:** BEV-003
**Story Name:** Setup Tailwind CSS with Custom Theme Configuration
**Story Points:** 3
**Priority:** High
**Dependencies:** BEV-002

**Description:**
Configure Tailwind CSS v4 with custom theme, colors, and design tokens.

**Acceptance Criteria:**
- [ ] Tailwind config file created
- [ ] Custom color palette defined
- [ ] Cyan (#00C8FF) as primary color
- [ ] Dark theme colors configured
- [ ] Typography scale defined
- [ ] Spacing system configured
- [ ] Animation utilities added
- [ ] Tailwind builds without errors

**Color System:**
- Primary: #00C8FF (Cyan)
- Background: #0A1930, #0D2342 (Dark blues)
- Text: White, Gray-300, Gray-400
- Effects: Glassmorphism with opacity

**Technical Notes:**
- Files: `tailwind.config.ts`, `app/globals.css`
- Use: CSS custom properties for theme
- Add: tailwindcss-animate plugin

**Subtasks:**
- **BEV-003-1:** Create tailwind.config.ts
- **BEV-003-2:** Define color palette
- **BEV-003-3:** Configure typography
- **BEV-003-4:** Add animation utilities
- **BEV-003-5:** Create design tokens file
- **BEV-003-6:** Test theme in component

---

### Story 1.4: Setup Environment Variables
**Story Key:** BEV-004
**Story Name:** Configure Environment Variables Structure
**Story Points:** 2
**Priority:** Highest
**Dependencies:** BEV-001

**Description:**
Set up environment variable structure and create example file for documentation.

**Acceptance Criteria:**
- [ ] .env.local.example created
- [ ] All required variables documented
- [ ] .env.local added to .gitignore
- [ ] Environment variable types defined
- [ ] Validation helper created
- [ ] Documentation for each variable

**Required Variables:**
```
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
SESSION_PASSWORD=
```

**Technical Notes:**
- File: `.env.local.example`
- Never commit: `.env.local`
- Validate: Required vars on app start

**Subtasks:**
- **BEV-004-1:** Create .env.local.example
- **BEV-004-2:** Document each variable
- **BEV-004-3:** Add to .gitignore
- **BEV-004-4:** Create validation helper

---

## EPIC 2: Database & Backend Infrastructure
**Epic Key:** BEV-EPIC-002
**Epic Name:** Database Schema & Supabase Setup
**Description:** Set up Supabase project and implement complete database schema with vector search capabilities.

---

### Story 2.1: Create Supabase Project
**Story Key:** BEV-005
**Story Name:** Initialize Supabase Project and Get Credentials
**Story Points:** 2
**Priority:** Highest
**Dependencies:** BEV-004

**Description:**
Create Supabase project, enable pgvector extension, and configure project credentials.

**Acceptance Criteria:**
- [ ] Supabase project created
- [ ] Project URL obtained
- [ ] Anon key obtained
- [ ] Service role key obtained
- [ ] pgvector extension enabled
- [ ] Environment variables updated
- [ ] Connection tested from Next.js

**Technical Notes:**
- Platform: supabase.com
- Extension: Enable pgvector for vector search
- Update: `.env.local` with credentials

**Subtasks:**
- **BEV-005-1:** Create Supabase account and project
- **BEV-005-2:** Enable pgvector extension
- **BEV-005-3:** Copy credentials to .env.local
- **BEV-005-4:** Test connection from Next.js

---

### Story 2.2: Create Database Schema (Tables Only)
**Story Key:** BEV-006
**Story Name:** Implement Core Database Tables
**Story Points:** 8
**Priority:** Highest
**Dependencies:** BEV-005

**Description:**
Create all 5 core database tables with proper schemas, columns, and data types.

**Acceptance Criteria:**
- [ ] knowledge_base table created with vector column
- [ ] user_personas table created with persona scores
- [ ] conversation_history table created
- [ ] persona_signals table created
- [ ] generated_brochures table created
- [ ] All columns have correct types
- [ ] Default values set appropriately
- [ ] Tables verified in Supabase dashboard

**Tables:**
1. **knowledge_base**: content, embedding (vector 1536), metadata, tags
2. **user_personas**: session_id, all persona score columns
3. **conversation_history**: messages with persona snapshots
4. **persona_signals**: audit trail of detections
5. **generated_brochures**: saved presentations

**Technical Notes:**
- File: `lib/supabase/migrations.sql`
- Vector dimension: 1536 (for text-embedding-3-small)
- Run in: Supabase SQL Editor

**Subtasks:**
- **BEV-006-1:** Create knowledge_base table
- **BEV-006-2:** Create user_personas table
- **BEV-006-3:** Create conversation_history table
- **BEV-006-4:** Create persona_signals table
- **BEV-006-5:** Create generated_brochures table
- **BEV-006-6:** Verify all tables in dashboard

---

### Story 2.3: Create Database Indexes
**Story Key:** BEV-007
**Story Name:** Add Performance Indexes to All Tables
**Story Points:** 3
**Priority:** High
**Dependencies:** BEV-006

**Description:**
Create indexes on frequently queried columns for optimal performance.

**Acceptance Criteria:**
- [ ] HNSW index on knowledge_base.embedding
- [ ] GIN indexes on array columns (persona_tags, pain_point_tags)
- [ ] Indexes on session_id columns
- [ ] Indexes on created_at columns
- [ ] Indexes on user_id columns
- [ ] Index on source_type column
- [ ] All indexes verified and active

**Key Indexes:**
- Vector similarity: HNSW on embedding column
- Array searches: GIN on tag arrays
- Lookups: B-tree on IDs and timestamps

**Technical Notes:**
- Include in: `lib/supabase/migrations.sql`
- HNSW: Efficient vector similarity search
- GIN: Fast array containment queries

**Subtasks:**
- **BEV-007-1:** Create HNSW vector index
- **BEV-007-2:** Create GIN indexes on arrays
- **BEV-007-3:** Create indexes on session_id
- **BEV-007-4:** Create indexes on timestamps
- **BEV-007-5:** Verify index performance

---

### Story 2.4: Create Database Functions
**Story Key:** BEV-008
**Story Name:** Implement Vector Search Functions
**Story Points:** 5
**Priority:** High
**Dependencies:** BEV-007

**Description:**
Create PostgreSQL functions for vector similarity search and hybrid search.

**Acceptance Criteria:**
- [ ] match_documents() function created
- [ ] hybrid_search() function created
- [ ] Functions accept proper parameters
- [ ] Vector similarity works correctly
- [ ] Full-text search works
- [ ] Hybrid scoring implemented
- [ ] Functions tested with sample data

**Functions:**
1. **match_documents**: Vector similarity search only
2. **hybrid_search**: Combined vector + full-text search

**Technical Notes:**
- Language: plpgsql
- Returns: TABLE with similarity scores
- Scoring: 60% vector, 40% text relevance

**Subtasks:**
- **BEV-008-1:** Create match_documents function
- **BEV-008-2:** Create hybrid_search function
- **BEV-008-3:** Test vector similarity
- **BEV-008-4:** Test full-text search
- **BEV-008-5:** Test hybrid scoring

---

### Story 2.5: Create Database Triggers
**Story Key:** BEV-009
**Story Name:** Add Automatic Timestamp Update Triggers
**Story Points:** 2
**Priority:** Medium
**Dependencies:** BEV-006

**Description:**
Create triggers to automatically update timestamp columns on record updates.

**Acceptance Criteria:**
- [ ] update_updated_at_column() function created
- [ ] Trigger on knowledge_base table
- [ ] Trigger on user_personas table
- [ ] updated_at columns update automatically
- [ ] Triggers tested with updates

**Technical Notes:**
- Function: Sets updated_at = NOW()
- Trigger: BEFORE UPDATE FOR EACH ROW
- Tables: knowledge_base, user_personas

**Subtasks:**
- **BEV-009-1:** Create timestamp update function
- **BEV-009-2:** Add trigger to knowledge_base
- **BEV-009-3:** Add trigger to user_personas
- **BEV-009-4:** Test automatic updates

---

### Story 2.6: Implement Row-Level Security (RLS)
**Story Key:** BEV-010
**Story Name:** Enable RLS and Create Security Policies
**Story Points:** 5
**Priority:** Highest
**Dependencies:** BEV-006

**Description:**
Enable RLS on all tables and create policies for secure data access.

**Acceptance Criteria:**
- [ ] RLS enabled on all 5 tables
- [ ] Public read policy on knowledge_base
- [ ] Service role write policy on knowledge_base
- [ ] User-specific policies on user_personas
- [ ] User-specific policies on conversation_history
- [ ] Service-only policy on persona_signals
- [ ] User-specific policies on generated_brochures
- [ ] All policies tested

**Security Model:**
- knowledge_base: Public read, service write
- User data: Only accessible by owner or service role
- Signals: Service role only

**Technical Notes:**
- File: `PHASE_1_RLS_SETUP.sql`
- Functions: auth.uid(), auth.role()
- Test: With different user contexts

**Subtasks:**
- **BEV-010-1:** Enable RLS on all tables
- **BEV-010-2:** Create knowledge_base policies
- **BEV-010-3:** Create user_personas policies
- **BEV-010-4:** Create conversation_history policies
- **BEV-010-5:** Create persona_signals policies
- **BEV-010-6:** Create generated_brochures policies
- **BEV-010-7:** Test all policies

---

### Story 2.7: Create Supabase Client Configuration
**Story Key:** BEV-011
**Story Name:** Setup Supabase Client with Service Role Separation
**Story Points:** 3
**Priority:** Highest
**Dependencies:** BEV-010

**Description:**
Create Supabase client instances for both public (anon) and admin (service role) access.

**Acceptance Criteria:**
- [ ] Public client created for client-side use
- [ ] Admin client created for server-side use
- [ ] Service key never exposed to client
- [ ] Clients use correct keys
- [ ] Connection verified for both clients
- [ ] Type-safe client exports

**Clients:**
1. **supabase**: Public client (NEXT_PUBLIC_SUPABASE_ANON_KEY)
2. **supabaseAdmin**: Admin client (SUPABASE_SERVICE_KEY)

**Technical Notes:**
- File: `lib/supabase/client.ts`
- Admin: Server-side only, bypasses RLS
- Public: Client-side safe, respects RLS

**Subtasks:**
- **BEV-011-1:** Create public Supabase client
- **BEV-011-2:** Create admin Supabase client
- **BEV-011-3:** Add environment variable checks
- **BEV-011-4:** Test both clients
- **BEV-011-5:** Verify service key not in bundle

---

## EPIC 3: Session Management System
**Epic Key:** BEV-EPIC-003
**Epic Name:** User Session Management with Iron Session
**Description:** Implement secure, encrypted session management for stateful user experiences.

---

### Story 3.1: Define Session Types
**Story Key:** BEV-012
**Story Name:** Create TypeScript Types for Session Data
**Story Points:** 3
**Priority:** Highest
**Dependencies:** BEV-001

**Description:**
Define comprehensive TypeScript interfaces for session data, persona scores, and related types.

**Acceptance Criteria:**
- [ ] SessionData interface defined
- [ ] IronSessionData interface defined
- [ ] PersonaScores interface defined
- [ ] PainPointType enum defined
- [ ] Detection vector types defined
- [ ] DEFAULT_PERSONA_SCORES constant created
- [ ] All types exported properly

**Key Types:**
```typescript
interface PersonaScores {
  detection_vectors: { ... }
  supplier_score, distributor_score
  craft_score, mid_sized_score, large_score
  sales_focus_score, marketing_focus_score
  operations_focus_score, compliance_focus_score
  pain_points_detected: PainPointType[]
  pain_points_confidence: Record<PainPointType, number>
  overall_confidence: number
  total_interactions: number
}
```

**Technical Notes:**
- File: `lib/session/types.ts`
- Export: All interfaces and types
- Include: Default values

**Subtasks:**
- **BEV-012-1:** Define PersonaScores interface
- **BEV-012-2:** Define SessionData interface
- **BEV-012-3:** Define IronSessionData interface
- **BEV-012-4:** Create PainPointType enum
- **BEV-012-5:** Create DEFAULT_PERSONA_SCORES
- **BEV-012-6:** Add JSDoc documentation

---

### Story 3.2: Configure Iron Session
**Story Key:** BEV-013
**Story Name:** Setup Iron Session Configuration
**Story Points:** 2
**Priority:** Highest
**Dependencies:** BEV-012, BEV-004

**Description:**
Configure iron-session with encryption settings and cookie options.

**Acceptance Criteria:**
- [ ] Session config object created
- [ ] Cookie name set to 'bevgenie_session'
- [ ] Secure password from environment
- [ ] Cookie settings configured
- [ ] TTL set to 24 hours
- [ ] httpOnly and secure flags set
- [ ] SameSite policy configured

**Configuration:**
- Cookie name: bevgenie_session
- Password: 32+ character random string
- TTL: 86400 seconds (24 hours)
- httpOnly: true
- secure: true (production)

**Technical Notes:**
- File: `lib/session/config.ts`
- Password: From SESSION_PASSWORD env var
- Min length: 32 characters

**Subtasks:**
- **BEV-013-1:** Create session config file
- **BEV-013-2:** Define cookie settings
- **BEV-013-3:** Add environment variable validation
- **BEV-013-4:** Export session config
- **BEV-013-5:** Test configuration

---

### Story 3.3: Implement Session Utilities
**Story Key:** BEV-014
**Story Name:** Create Session Management Functions
**Story Points:** 8
**Priority:** Highest
**Dependencies:** BEV-013, BEV-011

**Description:**
Implement core session management functions: get, update, save, and destroy sessions.

**Acceptance Criteria:**
- [ ] getSession() function created
- [ ] Automatic session creation on first visit
- [ ] updatePersona() function created
- [ ] addConversationMessage() function created
- [ ] getConversationHistory() function created
- [ ] recordPersonaSignal() function created
- [ ] clearSession() function created
- [ ] Database sync on session updates
- [ ] All functions properly typed

**Key Functions:**
1. **getSession()**: Get or create session
2. **updatePersona()**: Update persona scores
3. **addConversationMessage()**: Save message to DB
4. **recordPersonaSignal()**: Track persona detection

**Technical Notes:**
- File: `lib/session/session.ts`
- Use: iron-session + Supabase admin client
- Auto-save: To database on updates

**Subtasks:**
- **BEV-014-1:** Implement getSession()
- **BEV-014-2:** Add session creation logic
- **BEV-014-3:** Implement updatePersona()
- **BEV-014-4:** Implement addConversationMessage()
- **BEV-014-5:** Implement getConversationHistory()
- **BEV-014-6:** Implement recordPersonaSignal()
- **BEV-014-7:** Implement clearSession()
- **BEV-014-8:** Add database sync logic
- **BEV-014-9:** Test all functions

---

## EPIC 4: Basic AI Integration (OpenAI)
**Epic Key:** BEV-EPIC-004
**Epic Name:** OpenAI Chat Integration
**Description:** Integrate OpenAI GPT-4o for basic chat responses before adding persona detection.

---

### Story 4.1: Create Basic System Prompts
**Story Key:** BEV-015
**Story Name:** Design Initial System Prompts for BevGenie
**Story Points:** 3
**Priority:** High
**Dependencies:** BEV-001

**Description:**
Create basic system prompts that define BevGenie's behavior and response style.

**Acceptance Criteria:**
- [ ] Base system prompt created
- [ ] BevGenie personality defined
- [ ] Response guidelines included
- [ ] Beverage industry context added
- [ ] Tone and style specified
- [ ] Prompt exported as constant

**Prompt Content:**
- Role: AI assistant for beverage industry
- Personality: Professional, knowledgeable, helpful
- Focus: Data-driven insights
- Style: Clear, actionable recommendations

**Technical Notes:**
- File: `lib/ai/prompts/system.ts`
- Export: BASE_SYSTEM_PROMPT constant
- Keep: Simple for now (personalization comes later)

**Subtasks:**
- **BEV-015-1:** Define BevGenie personality
- **BEV-015-2:** Write base system prompt
- **BEV-015-3:** Add industry context
- **BEV-015-4:** Define response format
- **BEV-015-5:** Export as constant

---

### Story 4.2: Create Basic Chat API Endpoint
**Story Key:** BEV-016
**Story Name:** Implement POST /api/chat with OpenAI
**Story Points:** 8
**Priority:** Highest
**Dependencies:** BEV-015, BEV-014

**Description:**
Create chat API endpoint that processes messages using OpenAI GPT-4o and manages sessions.

**Acceptance Criteria:**
- [ ] POST /api/chat route created
- [ ] Request validation implemented
- [ ] Session creation/retrieval working
- [ ] OpenAI API integration functional
- [ ] Conversation history maintained
- [ ] Messages saved to database
- [ ] Error handling implemented
- [ ] Response properly formatted

**API Flow:**
1. Validate request
2. Get/create session
3. Load conversation history
4. Call OpenAI GPT-4o
5. Save response to DB
6. Return formatted response

**Technical Notes:**
- File: `app/api/chat/route.ts`
- Model: gpt-4o
- Temperature: 0.7
- Max tokens: 300

**Subtasks:**
- **BEV-016-1:** Create route file structure
- **BEV-016-2:** Implement request validation
- **BEV-016-3:** Add session management
- **BEV-016-4:** Integrate OpenAI SDK
- **BEV-016-5:** Add conversation history loading
- **BEV-016-6:** Implement message saving
- **BEV-016-7:** Add error handling
- **BEV-016-8:** Format response object
- **BEV-016-9:** Test with various inputs

---

### Story 4.3: Create GET Session Info Endpoint
**Story Key:** BEV-017
**Story Name:** Implement GET /api/chat for Session Retrieval
**Story Points:** 3
**Priority:** Medium
**Dependencies:** BEV-016

**Description:**
Create GET endpoint to retrieve current session information for debugging and UI updates.

**Acceptance Criteria:**
- [ ] GET /api/chat route created
- [ ] Returns current session data
- [ ] Returns conversation history
- [ ] Returns persona state
- [ ] Handles missing session gracefully
- [ ] Properly formatted response

**Response Format:**
```json
{
  "sessionId": "uuid",
  "messageCount": 0,
  "persona": {...},
  "messages": [...]
}
```

**Technical Notes:**
- File: `app/api/chat/route.ts` (GET handler)
- Use: getSession() and getConversationHistory()
- For: Debugging and UI state sync

**Subtasks:**
- **BEV-017-1:** Create GET handler
- **BEV-017-2:** Load session data
- **BEV-017-3:** Load conversation history
- **BEV-017-4:** Format response
- **BEV-017-5:** Add error handling

---

## EPIC 5: UI Components & Basic Chat Interface
**Epic Key:** BEV-EPIC-005
**Epic Name:** User Interface Components
**Description:** Build reusable UI components and basic chat interface (initially with mock data).

---

### Story 5.1: Create Theme Provider
**Story Key:** BEV-018
**Story Name:** Setup Dark Theme Provider Component
**Story Points:** 2
**Priority:** High
**Dependencies:** BEV-003

**Description:**
Create theme provider component for consistent dark theme across the application.

**Acceptance Criteria:**
- [ ] ThemeProvider component created
- [ ] Dark theme enabled by default
- [ ] Theme persistence implemented
- [ ] Provider wraps app layout
- [ ] Theme toggle support added
- [ ] No flash of wrong theme

**Technical Notes:**
- File: `components/theme-provider.tsx`
- Library: next-themes
- Default: Dark theme
- Storage: localStorage

**Subtasks:**
- **BEV-018-1:** Create ThemeProvider component
- **BEV-018-2:** Configure next-themes
- **BEV-018-3:** Add to root layout
- **BEV-018-4:** Test theme switching

---

### Story 5.2: Create Global Navigation
**Story Key:** BEV-019
**Story Name:** Build Navigation Header Component
**Story Points:** 5
**Priority:** High
**Dependencies:** BEV-018

**Description:**
Create responsive navigation header with logo, links, and mobile menu.

**Acceptance Criteria:**
- [ ] Navigation component created
- [ ] BevGenie logo/branding added
- [ ] Navigation links (Home, About, Genie)
- [ ] Mobile hamburger menu
- [ ] Sticky header behavior
- [ ] Active link indicators
- [ ] Smooth transitions
- [ ] Responsive design

**Navigation Links:**
- Home (/)
- About (/about)
- Try BevGenie (/genie)

**Technical Notes:**
- File: `components/navigation.tsx`
- Use: next/link for routing
- Sticky: top-0 with backdrop blur
- Mobile: Hamburger menu for < 768px

**Subtasks:**
- **BEV-019-1:** Create Navigation component
- **BEV-019-2:** Add logo and branding
- **BEV-019-3:** Add navigation links
- **BEV-019-4:** Implement mobile menu
- **BEV-019-5:** Add sticky behavior
- **BEV-019-6:** Style with Tailwind
- **BEV-019-7:** Test responsiveness

---

### Story 5.3: Create Homepage Marketing Sections
**Story Key:** BEV-020
**Story Name:** Build Homepage Components (Hero, Challenges, Solutions)
**Story Points:** 8
**Priority:** High
**Dependencies:** BEV-019

**Description:**
Create homepage marketing sections explaining BevGenie's value proposition.

**Acceptance Criteria:**
- [ ] Hero component created with CTA
- [ ] Challenges section explaining pain points
- [ ] Solutions section showing BevGenie benefits
- [ ] Data-Powered section explaining AI
- [ ] All sections responsive
- [ ] Smooth animations
- [ ] Professional B2B design
- [ ] Links to /genie working

**Sections:**
1. **Hero**: Value prop + "Try BevGenie" CTA
2. **Challenges**: Industry pain points
3. **Solutions**: How BevGenie addresses them
4. **Data-Powered**: AI technology explanation

**Technical Notes:**
- Files: `components/hero.tsx`, `components/challenges.tsx`, `components/solutions.tsx`, `components/data-powered.tsx`
- Design: Dark theme with cyan accents
- Animations: Fade-in on scroll

**Subtasks:**
- **BEV-020-1:** Create Hero component
- **BEV-020-2:** Create Challenges component
- **BEV-020-3:** Create Solutions component
- **BEV-020-4:** Create Data-Powered component
- **BEV-020-5:** Add animations
- **BEV-020-6:** Implement responsive design
- **BEV-020-7:** Test all CTAs

---

### Story 5.4: Create Homepage
**Story Key:** BEV-021
**Story Name:** Assemble Homepage from Marketing Components
**Story Points:** 3
**Priority:** High
**Dependencies:** BEV-020

**Description:**
Compose homepage by integrating all marketing section components.

**Acceptance Criteria:**
- [ ] Homepage created at /
- [ ] All sections integrated
- [ ] Proper section ordering
- [ ] Smooth scrolling between sections
- [ ] Footer added
- [ ] Navigation works
- [ ] Responsive on all devices
- [ ] Production-ready

**Page Structure:**
```
<Navigation />
<Hero />
<Challenges />
<Solutions />
<DataPowered />
<Footer />
```

**Technical Notes:**
- File: `app/page.tsx`
- Layout: Stacked sections
- Spacing: Consistent vertical rhythm

**Subtasks:**
- **BEV-021-1:** Create app/page.tsx
- **BEV-021-2:** Import all components
- **BEV-021-3:** Arrange sections
- **BEV-021-4:** Add footer
- **BEV-021-5:** Test navigation flow

---

### Story 5.5: Create About Page
**Story Key:** BEV-022
**Story Name:** Build About Page
**Story Points:** 3
**Priority:** Low
**Dependencies:** BEV-019

**Description:**
Create simple about page with company/product information.

**Acceptance Criteria:**
- [ ] About page created
- [ ] Mission statement included
- [ ] Technology overview added
- [ ] Contact information provided
- [ ] Consistent with brand design
- [ ] Responsive layout

**Technical Notes:**
- File: `app/about/page.tsx`
- Content: Company info, mission, tech stack
- Design: Simple, informational

**Subtasks:**
- **BEV-022-1:** Create about page structure
- **BEV-022-2:** Write content
- **BEV-022-3:** Style with brand theme
- **BEV-022-4:** Test responsiveness

---

### Story 5.6: Create Footer Component
**Story Key:** BEV-023
**Story Name:** Build Global Footer Component
**Story Points:** 2
**Priority:** Low
**Dependencies:** BEV-019

**Description:**
Create footer component with branding and navigation links.

**Acceptance Criteria:**
- [ ] Footer component created
- [ ] BevGenie branding included
- [ ] Links to key pages
- [ ] Responsive design
- [ ] Consistent styling
- [ ] Added to all pages

**Technical Notes:**
- File: `components/footer.tsx`
- Content: Minimal, non-intrusive
- Use: In all page layouts

**Subtasks:**
- **BEV-023-1:** Create Footer component
- **BEV-023-2:** Add branding
- **BEV-023-3:** Add navigation links
- **BEV-023-4:** Style component
- **BEV-023-5:** Add to layouts

---

### Story 5.7: Create /genie Landing Page
**Story Key:** BEV-024
**Story Name:** Build BevGenie Interactive Landing Page
**Story Points:** 13
**Priority:** Highest
**Dependencies:** BEV-021

**Description:**
Create comprehensive /genie landing page that explains capabilities and provides interactive entry points.

**Acceptance Criteria:**
- [ ] Landing page created at /genie
- [ ] Hero with "Meet BevGenie" heading
- [ ] "What is BevGenie?" section with 4 cards
- [ ] Use case section with 3 cards
- [ ] Quick start section with example questions
- [ ] Animated background elements
- [ ] All buttons trigger chat (to be wired later)
- [ ] Dark theme with cyan accents
- [ ] Fully responsive
- [ ] Smooth animations

**Key Sections:**
1. **Hero**: "Meet BevGenie - Your AI Business Partner"
2. **What is BevGenie**: 4 capability cards (Intelligence, Personalization, Visual, Learning)
3. **Use Cases**: 3 cards (Territory Intelligence, ROI Optimization, Strategic Planning)
4. **Quick Start**: 5 example questions

**Design Elements:**
- Animated gradient backgrounds
- Glassmorphism cards
- Hover effects
- Pulse animations
- Cyan (#00C8FF) highlights

**Technical Notes:**
- File: `app/genie/page.tsx`
- Initially: Buttons don't do anything (chat integration comes later)
- Condition: Only show when pageHistory.length === 0

**Subtasks:**
- **BEV-024-1:** Create page structure
- **BEV-024-2:** Build hero section
- **BEV-024-3:** Create "What is BevGenie" section
- **BEV-024-4:** Build use case cards
- **BEV-024-5:** Create quick start section
- **BEV-024-6:** Add animated backgrounds
- **BEV-024-7:** Implement responsive design
- **BEV-024-8:** Add placeholder click handlers
- **BEV-024-9:** Test on all devices

---

### Story 5.8: Create Chat Bubble Component (UI Only)
**Story Key:** BEV-025
**Story Name:** Build Chat Interface UI Component
**Story Points:** 8
**Priority:** Highest
**Dependencies:** BEV-024

**Description:**
Create chat bubble UI component with expand/collapse, message display, and input field (no API integration yet).

**Acceptance Criteria:**
- [ ] ChatBubble component created
- [ ] Floating position (bottom-right)
- [ ] Expand/collapse functionality
- [ ] Message input field
- [ ] Send button
- [ ] Message bubble components (user/assistant)
- [ ] Scroll to latest message
- [ ] Loading state UI
- [ ] Character count indicator
- [ ] Enter key to send
- [ ] Mock message display working

**UI States:**
- Collapsed: Small bubble with icon
- Expanded: Full chat panel
- Loading: Disabled input with spinner
- Empty: Welcome message

**Technical Notes:**
- File: `components/genie/chat-bubble.tsx`
- Initially: Show mock messages
- Fixed: bottom-4 right-4
- Max height: 600px with scroll

**Subtasks:**
- **BEV-025-1:** Create ChatBubble component structure
- **BEV-025-2:** Implement expand/collapse
- **BEV-025-3:** Build message input
- **BEV-025-4:** Create message bubble components
- **BEV-025-5:** Add message display area
- **BEV-025-6:** Implement scroll behavior
- **BEV-025-7:** Add loading states
- **BEV-025-8:** Add keyboard shortcuts
- **BEV-025-9:** Test with mock data

---

### Story 5.9: Create Loading Screen Component
**Story Key:** BEV-026
**Story Name:** Build Visual Loading Experience Component
**Story Points:** 5
**Priority:** Medium
**Dependencies:** BEV-024

**Description:**
Create full-screen loading overlay that displays during AI generation.

**Acceptance Criteria:**
- [ ] LoadingScreen component created
- [ ] Full-screen overlay
- [ ] Progress bar with percentage
- [ ] Stage-based progress text
- [ ] BevGenie branding
- [ ] Animated elements
- [ ] Query display
- [ ] Smooth fade in/out transitions
- [ ] Backdrop blur effect

**Progress Stages:**
- Init (5%)
- Intent (15%)
- Signals (35%)
- Knowledge (55%)
- Response (75%)
- Page (90%)
- Complete (100%)

**Technical Notes:**
- File: `components/genie/loading-screen.tsx`
- Position: fixed with z-50
- Backdrop: blur-md
- Initially: Static progress (SSE integration later)

**Subtasks:**
- **BEV-026-1:** Create component structure
- **BEV-026-2:** Build progress bar
- **BEV-026-3:** Add stage text display
- **BEV-026-4:** Add BevGenie branding
- **BEV-026-5:** Implement animations
- **BEV-026-6:** Add transitions
- **BEV-026-7:** Test visibility states

---

### Story 5.10: Connect Chat UI to API
**Story Key:** BEV-027
**Story Name:** Integrate Chat Component with Backend API
**Story Points:** 8
**Priority:** Highest
**Dependencies:** BEV-025, BEV-016

**Description:**
Connect ChatBubble component to POST /api/chat endpoint, replacing mock data with real AI responses.

**Acceptance Criteria:**
- [ ] Chat sends messages to API
- [ ] API responses displayed correctly
- [ ] Loading states work
- [ ] Error handling implemented
- [ ] Conversation history maintained
- [ ] Messages persist in session
- [ ] Input clears after send
- [ ] Scroll to new messages

**Integration Points:**
1. handleSendMessage calls /api/chat
2. Display loading during API call
3. Show AI response in chat
4. Update conversation history
5. Handle errors gracefully

**Technical Notes:**
- Update: `components/genie/chat-bubble.tsx`
- Update: `app/genie/page.tsx` (handleSendMessage)
- Fetch: POST to /api/chat
- Display: Real responses instead of mocks

**Subtasks:**
- **BEV-027-1:** Add API fetch to handleSendMessage
- **BEV-027-2:** Parse API response
- **BEV-027-3:** Display AI message
- **BEV-027-4:** Update loading states
- **BEV-027-5:** Add error handling UI
- **BEV-027-6:** Test end-to-end chat flow
- **BEV-027-7:** Handle edge cases

---

### Story 5.11: Wire Landing Page Questions to Chat
**Story Key:** BEV-028
**Story Name:** Connect Landing Page Questions to Chat System
**Story Points:** 3
**Priority:** High
**Dependencies:** BEV-027

**Description:**
Wire up example questions on /genie landing page to trigger chat messages.

**Acceptance Criteria:**
- [ ] Clicking use case cards triggers chat
- [ ] Clicking quick start questions triggers chat
- [ ] Questions sent to API
- [ ] Landing page hides after first message
- [ ] Generated content displays below
- [ ] Smooth transition

**Technical Notes:**
- Update: `app/genie/page.tsx`
- onClick: Calls handleSendMessage with question text
- Condition: Hide landing when pageHistory.length > 0

**Subtasks:**
- **BEV-028-1:** Add click handlers to use case cards
- **BEV-028-2:** Add click handlers to quick start buttons
- **BEV-028-3:** Call handleSendMessage with question
- **BEV-028-4:** Test all questions
- **BEV-028-5:** Verify landing page hides

---

## EPIC 6: Advanced Persona Detection
**Epic Key:** BEV-EPIC-006
**Epic Name:** Multi-Vector Persona Detection System
**Description:** Implement sophisticated 4-vector persona detection that analyzes user messages and personalizes responses.

---

### Story 6.1: Define Persona Detection Logic
**Story Key:** BEV-029
**Story Name:** Implement Keyword-Based Persona Signal Detection
**Story Points:** 13
**Priority:** High
**Dependencies:** BEV-012

**Description:**
Build persona detection system that analyzes messages for signals across 4 dimensions using keyword matching.

**Acceptance Criteria:**
- [ ] detectPersonaSignals() function created
- [ ] Keyword patterns for all 4 vectors defined
- [ ] Signal strength calculation (weak/medium/strong)
- [ ] Functional role detection (sales, marketing, ops, compliance)
- [ ] Organization type detection (supplier, distributor)
- [ ] Organization size detection (craft, mid-sized, large)
- [ ] Pain point detection (6 categories)
- [ ] Signal confidence scoring
- [ ] Evidence tracking for each signal

**4 Detection Vectors:**
1. **Functional Role**: Keywords for sales, marketing, operations, compliance
2. **Organization Type**: Keywords for supplier vs distributor
3. **Organization Size**: Keywords for craft, mid-sized, large
4. **Pain Points**: Keywords for 6 pain point categories

**Technical Notes:**
- File: `lib/ai/persona-detection.ts`
- Method: Keyword matching with weights
- Returns: Array of detected signals

**Subtasks:**
- **BEV-029-1:** Define keyword patterns
- **BEV-029-2:** Create detectPersonaSignals function
- **BEV-029-3:** Implement functional role detection
- **BEV-029-4:** Implement org type detection
- **BEV-029-5:** Implement org size detection
- **BEV-029-6:** Implement pain point detection
- **BEV-029-7:** Add signal strength calculation
- **BEV-029-8:** Add evidence tracking
- **BEV-029-9:** Test with sample messages

---

### Story 6.2: Implement Persona Score Updates
**Story Key:** BEV-030
**Story Name:** Create Persona Score Update Logic
**Story Points:** 8
**Priority:** High
**Dependencies:** BEV-029

**Description:**
Implement logic to update persona scores based on detected signals with proper weighting.

**Acceptance Criteria:**
- [ ] updatePersonaWithSignals() function created
- [ ] Score updates apply weighted changes
- [ ] Confidence scores update correctly
- [ ] Pain point confidence tracked
- [ ] Historical values maintained
- [ ] Overall confidence calculated
- [ ] Interaction count incremented
- [ ] Score bounds enforced (0.0 - 1.0)

**Update Logic:**
- Strong signal: +0.3 to score
- Medium signal: +0.15 to score
- Weak signal: +0.05 to score
- Max score: 1.0, Min score: 0.0

**Technical Notes:**
- File: `lib/ai/persona-detection.ts`
- Function: updatePersonaWithSignals(persona, signals)
- Returns: Updated PersonaScores object

**Subtasks:**
- **BEV-030-1:** Create updatePersonaWithSignals function
- **BEV-030-2:** Implement weighted score updates
- **BEV-030-3:** Add confidence calculations
- **BEV-030-4:** Track pain point confidence
- **BEV-030-5:** Update historical arrays
- **BEV-030-6:** Calculate overall confidence
- **BEV-030-7:** Test score updates

---

### Story 6.3: Create Persona Classification Helper
**Story Key:** BEV-031
**Story Name:** Implement getPrimaryPersonaClass Function
**Story Points:** 3
**Priority:** Medium
**Dependencies:** BEV-030

**Description:**
Create helper function to classify persona into primary categories based on scores.

**Acceptance Criteria:**
- [ ] getPrimaryPersonaClass() function created
- [ ] Identifies primary user type (supplier/distributor)
- [ ] Identifies primary focus area
- [ ] Identifies top pain points
- [ ] Returns classification object
- [ ] Handles edge cases (no clear primary)

**Classification Output:**
```typescript
{
  userType: 'supplier' | 'distributor' | 'unknown'
  primaryFocus: 'sales' | 'marketing' | 'operations' | 'compliance' | 'unknown'
  topPainPoints: PainPointType[]
  confidence: number
}
```

**Technical Notes:**
- File: `lib/ai/persona-detection.ts`
- Logic: Find highest scoring dimensions
- Use: For personalized prompts

**Subtasks:**
- **BEV-031-1:** Create getPrimaryPersonaClass function
- **BEV-031-2:** Implement user type classification
- **BEV-031-3:** Implement focus area classification
- **BEV-031-4:** Identify top pain points
- **BEV-031-5:** Test classification accuracy

---

### Story 6.4: Create OpenAI Embeddings Helper
**Story Key:** BEV-032
**Story Name:** Implement Embedding Generation Function
**Story Points:** 3
**Priority:** High
**Dependencies:** BEV-002

**Description:**
Create function to generate embeddings using OpenAI's text-embedding-3-small model.

**Acceptance Criteria:**
- [ ] generateEmbedding() function created
- [ ] Uses text-embedding-3-small model
- [ ] Returns 1536-dimensional vector
- [ ] Error handling implemented
- [ ] Retry logic for failures
- [ ] Input text validation

**Technical Notes:**
- File: `lib/ai/embeddings.ts`
- Model: text-embedding-3-small
- Dimensions: 1536
- API: OpenAI Embeddings API

**Subtasks:**
- **BEV-032-1:** Create embeddings file
- **BEV-032-2:** Implement generateEmbedding function
- **BEV-032-3:** Add error handling
- **BEV-032-4:** Add retry logic
- **BEV-032-5:** Test embedding generation

---

### Story 6.5: Implement Knowledge Base Search
**Story Key:** BEV-033
**Story Name:** Create Vector-Based Knowledge Search Function
**Story Points:** 8
**Priority:** High
**Dependencies:** BEV-032, BEV-008

**Description:**
Implement knowledge base search using vector similarity and persona filtering.

**Acceptance Criteria:**
- [ ] searchKnowledgeBase() function created
- [ ] Generates query embeddings
- [ ] Calls match_documents function
- [ ] Filters by persona tags
- [ ] Returns relevant documents
- [ ] Configurable result count
- [ ] Similarity threshold enforced
- [ ] Error handling implemented

**Search Flow:**
1. Generate embedding for query
2. Call match_documents with embedding
3. Filter by persona tags
4. Return top N results

**Technical Notes:**
- File: `lib/ai/knowledge-search.ts`
- Use: Supabase RPC to match_documents
- Default: 5 results, 0.5 threshold

**Subtasks:**
- **BEV-033-1:** Create knowledge-search file
- **BEV-033-2:** Implement searchKnowledgeBase function
- **BEV-033-3:** Add embedding generation
- **BEV-033-4:** Call Supabase RPC
- **BEV-033-5:** Add persona filtering
- **BEV-033-6:** Format results
- **BEV-033-7:** Add error handling
- **BEV-033-8:** Test search functionality

---

### Story 6.6: Create Context Formatting Helpers
**Story Key:** BEV-034
**Story Name:** Implement Knowledge Context Formatters for LLM
**Story Points:** 3
**Priority:** High
**Dependencies:** BEV-033

**Description:**
Create functions to format knowledge base results for LLM consumption.

**Acceptance Criteria:**
- [ ] formatKnowledgeContext() function created
- [ ] getContextForLLM() wrapper function created
- [ ] Context formatted as markdown
- [ ] Document metadata included
- [ ] Source attribution added
- [ ] Token limit awareness

**Technical Notes:**
- File: `lib/ai/knowledge-search.ts`
- Format: Markdown for LLM
- Include: Source, content, relevance

**Subtasks:**
- **BEV-034-1:** Create formatKnowledgeContext function
- **BEV-034-2:** Create getContextForLLM wrapper
- **BEV-034-3:** Add markdown formatting
- **BEV-034-4:** Include metadata
- **BEV-034-5:** Test formatted output

---

### Story 6.7: Create Personalized System Prompts
**Story Key:** BEV-035
**Story Name:** Implement Persona-Aware System Prompt Generation
**Story Points:** 5
**Priority:** High
**Dependencies:** BEV-031, BEV-034

**Description:**
Create function to generate personalized system prompts based on detected persona.

**Acceptance Criteria:**
- [ ] getPersonalizedSystemPrompt() function created
- [ ] Adapts to user type (supplier/distributor)
- [ ] Adapts to focus area
- [ ] Includes relevant pain point guidance
- [ ] Integrates knowledge context
- [ ] Professional tone maintained
- [ ] Clear response guidelines

**Prompt Personalization:**
- Base: BevGenie personality
- User type: Supplier vs distributor focus
- Focus area: Sales, marketing, ops, compliance
- Pain points: Specific guidance
- Knowledge: Injected context

**Technical Notes:**
- File: `lib/ai/prompts/system.ts`
- Input: PersonaScores, knowledge context
- Output: Complete system prompt string

**Subtasks:**
- **BEV-035-1:** Create getPersonalizedSystemPrompt function
- **BEV-035-2:** Add user type personalization
- **BEV-035-3:** Add focus area personalization
- **BEV-035-4:** Add pain point guidance
- **BEV-035-5:** Integrate knowledge context
- **BEV-035-6:** Test prompt variations

---

### Story 6.8: Create AI Orchestrator
**Story Key:** BEV-036
**Story Name:** Build AI Orchestration Layer with Persona Integration
**Story Points:** 13
**Priority:** Highest
**Dependencies:** BEV-035, BEV-030, BEV-033

**Description:**
Create central orchestration function that coordinates persona detection, knowledge search, and LLM prompting.

**Acceptance Criteria:**
- [ ] processChat() orchestrator function created
- [ ] Detects persona signals from message
- [ ] Updates persona scores
- [ ] Records signals to database
- [ ] Searches knowledge base
- [ ] Generates personalized prompt
- [ ] Calls OpenAI with context
- [ ] Saves conversation to DB
- [ ] Returns comprehensive response
- [ ] Error handling at each step

**Processing Pipeline:**
1. Detect signals from message
2. Update persona with signals
3. Record signals to DB
4. Search knowledge base
5. Generate personalized prompt
6. Call OpenAI GPT-4o
7. Save conversation
8. Return response with metadata

**Technical Notes:**
- File: `lib/ai/orchestrator.ts`
- Function: processChat(request)
- Returns: ChatResponse with persona updates

**Subtasks:**
- **BEV-036-1:** Create orchestrator file
- **BEV-036-2:** Implement processChat function
- **BEV-036-3:** Integrate persona detection
- **BEV-036-4:** Add knowledge base search
- **BEV-036-5:** Generate personalized prompts
- **BEV-036-6:** Add OpenAI call
- **BEV-036-7:** Save to database
- **BEV-036-8:** Format response
- **BEV-036-9:** Add error handling at each step
- **BEV-036-10:** Test orchestration flow

---

### Story 6.9: Update Chat API to Use Orchestrator
**Story Key:** BEV-037
**Story Name:** Refactor Chat API to Use AI Orchestrator
**Story Points:** 5
**Priority:** Highest
**Dependencies:** BEV-036, BEV-016

**Description:**
Update chat API endpoint to use new orchestrator instead of direct OpenAI calls.

**Acceptance Criteria:**
- [ ] POST /api/chat uses orchestrator
- [ ] Persona updates returned in response
- [ ] Signals detected included in response
- [ ] Knowledge usage tracked
- [ ] Response format maintains compatibility
- [ ] All existing functionality preserved
- [ ] Enhanced with persona data

**API Response (Enhanced):
```json
{
  "success": true,
  "message": "AI response",
  "session": {...},
  "personaUpdated": {...},
  "signalsDetected": [...],
  "knowledgeUsed": 3
}
```

**Technical Notes:**
- File: `app/api/chat/route.ts`
- Replace: Direct OpenAI call with orchestrator
- Add: Persona metadata to response

**Subtasks:**
- **BEV-037-1:** Import orchestrator
- **BEV-037-2:** Replace OpenAI call
- **BEV-037-3:** Update response format
- **BEV-037-4:** Add persona data to response
- **BEV-037-5:** Test enhanced API
- **BEV-037-6:** Verify backward compatibility

---

### Story 6.10: Populate Knowledge Base with Content
**Story Key:** BEV-038
**Story Name:** Create and Upload Knowledge Base Documents
**Story Points:** 13
**Priority:** Medium
**Dependencies:** BEV-032, BEV-006

**Description:**
Create domain content and populate knowledge base with embeddings and proper tagging.

**Acceptance Criteria:**
- [ ] 50+ knowledge documents created
- [ ] Documents cover all 6 pain points
- [ ] Documents tagged with persona categories
- [ ] Embeddings generated for all
- [ ] Documents inserted into database
- [ ] Source attribution included
- [ ] Vector search returns relevant results
- [ ] Content verified for quality

**Content Coverage:**
- Pain points: All 6 categories
- User types: Supplier, distributor
- Focus areas: Sales, marketing, ops, compliance
- Content types: Best practices, case studies, guides

**Technical Notes:**
- Create: content in markdown or JSON
- Generate: Embeddings via OpenAI
- Insert: Into knowledge_base table
- Tag: With appropriate persona_tags and pain_point_tags

**Subtasks:**
- **BEV-038-1:** Research beverage industry content
- **BEV-038-2:** Write 50+ documents
- **BEV-038-3:** Create insertion script
- **BEV-038-4:** Generate embeddings
- **BEV-038-5:** Tag documents
- **BEV-038-6:** Insert into database
- **BEV-038-7:** Test vector search
- **BEV-038-8:** Verify result quality

---

## EPIC 7: Dynamic UI Generation System
**Epic Key:** BEV-EPIC-007
**Epic Name:** AI-Powered Dynamic Page Generation (Claude)
**Description:** Implement Claude-powered system to generate interactive marketing pages based on user queries.

---

### Story 7.1: Define Page Specification Types
**Story Key:** BEV-039
**Story Name:** Create TypeScript Types for Dynamic Pages
**Story Points:** 8
**Priority:** High
**Dependencies:** BEV-001

**Description:**
Define comprehensive TypeScript interfaces for all dynamic page types and their sections.

**Acceptance Criteria:**
- [ ] BevGeniePage interface defined
- [ ] 10+ page type enums created
- [ ] Section types for all variations defined
- [ ] MetricCard, CTA, Navigation types defined
- [ ] Support for nested content structures
- [ ] All types fully documented
- [ ] Type safety across system

**Page Types:**
1. solution_brief
2. feature_showcase
3. roi_calculator
4. territory_analysis
5. comparison_matrix
6. strategic_roadmap
7. case_study
8. product_demo
9. pricing_options
10. integration_guide

**Section Types:**
- Hero, MetricGrid, FeatureList
- BenefitCallouts, ROICalculator
- DataVisualization, CTASection

**Technical Notes:**
- File: `lib/ai/page-specs.ts`
- Export: All interfaces
- Include: JSDoc documentation

**Subtasks:**
- **BEV-039-1:** Define BevGeniePage interface
- **BEV-039-2:** Define page type enum
- **BEV-039-3:** Define section types
- **BEV-039-4:** Define MetricCard type
- **BEV-039-5:** Define CTA and Navigation types
- **BEV-039-6:** Add JSDoc documentation
- **BEV-039-7:** Export all types

---

### Story 7.2: Create Intent Classification
**Story Key:** BEV-040
**Story Name:** Implement Message Intent Classifier
**Story Points:** 5
**Priority:** High
**Dependencies:** BEV-039

**Description:**
Build intent classification to determine appropriate page type from user message.

**Acceptance Criteria:**
- [ ] classifyMessageIntent() function created
- [ ] Intent categories defined
- [ ] Confidence scoring implemented
- [ ] Page type suggestions provided
- [ ] Conversation context considered
- [ ] Persona-aware classification

**Intent → Page Type Mapping:**
- Exploratory → solution_brief
- Problem-specific → feature_showcase
- Data request → territory_analysis
- ROI question → roi_calculator
- Comparison → comparison_matrix

**Technical Notes:**
- File: `lib/ai/intent-classification.ts`
- Method: Keyword-based with scoring
- Returns: Intent, confidence, suggested page type

**Subtasks:**
- **BEV-040-1:** Define intent categories
- **BEV-040-2:** Create classification function
- **BEV-040-3:** Implement keyword matching
- **BEV-040-4:** Add confidence scoring
- **BEV-040-5:** Map intents to page types
- **BEV-040-6:** Test classification

---

### Story 7.3: Create Page Generation Prompts
**Story Key:** BEV-041
**Story Name:** Design System Prompts for Each Page Type
**Story Points:** 8
**Priority:** High
**Dependencies:** BEV-039

**Description:**
Create detailed system prompts for Claude to generate each page type with proper structure.

**Acceptance Criteria:**
- [ ] Base page generation prompt created
- [ ] Specific prompts for each of 10 page types
- [ ] JSON schema included in prompts
- [ ] Examples provided in prompts
- [ ] Persona context integration defined
- [ ] Knowledge context integration defined
- [ ] Output validation criteria specified

**Prompt Content:**
- Role: Page generator
- Task: Create structured JSON
- Schema: Full BevGeniePage structure
- Context: User message, persona, knowledge
- Output: Valid JSON matching schema

**Technical Notes:**
- File: `lib/ai/prompts/page-generation.ts`
- One prompt per page type
- Include: JSON examples

**Subtasks:**
- **BEV-041-1:** Create base page generation prompt
- **BEV-041-2:** Create solution_brief prompt
- **BEV-041-3:** Create feature_showcase prompt
- **BEV-041-4:** Create roi_calculator prompt
- **BEV-041-5:** Create territory_analysis prompt
- **BEV-041-6:** Create remaining page type prompts
- **BEV-041-7:** Add JSON schema to each
- **BEV-041-8:** Test prompt quality

---

### Story 7.4: Implement Claude Page Generator
**Story Key:** BEV-042
**Story Name:** Build Page Generation Function with Claude API
**Story Points:** 13
**Priority:** Highest
**Dependencies:** BEV-041

**Description:**
Implement page generator function that calls Claude to create dynamic page specifications.

**Acceptance Criteria:**
- [ ] generatePageSpec() function created
- [ ] Anthropic Claude SDK integrated
- [ ] Calls claude-sonnet-4-5 model
- [ ] Accepts user message, persona, knowledge context
- [ ] Returns structured page specification
- [ ] JSON parsing and validation
- [ ] Error handling and retries
- [ ] Generation time < 5 seconds
- [ ] Success rate > 95%

**Generation Flow:**
1. Build prompt with context
2. Call Claude with structured output
3. Parse JSON response
4. Validate against schema
5. Return typed page spec

**Technical Notes:**
- File: `lib/ai/page-generator.ts`
- Model: claude-sonnet-4-5
- Temperature: 0.7
- Max tokens: 4096

**Subtasks:**
- **BEV-042-1:** Create page-generator file
- **BEV-042-2:** Integrate Anthropic SDK
- **BEV-042-3:** Implement generatePageSpec function
- **BEV-042-4:** Build context prompt
- **BEV-042-5:** Call Claude API
- **BEV-042-6:** Parse JSON response
- **BEV-042-7:** Validate page spec
- **BEV-042-8:** Add error handling
- **BEV-042-9:** Add retry logic
- **BEV-042-10:** Test all page types
- **BEV-042-11:** Optimize performance

---

### Story 7.5: Integrate Page Generation into Orchestrator
**Story Key:** BEV-043
**Story Name:** Add Page Generation to AI Orchestrator
**Story Points:** 8
**Priority:** Highest
**Dependencies:** BEV-042, BEV-040, BEV-036

**Description:**
Integrate page generation into orchestrator so every message generates a page.

**Acceptance Criteria:**
- [ ] Intent classification added to orchestrator
- [ ] Page generation triggered for every message
- [ ] Page spec returned with response
- [ ] Generation errors handled gracefully
- [ ] Fallback page type when intent unclear
- [ ] Performance maintained (< 5s total)

**Orchestrator Updates:**
- Add: Intent classification step
- Add: Page generation step
- Return: generatedPage in response

**Technical Notes:**
- File: `lib/ai/orchestrator.ts`
- Always generate: Page for every query
- Default: solution_brief if intent unclear

**Subtasks:**
- **BEV-043-1:** Add intent classification to pipeline
- **BEV-043-2:** Add page generation step
- **BEV-043-3:** Integrate with existing flow
- **BEV-043-4:** Update return type
- **BEV-043-5:** Add error handling
- **BEV-043-6:** Test with various queries
- **BEV-043-7:** Measure performance impact

---

### Story 7.6: Update Chat API to Return Pages
**Story Key:** BEV-044
**Story Name:** Enhance Chat API to Include Generated Pages
**Story Points:** 3
**Priority:** Highest
**Dependencies:** BEV-043

**Description:**
Update chat API to include generated page in response.

**Acceptance Criteria:**
- [ ] API response includes generatedPage field
- [ ] Page only included if generation successful
- [ ] Response format backward compatible
- [ ] Error logged if page generation fails
- [ ] Chat still works if page generation fails

**Updated Response:**
```json
{
  "success": true,
  "message": "AI text response",
  "session": {...},
  "generatedPage": {
    "page": {...},
    "intent": "exploratory",
    "intentConfidence": 0.85
  }
}
```

**Technical Notes:**
- File: `app/api/chat/route.ts`
- Add: generatedPage to response
- Graceful degradation: If page gen fails

**Subtasks:**
- **BEV-044-1:** Update response format
- **BEV-044-2:** Add generatedPage field
- **BEV-044-3:** Handle missing page gracefully
- **BEV-044-4:** Test with page generation
- **BEV-044-5:** Test without page generation

---

### Story 7.7: Create Dynamic Content Renderer
**Story Key:** BEV-045
**Story Name:** Build Component to Render Dynamic Page Specs
**Story Points:** 21
**Priority:** Highest
**Dependencies:** BEV-039

**Description:**
Create comprehensive rendering system that converts page specs into beautiful UI components.

**Acceptance Criteria:**
- [ ] DynamicContent component created
- [ ] Renders all 10 page types
- [ ] Section renderers for all section types
- [ ] MetricCard component with animations
- [ ] FeatureList component
- [ ] BenefitCallouts component
- [ ] ROICalculator interactive component
- [ ] CTA buttons with click handlers
- [ ] Responsive design on all devices
- [ ] Smooth animations and transitions
- [ ] Professional B2B design
- [ ] Back to home button

**Component Architecture:**
```
<DynamicContent spec={page}>
  <HeroSection />
  <MetricGrid />
  <FeatureList />
  <BenefitCallouts />
  <ROICalculator />
  <CTASection />
</DynamicContent>
```

**Technical Notes:**
- File: `components/genie/dynamic-content.tsx`
- Props: specification (BevGeniePage)
- Design: Dark theme, cyan accents, glassmorphism
- Animations: Fade-in, slide-up

**Subtasks:**
- **BEV-045-1:** Create DynamicContent component
- **BEV-045-2:** Implement HeroSection renderer
- **BEV-045-3:** Create MetricGrid component
- **BEV-045-4:** Build FeatureList renderer
- **BEV-045-5:** Create BenefitCallouts renderer
- **BEV-045-6:** Build ROICalculator component
- **BEV-045-7:** Create CTASection renderer
- **BEV-045-8:** Add navigation handlers
- **BEV-045-9:** Implement responsive design
- **BEV-045-10:** Add animations
- **BEV-045-11:** Style all components
- **BEV-045-12:** Test all page types

---

### Story 7.8: Implement Vertical Page Stacking
**Story Key:** BEV-046
**Story Name:** Create Infinite Vertical Canvas Architecture
**Story Points:** 8
**Priority:** Highest
**Dependencies:** BEV-045, BEV-027

**Description:**
Implement page stacking where landing page stays at top and generated pages append below.

**Acceptance Criteria:**
- [ ] pageHistory state manages all pages
- [ ] Landing page never removed
- [ ] New pages append to history array
- [ ] Each page in separate section
- [ ] Smooth scroll to new page
- [ ] Back to home scrolls to top
- [ ] Unique IDs for each page
- [ ] Page refs for scroll targeting

**Architecture:**
```
<div id="infinite-canvas">
  {showLandingPage && <LandingPage />}
  {pageHistory.map(page =>
    <DynamicContent key={page.id} spec={page.content} />
  )}
</div>
```

**Technical Notes:**
- File: `app/genie/page.tsx`
- State: pageHistory: PageHistoryItem[]
- Scroll: useRef + scrollIntoView
- Condition: Landing shows when pageHistory empty

**Subtasks:**
- **BEV-046-1:** Add pageHistory state
- **BEV-046-2:** Update handleSendMessage to append pages
- **BEV-046-3:** Render all pages in history
- **BEV-046-4:** Implement scroll to latest
- **BEV-046-5:** Add back to home handler
- **BEV-046-6:** Test with multiple pages

---

### Story 7.9: Connect UI to Page Generation
**Story Key:** BEV-047
**Story Name:** Display Generated Pages in UI
**Story Points:** 5
**Priority:** Highest
**Dependencies:** BEV-046, BEV-044

**Description:**
Update frontend to receive generated pages from API and display them.

**Acceptance Criteria:**
- [ ] Frontend parses generatedPage from API
- [ ] Page added to pageHistory
- [ ] DynamicContent renders page
- [ ] Landing page hides after first page
- [ ] Loading screen shows during generation
- [ ] Smooth transition to new page
- [ ] Error handling if page missing

**Technical Notes:**
- File: `app/genie/page.tsx`
- Parse: response.generatedPage
- Add: To pageHistory state
- Show: Loading during fetch

**Subtasks:**
- **BEV-047-1:** Parse generatedPage from response
- **BEV-047-2:** Add to pageHistory
- **BEV-047-3:** Trigger DynamicContent render
- **BEV-047-4:** Show/hide landing page
- **BEV-047-5:** Test page display
- **BEV-047-6:** Handle missing page

---

### Story 7.10: Implement SSE Streaming
**Story Key:** BEV-048
**Story Name:** Create SSE Endpoint for Real-Time Progress
**Story Points:** 13
**Priority:** High
**Dependencies:** BEV-043

**Description:**
Build Server-Sent Events endpoint to stream progress updates during page generation.

**Acceptance Criteria:**
- [ ] /api/chat/stream endpoint created
- [ ] Uses Web Streams API
- [ ] Broadcasts progress stages
- [ ] Streams text response
- [ ] Sends complete page spec
- [ ] Proper SSE event formatting
- [ ] Error handling
- [ ] Connection cleanup

**SSE Events:**
```
data: {"stageId": "init", ...}
data: {"stageId": "intent", ...}
data: {"stageId": "knowledge", ...}
data: {"text": "chunk..."}
data: {"page": {...}}
data: {"stageId": "complete"}
```

**Technical Notes:**
- File: `app/api/chat/stream/route.ts`
- Format: Server-Sent Events
- Content-Type: text/event-stream
- Use: Web Streams API

**Subtasks:**
- **BEV-048-1:** Create streaming route
- **BEV-048-2:** Set up SSE headers
- **BEV-048-3:** Implement Web Streams
- **BEV-048-4:** Broadcast progress stages
- **BEV-048-5:** Stream text chunks
- **BEV-048-6:** Send page specification
- **BEV-048-7:** Add error handling
- **BEV-048-8:** Test streaming

---

### Story 7.11: Connect UI to SSE Stream
**Story Key:** BEV-049
**Story Name:** Update Frontend to Consume SSE Events
**Story Points:** 8
**Priority:** High
**Dependencies:** BEV-048, BEV-026

**Description:**
Update frontend to consume SSE stream and update loading screen with progress.

**Acceptance Criteria:**
- [ ] Frontend opens SSE connection
- [ ] Parses SSE events
- [ ] Updates loading screen progress
- [ ] Receives text chunks
- [ ] Receives page specification
- [ ] Handles connection errors
- [ ] Closes connection properly

**Technical Notes:**
- File: `app/genie/page.tsx`
- API: EventSource or fetch with streaming
- Update: Loading screen component with progress

**Subtasks:**
- **BEV-049-1:** Open SSE connection
- **BEV-049-2:** Parse event stream
- **BEV-049-3:** Update loading progress
- **BEV-049-4:** Collect text chunks
- **BEV-049-5:** Receive page spec
- **BEV-049-6:** Handle errors
- **BEV-049-7:** Close connection
- **BEV-049-8:** Test streaming flow

---

### Story 7.12: Implement Navigation Click Handlers
**Story Key:** BEV-050
**Story Name:** Add CTA Click Handling for Page Navigation
**Story Points:** 5
**Priority:** Medium
**Dependencies:** BEV-047

**Description:**
Implement click handlers for CTA buttons within generated pages to trigger new page generation.

**Acceptance Criteria:**
- [ ] CTA clicks trigger new generation
- [ ] Context passed to API (source, original query)
- [ ] New page generated and appended
- [ ] Navigation clicks are silent (no chat message)
- [ ] Smooth scrolling to new page

**Technical Notes:**
- File: `app/genie/page.tsx`
- Handler: handleNavigationClick
- Call: handleSendMessage with isNavigationClick=true

**Subtasks:**
- **BEV-050-1:** Create handleNavigationClick function
- **BEV-050-2:** Pass to DynamicContent
- **BEV-050-3:** Wire up CTA buttons
- **BEV-050-4:** Add context tracking
- **BEV-050-5:** Test navigation flow

---

### Story 7.13: Implement Smart Chat UX
**Story Key:** BEV-051
**Story Name:** Add Silent Navigation vs Text Response Logic
**Story Points:** 3
**Priority:** Medium
**Dependencies:** BEV-050

**Description:**
Implement logic to differentiate direct questions (show text) from navigation clicks (silent).

**Acceptance Criteria:**
- [ ] Direct questions show text response in chat
- [ ] Navigation clicks don't add chat messages
- [ ] Both generate pages
- [ ] isNavigationClick parameter used correctly
- [ ] User experience is smooth for both flows

**Technical Notes:**
- File: `app/genie/page.tsx`
- Parameter: isNavigationClick in handleSendMessage
- Behavior: Conditional chat message adding

**Subtasks:**
- **BEV-051-1:** Add isNavigationClick parameter
- **BEV-051-2:** Implement conditional chat updates
- **BEV-051-3:** Test direct questions
- **BEV-051-4:** Test navigation clicks
- **BEV-051-5:** Verify UX for both

---

## EPIC 8: Advanced Features
**Epic Key:** BEV-EPIC-008
**Epic Name:** Session Tracking & Presentation Generation
**Description:** Add premium features like session tracking and PowerPoint generation.

---

### Story 8.1: Create Session Tracker Class
**Story Key:** BEV-052
**Story Name:** Implement SessionTracker for Journey Analysis
**Story Points:** 5
**Priority:** Medium
**Dependencies:** BEV-012

**Description:**
Build SessionTracker class to monitor user journey and track queries for presentation generation.

**Acceptance Criteria:**
- [ ] SessionTracker class created
- [ ] trackQuery() method implemented
- [ ] updateLastQuery() method implemented
- [ ] getSessionSummary() method implemented
- [ ] Tracks queries, solutions, timestamps
- [ ] Integration with persona scores

**Technical Notes:**
- File: `lib/session/session-tracker.ts`
- Purpose: Track journey for presentations
- State: In-memory per session

**Subtasks:**
- **BEV-052-1:** Create SessionTracker class
- **BEV-052-2:** Implement trackQuery
- **BEV-052-3:** Implement updateLastQuery
- **BEV-052-4:** Implement getSessionSummary
- **BEV-052-5:** Test tracking

---

### Story 8.2: Integrate Session Tracker
**Story Key:** BEV-053
**Story Name:** Add Session Tracking to Genie Page
**Story Points:** 3
**Priority:** Medium
**Dependencies:** BEV-052, BEV-047

**Description:**
Integrate SessionTracker into /genie page to track all user interactions.

**Acceptance Criteria:**
- [ ] SessionTracker initialized on page load
- [ ] Queries tracked on send
- [ ] Solutions tracked on response
- [ ] Tracker state maintained in session

**Technical Notes:**
- File: `app/genie/page.tsx`
- Create: On component mount
- Update: On each interaction

**Subtasks:**
- **BEV-053-1:** Initialize tracker
- **BEV-053-2:** Track queries
- **BEV-053-3:** Track solutions
- **BEV-053-4:** Test tracking flow

---

### Story 8.3: Create Presentation Generator
**Story Key:** BEV-054
**Story Name:** Build PowerPoint Generation Function
**Story Points:** 13
**Priority:** Medium
**Dependencies:** BEV-052

**Description:**
Implement PowerPoint presentation generator using pptxgenjs and Claude for content.

**Acceptance Criteria:**
- [ ] generatePresentation() function created
- [ ] Uses Claude to generate slide content
- [ ] Creates slides with pptxgenjs
- [ ] Professional slide design
- [ ] BevGenie branding
- [ ] Multiple slide types (title, bullets, metrics)
- [ ] Persona-aware content
- [ ] Download functionality

**Presentation Structure:**
1. Title slide (personalized)
2. Session summary
3. Solutions overview
4. Key metrics
5. Next steps
6. Contact/CTA

**Technical Notes:**
- File: `lib/presentation/generator.ts`
- Library: pptxgenjs v4.x
- AI: Claude for content generation

**Subtasks:**
- **BEV-054-1:** Create generator file
- **BEV-054-2:** Design slide templates
- **BEV-054-3:** Implement title slide
- **BEV-054-4:** Implement content slides
- **BEV-054-5:** Add Claude content generation
- **BEV-054-6:** Add BevGenie branding
- **BEV-054-7:** Test generation
- **BEV-054-8:** Add download function

---

### Story 8.4: Create Presentation Bubble UI
**Story Key:** BEV-055
**Story Name:** Build Presentation Generation Button
**Story Points:** 5
**Priority:** Medium
**Dependencies:** BEV-054

**Description:**
Create floating button UI for presentation generation.

**Acceptance Criteria:**
- [ ] PresentationBubble component created
- [ ] Floating button positioned properly
- [ ] Click triggers presentation generation
- [ ] Loading state during generation
- [ ] Auto-download on completion
- [ ] Error handling

**Technical Notes:**
- File: `components/genie/presentation-bubble.tsx`
- Position: Fixed, near chat bubble
- Trigger: generatePresentation

**Subtasks:**
- **BEV-055-1:** Create component
- **BEV-055-2:** Add button UI
- **BEV-055-3:** Wire to generator
- **BEV-055-4:** Add loading state
- **BEV-055-5:** Test generation flow

---

### Story 8.5: Integrate Presentation Feature
**Story Key:** BEV-056
**Story Name:** Add Presentation Bubble to Genie Page
**Story Points:** 3
**Priority:** Medium
**Dependencies:** BEV-055, BEV-053

**Description:**
Integrate PresentationBubble into /genie page with session tracker.

**Acceptance Criteria:**
- [ ] PresentationBubble added to page
- [ ] Receives session tracker as prop
- [ ] Only shows after 3+ interactions
- [ ] Generates presentation on click
- [ ] Downloads PPTX file

**Technical Notes:**
- File: `app/genie/page.tsx`
- Conditional: Show after messageCount > 2
- Pass: SessionTracker instance

**Subtasks:**
- **BEV-056-1:** Add to page
- **BEV-056-2:** Pass session tracker
- **BEV-056-3:** Add visibility logic
- **BEV-056-4:** Test end-to-end

---

## EPIC 9: Deployment & Production
**Epic Key:** BEV-EPIC-009
**Epic Name:** Production Deployment & Optimization
**Description:** Deploy to Vercel and set up production monitoring.

---

### Story 9.1: Configure Environment for Production
**Story Key:** BEV-057
**Story Name:** Setup Production Environment Variables
**Story Points:** 3
**Priority:** Highest
**Dependencies:** BEV-004

**Description:**
Configure all environment variables for production deployment.

**Acceptance Criteria:**
- [ ] All variables documented
- [ ] Production keys obtained
- [ ] Variables ready for Vercel
- [ ] Validation added
- [ ] No secrets in code

**Technical Notes:**
- List all required vars
- Generate production keys
- Document for Vercel setup

**Subtasks:**
- **BEV-057-1:** List all env vars
- **BEV-057-2:** Generate production keys
- **BEV-057-3:** Document each variable
- **BEV-057-4:** Prepare for Vercel

---

### Story 9.2: Create Vercel Project
**Story Key:** BEV-058
**Story Name:** Setup Vercel Deployment
**Story Points:** 5
**Priority:** Highest
**Dependencies:** BEV-057

**Description:**
Create Vercel project and configure deployment settings.

**Acceptance Criteria:**
- [ ] Vercel project created
- [ ] GitHub repository linked
- [ ] Environment variables configured
- [ ] Build settings optimized
- [ ] Preview deployments enabled
- [ ] Production domain configured
- [ ] First deployment successful

**Technical Notes:**
- Platform: vercel.com
- Framework preset: Next.js
- Node version: 20.x

**Subtasks:**
- **BEV-058-1:** Create Vercel account/project
- **BEV-058-2:** Link GitHub repository
- **BEV-058-3:** Configure environment variables
- **BEV-058-4:** Set build settings
- **BEV-058-5:** Deploy to production
- **BEV-058-6:** Test production deployment

---

### Story 9.3: Enable Vercel Analytics
**Story Key:** BEV-059
**Story Name:** Integrate Vercel Analytics
**Story Points:** 2
**Priority:** Medium
**Dependencies:** BEV-058

**Description:**
Enable Vercel Analytics for monitoring and performance tracking.

**Acceptance Criteria:**
- [ ] Vercel Analytics enabled
- [ ] Analytics component added
- [ ] Production metrics visible
- [ ] Page views tracked
- [ ] Performance data collected

**Technical Notes:**
- Package: @vercel/analytics
- File: `app/layout.tsx`
- Auto-tracks: Page views, Web Vitals

**Subtasks:**
- **BEV-059-1:** Install @vercel/analytics
- **BEV-059-2:** Add to root layout
- **BEV-059-3:** Verify tracking in dashboard

---

### Story 9.4: Optimize Bundle Size
**Story Key:** BEV-060
**Story Name:** Analyze and Optimize Bundle Size
**Story Points:** 5
**Priority:** Medium
**Dependencies:** BEV-058

**Description:**
Analyze bundle and optimize for performance.

**Acceptance Criteria:**
- [ ] Bundle analyzed
- [ ] Large dependencies identified
- [ ] Code splitting implemented where beneficial
- [ ] Tree-shaking verified
- [ ] Bundle size reduced by 20%+

**Technical Notes:**
- Tool: @next/bundle-analyzer
- Target: < 300KB first load JS

**Subtasks:**
- **BEV-060-1:** Install bundle analyzer
- **BEV-060-2:** Analyze bundle
- **BEV-060-3:** Identify large deps
- **BEV-060-4:** Implement optimizations
- **BEV-060-5:** Measure improvement

---

### Story 9.5: Setup Error Monitoring
**Story Key:** BEV-061
**Story Name:** Integrate Error Tracking (Optional)
**Story Points:** 5
**Priority:** Low
**Dependencies:** BEV-058

**Description:**
Set up error monitoring for production (Sentry or similar).

**Acceptance Criteria:**
- [ ] Error tracking service selected
- [ ] SDK integrated
- [ ] Client errors captured
- [ ] Server errors captured
- [ ] User context included
- [ ] Alerts configured

**Technical Notes:**
- Consider: Sentry, LogRocket, or Vercel's built-in
- Capture: Client and server errors

**Subtasks:**
- **BEV-061-1:** Choose service
- **BEV-061-2:** Install SDK
- **BEV-061-3:** Configure client tracking
- **BEV-061-4:** Configure server tracking
- **BEV-061-5:** Test error capture

---

## EPIC 10: Testing & Quality Assurance
**Epic Key:** BEV-EPIC-010
**Epic Name:** Comprehensive Testing Suite
**Description:** Implement testing for critical functionality.

---

### Story 10.1: Setup Testing Framework
**Story Key:** BEV-062
**Story Name:** Configure Jest and Testing Library
**Story Points:** 3
**Priority:** Medium
**Dependencies:** BEV-001

**Description:**
Set up testing framework and configuration.

**Acceptance Criteria:**
- [ ] Jest installed and configured
- [ ] React Testing Library installed
- [ ] Test scripts added to package.json
- [ ] Sample test created and passing
- [ ] Coverage reporting configured

**Technical Notes:**
- Framework: Jest + React Testing Library
- Config: jest.config.js
- Run: npm test

**Subtasks:**
- **BEV-062-1:** Install testing dependencies
- **BEV-062-2:** Configure Jest
- **BEV-062-3:** Add test scripts
- **BEV-062-4:** Create sample test
- **BEV-062-5:** Verify tests run

---

### Story 10.2: Write API Tests
**Story Key:** BEV-063
**Story Name:** Create Test Suite for API Endpoints
**Story Points:** 8
**Priority:** Medium
**Dependencies:** BEV-062, BEV-037

**Description:**
Write comprehensive tests for chat API endpoints.

**Acceptance Criteria:**
- [ ] Tests for POST /api/chat
- [ ] Tests for GET /api/chat
- [ ] Valid input tests
- [ ] Invalid input tests
- [ ] Error handling tests
- [ ] Mock external APIs
- [ ] 80%+ code coverage

**Technical Notes:**
- Mock: Supabase, OpenAI, Anthropic
- Test: Various scenarios
- Run: npm test

**Subtasks:**
- **BEV-063-1:** Create test file
- **BEV-063-2:** Setup mocks
- **BEV-063-3:** Write success case tests
- **BEV-063-4:** Write error case tests
- **BEV-063-5:** Write edge case tests
- **BEV-063-6:** Generate coverage report

---

### Story 10.3: Write Component Tests
**Story Key:** BEV-064
**Story Name:** Create Tests for Key Components
**Story Points:** 8
**Priority:** Low
**Dependencies:** BEV-062, BEV-047

**Description:**
Write tests for critical UI components.

**Acceptance Criteria:**
- [ ] Tests for ChatBubble
- [ ] Tests for DynamicContent
- [ ] Tests for LoadingScreen
- [ ] Interaction tests
- [ ] Snapshot tests
- [ ] Accessibility tests

**Technical Notes:**
- Library: React Testing Library
- Test: User interactions
- Check: Accessibility

**Subtasks:**
- **BEV-064-1:** Test ChatBubble
- **BEV-064-2:** Test DynamicContent
- **BEV-064-3:** Test LoadingScreen
- **BEV-064-4:** Add interaction tests
- **BEV-064-5:** Add snapshot tests
- **BEV-064-6:** Run a11y tests

---

### Story 10.4: E2E Testing (Optional)
**Story Key:** BEV-065
**Story Name:** Setup End-to-End Tests with Playwright
**Story Points:** 13
**Priority:** Low
**Dependencies:** BEV-058

**Description:**
Set up E2E testing framework and write critical flow tests.

**Acceptance Criteria:**
- [ ] Playwright installed
- [ ] Configuration complete
- [ ] Test: Landing to first chat
- [ ] Test: Multiple interactions
- [ ] Test: Page generation
- [ ] Tests run in CI/CD

**Technical Notes:**
- Framework: Playwright
- Env: Test against staging
- Run: npm run e2e

**Subtasks:**
- **BEV-065-1:** Install Playwright
- **BEV-065-2:** Configure tests
- **BEV-065-3:** Write user flow tests
- **BEV-065-4:** Add to CI/CD
- **BEV-065-5:** Run tests

---

## Summary Statistics

**Total Epics:** 10
**Total Stories:** 65
**Estimated Story Points:** 421

### Epic Breakdown (Chronological):
1. **Epic 1 (Initialization):** 4 stories, 10 points
2. **Epic 2 (Database):** 7 stories, 36 points
3. **Epic 3 (Sessions):** 3 stories, 13 points
4. **Epic 4 (Basic AI):** 3 stories, 14 points
5. **Epic 5 (UI Components):** 11 stories, 68 points
6. **Epic 6 (Persona):** 10 stories, 83 points
7. **Epic 7 (Dynamic UI):** 13 stories, 115 points
8. **Epic 8 (Advanced):** 5 stories, 29 points
9. **Epic 9 (Deployment):** 5 stories, 20 points
10. **Epic 10 (Testing):** 4 stories, 29 points

---

## Implementation Roadmap

### Week 1: Foundation
- Epic 1: Project setup (BEV-001 to BEV-004)
- Epic 2: Database setup (BEV-005 to BEV-011)

### Week 2: Sessions & Basic AI
- Epic 3: Session management (BEV-012 to BEV-014)
- Epic 4: OpenAI integration (BEV-015 to BEV-017)

### Weeks 3-4: UI & Basic Chat
- Epic 5: All UI components (BEV-018 to BEV-028)
- Working chat with AI responses

### Weeks 5-6: Advanced Persona
- Epic 6: Complete persona system (BEV-029 to BEV-038)
- Personalized responses

### Weeks 7-9: Dynamic UI Generation
- Epic 7: Claude integration and rendering (BEV-039 to BEV-051)
- Full dynamic page generation

### Week 10: Advanced Features
- Epic 8: Presentations and tracking (BEV-052 to BEV-056)

### Week 11: Production
- Epic 9: Deployment and optimization (BEV-057 to BEV-061)

### Week 12: Testing
- Epic 10: Test suite (BEV-062 to BEV-065)

---

## Dependency Chain

Each ticket lists dependencies that MUST be completed first. Follow the order strictly:

**Critical Path:** BEV-001 → BEV-002 → BEV-003 → BEV-005 → BEV-006 → ... → BEV-058

**Parallel Work Possible:**
- After BEV-003: Can work on BEV-004 and BEV-012 in parallel
- After BEV-021: Can work on BEV-022, BEV-023 in parallel
- After BEV-036: Can work on both Epic 6 and Epic 7 setup

---

**Document Version:** 3.0 (True Chronological with Dependencies)
**Last Updated:** 2025-01-31
**Status:** Production Ready - Follow BEV-001 through BEV-065
**Guarantee:** Following this order will result in working application at every step
