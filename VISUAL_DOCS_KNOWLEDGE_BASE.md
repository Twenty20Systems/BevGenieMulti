# Knowledge Base System - Visual Documentation

## System Overview

The Knowledge Base System provides vector-based semantic search using OpenAI embeddings and PostgreSQL pgvector, enabling BevGenie to retrieve relevant domain knowledge for context-aware AI responses.

---

## Technical Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                    TECHNOLOGY STACK                             │
└─────────────────────────────────────────────────────────────────┘

Embeddings API: OpenAI Embeddings API
  • Model: text-embedding-3-small
  • Dimensions: 1536
  • Cost: $0.00002 per 1K tokens
  • Speed: ~100ms per request

Vector Database: PostgreSQL with pgvector
  • Extension: pgvector 0.5.0+
  • Index Type: HNSW (Hierarchical Navigable Small World)
  • Distance Metric: Cosine similarity (1 - cosine_distance)
  • Query Performance: O(log n) with HNSW index

Database Client: @supabase/supabase-js v2.76.1
  • Supabase PostgreSQL 15+
  • Row-Level Security enabled
  • RPC function calls for vector search

Additional Search: PostgreSQL Full-Text Search
  • tsvector and tsquery
  • English language stemming
  • Combined with vector search for hybrid ranking

OpenAI SDK: openai v6.7.0
  • TypeScript support
  • Async/await interface
  • Automatic retries
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                KNOWLEDGE BASE ARCHITECTURE                      │
└─────────────────────────────────────────────────────────────────┘

USER QUERY: "How can I prove ROI from field sales?"
    │
    ▼
┌──────────────────────────────────────────────────┐
│ AI Orchestrator                                  │
│ orchestrator.ts                                  │
└──────────────────────────────────────────────────┘
    │
    │ Calls getContextForLLM(query, persona, limit)
    ▼
┌──────────────────────────────────────────────────┐
│ Knowledge Search API                             │
│ File: lib/ai/knowledge-search.ts                 │
│ Function: getContextForLLM()                     │
└──────────────────────────────────────────────────┘
    │
    ├─> STEP 1: Generate Query Embedding
    │
    ▼
┌──────────────────────────────────────────────────┐
│ OpenAI Embeddings API                            │
│ File: lib/ai/embeddings.ts                       │
│ Function: generateEmbedding(text)                │
└──────────────────────────────────────────────────┘
    │
    │ POST https://api.openai.com/v1/embeddings
    │ {
    │   model: "text-embedding-3-small",
    │   input: "How can I prove ROI from field sales?"
    │ }
    │
    │ Returns: [0.123, -0.456, 0.789, ..., 0.321]
    │          (1536-dimensional vector)
    │
    ▼
┌──────────────────────────────────────────────────┐
│ Vector + Persona Filtering                       │
│ File: lib/ai/knowledge-search.ts                 │
│ Function: searchKnowledgeBase()                  │
└──────────────────────────────────────────────────┘
    │
    ├─> Extract persona tags from persona scores
    │   • supplier_score > 0.5 → ["supplier"]
    │   • sales_focus_score > 0.5 → ["sales"]
    │   • pain_points → ["execution_blind_spot"]
    │
    ├─> STEP 2: Call Supabase RPC Function
    │
    ▼
┌──────────────────────────────────────────────────┐
│ Supabase PostgreSQL Database                     │
│ RPC Function: match_documents()                  │
└──────────────────────────────────────────────────┘
    │
    │ SQL Query (Simplified):
    │ SELECT
    │   id, content, metadata,
    │   1 - (embedding <=> query_embedding) as similarity
    │ FROM knowledge_base
    │ WHERE
    │   persona_tags && ['supplier', 'sales']
    │   AND (1 - (embedding <=> query_embedding)) > 0.5
    │ ORDER BY embedding <=> query_embedding
    │ LIMIT 5;
    │
    │ HNSW Index Used: O(log n) search time
    │
    ▼
