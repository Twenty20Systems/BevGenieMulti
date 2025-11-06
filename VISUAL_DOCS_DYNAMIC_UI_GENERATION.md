# Dynamic UI Generation System - Visual Documentation

## System Overview

The Dynamic UI Generation System uses Claude AI to analyze user queries and automatically generate fully-specified, interactive marketing pages in real-time, tailored to the user's persona and needs.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│              DYNAMIC UI GENERATION SYSTEM                        │
└─────────────────────────────────────────────────────────────────┘

INPUT: User Query + Context
  │
  ├─> Query: "Show me high-potential territories for expansion"
  ├─> Persona: { supplier, sales_focus, execution_blind_spot }
  └─> Knowledge Context: [Territory analysis docs...]
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 1: Intent Classification                           │
│  File: lib/ai/intent-classification.ts                   │
│  Function: classifyMessageIntent(message, history, persona)
└──────────────────────────────────────────────────────────┘
  │
  │ Analyzes query to determine:
  │
  ├─> Intent: "data_request" (looking for metrics/analysis)
  ├─> Confidence: 0.92
  └─> Suggested Page Type: "territory_analysis"
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  OUTPUT: Intent Classification                           │
│  {                                                        │
│    intent: "data_request",                               │
│    confidence: 0.92,                                     │
│    suggestedPageType: "territory_analysis",             │
│    reasoning: "User asking for territory data and       │
│                potential markets"                        │
│  }                                                        │
└──────────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 2: Build Generation Context                        │
│  File: lib/ai/page-generator.ts                          │
└──────────────────────────────────────────────────────────┘
  │
  │ Assembles comprehensive context:
  │
  ├─> User Message: Original query
  ├─> Persona Description: "Supplier, sales-focused,
  │                         concerned about execution blind spot"
  ├─> Knowledge Context: Relevant docs from KB
  ├─> Conversation History: Last 3 messages
  └─> Page Type: territory_analysis
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 3: Generate System Prompt                          │
│  File: lib/ai/prompts/page-generation.ts                 │
└──────────────────────────────────────────────────────────┘
  │
  │ Creates detailed prompt with:
  │
  ├─> Role: "You are a page specification generator..."
  ├─> Task: "Generate a territory_analysis page..."
  ├─> JSON Schema: Full BevGeniePage structure
  ├─> Context: User query + persona + knowledge
  ├─> Examples: Sample page specifications
  └─> Validation Rules: Required sections, format
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 4: Call Claude API                                 │
│  File: lib/ai/page-generator.ts                          │
│  Function: generatePageSpec(params)                      │
└──────────────────────────────────────────────────────────┘
  │
  │ API Call Parameters:
  │
  ├─> Model: claude-sonnet-4-5
  ├─> Temperature: 0.7
  ├─> Max Tokens: 4096
  ├─> System Prompt: (from Step 3)
  └─> User Prompt: Formatted context
  │
  │ ⏱️ Processing Time: 2-4 seconds
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 5: Parse & Validate Response                       │
│  File: lib/ai/page-generator.ts                          │
└──────────────────────────────────────────────────────────┘
  │
  │ Validation Steps:
  │
  ├─> Parse JSON response
  ├─> Validate against BevGeniePage schema
  ├─> Check required fields present
  ├─> Validate section structures
  └─> Ensure type safety
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  OUTPUT: Complete Page Specification                     │
│  {                                                        │
│    type: "territory_analysis",                           │
│    title: "High-Potential Territory Analysis",          │
│    theme: {                                              │
│      primaryColor: "#00C8FF",                            │
│      backgroundColor: "#0A1930"                          │
│    },                                                     │
│    sections: [                                            │
│      {                                                    │
│        type: "hero",                                     │
│        title: "Territory Expansion Opportunities",      │
│        subtitle: "Data-driven insights for growth",     │
│        cta: { text: "Explore Markets", action: "..." } │
│      },                                                   │
│      {                                                    │
│        type: "metric_grid",                              │
│        metrics: [                                         │
│          {                                                │
│            label: "High-Potential Markets",             │
│            value: "23",                                  │
│            trend: "+15%",                                │
│            icon: "target"                                │
│          },                                               │
│          // ... more metrics                             │
│        ]                                                  │
│      },                                                   │
│      // ... more sections                                │
│    ]                                                      │
│  }                                                        │
└──────────────────────────────────────────────────────────┘
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  STEP 6: Render in UI                                    │
│  File: components/genie/dynamic-content.tsx              │
│  Component: <DynamicContent spec={page} />               │
└──────────────────────────────────────────────────────────┘
  │
  │ Rendering Process:
  │
  ├─> Map page.sections to React components
  ├─> HeroSection → <HeroSection data={...} />
  ├─> MetricGrid → <MetricGrid metrics={...} />
  ├─> FeatureList → <FeatureList features={...} />
  └─> CTASection → <CTASection cta={...} />
  │
  ▼
