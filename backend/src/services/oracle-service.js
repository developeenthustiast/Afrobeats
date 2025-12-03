/**
 * Streaming Oracle Service
 * 
 * Simulates streaming data from Spotify/Apple Music for hackathon demo.
 * In production, would integrate with Chainlink Functions or Origin SDK data feeds.
 */

const cron = require('node-cron');
const { ethers } = require('ethers');
const logger = require('../utils/logger');

class StreamingOracleService {
    constructor(config) {
        this.provider = new ethers.JsonRpcProvider(
            config.rpcUrl || process.env.CAMP_TESTNET_RPC
        );

        this.wallet = new ethers.Wallet(
            config.privateKey || process.env.ORACLE_PRIVATE_KEY,
            this.provider
        );

        this.oracleContract = null;
        this.oracleAddress = config.oracleAddress;

        // Mock streaming data store
        this.streamingData = new Map();

        // Update interval (in production, this would be triggered by external events)
        this.updateInterval = config.updateInterval || '0 */6 * * *'; // Every 6 hours
    }

    /**
     * Initialize oracle service
     */
    async initialize() {
        try {
            // Load StreamingOracle contract
            const oracleABI = require('../../artifacts/contracts/core/StreamingOracle.sol/StreamingOracle.json').abi;

            this.oracleContract = new ethers.Contract(
                this.oracleAddress,
                oracleABI,
                this.wallet
            );

            logger.info('Streaming Oracle service initialized');

            // Start automated updates
            this.startAutomatedUpdates();
        } catch (error) {
            logger.error('Oracle initialization failed:', error.message);
            throw error;
        }
    }

    /**
     * Submit streaming data to oracle contract
     * @param {string} isrc - Song ISRC
     * @param {number} spotifyStreams - Spotify play count
     * @param {number} appleMusicStreams - Apple Music play count
     */
    async submitStreamingData(isrc, spotifyStreams, appleMusicStreams) {
        try {
            const tx = await this.oracleContract.submitStreamingData(
                isrc,
                spotifyStreams,
                appleMusicStreams
            );

            await tx.wait();

            logger.info(`Streaming data submitted for ${isrc}: Spotify=${spotifyStreams}, AppleMusic=${appleMusicStreams}`);

            return tx.hash;
        } catch (error) {
            logger.error(`Failed to submit streaming data for ${isrc}:`, error.message);
            throw error;
        }
    }

    /**
     * Batch submit streaming data
     * @param {Array} dataArray - Array of {isrc, spotifyStreams, appleMusicStreams}
     */
    async batchSubmitStreamingData(dataArray) {
        try {
            const isrcs = dataArray.map(d => d.isrc);
            const spotifyStreams = dataArray.map(d => d.spotifyStreams);
            const appleMusicStreams = dataArray.map(d => d.appleMusicStreams);

            const tx = await this.oracleContract.batchSubmitStreamingData(
                isrcs,
                spotifyStreams,
                appleMusicStreams
            );

            await tx.wait();

            logger.info(`Batch submitted ${dataArray.length} streaming data records`);

            return tx.hash;
        } catch (error) {
            logger.error('Batch submission failed:', error.message);
            throw error;
        }
    }

    /**
     * Simulate streaming data growth for demo
     * @param {string} isrc - Song ISRC
     * @returns {Object} - Simulated streaming counts
     */
    simulateStreamingGrowth(isrc) {
        // Get or initialize current streams
        let current = this.streamingData.get(isrc) || {
            spotify: Math.floor(Math.random() * 50000) + 10000,
            appleMusic: Math.floor(Math.random() * 30000) + 5000,
            lastUpdate: Date.now()
        };

        // Simulate growth (100-2000 new streams per update)
        const spotifyGrowth = Math.floor(Math.random() * 1900) + 100;
        const appleMusicGrowth = Math.floor(Math.random() * 1000) + 50;

        const updated = {
            spotify: current.spotify + spotifyGrowth,
            appleMusic: current.appleMusic + appleMusicGrowth,
            lastUpdate: Date.now()
        };

        this.streamingData.set(isrc, updated);

        logger.info(`Simulated growth for ${isrc}: +${spotifyGrowth} Spotify, +${appleMusicGrowth} Apple Music`);

        return updated;
    }

    /**
     * Fetch streaming data from external APIs (mock implementation)
     * @param {string} isrc - Song ISRC
     * @returns {Object} - Streaming data
     */
    async fetchExternalStreamingData(isrc) {
        // Mock implementation for hackathon
        // In production, would call Spotify API, Apple Music API, etc.

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 100));

            // Return simulated growth
            return this.simulateStreamingGrowth(isrc);
        } catch (error) {
            logger.error(`Failed to fetch streaming data for ${isrc}:`, error.message);
            throw error;
        }
    }

    /**
     * Update all registered songs
     */
    async updateAllSongs() {
        try {
            logger.info('Starting automated streaming data update...');

            // In production, would fetch list of registered songs from contract
            // For demo, use predefined ISRCs
            const demoISRCs = [
                'USRC17607839', // Lagos Nights
                'USRC17607840', // Jollof Dreams
                'USRC17607841'  // Okada Ride
            ];

            const dataArray = [];

            for (const isrc of demoISRCs) {
                const streams = await this.fetchExternalStreamingData(isrc);

                dataArray.push({
                    isrc,
                    spotifyStreams: streams.spotify,
                    appleMusicStreams: streams.appleMusic
                });
            }

            // Batch submit to contract
            if (dataArray.length > 0) {
                await this.batchSubmitStreamingData(dataArray);
            }

            logger.info(`Updated ${dataArray.length} songs with latest streaming data`);
        } catch (error) {
            logger.error('Automated update failed:', error.message);
        }
    }

    /**
     * Start automated updates using cron
     */
    startAutomatedUpdates() {
        // Schedule updates every 6 hours
        cron.schedule(this.updateInterval, async () => {
            await this.updateAllSongs();
        });

        logger.info(`Automated updates scheduled: ${this.updateInterval}`);

        // Run initial update
        setTimeout(() => this.updateAllSongs(), 5000);
    }

    /**
     * Get current streaming data for a song
     * @param {string} isrc - Song ISRC
     * @returns {Object} - Current streaming data
     */
    getCurrentStreams(isrc) {
        return this.streamingData.get(isrc) || null;
    }

    /**
     * Get all streaming data
     * @returns {Map} - All streaming data
     */
    getAllStreams() {
        return this.streamingData;
    }
}

module.exports = StreamingOracleService;
