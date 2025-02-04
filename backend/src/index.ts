import express, { Request, Response } from "express";
import cors from "cors";
import { JsonRpcProvider } from "ethers";
import dotenv from "dotenv";
import mongoose from "mongoose";
import employeeRoutes from "./routes/employee";
import trainingRoutes from "./routes/training";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const provider = new JsonRpcProvider(process.env.RPC_URL);

mongoose
    .connect(process.env.MONGODB_URI as string)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => console.error("MongoDB connection error:", error));

app.use("/api/employee", employeeRoutes);
app.use("/api/training", trainingRoutes);

app.get("/api/test", async (_req: Request, res: Response) => {
    try {
        const blockNumber = await provider.getBlockNumber();
        res.json({ blockNumber });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

app.get("/api/chain-info", async (_req: Request, res: Response) => {
    try {
        const [blockNumber, network] = await Promise.all([
            provider.getBlockNumber(),
            provider.getNetwork(),
        ]);

        res.json({
            blockNumber: Number(blockNumber),
            chainId: Number(network.chainId),
            name: network.name,
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
