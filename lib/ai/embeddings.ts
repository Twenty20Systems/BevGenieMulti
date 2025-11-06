/**
 * Embedding Generation
 *
 * Handles creation of text embeddings using OpenAI's text-embedding-3-small model
 * Embeddings are 1536 dimensions and used for vector similarity search
 */

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory cache for embeddings (no external dependencies needed!)
// Key: normalized text, Value: { embedding, timestamp }
const embeddingCache = new Map<string, { embedding: number[]; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache
const MAX_CACHE_SIZE = 1000; // Prevent memory bloat

/**
 * Normalize text for cache key (lowercase, trim, remove extra spaces)
 */
function normalizeCacheKey(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Clear expired cache entries
 */
function cleanCache(): void {
  const now = Date.now();
  for (const [key, value] of embeddingCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      embeddingCache.delete(key);
    }
  }
}

/**
 * Generate embedding for a text string
 *
 * @param text - Text to embed
 * @returns Array of 1536 numbers representing the embedding
 *
 * @example
 * ```typescript
 * const embedding = await generateEmbedding('What is ROI tracking for field teams?');
 * ```
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty');
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  // Check cache first
  const cacheKey = normalizeCacheKey(text);
  const cached = embeddingCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log('[CACHE HIT] Embedding cache hit - saved 300-500ms!');
    return cached.embedding;
  }

  // Clean cache periodically
  if (embeddingCache.size > MAX_CACHE_SIZE) {
    cleanCache();
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
    });

    // Extract embedding from response
    const embedding = response.data[0].embedding;

    if (!embedding || embedding.length === 0) {
      throw new Error('Failed to generate embedding');
    }

    // Cache the result
    embeddingCache.set(cacheKey, {
      embedding,
      timestamp: Date.now(),
    });

    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

/**
 * Generate embeddings for multiple texts
 *
 * @param texts - Array of texts to embed
 * @returns Array of embeddings
 *
 * @example
 * ```typescript
 * const embeddings = await generateEmbeddings([
 *   'First text',
 *   'Second text',
 *   'Third text'
 * ]);
 * ```
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (!texts || texts.length === 0) {
    throw new Error('Texts array cannot be empty');
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts,
      encoding_format: 'float',
    });

    // Sort by index to maintain order
    const embeddings = response.data
      .sort((a, b) => a.index - b.index)
      .map((item) => item.embedding);

    return embeddings;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

/**
 * Calculate cosine similarity between two embeddings
 *
 * @param embedding1 - First embedding vector
 * @param embedding2 - Second embedding vector
 * @returns Similarity score between 0 and 1
 *
 * @example
 * ```typescript
 * const similarity = cosineSimilarity(embedding1, embedding2);
 * if (similarity > 0.7) {
 *   console.log('Very similar!');
 * }
 * ```
 */
export function cosineSimilarity(embedding1: number[], embedding2: number[]): number {
  if (embedding1.length !== embedding2.length) {
    throw new Error('Embeddings must have the same length');
  }

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < embedding1.length; i++) {
    dotProduct += embedding1[i] * embedding2[i];
    magnitude1 += embedding1[i] * embedding1[i];
    magnitude2 += embedding2[i] * embedding2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
}

/**
 * Validate embedding dimensions
 *
 * @param embedding - Embedding to validate
 * @returns true if embedding has 1536 dimensions
 */
export function isValidEmbedding(embedding: number[]): boolean {
  return Array.isArray(embedding) && embedding.length === 1536;
}
