/**
 * Security Middleware - Express.js
 * 
 * Implements critical security headers, rate limiting, and input validation
 */

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, param, query, validationResult } = require('express-validator');

/**
 * Security Headers Middleware
 * Implements OWASP recommendations
 */
function securityHeaders() {
    return helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                scriptSrc: ["'self'"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https:", "blob:"],
                connectSrc: ["'self'", "https://rpc.camp.network"],
                frameSrc: ["'none'"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true,
        },
        frameguard: { action: 'deny' },
        noSniff: true,
        xssFilter: true,
    });
}

/**
 * Rate Limiting Middleware
 * Prevents DDoS and brute force attacks
 */
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: {
            message: 'Too many requests, please try again later.',
            code: 'RATE_LIMIT_EXCEEDED',
            retryAfter: '15 minutes',
        },
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health';
    },
});

/**
 * Strict rate limiting for sensitive endpoints
 */
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 attempts per hour
    message: {
        error: {
            message: 'Too many authentication attempts.',
            code: 'AUTH_RATE_LIMIT',
            retryAfter: '1 hour',
        },
    },
});

/**
 * Input Validation Schemas
 */
const validationSchemas = {
    // Song registration
    registerSong: [
        body('title')
            .isString()
            .trim()
            .isLength({ min: 1, max: 200 })
            .withMessage('Title must be 1-200 characters'),
        body('artists')
            .isArray({ min: 1, max: 10 })
            .withMessage('Must have 1-10 artists'),
        body('artists.*')
            .isString()
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Artist names must be 1-100 characters'),
        body('isrc')
            .matches(/^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/)
            .withMessage('Invalid ISRC format'),
        body('genres')
            .isArray({ min: 1, max: 5 })
            .withMessage('Must have 1-5 genres'),
        body('audioFile')
            .optional()
            .isString()
            .withMessage('Audio file must be a string'),
    ],

    // Token ID parameter
    tokenId: [
        param('tokenId')
            .isInt({ min: 0 })
            .toInt()
            .withMessage('Token ID must be a non-negative integer'),
    ],

    // Pagination
    pagination: [
        query('page')
            .optional()
            .isInt({ min: 1, max: 1000 })
            .toInt()
            .withMessage('Page must be 1-1000'),
        query('limit')
            .optional()
            .isInt({ min: 1, max: 100 })
            .toInt()
            .withMessage('Limit must be 1-100'),
    ],

    // Address parameter
    address: [
        param('address')
            .matches(/^0x[a-fA-F0-9]{40}$/)
            .withMessage('Invalid Ethereum address'),
    ],
};

/**
 * Validation Result Handler
 */
function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: {
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: errors.array(),
            },
        });
    }
    next();
}

/**
 * Secure Error Handler
 * Sanitizes errors before sending to client
 */
function errorHandler(err, req, res, next) {
    // Log full error server-side
    const logger = require('./logger');
    logger.error('Request error:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
    });

    // Determine status code
    const statusCode = err.status || err.statusCode || 500;

    // Send sanitized error to client
    res.status(statusCode).json({
        error: {
            message: process.env.NODE_ENV === 'production'
                ? getGenericErrorMessage(statusCode)
                : err.message,
            code: err.code || 'INTERNAL_ERROR',
            ...(process.env.NODE_ENV !== 'production' && { details: err.details }),
        },
    });
}

/**
 * Get generic error message by status code
 */
function getGenericErrorMessage(statusCode) {
    const messages = {
        400: 'Bad request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not found',
        429: 'Too many requests',
        500: 'Internal server error',
        502: 'Bad gateway',
        503: 'Service unavailable',
    };
    return messages[statusCode] || 'An error occurred';
}

/**
 * Request sanitization
 * Remove potentially dangerous characters
 */
function sanitizeRequest(req, res, next) {
    // Sanitize query parameters
    for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
            req.query[key] = req.query[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        }
    }

    // Sanitize body
    if (req.body && typeof req.body === 'object') {
        sanitizeObject(req.body);
    }

    next();
}

function sanitizeObject(obj) {
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObject(obj[key]);
        }
    }
}

/**
 * CORS Configuration
 */
function corsConfig() {
    const cors = require('cors');

    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:3000', 'http://localhost:3001'];

    return cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (mobile apps, Postman, etc.)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = 'CORS policy does not allow access from this origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        credentials: true,
        optionsSuccessStatus: 200,
    });
}

module.exports = {
    securityHeaders,
    apiLimiter,
    authLimiter,
    validationSchemas,
    handleValidationErrors,
    errorHandler,
    sanitizeRequest,
    corsConfig,
};
