/**
 * Standardized error handling utilities
 */

import { logger } from './logger';

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

/**
 * Handle errors consistently across the application
 */
export function handleError(error: unknown, context?: string): string {
  const contextPrefix = context ? `[${context}] ` : '';
  
  if (error instanceof AppError) {
    logger.error(`${contextPrefix}${error.message}`, error);
    return error.message;
  }
  
  if (error instanceof Error) {
    logger.error(`${contextPrefix}${error.message}`, error);
    return error.message;
  }
  
  const message = `${contextPrefix}An unexpected error occurred`;
  logger.error(message, error);
  return 'An unexpected error occurred';
}

/**
 * Safe error extraction for API responses
 */
export function extractErrorMessage(error: unknown, defaultMessage: string = 'An error occurred'): string {
  if (typeof error === 'string') return error;
  
  if (error && typeof error === 'object') {
    if ('message' in error && typeof error.message === 'string') {
      return error.message;
    }
    if ('error' in error && typeof error.error === 'string') {
      return error.error;
    }
  }
  
  return defaultMessage;
}
