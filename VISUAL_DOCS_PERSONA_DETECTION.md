# Persona Detection System - Visual Documentation

## System Overview

The Persona Detection System analyzes user messages to identify their role, company type, pain points, and needs, then continuously updates confidence scores throughout the conversation.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    PERSONA DETECTION SYSTEM                      │
└─────────────────────────────────────────────────────────────────┘

INPUT: User Message
  │
  ├─> "We need to prove ROI from our field sales team"
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 1: Signal Detection                                │
│  File: lib/ai/persona-detection.ts                       │
│  Function: detectPersonaSignals(message, currentPersona) │
└──────────────────────────────────────────────────────────┘
  │
  │ Analyzes message for keywords across 4 vectors:
  │
  ├─> Vector 1: Functional Role
  │   Keywords: "ROI", "field sales", "prove"
  │   → Detected: SALES_FOCUS (strength: STRONG)
  │
  ├─> Vector 2: Organization Type
  │   Keywords: "our", "team"
  │   → Detected: SUPPLIER (strength: MEDIUM)
  │
  ├─> Vector 3: Organization Size
  │   Keywords: "field sales team"
  │   → Detected: MID_SIZED (strength: WEAK)
  │
  └─> Vector 4: Pain Points
      Keywords: "prove", "ROI", "field"
      → Detected: EXECUTION_BLIND_SPOT (strength: STRONG)
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  OUTPUT: Array of Signals                                │
│  [                                                        │
│    {                                                      │
│      type: "functional_focus",                           │
│      category: "sales",                                  │
│      strength: "strong",                                 │
│      evidence: "ROI from field sales",                   │
│      scoreUpdate: { sales_focus_score: +0.3 }           │
│    },                                                     │
│    {                                                      │
│      type: "pain_point",                                 │
│      category: "execution_blind_spot",                   │
│      strength: "strong",                                 │
│      evidence: "prove ROI from field activities",        │
│      scoreUpdate: {                                      │
│        pain_points_detected: ["execution_blind_spot"],  │
│        pain_points_confidence: { execution_blind_spot: +0.3 }
│      }                                                    │
│    }                                                      │
│  ]                                                        │
└──────────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 2: Score Updates                                   │
│  File: lib/ai/persona-detection.ts                       │
│  Function: updatePersonaWithSignals(persona, signals)    │
└──────────────────────────────────────────────────────────┘
  │
  │ Applies weighted score updates:
  │
  ├─> Strong signal: +0.3 to relevant score
  ├─> Medium signal: +0.15 to relevant score
  └─> Weak signal: +0.05 to relevant score
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  UPDATED PERSONA SCORES                                   │
│  {                                                        │
│    // Functional Role (Vector 1)                         │
│    sales_focus_score: 0.65 (was 0.35, +0.3)             │
│    marketing_focus_score: 0.20                           │
│    operations_focus_score: 0.10                          │
│    compliance_focus_score: 0.05                          │
│                                                           │
│    // Organization Type (Vector 2)                       │
│    supplier_score: 0.55 (was 0.40, +0.15)               │
│    distributor_score: 0.30                               │
│                                                           │
│    // Organization Size (Vector 3)                       │
│    craft_score: 0.20                                     │
│    mid_sized_score: 0.45 (was 0.40, +0.05)              │
│    large_score: 0.25                                     │
│                                                           │
│    // Pain Points (Vector 4)                             │
│    pain_points_detected: [                               │
│      "execution_blind_spot"                              │
│    ],                                                     │
│    pain_points_confidence: {                             │
│      execution_blind_spot: 0.85 (was 0.55, +0.3)        │
│    },                                                     │
│                                                           │
│    // Metadata                                            │
│    overall_confidence: 0.68,                             │
│    total_interactions: 3                                 │
│  }                                                        │
└──────────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 3: Session Storage (DEPENDENCY)                    │
│  File: lib/session/session.ts                            │
│  Function: updatePersona(updatedScores)                  │
└──────────────────────────────────────────────────────────┘
  │
  ├─> Saves to Iron Session (encrypted cookie)
  ├─> Saves to Supabase (user_personas table)
  └─> Updates last_activity timestamp
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 4: Signal Recording (DEPENDENCY)                   │
│  File: lib/session/session.ts                            │
│  Function: recordPersonaSignal(...)                      │
└──────────────────────────────────────────────────────────┘
  │
  └─> Saves to Supabase (persona_signals table)
      - Audit trail of all detections
      - Confidence tracking over time
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 5: Classification (Optional)                       │
│  File: lib/ai/persona-detection.ts                       │
│  Function: getPrimaryPersonaClass(persona)               │
└──────────────────────────────────────────────────────────┘
  │
  │ Identifies primary categories:
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  PERSONA CLASSIFICATION                                   │
│  {                                                        │
│    userType: "supplier",         // Highest score        │
│    primaryFocus: "sales",        // Highest score        │
│    topPainPoints: [                                      │
│      "execution_blind_spot"      // Sorted by confidence │
│    ],                                                     │
│    confidence: 0.68                                      │
│  }                                                        │
└──────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                               │
└─────────────────────────────────────────────────────────────────┘

