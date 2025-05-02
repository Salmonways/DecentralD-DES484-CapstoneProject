// src/utils/blockchain.js
import { ethers } from 'ethers';
import CredentialRegistry from '../../blockchain/artifacts/contracts/CredentialRegistry.sol/CredentialRegistry.json';

// Load environment variables (React-specific)
// const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;  // Make sure this is set in your .env
// const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;  // For server-side access, or skip this for frontend
// const RPC_URL = process.env.REACT_APP_RPC_URL || "http://127.0.0.1:8545";
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const RPC_URL = import.meta.env.VITE_RPC_URL || "http://127.0.0.1:8545";

// Log the environment variables (for debugging purposes)
console.log('Loaded CONTRACT_ADDRESS:', CONTRACT_ADDRESS);
console.log('Loaded RPC_URL:', RPC_URL);

// Get the contract object using MetaMask (for frontend)
export const getContract = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask not installed");
    }
    console.log("MetaMask detected");

    // Request user accounts (MetaMask)
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Ethereum accounts requested");

    // Initialize the provider and signer (MetaMask)
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log("Signer obtained:", signer);

    // Create contract instance
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CredentialRegistry.abi, signer);
    console.log("Contract instantiated:", contract);

    return contract;
  } catch (error) {
    console.error("Error getting contract:", error);
    throw error;
  }
};

// Optional: For backend/server-side access (using a private key and RPC URL)
export const getServerContract = () => {
  try {
    if (!PRIVATE_KEY) {
      throw new Error("Private key is missing");
    }

    console.log("Private key found for server-side access");

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    console.log("Provider initialized:", provider);

    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log("Wallet created:", wallet);

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CredentialRegistry.abi, wallet);
    console.log("Contract instantiated on server:", contract);

    return contract;
  } catch (error) {
    console.error("Error getting server contract:", error);
    throw error;
  }
};