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
import { authenticateToken } from "./middleware/auth";

dotenv.config();

export const app = express();
const port = process.env.PORT || 3001;

const initializeMongoDB = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("MongoDB connected successfully");

        mongoose.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
            process.exit(1);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
            process.exit(1);
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

const initializeBlockchain = () => {
    try {
        if (!process.env.RPC_URL || !process.env.PRIVATE_KEY) {
            throw new Error(
                "Missing RPC_URL or PRIVATE_KEY in environment variables"
            );
        }
        const provider = new JsonRpcProvider(process.env.RPC_URL);
        const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
        console.log("Wallet connected at:", wallet.address);
        return { provider, wallet };
    } catch (error) {
        console.error("Blockchain initialization failed:", error);
        process.exit(1);
    }
};

const configureExpress = (provider: JsonRpcProvider, wallet: Wallet) => {
    app.use(
        cors({
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            credentials: true,
        })
    );

    app.use(express.json());

    app.use("/api/auth", authRoutes);

    app.get("/api/health", (_req, res) => {
        res.json({
            status: "ok",
            timestamp: new Date().toISOString(),
            mongodb:
                mongoose.connection.readyState === 1
                    ? "connected"
                    : "disconnected",
        });
    });

    app.use(
        [
            "/api/employee",
            "/api/email",
            "/api/test",
            "/api/chain-info",
            "/api/wallet-info",
        ],
        authenticateToken
    );

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
};

const configureShutdown = (server: any) => {
    const shutdown = async () => {
        console.log("Initiating graceful shutdown...");

        reminderService.stop();
        console.log("Reminder service stopped");

        server.close(() => {
            console.log("HTTP server closed");
        });

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
};

const startServer = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is required in environment variables");
        }

        await initializeMongoDB();

        const { provider, wallet } = initializeBlockchain();

        configureExpress(provider, wallet);

        await reminderService.start();
        console.log("Reminder service started");

        const server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

        configureShutdown(server);

        return server;
    } catch (error) {
        console.error("Server startup failed:", error);
        process.exit(1);
    }
};

export default startServer();
