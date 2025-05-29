require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { PRIVATE_KEY } = process.env;

if (!PRIVATE_KEY) {
  console.warn("⚠️ Missing PRIVATE_KEY in .env file");
}

module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/0ff77e19cff941d49e269e238907dd71",
      accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [],
    },
  },
};