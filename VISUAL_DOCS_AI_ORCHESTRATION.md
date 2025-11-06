# Visual Documentation: AI Orchestration System

## Technical Stack

| Component | Technology | Details |
|-----------|-----------|---------|
| **Chat LLM** | OpenAI GPT-4o | Model: `gpt-4o` |
| **Library** | @openai/sdk | Version: ^6.7.0 |
| **Temperature** | 0.7 | Balanced creativity/consistency |
| **Max Tokens** | 300 | Concise responses |
| **Streaming** | Server-Sent Events | Real-time response delivery |
| **File Location** | lib/ai/orchestrator.ts | Core orchestration logic |
| **Main Function** | processChat() | Central coordination hub |

## System Overview

The AI Orchestration System is the **central nervous system** of BevGenie. It coordinates all AI-powered features and connects every major subsystem together.

```
┌─────────────────────────────────────────────────────────────────┐
│                   AI ORCHESTRATION SYSTEM                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              processChat() - Main Pipeline                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Coordinates:                                                    │
│  • Persona Detection        → Analyze user signals              │
│  • Session Management       → Store conversation state          │
│  • Knowledge Base           → Retrieve relevant context         │
│  • Dynamic UI Generation    → Create interactive pages          │
│  • OpenAI GPT-4o           → Generate chat responses            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Architecture Diagram

```
                    ┌─────────────────┐
                    │   User Message  │
                    └────────┬────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  processChat(message, mode)  │
              │  lib/ai/orchestrator.ts      │
              └──────────────┬───────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
    ┌─────────┐      ┌──────────────┐    ┌─────────┐
    │ Session │      │   Persona    │    │ Intent  │
    │ System  │      │  Detection   │    │Classify │
    └────┬────┘      └──────┬───────┘    └────┬────┘
         │                  │                  │
         │                  │                  │
         ▼                  ▼                  │
    Get Current       Detect Signals          │
    Persona Scores    from Message            │
         │                  │                  │
         │                  │                  │
         └─────────┬────────┘                  │
                   │                           │
                   ▼                           │
          Update Persona                       │
          in Session                           │
                   │                           │
                   └────────────┬──────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   Knowledge Base      │
                    │   Search (Top 5)      │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Build AI Context     │
                    │  • Persona            │
                    │  • KB Documents       │
                    │  • Conversation       │
                    └───────────┬───────────┘
                                │
                                ▼
                        ┌───────────────┐
                        │ Decision Point│
                        │  Mode Check   │
                        └───────┬───────┘
                                │
                  ┌─────────────┴─────────────┐
                  │                           │
            mode='text'                 mode='generate'
                  │                           │
                  ▼                           ▼
        ┌─────────────────┐         ┌─────────────────┐
        │  OpenAI GPT-4o  │         │  Claude Sonnet  │
        │  Chat Response  │         │  Page Generation│
        └────────┬────────┘         └────────┬────────┘
                 │                           │
                 │                           │
                 └──────────┬────────────────┘
                            │
                            ▼
                ┌───────────────────────┐
                │ Save to Conversation  │
                │ History (Session)     │
                └───────────┬───────────┘
                            │
                            ▼
                   ┌────────────────┐
                   │ Return Result  │
                   │ to Client      │
                   └────────────────┘
```

## Data Flow: Step-by-Step

### Step 1: Initialize Request
```typescript
// Client sends message
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    message: "Show me ROI for beverage distributors",
    mode: 'generate'
  })
});
```

### Step 2: Get Session & Current Persona
```typescript
// In processChat()
const session = await getSession();
const currentPersona = session.persona || {
  distributor: 0.0,
  sales_leader: 0.0,
  operations_manager: 0.0,
  technology_buyer: 0.0
};
```

### Step 3: Detect Persona Signals
```typescript
// Analyze message for persona indicators
const signals = await detectPersonaSignals(message);

// Example signals detected:
// [{
//   persona: 'distributor',
//   strength: 'STRONG',
//   keywords: ['ROI', 'beverage', 'distributors'],
//   confidence: 0.3
// }]
```

### Step 4: Update Persona Scores
```typescript
// Update session with new signals
const updatedPersona = await updatePersonaWithSignals(
  currentPersona,
  signals,
  message
);

// Save to session
await updatePersona(updatedPersona);

