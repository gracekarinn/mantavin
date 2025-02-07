import express, { Request, Response } from "express";
import { ethers } from "ethers";
import { Training, ITraining } from "../models/training";
import { ContractService } from "../utils/contract";
import mongoose from "mongoose";

interface TrainingParams {
    id?: string;
    dept?: string;
}

const router = express.Router();
const contractService = new ContractService();
const contract = contractService.getContract();

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
    "/:id",
    async (req: Request<TrainingParams>, res: Response): Promise<void> => {
        try {
            const training = await Training.findById(req.params.id);
            if (!training) {
                res.status(404).json({ error: "Training not found" });
                return;
            }

            res.json(training);
            return;
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
            return;
        }
    }
);

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
