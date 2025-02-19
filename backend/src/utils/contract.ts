import {
    ethers,
    TransactionResponse,
    ContractTransactionResponse,
} from "ethers";
import type { EmployeeManagement } from "../../typechain-types";
import dotenv from "dotenv";
dotenv.config();

export interface BlockchainEvent {
    type:
        | "EmployeeRegistered"
        | "TrainingCompleted"
        | "MilestoneAchieved"
        | "TrainingCreated";
    wallet?: string;
    employee?: string;
    profileHash?: string;
    trainingId?: string;
    milestoneId?: bigint;
    event: any;
}

export class ContractService {
    private provider!: ethers.WebSocketProvider;
    private contract!: ethers.Contract & EmployeeManagement;
    private signer!: ethers.Wallet;
    private eventNames = [
        "EmployeeRegistered",
        "TrainingCompleted",
        "MilestoneAchieved",
        "TrainingCreated",
    ];
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private wsUrl: string;

    constructor() {
        if (!process.env.WS_URL) throw new Error("Missing WebSocket URL");
        if (!process.env.PRIVATE_KEY) throw new Error("Missing private key");
        if (!process.env.CONTRACT_ADDRESS)
            throw new Error("Missing contract address");
        this.wsUrl = process.env.WS_URL;
        this.initializeProvider();
    }

    private async initializeProvider() {
        try {
            console.log("Initializing WebSocket provider...");
            this.provider = new ethers.WebSocketProvider(this.wsUrl);
            this.provider.on("error", (error) => {
                console.error("WebSocket provider error:", error);
            });
            this.signer = new ethers.Wallet(
                process.env.PRIVATE_KEY!,
                this.provider
            );
            const {
                abi,
            } = require("../../artifacts/contracts/EmployeeManagement.sol/EmployeeManagement.json");
            this.contract = new ethers.Contract(
                process.env.CONTRACT_ADDRESS!,
                abi,
                this.signer
            ) as ethers.Contract & EmployeeManagement;
            const ws = (this.provider as any)._websocket;
            if (ws) {
                console.log("WebSocket state:", ws.readyState);

                ws.on("open", () => {
                    console.log("WebSocket connection opened");
                });

                ws.on("close", async () => {
                    console.log("WebSocket connection closed");
                    await this.reconnect();
                });

                ws.on("error", (error: any) => {
                    console.error("WebSocket error:", error);
                });
            }

            const network = await this.provider.getNetwork();
            console.log("Connected to network:", {
                name: network.name,
                chainId: network.chainId,
            });

            const contractAddress = await this.contract.getAddress();
            console.log("Contract connected at:", contractAddress);
        } catch (error) {
            await this.reconnect();
        }
    }

