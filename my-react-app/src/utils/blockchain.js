import { ethers } from 'ethers';
import CredentialRegistry from '../../blockchain/artifacts/contracts/CredentialRegistry.sol/CredentialRegistry.json';

// Load environment variables from Vite
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const RPC_URL = import.meta.env.VITE_RPC_URL || "http://127.0.0.1:8545";

// Log loaded config
console.log("[Blockchain] CONTRACT_ADDRESS:", CONTRACT_ADDRESS);
console.log("[Blockchain] RPC_URL:", RPC_URL);

/**
 * Returns a contract instance using MetaMask if available,
 * otherwise falls back to a read-only provider.
 */
export const getContract = async () => {
  let provider, signer;

  if (typeof window !== 'undefined' && window.ethereum) {
    try {
      // Request MetaMask access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      provider = new ethers.BrowserProvider(window.ethereum);
      signer = await provider.getSigner();

      console.log("[Blockchain] Using MetaMask signer:", await signer.getAddress());
      return new ethers.Contract(CONTRACT_ADDRESS, CredentialRegistry.abi, signer);
    } catch (err) {
      console.warn("⚠️ MetaMask error, falling back to read-only:", err.message);
    }
  }

  // Fallback to read-only provider
  try {
    provider = new ethers.JsonRpcProvider(RPC_URL);
    console.log("[Blockchain] Using read-only provider:", RPC_URL);
    return new ethers.Contract(CONTRACT_ADDRESS, CredentialRegistry.abi, provider);
  } catch (err) {
    console.error("❌ Failed to connect to blockchain provider:", err);
    throw err;
  }
};

/**
 * Returns a contract instance using a private key (for server-side or admin actions).
 */
export const getServerContract = () => {
  if (!PRIVATE_KEY) throw new Error("❌ Server PRIVATE_KEY not set in .env");

  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log("[Blockchain] Server contract access ready for address:", wallet.address);
    return new ethers.Contract(CONTRACT_ADDRESS, CredentialRegistry.abi, wallet);
  } catch (err) {
    console.error("❌ Server contract initialization failed:", err);
    throw err;
  }
};