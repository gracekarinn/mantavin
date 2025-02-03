import express, { Request, Response } from "express";
import cors from "cors";
import { JsonRpcProvider } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

const provider = new JsonRpcProvider(process.env.RPC_URL);

app.get("/api/test", async (_req: Request, res: Response) => {
    try {
        const blockNumber = await provider.getBlockNumber();
        res.json({ blockNumber });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
