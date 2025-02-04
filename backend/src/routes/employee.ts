import express from "express";
import { Employee } from "../models/employee";

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

export default router;
