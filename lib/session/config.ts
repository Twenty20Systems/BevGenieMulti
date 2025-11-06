/**
 * Iron-Session Configuration
 *
 * Configures iron-session for encrypted, secure cookie-based session management
 * Sessions are stored entirely in cookies (no server-side storage needed)
 * Perfect for serverless Next.js applications
 */

import { IronSessionOptions } from 'iron-session';
import { SessionData, IronSessionData } from './types';

/**
 * Session encryption configuration
 *
 * The SESSION_SECRET should be:
 * - At least 32 characters (16 bytes minimum)
 * - Cryptographically random
 * - Same on all instances (for distributed systems)
 * - Never committed to git
 *
 * Generate with:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 *
 * Or on macOS/Linux:
 *   openssl rand -base64 32
 */
export function getSessionConfig(): IronSessionOptions {
  const sessionSecret = process.env.SESSION_SECRET;

  if (!sessionSecret) {
    throw new Error(
      'SESSION_SECRET environment variable is not set. ' +
        'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"'
    );
  }

  if (sessionSecret.length < 32) {
    throw new Error(
      `SESSION_SECRET must be at least 32 characters long. Current length: ${sessionSecret.length}`
    );
  }

  return {
    // Encryption configuration
    password: sessionSecret,

    // Cookie configuration
    cookieName: 'bevgenie-session',
    cookieOptions: {
      // Security settings
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',

      // Cookie expiration (30 days)
      maxAge: 30 * 24 * 60 * 60,

      // Additional security in production
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_APP_DOMAIN : undefined,
    },

    // TypeScript type safety
    ttl: 60 * 60 * 24 * 30, // 30 days in seconds
  };
}

/**
 * Default session configuration instance
 * Used in API routes and middleware
 */
export const sessionConfig = getSessionConfig();

/**
 * Session initialization helper
 * Creates a fresh session with default values
 *
 * @param sessionId - Unique identifier for the session (UUID v4)
 * @returns Fresh SessionData object
 */
export function initializeSession(sessionId: string): SessionData {
  const now = Date.now();

  return {
    sessionId,
    createdAt: now,
    lastActivityAt: now,
    persona: {
      supplier_score: 0.5,
      distributor_score: 0.5,
      craft_score: 0.33,
      mid_sized_score: 0.33,
      large_score: 0.33,
      sales_focus_score: 0.25,
      marketing_focus_score: 0.25,
      operations_focus_score: 0.25,
      compliance_focus_score: 0.25,
      pain_points_detected: [],
      pain_points_confidence: {},
      overall_confidence: 0,
      total_interactions: 0,
    },
    messageCount: 0,
    currentMode: 'fresh',
    hasCompletedOnboarding: false,
    hasBrochure: false,
    isDataConnected: false,
  };
}

/**
 * Session timeout check
 * Returns true if session has been idle for longer than IDLE_TIMEOUT
 *
 * @param lastActivityAt - Unix timestamp of last activity
 * @param idleTimeoutSeconds - Idle timeout in seconds (default: 24 hours)
 * @returns true if session has timed out
 */
export function isSessionTimedOut(
  lastActivityAt: number,
  idleTimeoutSeconds: number = 24 * 60 * 60
): boolean {
  const now = Date.now();
  const elapsedSeconds = (now - lastActivityAt) / 1000;
  return elapsedSeconds > idleTimeoutSeconds;
}

/**
 * Session expiration check
 * Returns true if session has expired (created longer than MAX_AGE ago)
 *
 * @param createdAt - Unix timestamp when session was created
 * @param maxAgeSeconds - Maximum session age in seconds (default: 30 days)
 * @returns true if session has expired
 */
export function isSessionExpired(
  createdAt: number,
  maxAgeSeconds: number = 30 * 24 * 60 * 60
): boolean {
  const now = Date.now();
  const ageSeconds = (now - createdAt) / 1000;
  return ageSeconds > maxAgeSeconds;
}

/**
 * Environment variables required for session management
 * Add these to your .env.local
 */
export const REQUIRED_SESSION_ENV_VARS = [
  'SESSION_SECRET', // Encryption key for sessions
  'NEXT_PUBLIC_SUPABASE_URL', // Supabase database URL
  'NEXT_PUBLIC_SUPABASE_ANON_KEY', // Supabase anonymous key
  'SUPABASE_SERVICE_KEY', // Supabase service role key
];

/**
 * Validate that all required environment variables are set
 * Call this in your application startup
 */
export function validateSessionEnvironment(): void {
  const missingVars = REQUIRED_SESSION_ENV_VARS.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
        `Check your .env.local file.`
    );
  }
}

/**
 * Session security recommendations
 */
export const SESSION_SECURITY = {
  // Minimum password/secret length (in bytes)
  MIN_SECRET_LENGTH: 32,

  // Cookie options
  COOKIE_OPTIONS: {
    // In production, require HTTPS (secure flag)
    SECURE_IN_PRODUCTION: true,

    // HTTP only - prevents JavaScript access to cookie
    HTTP_ONLY: true,

    // SameSite policy - prevents CSRF attacks
    SAME_SITE: 'lax' as const,

    // Cookie path
    PATH: '/',

    // Cookie max age (30 days)
    MAX_AGE: 30 * 24 * 60 * 60,
  },

  // Timeout settings
  TIMEOUTS: {
    // Session validity period
    SESSION_MAX_AGE: 30 * 24 * 60 * 60,

    // Inactivity timeout
    IDLE_TIMEOUT: 24 * 60 * 60,

    // Activity check interval
    ACTIVITY_CHECK_INTERVAL: 5 * 60, // 5 minutes
  },

  // Rotation
  ROTATE_ON_LOGIN: true,
  ROTATE_ON_PRIVILEGE_CHANGE: true,
};
