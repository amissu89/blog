/**
 * Email validation utility
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 */
export function isValidEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Password minimum length validation
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum length required (default: 6)
 * @returns {boolean} True if password meets minimum length
 */
export function isValidPasswordLength(password, minLength = 6) {
    if (!password || typeof password !== 'string') {
        return false;
    }

    return password.length >= minLength;
}

/**
 * Password strength validation
 * @param {string} password - Password to validate
 * @returns {Object} Strength info with score and feedback
 */
export function getPasswordStrength(password) {
    if (!password) {
        return {
            score: 0,
            level: 'weak',
            feedback: 'Password is required',
            color: '#dc3545'
        };
    }

    let score = 0;
    const checks = {
        length: password.length >= 8,
        hasLowerCase: /[a-z]/.test(password),
        hasUpperCase: /[A-Z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    // Calculate score
    if (checks.length) score += 20;
    if (password.length >= 12) score += 10;
    if (checks.hasLowerCase) score += 15;
    if (checks.hasUpperCase) score += 15;
    if (checks.hasNumber) score += 20;
    if (checks.hasSpecialChar) score += 20;

    // Determine strength level
    let level, feedback, color;
    if (score < 40) {
        level = 'weak';
        feedback = 'Weak password. Add more characters and variety.';
        color = '#dc3545'; // red
    } else if (score < 70) {
        level = 'medium';
        feedback = 'Medium strength. Consider adding special characters.';
        color = '#ffc107'; // yellow
    } else {
        level = 'strong';
        feedback = 'Strong password!';
        color = '#28a745'; // green
    }

    return {
        score,
        level,
        feedback,
        color,
        checks
    };
}

/**
 * Password match validation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {boolean} True if passwords match
 */
export function doPasswordsMatch(password, confirmPassword) {
    if (!password || !confirmPassword) {
        return false;
    }

    return password === confirmPassword;
}

/**
 * Validate email format and provide feedback
 * @param {string} email - Email to validate
 * @returns {Object} Validation result with isValid and message
 */
export function validateEmail(email) {
    if (!email) {
        return {
            isValid: false,
            message: 'Email is required'
        };
    }

    if (!isValidEmail(email)) {
        return {
            isValid: false,
            message: 'Please enter a valid email address'
        };
    }

    return {
        isValid: true,
        message: ''
    };
}

/**
 * Validate password and provide feedback
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum length (default: 6)
 * @returns {Object} Validation result with isValid and message
 */
export function validatePassword(password, minLength = 6) {
    if (!password) {
        return {
            isValid: false,
            message: 'Password is required'
        };
    }

    if (!isValidPasswordLength(password, minLength)) {
        return {
            isValid: false,
            message: `Password must be at least ${minLength} characters long`
        };
    }

    return {
        isValid: true,
        message: ''
    };
}

/**
 * Constants
 */
export const VALIDATION_CONSTANTS = {
    MIN_PASSWORD_LENGTH: 6,
    RECOMMENDED_PASSWORD_LENGTH: 8,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};
