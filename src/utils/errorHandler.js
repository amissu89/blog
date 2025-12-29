/**
 * Error Handler Utility
 * Provides standardized error handling for Firebase and application errors
 */

import { useToast } from 'vue-toastification';

// Firebase error code to user-friendly message mapping
const FIREBASE_ERROR_MESSAGES = {
    // Auth errors
    'auth/email-already-in-use': 'This email is already registered. Please sign in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'This operation is not allowed. Please contact support.',
    'auth/weak-password': 'Password is too weak. Please use a stronger password.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email. Please sign up first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
    'auth/requires-recent-login': 'Please sign in again to complete this action.',

    // Firestore errors
    'permission-denied': 'You do not have permission to perform this action.',
    'not-found': 'The requested resource was not found.',
    'already-exists': 'This resource already exists.',
    'resource-exhausted': 'Too many requests. Please try again later.',
    'failed-precondition': 'Operation cannot be performed. Please try again.',
    'aborted': 'Operation was aborted. Please try again.',
    'out-of-range': 'Invalid input value provided.',
    'unimplemented': 'This feature is not yet implemented.',
    'internal': 'An internal error occurred. Please try again.',
    'unavailable': 'Service is temporarily unavailable. Please try again later.',
    'data-loss': 'Data loss detected. Please contact support.',
    'unauthenticated': 'Please sign in to continue.',

    // Storage errors
    'storage/unauthorized': 'You do not have permission to access this file.',
    'storage/canceled': 'Upload was canceled.',
    'storage/unknown': 'An unknown error occurred during file operation.',
    'storage/object-not-found': 'File not found.',
    'storage/bucket-not-found': 'Storage bucket not found.',
    'storage/project-not-found': 'Project not found.',
    'storage/quota-exceeded': 'Storage quota exceeded.',
    'storage/unauthenticated': 'Please sign in to upload files.',
    'storage/retry-limit-exceeded': 'Upload failed. Please try again.',
    'storage/invalid-checksum': 'File upload failed. Please try again.',
    'storage/canceled': 'File upload was canceled.',
};

// Default error messages by category
const DEFAULT_ERROR_MESSAGES = {
    auth: 'Authentication failed. Please try again.',
    firestore: 'Database operation failed. Please try again.',
    storage: 'File operation failed. Please try again.',
    network: 'Network error. Please check your connection.',
    unknown: 'An unexpected error occurred. Please try again.',
};

/**
 * Get user-friendly error message from Firebase error
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export function getErrorMessage(error) {
    if (!error) {
        return DEFAULT_ERROR_MESSAGES.unknown;
    }

    // Check if it's a Firebase error with a code
    if (error.code) {
        const message = FIREBASE_ERROR_MESSAGES[error.code];
        if (message) {
            return message;
        }

        // Categorize by error code prefix
        if (error.code.startsWith('auth/')) {
            return DEFAULT_ERROR_MESSAGES.auth;
        } else if (error.code.startsWith('storage/')) {
            return DEFAULT_ERROR_MESSAGES.storage;
        }
    }

    // Check for network errors
    if (error.message && error.message.includes('network')) {
        return DEFAULT_ERROR_MESSAGES.network;
    }

    // Return the original error message if it's user-friendly
    if (error.message && typeof error.message === 'string' && error.message.length < 100) {
        return error.message;
    }

    return DEFAULT_ERROR_MESSAGES.unknown;
}

/**
 * Handle error with toast notification
 * @param {Error} error - The error object
 * @param {string} customMessage - Optional custom message to prepend
 * @returns {string} The error message that was displayed
 */
export function handleError(error, customMessage = null) {
    const toast = useToast();
    const errorMessage = getErrorMessage(error);
    const fullMessage = customMessage ? `${customMessage}: ${errorMessage}` : errorMessage;

    toast.error(fullMessage);
    return errorMessage;
}

/**
 * Wrapper for async Firebase operations with error handling
 * @param {Function} operation - Async function to execute
 * @param {Object} options - Options for error handling
 * @returns {Promise} Result of the operation or null if error
 */
export async function withErrorHandling(operation, options = {}) {
    const {
        errorMessage = null,
        showToast = true,
        rethrow = false,
        onError = null,
    } = options;

    try {
        const result = await operation();
        return { success: true, data: result, error: null };
    } catch (error) {
        console.error('Operation failed:', error);

        const message = getErrorMessage(error);

        if (showToast) {
            handleError(error, errorMessage);
        }

        if (onError) {
            onError(error, message);
        }

        if (rethrow) {
            throw error;
        }

        return { success: false, data: null, error: message };
    }
}

/**
 * Create a standardized error response
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {Object} details - Additional error details
 * @returns {Object} Standardized error object
 */
export function createError(code, message, details = null) {
    return {
        code,
        message,
        details,
        timestamp: new Date().toISOString(),
    };
}

/**
 * Log error for debugging (in development) or reporting (in production)
 * @param {Error} error - The error object
 * @param {Object} context - Additional context information
 */
export function logError(error, context = {}) {
    const errorInfo = {
        message: error.message,
        code: error.code,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
    };

    if (import.meta.env.DEV) {
        console.error('Error logged:', errorInfo);
    } else {
        // In production, you could send to a logging service like Sentry
        // Example: Sentry.captureException(error, { extra: context });
    }
}
