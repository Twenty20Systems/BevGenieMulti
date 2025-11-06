# Session Management System - Visual Documentation

## System Overview

The Session Management System provides secure, encrypted, stateful user sessions using Iron Session, maintaining user context, persona data, and conversation history across requests without requiring authentication.

---

## Technical Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY STACK                             │
└─────────────────────────────────────────────────────────────────┘

Primary Library: iron-session v8.0.4
  • Encrypted session cookies
  • Server-side session management
  • No authentication required
  • Password-based encryption (AES-256-GCM)

Storage Layers:
  1. Iron Session (Cookie) - Client-side encrypted storage
  2. Supabase PostgreSQL - Server-side persistence

Database Client: @supabase/supabase-js v2.76.1
  • PostgreSQL with Row-Level Security
  • Real-time capabilities
  • Vector search support

UUID Generation: uuid v13.0.0
  • Unique session identifiers
  • RFC4122 compliant

Next.js Integration:
  • Server Components
  • API Routes
  • Middleware support
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                SESSION MANAGEMENT ARCHITECTURE                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────┐
│   CLIENT    │
│  (Browser)  │
└─────────────┘
      │
      │ HTTP Request
      ▼
┌─────────────────────────────────────────────────┐
│  Next.js Server                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ API Route / Server Component              │ │
│  └───────────────────────────────────────────┘ │
│         │                                       │
│         │ getSession()                          │
│         ▼                                       │
│  ┌───────────────────────────────────────────┐ │
│  │  Iron Session Middleware                  │ │
│  │  File: lib/session/config.ts              │ │
│  │  ┌─────────────────────────────────────┐ │ │
│  │  │ Encryption: AES-256-GCM             │ │ │
│  │  │ Cookie: bevgenie_session            │ │ │
│  │  │ Password: from SESSION_PASSWORD env │ │ │
│  │  │ TTL: 24 hours (86400 seconds)       │ │ │
│  │  └─────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────┘ │
│         │                                       │
│         ├─> Check cookie exists?                │
│         │   └─> YES: Decrypt & return           │
│         │   └─> NO: Create new session          │
│         │                                       │
│         ▼                                       │
│  ┌───────────────────────────────────────────┐ │
│  │  Session Data Object                      │ │
│  │  {                                        │ │
│  │    user: {                                │ │
│  │      sessionId: UUID                      │ │
│  │      persona: PersonaScores               │ │
│  │      messageCount: number                 │ │
│  │      ...                                  │ │
│  │    }                                      │ │
│  │  }                                        │ │
│  └───────────────────────────────────────────┘ │
│         │                                       │
│         ├─> Update lastActivityAt              │
│         ├─> Save to cookie (encrypted)         │
│         │                                       │
│         └─> Save to database ────────┐         │
│                                       │         │
└───────────────────────────────────────┼─────────┘
                                        │
                                        ▼
┌────────────────────────────────────────────────┐
│  Supabase PostgreSQL Database                  │
│  ┌──────────────────────────────────────────┐ │
│  │  Table: user_personas                    │ │
│  │  ┌────────────────────────────────────┐ │ │
│  │  │ session_id (PK)                    │ │ │
│  │  │ persona scores (all vectors)       │ │ │
│  │  │ pain_points_detected               │ │ │
│  │  │ overall_confidence                 │ │ │
│  │  │ total_interactions                 │ │ │
│  │  │ last_updated                       │ │ │
│  │  └────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────┐ │
│  │  Table: conversation_history             │ │
│  │  ┌────────────────────────────────────┐ │ │
│  │  │ session_id (FK)                    │ │ │
│  │  │ message_role (user/assistant)      │ │ │
│  │  │ message_content                    │ │ │
│  │  │ persona_snapshot                   │ │ │
│  │  │ created_at                         │ │ │
│  │  └────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA FLOW                                  │
└─────────────────────────────────────────────────────────────────┘

USER REQUEST
    │
    │ GET /api/chat or POST /api/chat
    ▼
