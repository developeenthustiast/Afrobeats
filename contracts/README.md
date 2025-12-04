# AfroBeats Smart Contracts

## Overview
This directory contains the smart contracts for the AfroBeats Royalty Protocol.

## Contracts

### `AfroBeatsRoyalty.sol`
- **Standard**: ERC-1155 (IP Assets)
- **Features**:
    - Track Registration (Minting)
    - Royalty Distribution
    - Identity Verification (Camp Network Integration)

## Integration with Camp Network
The `verifyArtist` function is designed to be called by an Oracle or Relayer that verifies the `SpotifyAPI` data fetched via the `@campnetwork/origin` SDK.

## Deployment
1. Install dependencies: `npm install`
2. Compile: `npx hardhat compile`
3. Deploy: `npx hardhat run scripts/deploy.js --network camp_testnet`
