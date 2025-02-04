import express from "express";
import { Employee } from "../models/employee";
import { Training } from "../models/training";

const router = express.Router();

router.post("/register", (req, res) => {
    const employee = new Employee(req.body);
    employee
        .save()
        .then((result) => res.status(201).json(result))
        .catch((error) => res.status(400).json({ error: error.message }));
});

router.get("/:wallet", (req, res) => {
    Employee.findOne({ wallet: req.params.wallet })
        .then((employee) => {
            if (!employee) {
                return res.status(404).json({ error: "Employee not found" });
            }
            res.json(employee);
        })
        .catch((error) => res.status(500).json({ error: error.message }));
});

router.post("/:wallet/milestone", (req, res) => {
    const { id, description } = req.body;

    Employee.findOneAndUpdate(
        { wallet: req.params.wallet },
        {
            $push: {
                milestones: {
                    id,
                    description,
                    timestamp: new Date(),
                    verified: false,
                },
            },
        },
        { new: true }
    )
        .then((employee) => {
            if (!employee) {
                return res.status(404).json({ error: "Employee not found" });
            }
            res.json(employee);
        })
        .catch((error) => res.status(500).json({ error: error.message }));
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
                        },
                    },
                },
                { new: true }
            );
        })
        .then((employee) => {
            if (!foundTraining) return;
            if (!employee) {
                return res.status(404).json({ error: "Employee not found" });
            }
            res.json(employee);
        })
        .catch((error) => res.status(500).json({ error: error.message }));
});

router.patch("/:wallet/complete-training/:trainingId", (req, res) => {
    Employee.findOneAndUpdate(
        {
            wallet: req.params.wallet,
            "trainings.trainingId": req.params.trainingId,
        },
        {
            $set: {
                "trainings.$.status": "completed",
                "trainings.$.completionDate": new Date(),
            },
        },
        { new: true }
    )
        .then((employee) => {
            if (!employee) {
                return res
                    .status(404)
                    .json({ error: "Employee or training not found" });
            }
            res.json(employee);
        })
        .catch((error) => res.status(500).json({ error: error.message }));
});

router.get("/:wallet/trainings", (req, res) => {
    Employee.findOne({ wallet: req.params.wallet })
        .select("trainings")
        .then((employee) => {
            if (!employee) {
                return res.status(404).json({ error: "Employee not found" });
            }
            res.json(employee.trainings);
        })
        .catch((error) => res.status(500).json({ error: error.message }));
});

export default router;
