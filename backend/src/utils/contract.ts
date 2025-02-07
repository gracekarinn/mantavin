import { ethers } from "ethers";
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
            this.provider = new ethers.WebSocketProvider(this.wsUrl);
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
                ws.on("close", async () => {
                    console.log(
                        "WebSocket connection closed. Attempting to reconnect..."
                    );
                    await this.reconnect();
                });
            }
        } catch (error) {
            console.error("Provider initialization failed:", error);
            await this.reconnect();
        }
    }

    private async reconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error("Max reconnection attempts reached");
            return;
        }
        this.reconnectAttempts++;
        await new Promise((resolve) =>
            setTimeout(resolve, 1000 * this.reconnectAttempts)
        );
        await this.initializeProvider();
    }

    public getContract() {
        return this.contract;
    }

    async registerEmployee(profileHash: string) {
        const tx = await this.contract.registerEmployee(profileHash);
        return await tx.wait();
    }

    async createTraining(
        id: string,
        name: string,
        deadline: number,
        mandatory: boolean
    ) {
        const trainingId = ethers.id(id);
        const tx = await this.contract.createTraining(
            trainingId,
            name,
            deadline,
            mandatory
        );
        return await tx.wait();
    }

    async completeTraining(trainingId: string) {
        const encodedId = ethers.id(trainingId);
        const tx = await this.contract.completeTraining(encodedId);
        return await tx.wait();
    }

    async addMilestone(description: string) {
        const tx = await this.contract.addMilestone(description);
        return await tx.wait();
    }

    async setupEventListeners(callback: (event: BlockchainEvent) => void) {
        this.removeEventListeners();

        this.contract.on(
            "EmployeeRegistered",
            (profileHash: string, event: any) => {
                callback({
                    type: "EmployeeRegistered",
                    profileHash,
                    event,
                });
            }
        );

        this.contract.on(
            "TrainingCompleted",
            (trainingId: string, event: any) => {
                callback({
                    type: "TrainingCompleted",
                    trainingId,
                    event,
                });
            }
        );

        this.contract.on(
            "MilestoneAchieved",
            (milestoneId: bigint, event: any) => {
                callback({
                    type: "MilestoneAchieved",
                    milestoneId,
                    event,
                });
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
                callback({
                    type: "TrainingCreated",
                    trainingId: id,
                    event,
                });
            }
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
            } catch (e) {
                // Ignore errors during cleanup.
            }
        }
    }
}
