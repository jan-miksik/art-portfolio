/**
 * Centralized error handling utility
 * Provides consistent error handling patterns across the application
 */

import { logger } from './logger'

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage?: string,
    public context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

export enum ErrorCode {
  // Contentful errors
  CONTENTFUL_UPLOAD_FAILED = 'CONTENTFUL_UPLOAD_FAILED',
  CONTENTFUL_UPDATE_FAILED = 'CONTENTFUL_UPDATE_FAILED',
  CONTENTFUL_PUBLISH_FAILED = 'CONTENTFUL_PUBLISH_FAILED',
  CONTENTFUL_DELETE_FAILED = 'CONTENTFUL_DELETE_FAILED',
  CONTENTFUL_FETCH_FAILED = 'CONTENTFUL_FETCH_FAILED',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Unknown errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

const USER_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.CONTENTFUL_UPLOAD_FAILED]: 'Failed to upload. Please try again.',
  [ErrorCode.CONTENTFUL_UPDATE_FAILED]: 'Failed to update. Please try again.',
  [ErrorCode.CONTENTFUL_PUBLISH_FAILED]: 'Failed to publish. Please try again.',
  [ErrorCode.CONTENTFUL_DELETE_FAILED]: 'Failed to delete. Please try again.',
  [ErrorCode.CONTENTFUL_FETCH_FAILED]: 'Failed to load data. Please refresh the page.',
  [ErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection.',
  [ErrorCode.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  [ErrorCode.VALIDATION_ERROR]: 'Invalid data. Please check your input.',
  [ErrorCode.INVALID_INPUT]: 'Invalid input provided.',
  [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
}

/**
 * Extracts user-friendly error message from an error
 */
export const getErrorMessage = (error: unknown, context?: string): string => {
  if (error instanceof AppError) {
    return error.userMessage || error.message
  }
  
  if (error instanceof Error) {
    // Check for specific error patterns
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return USER_MESSAGES[ErrorCode.NETWORK_ERROR]
    }
    if (error.message.includes('timeout')) {
      return USER_MESSAGES[ErrorCode.TIMEOUT_ERROR]
    }
    return error.message
  }
  
  return USER_MESSAGES[ErrorCode.UNKNOWN_ERROR]
}

export const handleError = (
  error: unknown,
  context?: string,
  code: ErrorCode = ErrorCode.UNKNOWN_ERROR
): string => {
  const contextInfo = context ? `[${context}]` : ''
  
  if (error instanceof AppError) {
    logger.error(`${contextInfo} ${error.code}:`, error.message, error.context)
    return error.userMessage || error.message
  }
  
  if (error instanceof Error) {
    logger.error(`${contextInfo} Error:`, error.message, {
      stack: error.stack,
      name: error.name
    })
    return getErrorMessage(error, context)
  }
  
  logger.error(`${contextInfo} Unknown error:`, error)
  return USER_MESSAGES[code]
}

export const createAppError = (
  error: unknown,
  context?: string,
  code: ErrorCode = ErrorCode.UNKNOWN_ERROR,
  additionalContext?: Record<string, unknown>
): AppError => {
  const contextInfo = context ? `[${context}]` : ''
  
  if (error instanceof AppError) {
    logger.error(`${contextInfo} ${error.code}:`, error.message, error.context)
    return error
  }
  
  let message: string
  let userMessage: string
  
  if (error instanceof Error) {
    logger.error(`${contextInfo} Error:`, error.message, {
      stack: error.stack,
      name: error.name,
      ...additionalContext
    })
    message = error.message
    userMessage = getErrorMessage(error, context)
  } else {
    logger.error(`${contextInfo} Unknown error:`, error, additionalContext)
    message = 'Unknown error'
    userMessage = USER_MESSAGES[code]
  }
  
  return new AppError(
    message,
    code,
    userMessage,
    additionalContext
  )
}

export const withErrorHandling = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: string,
  errorCode?: ErrorCode
): T => {
  return (async (...args: any[]) => {
    try {
      return await fn(...args)
    } catch (error) {
      throw createAppError(
        error,
        context,
        errorCode || ErrorCode.UNKNOWN_ERROR,
        { args }
      )
    }
  }) as T
}

