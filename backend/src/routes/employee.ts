import express, { RequestHandler } from "express";
import {
    ethers,
    ContractTransactionResponse,
    ContractTransactionReceipt,
    type TransactionResponse,
} from "ethers";
import { Employee } from "../models/employee";
import { Training } from "../models/training";
import { ContractService, BlockchainEvent } from "../utils/contract";

const router = express.Router();
const contractService = new ContractService();

interface CreateEmployeeRequest {
    name: string;
    email: string;
    department: string;
    role: string;
}
interface AddMilestoneRequest {
    description: string;
}

interface TransactionResult {
    hash: string;
    blockNumber: number;
}

function getTxHash(
    tx: ContractTransactionResponse | ContractTransactionReceipt
) {
    return "hash" in tx && typeof tx.hash === "string" ? tx.hash : undefined;
}

async function getTransactionResult(
    tx: ContractTransactionResponse | ContractTransactionReceipt
): Promise<TransactionResult> {
    let receipt: ContractTransactionReceipt | null = null;
    if ("wait" in tx && typeof tx.wait === "function") {
        receipt = await tx.wait();
    } else {
        receipt = tx as ContractTransactionReceipt | null;
    }
    if (!receipt) throw new Error("Transaction failed");
    return {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
    };
}

contractService.setupEventListeners(async (event: BlockchainEvent) => {
    try {
        switch (event.type) {
            case "EmployeeRegistered":
                console.log("Processing EmployeeRegistered event");
                if (event.profileHash) {
                    console.log(
                        "Updating employee with hash:",
                        event.profileHash
                    );
                    const result = await Employee.findOneAndUpdate(
                        { profileHash: event.profileHash },
                        { blockchainVerified: true }
                    );
                    console.log("Update result:", result);
                }
                break;
            case "TrainingCompleted":
                if (event.trainingId) {
                    const employee = await Employee.findOne({
                        "trainings.trainingId": event.trainingId,
                    });
                    if (employee) {
                        await Employee.updateOne(
                            {
                                _id: employee._id,
                                "trainings.trainingId": event.trainingId,
                            },
                            { $set: { "trainings.$.blockchainVerified": true } }
                        );
                    }
                    console.log(
                        `Training completion verified: ${event.trainingId}`
                    );
                }
                break;
            case "MilestoneAchieved":
                if (event.milestoneId !== undefined) {
                    await Employee.updateOne(
                        { "milestones.id": event.milestoneId.toString() },
                        { $set: { "milestones.$.blockchainVerified": true } }
                    );
                    console.log(
                        `Milestone achievement verified: ${event.milestoneId}`
                    );
                }
                break;
        }
    } catch (error) {
        console.error("Error processing blockchain event:", error);
    }
});

const createEmployee: RequestHandler = async (req, res): Promise<void> => {
    let transactionHash: string | undefined = undefined;

    try {
        const { name, email, department, role } =
            req.body as CreateEmployeeRequest;

        if (!name || !email || !department || !role) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }

        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            res.status(400).json({ error: "Email already registered" });
            return;
        }

        const profileData = {
            name,
            email,
            department,
            role,
            timestamp: Date.now(),
        };
        const profileHash = ethers.id(JSON.stringify(profileData));
        console.log("Generated profileHash:", profileHash);

        const employee = new Employee({
            ...req.body,
            profileHash,
            blockchainVerified: true,
            joinDate: new Date(),
        });

        const savedEmployee = await employee.save();

        try {
            const transaction = await contractService.registerEmployee(
                profileHash
            );

            if (transaction && "hash" in transaction) {
                transactionHash = transaction.hash.toString();
            } else {
                throw new Error("Failed to create blockchain transaction");
            }

            res.status(201).json({
                employee: savedEmployee,
                transaction: { hash: transactionHash },
            });
        } catch (blockchainError) {
            await Employee.findByIdAndDelete(savedEmployee._id);
            throw blockchainError;
        }
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Unknown error",
            transactionHash,
        });
    }
};

const getEmployee: RequestHandler = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            res.status(404).json({ error: "Employee not found" });
            return;
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const addMilestone: RequestHandler = async (req, res) => {
    try {
        const { description } = req.body;
        if (!description) {
            res.status(400).json({ error: "Description is required" });
            return;
        }

        const tx = await contractService.addMilestone(description);
        if (!tx) throw new Error("Failed to create blockchain transaction");

        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    milestones: {
                        id: tx.hash,
                        description,
                        timestamp: new Date(),
                        verified: false,
                        blockchainVerified: false,
                    },
                },
            },
            { new: true }
        );

        if (!employee) {
            res.status(404).json({ error: "Employee not found" });
            return;
        }

        res.json({
            employee,
            transaction: {
                hash: tx.hash,
            },
        });
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const completeTraining: RequestHandler = async (req, res) => {
    let tx: ContractTransactionResponse | ContractTransactionReceipt | null =
        null;
    try {
        const training = await Training.findOne({
            trainingId: req.params.trainingId,
        });
        if (!training) {
            res.status(404).json({ error: "Training not found" });
            return;
        }
        if (training.deadline && training.deadline < new Date()) {
            res.status(400).json({ error: "Training deadline has passed" });
            return;
        }
        tx = await contractService.completeTraining(req.params.trainingId);
        if (!tx) throw new Error("Failed to create blockchain transaction");
        const result = await getTransactionResult(tx);
        const employee = await Employee.findOneAndUpdate(
            {
                _id: req.params.id,
                "trainings.trainingId": req.params.trainingId,
            },
            {
                $set: {
                    "trainings.$.status": "completed",
                    "trainings.$.completionDate": new Date(),
                    "trainings.$.blockchainVerified": false,
                },
            },
            { new: true }
        );
        if (!employee) throw new Error("Employee or training not found");
        res.json({ employee, transaction: result });
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unknown error",
            transactionHash: tx ? getTxHash(tx) : undefined,
        });
    }
};

const getEmployeeTrainings: RequestHandler = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).select(
            "trainings"
        );
        if (!employee) {
            res.status(404).json({ error: "Employee not found" });
            return;
        }
        res.json(employee.trainings);
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

const deactivateEmployee: RequestHandler = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            { $set: { isActive: false } },
            { new: true }
        );
        if (!employee) {
            res.status(404).json({ error: "Employee not found" });
            return;
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

router.post("/", createEmployee);
router.get("/:id", getEmployee);
router.post("/:id/milestone", addMilestone);
router.patch("/:id/complete-training/:trainingId", completeTraining);
router.get("/:id/trainings", getEmployeeTrainings);
router.patch("/:id/deactivate", deactivateEmployee);

export default router;
