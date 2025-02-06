import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
    solidity: "0.8.19",
    networks: {
        mantaSepolia: {
            url: "https://pacific-rpc.sepolia-testnet.manta.network/http",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 3441006,
            gasPrice: "auto",
            gas: "auto",
            timeout: 20000,
        },
    },
    paths: {
        sources: "./contracts",
        artifacts: "./artifacts",
    },
};

export default config;
