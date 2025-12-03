const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const ethers = require('ethers');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Import local modules
const logger = require('./utils/logger');
const { getOriginSDK } = require('./integrations/origin-sdk');
const {
    FlutterwaveAdapter,
    PaystackAdapter,
    StablecoinManager
} = require('./integrations/payment-providers');
const StreamingOracleService = require('./services/oracle-service');
const { authenticateJWT } = require('./middleware/auth');

// Import routes
const songRoutes = require('./routes/songs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    logger.info(`Created logs directory at ${logsDir}`);
}

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// File upload configuration
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB max
    }
});


// Initialize services
const originSDK = getOriginSDK();
const flutterwave = new FlutterwaveAdapter({});
const paystack = new PaystackAdapter({});
const stablecoinManager = new StablecoinManager();

let oracleService = null;
let provider = null;
let ipRegistryContract = null;
let royaltyEngineContract = null;

// Initialize blockchain connections
async function initializeBlockchain() {
    try {
        // Skip if contract addresses not configured
        if (!process.env.IP_REGISTRY_ADDRESS || !process.env.ROYALTY_ENGINE_ADDRESS) {
            logger.warn('Smart contract addresses not configured. Skipping blockchain initialization.');
            return;
        }

        provider = new ethers.JsonRpcProvider(process.env.CAMP_TESTNET_RPC);

        // Load contract ABIs
        const ipRegistryABI = require('../artifacts/contracts/core/AfroBeatsIPRegistry.sol/AfroBeatsIPRegistry.json').abi;
        const royaltyEngineABI = require('../artifacts/contracts/core/RoyaltyDistributionEngine.sol/RoyaltyDistributionEngine.json').abi;

        // Connect to contracts
        ipRegistryContract = new ethers.Contract(
            process.env.IP_REGISTRY_ADDRESS,
            ipRegistryABI,
            provider
        );

        royaltyEngineContract = new ethers.Contract(
            process.env.ROYALTY_ENGINE_ADDRESS,
            royaltyEngineABI,
            provider
        );

        logger.info('Blockchain connections initialized');
    } catch (error) {
        logger.error('Blockchain initialization failed:', error.message);
        logger.warn('Server will start without blockchain features');
    }
}

// Initialize Oracle Service
async function initializeOracle() {
    try {
        // Skip if oracle not configured
        if (!process.env.ORACLE_ADDRESS || !process.env.ORACLE_PRIVATE_KEY) {
            logger.warn('Oracle not configured. Skipping oracle initialization.');
            return;
        }

        oracleService = new StreamingOracleService({
            rpcUrl: process.env.CAMP_TESTNET_RPC,
            privateKey: process.env.ORACLE_PRIVATE_KEY,
            oracleAddress: process.env.ORACLE_ADDRESS,
            updateInterval: '0 */6 * * *' // Every 6 hours
        });

        await oracleService.initialize();
        logger.info('Oracle service initialized');
    } catch (error) {
        logger.error('Oracle initialization failed:', error.message);
        logger.warn('Server will start without oracle features');
    }
}

// ============= API ROUTES =============

// API documentation route
app.get('/api', (req, res) => {
    res.json({
        name: 'AfroBeats API',
        version: process.env.npm_package_version || '1.0.0',
        documentation: 'https://docs.afrobeats.example.com',
        endpoints: {
            songs: {
                register: 'POST /api/songs/register',
                getSong: 'GET /api/songs/:id',
                getArtistSongs: 'GET /api/songs/artist/:artistId'
            },
            health: 'GET /api/health'
        }
    });
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        blockchain: {
            connected: !!provider,
            network: process.env.CAMP_TESTNET_RPC ? 'Camp Network Testnet' : 'Not configured'
        },
        services: {
            ipfs: true, // This would check IPFS node connection in production
            database: true, // This would check DB connection
            originSdk: true // This would check Origin SDK connection
        }
    });
});

// Song routes
app.use('/api/songs', songRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
    });

    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method
    });
});

// Start server
const startServer = async () => {
    try {
        await initializeBlockchain();
        await initializeOracle();
        
        app.listen(PORT, () => {
            logger.info(`🚀 Server running on port ${PORT}`);
            logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`🔗 Allowed origins: ${process.env.ALLOWED_ORIGINS || 'All'}`);
            logger.info(`⛓️  Blockchain connected: ${!!provider}`);
            logger.info(`🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Not configured'}`);
            logger.info(`🌐 API Base URL: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

startServer();

module.exports = app;
