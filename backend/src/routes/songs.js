const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { getOriginSDK } = require('../integrations/origin-sdk');
const { authenticateJWT } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Origin SDK
const originSDK = getOriginSDK();

/**
 * @route POST /api/songs/register
 * @desc Register a new song and upload to IPFS
 * @access Private (requires authentication)
 */
router.post('/register', authenticateJWT, upload.single('audio'), async (req, res) => {
    try {
        const { title, artists, description, genre, isrc, iswc } = req.body;
        const audioFile = req.file;
        const userId = req.user.id; // From JWT

        if (!audioFile) {
            return res.status(400).json({ error: 'Audio file is required' });
        }

        if (!title || !artists) {
            return res.status(400).json({ error: 'Title and artists are required' });
        }

        logger.info(`Starting song registration for: ${title} by ${artists}`);

        // 1. Upload audio to IPFS
        const audioCid = await originSDK.uploadToIPFS(audioFile.buffer, {
            filename: `${title.replace(/\s+/g, '_')}_${Date.now()}.mp3`,
            contentType: audioFile.mimetype,
            pinataMetadata: {
                name: `${title} - Audio`,
                keyvalues: {
                    type: 'audio',
                    title,
                    artists: Array.isArray(artists) ? artists.join(', ') : artists,
                    uploadedBy: userId
                }
            }
        });

        const audioUri = `ipfs://${audioCid}`;
        logger.info(`Audio uploaded to IPFS: ${audioUri}`);

        // 2. Generate audio fingerprint (in a real app, you'd use an audio fingerprinting library)
        const audioFingerprint = `fp_${crypto.createHash('sha256')
            .update(audioFile.buffer)
            .digest('hex')}`;

        // 3. Create and upload metadata
        const metadata = {
            name: title,
            description: description || `Music track: ${title}`,
            image: '', // You might want to upload artwork separately
            external_url: '',
            animation_url: audioUri,
            attributes: [
                {
                    trait_type: 'Artist',
                    value: Array.isArray(artists) ? artists.join(', ') : artists
                },
                {
                    trait_type: 'Genre',
                    value: genre || 'Uncategorized'
                },
                {
                    trait_type: 'ISRC',
                    value: isrc || ''
                },
                {
                    trait_type: 'ISWC',
                    value: iswc || ''
                },
                {
                    trait_type: 'Fingerprint',
                    value: audioFingerprint,
                    display_type: 'string'
                }
            ]
        };

        const metadataCid = await originSDK.uploadMetadata(metadata, {
            name: `${title} - Metadata`,
            keyvalues: {
                type: 'metadata',
                title,
                artists: Array.isArray(artists) ? artists.join(', ') : artists,
                createdBy: userId
            }
        });

        const metadataUri = `ipfs://${metadataCid}`;
        logger.info(`Metadata uploaded to IPFS: ${metadataUri}`);

        // 4. Generate provenance certificate
        const certificate = await originSDK.generateProvenanceCertificate({
            title,
            description: description || `Music track: ${title}`,
            artists: Array.isArray(artists) ? artists : [artists],
            audioFingerprintHash: audioFingerprint,
            ipfsUri: audioUri,
            metadataUri,
            creatorId: userId,
            creatorType: 'Artist',
            creatorName: req.user.name || 'Anonymous',
            isrc,
            iswc,
            genre: genre ? [genre] : [],
            duration: 0, // You'd extract this from the audio file in a real app
            tags: []
        });

        logger.info(`Provenance certificate generated: ${certificate.id}`);

        // 5. Return the result
        res.status(201).json({
            success: true,
            data: {
                id: uuidv4(),
                title,
                artists: Array.isArray(artists) ? artists : [artists],
                audioCid,
                audioUrl: originSDK.getIpfsUrl(audioCid),
                metadataCid,
                metadataUrl: originSDK.getIpfsUrl(metadataCid),
                certificate,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        logger.error('Song registration failed:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to register song',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

/**
 * @route GET /api/songs/:id
 * @desc Get song details by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // In a real app, you'd fetch this from your database
        // For now, we'll return a 404
        return res.status(404).json({
            success: false,
            error: 'Song not found'
        });
        
    } catch (error) {
        logger.error('Failed to fetch song:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch song details'
        });
    }
});

/**
 * @route GET /api/songs/artist/:artistId
 * @desc Get all songs by artist
 * @access Public
 */
router.get('/artist/:artistId', async (req, res) => {
    try {
        const { artistId } = req.params;
        
        // In a real app, you'd fetch this from your database
        // For now, return an empty array
        res.json({
            success: true,
            data: []
        });
        
    } catch (error) {
        logger.error('Failed to fetch artist songs:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch artist songs'
        });
    }
});

module.exports = router;