┌──────────────────────────────────────────────────────────┐
│  FINAL OUTPUT: Rendered Interactive Page                 │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Territory Expansion Opportunities                  │ │
│  │ Data-driven insights for market growth            │ │
│  │ [Explore Markets →]                               │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐         │ │
│  │ │ 23       │ │ $4.2M    │ │ 87%      │         │ │
│  │ │ High-Pot │ │ Revenue  │ │ Success  │         │ │
│  │ │ Markets  │ │ Potential│ │ Rate     │         │ │
│  │ └──────────┘ └──────────┘ └──────────┘         │ │
│  ├────────────────────────────────────────────────────┤ │
│  │ Top Opportunities:                                │ │
│  │ ✓ Northeast Region - High craft demand          │ │
│  │ ✓ Pacific Northwest - Growing premium segment   │ │
│  │ ✓ Austin Metro - Emerging market leader         │ │
│  │ [View Full Analysis →]                           │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                               │
└─────────────────────────────────────────────────────────────────┘

USER QUERY
    │
    ▼
┌──────────────────┐
│ AI Orchestrator  │ (processChat)
│ orchestrator.ts  │
└──────────────────┘
    │
    ├──> Get Persona (DEPENDENCY: Session System)
    │
    ├──> Search Knowledge Base (DEPENDENCY: Knowledge System)
    │
    ▼
┌──────────────────┐
│ Intent Classifier│
│ intent-class.ts  │
└──────────────────┘
    │
    │ Determines page type
    ▼
┌──────────────────┐
│ Page Generator   │
│ page-generator.ts│
└──────────────────┘
    │
    ├─> Build context with:
    │   • Query
    │   • Persona ◄─── FROM SESSION SYSTEM
    │   • Knowledge ◄─── FROM KNOWLEDGE SYSTEM
    │   • History
    │
    ├─> Load page prompt template
    │
    ├─> Call Claude API
    │
    ├─> Parse JSON response
    │
    └─> Validate page spec
    │
    ▼
┌──────────────────┐
│ BevGeniePage     │ (Typed specification)
│ page-specs.ts    │
└──────────────────┘
    │
    │ Return to orchestrator
    ▼
┌──────────────────┐
│ Chat API         │
│ /api/chat/stream │
└──────────────────┘
    │
    │ Stream via SSE:
    ├─> Progress stages
    ├─> Text response
    └─> Page specification
    │
    ▼
┌──────────────────┐
│ Frontend         │
│ genie/page.tsx   │
└──────────────────┘
    │
    ├─> Receive page spec
    ├─> Add to pageHistory[]
    │
    ▼
┌──────────────────┐
│ DynamicContent   │
│ dynamic-content  │
│ .tsx             │
└──────────────────┘
    │
    └─> Render sections as React components
    │
    ▼
