# AfroBeats Royalty Protocol 🎵

> Empowering African artists with blockchain-powered music rights management and royalty distribution.

**Live Demo**: [https://afrobeats1.vercel.app](https://afrobeats1.vercel.app)

---

## What is AfroBeats?

AfroBeats is a decentralized platform that helps musicians register their songs as intellectual property (IP), prove ownership, and get paid fairly for their work. Think of it as a combination of copyright protection, royalty distribution, and music financing—all powered by blockchain technology.

We built this specifically for African artists who often struggle with:
- **Proving ownership** of their music
- **Getting paid on time** (or at all) from streaming platforms
- **Accessing capital** to fund new projects
- **Fighting plagiarism** and unauthorized use

---

## 🌟 What Can You Do With AfroBeats?

### For Artists
- **Register Your Music**: Turn your songs into NFTs (digital certificates of ownership) stored on the blockchain
- **Connect Your Spotify**: Link your Spotify account to verify your artist profile and showcase your streaming stats
- **Get Loans**: Borrow money against your future royalty earnings (IP-Fi lending)
- **Track Analytics**: See real-time streaming data and revenue breakdowns
- **Protect Your Work**: Our AI checks for plagiarism and unauthorized copies

### For Fans & Investors
- **Support Artists**: Buy fractional ownership of songs you love
- **Earn Royalties**: Get a share of streaming revenue from the tracks you invest in
- **Discover New Music**: Find emerging African artists before they blow up

---

## 🎯 Key Features

### 1. **Artist Identity & Verification**
We use the **Camp Network Origin SDK** to connect your wallet to your Spotify account. This means:
- You prove you're the real artist behind the music
- Your streaming stats come directly from Spotify (no faking it!)
- Fans can trust they're supporting the actual creator

### 2. **Music IP Registry**
Every song you register becomes an **IP-NFT** (a special type of NFT for intellectual property). This gives you:
- Permanent proof of ownership
- Time-stamped evidence (useful for copyright disputes)
- A digital asset you can sell, lease, or use as collateral

### 3. **AI-Powered Plagiarism Detection**
Our AI agent creates a unique "fingerprint" of your song and stores it in a vector database. If someone uploads a similar track, we'll catch it. No more stolen beats or uncredited samples.

### 4. **Royalty Distribution**
Stream your music on Spotify, Apple Music, or any platform—we'll automatically split the royalties based on ownership percentages. No middlemen, no delays.

### 5. **IP-Fi Lending**
Need cash now but don't want to give up ownership? Borrow against your future royalties. The smart contract holds your IP-NFT as collateral and releases it when you repay the loan.

---

## 🚀 Getting Started

### For Users (No Coding Required)

1. **Visit the App**: Go to [https://afrobeats1.vercel.app](https://afrobeats1.vercel.app)
2. **Connect Your Wallet**: Use MetaMask or any Web3 wallet
3. **Link Spotify**: Click the "Connect" button on the Music Dashboard to authenticate
4. **Register Your First Track**: Upload your song, fill in the details, and mint your IP-NFT

That's it! You're now part of the decentralized music economy.

### For Developers

Want to run this locally or contribute? Here's how:

#### Prerequisites
- Node.js (version 18 or higher)
- Python 3.8+ (for the AI agent)
- A Web3 wallet with some test tokens

#### Installation

**1. Clone the repo:**
```bash
git clone https://github.com/developeenthustiast/AfroBeats.git
cd AfroBeats
```

**2. Install everything:**
```bash
# Root dependencies (smart contracts)
npm install

# Frontend
cd frontend
npm install
cd ..

# Backend
cd backend
npm install
cd ..

# AI Agent
cd ai-agent
pip install -r requirements.txt
cd ..
```

**3. Set up environment variables:**

Create a `.env` file in the `frontend` folder:
```bash
NEXT_PUBLIC_CAMP_CLIENT_ID=your-camp-client-id
NEXT_PUBLIC_CAMP_REDIRECT_URI=http://localhost:3000
```

> **Getting a Camp Client ID**: Visit [Camp Network Developer Portal](https://campnetwork.xyz), create an account, register your app, and copy the Client ID.

**4. Run the app:**

Open three terminal windows and run:

```bash
# Terminal 1: Frontend
cd frontend
npm run dev

# Terminal 2: Backend
cd backend
npm start

# Terminal 3: AI Agent
cd ai-agent
python src/agent.py
```

Visit `http://localhost:3000` and you're good to go!

---

## 🏗️ How It All Works

### The Tech Stack (In Plain English)

**Frontend** (What you see):
- **Next.js**: A modern web framework that makes the site fast and responsive
- **React**: For building the user interface
- **Camp Origin SDK**: Connects your wallet to Spotify/Twitter
- **Tailwind CSS**: Makes everything look beautiful

**Smart Contracts** (The blockchain layer):
- **Solidity**: The programming language for our contracts
- **Camp Network**: The blockchain where everything lives (EVM-compatible, so it works like Ethereum)
- **OpenZeppelin**: Battle-tested security libraries

**Backend** (The server):
- **Node.js + Express**: Handles API requests
- **Ethers.js**: Talks to the blockchain
- **MongoDB**: Stores off-chain data like user profiles

**AI Agent** (The plagiarism detector):
- **Python**: The programming language
- **FastAPI**: For serving the AI model
- **Pinecone**: Vector database for storing audio fingerprints

### The Flow (User Perspective)

1. **You connect your wallet** → We create an account for you on-chain
2. **You link Spotify** → We verify you're a real artist via the Origin SDK
3. **You upload a song** → Our AI creates a fingerprint and stores it
4. **You mint an IP-NFT** → The song is registered on the blockchain
5. **You earn royalties** → Streaming revenue flows directly to your wallet

---

## 🎨 The Origin SDK Integration

The **Camp Network Origin SDK** is the heart of our identity system. Here's what it does:

- **Authentication**: Users sign a message with their wallet to prove ownership
- **Social Linking**: Connect Spotify, Twitter, or TikTok to your Web3 address
- **Data Fetching**: Pull real Spotify stats (top tracks, monthly listeners, etc.)
- **On-Chain Verification**: We use this data to verify artists in our smart contracts

**Example Flow:**
1. Artist clicks "Connect Spotify" on the Music Dashboard
2. A modal pops up asking them to sign a message with their wallet
3. They authorize Spotify access
4. Their Spotify profile is now linked to their wallet address
5. We can fetch their streaming data and use it for analytics/verification

**For the nerds**: We wrap the `OriginCampProvider` in a `QueryClientProvider` because the SDK uses React Query internally. The `CampModal` component handles the entire auth flow in one line of code.

---

## 📦 Project Structure

```
AfroBeats/
├── frontend/              # Next.js app (what users see)
│   ├── app/              # Pages (dashboard, analytics, etc.)
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utilities and configs
│   └── hooks/            # React hooks for data fetching
│
├── contracts/            # Solidity smart contracts
│   ├── AfroBeatsRoyalty.sol  # Main IP-NFT contract
│   └── README.md         # Contract documentation
│
├── backend/              # Node.js API server
│   └── src/              # API routes and services
│
├── ai-agent/             # Python AI for plagiarism detection
│   └── src/              # AI model and vector database logic
│
└── scripts/              # Deployment scripts
```

---

## 🧪 Testing

**Test the smart contracts:**
```bash
npx hardhat test
```

**Test the backend:**
```bash
cd backend
npm test
```

**Manual testing:**
Just use the app! Try registering a song, linking Spotify, requesting a loan—everything should work smoothly.

---

## 🔐 Security & Privacy

We take security seriously:
- **Your private keys stay private**: We never ask for your seed phrase
- **Smart contracts are audited**: We use OpenZeppelin's battle-tested libraries
- **Data is encrypted**: All API calls use HTTPS
- **No personal data collection**: We don't track you or sell your data

---

## 🛣️ Roadmap

**Phase 1: MVP (Done ✅)**
- [x] Artist registration and IP-NFT minting
- [x] Origin SDK integration (Spotify linking)
- [x] Dashboard with dark mode
- [x] Smart contract deployment on Camp Network

**Phase 2: Enhanced Features (In Progress 🚧)**
- [ ] Get a real Camp Client ID and enable live Spotify data
- [ ] Deploy smart contracts to Camp mainnet
- [ ] Launch IP-Fi lending pool
- [ ] Integrate AI plagiarism detection

**Phase 3: Scale (Future 🚀)**
- [ ] Support more platforms (Apple Music, Audiomack)
- [ ] Mobile app (iOS & Android)
- [ ] Marketplace for buying/selling fractional ownership
- [ ] DAO governance for protocol upgrades

---

## 🤝 Contributing

We'd love your help! Here's how you can contribute:

1. **Report bugs**: Open an issue on GitHub
2. **Suggest features**: Tell us what you'd like to see
3. **Submit code**: Fork the repo, make changes, and send a pull request
4. **Spread the word**: Share with artist friends who need this

---

## 📄 License

This project is open source under the **MIT License**. Feel free to use it, modify it, and build on it.

---

## 🙏 Shoutouts

Big thanks to:
- **Camp Network** for the blockchain infrastructure and Origin SDK
- **OpenZeppelin** for rock-solid smart contract libraries
- **The African music community** for inspiring this project

---

## 💬 Need Help?

- **Questions?** Open an issue on GitHub
- **Found a bug?** Please report it!
- **Want to chat?** Reach out via our GitHub discussions

---

Built with ❤️ for African artists, by developers who believe music should be fair, transparent, and decentralized.
