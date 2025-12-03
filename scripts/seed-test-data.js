// Seed test data for demo
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("\n" + "=".repeat(60));
    console.log("🌱 SEEDING TEST DATA FOR DEMO");
    console.log("=".repeat(60) + "\n");

    const [deployer] = await hre.ethers.getSigners();

    // Load deployment addresses
    const deployment = require("../deployments/latest.json");

    // Get contract instances
    const ipRegistry = await hre.ethers.getContractAt(
        "AfroBeatsIPRegistry",
        deployment.AfroBeatsIPRegistry
    );

    const royaltyEngine = await hre.ethers.getContractAt(
        "RoyaltyDistributionEngine",
        deployment.RoyaltyDistributionEngine
    );

    const streamOracle = await hre.ethers.getContractAt(
        "StreamingOracle",
        deployment.StreamingOracle
    );

    const royaltyStreamOracle = await hre.ethers.getContractAt(
        "RoyaltyStreamOracle",
        deployment.RoyaltyStreamOracle
    );

    const lendingPool = await hre.ethers.getContractAt(
        "IPFiLendingPool",
        deployment.IPFiLendingPool
    );

    const usdt = await hre.ethers.getContractAt(
        "MockERC20",
        deployment.MockUSDT
    );

    // Test songs data
    const songs = [
        {
            title: "Lagos Nights",
            artists: ["TestArtist1"],
            isrc: "USRC17607839",
            genres: ["Afrobeats"],
            beneficiaries: [
                { payee: deployer.address, percentage: 7000 }, // 70% artist
                { payee: deployer.address, percentage: 2000 }, // 20% producer
                { payee: deployer.address, percentage: 1000 }, // 10% songwriter
            ],
        },
        {
            title: "Jollof Dreams",
            artists: ["TestArtist2", "FeaturedArtist"],
            isrc: "USRC17607840",
            genres: ["Afrobeats", "R&B"],
            beneficiaries: [
                { payee: deployer.address, percentage: 6000 }, // 60% artist
                { payee: deployer.address, percentage: 3000 }, // 30% featured
                { payee: deployer.address, percentage: 1000 }, // 10% producer
            ],
        },
        {
            title: "Okada Ride",
            artists: ["TestArtist1"],
            isrc: "USRC17607841",
            genres: ["Afropop"],
            beneficiaries: [
                { payee: deployer.address, percentage: 10000 }, // 100% solo
            ],
        },
    ];

    console.log("📝 Registering test songs as IP-NFTs...\n");

    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];

        // Create mock fingerprint hash
        const fingerprintHash = hre.ethers.keccak256(
            hre.ethers.toUtf8Bytes(song.title + Date.now())
        );

        // Mock IPFS URI
        const ipfsURI = `ipfs://Qm${Math.random().toString(36).substring(2, 22)}`;

        const metadata = {
            title: song.title,
            artists: song.artists,
            isrc: song.isrc,
            genres: song.genres,
            audioFingerprintHash: fingerprintHash,
            ipfsURI: ipfsURI,
            registrationTimestamp: 0, // Will be set by contract
            isDisputed: false,
        };

        const tx = await ipRegistry.registerSong(
            deployer.address,
            metadata,
            song.beneficiaries
        );

        await tx.wait();
        console.log(`✅ Registered: ${song.title} (Token ID: ${i})`);
    }

    console.log("\n📊 Submitting historical streaming data...\n");

    // Submit streaming data for last 30 days
    for (let tokenId = 0; tokenId < songs.length; tokenId++) {
        const baseStreams = 1000 + tokenId * 500;
        const spotifyStreams = baseStreams;
        const appleMusicStreams = Math.floor(baseStreams * 0.6);

        const tx = await streamOracle.submitStreamingData(
            songs[tokenId].isrc,
            spotifyStreams,
            appleMusicStreams
        );

        await tx.wait();
        console.log(`✅ Submitted streams for ${songs[tokenId].title}: ${spotifyStreams + appleMusicStreams} total`);
    }

    console.log("\n🔮 Generating ML predictions...\n");

    // Submit predictions to RoyaltyStreamOracle
    for (let tokenId = 0; tokenId < songs.length; tokenId++) {
        const baseEarnings = 1200 + tokenId * 300; // $1200-$1800
        const projectedEarnings = hre.ethers.parseUnits(baseEarnings.toString(), 6);
        const confidence = 7500 + tokenId * 500; // 75%-85%
        const duration = 180 * 24 * 60 * 60; // 180 days

        const tx = await royaltyStreamOracle.submitPrediction(
            tokenId,
            projectedEarnings,
            confidence,
            duration
        );

        await tx.wait();
        console.log(`✅ Prediction for ${songs[tokenId].title}: $${baseEarnings} (${confidence / 100}% confidence)`);
    }

    console.log("\n💰 Adding liquidity to lending pool...\n");

    // Approve USDT for lending pool
    const liquidityAmount = hre.ethers.parseUnits("50000", 6); // 50k USDT
    const approveTx = await usdt.approve(deployment.IPFiLendingPool, liquidityAmount);
    await approveTx.wait();

    // Deposit to pool
    const depositTx = await lendingPool.deposit(liquidityAmount);
    await depositTx.wait();

    console.log("✅ Deposited $50,000 USDT to lending pool");

    // Get pool stats
    const totalAssets = await lendingPool.getTotalAssets();
    const borrowRate = await lendingPool.getBorrowRate();
    const supplyRate = await lendingPool.getSupplyRate();

    console.log(`   Total Assets: $${hre.ethers.formatUnits(totalAssets, 6)}`);
    console.log(`   Borrow Rate: ${borrowRate / 100}% APR`);
    console.log(`   Supply Rate: ${supplyRate / 100}% APR`);

    console.log("\n" + "=".repeat(60));
    console.log("✅ TEST DATA SEEDING COMPLETE!");
    console.log("=".repeat(60));
    console.log(` Registered Songs: ${songs.length}`);
    console.log("   Streaming Data: ✅");
    console.log("   ML  Predictions: ✅");
    console.log("   Pool Liquidity: $50,000");
    console.log("=".repeat(60) + "\n");

    console.log("🎬 Ready for demo!");
    console.log("   You can now:");
    console.log("   - Request loans against IP-NFTs");
    console.log("   - View analytics dashboard");
    console.log("   - Test health factor monitoring");
    console.log("");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