┌──────────────────────────────────────────────────┐
│ Matched Documents (Sorted by Similarity)         │
│ [                                                 │
│   {                                               │
│     id: "uuid-1",                                │
│     content: "Field sales ROI can be calculated  │
│               by measuring...",                  │
│     metadata: {                                   │
│       source: "ROI Best Practices Guide",       │
│       category: "execution_blind_spot"          │
│     },                                            │
│     similarity: 0.89                             │
│   },                                              │
│   {                                               │
│     id: "uuid-2",                                │
│     content: "Tracking field activities         │
│               provides visibility into...",      │
│     metadata: {...},                             │
│     similarity: 0.85                             │
│   },                                              │
│   // ... up to 5 documents                       │
│ ]                                                 │
└──────────────────────────────────────────────────┘
    │
    ├─> STEP 3: Format for LLM Consumption
    │
    ▼
┌──────────────────────────────────────────────────┐
│ Formatted Context String                         │
│ File: lib/ai/knowledge-search.ts                 │
│ Function: formatKnowledgeContext()               │
└──────────────────────────────────────────────────┘
    │
    │ Output:
    │ """
    │ ## Relevant Knowledge:
    │
    │ ### Document 1 (Similarity: 89%)
    │ Source: ROI Best Practices Guide
    │
    │ Field sales ROI can be calculated by measuring...
    │
    │ ### Document 2 (Similarity: 85%)
    │ Source: Field Activity Tracking
    │
    │ Tracking field activities provides visibility into...
    │ """
    │
    ▼
┌──────────────────────────────────────────────────┐
│ Return to AI Orchestrator                        │
│ → Used in system prompt for personalized response│
└──────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         DATA FLOW                               │
└─────────────────────────────────────────────────────────────────┘

QUERY TEXT
    │
    │ "How can I prove ROI from field sales?"
    ▼
┌─────────────────┐
│ generateEmbedding│ (OpenAI API)
└─────────────────┘
    │
    │ VECTOR: [0.123, -0.456, ..., 0.321] (1536-dim)
    ▼
┌─────────────────┐
│ getPersonaTags  │ (From Session System)
└─────────────────┘
    │
    │ TAGS: ["supplier", "sales", "execution_blind_spot"]
    ▼
┌─────────────────┐
│searchKnowledgeBase│
└─────────────────┘
    │
    │ Parameters:
    │ • query_embedding: vector(1536)
    │ • filter_personas: ["supplier", "sales"]
    │ • match_threshold: 0.5
    │ • match_count: 5
    ▼
┌─────────────────────────────────────────┐
│ Supabase RPC: match_documents()         │
│                                         │
│ ┌───────────────────────────────────┐ │
│ │ Vector Search (HNSW)              │ │
│ │ Cosine Similarity Calculation     │ │
│ │ Persona Tag Filtering (GIN Index) │ │
│ │ Threshold Filtering (>0.5)        │ │
│ │ Sort by Similarity DESC           │ │
│ │ Limit to 5 results                │ │
│ └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
    │
    │ RESULTS: Array of matched documents
    ▼
┌─────────────────┐
│formatKnowledge  │
│Context()        │
└─────────────────┘
    │
    │ FORMATTED STRING: Markdown with sources
    ▼
