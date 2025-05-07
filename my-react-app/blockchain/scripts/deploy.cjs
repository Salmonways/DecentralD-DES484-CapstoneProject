const hre = require("hardhat");

async function main() {
  const CredentialContract = await hre.ethers.getContractFactory("CredentialRegistry"); 
  const contract = await CredentialContract.deploy();

  await contract.waitForDeployment(); 

  const address = await contract.getAddress(); 

  console.log("✅ Contract deployed to:", address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});