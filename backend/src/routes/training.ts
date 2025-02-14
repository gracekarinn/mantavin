import express, { Request, Response } from "express";
import { ethers } from "ethers";
import { Training, ITraining } from "../models/training";
import { ContractService } from "../utils/contract";
import mongoose from "mongoose";
import { RequestHandler } from "express";
import { Employee } from "../models/employee";

interface TrainingParams {
    id?: string;
    dept?: string;
}

const router = express.Router();
const contractService = new ContractService();
const contract = contractService.getContract();

router.get("/verify", async (req, res): Promise<void> => {
    try {
        const { certificate, email } = req.query;

        const certificateStr = certificate as string;
        const emailStr = email as string;

        if (!certificateStr && !emailStr) {
            res.status(400).json({
                error: "Either certificate number or email is required",
            });
            return;
        }

        if (certificateStr) {
            const training = await Training.findOne({
                trainingId: certificateStr,
            });
            if (training) {
                const employee = await Employee.findOne({
                    "trainings.trainingId": certificateStr,
                });

                if (!employee) {
                    res.status(404).json({
                        error: "No employee found for this training",
                    });
                    return;
                }

                const employeeTraining = employee.trainings?.find(
                    (t) => t.trainingId === certificateStr
                );

                res.json({
                    type: "training",
                    blockNumber: training.blockNumber,
                    transactionHash: certificateStr,
                    description: training.description || training.name,
                    timestamp: employeeTraining?.completionDate,
                    verified:
                        training.blockchainVerified ||
                        employeeTraining?.blockchainVerified ||
                        false,
                    employeeName: employee.name,
                    department: employee.department,
                    status: employeeTraining?.status || "pending",
                    mandatory: training.mandatory,
                    deadline: training.deadline,
                });
                return;
            }
        }

        let query = emailStr
            ? { email: emailStr }
            : { "milestones.id": certificateStr };

        const employee = await Employee.findOne(query);

        if (!employee) {
            res.status(404).json({
                error: "No records found",
            });
            return;
        }

        let milestone;
        if (certificateStr) {
            milestone = employee.milestones?.find(
                (m) => m.id === certificateStr
            );
        } else {
            milestone = employee.milestones?.[employee.milestones.length - 1];
        }

        if (!milestone) {
            res.status(404).json({
                error: "No verification record found",
            });
            return;
        }

        res.json({
            type: "milestone",
            blockNumber: milestone.blockNumber,
            transactionHash: milestone.id,
            description: milestone.description,
            timestamp: milestone.timestamp,
            verified: milestone.blockchainVerified,
            employeeName: employee.name,
            department: employee.department,
            verifiedBy: milestone.verifiedBy,
        });
    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
    try {
        const training = new Training(req.body);
        const saved = (await training.save()) as ITraining;
        await contractService.createTraining(
            saved._id.toString(),
            saved.name,
            Math.floor(saved.deadline.getTime() / 1000),
            saved.mandatory
        );
        res.status(201).json(saved);
        return;
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
        return;
    }
});

router.get(
    "/department/:dept",
    async (req: Request<TrainingParams>, res: Response): Promise<void> => {
        try {
            const trainings = await Training.find({
                department: req.params.dept,
            });
            res.json(trainings);
            return;
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
            return;
        }
    }
);

router.get(
    "/:id",
    async (req: Request<TrainingParams>, res: Response): Promise<void> => {
        try {
            const training = (await Training.findById(
                req.params.id
            )) as ITraining;
            if (!training) {
                res.status(404).json({ error: "Training not found" });
                return;
            }

            const trainingId = ethers.id(training._id.toString());
            const onChainTraining = await contract.trainings(trainingId);

            res.json({
                ...training.toObject(),
                blockchain: {
                    id: onChainTraining.id,
                    name: onChainTraining.name,
                    deadline: Number(onChainTraining.deadline),
                    mandatory: onChainTraining.mandatory,
                },
            });
            return;
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
            return;
        }
    }
);

router.patch("/:id", async (req: Request<TrainingParams>, res: Response) => {
    try {
        if (req.body.department && !Array.isArray(req.body.department)) {
            req.body.department = [req.body.department];
        }

        const session = await mongoose.startSession();
        await session.withTransaction(async () => {
            const training = await Training.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, session }
            );
            if (!training) {
                throw new Error("Training not found");
            }

            if (req.body.name || req.body.deadline || req.body.mandatory) {
                await contractService.createTraining(
                    training._id.toString(),
                    training.name,
                    Math.floor(training.deadline.getTime() / 1000),
                    training.mandatory
                );
            }
            res.json(training);
        });
        await session.endSession();
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default router;