USER MESSAGE
    │
    │ "We need to prove ROI from our field sales team"
    │
    ▼
┌─────────────────┐
│  AI Orchestrator│ (calls persona detection)
│  orchestrator.ts│
└─────────────────┘
    │
    │ GET Current Persona
    ▼
┌─────────────────┐
│  Session Store  │◄─────────┐
│  session.ts     │          │
└─────────────────┘          │
    │                        │
    │ Current PersonaScores  │
    ▼                        │
┌─────────────────┐          │
│ detectPersona   │          │ UPDATE
│ Signals()       │          │ Persona
└─────────────────┘          │
    │                        │
    │ Detected Signals       │
    ▼                        │
┌─────────────────┐          │
│ updatePersona   │          │
│ WithSignals()   │          │
└─────────────────┘          │
    │                        │
    │ Updated PersonaScores  │
    └────────────────────────┘
    │
    ├──────────────────────┐
    │                      │
    ▼                      ▼
┌──────────────┐    ┌─────────────┐
│ Iron Session │    │  Supabase   │
│ (Cookie)     │    │  Database   │
└──────────────┘    └─────────────┘
                         │
                         ├─> user_personas table
                         └─> persona_signals table
```

---

## 4-Vector Detection System

```
┌─────────────────────────────────────────────────────────────────┐
│                    4 DETECTION VECTORS                          │
└─────────────────────────────────────────────────────────────────┘

MESSAGE: "We need to prove ROI from our field sales team"

┌──────────────────────────────────────────────────────────────┐
│ VECTOR 1: FUNCTIONAL ROLE                                     │
├──────────────────────────────────────────────────────────────┤
│ Keywords Detected:                                            │
│  • "ROI" → Sales focus                                       │
│  • "prove" → Sales focus                                     │
│  • "field sales" → Sales focus                               │
│                                                               │
│ Score Updates:                                                │
│  • sales_focus_score: +0.3 (strong signal)                   │
│                                                               │
│ Result:                                                       │
│  sales_focus_score: 0.35 → 0.65 ✓                           │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ VECTOR 2: ORGANIZATION TYPE                                   │
├──────────────────────────────────────────────────────────────┤
│ Keywords Detected:                                            │
│  • "our team" → Supplier indicator                           │
│  • "field sales" → Supplier indicator                        │
│                                                               │
│ Score Updates:                                                │
│  • supplier_score: +0.15 (medium signal)                     │
│                                                               │
│ Result:                                                       │
│  supplier_score: 0.40 → 0.55 ✓                              │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ VECTOR 3: ORGANIZATION SIZE                                   │
├──────────────────────────────────────────────────────────────┤
│ Keywords Detected:                                            │
│  • "field sales team" → Mid-sized company indicator          │
│                                                               │
│ Score Updates:                                                │
│  • mid_sized_score: +0.05 (weak signal)                      │
│                                                               │
│ Result:                                                       │
│  mid_sized_score: 0.40 → 0.45 ✓                             │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ VECTOR 4: PAIN POINTS                                         │
├──────────────────────────────────────────────────────────────┤
│ Keywords Detected:                                            │
│  • "prove" + "ROI" + "field" → Execution blind spot          │
│                                                               │
│ Pain Point Detection:                                         │
│  • execution_blind_spot identified                           │
│                                                               │
│ Confidence Update:                                            │
│  • execution_blind_spot: +0.3 (strong signal)                │
│                                                               │
│ Result:                                                       │
│  pain_points_detected: ["execution_blind_spot"] ✓           │
│  confidence: 0.55 → 0.85 ✓                                   │
└──────────────────────────────────────────────────────────────┘
```

---

## Keyword Matching Engine

```
┌─────────────────────────────────────────────────────────────────┐
│                   KEYWORD PATTERNS                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ FUNCTIONAL ROLE PATTERNS                        │
├─────────────────────────────────────────────────┤
│ Sales Focus:                                    │
│  • ROI, revenue, sales, quota, pipeline        │
│  • conversion, close, deal, account            │
│  • growth, target, territory                   │
│                                                  │
│ Marketing Focus:                                 │
│  • brand, campaign, awareness, positioning     │
│  • market share, competitive, messaging        │
│  • launch, promotion, content                  │
│                                                  │
│ Operations Focus:                                │
│  • efficiency, process, workflow, cost         │
│  • inventory, supply chain, logistics          │
│  • optimization, automation, scale             │
│                                                  │
│ Compliance Focus:                                │
│  • regulation, compliance, legal, audit        │
│  • requirement, policy, certification          │
│  • risk, governance, documentation             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ORGANIZATION TYPE PATTERNS                      │
├─────────────────────────────────────────────────┤
│ Supplier:                                        │
│  • produce, manufacture, brewery, distillery   │
│  • bottle, distribute (our products)           │
│  • brand, recipe, craft                        │
│                                                  │
│ Distributor:                                     │
│  • distribute, warehouse, logistics            │
│  • portfolio, supplier (relationships)         │
│  • delivery, route, territory coverage        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ PAIN POINT PATTERNS                             │
├─────────────────────────────────────────────────┤
│ Execution Blind Spot:                            │
│  • prove, ROI, measure, justify                │
│  • field activities, visibility, tracking      │
│  • effectiveness, impact, results              │
│                                                  │
│ Market Assessment:                               │
│  • opportunity, potential, identify            │
│  • market analysis, territory planning         │
│  • data-driven, insights, intelligence         │
│                                                  │
│ Sales Effectiveness:                             │
│  • sales performance, productivity, efficiency │
│  • conversion rate, pipeline health            │
│  • coaching, training, enablement              │
└─────────────────────────────────────────────────┘
```

---

## Signal Strength Calculation

```
┌─────────────────────────────────────────────────────────────────┐
│                  SIGNAL STRENGTH LOGIC                          │
└─────────────────────────────────────────────────────────────────┘

