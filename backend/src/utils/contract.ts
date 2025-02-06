import { ethers } from "ethers";
import type { EmployeeManagement } from "../../typechain-types";
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
    private contract: ethers.Contract & EmployeeManagement;
    private provider: ethers.JsonRpcProvider;
    private signer: ethers.Wallet;

    constructor() {
        if (!process.env.MANTA_RPC_URL) throw new Error("Missing RPC URL");
        if (!process.env.PRIVATE_KEY) throw new Error("Missing private key");
        if (!process.env.CONTRACT_ADDRESS)
            throw new Error("Missing contract address");

        this.provider = new ethers.JsonRpcProvider(process.env.MANTA_RPC_URL);
        this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);

        const {
            abi,
        } = require("../../artifacts/contracts/EmployeeManagement.sol/EmployeeManagement.json");

        this.contract = new ethers.Contract(
            process.env.CONTRACT_ADDRESS,
            abi,
            this.signer
        ) as ethers.Contract & EmployeeManagement;
    }

    public getContract() {
        return this.contract;
    }

    async registerEmployee(wallet: string, profileHash: string) {
        const tx = await this.contract.registerEmployee(wallet, profileHash);
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

    async completeTraining(wallet: string, trainingId: string) {
        const encodedId = ethers.id(trainingId);
        const tx = await this.contract.completeTraining(encodedId);
        return await tx.wait();
    }

    async addMilestone(wallet: string, description: string) {
        const tx = await this.contract.addMilestone(description);
        return await tx.wait();
    }

    async setupEventListeners(callback: (event: BlockchainEvent) => void) {
        this.contract.on("EmployeeRegistered", (wallet, profileHash, event) => {
            callback({
                type: "EmployeeRegistered",
                wallet,
                profileHash,
                event,
            });
        });

        this.contract.on("TrainingCompleted", (employee, trainingId, event) => {
            callback({
                type: "TrainingCompleted",
                employee,
                trainingId,
                event,
            });
        });

        this.contract.on(
            "MilestoneAchieved",
            (employee, milestoneId, event) => {
                callback({
                    type: "MilestoneAchieved",
                    employee,
                    milestoneId,
                    event,
                });
            }
        );

        this.contract.on(
            "TrainingCreated",
            (id, name, deadline, mandatory, event) => {
                callback({ type: "TrainingCreated", trainingId: id, event });
            }
        );
    }
}
