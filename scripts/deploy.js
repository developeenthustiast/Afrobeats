const { ethers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

    // Deploy AfroBeatsIPRegistry
    console.log("\n🎵 Deploying AfroBeatsIPRegistry...");
    const AfroBeatsIPRegistry = await ethers.getContractFactory("AfroBeatsIPRegistry");
    const registry = await upgrades.deployProxy(AfroBeatsIPRegistry, [
        "AfroBeats IP",
        "ABIP"
    ]);
    await registry.waitForDeployment();
    console.log("✅ AfroBeatsIPRegistry deployed to:", await registry.getAddress());

    // Deploy ERC6551 components
    console.log("\n💼 Deploying ERC6551 components...");

    const ERC6551Account = await ethers.getContractFactory("ERC6551Account");
    const accountImplementation = await ERC6551Account.deploy();
    await accountImplementation.waitForDeployment();
    console.log("✅ ERC6551Account implementation:", await accountImplementation.getAddress());

    const ERC6551Registry = await ethers.getContractFactory("ERC6551Registry");
    const accountRegistry = await ERC6551Registry.deploy();
    await accountRegistry.waitForDeployment();
    console.log("✅ ERC6551Registry deployed to:", await accountRegistry.getAddress());

    // Deploy mock USDT for testing
    console.log("\n💵 Deploying mock USDT...");
    const MockUSDT = await ethers.getContractFactory("MockERC20");
    const usdt = await MockUSDT.deploy("Mock USDT", "USDT", 6);
    await usdt.waitForDeployment();
    console.log("✅ Mock USDT deployed to:", await usdt.getAddress());

    // Deploy StreamingOracle
    console.log("\n📡 Deploying StreamingOracle...");
    const StreamingOracle = await ethers.getContractFactory("StreamingOracle");
    const oracle = await StreamingOracle.deploy();
    await oracle.waitForDeployment();
    console.log("✅ StreamingOracle deployed to:", await oracle.getAddress());

    // Deploy RoyaltyDistributionEngine
    console.log("\n💰 Deploying RoyaltyDistributionEngine...");
    const RoyaltyDistributionEngine = await ethers.getContractFactory("RoyaltyDistributionEngine");
    const royaltyEngine = await RoyaltyDistributionEngine.deploy(
        await registry.getAddress(),
        await usdt.getAddress(),
        ethers.parseUnits("0.003", 6), // $0.003 per stream
        await oracle.getAddress()
    );
    await royaltyEngine.waitForDeployment();
    console.log("✅ RoyaltyDistributionEngine deployed to:", await royaltyEngine.getAddress());

    // Deploy GaslessOnboarding
    console.log("\n⛽ Deploying GaslessOnboarding...");
    const GaslessOnboarding = await ethers.getContractFactory("GaslessOnboarding");
    const gasless = await GaslessOnboarding.deploy(
        deployer.address  // Using deployer as trusted forwarder for demo
    );
    await gasless.waitForDeployment();
    console.log("✅ GaslessOnboarding deployed to:", await gasless.getAddress());

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("📋 DEPLOYMENT SUMMARY");
    console.log("=".repeat(60));
    console.log("AfroBeatsIPRegistry:        ", await registry.getAddress());
    console.log("ERC6551Account (impl):      ", await accountImplementation.getAddress());
    console.log("ERC6551Registry:            ", await accountRegistry.getAddress());
    console.log("Mock USDT:                  ", await usdt.getAddress());
    console.log("StreamingOracle:            ", await oracle.getAddress());
    console.log("RoyaltyDistributionEngine:  ", await royaltyEngine.getAddress());
    console.log("GaslessOnboarding:          ", await gasless.getAddress());
    console.log("=".repeat(60));

    // Save deployment addresses
    const fs = require("fs");
    const deploymentInfo = {
        network: network.name,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
        contracts: {
            AfroBeatsIPRegistry: await registry.getAddress(),
            ERC6551AccountImplementation: await accountImplementation.getAddress(),
            ERC6551Registry: await accountRegistry.getAddress(),
            MockUSDT: await usdt.getAddress(),
            StreamingOracle: await oracle.getAddress(),
            RoyaltyDistributionEngine: await royaltyEngine.getAddress(),
            GaslessOnboarding: await gasless.getAddress()
        }
    };

    fs.writeFileSync(
        `deployments/${network.name}-${Date.now()}.json`,
        JSON.stringify(deploymentInfo, null, 2)
    );

    console.log("\n✅ Deployment addresses saved to deployments/ directory");

    // Verification instructions
    if (network.name !== "hardhat" && network.name !== "localhost") {
        console.log("\n📝 To verify contracts on block explorer:");
        console.log(`npx hardhat verify --network ${network.name} ${await registry.getAddress()}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