KEYWORD COUNT in Message
    │
    ├─> 3+ matching keywords → STRONG signal (+0.3)
    ├─> 2 matching keywords → MEDIUM signal (+0.15)
    └─> 1 matching keyword → WEAK signal (+0.05)

Example:
Message: "We need to prove ROI from our field sales team"

Sales Focus Keywords Found:
  ✓ "ROI"
  ✓ "prove"
  ✓ "field sales"
  = 3 keywords → STRONG signal → +0.3 to sales_focus_score

Execution Blind Spot Keywords Found:
  ✓ "prove"
  ✓ "ROI"
  ✓ "field"
  = 3 keywords → STRONG signal → +0.3 to pain point confidence
```

---

## Historical Tracking

```
┌─────────────────────────────────────────────────────────────────┐
│              DETECTION VECTORS (with History)                   │
└─────────────────────────────────────────────────────────────────┘

{
  detection_vectors: {
    // Functional Role
    functional_role: "sales",
    functional_role_confidence: 0.65,
    functional_role_history: [
      { value: "sales", confidence: 0.35, timestamp: 1706745600 },
      { value: "sales", confidence: 0.50, timestamp: 1706745800 },
      { value: "sales", confidence: 0.65, timestamp: 1706746000 }
    ],

    // Organization Type
    org_type: "supplier",
    org_type_confidence: 0.55,
    org_type_history: [
      { value: "supplier", confidence: 0.40, timestamp: 1706745600 },
      { value: "supplier", confidence: 0.55, timestamp: 1706746000 }
    ],

    // Organization Size
    org_size: "mid_sized",
    org_size_confidence: 0.45,
    org_size_history: [
      { value: "mid_sized", confidence: 0.40, timestamp: 1706745600 },
      { value: "mid_sized", confidence: 0.45, timestamp: 1706746000 }
    ],

    // Product Focus (Pain Points)
    product_focus: "execution_blind_spot",
    product_focus_confidence: 0.85,
    product_focus_history: [
      { value: "execution_blind_spot", confidence: 0.55, timestamp: 1706745600 },
      { value: "execution_blind_spot", confidence: 0.85, timestamp: 1706746000 }
    ],

    vectors_updated_at: 1706746000
  }
}
```

---

## Database Storage

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA                              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Table: user_personas                                 │
├──────────────────────────────────────────────────────┤
│ session_id (VARCHAR) PRIMARY KEY                     │
│ user_id (UUID)                                       │
│                                                       │
│ // Vector 1: Functional Role                         │
│ sales_focus_score (DECIMAL 0.0-1.0)                 │
│ marketing_focus_score (DECIMAL 0.0-1.0)             │
│ operations_focus_score (DECIMAL 0.0-1.0)            │
│ compliance_focus_score (DECIMAL 0.0-1.0)            │
│                                                       │
│ // Vector 2: Organization Type                       │
│ supplier_score (DECIMAL 0.0-1.0)                    │
│ distributor_score (DECIMAL 0.0-1.0)                 │
│                                                       │
│ // Vector 3: Organization Size                       │
│ craft_score (DECIMAL 0.0-1.0)                       │
│ mid_sized_score (DECIMAL 0.0-1.0)                   │
│ large_score (DECIMAL 0.0-1.0)                       │
│                                                       │
│ // Vector 4: Pain Points                             │
│ pain_points_detected (TEXT[])                        │
│ pain_points_confidence (JSONB)                       │
│                                                       │
│ // Metadata                                           │
│ overall_confidence (DECIMAL 0.0-1.0)                │
│ total_interactions (INTEGER)                         │
│ last_updated (TIMESTAMPTZ)                           │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│ Table: persona_signals (Audit Trail)                 │
├──────────────────────────────────────────────────────┤
│ id (UUID) PRIMARY KEY                                │
│ session_id (VARCHAR) FOREIGN KEY                     │
│ signal_type (VARCHAR)                                │
│ signal_text (TEXT)                                   │
│ signal_strength (VARCHAR) "weak/medium/strong"      │
│ score_updates (JSONB)                                │
│ pain_points_inferred (TEXT[])                        │
│ confidence_before (DECIMAL)                          │
│ confidence_after (DECIMAL)                           │
│ created_at (TIMESTAMPTZ)                             │
└──────────────────────────────────────────────────────┘
```