┌──────────────────────────────────────┐
│ Next.js API Route                    │
│ app/api/chat/route.ts                │
└──────────────────────────────────────┘
    │
    │ import { getSession }
    ▼
┌──────────────────────────────────────┐
│ getSession()                         │
│ lib/session/session.ts               │
└──────────────────────────────────────┘
    │
    ├─> Read cookies from request
    ├─> Call getIronSession()
    │
    ▼
┌──────────────────────────────────────┐
│ Iron Session                         │
│ Decrypts cookie if exists            │
└──────────────────────────────────────┘
    │
    ├─ Cookie exists? ─┐
    │                  │
    YES               NO
    │                  │
    │                  ▼
    │         ┌────────────────────┐
    │         │ Create New Session │
    │         ├────────────────────┤
    │         │ sessionId: uuidv4()│
    │         │ createdAt: now()   │
    │         │ persona: defaults  │
    │         │ messageCount: 0    │
    │         └────────────────────┘
    │                  │
    │                  ├─> Save to cookie
    │                  ├─> Save to database
    │                  │
    ▼                  ▼
┌──────────────────────────────────────┐
│ Session Data Object                  │
│ {                                    │
│   user: {                            │
│     sessionId: string                │
│     createdAt: timestamp             │
│     lastActivityAt: timestamp        │
│     persona: PersonaScores           │
│     messageCount: number             │
│     currentMode: string              │
│     ...                              │
│   }                                  │
│ }                                    │
└──────────────────────────────────────┘
    │
    ├─> Update lastActivityAt
    ├─> session.save()  (encrypt & set cookie)
    │
    └─> saveSessionToDatabase() ────────┐
                                        │
                                        ▼
                            ┌───────────────────────┐
                            │ Supabase INSERT/UPDATE│
                            │ user_personas table   │
                            └───────────────────────┘
```

---

## Session Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                  SESSION LIFECYCLE                              │
└─────────────────────────────────────────────────────────────────┘

1. CREATION (First Visit)
   ┌─────────────────────────────────────────┐
   │ User visits site (no cookie)            │
   │ ↓                                       │
   │ getSession() called                     │
   │ ↓                                       │
   │ No session.user found                   │
   │ ↓                                       │
   │ Create new session:                     │
   │   • sessionId: uuidv4()                 │
   │   • createdAt: Date.now()               │
   │   • persona: DEFAULT_PERSONA_SCORES     │
   │   • messageCount: 0                     │
   │ ↓                                       │
   │ Save to database                        │
   │ ↓                                       │
   │ Encrypt & set cookie                    │
   │ ↓                                       │
   │ Return session object                   │
   └─────────────────────────────────────────┘

2. ACTIVE USE (Subsequent Requests)
   ┌─────────────────────────────────────────┐
   │ User interacts (cookie present)         │
   │ ↓                                       │
   │ getSession() called                     │
   │ ↓                                       │
   │ Decrypt cookie                          │
   │ ↓                                       │
   │ Load session.user                       │
   │ ↓                                       │
   │ Update lastActivityAt                   │
   │ ↓                                       │
   │ Process request (update persona, etc.)  │
   │ ↓                                       │
   │ session.save() - re-encrypt cookie      │
   │ ↓                                       │
   │ Update database                         │
   └─────────────────────────────────────────┘

3. EXPIRATION (After 24 hours)
   ┌─────────────────────────────────────────┐
   │ Cookie expires (TTL reached)            │
   │ ↓                                       │
   │ Next request has no cookie              │
   │ ↓                                       │
   │ Treated as new user                     │
   │ ↓                                       │
   │ New session created                     │
   │                                         │
   │ NOTE: Database record persists          │
   │       for analytics                     │
   └─────────────────────────────────────────┘

4. MANUAL CLEAR (Logout)
   ┌─────────────────────────────────────────┐
   │ clearSession() called                   │
   │ ↓                                       │
   │ session.destroy()                       │
   │ ↓                                       │
   │ Cookie removed                          │
   │                                         │
   │ NOTE: Database record preserved         │
   └─────────────────────────────────────────┘
```

---

