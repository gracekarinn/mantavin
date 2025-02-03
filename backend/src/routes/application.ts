import express, { Request, Response } from "express";
import Application from "../models/Application";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const application = new Application(req.body);
        await application.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.get("/", async (_req: Request, res: Response) => {
    try {
        const applications = await Application.find();
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.patch("/:id/status", async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(application);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

export default router;