┌──────────────────┐
│ Visual Page      │ (Displayed to user)
└──────────────────┘
```

---

## Page Type System

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUPPORTED PAGE TYPES                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 1. solution_brief                                         │
├──────────────────────────────────────────────────────────┤
│ Purpose: Explain how BevGenie solves a specific problem │
│ Sections: Hero, Problem, Solution, Benefits, CTA        │
│ Use Case: "How can you help with sales?"                │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 2. feature_showcase                                       │
├──────────────────────────────────────────────────────────┤
│ Purpose: Highlight specific features and capabilities   │
│ Sections: Hero, Feature Grid, Use Cases, Demo, CTA      │
│ Use Case: "What features do you offer?"                 │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 3. roi_calculator                                         │
├──────────────────────────────────────────────────────────┤
│ Purpose: Show ROI and value proposition with numbers    │
│ Sections: Hero, Metrics, Calculator, Comparison, CTA    │
│ Use Case: "How do I prove ROI?"                         │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 4. territory_analysis                                     │
├──────────────────────────────────────────────────────────┤
│ Purpose: Analyze markets and territories                │
│ Sections: Hero, Metrics, Map, Opportunities, CTA        │
│ Use Case: "Show me high-potential territories"          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 5. comparison_matrix                                      │
├──────────────────────────────────────────────────────────┤
│ Purpose: Compare options, competitors, or approaches    │
│ Sections: Hero, Comparison Table, Winner, CTA           │
│ Use Case: "How do you compare to competitors?"          │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 6. strategic_roadmap                                      │
├──────────────────────────────────────────────────────────┤
│ Purpose: Show strategic plans and implementation steps  │
│ Sections: Hero, Timeline, Milestones, Resources, CTA    │
│ Use Case: "What's our go-to-market strategy?"           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 7. case_study                                             │
├──────────────────────────────────────────────────────────┤
│ Purpose: Tell success stories with data                 │
│ Sections: Hero, Challenge, Solution, Results, CTA       │
│ Use Case: "Show me success stories"                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 8. product_demo                                           │
├──────────────────────────────────────────────────────────┤
│ Purpose: Interactive walkthrough of product             │
│ Sections: Hero, Demo Steps, Screenshots, Try It, CTA    │
│ Use Case: "Can I see a demo?"                           │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 9. pricing_options                                        │
├──────────────────────────────────────────────────────────┤
│ Purpose: Display pricing tiers and packages             │
│ Sections: Hero, Plans, Comparison, FAQ, CTA             │
│ Use Case: "What does this cost?"                        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 10. integration_guide                                     │
├──────────────────────────────────────────────────────────┤
│ Purpose: Explain integration process                    │
│ Sections: Hero, Steps, Integrations, Timeline, CTA      │
│ Use Case: "How does this integrate with our systems?"   │
└──────────────────────────────────────────────────────────┘
```

---

## Page Specification Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                    BevGeniePage STRUCTURE                       │
└─────────────────────────────────────────────────────────────────┘

interface BevGeniePage {
  // Page Metadata
  type: PageType;           // Which template to use
  title: string;            // Page title
  description?: string;     // SEO description

  // Theme Configuration
  theme: {
    primaryColor: string;   // e.g., "#00C8FF"
    backgroundColor: string;// e.g., "#0A1930"
    accentColor?: string;   // Optional accent
  };

  // Sections Array (Order matters!)
  sections: Section[];      // Array of section objects

  // Navigation & Actions
  navigation?: {
    backToHome: boolean;
    relatedPages?: string[];
  };

  // Metadata
  generatedAt: number;      // Timestamp
  personaContext?: {        // Persona used for generation
    userType: string;
    primaryFocus: string;
    topPainPoints: string[];
  };
}

// Section Types
type Section =
  | HeroSection
  | MetricGridSection
  | FeatureListSection
  | BenefitCalloutsSection
  | ROICalculatorSection
  | ComparisonTableSection
  | TimelineSection
  | CTASection
  | ContentSection;

