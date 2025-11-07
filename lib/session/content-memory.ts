/**
 * Content Memory System
 * Tracks generated content to prevent repetition across multiple page generations
 */

interface ContentMemory {
  headlines: Set<string>;
  featureTitles: Set<string>;
  lastUpdated: number;
}

// In-memory storage for session content
const sessionMemory = new Map<string, ContentMemory>();

/**
 * Get or create content memory for a session
 */
export function getContentMemory(sessionId: string): ContentMemory {
  if (!sessionMemory.has(sessionId)) {
    sessionMemory.set(sessionId, {
      headlines: new Set(),
      featureTitles: new Set(),
      lastUpdated: Date.now()
    });
  }
  return sessionMemory.get(sessionId)!;
}

/**
 * Track newly generated content
 */
export function trackGeneratedContent(
  sessionId: string,
  headline: string,
  featureTitles: string[]
) {
  const memory = getContentMemory(sessionId);

  // Normalize and store
  if (headline) {
    memory.headlines.add(headline.toLowerCase().trim());
  }

  featureTitles.forEach(title => {
    if (title) {
      memory.featureTitles.add(title.toLowerCase().trim());
    }
  });

  memory.lastUpdated = Date.now();

  console.log(`📝 [Content Memory] Tracked for session ${sessionId}:`, {
    totalHeadlines: memory.headlines.size,
    totalFeatures: memory.featureTitles.size
  });
}

/**
 * Get previously used content as a warning string for AI
 */
export function getPreviouslyUsedContent(sessionId: string): string {
  const memory = getContentMemory(sessionId);

  if (memory.headlines.size === 0 && memory.featureTitles.size === 0) {
    return '';
  }

  const headlinesList = Array.from(memory.headlines).slice(0, 10);
  const featuresList = Array.from(memory.featureTitles).slice(0, 20);

  return `
⚠️ PREVIOUSLY USED CONTENT - DO NOT REPEAT:

${headlinesList.length > 0 ? `Headlines you've ALREADY used:
${headlinesList.map(h => `- ${h}`).join('\n')}
` : ''}
${featuresList.length > 0 ? `Feature titles you've ALREADY used:
${featuresList.map(f => `- ${f}`).join('\n')}
` : ''}
🚨 CRITICAL: Generate COMPLETELY DIFFERENT content!
- Don't just swap out one word (e.g., "Competitive Intelligence Dashboard" → "Competitive Intelligence Analytics")
- Use DIFFERENT core concepts entirely
- Example: Instead of repeating "Competitive", try "Territory", "Account", "Revenue", "Market Share"

✅ GOOD VARIETY EXAMPLES:
1. "Territory Coverage Optimizer"
2. "Account Penetration Engine"
3. "Revenue Opportunity Finder"
4. "Market Share Analyzer"
5. "Distribution Channel Monitor"
6. "Customer Segmentation Tool"
7. "Sales Velocity Dashboard"
8. "Growth Pattern Detector"

❌ BAD (TOO SIMILAR TO PREVIOUS):
${featuresList.slice(0, 3).map((f, i) => `${i + 1}. "${f}" with slightly different wording`).join('\n')}
`;
}

/**
 * Clear memory for a session (useful for testing)
 */
export function clearSessionMemory(sessionId: string) {
  sessionMemory.delete(sessionId);
  console.log(`🗑️ [Content Memory] Cleared session ${sessionId}`);
}

/**
 * Clean up old sessions (runs periodically)
 */
function cleanupOldSessions() {
  const now = Date.now();
  const maxAge = 3600000; // 1 hour

  for (const [id, memory] of sessionMemory.entries()) {
    if (now - memory.lastUpdated > maxAge) {
      sessionMemory.delete(id);
      console.log(`🗑️ [Content Memory] Auto-cleaned old session ${id}`);
    }
  }
}

// Run cleanup every hour
if (typeof window === 'undefined') {
  // Server-side only
  setInterval(cleanupOldSessions, 3600000);
}
