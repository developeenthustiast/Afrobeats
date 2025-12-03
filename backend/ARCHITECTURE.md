# AfroBeats Royalty Protocol - Backend Architecture

## Overview

The backend provides a REST API layer between the frontend and blockchain smart contracts, handling:
- File uploads to IPFS
- Contract interactions via ethers.js
- Payment provider integrations
- Streaming data oracle
- Authentication flows

## Architecture Diagram

```
┌─────────────┐
│   Frontend  │
│  (Next.js)  │
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────────────────────────────┐
│      Express API Server             │
│  (Port 3001)                        │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  API Routes                  │  │
 │  │  - /api/songs               │  │
│  │  - /api/royalties           │  │
│  │  - /api/streaming           │  │
│  │  - /api/auth                │  │
│  │  - /api/payments            │  │
│  └──────────────────────────────┘  │
└──┬──────┬──────┬──────┬────────┬───┘
   │      │      │      │        │
   │      │      │      │        │
   ▼      ▼      ▼      ▼        ▼
┌──────┐┌──────┐┌──────┐┌───────┐┌─────────┐
│Origin││Ethers││Oracle││Payment││AI Agent │
│ SDK  ││.js   ││Service││Providers││  API   │
└──┬───┘└──┬───┘└──┬───┘└───┬───┘└────┬────┘
   │       │       │        │         │
   ▼       ▼       ▼        ▼         ▼
┌──────┐┌─────────────┐┌────────┐┌─────────┐
│ IPFS ││Smart Contracts││Flutterwave││Pinecone│
│      ││(Camp Network)  ││Paystack  ││        │
└──────┘└─────────────┘└────────┘└─────────┘
```

## Components

### 1. Express API Server (`src/server.js`)

Main application entry point. Responsibilities:
- Configure middleware (CORS, helmet, rate limiting)
- Define REST API routes
- Initialize blockchain connections
- Start oracle service
- Handle graceful shutdown

**Key Libraries**:
- `express`: Web framework
- `helmet`: Security headers
- `cors`: Cross-origin resource sharing
- `express-rate-limit`: DDoS protection
- `multer`: File upload handling

### 2. Origin SDK Integration (`src/integrations/origin-sdk.js`)

Wrapper for Camp Network's Origin SDK. Provides:

**Features**:
- Spotify OAuth flow
- IPFS file/metadata upload
- IP provenance certificate generation
- Mock implementations for hackathon demo

**Methods**:
```javascript
authenticate()                         // Get Origin SDK access token
getSpotifyAuthUrl(redirectUri)         // Initiate Spotify OAuth
exchangeSpotifyCode(code)              // Exchange auth code for token
fetchSpotifyCatalog(spotifyToken)      // Get artist's songs
uploadToIPFS(fileBuffer, metadata)     // Upload audio to IPFS
uploadMetadata(metadata)               // Upload JSON metadata
generateProvenanceCertificate(songData) // Generate certificate
```

**Fallback Strategy**:
- Primary: Origin SDK IPFS gateway
- Fallback: Mock CIDs for demo if IPFS unavailable

### 3. Streaming Oracle Service (`src/services/oracle-service.js`)

Automated service that fetches and submits streaming data to blockchain.

**Features**:
- Scheduled updates via `node-cron` (every 6 hours)
- Simulated streaming growth for demo
- Batch submission to `StreamingOracle` contract
- Support for multiple data sources (Spotify, Apple Music)

**Flow**:
```
Timer (6h) → fetchExternalStreamingData() → simulateStreamingGrowth()
  → batchSubmitStreamingData() → StreamingOracle.sol
```

**Demo Mode**:
- Generates realistic growth (100-2000 streams per update)
- ISRCs: `USRC17607839`, `USRC17607840`, `USRC17607841`

### 4. Payment Providers (`src/integrations/payment-providers.js`)