// Example: HeroSection
interface HeroSection {
  type: "hero";
  title: string;
  subtitle: string;
  backgroundImage?: string;
  cta?: CallToAction;
  stats?: QuickStat[];
}

// Example: MetricGridSection
interface MetricGridSection {
  type: "metric_grid";
  title?: string;
  metrics: MetricCard[];
  columns: 2 | 3 | 4;
}

interface MetricCard {
  label: string;
  value: string;
  trend?: string;         // e.g., "+15%"
  trendDirection?: "up" | "down";
  icon?: string;
  description?: string;
}

// Example: CTASection
interface CTASection {
  type: "cta";
  title: string;
  description: string;
  primaryCTA: CallToAction;
  secondaryCTA?: CallToAction;
}

interface CallToAction {
  text: string;
  action: string;         // What happens on click
  context?: Record<string, any>;
  variant?: "primary" | "secondary" | "ghost";
}
```

---

## Intent Classification Logic

```
┌─────────────────────────────────────────────────────────────────┐
│                 INTENT CLASSIFICATION                           │
└─────────────────────────────────────────────────────────────────┘

Query: "Show me high-potential territories for expansion"

┌──────────────────────────────────────────────────┐
│ STEP 1: Keyword Analysis                        │
├──────────────────────────────────────────────────┤
│ Keywords Found:                                  │
│  • "show me" → data_request                     │
│  • "territories" → data_request                 │
│  • "expansion" → strategic_planning             │
│  • "high-potential" → data_request              │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ STEP 2: Intent Scoring                          │
├──────────────────────────────────────────────────┤
│ data_request: 0.92 (3 strong keywords)          │
│ strategic_planning: 0.45 (1 keyword)            │
│ exploratory: 0.20 (general exploration)         │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ STEP 3: Page Type Selection                     │
├──────────────────────────────────────────────────┤
│ Primary Intent: data_request                    │
│ Context: "territories", "expansion"             │
│                                                  │
│ Page Type Logic:                                 │
│  data_request + territories → territory_analysis│
│  data_request + ROI → roi_calculator            │
│  data_request + metrics → solution_brief        │
│                                                  │
│ Selected: territory_analysis                     │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ STEP 4: Confidence Check                        │
├──────────────────────────────────────────────────┤
│ Confidence: 0.92 (High)                         │
│  • > 0.8 → Use suggested page type              │
│  • 0.5-0.8 → Use with fallback                  │
│  • < 0.5 → Use default (solution_brief)         │
│                                                  │
│ Decision: Use territory_analysis ✓              │
└──────────────────────────────────────────────────┘

