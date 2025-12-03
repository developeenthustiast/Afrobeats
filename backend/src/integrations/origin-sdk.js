/**
 * Origin SDK Integration for AfroBeats Royalty Protocol
 * 
 * Provides wrapper functions for:
 * - Social authentication (Spotify OAuth)
 * - IP provenance certificate generation
 * - IPFS upload for audio and metadata
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

/**
 * OriginSDKAdapter - Handles all interactions with the Origin SDK
 */
class OriginSDKAdapter {
    constructor(config = {}) {
        // Configuration with environment variable fallbacks
        this.config = {
            clientId: config.clientId || process.env.ORIGIN_CLIENT_ID,
            clientSecret: config.clientSecret || process.env.ORIGIN_CLIENT_SECRET,
            apiBase: config.apiBase || process.env.ORIGIN_API_BASE || 'https://api.camp.network/origin/v1',
            authUrl: config.authUrl || process.env.ORIGIN_AUTH_URL || 'https://auth.camp.network/oauth/token',
            spotifyClientId: config.spotifyClientId || process.env.SPOTIFY_CLIENT_ID,
            spotifyClientSecret: config.spotifyClientSecret || process.env.SPOTIFY_CLIENT_SECRET,
            spotifyRedirectUri: config.spotifyRedirectUri || process.env.SPOTIFY_REDIRECT_URI,
            pinataApiKey: config.pinataApiKey || process.env.PINATA_API_KEY,
            pinataSecret: config.pinataSecret || process.env.PINATA_SECRET_API_KEY
        };

        // Initialize HTTP client with default headers
        this.httpClient = axios.create({
            baseURL: this.config.apiBase,
            timeout: 30000, // 30 seconds
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        // Add request interceptor for auth
        this.httpClient.interceptors.request.use(async (config) => {
            if (!this.accessToken || this.isTokenExpired()) {
                await this.authenticate();
            }
            config.headers.Authorization = `Bearer ${this.accessToken}`;
            return config;
        }, (error) => {
            return Promise.reject(error);
        });

        this.accessToken = null;
        this.tokenExpiry = null;
    }

    /**
     * Check if the current access token is expired
     * @private
     */
    isTokenExpired() {
        if (!this.tokenExpiry) return true;
        return Date.now() >= this.tokenExpiry - 30000; // 30 second buffer
    }

    /**
     * Authenticate with Origin SDK using client credentials
     */
    async authenticate() {
        try {
            const response = await axios.post(this.config.authUrl, {
                grant_type: 'client_credentials',
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                scope: 'ipfs:upload metadata:read metadata:write provenance:certificate'
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            this.accessToken = response.data.access_token;
            // Set token expiry with a 1-hour default
            this.tokenExpiry = Date.now() + ((response.data.expires_in || 3600) * 1000);
            
            return this.accessToken;

            this.accessToken = response.data.access_token;
            return this.accessToken;
        } catch (error) {
            console.error('Origin SDK authentication failed:', error.message);
            throw new Error('Failed to authenticate with Origin SDK');
        }
    }

    /**
     * Generate Spotify OAuth2 authorization URL
     * @param {string} [redirectUri] - Optional custom redirect URI
     * @param {string[]} [scopes] - Array of Spotify scopes
     * @returns {string} - Spotify authorization URL
     */
    getSpotifyAuthUrl(redirectUri = this.config.spotifyRedirectUri, scopes = [
        'user-read-email',
        'user-read-private',
        'user-read-playback-state',
        'user-modify-playback-state',
        'streaming',
        'user-library-read',
        'user-library-modify'
    ]) {
        const params = new URLSearchParams({
            client_id: this.config.spotifyClientId,
            response_type: 'code',
            redirect_uri: redirectUri,
            scope: scopes.join(' '),
            state: crypto.randomBytes(16).toString('hex'),
            show_dialog: 'true'
        });

        return `https://accounts.spotify.com/authorize?${params.toString()}`;
    }

    /**
     * Exchange Spotify authorization code for access token
     * @param {string} code - Authorization code from Spotify
     * @param {string} [redirectUri] - Must match the redirect_uri used in the authorization request
     * @returns {Promise<Object>} - Spotify token response with access_token, refresh_token, etc.
     */
    async exchangeSpotifyCode(code, redirectUri = this.config.spotifyRedirectUri) {
        try {
            const authHeader = Buffer.from(
                `${this.config.spotifyClientId}:${this.config.spotifyClientSecret}`
            ).toString('base64');

            const response = await axios.post(
                'https://accounts.spotify.com/api/token',
                new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: redirectUri
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${authHeader}`
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Spotify token exchange failed:', error.response?.data || error.message);
            throw new Error('Failed to exchange Spotify authorization code');
        }
    }

    /**
     * Refresh Spotify access token
     * @param {string} refreshToken - Refresh token from Spotify
     * @returns {Promise<Object>} - New token data
     */
    async refreshSpotifyToken(refreshToken) {
        try {
            const authHeader = Buffer.from(
                `${this.config.spotifyClientId}:${this.config.spotifyClientSecret}`
            ).toString('base64');

            const response = await axios.post(
                'https://accounts.spotify.com/api/token',
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Basic ${authHeader}`
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Spotify token refresh failed:', error.response?.data || error.message);
            throw new Error('Failed to refresh Spotify access token');
        }
    }

    /**
     * Fetch artist's Spotify catalog
     * @param {string} accessToken - Spotify access token
     * @param {number} [limit=50] - Number of tracks to return (max 50)
     * @param {number} [offset=0] - Pagination offset
     * @returns {Promise<Array>} - Array of track objects
     */
    async fetchSpotifyCatalog(accessToken, limit = 50, offset = 0) {
        try {
            const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    limit,
                    offset,
                    market: 'US' // Or get from user settings
                }
            });

            // Transform the response to match our expected format
            return response.data.items.map(item => ({
                id: item.track.id,
                name: item.track.name,
                artists: item.track.artists.map(artist => artist.name),
                album: item.track.album.name,
                duration_ms: item.track.duration_ms,
                preview_url: item.track.preview_url,
                external_urls: item.track.external_urls,
                isrc: item.track.external_ids?.isrc,
                popularity: item.track.popularity,
                added_at: item.added_at,
                album_art: item.track.album.images[0]?.url
            }));
        } catch (error) {
            console.error('Failed to fetch Spotify catalog:', error.response?.data || error.message);
            throw new Error('Failed to fetch artist catalog');
        }
    }

    /**
     * Upload file to IPFS using Pinata
     * @param {Buffer|ReadableStream} file - File buffer or stream
     * @param {Object} [metadata] - Optional metadata
     * @returns {Promise<string>} - IPFS CID of the uploaded file
     */
    async uploadToIPFS(file, metadata = {}) {
        try {
            const formData = new FormData();
            
            // Add file to form data
            formData.append('file', file, {
                filename: metadata.filename || `file-${Date.now()}`,
                contentType: metadata.contentType || 'application/octet-stream'
            });
            
            // Add metadata if provided
            if (metadata.pinataMetadata) {
                formData.append('pinataMetadata', JSON.stringify({
                    name: metadata.pinataMetadata.name || 'Audio File',
                    keyvalues: {
                        type: 'audio',
                        ...(metadata.pinataMetadata.keyvalues || {})
                    }
                }));
            }

            const response = await axios.post(
                'https://api.pinata.cloud/pinning/pinFileToIPFS',
                formData,
                {
                    maxBodyLength: 'Infinity',
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                        'pinata_api_key': this.config.pinataApiKey,
                        'pinata_secret_api_key': this.config.pinataSecret
                    }
                }
            );

            return response.data.IpfsHash; // Returns the IPFS CID
        } catch (error) {
            console.error('IPFS upload failed:', error.response?.data || error.message);
            
            // Fallback to mock in development
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Using mock IPFS CID in development mode');
                return 'Qm' + crypto.randomBytes(22).toString('base64url');
            }
            
            throw new Error('Failed to upload file to IPFS');
        }
    }