#### Flutterwave Adapter
- **Fees**: 2.0% (1.4% transaction + 0.6% platform)
- **Features**:
  - USDT to NGN conversion (rate: 1 USDT = 1450 NGN)
  - Bank account withdrawals
  - Transaction status tracking
  - Conversion quotes

#### Paystack Adapter
- **Fees**: 1.5% + NGN 100 (capped at NGN 2,000)
- **Features**:
  - Virtual account creation
  - Instant bank transfers
  - Webhook handling

#### Stablecoin Manager
- **Purpose**: DEX integration for cNGN/NGNT
- **Features**:
  - USDT to cNGN conversion
  - Slippage tolerance
  - Batch conversions

### 5. Blockchain Integration

**Configuration**:
```javascript
const provider = new ethers.JsonRpcProvider(process.env.CAMP_TESTNET_RPC);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
```

**Contracts**:
- `AfroBeatsIPRegistry`: Song registration, metadata
- `RoyaltyDistributionEngine`: Royalty data, beneficiaries
- `StreamingOracle`: Streaming data submission

**Methods**:
- Read: `getSongMetadata()`, `getStreamingData()`, `getRoyaltyBeneficiaries()`
- Write (Oracle only): `submitStreamingData()`, `batchSubmitStreamingData()`

### 6. Logger (`src/utils/logger.js`)

Winston-based structured logging.

**Transports**:
- Console (colored, formatted)
- File: `logs/error.log` (errors only)
- File: `logs/combined.log` (all logs)

**Log Levels**: error, warn, info, http, verbose, debug, silly

## API Endpoints Reference

### Song Management

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/songs/register` | POST | Register new song (multipart) |
| `/api/songs/:tokenId` | GET | Get song metadata |

### Royalties

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/royalties/:tokenId` | GET | Get royalty data + beneficiaries |

### Streaming

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/streaming/:isrc` | GET | Get streaming stats (Spotify + Apple) |

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/spotify` | GET | Get Spotify OAuth URL |
| `/api/auth/spotify/callback` | POST | Exchange auth code |

### Payments

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/payments/quote` | POST | Get USDT→NGN conversion quote |
| `/api/payments/withdraw` | POST | Process withdrawal to bank |

### Provenance

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/provenance/generate` | POST | Generate certificate |

## Security Features

1. **Helmet**: Security headers (XSS, clickjacking protection)
2. **Rate Limiting**: 100 requests per 15 minutes per IP
3. **CORS**: Configurable origin whitelist
4. **Input Validation**: Joi schemas (to be added)
5. **Error Handling**: Centralized middleware
6. **Logging**: All requests/errors logged

## Environment Variables

```
# Core
NODE_ENV=development
PORT=3001
LOG_LEVEL=info

# Blockchain
CAMP_TESTNET_RPC=https://rpc.camp.network/testnet
PRIVATE_KEY=0x...
IP_REGISTRY_ADDRESS=0x...
ROYALTY_ENGINE_ADDRESS=0x...
ORACLE_ADDRESS=0x...

# Oracle
ORACLE_PRIVATE_KEY=0x...

# Origin SDK
ORIGIN_CLIENT_ID=...
ORIGIN_CLIENT_SECRET=...

# Payment Providers
FLUTTERWAVE_PUBLIC_KEY=...
FLUTTERWAVE_SECRET_KEY=...
PAYSTACK_PUBLIC_KEY=...
PAYSTACK_SECRET_KEY=...

# AI Agent
AI_AGENT_URL=http://localhost:8000
```

## Deployment

### Development
```bash
cd backend
npm install
cp .env.example .env
# Fill in .env
npm run dev
```

### Production (Railway/Render)
1. Connect GitHub repository
2. Set environment variables in dashboard
3. Deploy from `backend/` directory
4. Health check: `GET /health`

## Next Steps

1. ✅ Backend API complete
2. ⏳ Frontend development (Next.js)
3. ⏳ End-to-end testing
4. ⏳ Demo video production

---

**Status**: Backend infrastructure complete and ready for frontend integration 🚀
