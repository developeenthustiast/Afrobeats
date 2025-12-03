# Backend API for AfroBeats Royalty Protocol

Backend Express.js server providing REST API endpoints for the AfroBeats Royalty Protocol frontend.

## Features

- 🎵 **Song Registration**: Upload audio files, store on IPFS, create IP-NFTs
- 💰 **Royalty Management**: Fetch royalty data, streaming stats, beneficiary info  
- 🔐 **Authentication**: Spotify OAuth via Origin SDK
- 💳 **Payments**: Flutterwave/Paystack integration for NGN withdrawals
- 📡 **Oracle Service**: Automated streaming data updates
- 🔒 **Security**: Helmet, rate limiting, CORS protection

## Installation

```bash
cd backend
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in environment variables:
- `CAMP_TESTNET_RPC`: Camp Network RPC URL
- Contract addresses (after deployment)
- Origin SDK credentials
- Payment provider API keys

## Run

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:3001`

## API Endpoints

### Songs

#### Register Song
```http
POST /api/songs/register
Content-Type: multipart/form-data

{
  "title": "Lagos Nights",
  "artists": ["Artist Name"],
  "isrc": "USRC17607839",
  "genres": ["Afrobeats"],
  "beneficiaries": [{"payee": "0x...", "percentage": 10000}],
  "audioFile": <file>
}
```

#### Get Song Metadata
```http
GET /api/songs/:tokenId
```

### Royalties

#### Get Royalty Data
```http
GET /api/royalties/:tokenId
```

Returns:
- Total streams
- Earnings
- Beneficiary splits

### Streaming

#### Get Streaming Stats
```http
GET /api/streaming/:isrc
```

Returns Spotify + Apple Music play counts

### Authentication

#### Initiate Spotify Auth
```http
GET /api/auth/spotify?redirectUri=http://localhost:3000/callback
```

#### Exchange Auth Code
```http
POST /api/auth/spotify/callback
{
  "code": "auth_code_from_callback"
}
```

### Payments

#### Get Conversion Quote
```http
POST /api/payments/quote
{
  "amount": 100,
  "provider": "flutterwave"
}
```

#### Process Withdrawal
```http
POST /api/payments/withdraw
{
  "amount": 100,
  "provider": "flutterwave",
  "bankAccount": {
    "accountNumber": "1234567890",
    "bankName": "Access Bank"
  }
}
```

### Provenance

#### Generate Certificate
```http
POST /api/provenance/generate
{
  "tokenId": "0",
  "title": "Song Title",
  "artists": ["Artist"],
  //...
}
```

## Project Structure

```
backend/
├── src/
│   ├── server.js                 # Main Express app
│   ├── integrations/
│   │   ├── origin-sdk.js         # Origin SDK wrapper
│   │   └── payment-providers.js  # Flutterwave/Paystack
│   ├── services/
│   │   └── oracle-service.js     # Streaming oracle
│   └── utils/
│       └── logger.js             # Winston logger
├── logs/                         # Log files
├── package.json
└── .env.example
```

## Testing

```bash
npm test
```

## Deployment

1. Deploy smart contracts to Camp Network testnet
2. Update `.env` with deployed contract addresses
3. Deploy backend to Railway/Render/Fly.io
4. Set environment variables in hosting platform

## License

MIT