RESULT:
{
  intent: "data_request",
  confidence: 0.92,
  suggestedPageType: "territory_analysis"
}
```

---

## Claude Prompt Engineering

```
┌─────────────────────────────────────────────────────────────────┐
│              CLAUDE PROMPT STRUCTURE                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ SYSTEM PROMPT                                    │
├──────────────────────────────────────────────────┤
│ You are a page specification generator for       │
│ BevGenie, an AI platform for the beverage       │
│ industry.                                         │
│                                                   │
│ Your task: Generate a complete page              │
│ specification as JSON that matches the           │
│ BevGeniePage schema.                             │
│                                                   │
│ Page Type: territory_analysis                    │
│                                                   │
│ Requirements:                                     │
│ • Must include hero section                     │
│ • Must include metric grid with 3-6 metrics     │
│ • Must include actionable insights              │
│ • Must include CTAs for next steps              │
│ • Use professional B2B tone                     │
│ • Focus on data-driven insights                 │
│                                                   │
│ JSON Schema:                                      │
│ {                                                 │
│   type: "territory_analysis",                    │
│   title: string,                                 │
│   sections: [                                     │
│     { type: "hero", ... },                       │
│     { type: "metric_grid", ... },               │
│     // ... more sections                         │
│   ]                                               │
│ }                                                 │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ USER PROMPT (Context)                            │
├──────────────────────────────────────────────────┤
│ User Query:                                       │
│ "Show me high-potential territories for          │
│  expansion"                                       │
│                                                   │
│ User Persona:                                     │
│ The user is a beverage supplier, sales-focused, │
│ concerned about execution blind spot. They need  │
│ to prove ROI from field activities and identify │
│ growth opportunities.                            │
│                                                   │
│ Knowledge Context:                                │
│ • Territory analysis best practices              │
│ • Market penetration data for craft breweries   │
│ • Success metrics from similar expansions        │
│                                                   │
│ Previous Conversation:                            │
│ User: "How can you help our sales team?"         │
│ Assistant: "I can help with territory planning, │
│             ROI tracking, and sales optimization"│
│                                                   │
│ Generate a territory_analysis page that:         │
│ 1. Shows specific high-potential territories    │
│ 2. Provides data-driven metrics                 │
│ 3. Explains why these territories matter        │
│ 4. Gives actionable next steps                  │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ CLAUDE RESPONSE (Structured JSON)                │
├──────────────────────────────────────────────────┤
│ {                                                 │
│   "type": "territory_analysis",                  │
│   "title": "High-Potential Territory Analysis", │
│   "theme": {                                      │
│     "primaryColor": "#00C8FF",                   │
│     "backgroundColor": "#0A1930"                 │
│   },                                              │
│   "sections": [                                   │
│     {                                             │
│       "type": "hero",                            │
│       "title": "Territory Expansion              │
│                 Opportunities",                  │
│       "subtitle": "Data-driven insights for      │
│                    strategic growth",            │
│       "cta": {                                    │
│         "text": "Explore Markets",              │
│         "action": "explore_markets"             │
│       }                                           │
│     },                                            │
│     {                                             │
│       "type": "metric_grid",                     │
│       "title": "Market Opportunity Overview",   │
│       "metrics": [                                │
│         {                                         │
│           "label": "High-Potential Markets",    │
│           "value": "23",                         │
│           "trend": "+15%",                       │
│           "trendDirection": "up",               │
│           "icon": "target"                       │
│         },                                        │
│         // ... more metrics                      │
│       ]                                           │
│     },                                            │
│     // ... more sections                         │
│   ]                                               │
│ }                                                 │
└──────────────────────────────────────────────────┘
```

---

## Component Rendering System

```
┌─────────────────────────────────────────────────────────────────┐
│                 COMPONENT MAPPING                               │
└─────────────────────────────────────────────────────────────────┘

Page Spec Section → React Component

┌────────────────────────────────────────────────┐
│ { type: "hero", ... }                          │
└────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│ <HeroSection                                   │
│   title={section.title}                        │
│   subtitle={section.subtitle}                  │
│   cta={section.cta}                           │
│   backgroundImage={section.backgroundImage}   │
│ />                                             │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ { type: "metric_grid", metrics: [...] }       │
└────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│ <MetricGrid metrics={section.metrics}>        │
│   {section.metrics.map(metric =>              │
│     <MetricCard                                │
│       key={metric.label}                       │
│       label={metric.label}                     │
│       value={metric.value}                     │
│       trend={metric.trend}                     │
│       icon={metric.icon}                       │
│     />                                          │
│   )}                                            │
│ </MetricGrid>                                  │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ { type: "feature_list", features: [...] }     │
└────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│ <FeatureList>                                  │
│   {section.features.map(feature =>            │
│     <FeatureCard                               │
│       icon={feature.icon}                      │
│       title={feature.title}                    │
│       description={feature.description}        │
│       benefits={feature.benefits}              │
│     />                                          │
│   )}                                            │
│ </FeatureList>                                 │
└────────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ { type: "cta", ... }                           │
└────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────┐
│ <CTASection                                    │
│   title={section.title}                        │
│   description={section.description}            │
│   primaryCTA={section.primaryCTA}             │
│   secondaryCTA={section.secondaryCTA}         │
│   onCTAClick={handleNavigationClick}          │
│ />                                             │
└────────────────────────────────────────────────┘

