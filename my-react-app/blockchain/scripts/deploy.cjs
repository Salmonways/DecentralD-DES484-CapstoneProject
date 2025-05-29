// const hre = require("hardhat");

// async function main() {
//   const CredentialContract = await hre.ethers.getContractFactory("CredentialRegistry"); 
//   const contract = await CredentialContract.deploy();

//   await contract.waitForDeployment(); 

//   const address = await contract.getAddress(); 

//   console.log("✅ Contract deployed to:", address);
// }

// main().catch((error) => {
//   console.error("❌ Deployment failed:", error);
//   process.exit(1);
// });

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Deploy IssuerRegistry
  const IssuerRegistry = await hre.ethers.getContractFactory("IssuerRegistry");
  const issuerRegistry = await IssuerRegistry.deploy();
  await issuerRegistry.waitForDeployment();
  const issuerRegistryAddress = await issuerRegistry.getAddress();

  // Deploy UserRegistry
  const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
  const userRegistry = await UserRegistry.deploy();
  await userRegistry.waitForDeployment();
  const userRegistryAddress = await userRegistry.getAddress();

  // Deploy RevocationRegistry
  const RevocationRegistry = await hre.ethers.getContractFactory("RevocationRegistry");
  const revocationRegistry = await RevocationRegistry.deploy();
  await revocationRegistry.waitForDeployment();
  const revocationRegistryAddress = await revocationRegistry.getAddress();

  // Deploy VerificationLog
  const VerificationLog = await hre.ethers.getContractFactory("VerificationLog");
  const verificationLog = await VerificationLog.deploy();
  await verificationLog.waitForDeployment();
  const verificationLogAddress = await verificationLog.getAddress();

  // Deploy CredentialRegistry with constructor arguments
  const CredentialRegistry = await hre.ethers.getContractFactory("CredentialRegistry");
  const credentialRegistry = await CredentialRegistry.deploy();
  await credentialRegistry.waitForDeployment();
  const credentialRegistryAddress = await credentialRegistry.getAddress();
  console.log("Contract Addresss:", credentialRegistryAddress);

  // Prepare the addresses object
  const deployedAddresses = {
    IssuerRegistry: issuerRegistryAddress,
    UserRegistry: userRegistryAddress,
    RevocationRegistry: revocationRegistryAddress,
    VerificationLog: verificationLogAddress,
    CredentialRegistry: credentialRegistryAddress
  };

  // Ensure folder exists
  const blockchainDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(blockchainDir)) {
    fs.mkdirSync(blockchainDir, { recursive: true });
  }

  // Save addresses to file
  fs.writeFileSync(
    path.join(blockchainDir, "deployedAddresses.json"),
    JSON.stringify(deployedAddresses, null, 2)
  );
  console.log("✅ Deployed addresses saved to blockchain/deployments/deployedAddresses.json");
}

// Correct placement of main call
main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});