## Session Data Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                 SESSION DATA SCHEMA                             │
└─────────────────────────────────────────────────────────────────┘

TypeScript Interface (lib/session/types.ts):

interface IronSessionData {
  user?: SessionData;
}

interface SessionData {
  // Identity
  sessionId: string;                    // UUID v4
  userId?: string;                      // Optional user ID if auth added later

  // Timestamps
  createdAt: number;                    // Unix timestamp (ms)
  lastActivityAt: number;               // Unix timestamp (ms)
  lastMessageAt?: number;               // Last message timestamp

  // Persona Data (Multi-dimensional scores)
  persona: PersonaScores;

  // Conversation State
  messageCount: number;                 // Total messages sent
  lastMessage?: string;                 // Last message content

  // Generation Mode
  currentMode: 'fresh' | 'returning' | 'data_connected';

  // Feature Flags
  hasCompletedOnboarding: boolean;
  hasBrochure: boolean;
  isDataConnected: boolean;

  // Brochure Reference
  lastGeneratedBrochureId?: string;
  lastBrochureGeneratedAt?: number;
}

interface PersonaScores {
  // 4-Vector Detection System
  detection_vectors: {
    functional_role: string | null;
    functional_role_confidence: number;
    functional_role_history: DetectionHistory[];

    org_type: string | null;
    org_type_confidence: number;
    org_type_history: DetectionHistory[];

    org_size: string | null;
    org_size_confidence: number;
    org_size_history: DetectionHistory[];

    product_focus: string | null;
    product_focus_confidence: number;
    product_focus_history: DetectionHistory[];

    vectors_updated_at: number;
  };

  // Functional Role Scores (0.0 - 1.0)
  sales_focus_score: number;
  marketing_focus_score: number;
  operations_focus_score: number;
  compliance_focus_score: number;

  // Organization Type Scores (0.0 - 1.0)
  supplier_score: number;
  distributor_score: number;

  // Organization Size Scores (0.0 - 1.0)
  craft_score: number;
  mid_sized_score: number;
  large_score: number;

  // Pain Points
  pain_points_detected: PainPointType[];
  pain_points_confidence: Record<PainPointType, number>;

  // Metadata
  overall_confidence: number;
  total_interactions: number;
}

Default Values (lib/session/types.ts):

const DEFAULT_PERSONA_SCORES: PersonaScores = {
  detection_vectors: {
    functional_role: null,
    functional_role_confidence: 0,
    functional_role_history: [],
    org_type: null,
    org_type_confidence: 0,
    org_type_history: [],
    org_size: null,
    org_size_confidence: 0,
    org_size_history: [],
    product_focus: null,
    product_focus_confidence: 0,
    product_focus_history: [],
    vectors_updated_at: 0,
  },
  supplier_score: 0,
  distributor_score: 0,
  craft_score: 0,
  mid_sized_score: 0,
  large_score: 0,
  sales_focus_score: 0,
  marketing_focus_score: 0,
  operations_focus_score: 0,
  compliance_focus_score: 0,
  pain_points_detected: [],
  pain_points_confidence: {},
  overall_confidence: 0,
  total_interactions: 0,
};
```

---

## Configuration Details

```
┌─────────────────────────────────────────────────────────────────┐
│              IRON SESSION CONFIGURATION                         │
└─────────────────────────────────────────────────────────────────┘

File: lib/session/config.ts

import { SessionOptions } from 'iron-session';

export const sessionConfig: SessionOptions = {
  // Cookie Name
  cookieName: 'bevgenie_session',

  // Encryption Password (REQUIRED)
  // Must be at least 32 characters
  // Stored in environment variable: SESSION_PASSWORD
  password: process.env.SESSION_PASSWORD!,

  // Cookie Options
  cookieOptions: {
    // Session duration: 24 hours
    maxAge: 60 * 60 * 24,           // 86400 seconds

    // Security flags
    httpOnly: true,                  // Prevents JavaScript access
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'lax',                // CSRF protection

    // Path
    path: '/',                       // Available site-wide
  },

  // TTL: Automatically expires after maxAge
  ttl: 60 * 60 * 24,                // 24 hours in seconds
};