┌─────────────────┐
│ Return Context  │ → To AI Orchestrator
└─────────────────┘
```

---

## Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE SCHEMA                              │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Table: knowledge_base                                        │
├──────────────────────────────────────────────────────────────┤
│ Purpose: Store documents with embeddings for vector search  │
│                                                              │
│ Columns:                                                     │
│  id                UUID PRIMARY KEY                          │
│  content           TEXT NOT NULL                             │
│  embedding         vector(1536)                              │
│  metadata          JSONB DEFAULT '{}'                        │
│  persona_tags      TEXT[] DEFAULT '{}'                       │
│  pain_point_tags   TEXT[] DEFAULT '{}'                       │
│  source_type       VARCHAR(50)                               │
│  source_url        TEXT                                      │
│  created_at        TIMESTAMPTZ DEFAULT NOW()                 │
│  updated_at        TIMESTAMPTZ DEFAULT NOW()                 │
│                                                              │
│ Indexes:                                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ idx_kb_embedding (HNSW)                                │ │
│  │ Purpose: Fast vector similarity search                 │ │
│  │ Index Type: HNSW (Hierarchical Navigable Small World) │ │
│  │ Distance: vector_cosine_ops                            │ │
│  │ Performance: O(log n) search time                      │ │
│  │                                                        │ │
│  │ CREATE INDEX idx_kb_embedding                          │ │
│  │   ON knowledge_base                                    │ │
│  │   USING hnsw (embedding vector_cosine_ops);           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ idx_kb_persona_tags (GIN)                              │ │
│  │ Purpose: Fast array containment queries               │ │
│  │ Index Type: GIN (Generalized Inverted Index)          │ │
│  │ Use Case: persona_tags && ['supplier', 'sales']       │ │
│  │                                                        │ │
│  │ CREATE INDEX idx_kb_persona_tags                       │ │
│  │   ON knowledge_base                                    │ │
│  │   USING gin (persona_tags);                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ idx_kb_pain_point_tags (GIN)                           │ │
│  │ Purpose: Fast pain point filtering                     │ │
│  │                                                        │ │
│  │ CREATE INDEX idx_kb_pain_point_tags                    │ │
│  │   ON knowledge_base                                    │ │
│  │   USING gin (pain_point_tags);                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ idx_kb_source_type (B-tree)                            │ │
│  │ Purpose: Filter by source type                         │ │
│  │                                                        │ │
│  │ CREATE INDEX idx_kb_source_type                        │ │
│  │   ON knowledge_base(source_type);                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│ Example Row:                                                 │
│ {                                                            │
│   id: "550e8400-e29b-41d4-a716-446655440000",              │
│   content: "Field sales ROI can be calculated by           │
│             measuring conversion rates, average deal       │
│             size, and cost per field activity...",         │
│   embedding: [0.123, -0.456, ..., 0.321],                 │
│   metadata: {                                               │
│     "source": "ROI Best Practices Guide",                  │
│     "category": "execution_blind_spot",                    │
│     "author": "BevGenie Research Team",                    │
│     "date": "2024-01-15"                                   │
│   },                                                         │
│   persona_tags: ["supplier", "sales", "mid_sized"],       │
│   pain_point_tags: ["execution_blind_spot"],              │
│   source_type: "research-doc",                             │
│   source_url: "https://internal.bevgenie.com/roi-guide",  │
│   created_at: "2024-01-15 10:00:00+00",                   │
│   updated_at: "2024-01-15 10:00:00+00"                    │
│ }                                                            │
│                                                              │
│ RLS Policies:                                                │
│  • Public read access (for AI queries)                      │
│  • Service role write access (for content management)       │
└──────────────────────────────────────────────────────────────┘
```

---

## Vector Search Function

```
┌─────────────────────────────────────────────────────────────────┐
│              POSTGRESQL FUNCTION: match_documents               │
└─────────────────────────────────────────────────────────────────┘

CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 5,
  filter_personas text[] DEFAULT '{}'
)
RETURNS TABLE(
  id uuid,
  content text,
  metadata jsonb,
  similarity float
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.content,
    kb.metadata,
    1 - (kb.embedding <=> query_embedding) as similarity
  FROM public.knowledge_base kb
  WHERE (
    -- If filter_personas is empty, include all documents
    filter_personas = '{}'
    -- Otherwise, check if any persona tags match
    OR kb.persona_tags && filter_personas
  )
  -- Similarity threshold (cosine similarity > 0.5)
  AND (1 - (kb.embedding <=> query_embedding)) > match_threshold
  -- Sort by similarity (closest vectors first)
  ORDER BY kb.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

EXPLANATION:
────────────────────────────────────────────────────────
• query_embedding: The 1536-dimensional vector to search for
• match_threshold: Minimum similarity score (0.0-1.0)
• match_count: Maximum number of results to return
• filter_personas: Array of persona tags to filter by

• <=> operator: Cosine distance (pgvector)
  - Returns distance (0 = identical, 2 = opposite)
  - We convert to similarity: 1 - distance
  - Similarity: 1.0 = identical, 0.0 = orthogonal, -1.0 = opposite

• && operator: Array overlap (PostgreSQL)
  - Returns true if arrays share any elements
  - Used for persona_tags filtering with GIN index

• ORDER BY embedding <=> query_embedding:
  - Uses HNSW index for fast nearest neighbor search
  - O(log n) complexity with proper index

PERFORMANCE:
────────────────────────────────────────────────────────
• Without HNSW index: O(n) - Full table scan
• With HNSW index: O(log n) - Approximate nearest neighbor
• Typical query time: 10-50ms for 1000s of documents
```

