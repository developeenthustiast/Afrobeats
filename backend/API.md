# AfroBeats API Documentation

## Table of Contents
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Songs](#songs)
  - [Authentication](#authentication-endpoints)
- [Error Handling](#error-handling)
- [WebSocket Events](#websocket-events)
- [Rate Limiting](#rate-limiting)
- [Environment Variables](#environment-variables)

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL database
- Redis (for caching and rate limiting)
- IPFS node (or Pinata/Infura for IPFS)
- Camp Network testnet RPC URL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/afrobeats.git
   cd afrobeats/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the JWT in the `Authorization` header for authenticated requests:

```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Songs

#### Register a New Song

```http
POST /api/songs/register
```

**Request Headers:**
- `Content-Type: multipart/form-data`
- `Authorization: Bearer <token>`

**Form Data:**
- `audio`: (required) Audio file (MP3, WAV, etc.)
- `title`: (required) Song title
- `artists`: (required) Comma-separated list of artists
- `description`: Song description
- `genre`: Song genre
- `isrc`: ISRC code
- `iswc`: ISWC code

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Song Title",
    "artists": ["Artist 1", "Artist 2"],
    "audioCid": "Qm...",
    "audioUrl": "https://ipfs.io/ipfs/Qm...",
    "metadataCid": "Qm...",
    "metadataUrl": "https://ipfs.io/ipfs/Qm...",
    "certificate": { ... },
    "timestamp": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get Song by ID

```http
GET /api/songs/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Song Title",
    "artists": ["Artist 1", "Artist 2"],
    "audioUrl": "https://ipfs.io/ipfs/Qm...",
    "metadataUrl": "https://ipfs.io/ipfs/Qm...",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get Songs by Artist

```http
GET /api/songs/artist/:artistId
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Song 1",
      "audioUrl": "https://ipfs.io/ipfs/Qm...",
      "createdAt": "2023-01-01T00:00:00.000Z"
    },
    ...
  ]
}
```

## Error Handling

Errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific error about field"
  }
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Headers included in rate-limited responses:
  - `X-RateLimit-Limit`: Request limit per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Timestamp when the limit resets

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Port to run the server on | `3001` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `JWT_SECRET` | Secret for JWT signing | - |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `REDIS_URL` | Redis connection URL | - |
| `IPFS_GATEWAY` | IPFS gateway URL | `https://ipfs.io/ipfs/` |
| `PINATA_API_KEY` | Pinata API key | - |
| `PINATA_SECRET_API_KEY` | Pinata secret API key | - |
| `CAMP_TESTNET_RPC` | Camp Network testnet RPC URL | - |
| `IP_REGISTRY_ADDRESS` | AfroBeatsIPRegistry contract address | - |
| `ROYALTY_ENGINE_ADDRESS` | RoyaltyDistributionEngine contract address | - |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins | `*` |

## WebSocket Events

### Song Registered
Emitted when a new song is registered.

**Event:** `song:registered`

**Data:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Song Title",
  "artist": "Artist Name",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

## Testing

Run the test suite:

```bash
npm test
```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start in production mode:
   ```bash
   NODE_ENV=production node dist/server.js
   ```

## License

MIT