Environment Variable (.env.local):
┌────────────────────────────────────────────────┐
│ SESSION_PASSWORD=<32+ character random string> │
│                                                │
│ Example generation:                            │
│ node -e "console.log(require('crypto')        │
│   .randomBytes(32).toString('base64'))"       │
│                                                │
│ Result: "aB3dF8gH2jK5mN7pQ9rS1tU4vW6xY0zA..."│
└────────────────────────────────────────────────┘
```

---

## API Functions

```
┌─────────────────────────────────────────────────────────────────┐
│                    SESSION API FUNCTIONS                        │
└─────────────────────────────────────────────────────────────────┘

File: lib/session/session.ts

┌──────────────────────────────────────────────────┐
│ 1. getSession()                                  │
├──────────────────────────────────────────────────┤
│ Purpose: Get or create current session          │
│ Returns: Promise<IronSessionData>               │
│                                                  │
│ Behavior:                                        │
│ • Reads encrypted cookie                        │
│ • Creates new session if none exists            │
│ • Updates lastActivityAt                        │
│ • Saves to cookie and database                  │
│                                                  │
│ Usage:                                           │
│   const session = await getSession();          │
│   console.log(session.user?.sessionId);        │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 2. updatePersona(updates)                        │
├──────────────────────────────────────────────────┤
│ Purpose: Update persona scores                  │
│ Params: Partial<PersonaScores>                  │
│ Returns: Promise<PersonaScores>                 │
│                                                  │
│ Behavior:                                        │
│ • Merges updates with existing persona          │
│ • Recalculates overall_confidence               │
│ • Increments interaction count                  │
│ • Saves to session and database                 │
│                                                  │
│ Usage:                                           │
│   await updatePersona({                         │
│     sales_focus_score: 0.85,                    │
│     pain_points_detected: ['execution_blind']   │
│   });                                            │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 3. addConversationMessage(role, content, mode)   │
├──────────────────────────────────────────────────┤
│ Purpose: Save message to conversation history   │
│ Params:                                          │
│   • role: 'user' | 'assistant'                  │
│   • content: string                             │
│   • mode: generation mode (optional)            │
│   • uiSpecification: page spec (optional)       │
│ Returns: Promise<void>                          │
│                                                  │
│ Behavior:                                        │
│ • Inserts into conversation_history table       │
│ • Includes persona snapshot                     │
│ • Updates session lastMessage fields            │
│                                                  │
│ Usage:                                           │
│   await addConversationMessage(                 │
│     'user',                                      │
│     'How can you help?',                        │
│     'fresh'                                      │
│   );                                             │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 4. getConversationHistory()                      │
├──────────────────────────────────────────────────┤
│ Purpose: Retrieve all messages for session      │
│ Returns: Promise<ConversationMessage[]>         │
│                                                  │
│ Behavior:                                        │
│ • Queries conversation_history by session_id    │
│ • Orders by created_at ASC                      │
│ • Returns array of messages                     │
│                                                  │
│ Usage:                                           │
│   const history = await                         │
│     getConversationHistory();                   │
│   // [{role:'user',content:'...'}, ...]        │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 5. recordPersonaSignal(...)                      │
├──────────────────────────────────────────────────┤
│ Purpose: Record persona detection signal        │
│ Params:                                          │
│   • signalType: string                          │
│   • signalText: string                          │
│   • signalStrength: 'weak'|'medium'|'strong'    │
│   • painPointsInferred: PainPointType[]         │
│   • scoreUpdates: Partial<PersonaScores>        │
│ Returns: Promise<void>                          │
│                                                  │
│ Behavior:                                        │
│ • Updates persona with score changes            │
│ • Inserts audit record into persona_signals     │
│ • Tracks confidence before/after                │
│                                                  │
│ Usage:                                           │
│   await recordPersonaSignal(                    │
│     'pain_point_mention',                       │
│     'We need to prove ROI',                     │
│     'strong',                                    │
│     ['execution_blind_spot'],                   │
│     { sales_focus_score: 0.3 }                  │
│   );                                             │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 6. clearSession()                                │
├──────────────────────────────────────────────────┤
│ Purpose: Destroy current session (logout)       │
│ Returns: Promise<void>                          │
│                                                  │
│ Behavior:                                        │
│ • Calls session.destroy()                       │
│ • Removes cookie from browser                   │
│ • Database record preserved for analytics       │
│                                                  │
│ Usage:                                           │
│   await clearSession();                         │
└──────────────────────────────────────────────────┘
```

---

## Database Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                  DATABASE SCHEMA                                │
└─────────────────────────────────────────────────────────────────┘

Technology: Supabase (PostgreSQL 15+)
Client: @supabase/supabase-js v2.76.1

┌──────────────────────────────────────────────────────────────┐
│ Table: user_personas                                         │
├──────────────────────────────────────────────────────────────┤
│ Purpose: Store persona scores for each session              │
│                                                              │
│ Columns:                                                     │
│  id                    UUID PRIMARY KEY                      │
│  user_id               UUID                                  │
│  session_id            VARCHAR(255) UNIQUE NOT NULL         │
│                                                              │
│  -- Functional Role Scores (0.0-1.0)                        │
│  sales_focus_score     DECIMAL(3,2) DEFAULT 0.0            │
│  marketing_focus_score DECIMAL(3,2) DEFAULT 0.0            │
│  operations_focus_score DECIMAL(3,2) DEFAULT 0.0           │
│  compliance_focus_score DECIMAL(3,2) DEFAULT 0.0           │
│                                                              │
│  -- Organization Type Scores (0.0-1.0)                      │
│  supplier_score        DECIMAL(3,2) DEFAULT 0.0            │
│  distributor_score     DECIMAL(3,2) DEFAULT 0.0            │
│                                                              │
│  -- Organization Size Scores (0.0-1.0)                      │
│  craft_score           DECIMAL(3,2) DEFAULT 0.0            │
│  mid_sized_score       DECIMAL(3,2) DEFAULT 0.0            │
│  large_score           DECIMAL(3,2) DEFAULT 0.0            │
│                                                              │
│  -- Pain Points                                              │
│  pain_points_detected  TEXT[] DEFAULT '{}'                  │
│  pain_points_confidence JSONB DEFAULT '{}'                  │
│                                                              │
│  -- Metadata                                                 │
│  overall_confidence    DECIMAL(3,2) DEFAULT 0.0            │
│  total_interactions    INTEGER DEFAULT 0                    │
│  questions_asked       TEXT[] DEFAULT '{}'                  │
│  last_updated          TIMESTAMPTZ DEFAULT NOW()           │
│  created_at            TIMESTAMPTZ DEFAULT NOW()           │
│                                                              │
│ Indexes:                                                     │
│  idx_up_session_id ON session_id                           │
│  idx_up_user_id ON user_id                                 │
│  idx_up_created_at ON created_at                           │
│                                                              │
│ RLS Policies:                                                │
│  • Users can only read/write their own personas            │
│  • Service role has full access                            │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Table: conversation_history                                  │
├──────────────────────────────────────────────────────────────┤
│ Purpose: Store all chat messages with context               │
│                                                              │
│ Columns:                                                     │
│  id                    UUID PRIMARY KEY                      │
│  session_id            VARCHAR(255) NOT NULL                │
│  user_id               UUID                                  │
│                                                              │
│  message_role          VARCHAR(20) NOT NULL                 │
│  message_content       TEXT NOT NULL                        │
│                                                              │
│  -- Context Snapshot                                         │
│  persona_snapshot      JSONB                                │
│  pain_points_inferred  TEXT[]                               │
│                                                              │
│  -- UI Generation Data                                       │
│  ui_specification      JSONB                                │
│  generation_mode       VARCHAR(50)                          │
│  estimated_read_time   VARCHAR(20)                          │
│                                                              │
│  created_at            TIMESTAMPTZ DEFAULT NOW()           │
│                                                              │
│ Indexes:                                                     │
│  idx_ch_session_messages ON (session_id, created_at)       │
│  idx_ch_user_id ON user_id                                 │
│  idx_ch_generation_mode ON generation_mode                 │
│                                                              │
│ RLS Policies:                                                │
│  • Users can only read/write their own messages            │
│  • Service role has full access                            │
└──────────────────────────────────────────────────────────────┘

Database Save Function (Internal):

async function saveSessionToDatabase(
  sessionData: SessionData
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('user_personas')
    .upsert(
      {
        session_id: sessionData.sessionId,
        user_id: sessionData.userId,
        // ... all persona score columns
        overall_confidence: sessionData.persona.overall_confidence,
        total_interactions: sessionData.persona.total_interactions,
      },
      { onConflict: 'session_id' }
    );

  if (error) {
    console.error('Error saving session:', error);
  }
}
```

