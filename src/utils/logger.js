/**
 * Logging Utility
 * Provides a centralized logging system that can be easily configured
 * for development and production environments
 */

// Log levels
const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4,
};

// Configuration
const config = {
    // In production, only show warnings and errors
    minLevel: process.env.NODE_ENV === 'production' ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG,
    // Enable/disable logging entirely
    enabled: true,
    // Prefix for all log messages
    prefix: '[Blog]',
    // Whether to include timestamps
    timestamps: true,
};

/**
 * Get timestamp string
 * @returns {string} Formatted timestamp
 */
function getTimestamp() {
    if (!config.timestamps) return '';
    const now = new Date();
    return `[${now.toLocaleTimeString()}]`;
}

/**
 * Format log message with prefix and timestamp
 * @param {string} level - Log level
 * @param {any[]} args - Arguments to log
 * @returns {any[]} Formatted arguments
 */
function formatMessage(level, args) {
    const parts = [];

    if (config.timestamps) {
        parts.push(getTimestamp());
    }

    parts.push(config.prefix);
    parts.push(`[${level}]`);

    return [...parts, ...args];
}

/**
 * Check if logging is allowed for a given level
 * @param {number} level - Log level to check
 * @returns {boolean} Whether logging is allowed
 */
function shouldLog(level) {
    return config.enabled && level >= config.minLevel;
}

/**
 * Logger object with different log levels
 */
const logger = {
    /**
     * Debug level logging - only in development
     * @param  {...any} args - Arguments to log
     */
    debug(...args) {
        if (shouldLog(LOG_LEVELS.DEBUG)) {
            console.log(...formatMessage('DEBUG', args));
        }
    },

    /**
     * Info level logging
     * @param  {...any} args - Arguments to log
     */
    info(...args) {
        if (shouldLog(LOG_LEVELS.INFO)) {
            console.info(...formatMessage('INFO', args));
        }
    },

    /**
     * Warning level logging
     * @param  {...any} args - Arguments to log
     */
    warn(...args) {
        if (shouldLog(LOG_LEVELS.WARN)) {
            console.warn(...formatMessage('WARN', args));
        }
    },

    /**
     * Error level logging
     * @param  {...any} args - Arguments to log
     */
    error(...args) {
        if (shouldLog(LOG_LEVELS.ERROR)) {
            console.error(...formatMessage('ERROR', args));
        }
    },

    /**
     * Group logging - useful for organizing related logs
     * @param {string} label - Group label
     */
    group(label) {
        if (shouldLog(LOG_LEVELS.DEBUG)) {
            console.group(formatMessage('GROUP', [label]).join(' '));
        }
    },

    /**
     * End group logging
     */
    groupEnd() {
        if (shouldLog(LOG_LEVELS.DEBUG)) {
            console.groupEnd();
        }
    },

    /**
     * Table logging - useful for arrays and objects
     * @param {any} data - Data to display in table format
     */
    table(data) {
        if (shouldLog(LOG_LEVELS.DEBUG)) {
            console.table(data);
        }
    },

    /**
     * Configure logger settings
     * @param {Object} options - Configuration options
     */
    configure(options) {
        Object.assign(config, options);
    },

    /**
     * Disable all logging
     */
    disable() {
        config.enabled = false;
    },

    /**
     * Enable logging
     */
    enable() {
        config.enabled = true;
    },

    /**
     * Set minimum log level
     * @param {string} level - Log level (DEBUG, INFO, WARN, ERROR, NONE)
     */
    setLevel(level) {
        if (LOG_LEVELS[level] !== undefined) {
            config.minLevel = LOG_LEVELS[level];
        }
    },
};

// For backwards compatibility and convenience
export const log = logger;
export default logger;

// Export log levels for external use
export { LOG_LEVELS };