---

## Usage in Other Systems

```
┌─────────────────────────────────────────────────────────────────┐
│          HOW OTHER SYSTEMS USE PERSONA DATA                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ AI Orchestrator (orchestrator.ts)        │
├──────────────────────────────────────────┤
│ 1. Detects signals from message          │
│ 2. Updates persona scores                │
│ 3. Uses persona for:                     │
│    • Personalized system prompts         │
│    • Knowledge base filtering            │
│    • Response customization              │
└──────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Knowledge Search (knowledge-search.ts)   │
├──────────────────────────────────────────┤
│ Uses persona to filter documents:        │
│  • supplier_score > 0.5 → "supplier" tag │
│  • sales_focus_score > 0.5 → "sales" tag│
│  • pain_points → filter by pain point   │
└──────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ System Prompts (prompts/system.ts)      │
├──────────────────────────────────────────┤
│ getPersonalizedSystemPrompt(persona):    │
│  • Adapts tone for user type            │
│  • Focuses on relevant pain points      │
│  • Emphasizes relevant solutions         │
└──────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Page Generator (page-generator.ts)      │
├──────────────────────────────────────────┤
│ Uses persona for:                        │
│  • Selecting page type                  │
│  • Customizing content                  │
│  • Highlighting relevant features       │
└──────────────────────────────────────────┘
```

---

## Complete Example Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  END-TO-END EXAMPLE                             │
└─────────────────────────────────────────────────────────────────┘

Interaction 1:
  User: "How can you help our sales team?"

  Signals Detected:
    • sales_focus (weak)
    • supplier (weak)

  Scores After:
    sales_focus_score: 0.05
    supplier_score: 0.05
    overall_confidence: 0.10

Interaction 2:
  User: "We're a craft brewery looking to expand"

  Signals Detected:
    • supplier (strong) - "brewery"
    • craft (strong) - "craft brewery"
    • market_assessment (medium) - "expand"

  Scores After:
    sales_focus_score: 0.05
    supplier_score: 0.35 (+0.3)
    craft_score: 0.30 (+0.3)
    pain_points: ["market_assessment"]
    overall_confidence: 0.42

Interaction 3:
  User: "We need to prove ROI from our field sales team"

  Signals Detected:
    • sales_focus (strong) - "ROI", "sales", "prove"
    • supplier (medium) - "our team"
    • execution_blind_spot (strong) - "prove ROI from field"

  Scores After:
    sales_focus_score: 0.35 (+0.3)
    supplier_score: 0.50 (+0.15)
    craft_score: 0.30
    pain_points: ["market_assessment", "execution_blind_spot"]
    pain_point_confidence: {
      execution_blind_spot: 0.85
    }
    overall_confidence: 0.68

RESULT:
  Primary Classification:
    • User Type: Supplier (craft brewery)
    • Primary Focus: Sales
    • Top Pain Point: Execution blind spot (proving ROI)

  Personalization:
    • Show ROI calculators
    • Focus on field sales effectiveness
    • Highlight measurement solutions
    • Use craft brewery case studies
```

---

## File References

**Core Files:**
- `lib/ai/persona-detection.ts` - Main detection logic
- `lib/session/types.ts` - PersonaScores interface
- `lib/session/session.ts` - Session storage & updates
- `lib/ai/orchestrator.ts` - Integration point

**Database:**
- `lib/supabase/migrations.sql` - Schema definitions
- Tables: `user_personas`, `persona_signals`

**Dependencies:**
- Session Management System (for storage)
- AI Orchestrator (for triggering detection)
- Knowledge Base System (uses persona for filtering)

---

**Document Version:** 1.0
**Last Updated:** 2025-01-31
**Component:** Persona Detection System