---

## Security Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURITY FEATURES                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 1. Cookie Encryption                             │
├──────────────────────────────────────────────────┤
│ • Algorithm: AES-256-GCM                        │
│ • Key: Derived from SESSION_PASSWORD            │
│ • Salt: Unique per session                      │
│ • Cannot be decrypted without password          │
│ • Cannot be tampered with (integrity check)     │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 2. Cookie Security Flags                        │
├──────────────────────────────────────────────────┤
│ • httpOnly: true                                │
│   → JavaScript cannot access cookie             │
│   → XSS protection                              │
│                                                  │
│ • secure: true (production)                     │
│   → Only sent over HTTPS                        │
│   → MITM protection                             │
│                                                  │
│ • sameSite: 'lax'                               │
│   → CSRF protection                             │
│   → Cookie not sent on cross-site requests      │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 3. Automatic Expiration                         │
├──────────────────────────────────────────────────┤
│ • TTL: 24 hours (86400 seconds)                 │
│ • After expiration:                             │
│   → Cookie automatically deleted by browser     │
│   → New session created on next visit           │
│ • Prevents indefinite session persistence       │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 4. Row-Level Security (Database)                │
├──────────────────────────────────────────────────┤
│ • Users can only access their own data          │
│ • Service role (server-side) has full access    │
│ • Policies enforce data isolation               │
│ • Cannot query other users' sessions            │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 5. Server-Side Only Processing                  │
├──────────────────────────────────────────────────┤
│ • Session logic only runs server-side           │
│ • No session data in client JavaScript          │
│ • API keys never exposed to client              │
│ • Cookie handling automatic (browser)           │
└──────────────────────────────────────────────────┘
```

---

## Usage Examples

```
┌─────────────────────────────────────────────────────────────────┐
│                    USAGE EXAMPLES                               │
└─────────────────────────────────────────────────────────────────┘