Main Component:

<DynamicContent specification={page}>
  {page.sections.map(section => {
    switch (section.type) {
      case "hero":
        return <HeroSection {...section} />;
      case "metric_grid":
        return <MetricGrid {...section} />;
      case "feature_list":
        return <FeatureList {...section} />;
      case "cta":
        return <CTASection {...section} />;
      // ... all section types
    }
  })}
</DynamicContent>
```

---

## SSE Streaming Progress

```
┌─────────────────────────────────────────────────────────────────┐
│              SERVER-SENT EVENTS FLOW                            │
└─────────────────────────────────────────────────────────────────┘

Client → Server: POST /api/chat/stream

Server Broadcasts:

▼ Stage 1: init (5%)
data: {"stageId":"init","stage":"Initializing BevGenie AI..."}

▼ Stage 2: intent (15%)
data: {"stageId":"intent","stage":"Understanding your question..."}
(Intent classification happening)

▼ Stage 3: signals (35%)
data: {"stageId":"signals","stage":"Detecting your needs..."}
(Persona detection happening - DEPENDENCY: Session System)

▼ Stage 4: knowledge (55%)
data: {"stageId":"knowledge","stage":"Searching knowledge base..."}
(Vector search happening - DEPENDENCY: Knowledge System)

▼ Stage 5: response (75%)
data: {"stageId":"response","stage":"Crafting personalized response..."}
(OpenAI generating text response)
data: {"text":"Based on your focus on field sales ROI..."}
data: {"text":" here are the top territories..."}

▼ Stage 6: page (90%)
data: {"stageId":"page","stage":"Generating dynamic page..."}
(Claude generating page specification)

▼ Stage 7: complete (100%)
data: {"page": { "type": "territory_analysis", "sections": [...] }}
data: {"stageId":"complete"}

Client closes connection
```

---

## Personalization Integration

```
┌─────────────────────────────────────────────────────────────────┐
│         HOW PERSONA AFFECTS PAGE GENERATION                     │
└─────────────────────────────────────────────────────────────────┘

PERSONA DATA (from Session System):
{
  supplier_score: 0.85,
  sales_focus_score: 0.75,
  pain_points_detected: ["execution_blind_spot"],
  craft_score: 0.60
}

IMPACT ON GENERATION:

┌──────────────────────────────────────────────────┐
│ 1. Page Type Selection                          │
├──────────────────────────────────────────────────┤
│ • sales_focus_score high → Prefer roi_calculator│
│ • marketing_focus high → Prefer feature_showcase│
│ • operations_focus high → Prefer process_guide  │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 2. Content Customization                        │
├──────────────────────────────────────────────────┤
│ Prompt includes:                                 │
│ "The user is a craft brewery supplier focused   │
│  on sales effectiveness. They struggle with     │
│  proving ROI from field activities."            │
│                                                  │
│ → Claude generates content relevant to:         │
│   • Craft beverage market                       │
│   • Sales metrics and ROI                       │
│   • Field activity tracking                     │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 3. Metric Selection                             │
├──────────────────────────────────────────────────┤
│ Because pain_point = "execution_blind_spot":    │
│                                                  │
│ Metrics shown:                                   │
│ ✓ ROI from field activities                    │
│ ✓ Sales team effectiveness                     │
│ ✓ Territory penetration                        │
│ ✓ Conversion rates                             │
│                                                  │
│ NOT shown:                                       │
│ ✗ Brand awareness (marketing metric)           │
│ ✗ Compliance scores (ops metric)               │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 4. CTA Customization                            │
├──────────────────────────────────────────────────┤
│ CTAs match user needs:                          │
│ • "Calculate Your Field ROI" (pain point)       │
│ • "See Territory Performance" (sales focus)     │
│ • "View Craft Beer Case Studies" (craft score) │
└──────────────────────────────────────────────────┘
```

---

## Error Handling & Fallbacks

```
┌─────────────────────────────────────────────────────────────────┐
│                 ERROR HANDLING FLOW                             │
└─────────────────────────────────────────────────────────────────┘

