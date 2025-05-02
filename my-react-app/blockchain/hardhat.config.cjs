
require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://mainnet.infura.io/v3/0ff77e19cff941d49e269e238907dd71`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};