// Result: distributor score increases by 0.3
```

### Step 5: Search Knowledge Base
```typescript
// Find relevant context
const kbDocs = await searchKnowledgeBase(
  message,
  updatedPersona,
  5  // Top 5 documents
);

// Returns documents about:
// - ROI calculations
// - Distributor pain points
// - Case studies
```

### Step 6: Build AI Context
```typescript
// Construct comprehensive prompt
const systemPrompt = `
You are BevGenie, an AI assistant for beverage distribution.

Current Persona Scores:
- Distributor: 0.65
- Sales Leader: 0.15
- Operations Manager: 0.10
- Technology Buyer: 0.10

Relevant Context:
${kbDocs.map(doc => doc.content).join('\n\n')}

User Message: ${message}
`;
```

### Step 7: Decision - Text or Generate Mode

#### 7A: Text Mode (Simple Chat Response)
```typescript
if (mode === 'text') {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ],
    temperature: 0.7,
    max_tokens: 300,
    stream: true
  });

  // Stream response back to client
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}
```

#### 7B: Generate Mode (Create UI Page)
```typescript
if (mode === 'generate') {
  // Use Claude to generate page specification
  const pageSpec = await generatePageWithClaude(
    message,
    updatedPersona,
    kbDocs
  );

  // Returns BevGeniePage JSON structure
  return {
    type: 'page_generated',
    page: pageSpec
  };
}
```

### Step 8: Save Conversation
```typescript
// Record interaction in session
await addConversationMessage(
  'user',
  message,
  mode,
  null
);

await addConversationMessage(
  'assistant',
  responseText,
  mode,
  pageSpec  // Only if mode='generate'
);
```

## Dependencies

### 🔗 DEPENDS ON: Session Management System
```
┌──────────────────────────────────────┐
│     Session Management System        │
│                                      │
│  • getSession()                      │
│  • updatePersona()                   │
│  • addConversationMessage()          │
│  • getConversationHistory()          │
└──────────────────────────────────────┘
                  ▲
                  │
                  │ Uses session API
                  │
┌─────────────────┴─────────────────────┐
│      AI Orchestration System          │
│                                       │
│  Needs session to:                    │
│  • Get current persona scores         │
│  • Update scores after detection      │
│  • Save conversation messages         │
│  • Retrieve chat history              │
└───────────────────────────────────────┘
```

### 🔗 DEPENDS ON: Persona Detection System
```
┌──────────────────────────────────────┐
│     Persona Detection System         │
│                                      │
│  • detectPersonaSignals()            │
│  • updatePersonaWithSignals()        │
└──────────────────────────────────────┘
                  ▲
                  │
                  │ Calls detection functions
                  │
┌─────────────────┴─────────────────────┐
│      AI Orchestration System          │
│                                       │
│  Needs detection to:                  │
│  • Identify persona signals           │
│  • Calculate confidence scores        │
│  • Update persona profile             │
└───────────────────────────────────────┘
```

### 🔗 DEPENDS ON: Knowledge Base System
```
┌──────────────────────────────────────┐
│     Knowledge Base System            │
│                                      │
│  • searchKnowledgeBase()             │
│  • Returns: KnowledgeDocument[]      │
└──────────────────────────────────────┘
                  ▲
                  │
                  │ Searches for context
                  │
┌─────────────────┴─────────────────────┐
│      AI Orchestration System          │
│                                       │
│  Needs KB to:                         │
│  • Get relevant domain knowledge      │
│  • Personalize responses              │
│  • Provide accurate information       │
└───────────────────────────────────────┘
```

### 🔗 DEPENDS ON: Dynamic UI Generation System
```
┌──────────────────────────────────────┐
│   Dynamic UI Generation System       │
│                                      │
│  • generatePageWithClaude()          │
│  • Returns: BevGeniePage             │
└──────────────────────────────────────┘
                  ▲
                  │
                  │ Generates pages
                  │
┌─────────────────┴─────────────────────┐
│      AI Orchestration System          │
│                                       │
│  Uses UI generation when:             │
│  • mode='generate'                    │
│  • User requests visual content       │
│  • Create interactive pages           │
└───────────────────────────────────────┘
```

## Code Example: Full processChat() Function

```typescript
// lib/ai/orchestrator.ts

