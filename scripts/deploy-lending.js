// Deploy lending contracts to Camp Network
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 DEPLOYING IPFI LENDING MODULE");
    console.log("=".repeat(60) + "\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

    const network = hre.network.name;
    console.log("Network:", network);
    console.log("");

    // Get existing contract addresses
    const existingDeployment = require("../deployments/latest.json");
    const ipRegistryAddress = existingDeployment.AfroBeatsIPRegistry;
    const royaltyEngineAddress = existingDeployment.RoyaltyDistributionEngine;

    if (!ipRegistryAddress || !royaltyEngineAddress) {
        throw new Error("Core contracts not deployed. Run deploy.js first.");
    }

    // 1. Deploy Mock USDT (for testing)
    console.log("📦 Deploying Mock USDT...");
    const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
    const usdt = await MockERC20.deploy("Mock USDT", "USDT", 6);
    await usdt.waitForDeployment();
    const usdtAddress = await usdt.getAddress();
    console.log("✅ Mock USDT deployed:", usdtAddress);
    console.log("");

    // 2. Deploy IPFiLendingPool
    console.log("📦 Deploying IPFiLendingPool...");
    const IPFiLendingPool = await hre.ethers.getContractFactory("IPFiLendingPool");
    const lendingPool = await IPFiLendingPool.deploy(
        usdtAddress,
        deployer.address // Fee recipient
    );
    await lendingPool.waitForDeployment();
    const lendingPoolAddress = await lendingPool.getAddress();
    console.log("✅ IPFiLendingPool deployed:", lendingPoolAddress);
    console.log("");

    // 3. Deploy RoyaltyStreamOracle
    console.log("📦 Deploying RoyaltyStreamOracle...");
    const RoyaltyStreamOracle = await hre.ethers.getContractFactory("RoyaltyStreamOracle");
    const streamOracle = await RoyaltyStreamOracle.deploy(royaltyEngineAddress);
    await streamOracle.waitForDeployment();
    const streamOracleAddress = await streamOracle.getAddress();
    console.log("✅ RoyaltyStreamOracle deployed:", streamOracleAddress);
    console.log("");

    // 4. Deploy IPFiLoanManager
    console.log("📦 Deploying IPFiLoanManager...");
    const IPFiLoanManager = await hre.ethers.getContractFactory("IPFiLoanManager");
    const loanManager = await IPFiLoanManager.deploy(
        lendingPoolAddress,
        streamOracleAddress,
        ipRegistryAddress,
        usdtAddress
    );
    await loanManager.waitForDeployment();
    const loanManagerAddress = await loanManager.getAddress();
    console.log("✅ IPFiLoanManager deployed:", loanManagerAddress);
    console.log("");

    // 5. Set LoanManager in LendingPool
    console.log("⚙️  Configuring LendingPool...");
    const tx1 = await lendingPool.setLoanManager(loanManagerAddress);
    await tx1.wait();
    console.log("✅ LoanManager set in LendingPool");
    console.log("");

    // 6. Authorize deployer as oracle provider
    console.log("⚙️  Authorizing oracle provider...");
    const tx2 = await streamOracle.authorizeProvider(deployer.address);
    await tx2.wait();
    console.log("✅ Oracle provider authorized");
    console.log("");

    // 7. Mint test USDT to deployer
    console.log("💰 Minting test USDT...");
    const mintAmount = hre.ethers.parseUnits("100000", 6); // 100k USDT
    const tx3 = await usdt.mint(deployer.address, mintAmount);
    await tx3.wait();
    console.log("✅ Minted 100,000 USDT to deployer");
    console.log("");

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📋 DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));
    console.log("Mock USDT:              ", usdtAddress);
    console.log("IPFiLendingPool:        ", lendingPoolAddress);
    console.log("RoyaltyStreamOracle:    ", streamOracleAddress);
    console.log("IPFiLoanManager:        ", loanManagerAddress);
    console.log("=".repeat(60) + "\n");

    // Save deployment info
    const deploymentInfo = {
        network: network,
        timestamp: new Date().toISOString(),
        deployer: deployer.address,
        contracts: {
            MockUSDT: usdtAddress,
            IPFiLendingPool: lendingPoolAddress,
            RoyaltyStreamOracle: streamOracleAddress,
            IPFiLoanManager: loanManagerAddress,
        },
    };

    const deploymentPath = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentPath)) {
        fs.mkdirSync(deploymentPath, { recursive: true });
    }

    const filename = `lending-${network}-${Date.now()}.json`;
    fs.writeFileSync(
        path.join(deploymentPath, filename),
        JSON.stringify(deploymentInfo, null, 2)
    );

    // Update latest.json
    const latestPath = path.join(deploymentPath, "latest.json");
    const existingLatest = fs.existsSync(latestPath)
        ? JSON.parse(fs.readFileSync(latestPath))
        : {};

    const updatedLatest = {
        ...existingLatest,
        ...deploymentInfo.contracts,
    };

    fs.writeFileSync(latestPath, JSON.stringify(updatedLatest, null, 2));

    console.log("💾 Deployment info saved to:", filename);
    console.log("💾 Updated latest.json with new addresses");
    console.log("");

    // Verification instructions
    console.log("🔍 To verify contracts on block explorer:");
    console.log(`npx hardhat verify --network ${network} ${usdtAddress} "Mock USDT" "USDT" 6`);
    console.log(`npx hardhat verify --network ${network} ${lendingPoolAddress} ${usdtAddress} ${deployer.address}`);
    console.log(`npx hardhat verify --network ${network} ${streamOracleAddress} ${royaltyEngineAddress}`);
    console.log(`npx hardhat verify --network ${network} ${loanManagerAddress} ${lendingPoolAddress} ${streamOracleAddress} ${ipRegistryAddress} ${usdtAddress}`);
    console.log("");

    console.log("✅ DEPLOYMENT COMPLETE!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