---

## Hybrid Search Function

```
┌─────────────────────────────────────────────────────────────────┐
│              POSTGRESQL FUNCTION: hybrid_search                 │
└─────────────────────────────────────────────────────────────────┘

CREATE OR REPLACE FUNCTION hybrid_search(
  query_text text,
  query_embedding vector(1536),
  filter_personas text[] DEFAULT '{}',
  match_count int DEFAULT 10
)
RETURNS TABLE(
  id uuid,
  content text,
  metadata jsonb,
  vector_similarity float,
  text_relevance float,
  combined_score float
) LANGUAGE plpgsql AS $$
DECLARE
  v_weight float := 0.6;  -- Vector search weight
  t_weight float := 0.4;  -- Text search weight
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.content,
    kb.metadata,
    (1 - (kb.embedding <=> query_embedding))::float as vector_similarity,
    ts_rank(
      to_tsvector('english', kb.content),
      plainto_tsquery('english', query_text)
    )::float as text_relevance,
    (
      v_weight * (1 - (kb.embedding <=> query_embedding))
      + t_weight * ts_rank(
        to_tsvector('english', kb.content),
        plainto_tsquery('english', query_text)
      )
    )::float as combined_score
  FROM public.knowledge_base kb
  WHERE (
    filter_personas = '{}'
    OR kb.persona_tags && filter_personas
  )
  AND (
    -- Match either by vector similarity OR text relevance
    kb.embedding <=> query_embedding < 1.5
    OR to_tsvector('english', kb.content) @@ plainto_tsquery('english', query_text)
  )
  -- Sort by combined score (weighted average)
  ORDER BY combined_score DESC
  LIMIT match_count;
END;
$$;

EXPLANATION:
────────────────────────────────────────────────────────
Combines two search methods:

1. VECTOR SIMILARITY (60% weight):
   • Uses embedding <=> query_embedding
   • Semantic similarity based on meaning
   • Catches conceptually similar content

2. FULL-TEXT SEARCH (40% weight):
   • Uses PostgreSQL's tsvector and tsquery
   • to_tsvector: Converts text to searchable format
   • plainto_tsquery: Parses query for search terms
   • ts_rank: Relevance score (0.0-1.0)
   • Catches exact keyword matches

BENEFITS:
────────────────────────────────────────────────────────
• More robust than vector-only search
• Catches both semantic AND keyword matches
• Query: "ROI tracking" will match:
  - Vector: "measuring return on investment" (semantic)
  - Text: "ROI calculation methods" (keyword)
```

---

## Embedding Generation

```
┌─────────────────────────────────────────────────────────────────┐
│              OPENAI EMBEDDINGS API INTEGRATION                  │
└─────────────────────────────────────────────────────────────────┘

File: lib/ai/embeddings.ts

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate embedding vector for text using OpenAI
 *
 * @param text - Text to generate embedding for
 * @returns 1536-dimensional vector
 */
export async function generateEmbedding(
  text: string
): Promise<number[]> {
  try {
    // Call OpenAI Embeddings API
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',  // 1536 dimensions
      input: text.trim(),                // Clean input text
      encoding_format: 'float',          // Return as float array
    });

    // Extract embedding vector
    const embedding = response.data[0].embedding;

    // Validate dimensions
    if (embedding.length !== 1536) {
      throw new Error(`Invalid embedding dimensions: ${embedding.length}`);
    }

    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

API REQUEST:
────────────────────────────────────────────────────────
POST https://api.openai.com/v1/embeddings
Headers:
  Authorization: Bearer <OPENAI_API_KEY>
  Content-Type: application/json

Body:
{
  "model": "text-embedding-3-small",
  "input": "How can I prove ROI from field sales?"
}

API RESPONSE:
────────────────────────────────────────────────────────
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "embedding": [
        0.123,
        -0.456,
        0.789,
        // ... 1533 more numbers
        0.321
      ],
      "index": 0
    }
  ],
  "model": "text-embedding-3-small",
  "usage": {
    "prompt_tokens": 10,
    "total_tokens": 10
  }
}

COST CALCULATION:
────────────────────────────────────────────────────────
• Model: text-embedding-3-small
• Cost: $0.00002 per 1K tokens
• Average query: ~10 tokens
• Cost per query: ~$0.0000002 (negligible)

PERFORMANCE:
────────────────────────────────────────────────────────
• Typical latency: 50-200ms
• Rate limit: 3,000 requests/minute
• Retry with exponential backoff on failures
```

