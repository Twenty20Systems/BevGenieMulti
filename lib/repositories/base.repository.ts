/**
 * Base Repository Class
 *
 * Provides common functionality for all repositories:
 * - Error handling
 * - Logging
 * - Type safety
 * - Consistent error messages
 */

import { SupabaseClient } from '@supabase/supabase-js';
import { RepositoryError, ValidationError, AuthorizationError, NotFoundError } from './types';

export abstract class BaseRepository {
  protected supabaseClient: SupabaseClient;

  constructor(client: SupabaseClient) {
    this.supabaseClient = client;
  }

  /**
   * Handle Supabase errors and convert to repository errors
   */
  protected handleError(error: unknown, operation: string): never {
    if (error instanceof RepositoryError) {
      throw error;
    }

    if (error instanceof Error) {
      const message = error.message;

      // Handle specific Supabase errors
      if (message.includes('permission denied')) {
        throw new AuthorizationError(
          `Authorization failed during ${operation}: ${message}`
        );
      }

      if (message.includes('not found') || message.includes('404')) {
        throw new NotFoundError(
          `Resource not found during ${operation}: ${message}`
        );
      }

      if (message.includes('violates') || message.includes('constraint')) {
        throw new ValidationError(
          `Validation failed during ${operation}: ${message}`
        );
      }

      throw new RepositoryError(
        `Operation failed during ${operation}: ${message}`,
        'UNKNOWN_ERROR',
        500
      );
    }

    throw new RepositoryError(
      `Unknown error during ${operation}`,
      'UNKNOWN_ERROR',
      500
    );
  }

  /**
   * Validate that a required value exists
   */
  protected validateRequired(value: unknown, fieldName: string): void {
    if (value === null || value === undefined || value === '') {
      throw new ValidationError(`${fieldName} is required`);
    }
  }

  /**
   * Validate that an array is not empty
   */
  protected validateNotEmpty(array: unknown[], fieldName: string): void {
    if (!Array.isArray(array) || array.length === 0) {
      throw new ValidationError(`${fieldName} must not be empty`);
    }
  }

  /**
   * Validate that a number is within a range
   */
  protected validateRange(
    value: number,
    min: number,
    max: number,
    fieldName: string
  ): void {
    if (value < min || value > max) {
      throw new ValidationError(
        `${fieldName} must be between ${min} and ${max}`
      );
    }
  }

  /**
   * Log debug information (can be enhanced with proper logging service)
   */
  protected log(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Repository] ${message}`, data || '');
    }
  }

  /**
   * Log errors (can be enhanced with proper logging service)
   */
  protected logError(message: string, error: unknown): void {
    console.error(`[Repository Error] ${message}`, error);
  }

  /**
   * Format date for database
   */
  protected formatDate(date: Date): string {
    return date.toISOString();
  }

  /**
   * Parse database date
   */
  protected parseDate(dateString: string): Date {
    return new Date(dateString);
  }
}