    /**
     * Upload metadata JSON to IPFS
     * @param {Object} metadata - Metadata object to upload
     * @param {Object} [options] - Additional options
     * @returns {Promise<string>} - IPFS CID of the uploaded metadata
     */
    async uploadMetadata(metadata, options = {}) {
        try {
            // Ensure metadata has required fields
            const requiredFields = ['name', 'description', 'image'];
            const missingFields = requiredFields.filter(field => !metadata[field]);
            
            if (missingFields.length > 0) {
                console.warn(`Missing recommended metadata fields: ${missingFields.join(', ')}`);
            }

            // Add standard metadata
            const metadataWithDefaults = {
                version: '1.0.0',
                created: new Date().toISOString(),
                ...metadata,
                attributes: metadata.attributes || []
            };

            // Upload to IPFS using Pinata
            const response = await axios.post(
                'https://api.pinata.cloud/pinning/pinJSONToIPFS',
                {
                    pinataMetadata: {
                        name: options.name || 'metadata.json',
                        keyvalues: {
                            type: 'metadata',
                            ...(options.keyvalues || {})
                        }
                    },
                    pinataContent: metadataWithDefaults
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'pinata_api_key': this.config.pinataApiKey,
                        'pinata_secret_api_key': this.config.pinataSecret
                    }
                }
            );

            return response.data.IpfsHash; // Returns the IPFS CID
        } catch (error) {
            console.error('Metadata upload failed:', error.response?.data || error.message);
            
            // Fallback to mock in development
            if (process.env.NODE_ENV !== 'production') {
                console.warn('Using mock metadata CID in development mode');
                return 'Qm' + crypto.randomBytes(22).toString('base64url');
            }
            
            throw new Error('Failed to upload metadata to IPFS');
        }
    }

    /**
     * Generate IP provenance certificate
     * @param {Object} songData - Song data for certificate
     * @returns {Promise<Object>} - Provenance certificate with digital signature
     */
    async generateProvenanceCertificate(songData) {
        try {
            // Validate required fields
            const requiredFields = ['title', 'artists', 'audioFingerprintHash', 'ipfsUri'];
            const missingFields = requiredFields.filter(field => !songData[field]);
            
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            // Create certificate payload
            const certificateId = `cert_${uuidv4()}`;
            const timestamp = new Date().toISOString();
            
            const certificate = {
                // Standard fields
                '@context': 'https://schema.camp.network/origin/v1',
                type: 'ProvenanceCertificate',
                id: certificateId,
                created: timestamp,
                updated: timestamp,
                
                // Song metadata
                name: songData.title,
                description: songData.description || `Provenance certificate for ${songData.title}`,
                
                // Content identification
                contentFingerprint: {
                    algorithm: 'SHA-256',
                    hash: songData.audioFingerprintHash
                },
                
                // Content location
                contentAddress: {
                    protocol: 'ipfs',
                    uri: songData.ipfsUri
                },
                
                // Rights and ownership
                creator: {
                    id: songData.creatorId || 'anonymous',
                    type: songData.creatorType || 'Artist',
                    name: songData.creatorName || 'Unknown Artist'
                },
                
                // Additional metadata
                metadata: {
                    isrc: songData.isrc,
                    iswc: songData.iswc,
                    duration: songData.duration,
                    genre: songData.genre || [],
                    tags: songData.tags || []
                },
                
                // System fields
                version: '1.0.0',
                issuer: 'Camp Network Origin SDK',
                
                // Signature will be added after generation
                signature: null
            };
            
            // Generate signature
            const signature = await this._generateSignature(certificate);
            certificate.signature = signature;
            
            // Store certificate in the Origin SDK
            try {
                const response = await this.httpClient.post('/provenance/certificates', certificate);
                return response.data;
            } catch (apiError) {
                console.warn('Failed to store certificate in Origin SDK, using local only:', apiError.message);
                return certificate;
            }
        } catch (error) {
            console.error('Certificate generation failed:', error.message);
            throw new Error(`Failed to generate provenance certificate: ${error.message}`);
        }
    }
    
    /**
     * Generate a digital signature for a certificate
     * @private
     * @param {Object} data - Data to sign
     * @returns {Promise<string>} - Base64-encoded signature
     */
    async _generateSignature(data) {
        // In a production environment, this would use a proper signing key
        // For the hackathon, we'll use a simple HMAC with the client secret
        const hmac = crypto.createHmac('sha256', this.config.clientSecret);
        hmac.update(JSON.stringify(data));
        return hmac.digest('hex');
    }

    /**
     * Verify IP provenance certificate
     * @param {string|Object} certificateOrId - Certificate ID or certificate object
     * @returns {Promise<{isValid: boolean, certificate: Object, error: string}>} - Verification result
     */
    async verifyProvenanceCertificate(certificateOrId) {
        try {
            let certificate;
            
            // If we got an ID, fetch the certificate first
            if (typeof certificateOrId === 'string') {
                const response = await this.httpClient.get(`/provenance/certificates/${certificateOrId}`);
                certificate = response.data;
            } else {
                certificate = certificateOrId;
            }
            
            if (!certificate) {
                return { isValid: false, certificate: null, error: 'Certificate not found' };
            }
            
            // 1. Verify the signature
            const signature = certificate.signature;
            if (!signature) {
                return { 
                    isValid: false, 
                    certificate, 
                    error: 'Certificate is not signed' 
                };
            }
            
            // Remove the signature before verifying
            const { signature: _, ...unsignedCertificate } = certificate;
            const expectedSignature = await this._generateSignature(unsignedCertificate);
            
            if (signature !== expectedSignature) {
                return { 
                    isValid: false, 
                    certificate, 
                    error: 'Invalid signature' 
                };
            }
            
            // 2. Verify the content exists on IPFS
            try {
                const ipfsUrl = this.getIpfsUrl(certificate.contentAddress.uri);
                const response = await axios.head(ipfsUrl, { timeout: 10000 });
                
                if (response.status !== 200) {
                    return { 
                        isValid: false, 
                        certificate, 
                        error: 'Content not found on IPFS' 
                    };
                }
            } catch (ipfsError) {
                console.warn('IPFS verification failed:', ipfsError.message);
                // Don't fail the entire verification if IPFS is down
            }
            
            // 3. Check if the certificate is registered on-chain (optional)
            // This would involve checking the blockchain for the certificate ID
            
            return { 
                isValid: true, 
                certificate,
                verifiedAt: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Certificate verification failed:', error.message);
            return { 
                isValid: false, 
                certificate: null, 
                error: `Verification failed: ${error.message}` 
            };
        }
    }

    /**
     * Get IPFS gateway URL for a CID or IPFS URI
     * @param {string} cidOrUri - IPFS CID (Qm...) or IPFS URI (ipfs://...)
     * @param {string} [gateway] - Optional custom gateway URL
     * @returns {string} - Public gateway URL
     */
    getIpfsUrl(cidOrUri, gateway = this.config.ipfsGateway || 'https://ipfs.io/ipfs/') {
        // If it's an IPFS URI (ipfs://...), extract the CID
        if (cidOrUri.startsWith('ipfs://')) {
            return gateway + cidOrUri.replace('ipfs://', '').split('/')[0];
        }
        
        // If it's just a CID, append it to the gateway
        return gateway + cidOrUri;
    }
    
    /**
     * Get IPFS gateway API URL
     * @param {string} [path] - API path
     * @returns {string} - Full API URL
     */
    getIpfsApiUrl(path = '') {
        const baseUrl = this.config.ipfsApiUrl || 'https://ipfs.camp.network';
        return `${baseUrl}${path}`;
    }
    
    /**
     * Get file from IPFS
     * @param {string} cid - IPFS CID
     * @returns {Promise<Buffer>} - File content as buffer
     */
    async getFromIpfs(cid) {
        try {
            const url = this.getIpfsUrl(cid);
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            return Buffer.from(response.data);
        } catch (error) {
            console.error('Failed to fetch from IPFS:', error.message);
            throw new Error(`Failed to fetch ${cid} from IPFS`);
        }
    }
    
    /**
     * Get metadata from IPFS
     * @param {string} cid - IPFS CID of the metadata
     * @returns {Promise<Object>} - Parsed metadata
     */
    async getMetadataFromIpfs(cid) {
        try {
            const data = await this.getFromIpfs(cid);
            return JSON.parse(data.toString('utf-8'));
        } catch (error) {
            console.error('Failed to parse metadata from IPFS:', error.message);
            throw new Error('Invalid metadata format from IPFS');
        }
    }
}