---

## Knowledge Search Implementation

```
┌─────────────────────────────────────────────────────────────────┐
│              KNOWLEDGE SEARCH FUNCTIONS                         │
└─────────────────────────────────────────────────────────────────┘

File: lib/ai/knowledge-search.ts

import { generateEmbedding } from './embeddings';
import { supabaseAdmin } from '@/lib/supabase/client';
import type { PersonaScores } from '@/lib/session/types';

/**
 * Search knowledge base using vector similarity
 *
 * @param query - Search query text
 * @param persona - User persona for filtering
 * @param limit - Maximum results (default: 5)
 * @returns Array of matched documents
 */
export async function searchKnowledgeBase(
  query: string,
  persona: PersonaScores,
  limit: number = 5
): Promise<KnowledgeDocument[]> {
  try {
    // Step 1: Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);

    // Step 2: Extract persona tags for filtering
    const personaTags = extractPersonaTags(persona);

    // Step 3: Call Supabase RPC function
    const { data, error } = await supabaseAdmin.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: limit,
      filter_personas: personaTags,
    });

    if (error) {
      console.error('Error searching knowledge base:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchKnowledgeBase:', error);
    return [];
  }
}

/**
 * Extract persona tags from persona scores
 *
 * @param persona - User persona scores
 * @returns Array of relevant tags
 */
function extractPersonaTags(persona: PersonaScores): string[] {
  const tags: string[] = [];

  // Organization type
  if (persona.supplier_score > 0.5) tags.push('supplier');
  if (persona.distributor_score > 0.5) tags.push('distributor');

  // Organization size
  if (persona.craft_score > 0.5) tags.push('craft');
  if (persona.mid_sized_score > 0.5) tags.push('mid_sized');
  if (persona.large_score > 0.5) tags.push('large');

  // Functional focus
  if (persona.sales_focus_score > 0.5) tags.push('sales');
  if (persona.marketing_focus_score > 0.5) tags.push('marketing');
  if (persona.operations_focus_score > 0.5) tags.push('operations');
  if (persona.compliance_focus_score > 0.5) tags.push('compliance');

  return tags;
}

/**
 * Format knowledge documents for LLM context
 *
 * @param documents - Array of knowledge documents
 * @returns Formatted markdown string
 */
export function formatKnowledgeContext(
  documents: KnowledgeDocument[]
): string {
  if (documents.length === 0) {
    return '';
  }

  let context = '## Relevant Knowledge:\n\n';

  documents.forEach((doc, index) => {
    const similarity = Math.round(doc.similarity * 100);
    const source = doc.metadata?.source || 'Unknown Source';

    context += `### Document ${index + 1} (Similarity: ${similarity}%)\n`;
    context += `Source: ${source}\n\n`;
    context += `${doc.content}\n\n`;
    context += `---\n\n`;
  });

  return context;
}

/**
 * Get formatted knowledge context for LLM
 *
 * @param query - User query
 * @param persona - User persona
 * @param limit - Max documents
 * @returns Formatted context string
 */
export async function getContextForLLM(
  query: string,
  persona: PersonaScores,
  limit: number = 5
): Promise<string> {
  const documents = await searchKnowledgeBase(query, persona, limit);
  return formatKnowledgeContext(documents);
}

/**
 * Get documents for specific pain points
 *
 * @param painPoints - Array of pain point IDs
 * @param limitPerPainPoint - Docs per pain point
 * @returns Map of pain point to documents
 */
