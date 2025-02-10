import express, { Request, Response } from "express";
import cors from "cors";
import { JsonRpcProvider, Wallet } from "ethers";
import dotenv from "dotenv";
import mongoose from "mongoose";
import employeeRoutes from "./routes/employee";
import trainingRoutes from "./routes/training";
import { router as emailRoutes } from "./routes/email";
import { reminderService } from "./services/reminder";
import authRoutes from "./routes/auth";

dotenv.config();

export const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const provider = new JsonRpcProvider(process.env.RPC_URL);
const wallet = new Wallet(process.env.PRIVATE_KEY as string, provider);
console.log("Wallet address:", wallet.address);

mongoose
    .connect(process.env.MONGODB_URI as string)
    .then(() => {
        console.log("MongoDB connected");
        return reminderService.start();
    })
    .then(() => {
        console.log("Reminder service started");
    })
    .catch((error: any) => console.error("Startup error:", error));

app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/email", emailRoutes);

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

app.get("/api/wallet-info", async (_req: Request, res: Response) => {
    try {
        const balance = await provider.getBalance(wallet.address);
        res.json({
            address: wallet.address,
            balance: balance.toString(),
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

const shutdown = async () => {
    console.log("Shutting down bubub");

    reminderService.stop();

    try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed");
    } catch (error) {
        console.error("Error closing MongoDB connection:", error);
    }

    process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default server;
