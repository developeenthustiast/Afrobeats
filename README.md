# AfroBeats Royalty Protocol

A decentralized intellectual property registry and royalty distribution platform for Afrobeats music, built on Camp Network blockchain with AI-powered plagiarism detection.

## 🌟 Features

### Core Protocol
- **IP-NFT Registry**: ERC-721 based on-chain intellectual property registration
- **AI Plagiarism Detection**: Audio fingerprinting and similarity checking
- **Royalty Distribution**: Automated streaming royalty splits
- **Token Bound Accounts (ERC-6551)**: Smart wallets for each registered song
- **Gasless Onboarding**: Meta-transactions for frictionless user experience
- **Origin SDK Integration**: IPFS storage, provenance certificates, and Spotify OAuth

### Advanced Features
- **IP-Fi Lending**: Borrow against future royalty streams
- **Streaming Oracle**: Real-time streaming data from Spotify, Apple Music, etc.
- **Origin SDK Integration**: Provenance certificates and IPFS storage
- **Payment Integrations**: Flutterwave and Paystack support

## 📋 Prerequisites

- Node.js v18+ and npm
- Python 3.8+ (for AI agent)
- Git

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/developeenthustiast/AfroBeats.git
cd AfroBeats
```

### 2. Install Dependencies

**Smart Contracts:**
```bash
npm install
```

**AI Agent:**
```bash
cd ai-agent
pip install -r requirements.txt
cd ..
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### 3. Configure Environment Variables

**Root `.env` (for contract deployment):**
```bash
cp .env.example .env
# Edit .env with your deployer private key
```

**AI Agent `.env`:**
```bash
cp ai-agent/.env.example ai-agent/.env
# Configure AI agent settings
```

**Backend `.env`:**
```bash
cp backend/.env.example backend/.env
# Configure backend API keys and contract addresses
```

### 4. Compile Smart Contracts
```bash
npx hardhat compile
```

### 5. Run the Application

**Start AI Agent:**
```bash
cd ai-agent
python src/agent.py
```

**Start Backend (in another terminal):**
```bash
cd backend
npm start
```

**Start Frontend (in another terminal):**
```bash
cd frontend
npm run dev
```

## 📦 Project Structure

```
AfroBeats/
├── contracts/           # Solidity smart contracts
│   ├── core/           # Core protocol contracts
│   ├── lending/        # IP-Fi lending pool contracts
│   └── test/           # Test contracts
├── scripts/            # Deployment scripts
├── ai-agent/           # AI plagiarism detection service
│   └── src/           # Python AI agent source
├── backend/            # Node.js backend API
│   └── src/           # Backend source files
├── frontend/           # Next.js frontend
│   └── src/           # Frontend source files
├── hardhat.config.js  # Hardhat configuration
└── package.json       # Root dependencies
```

## 🔧 Smart Contract Deployment

### Deploy to Camp Network Testnet
```bash
npx hardhat run scripts/deploy.js --network campTestnet
```

Contract addresses will be saved to `deployments/` directory.

### Update Backend Configuration
After deployment, update `backend/.env` with the deployed contract addresses.

## 🎨 Origin SDK Integration

The AfroBeats backend integrates with **Origin SDK** for decentralized storage and provenance tracking.

### Features
- **IPFS Storage**: Audio files and metadata uploaded to IPFS via Pinata
- **Provenance Certificates**: Digital certificates proving song ownership and authenticity
- **Spotify OAuth**: Social authentication for artist verification
- **Real IPFS CIDs**: Production-ready uploads with automatic fallback

### Configuration

**1. Get Pinata API Credentials**
- Sign up at [Pinata](https://pinata.cloud)
- Create an API key
- Copy your `API Key` and `API Secret`

**2. Configure Backend Environment**

Add to `backend/.env`:
```bash
# Pinata IPFS Credentials
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key

# Optional: Spotify OAuth (for artist verification)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_secret
SPOTIFY_REDIRECT_URI=http://localhost:3001/auth/spotify/callback
```

### How It Works

When a song is registered via the backend API:

1. **Audio Upload**: File is uploaded to IPFS via Pinata → Returns IPFS CID
2. **Metadata Upload**: Song metadata is uploaded to IPFS → Returns metadata CID  
3. **Provenance Certificate**: A cryptographically signed certificate is generated
4. **Blockchain Registration**: Song is minted as an IP-NFT with IPFS references

**Automatic Fallback**: If Pinata credentials are not configured, the SDK uses mock CIDs for development/testing.

### Usage Example

```javascript
const { getOriginSDK } = require('./integrations/origin-sdk');
const originSDK = getOriginSDK();

// Upload audio file to IPFS
const audioCid = await originSDK.uploadToIPFS(audioBuffer, {
    filename: 'song.mp3',
    contentType: 'audio/mpeg'
});

// Upload metadata
const metadataCid = await originSDK.uploadMetadata({
    title: 'My Song',
    artist: 'Artist Name',
    genre: ['Afrobeats']
});

// Generate provenance certificate
const certificate = await originSDK.generateProvenanceCertificate({
    title: 'My Song',
    artists: ['Artist Name'],
    audioFingerprintHash: fingerprintHash,
    ipfsUri: `ipfs://${audioCid}`
});
```

### Verification

Access your uploaded files:
- **IPFS Gateway**: `https://ipfs.io/ipfs/{CID}`
- **Pinata Gateway**: `https://gateway.pinata.cloud/ipfs/{CID}`

## 🧪 Testing

**Smart Contracts:**
```bash
npx hardhat test
```

**Backend:**
```bash
cd backend
npm test
```

## 📚 Documentation

- [Architecture](backend/ARCHITECTURE.md) - System architecture and design
- [API Documentation](backend/README.md) - Backend API endpoints
- [AI Agent](ai-agent/README.md) - Plagiarism detection documentation

## 🛠️ Technology Stack

- **Blockchain**: Camp Network (EVM-compatible)
- **Smart Contracts**: Solidity 0.8.24, Hardhat, OpenZeppelin
- **AI Agent**: Python, FastAPI, Pinecone (vector database)
- **Backend**: Node.js, Express, Ethers.js
- **Frontend**: Next.js 14, React, TypeScript
- **Database**: MongoDB (backend), Pinecone (AI embeddings)
- **Payments**: Flutterwave, Paystack

## 🔐 Security

- All private keys and sensitive data are stored in `.env` files (never committed)
- Smart contracts use OpenZeppelin audited libraries
- Rate limiting and input validation on all API endpoints
- Meta-transaction validation for gasless operations


## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Camp Network for blockchain infrastructure
- OpenZeppelin for secure smart contract libraries
- Origin Protocol for provenance SDK

## 📞 Support

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for the Afrobeats community**