import { openai } from '@/lib/openai';
import {
  getSession,
  updatePersona,
  addConversationMessage,
  getConversationHistory
} from '@/lib/session';
import {
  detectPersonaSignals,
  updatePersonaWithSignals
} from '@/lib/ai/persona';
import { searchKnowledgeBase } from '@/lib/knowledge/search';
import { generatePageWithClaude } from '@/lib/ai/page-generator';

export async function processChat(
  message: string,
  mode: 'text' | 'generate'
): Promise<AsyncIterable<string> | { type: string; page: any }> {

  // 1. Get current session and persona
  const session = await getSession();
  const currentPersona = session.persona || {
    distributor: 0.0,
    sales_leader: 0.0,
    operations_manager: 0.0,
    technology_buyer: 0.0
  };

  // 2. Detect persona signals from message
  const signals = await detectPersonaSignals(message);

  // 3. Update persona scores
  const updatedPersona = await updatePersonaWithSignals(
    currentPersona,
    signals,
    message
  );
  await updatePersona(updatedPersona);

  // 4. Search knowledge base for relevant context
  const kbDocs = await searchKnowledgeBase(
    message,
    updatedPersona,
    5
  );

  // 5. Build system prompt with context
  const systemPrompt = buildSystemPrompt(
    updatedPersona,
    kbDocs
  );

  // 6. Get conversation history
  const history = await getConversationHistory();

  // 7. Route based on mode
  if (mode === 'text') {
    // Text mode: Stream chat response
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 300,
      stream: true
    });

    // Save user message
    await addConversationMessage('user', message, 'text', null);

    // Collect response for saving
    let fullResponse = '';

    async function* streamWithSave() {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullResponse += content;
          yield content;
        }
      }

      // Save assistant response
      await addConversationMessage(
        'assistant',
        fullResponse,
        'text',
        null
      );
    }

    return streamWithSave();

  } else {
    // Generate mode: Create interactive page
    const pageSpec = await generatePageWithClaude(
      message,
      updatedPersona,
      kbDocs
    );

    // Save both messages
    await addConversationMessage('user', message, 'generate', null);
    await addConversationMessage(
      'assistant',
      `Generated ${pageSpec.type} page`,
      'generate',
      pageSpec
    );

    return {
      type: 'page_generated',
      page: pageSpec
    };
  }
}

function buildSystemPrompt(
  persona: PersonaScores,
  kbDocs: KnowledgeDocument[]
): string {
  return `You are BevGenie, an AI assistant specializing in beverage distribution technology.

Current User Persona:
${Object.entries(persona)
  .map(([key, value]) => `- ${key}: ${(value * 100).toFixed(0)}%`)
  .join('\n')}

Relevant Knowledge:
${kbDocs.map(doc => `
Title: ${doc.metadata?.title || 'Untitled'}
Content: ${doc.content}
`).join('\n---\n')}

Guidelines:
- Be concise and professional
- Focus on ROI and business value
- Use domain-specific terminology
- Provide actionable insights`;
}
```

## API Endpoint Integration

### /api/chat Route Handler

```typescript
// app/api/chat/route.ts

import { processChat } from '@/lib/ai/orchestrator';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { message, mode } = await req.json();

  // Validate inputs
  if (!message || typeof message !== 'string') {
    return new Response('Invalid message', { status: 400 });
  }

  if (mode !== 'text' && mode !== 'generate') {
    return new Response('Invalid mode', { status: 400 });
  }

  // Process through orchestrator
  const result = await processChat(message, mode);

  if (mode === 'text') {
    // Return streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result as AsyncIterable<string>) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
          );
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } else {
    // Return page specification
    return Response.json(result);
  }
}
```

## Performance Optimization

### Response Time Breakdown

```
User Message Received
↓
Session Load (5-10ms)
↓
Persona Detection (20-30ms)
↓
Session Update (10-15ms)
↓
Knowledge Base Search (50-100ms)
  • Embedding generation: 30ms
  • Vector search: 20-70ms
↓
Build Context (5ms)
↓
┌──────────────────┬──────────────────┐
│   Text Mode      │  Generate Mode   │
│   150-300ms      │   2-4 seconds    │
│   (Streaming)    │   (Full page)    │
└──────────────────┴──────────────────┘
↓
Save Conversation (10-15ms)
↓
Response Complete

