import express from "express";
import { ethers } from "ethers";
import { Employee } from "../models/employee";
import { Training } from "../models/training";
import { ContractService } from "../utils/contract";

const router = express.Router();
const contractService = new ContractService();

contractService.setupEventListeners(async (event) => {
    switch (event.type) {
        case "EmployeeRegistered":
            await Employee.findOneAndUpdate(
                { wallet: event.wallet },
                { $set: { blockchainVerified: true } }
            );
            break;
        case "TrainingCompleted":
            await Employee.findOneAndUpdate(
                {
                    wallet: event.employee,
                    "trainings.trainingId": event.trainingId,
                },
                {
                    $set: {
                        "trainings.$.blockchainVerified": true,
                        "trainings.$.status": "completed",
                        "trainings.$.completionDate": new Date(),
                    },
                }
            );
            break;
    }
});

router.post("/register", async (req, res) => {
    try {
        const employee = new Employee(req.body);
        const saved = await employee.save();

        const profileHash = ethers.id(
            JSON.stringify({
                name: req.body.name,
                email: req.body.email,
                department: req.body.department,
            })
        );

        await contractService.registerEmployee(req.body.wallet, profileHash);
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.get("/:wallet", (req, res) => {
    Employee.findOne({ wallet: req.params.wallet })
        .then((employee) => {
            if (!employee)
                return res.status(404).json({ error: "Employee not found" });
            res.json(employee);
        })
        .catch((error) => res.status(500).json({ error: error.message }));
});

router.post("/:wallet/milestone", async (req, res) => {
    try {
        const { description } = req.body;
        const receipt = await contractService.addMilestone(
            req.params.wallet,
            description
        );

        const employee = await Employee.findOneAndUpdate(
            { wallet: req.params.wallet },
            {
                $push: {
                    milestones: {
                        description,
                        timestamp: new Date(),
                        verified: false,
                        blockchainVerified: false,
                    },
                },
            },
            { new: true }
        );

        if (!employee) throw new Error("Employee not found");
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.post("/:wallet/assign-training", (req, res) => {
    const { trainingId } = req.body;
    let foundTraining: any = null;

    Training.findOne({ trainingId })
        .then((training) => {
            if (!training) {
                res.status(404).json({ error: "Training not found" });
                return;
            }
            foundTraining = training;
            return Employee.findOneAndUpdate(
                { wallet: req.params.wallet },
                {
                    $push: {
                        trainings: {
                            trainingId: training.trainingId,
                            name: training.name,
                            deadline: training.deadline,
                            status: "pending",
                            blockchainVerified: false,
                        },
                    },
                },
                { new: true }
            );
        })
        .then((employee) => {
            if (!foundTraining) return;
            if (!employee)
                return res.status(404).json({ error: "Employee not found" });
            res.json(employee);
        })
        .catch((error) => res.status(500).json({ error: error.message }));
});

router.patch("/:wallet/complete-training/:trainingId", async (req, res) => {
    try {
        await contractService.completeTraining(
            req.params.wallet,
            req.params.trainingId
        );

        const employee = await Employee.findOneAndUpdate(
            {
                wallet: req.params.wallet,
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
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.get("/:wallet/trainings", (req, res) => {
    Employee.findOne({ wallet: req.params.wallet })
        .select("trainings")
        .then((employee) => {
            if (!employee)
                return res.status(404).json({ error: "Employee not found" });
            res.json(employee.trainings);
        })
        .catch((error) => res.status(500).json({ error: error.message }));
});

export default router;