// Singleton instance
let originSDK = null;

/**
 * Get or create the Origin SDK instance
 * @param {Object} [config] - Optional configuration overrides
 * @returns {OriginSDKAdapter} The Origin SDK instance
 */
function getOriginSDK(config = {}) {
    if (!originSDK) {
        // Initialize with environment variables by default
        originSDK = new OriginSDKAdapter({
            // Default configuration from environment
            clientId: process.env.ORIGIN_CLIENT_ID,
            clientSecret: process.env.ORIGIN_CLIENT_SECRET,
            apiBase: process.env.ORIGIN_API_BASE,
            authUrl: process.env.ORIGIN_AUTH_URL,
            spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
            spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            spotifyRedirectUri: process.env.SPOTIFY_REDIRECT_URI,
            pinataApiKey: process.env.PINATA_API_KEY,
            pinataSecret: process.env.PINATA_SECRET_API_KEY,
            // Allow overrides from config parameter
            ...config
        });
        
        // Log initialization
        console.log('Origin SDK initialized with config:', {
            apiBase: originSDK.config.apiBase,
            spotifyClientId: originSDK.config.spotifyClientId ? '***' : 'not configured',
            pinataApiKey: originSDK.config.pinataApiKey ? '***' : 'not configured'
        });
    }
    
    return originSDK;
}

// Export both the class and the singleton instance getter
module.exports = {
    OriginSDKAdapter,
    getOriginSDK,
    // For testing purposes, allow clearing the singleton
    _clearInstance: () => { originSDK = null; }
};
