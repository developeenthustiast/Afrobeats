/**
 * Health Check Endpoint with Monitoring
 * 
 * Monitors backend health, blockchain connectivity, and dependencies
 */

const { ethers } = require('ethers');

class HealthCheckService {
    constructor(provider) {
        this.provider = provider;
        this.startTime = Date.now();
    }

    /**
     * Comprehensive health check
     */
    async getHealth() {
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: Math.floor((Date.now() - this.startTime) / 1000),
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            checks: {},
        };

        // Check blockchain connectivity
        health.checks.blockchain = await this.checkBlockchain();

        // Check database (if configured)
        if (process.env.DATABASE_URL) {
            health.checks.database = await this.checkDatabase();
        }

        // Check Redis (if configured)
        if (process.env.REDIS_URL) {
            health.checks.redis = await this.checkRedis();
        }

        // Check external APIs
        health.checks.ipfs = await this.checkIPFS();

        // Memory usage
        const memoryUsage = process.memoryUsage();
        health.memory = {
            used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
            percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100),
        };

        // Determine overall status
        const allChecks = Object.values(health.checks);
        if (allChecks.some(check => check.status === 'unhealthy')) {
            health.status = 'unhealthy';
        } else if (allChecks.some(check => check.status === 'degraded')) {
            health.status = 'degraded';
        }

        return health;
    }

    /**
     * Check blockchain connectivity
     */
    async checkBlockchain() {
        try {
            const blockNumber = await Promise.race([
                this.provider.getBlockNumber(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 5000)
                ),
            ]);

            return {
                status: 'healthy',
                blockNumber,
                message: `Connected to block ${blockNumber}`,
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                message: 'Blockchain connection failed',
            };
        }
    }

    /**
     * Check database connectivity
     */
    async checkDatabase() {
        try {
            const { PrismaClient } = require('@prisma/client');
            const prisma = new PrismaClient();

            await Promise.race([
                prisma.$queryRaw`SELECT 1`,
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 3000)
                ),
            ]);

            await prisma.$disconnect();

            return {
                status: 'healthy',
                message: 'Database connected',
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                message: 'Database connection failed',
            };
        }
    }

    /**
     * Check Redis connectivity
     */
    async checkRedis() {
        try {
            const redis = require('redis');
            const client = redis.createClient({
                url: process.env.REDIS_URL,
            });

            await client.connect();
            await client.ping();
            await client.disconnect();

            return {
                status: 'healthy',
                message: 'Redis connected',
            };
        } catch (error) {
            return {
                status: 'degraded',
                error: error.message,
                message: 'Redis unavailable (caching disabled)',
            };
        }
    }

    /**
     * Check IPFS connectivity
     */
    async checkIPFS() {
        try {
            // Simple check - in production would verify IPFS gateway
            const response = await Promise.race([
                fetch('https://ipfs.io'),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 3000)
                ),
            ]);

            return {
                status: response.ok ? 'healthy' : 'degraded',
                message: response.ok ? 'IPFS accessible' : 'IPFS degraded',
            };
        } catch (error) {
            return {
                status: 'degraded',
                error: error.message,
                message: 'IPFS check failed',
            };
        }
    }

    /**
     * Readiness check (for Kubernetes)
     */
    async isReady() {
        const health = await this.getHealth();
        return health.status !== 'unhealthy';
    }

    /**
     * Liveness check (for Kubernetes)
     */
    isAlive() {
        // Simple check - server is responding
        return true;
    }
}

module.exports = HealthCheckService;
