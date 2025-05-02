const hre = require("hardhat");

async function main() {
  const CredentialContract = await hre.ethers.getContractFactory("CredentialRegistry"); // ✅ Match your .sol contract name
  const contract = await CredentialContract.deploy();

  await contract.waitForDeployment(); // ✅ Required in latest ethers.js

  const address = await contract.getAddress(); // ✅ Fetch deployed address

  console.log("✅ Contract deployed to:", address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});