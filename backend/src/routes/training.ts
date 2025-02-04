import express from "express";
import { Training } from "../models/training";

const router = express.Router();

router.post("/", (req, res) => {
    const training = new Training(req.body);
    training
        .save()
        .then((result) => res.status(201).json(result))
        .catch((error) => res.status(400).json({ error: error.message }));
});

router.get("/", (req, res) => {
    Training.find()
        .then((trainings) => res.json(trainings))
        .catch((error) => res.status(500).json({ error: error.message }));
});

router.get("/department/:dept", (req, res) => {
    Training.find({ department: req.params.dept })
        .then((trainings) => res.json(trainings))
        .catch((error) => res.status(500).json({ error: error.message }));
});

router.get("/:id", (req, res) => {
    Training.findById(req.params.id)
        .then((training) => {
            if (!training) {
                return res.status(404).json({ error: "Training not found" });
            }
            res.json(training);
        })
        .catch((error) => res.status(500).json({ error: error.message }));
});

router.patch("/:id", (req, res) => {
    Training.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((training) => {
            if (!training) {
                return res.status(404).json({ error: "Training not found" });
            }
            res.json(training);
        })
        .catch((error) => res.status(400).json({ error: error.message }));
});

export default router;