export async function getPainPointDocuments(
  painPoints: string[],
  limitPerPainPoint: number = 3
): Promise<Record<string, KnowledgeDocument[]>> {
  const results: Record<string, KnowledgeDocument[]> = {};

  for (const painPoint of painPoints) {
    try {
      // Query by pain_point_tags
      const { data, error } = await supabaseAdmin
        .from('knowledge_base')
        .select('*')
        .contains('pain_point_tags', [painPoint])
        .limit(limitPerPainPoint);

      if (!error && data) {
        results[painPoint] = data;
      }
    } catch (error) {
      console.error(`Error fetching docs for ${painPoint}:`, error);
    }
  }

  return results;
}

TYPE DEFINITIONS:
────────────────────────────────────────────────────────
interface KnowledgeDocument {
  id: string;
  content: string;
  metadata: Record<string, any>;
  similarity: number;
}
```

---

## Content Population

```
┌─────────────────────────────────────────────────────────────────┐
│              POPULATING KNOWLEDGE BASE                          │
└─────────────────────────────────────────────────────────────────┘

STEP 1: Create Content
────────────────────────────────────────────────────────
• Write domain-specific documents
• Cover all pain points and persona types
• 50+ documents recommended
• Length: 200-500 words per document

STEP 2: Generate Embeddings
────────────────────────────────────────────────────────
Script: lib/scripts/populate-knowledge-base.ts

import { generateEmbedding } from '@/lib/ai/embeddings';
import { supabaseAdmin } from '@/lib/supabase/client';

const documents = [
  {
    content: "Field sales ROI can be calculated by...",
    metadata: { source: "ROI Best Practices" },
    persona_tags: ["supplier", "sales", "mid_sized"],
    pain_point_tags: ["execution_blind_spot"],
    source_type: "research-doc"
  },
  // ... more documents
];