    private async reconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
        this.reconnectAttempts++;
        await new Promise((resolve) =>
            setTimeout(resolve, 1000 * this.reconnectAttempts)
        );
        await this.initializeProvider();
    }

    public getContract() {
        return this.contract;
    }

    async registerEmployee(profileHash: string): Promise<TransactionResponse> {
        console.log("Getting fee data...");
        const gasPrice = await this.provider.getFeeData();

        const maxFeePerGas = gasPrice.maxFeePerGas
            ? (gasPrice.maxFeePerGas * BigInt(15)) / BigInt(10)
            : undefined;
        const maxPriorityFeePerGas = gasPrice.maxPriorityFeePerGas
            ? (gasPrice.maxPriorityFeePerGas * BigInt(15)) / BigInt(10)
            : undefined;

        console.log("Current network status:", {
            baseFee: gasPrice.gasPrice?.toString(),
            proposedMaxFee: maxFeePerGas?.toString(),
            proposedPriorityFee: maxPriorityFeePerGas?.toString(),
        });

        const nonce = await this.signer.getNonce();
        console.log("Using nonce:", nonce);

        const tx = await this.contract.registerEmployee(profileHash, {
            maxFeePerGas,
            maxPriorityFeePerGas,
            gasLimit: 500000,
            nonce,
        });

        console.log("Transaction details:", {
            hash: tx.hash,
            nonce: tx.nonce,
            maxFeePerGas: tx.maxFeePerGas?.toString(),
            maxPriorityFeePerGas: tx.maxPriorityFeePerGas?.toString(),
            gasLimit: tx.gasLimit.toString(),
        });

        return tx;
    }

    async checkTransactionStatus(txHash: string) {
        try {
            const tx = await this.provider.getTransaction(txHash);
            if (!tx) return { status: "not-found" };

            console.log("Transaction status:", {
                hash: tx.hash,
                blockNumber: tx.blockNumber,
                confirmations: tx.confirmations,
            });

            if (tx.blockNumber) {
                const receipt = await this.provider.getTransactionReceipt(
                    txHash
                );
                return {
                    status: "confirmed",
                    blockNumber: tx.blockNumber,
                    confirmations: tx.confirmations,
                    success: receipt?.status === 1,
                };
            }

            return { status: "pending" };
        } catch (error) {
            console.error("Error checking transaction status:", error);
            return { status: "error", error };
        }
    }

    async createTraining(
        id: string,
        name: string,
        deadline: number,
        mandatory: boolean
    ) {
        const trainingId = ethers.id(id);
        const gasPrice = await this.provider.getFeeData();
        const maxFeePerGas = gasPrice.maxFeePerGas
            ? (gasPrice.maxFeePerGas * BigInt(12)) / BigInt(10)
            : undefined;
        const maxPriorityFeePerGas = gasPrice.maxPriorityFeePerGas
            ? (gasPrice.maxPriorityFeePerGas * BigInt(12)) / BigInt(10)
            : undefined;
        return this.contract.createTraining(
            trainingId,
            name,
            deadline,
            mandatory,
            { maxFeePerGas, maxPriorityFeePerGas, gasLimit: 300000 }
        );
    }

    async completeTraining(trainingId: string) {
        const encodedId = ethers.id(trainingId);
        const gasPrice = await this.provider.getFeeData();
        const maxFeePerGas = gasPrice.maxFeePerGas
            ? (gasPrice.maxFeePerGas * BigInt(12)) / BigInt(10)
            : undefined;
        const maxPriorityFeePerGas = gasPrice.maxPriorityFeePerGas
            ? (gasPrice.maxPriorityFeePerGas * BigInt(12)) / BigInt(10)
            : undefined;
        const tx = await this.contract.completeTraining(encodedId, {
            maxFeePerGas,
            maxPriorityFeePerGas,
            gasLimit: 500000,
        });
        return await tx.wait();
    }

    async addMilestone(description: string) {
        const gasPrice = await this.provider.getFeeData();
        const maxFeePerGas = gasPrice.maxFeePerGas
            ? (gasPrice.maxFeePerGas * BigInt(12)) / BigInt(10)
            : undefined;
        const maxPriorityFeePerGas = gasPrice.maxPriorityFeePerGas
            ? (gasPrice.maxPriorityFeePerGas * BigInt(12)) / BigInt(10)
            : undefined;
        return this.contract.addMilestone(description, {
            maxFeePerGas,
            maxPriorityFeePerGas,
            gasLimit: 300000,
        });
    }

    async setupEventListeners(callback: (event: BlockchainEvent) => void) {
        console.log("Setting up event listeners...");
        this.removeEventListeners();
        this.contract.on("*", (event: any) => {
            console.log("Raw contract event received:", {
                eventName: event.eventName,
                args: event.args,
                transactionHash: event.transactionHash,
            });
        });

        this.contract.on(
            "EmployeeRegistered",
            (profileHash: string, event: any) => {
                console.log("EmployeeRegistered event received:", {
                    profileHash,
                    transactionHash: event.transactionHash,
                    blockNumber: event.blockNumber,
                });
                callback({ type: "EmployeeRegistered", profileHash, event });
            }
        );
        this.contract.on(
            "MilestoneAchieved",
            (milestoneId: bigint, event: any) => {
                callback({ type: "MilestoneAchieved", milestoneId, event });
            }
        );
        this.contract.on(
            "TrainingCreated",
            (
                id: string,
                name: string,
                deadline: number,
                mandatory: boolean,
                event: any
            ) => {
                callback({ type: "TrainingCreated", trainingId: id, event });
            }
        );
        const listeners = await this.contract.listeners("EmployeeRegistered");
        console.log(
            "Number of EmployeeRegistered listeners:",
            listeners.length
        );
    }

    public removeEventListeners() {
        this.eventNames.forEach((eventName) => {
            this.contract.removeAllListeners(eventName);
        });
    }

    public cleanup() {
        this.removeEventListeners();
        if (this.provider && typeof this.provider.destroy === "function") {
            try {
                this.provider.destroy();
            } catch (e) {}
        }
    }
}