TRY: Generate Page
  │
  ├─> Intent Classification
  │   ├─ SUCCESS → Continue
  │   └─ FAIL → Use default: solution_brief
  │
  ├─> Claude API Call
  │   ├─ SUCCESS → Parse response
  │   ├─ TIMEOUT → Retry once, then fallback
  │   ├─ RATE LIMIT → Queue and retry
  │   └─ ERROR → Log and use fallback page
  │
  ├─> JSON Parsing
  │   ├─ SUCCESS → Validate schema
  │   └─ FAIL → Log error, use fallback page
  │
  └─> Schema Validation
      ├─ VALID → Return page spec
      └─ INVALID → Log validation errors, use fallback

FALLBACK PAGE:
{
  type: "solution_brief",
  title: "BevGenie Solution",
  sections: [
    { type: "hero", title: "How BevGenie Can Help" },
    { type: "feature_list", features: [...default features...] },
    { type: "cta", title: "Get Started" }
  ]
}

GRACEFUL DEGRADATION:
• Page generation fails → Chat still works (text-only response)
• User still gets helpful information
• Error logged for debugging
• Retry suggested to user
```

---

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────────┐
│                 PERFORMANCE TARGETS                             │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Generation Time Breakdown                        │
├──────────────────────────────────────────────────┤
│ Intent Classification:     100-200ms            │
│ Persona Detection:          50-100ms            │
│ Knowledge Search:          200-400ms            │
│ Claude API Call:         2000-4000ms            │
│ JSON Parsing/Validation:    50-100ms            │
│ ─────────────────────────────────────           │
│ Total:                   ~2.5-5 seconds         │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Optimization Strategies                          │
├──────────────────────────────────────────────────┤
│ 1. Parallel Processing:                         │
│    • Intent classification while detecting      │
│      persona (not sequential)                   │
│                                                  │
│ 2. Caching:                                      │
│    • Cache intent patterns                      │
│    • Cache page templates                       │
│                                                  │
│ 3. Streaming:                                    │
│    • SSE for progress updates                   │
│    • User sees loading stages                   │
│    • Perceived performance boost               │
│                                                  │
│ 4. Model Selection:                              │
│    • Use claude-sonnet-4-5 (fast + quality)    │
│    • Not opus (too slow for real-time)          │
└──────────────────────────────────────────────────┘
```

---

## Complete Example