async function populateKnowledgeBase() {
  for (const doc of documents) {
    // Generate embedding
    const embedding = await generateEmbedding(doc.content);

    // Insert into database
    const { error } = await supabaseAdmin
      .from('knowledge_base')
      .insert({
        ...doc,
        embedding
      });

    if (error) {
      console.error('Error inserting document:', error);
    } else {
      console.log('✓ Inserted:', doc.metadata.source);
    }

    // Rate limiting: Wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

populateKnowledgeBase();

STEP 3: Verify Index
────────────────────────────────────────────────────────
-- Check HNSW index exists
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'knowledge_base'
AND indexname = 'idx_kb_embedding';

-- Test query performance
EXPLAIN ANALYZE
SELECT id, content,
  1 - (embedding <=> '[0.1, 0.2, ..., 0.3]') as similarity
FROM knowledge_base
ORDER BY embedding <=> '[0.1, 0.2, ..., 0.3]'
LIMIT 5;

-- Should show: "Index Scan using idx_kb_embedding on knowledge_base"

STEP 4: Validate Search
────────────────────────────────────────────────────────
• Test with sample queries
• Verify persona filtering works
• Check similarity scores (should be 0.5-1.0)
• Confirm relevant results returned
```

---

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────────┐
│              PERFORMANCE OPTIMIZATION                           │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Query Time Breakdown                             │
├──────────────────────────────────────────────────┤
│ Embedding Generation:      50-200ms             │
│ Vector Search (HNSW):       10-50ms             │
│ Result Formatting:           1-5ms              │
│ ─────────────────────────────────────           │
│ Total:                     ~60-250ms            │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Optimization Strategies                          │
├──────────────────────────────────────────────────┤
│ 1. HNSW Index                                    │
│    • O(log n) search instead of O(n)            │
│    • Essential for 1000+ documents              │
│                                                  │
│ 2. Persona Filtering                             │
│    • GIN index on persona_tags                  │
│    • Reduces search space dramatically          │
│    • Filter before vector search                │
│                                                  │
│ 3. Result Limit                                  │
│    • Default: 5 documents                       │
│    • More results = slower + diluted quality    │
│    • 5-10 documents optimal for LLM context     │
│                                                  │
│ 4. Caching (Optional)                            │
│    • Cache common query embeddings              │
│    • Cache search results for popular queries   │
│    • TTL: 1 hour                                │
│                                                  │
│ 5. Batch Processing                              │
│    • When populating KB, batch inserts          │
│    • Use COPY for bulk inserts                  │
│    • Rate limit API calls (10 req/sec)          │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Index Tuning                                     │
├──────────────────────────────────────────────────┤
│ HNSW Parameters:                                 │
│   m (max connections): 16 (default)             │
│   ef_construction: 64 (default)                 │
│                                                  │
│ For larger datasets (10K+ docs):                │
│   CREATE INDEX idx_kb_embedding                 │
│     ON knowledge_base                           │
│     USING hnsw (embedding vector_cosine_ops)    │
│     WITH (m = 24, ef_construction = 100);       │
│                                                  │
│ Trade-off: Higher = better accuracy, slower     │
└──────────────────────────────────────────────────┘
```

---

## Usage in Other Systems

```
┌─────────────────────────────────────────────────────────────────┐
│          HOW OTHER SYSTEMS USE KNOWLEDGE BASE                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ AI Orchestrator                                  │
├──────────────────────────────────────────────────┤
│ Uses Knowledge Base to:                          │
│ • Get context for user queries                  │
│ • Enrich LLM system prompts                     │
│ • Provide domain-specific information           │
│                                                  │
│ Flow:                                            │
│ 1. User sends message                           │
│ 2. Orchestrator calls getContextForLLM()        │
│ 3. Gets 5 relevant documents                    │
│ 4. Formats as context string                    │
│ 5. Includes in system prompt                    │
│ 6. LLM generates response with context          │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Persona Detection System                        │
├──────────────────────────────────────────────────┤
│ Uses Knowledge Base through:                    │
│ • Persona scores → Filter tags                  │
│ • getPainPointDocuments() for guidance          │
│                                                  │
│ Flow:                                            │
│ 1. Detect user's pain points                    │
│ 2. Get relevant documents for those pain points │
│ 3. Use in prompts to address pain points        │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ Dynamic UI Generation System                    │
├──────────────────────────────────────────────────┤
│ Uses Knowledge Base to:                          │
│ • Enrich page content with facts                │
│ • Provide accurate industry data                │
│ • Support generated metrics                     │
│                                                  │
│ Flow:                                            │
│ 1. Intent classified (e.g., territory_analysis) │
│ 2. Search KB for relevant territory docs        │
│ 3. Pass to Claude for page generation           │
│ 4. Claude uses KB content in page spec          │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ System Prompts                                   │
├──────────────────────────────────────────────────┤
│ Uses Knowledge Base via:                         │
│ • getContextForLLM() injection                  │
│                                                  │
│ Prompt Structure:                                │
│ """                                              │
│ You are BevGenie...                             │
│                                                  │
│ ## Background Context:                           │
│ {knowledge_context}                              │
│                                                  │
│ User: {user_message}                            │
│ """                                              │
└──────────────────────────────────────────────────┘
```

---

## Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTEM DEPENDENCIES                          │
└─────────────────────────────────────────────────────────────────┘

REQUIRED:
  ✓ Session System (for persona data)
  ✓ Supabase Database (for storage)
  ✓ OpenAI API (for embeddings)

OPTIONAL:
  ○ Persona Detection (improves filtering)
  ○ AI Orchestrator (main consumer)

WITHOUT PERSONA:
  • Still works with vector search only
  • No persona-based filtering
  • Returns generic results
```

---

## File References

**Core Files:**
- `lib/ai/knowledge-search.ts` - Main search functions
- `lib/ai/embeddings.ts` - OpenAI embedding generation
- `lib/supabase/migrations.sql` - Database schema
- `lib/scripts/populate-knowledge-base.ts` - Content population

**Database:**
- Table: `knowledge_base`
- Functions: `match_documents()`, `hybrid_search()`
- Indexes: HNSW (vector), GIN (arrays)

**Dependencies:**
- openai v6.7.0
- @supabase/supabase-js v2.76.1
- PostgreSQL pgvector extension

---

**Document Version:** 1.0
**Last Updated:** 2025-01-31
**Component:** Knowledge Base System
