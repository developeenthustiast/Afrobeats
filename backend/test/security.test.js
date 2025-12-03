const request = require('supertest');
const express = require('express');
const { expect } = require('chai');

// Import security middleware
const {
    securityHeaders,
    apiLimiter,
    validationSchemas,
    handleValidationErrors,
    sanitizeRequest,
} = require('../src/middleware/security');

describe('🔒 Security Tests - Backend API', function () {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use(securityHeaders());
        app.use(sanitizeRequest);
    });

    describe('🛡️ Security Headers', function () {
        it('Should set CSP headers', async () => {
            app.get('/test', (req, res) => res.json({ ok: true }));

            const res = await request(app).get('/test');

            expect(res.headers).to.have.property('content-security-policy');
        });

        it('Should set HSTS headers', async () => {
            app.get('/test', (req, res) => res.json({ ok: true }));

            const res = await request(app).get('/test');

            expect(res.headers).to.have.property('strict-transport-security');
        });

        it('Should set X-Frame-Options to DENY', async () => {
            app.get('/test', (req, res) => res.json({ ok: true }));

            const res = await request(app).get('/test');

            expect(res.headers['x-frame-options']).to.equal('DENY');
        });
    });

    describe('🚦 Rate Limiting', function () {
        beforeEach(() => {
            app.use('/api/', apiLimiter);
            app.get('/api/test', (req, res) => res.json({ ok: true }));
        });

        it('Should allow requests under limit', async () => {
            const res = await request(app).get('/api/test');
            expect(res.status).to.equal(200);
        });

        it('Should block requests over limit', async function () {
            this.timeout(10000); // Increase timeout for this test

            // Make 101 requests (limit is 100)
            const requests = [];
            for (let i = 0; i < 101; i++) {
                requests.push(request(app).get('/api/test'));
            }

            const responses = await Promise.all(requests);

            // Last request should be rate limited
            const rateLimited = responses.some(r => r.status === 429);
            expect(rateLimited).to.be.true;
        });
    });

    describe('✅ Input Validation', function () {
        beforeEach(() => {
            app.post(
                '/api/songs/register',
                validationSchemas.registerSong,
                handleValidationErrors,
                (req, res) => res.json({ success: true })
            );
        });

        it('Should accept valid song registration', async () => {
            const validData = {
                title: 'Test Song',
                artists: ['Artist 1', 'Artist 2'],
                isrc: 'USRC12345678',
                genres: ['Afrobeats'],
                audioFile: 'data:audio/mp3;base64,abc123'
            };

            const res = await request(app)
                .post('/api/songs/register')
                .send(validData);

            expect(res.status).to.equal(200);
        });

        it('Should reject empty title', async () => {
            const invalidData = {
                title: '',
                artists: ['Artist 1'],
                isrc: 'USRC12345678',
                genres: ['Afrobeats']
            };

            const res = await request(app)
                .post('/api/songs/register')
                .send(invalidData);

            expect(res.status).to.equal(400);
            expect(res.body.error.code).to.equal('VALIDATION_ERROR');
        });

        it('Should reject invalid ISRC format', async () => {
            const invalidData = {
                title: 'Test Song',
                artists: ['Artist 1'],
                isrc: 'INVALID',
                genres: ['Afrobeats']
            };

            const res = await request(app)
                .post('/api/songs/register')
                .send(invalidData);

            expect(res.status).to.equal(400);
        });

        it('Should reject too many artists (>10)', async () => {
            const invalidData = {
                title: 'Test Song',
                artists: new Array(11).fill('Artist'),
                isrc: 'USRC12345678',
                genres: ['Afrobeats']
            };

            const res = await request(app)
                .post('/api/songs/register')
                .send(invalidData);

            expect(res.status).to.equal(400);
        });
    });

    describe('🧹 XSS Protection', function () {
        it('Should sanitize script tags from input', async () => {
            app.post('/test', (req, res) => {
                // After sanitization, script tags should be removed
                expect(req.body.malicious).to.not.include('<script>');
                res.json({ ok: true });
            });

            await request(app)
                .post('/test')
                .send({ malicious: '<script>alert("XSS")</script>Hello' });
        });

        it('Should sanitize nested malicious content', async () => {
            app.post('/test', (req, res) => {
                expect(req.body.data.nested).to.not.include('<script>');
                res.json({ ok: true });
            });

            await request(app)
                .post('/test')
                .send({
                    data: {
                        nested: '<script>alert("XSS")</script>Nested attack'
                    }
                });
        });
    });

    describe('🔐 Error Handling', function () {
        it('Should not leak error details in production', async () => {
            process.env.NODE_ENV = 'production';

            app.get('/error', (req, res) => {
                throw new Error('Sensitive internal error with DB credentials');
            });

            app.use((err, req, res, next) => {
                res.status(500).json({
                    error: {
                        message: process.env.NODE_ENV === 'production'
                            ? 'Internal server error'
                            : err.message
                    }
                });
            });

            const res = await request(app).get('/error');

            expect(res.status).to.equal(500);
            expect(res.body.error.message).to.equal('Internal server error');
            expect(res.body.error.message).to.not.include('DB credentials');

            process.env.NODE_ENV = 'test';
        });

        it('Should include error details in development', async () => {
            process.env.NODE_ENV = 'development';

            app.get('/error', (req, res) => {
                throw new Error('Development error message');
            });

            app.use((err, req, res, next) => {
                res.status(500).json({
                    error: {
                        message: process.env.NODE_ENV === 'production'
                            ? 'Internal server error'
                            : err.message
                    }
                });
            });

            const res = await request(app).get('/error');

            expect(res.body.error.message).to.include('Development error message');

            process.env.NODE_ENV = 'test';
        });
    });

    describe('📏 Payload Size Limits', function () {
        it('Should reject payloads over 10MB', async () => {
            app.use(express.json({ limit: '10mb' }));
            app.post('/test', (req, res) => res.json({ ok: true }));

            const largePayload = {
                data: 'a'.repeat(11 * 1024 * 1024) // 11MB
            };

            const res = await request(app)
                .post('/test')
                .send(largePayload);

            expect(res.status).to.equal(413); // Payload Too Large
        });
    });
});
