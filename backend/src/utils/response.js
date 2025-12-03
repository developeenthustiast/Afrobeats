/**
 * Standardized response utilities for consistent API responses
 */

/**
 * Success response with data
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const success = (res, data = null, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Error} error - Original error object (optional, only in development)
 */
const error = (res, message = 'An error occurred', statusCode = 500, error = null) => {
    const response = {
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && error && { 
            error: error.message,
            stack: error.stack 
        })
    };

    res.status(statusCode).json(response);
};

/**
 * Not found response
 * @param {Object} res - Express response object
 * @param {string} resource - Name of the resource not found
 */
const notFound = (res, resource = 'Resource') => {
    res.status(404).json({
        success: false,
        message: `${resource} not found`
    });
};

/**
 * Validation error response
 * @param {Object} res - Express response object
 * @param {Array|Object} errors - Validation errors
 */
const validationError = (res, errors) => {
    res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Array.isArray(errors) ? errors : [errors]
    });
};

/**
 * Unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Custom message (optional)
 */
const unauthorized = (res, message = 'Unauthorized') => {
    res.status(401).json({
        success: false,
        message
    });
};

/**
 * Forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Custom message (optional)
 */
const forbidden = (res, message = 'Forbidden') => {
    res.status(403).json({
        success: false,
        message
    });
};

module.exports = {
    success,
    error,
    notFound,
    validationError,
    unauthorized,
    forbidden
};