Total (Text Mode): ~250-500ms
Total (Generate Mode): ~2.5-4.5s
```

### Optimization Strategies

1. **Parallel Processing**
   ```typescript
   // Run independent operations concurrently
   const [signals, history, kbDocs] = await Promise.all([
     detectPersonaSignals(message),
     getConversationHistory(),
     searchKnowledgeBase(message, persona, 5)
   ]);
   ```

2. **Streaming for Text Mode**
   - Start streaming immediately after OpenAI responds
   - Don't wait for full completion
   - User sees response incrementally

3. **Knowledge Base Caching**
   - HNSW index provides O(log n) search
   - Frequently accessed docs cached in memory
   - Reduces search time from 100ms to 20ms

4. **Session Optimization**
   - Session stored in encrypted cookie (no DB roundtrip)
   - Persona updates happen in-memory first
   - Batch conversation saves

## Error Handling

```typescript
export async function processChat(
  message: string,
  mode: 'text' | 'generate'
) {
  try {
    // Main processing logic...

  } catch (error) {
    console.error('AI Orchestration error:', error);

    // Determine error type
    if (error instanceof OpenAIError) {
      // OpenAI API issue
      return {
        type: 'error',
        message: 'Unable to process request. Please try again.'
      };

    } else if (error.message?.includes('session')) {
      // Session issue
      return {
        type: 'error',
        message: 'Session error. Please refresh the page.'
      };

    } else if (error.message?.includes('knowledge')) {
      // KB search issue - continue without KB context
      console.warn('KB search failed, continuing without context');
      // Retry without KB docs

    } else {
      // Unknown error
      return {
        type: 'error',
        message: 'An unexpected error occurred.'
      };
    }
  }
}
```

## Testing Strategy

### Unit Tests
```typescript
// __tests__/ai/orchestrator.test.ts

describe('AI Orchestrator', () => {
  it('should detect signals and update persona', async () => {
    const result = await processChat(
      'Show me ROI for distributors',
      'text'
    );

    const session = await getSession();
    expect(session.persona.distributor).toBeGreaterThan(0);
  });

  it('should search knowledge base', async () => {
    // Mock KB search
    const kbSearchSpy = jest.spyOn(kb, 'searchKnowledgeBase');

    await processChat('Help with territory planning', 'text');

    expect(kbSearchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      5
    );
  });

  it('should handle text mode streaming', async () => {
    const stream = await processChat('Hello', 'text');

    let chunks = 0;
    for await (const chunk of stream) {
      chunks++;
      expect(typeof chunk).toBe('string');
    }

    expect(chunks).toBeGreaterThan(0);
  });

  it('should handle generate mode', async () => {
    const result = await processChat(
      'Create ROI calculator',
      'generate'
    );

    expect(result.type).toBe('page_generated');
    expect(result.page).toHaveProperty('type');
    expect(result.page).toHaveProperty('sections');
  });
});
```

## Usage Examples

### Example 1: Text Chat
```typescript
// Client code
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What are the benefits of route optimization?',
    mode: 'text'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6));
      if (data.content) {
        // Display chunk to user
        appendToChat(data.content);
      }
    }
  }
}
```

### Example 2: Generate Page
```typescript
// Client code
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Show me ROI for beverage distributors',
    mode: 'generate'
  })
});

const result = await response.json();

if (result.type === 'page_generated') {
  // Render dynamic page
  renderBevGeniePage(result.page);
}
```

## Summary

The AI Orchestration System is the **central coordinator** that:

✅ **Integrates All Systems**
- Persona Detection → Session Management → Knowledge Base → UI Generation

✅ **Provides Dual Mode Operation**
- Text Mode: Fast streaming chat responses
- Generate Mode: Interactive page creation

✅ **Optimizes Performance**
- Parallel processing where possible
- Streaming for immediate feedback
- Efficient KB search with HNSW

✅ **Handles Errors Gracefully**
- Fallback strategies
- Informative error messages
- Logging for debugging

✅ **Maintains Conversation Context**
- Saves all interactions to session
- Builds cumulative persona profile
- Provides chat history to AI

**Key Files:**
- `lib/ai/orchestrator.ts` - Main coordination logic
- `app/api/chat/route.ts` - HTTP endpoint handler
- `lib/openai.ts` - OpenAI client configuration

**Dependencies:**
- Session Management (get/update state)
- Persona Detection (analyze signals)
- Knowledge Base (search context)
- Dynamic UI Generation (create pages)

**API:**
- OpenAI GPT-4o (chat responses)
- Model: gpt-4o, Temp: 0.7, Max tokens: 300