Example 1: API Route with Session
────────────────────────────────────────────────────
File: app/api/chat/route.ts

import { getSession, updatePersona } from '@/lib/session/session';

export async function POST(request: NextRequest) {
  // Get current session (auto-creates if new)
  const session = await getSession();

  if (!session.user) {
    return NextResponse.json(
      { error: 'Failed to initialize session' },
      { status: 500 }
    );
  }

  // Access session data
  console.log('Session ID:', session.user.sessionId);
  console.log('Message Count:', session.user.messageCount);
  console.log('Current Persona:', session.user.persona);

  // Process request...

  // Update persona after processing
  await updatePersona({
    sales_focus_score: 0.85,
    pain_points_detected: ['execution_blind_spot']
  });

  return NextResponse.json({
    success: true,
    sessionId: session.user.sessionId
  });
}

Example 2: Server Component with Session
────────────────────────────────────────────────────
File: app/dashboard/page.tsx

import { getSession } from '@/lib/session/session';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session.user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Session: {session.user.sessionId}</p>
      <p>Messages: {session.user.messageCount}</p>
      <p>Confidence: {session.user.persona.overall_confidence}</p>
    </div>
  );
}

Example 3: Update Persona After Detection
────────────────────────────────────────────────────
File: lib/ai/orchestrator.ts