```
┌─────────────────────────────────────────────────────────────────┐
│              END-TO-END EXAMPLE                                 │
└─────────────────────────────────────────────────────────────────┘

1. USER TYPES:
   "Show me ROI calculator for field sales"

2. INTENT CLASSIFICATION:
   Intent: "solution_seeking" + "data_request"
   Confidence: 0.88
   Page Type: roi_calculator

3. CONTEXT BUILDING:
   • Query: "Show me ROI calculator for field sales"
   • Persona: Supplier, sales-focused, execution blind spot
   • Knowledge: ROI calculation methodologies, industry benchmarks
   • History: Previous questions about field sales effectiveness

4. CLAUDE GENERATES:
   {
     type: "roi_calculator",
     title: "Field Sales ROI Calculator",
     sections: [
       {
         type: "hero",
         title: "Calculate Your Field Sales ROI",
         subtitle: "Data-driven insights for justifying field investments"
       },
       {
         type: "metric_grid",
         metrics: [
           { label: "Current Field Cost", value: "$120K/year" },
           { label: "Expected Revenue Impact", value: "+$480K" },
           { label: "ROI", value: "4:1", trend: "+25%" }
         ]
       },
       {
         type: "roi_calculator",
         inputs: [
           { label: "Field Team Size", type: "number", default: 5 },
           { label: "Average Deal Size", type: "currency" },
           { label: "Conversion Rate", type: "percentage" }
         ],
         outputs: [
           { label: "Annual ROI", formula: "..." },
           { label: "Payback Period", formula: "..." }
         ]
       },
       {
         type: "cta",
         title: "Ready to Optimize Your Field Sales?",
         primaryCTA: {
           text: "See Territory Analysis",
           action: "territory_analysis"
         }
       }
     ]
   }

5. UI RENDERS:
   ┌────────────────────────────────────────────┐
   │ Calculate Your Field Sales ROI             │
   │ Data-driven insights for justifying field  │
   │ investments                                 │
   ├────────────────────────────────────────────┤
   │ Current Field Cost: $120K/year             │
   │ Expected Revenue Impact: +$480K            │
   │ ROI: 4:1 ↑ +25%                           │
   ├────────────────────────────────────────────┤
   │ INTERACTIVE CALCULATOR:                    │
   │ Field Team Size: [5] reps                 │
   │ Average Deal Size: [$50,000]              │
   │ Conversion Rate: [12%]                    │
   │                                            │
   │ → Annual ROI: $600K (5:1 ratio)           │
   │ → Payback Period: 2.4 months              │
   ├────────────────────────────────────────────┤
   │ [See Territory Analysis →]                │
   └────────────────────────────────────────────┘

6. USER CLICKS CTA:
   → Triggers new page generation
   → "Show me territory analysis"
   → Process repeats...
```

---

## Dependencies on Other Systems

```
┌─────────────────────────────────────────────────────────────────┐
│              SYSTEM DEPENDENCIES                                │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 1. SESSION SYSTEM (REQUIRED)                    │
├──────────────────────────────────────────────────┤
│ Used For:                                        │
│ • Getting current persona                       │
│ • Personalizing page content                    │
│ • Tracking user journey                         │
│                                                  │
│ Without Session:                                 │
│ • Pages generated without personalization       │
│ • Generic content only                          │
│ • No persona context in prompts                 │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 2. KNOWLEDGE BASE SYSTEM (OPTIONAL)              │
├──────────────────────────────────────────────────┤
│ Used For:                                        │
│ • Enriching page content with facts             │
│ • Adding domain expertise                       │
│ • Providing accurate data                       │
│                                                  │
│ Without Knowledge Base:                          │
│ • Pages still generated                         │
│ • Content based on Claude's training only       │
│ • May lack specific industry data               │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ 3. PERSONA DETECTION SYSTEM (OPTIONAL)           │
├──────────────────────────────────────────────────┤
│ Used For:                                        │
│ • Determining user context                      │
│ • Selecting appropriate page type               │
│ • Customizing metrics and CTAs                  │
│                                                  │
│ Without Persona:                                 │
│ • Uses default page type                        │
│ • Generic content for all users                 │
│ • Less targeted recommendations                 │
└──────────────────────────────────────────────────┘
```

---

## File References

**Core Files:**
- `lib/ai/page-specs.ts` - Type definitions
- `lib/ai/page-generator.ts` - Main generation logic
- `lib/ai/intent-classification.ts` - Intent classifier
- `lib/ai/prompts/page-generation.ts` - Claude prompts
- `components/genie/dynamic-content.tsx` - Rendering system
- `app/api/chat/stream/route.ts` - SSE streaming endpoint

**Dependencies:**
- Session Management System (persona data)
- Knowledge Base System (context enrichment)
- Persona Detection System (user classification)

---

**Document Version:** 1.0
**Last Updated:** 2025-01-31
**Component:** Dynamic UI Generation System