import { updatePersona, recordPersonaSignal } from '@/lib/session/session';

// After detecting signals
const signals = detectPersonaSignals(message, currentPersona);

for (const signal of signals) {
  // Record each signal
  await recordPersonaSignal(
    signal.type,
    signal.evidence,
    signal.strength,
    signal.painPointsInferred,
    signal.scoreUpdates
  );
}

// Update overall persona
const updatedPersona = await updatePersona({
  sales_focus_score: newScore,
  overall_confidence: newConfidence
});

Example 4: Add Message to History
────────────────────────────────────────────────────
File: lib/ai/orchestrator.ts

import { addConversationMessage } from '@/lib/session/session';

// Save user message
await addConversationMessage(
  'user',
  userMessage,
  'fresh'
);

// Save assistant response
await addConversationMessage(
  'assistant',
  aiResponse,
  'returning',
  generatedPageSpec  // Optional UI specification
);

Example 5: Retrieve Conversation History
────────────────────────────────────────────────────
File: lib/ai/orchestrator.ts

import { getConversationHistory } from '@/lib/session/session';

const history = await getConversationHistory();

// Format for LLM
const messages = history.map(msg => ({
  role: msg.message_role,
  content: msg.message_content
}));

// Use in API call
const response = await openai.chat.completions.create({
  messages: [
    { role: 'system', content: systemPrompt },
    ...messages,
    { role: 'user', content: newMessage }
  ]
});
```

---

## Usage in Other Systems

```
┌─────────────────────────────────────────────────────────────────┐
│          HOW OTHER SYSTEMS USE SESSION DATA                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Persona Detection System                        │
├──────────────────────────────────────────────────┤
│ Dependencies:                                    │
│ • getSession() - Get current persona            │
│ • updatePersona() - Save updated scores         │
│ • recordPersonaSignal() - Audit trail          │
│                                                  │
│ Flow:                                            │
│ 1. Get current persona from session             │
│ 2. Detect signals from message                  │
│ 3. Update persona scores                        │
│ 4. Save back to session                         │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Dynamic UI Generation System                    │
├──────────────────────────────────────────────────┤
│ Dependencies:                                    │
│ • getSession() - Get persona for personalization│
│ • addConversationMessage() - Save page specs    │
│                                                  │
│ Flow:                                            │
│ 1. Get persona from session                     │
│ 2. Use persona to customize page generation     │
│ 3. Save generated page spec to conversation     │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Knowledge Base System                           │
├──────────────────────────────────────────────────┤
│ Dependencies:                                    │
│ • getSession() - Get persona for filtering      │
│                                                  │
│ Flow:                                            │
│ 1. Get persona from session                     │
│ 2. Extract persona tags (supplier, sales, etc.) │
│ 3. Filter knowledge documents by tags           │
│ 4. Return relevant documents                    │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ AI Orchestrator System                          │
├──────────────────────────────────────────────────┤
│ Dependencies:                                    │
│ • getSession() - Get current state              │
│ • getConversationHistory() - Get chat history   │
│ • updatePersona() - Update after processing     │
│ • addConversationMessage() - Save messages      │
│                                                  │
│ Flow:                                            │
│ 1. Get session and conversation history         │
│ 2. Process message with persona context         │
│ 3. Update persona if signals detected           │
│ 4. Save messages to history                     │
└──────────────────────────────────────────────────┘
```

---

## File References

**Core Files:**
- `lib/session/session.ts` - Main API functions
- `lib/session/types.ts` - TypeScript interfaces
- `lib/session/config.ts` - Iron Session configuration
- `lib/supabase/client.ts` - Database client

**Database:**
- `lib/supabase/migrations.sql` - Schema definitions
- Tables: `user_personas`, `conversation_history`, `persona_signals`

**Dependencies:**
- iron-session v8.0.4
- @supabase/supabase-js v2.76.1
- uuid v13.0.0

---

**Document Version:** 1.0
**Last Updated:** 2025-01-31
**Component:** Session Management System
